import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { calculateShippingPrice } from '../../utils/pricingEngine';
import {
  Calculator,
  ArrowRight,
  Plane,
  Scale,
  Box,
  MapPin,
  Sparkles,
  Info,
  AlertCircle,
  CheckCircle,
  ChevronDown,
} from 'lucide-react';

interface QuickQuoteCalculatorProps {
  onBookParcel: (preset: {
    destinationCountryId: string;
    productId: string;
    weight: number;
    quantity: number;
    lengthCm?: number;
    widthCm?: number;
    heightCm?: number;
    calculatedPrice: number;
  }) => void;
}

export const QuickQuoteCalculator: React.FC<QuickQuoteCalculatorProps> = ({ onBookParcel }) => {
  const { countries, products, pricingRules, settings } = useData();

  // Active items
  const activeCountries = useMemo(() => countries.filter((c) => c.status === 'active'), [countries]);
  const activeProducts = useMemo(() => products.filter((p) => p.status === 'active'), [products]);

  const [destinationCountryId, setDestinationCountryId] = useState<string>('c-my');
  const [productId, setProductId] = useState<string>('p-doc');
  const [weight, setWeight] = useState<number>(1);
  const [quantity, setQuantity] = useState<number>(1);
  const [showDimensions, setShowDimensions] = useState<boolean>(false);
  const [lengthCm, setLengthCm] = useState<number | undefined>(undefined);
  const [widthCm, setWidthCm] = useState<number | undefined>(undefined);
  const [heightCm, setHeightCm] = useState<number | undefined>(undefined);

  // Synchronize country selection to always have a valid country
  useEffect(() => {
    if (activeCountries.length > 0) {
      if (!activeCountries.some((c) => c.id === destinationCountryId)) {
        setDestinationCountryId(activeCountries[0].id);
      }
    }
  }, [activeCountries, destinationCountryId]);

  // Selected Country
  const selectedCountry = useMemo(() => {
    return (
      activeCountries.find((c) => c.id === destinationCountryId) ||
      activeCountries[0] ||
      countries[0]
    );
  }, [activeCountries, countries, destinationCountryId]);

  // Available products for the selected country
  const filteredProducts = useMemo(() => {
    if (!selectedCountry) return activeProducts.length > 0 ? activeProducts : products;
    if (selectedCountry.availableProductIds && selectedCountry.availableProductIds.length > 0) {
      const allowed = activeProducts.filter((p) => selectedCountry.availableProductIds.includes(p.id));
      return allowed.length > 0 ? allowed : activeProducts;
    }
    return activeProducts.length > 0 ? activeProducts : products;
  }, [selectedCountry, activeProducts, products]);

  // Synchronize product selection
  useEffect(() => {
    if (filteredProducts.length > 0) {
      if (!filteredProducts.some((p) => p.id === productId)) {
        setProductId(filteredProducts[0].id);
      }
    }
  }, [filteredProducts, productId]);

  const selectedProduct = useMemo(() => {
    return (
      filteredProducts.find((p) => p.id === productId) ||
      filteredProducts[0] ||
      products[0]
    );
  }, [filteredProducts, products, productId]);

  // Calculate live dynamic rate directly from Firebase pricing rules
  const calculation = useMemo(() => {
    return calculateShippingPrice({
      country: selectedCountry,
      product: selectedProduct,
      weight,
      quantity,
      pricingRules,
      lengthCm,
      widthCm,
      heightCm,
      currencySymbol: settings.currencySymbol || '৳',
    });
  }, [
    selectedCountry,
    selectedProduct,
    weight,
    quantity,
    pricingRules,
    lengthCm,
    widthCm,
    heightCm,
    settings.currencySymbol,
  ]);

  const handleCountryChange = (cid: string) => {
    setDestinationCountryId(cid);
    const c = activeCountries.find((item) => item.id === cid);
    if (c && c.availableProductIds && c.availableProductIds.length > 0) {
      if (!c.availableProductIds.includes(productId)) {
        setProductId(c.availableProductIds[0]);
      }
    }
  };

  const handleBookNow = () => {
    if (calculation.isAvailable && selectedCountry && selectedProduct) {
      onBookParcel({
        destinationCountryId: selectedCountry.id,
        productId: selectedProduct.id,
        weight,
        quantity,
        lengthCm,
        widthCm,
        heightCm,
        calculatedPrice: calculation.totalPrice,
      });
    }
  };

  return (
    <div id="quick-quote" className="relative -mt-10 sm:-mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-full">
      <div className="bg-slate-900/95 backdrop-blur-xl border border-purple-900/50 rounded-3xl shadow-2xl p-5 sm:p-8 lg:p-10 text-white shadow-purple-950/40 overflow-hidden w-full">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-purple-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF6B00]/10 border border-[#FF6B00]/30 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Instant Shipping Rate Calculator</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Check all-inclusive rates from Bangladesh to any destination worldwide.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-950 border border-purple-900/50 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Origin: Dhaka, Bangladesh</span>
          </div>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-6">
          {/* Destination Country */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Destination Country
            </label>
            <div className="relative">
              <select
                value={selectedCountry?.id || destinationCountryId}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] appearance-none font-medium cursor-pointer"
              >
                {activeCountries.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name} ({c.code}) - {c.estimatedDays}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {selectedCountry && (
              <p className="text-[11px] text-[#A78BFA] mt-1.5 flex items-center gap-1 font-mono">
                <Plane className="w-3 h-3 text-[#FF6B00]" /> Transit: {selectedCountry.estimatedDays}
              </p>
            )}
          </div>

          {/* Product / Parcel Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Parcel Type / Category
            </label>
            <div className="relative">
              <select
                value={selectedProduct?.id || productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] appearance-none font-medium cursor-pointer"
              >
                {filteredProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.restricted ? '⚠️ (Declaration)' : ''}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {selectedProduct && (
              <p className="text-[11px] text-slate-400 mt-1.5 truncate">
                {selectedProduct.description}
              </p>
            )}
          </div>

          {/* Weight in KG */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Weight (KG)
              </label>
              <span className="text-[11px] text-slate-500 font-mono">Scale weight</span>
            </div>
            <div className="relative flex items-center">
              <input
                type="number"
                min="0.1"
                step="0.5"
                max="200"
                value={weight}
                onChange={(e) => setWeight(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3.5 pr-14 py-3 text-sm text-white focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] font-mono"
              />
              <span className="absolute right-3.5 text-xs font-bold text-slate-400 pointer-events-none">
                KG
              </span>
            </div>
            <div className="flex gap-1.5 mt-2">
              {[0.5, 1, 2, 5, 10].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setWeight(preset)}
                  className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                    weight === preset
                      ? 'bg-purple-900/60 text-purple-200 border-[#7C5CFC]'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {preset}kg
                </button>
              ))}
            </div>
          </div>

          {/* Quantity / Package count */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Quantity
              </label>
              <button
                type="button"
                onClick={() => setShowDimensions(!showDimensions)}
                className="text-[11px] text-[#A78BFA] hover:text-[#FF6B00] hover:underline font-medium"
              >
                {showDimensions ? 'Hide Dimensions' : '+ Add Dimensions (cm)'}
              </button>
            </div>
            <input
              type="number"
              min="1"
              max="50"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-3 text-sm text-white focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">Number of boxes in consignment</p>
          </div>
        </div>

        {/* Optional Dimensions Accordion */}
        {showDimensions && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Length (cm)</label>
              <input
                type="number"
                placeholder="e.g. 30"
                value={lengthCm || ''}
                onChange={(e) => setLengthCm(e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Width (cm)</label>
              <input
                type="number"
                placeholder="e.g. 25"
                value={widthCm || ''}
                onChange={(e) => setWidthCm(e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Height (cm)</label>
              <input
                type="number"
                placeholder="e.g. 15"
                value={heightCm || ''}
                onChange={(e) => setHeightCm(e.target.value ? parseFloat(e.target.value) : undefined)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            {calculation.volumetricWeight && (
              <div className="sm:col-span-3 text-[11px] text-[#FF6B00] font-mono">
                Volumetric Weight: {calculation.volumetricWeight} KG (IATA Formula: L×W×H ÷ 5000)
              </div>
            )}
          </div>
        )}

        {/* Result & Booking Action Card */}
        <div className="mt-6 pt-6 border-t border-purple-900/40 bg-slate-950/70 -mx-5 sm:-mx-8 lg:-mx-10 -mb-5 sm:-mb-8 lg:-mb-10 p-5 sm:p-8 rounded-b-3xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
          <div className="space-y-1.5 flex-1 min-w-0 w-full">
            {calculation.isAvailable ? (
              <>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                    Estimated Air Express Charge:
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-[#FF6B00]">
                    {calculation.currencySymbol}
                    {calculation.totalPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">BDT All-Inclusive</span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="text-[#A78BFA] font-semibold">
                    Chargeable: {calculation.chargeableWeight} KG
                  </span>
                  <span>•</span>
                  <span>{selectedCountry?.name}</span>
                  <span>•</span>
                  <span>{selectedProduct?.name}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">
                    Door-to-door transit in {selectedCountry?.estimatedDays}
                  </span>
                </div>

                {calculation.breakdown.length > 0 && (
                  <div className="text-[11px] text-slate-400 font-mono">
                    {calculation.breakdown.join(' | ')}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2.5 text-amber-400 bg-amber-950/30 border border-amber-800/40 p-3 rounded-xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-sm">
                    {calculation.unavailableReason || 'Price unavailable for this destination.'}
                  </div>
                  <div className="text-xs text-amber-300/80">
                    Please submit a direct booking request or call our hotline 16999 for custom logistics clearance.
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleBookNow}
              disabled={!calculation.isAvailable}
              className={`w-full lg:w-auto px-8 py-4 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                calculation.isAvailable
                  ? 'bg-gradient-to-r from-[#FF6B00] via-[#FF7700] to-[#E65100] hover:from-[#FF7700] hover:to-[#FF5A00] text-white shadow-orange-500/25 hover:scale-[1.02]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>Book This Parcel</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
