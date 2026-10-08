import { Country, Product, PricingRule } from '../types';

export interface CalculationResult {
  chargeableWeight: number;
  actualWeight: number;
  volumetricWeight?: number;
  basePrice: number;
  additionalCost: number;
  totalPrice: number;
  currency: string;
  currencySymbol: string;
  matchedRuleType: 'slabs' | 'base_plus_additional' | 'country_default' | 'none';
  breakdown: string[];
  isAvailable: boolean;
  unavailableReason?: string;
}

export function calculateShippingPrice({
  country,
  product,
  weight,
  quantity = 1,
  pricingRules,
  lengthCm,
  widthCm,
  heightCm,
  currencySymbol = '৳',
}: {
  country?: Country | null;
  product?: Product | null;
  weight: number;
  quantity?: number;
  pricingRules: PricingRule[];
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  currencySymbol?: string;
}): CalculationResult {
  if (!country) {
    return {
      chargeableWeight: 0,
      actualWeight: 0,
      basePrice: 0,
      additionalCost: 0,
      totalPrice: 0,
      currency: 'BDT',
      currencySymbol,
      matchedRuleType: 'none',
      breakdown: [],
      isAvailable: false,
      unavailableReason: 'Please select a destination country.',
    };
  }

  if (country.status !== 'active') {
    return {
      chargeableWeight: 0,
      actualWeight: 0,
      basePrice: 0,
      additionalCost: 0,
      totalPrice: 0,
      currency: 'BDT',
      currencySymbol,
      matchedRuleType: 'none',
      breakdown: [],
      isAvailable: false,
      unavailableReason: `Shipping to ${country.name} is currently suspended. Please contact customer service.`,
    };
  }

  if (!product) {
    return {
      chargeableWeight: 0,
      actualWeight: 0,
      basePrice: 0,
      additionalCost: 0,
      totalPrice: 0,
      currency: 'BDT',
      currencySymbol,
      matchedRuleType: 'none',
      breakdown: [],
      isAvailable: false,
      unavailableReason: 'Please select a product type.',
    };
  }

  // Check country availability for this product
  if (country.availableProductIds && country.availableProductIds.length > 0) {
    if (!country.availableProductIds.includes(product.id)) {
      return {
        chargeableWeight: 0,
        actualWeight: 0,
        basePrice: 0,
        additionalCost: 0,
        totalPrice: 0,
        currency: 'BDT',
        currencySymbol,
        matchedRuleType: 'none',
        breakdown: [],
        isAvailable: false,
        unavailableReason: `${product.name} is restricted or not permitted for shipping to ${country.name}.`,
      };
    }
  }

  // Calculate volumetric weight if dimensions given
  let volumetricWeight: number | undefined = undefined;
  if (lengthCm && widthCm && heightCm && lengthCm > 0 && widthCm > 0 && heightCm > 0) {
    volumetricWeight = Math.round(((lengthCm * widthCm * heightCm) / 5000) * 100) / 100;
  }

  const effectiveWeightPerUnit = volumetricWeight && volumetricWeight > weight ? volumetricWeight : weight;
  const totalChargeableWeight = Math.max(0.5, Math.ceil(effectiveWeightPerUnit * (quantity || 1) * 2) / 2); // rounded to nearest 0.5kg
  const actualTotalWeight = weight * (quantity || 1);

  // Check product max weight
  if (product.maxWeight && actualTotalWeight > product.maxWeight) {
    return {
      chargeableWeight: totalChargeableWeight,
      actualWeight: actualTotalWeight,
      volumetricWeight,
      basePrice: 0,
      additionalCost: 0,
      totalPrice: 0,
      currency: 'BDT',
      currencySymbol,
      matchedRuleType: 'none',
      breakdown: [],
      isAvailable: false,
      unavailableReason: `Maximum weight for ${product.name} is ${product.maxWeight} KG. Please split shipment or contact commercial cargo.`,
    };
  }

  // Find exact Country + Product pricing rule
  const matchedRule = pricingRules.find(
    (rule) =>
      rule.status === 'active' &&
      rule.countryId === country.id &&
      rule.productId === product.id
  );

  const breakdown: string[] = [];

  if (matchedRule) {
    if (matchedRule.pricingType === 'slabs' && matchedRule.slabs && matchedRule.slabs.length > 0) {
      // Find matching slab
      const sortedSlabs = [...matchedRule.slabs].sort((a, b) => a.minKg - b.minKg);
      
      // Match if within slab range or <= first slab maxKg
      let slab = sortedSlabs.find(
        (s) => totalChargeableWeight > s.minKg && totalChargeableWeight <= s.maxKg
      );

      // If weight is less than or equal to first slab's max weight, use first slab
      if (!slab && totalChargeableWeight <= sortedSlabs[0].maxKg) {
        slab = sortedSlabs[0];
      }

      if (slab) {
        breakdown.push(`Weight slab applied: ${slab.minKg}-${slab.maxKg} KG = ${currencySymbol}${slab.price.toLocaleString()}`);
        return {
          chargeableWeight: totalChargeableWeight,
          actualWeight: actualTotalWeight,
          volumetricWeight,
          basePrice: slab.price,
          additionalCost: 0,
          totalPrice: slab.price,
          currency: 'BDT',
          currencySymbol,
          matchedRuleType: 'slabs',
          breakdown,
          isAvailable: true,
        };
      } else {
        // Fallback if weight exceeds maximum slab: use highest slab + incremental
        const highestSlab = sortedSlabs[sortedSlabs.length - 1];
        if (totalChargeableWeight > highestSlab.maxKg) {
          const excessKg = Math.ceil(totalChargeableWeight - highestSlab.maxKg);
          const addCost = excessKg * (country.additionalKgPrice || 700);
          const total = highestSlab.price + addCost;
          breakdown.push(`Base slab (${highestSlab.minKg}-${highestSlab.maxKg} KG): ${currencySymbol}${highestSlab.price.toLocaleString()}`);
          breakdown.push(`Excess ${excessKg} KG @ ${currencySymbol}${country.additionalKgPrice || 700}/KG: ${currencySymbol}${addCost.toLocaleString()}`);
          return {
            chargeableWeight: totalChargeableWeight,
            actualWeight: actualTotalWeight,
            volumetricWeight,
            basePrice: highestSlab.price,
            additionalCost: addCost,
            totalPrice: total,
            currency: 'BDT',
            currencySymbol,
            matchedRuleType: 'slabs',
            breakdown,
            isAvailable: true,
          };
        }
      }
    } else if (matchedRule.pricingType === 'base_plus_additional') {
      const baseKg = matchedRule.baseKg || 1;
      const basePrice = matchedRule.basePrice || country.basePrice;
      const additionalKgPrice = matchedRule.additionalKgPrice || country.additionalKgPrice;

      if (totalChargeableWeight <= baseKg) {
        breakdown.push(`First ${baseKg} KG base rate: ${currencySymbol}${basePrice.toLocaleString()}`);
        return {
          chargeableWeight: totalChargeableWeight,
          actualWeight: actualTotalWeight,
          volumetricWeight,
          basePrice,
          additionalCost: 0,
          totalPrice: basePrice,
          currency: 'BDT',
          currencySymbol,
          matchedRuleType: 'base_plus_additional',
          breakdown,
          isAvailable: true,
        };
      } else {
        const extraWeight = totalChargeableWeight - baseKg;
        const additionalCost = Math.ceil(extraWeight) * additionalKgPrice;
        const total = basePrice + additionalCost;
        breakdown.push(`Base rate (First ${baseKg} KG): ${currencySymbol}${basePrice.toLocaleString()}`);
        breakdown.push(`Additional weight (${Math.ceil(extraWeight)} KG @ ${currencySymbol}${additionalKgPrice}/KG): ${currencySymbol}${additionalCost.toLocaleString()}`);
        return {
          chargeableWeight: totalChargeableWeight,
          actualWeight: actualTotalWeight,
          volumetricWeight,
          basePrice,
          additionalCost,
          totalPrice: total,
          currency: 'BDT',
          currencySymbol,
          matchedRuleType: 'base_plus_additional',
          breakdown,
          isAvailable: true,
        };
      }
    }
  }

  // Fallback to Country default rate if defined
  if (country.basePrice && country.basePrice > 0) {
    const basePrice = country.basePrice;
    const additionalKgPrice = country.additionalKgPrice || 600;
    if (totalChargeableWeight <= 1) {
      breakdown.push(`Standard country air rate (1st KG): ${currencySymbol}${basePrice.toLocaleString()}`);
      return {
        chargeableWeight: totalChargeableWeight,
        actualWeight: actualTotalWeight,
        volumetricWeight,
        basePrice,
        additionalCost: 0,
        totalPrice: basePrice,
        currency: 'BDT',
        currencySymbol,
        matchedRuleType: 'country_default',
        breakdown,
        isAvailable: true,
      };
    } else {
      const extraWeight = totalChargeableWeight - 1;
      const additionalCost = Math.ceil(extraWeight) * additionalKgPrice;
      const total = basePrice + additionalCost;
      breakdown.push(`Base country rate (1st KG): ${currencySymbol}${basePrice.toLocaleString()}`);
      breakdown.push(`Additional ${Math.ceil(extraWeight)} KG @ ${currencySymbol}${additionalKgPrice}/KG: ${currencySymbol}${additionalCost.toLocaleString()}`);
      return {
        chargeableWeight: totalChargeableWeight,
        actualWeight: actualTotalWeight,
        volumetricWeight,
        basePrice,
        additionalCost,
        totalPrice: total,
        currency: 'BDT',
        currencySymbol,
        matchedRuleType: 'country_default',
        breakdown,
        isAvailable: true,
      };
    }
  }

  return {
    chargeableWeight: totalChargeableWeight,
    actualWeight: actualTotalWeight,
    volumetricWeight,
    basePrice: 0,
    additionalCost: 0,
    totalPrice: 0,
    currency: 'BDT',
    currencySymbol,
    matchedRuleType: 'none',
    breakdown: [],
    isAvailable: false,
    unavailableReason: 'Price unavailable for this destination. Please contact us.',
  };
}
