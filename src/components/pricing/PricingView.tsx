import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { calculateShippingPrice } from '../../utils/pricingEngine';
import {
  Calculator,
  Search,
  Plane,
  Clock,
  ArrowRight,
  ShieldCheck,
  Scale,
  Sparkles,
  Info,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Filter,
  FileText,
  Shirt,
  Laptop,
  Gift,
  Utensils,
  Briefcase,
  Package,
} from 'lucide-react';

interface PricingViewProps {
  onBookParcel: (preset: {
    destinationCountryId: string;
    productId: string;
    weight: number;
    quantity: number;
    calculatedPrice: number;
  }) => void;
  onNavigateHome?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onBookParcel }) => {
  const { countries, products, pricingRules, settings } = useData();

  const activeCountries = useMemo(() => countries.filter((c) => c.status === 'active'), [countries]);
  const activeProducts = useMemo(() => products.filter((p) => p.status === 'active'), [products]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'middle_east' | 'west' | 'asia'>('all');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('all');

  // Interactive Live Calculator state
  const [calcCountryId, setCalcCountryId] = useState<string>('c-my');
  const [calcProductId, setCalcProductId] = useState<string>('p-doc');
  const [calcWeight, setCalcWeight] = useState<number>(1);
  const [calcQty, setCalcQty] = useState<number>(1);

  // Selected country object
  const calcCountry = useMemo(() => {
    return activeCountries.find((c) => c.id === calcCountryId) || activeCountries[0];
  }, [activeCountries, calcCountryId]);

  // Selected product object
  const calcProduct = useMemo(() => {
    return activeProducts.find((p) => p.id === calcProductId) || activeProducts[0];
  }, [activeProducts, calcProductId]);

  // Dynamic live calculation
  const liveCalculation = useMemo(() => {
    return calculateShippingPrice({
      country: calcCountry,
      product: calcProduct,
      weight: calcWeight,
      quantity: calcQty,
      pricingRules,
      currencySymbol: settings.currencySymbol || '৳',
    });
  }, [calcCountry, calcProduct, calcWeight, calcQty, pricingRules, settings.currencySymbol]);

  // Filter countries for rate card
  const filteredCountries = useMemo(() => {
    return activeCountries.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase());

      let matchRegion = true;
      if (selectedRegion === 'middle_east') {
        matchRegion = ['SA', 'AE', 'QA', 'OM', 'KW', 'BH'].includes(c.code);
      } else if (selectedRegion === 'west') {
        matchRegion = ['GB', 'US', 'CA', 'AU', 'IT', 'DE', 'FR'].includes(c.code);
      } else if (selectedRegion === 'asia') {
        matchRegion = ['MY', 'SG', 'IN', 'JP', 'TH', 'KR'].includes(c.code);
      }

      return matchSearch && matchRegion;
    });
  }, [activeCountries, searchQuery, selectedRegion]);

  // Get matching pricing rule for a country + product
  const getRuleForCountryProduct = (countryId: string, prodId: string) => {
    return pricingRules.find(
      (r) => r.status === 'active' && r.countryId === countryId && r.productId === prodId
    );
  };

  const handleSelectCountryForCalc = (countryId: string, prodId?: string) => {
    setCalcCountryId(countryId);
    if (prodId) {
      setCalcProductId(prodId);
    }
    // Scroll smoothly to calculator
    const el = document.getElementById('pricing-calculator-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookFromCalc = () => {
    if (liveCalculation.isAvailable && calcCountry && calcProduct) {
      onBookParcel({
        destinationCountryId: calcCountry.id,
        productId: calcProduct.id,
        weight: calcWeight,
        quantity: calcQty,
        calculatedPrice: liveCalculation.totalPrice,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0C071E] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>Official Transparent International Rate Card</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Worldwide Air Freight <span className="text-[#FF6B00]">Pricing & Rates</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300">
            Export directly from Dhaka (DAC Gateway) to 220+ international destinations.
            All prices in Bangladeshi Taka (BDT) with fuel surcharge, security screening, and door delivery included.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400 pt-2">
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Firebase Real-Time Synchronized
            </span>
            <span className="flex items-center gap-1.5 text-purple-300 bg-purple-950/60 border border-purple-800/60 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B00]" />
              Guaranteed No Hidden Fuel Spikes
            </span>
          </div>
        </div>

        {/* Live Interactive Pricing Calculator */}
        <div
          id="pricing-calculator-card"
          className="bg-[#150D2E] border border-purple-800/60 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-purple-950/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7C5CFC]/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-purple-900/40">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4A2B97] to-[#FF6B00] flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <Calculator className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Dynamic Rate Calculator</h2>
                  <p className="text-xs sm:text-sm text-slate-400">
                    Instantly compute exact shipping costs for any destination and package category.
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono text-purple-200 bg-purple-950/80 px-3.5 py-1.5 rounded-xl border border-purple-800">
                Origin: <strong className="text-[#FF6B00]">Dhaka, Bangladesh</strong>
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Destination Country */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  1. Destination Country
                </label>
                <select
                  value={calcCountryId}
                  onChange={(e) => setCalcCountryId(e.target.value)}
                  className="w-full bg-[#0D071F] border border-purple-800/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] font-medium cursor-pointer"
                >
                  {activeCountries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.flag} {c.name} ({c.code}) - {c.estimatedDays}
                    </option>
                  ))}
                </select>
                {calcCountry && (
                  <p className="text-[11px] text-[#A78BFA] mt-1.5 flex items-center gap-1 font-mono">
                    <Plane className="w-3 h-3 text-[#FF6B00]" /> Transit: {calcCountry.estimatedDays}
                  </p>
                )}
              </div>

              {/* Product Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  2. Parcel Category
                </label>
                <select
                  value={calcProductId}
                  onChange={(e) => setCalcProductId(e.target.value)}
                  className="w-full bg-[#0D071F] border border-purple-800/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] font-medium cursor-pointer"
                >
                  {activeProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.restricted ? '⚠️ (Declaration)' : ''}
                    </option>
                  ))}
                </select>
                {calcProduct && (
                  <p className="text-[11px] text-slate-400 mt-1.5 truncate">
                    {calcProduct.description}
                  </p>
                )}
              </div>

              {/* Weight in KG */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    3. Weight (KG)
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">Actual / Scale</span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="number"
                    min="0.1"
                    step="0.5"
                    max="200"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                    className="w-full bg-[#0D071F] border border-purple-800/80 rounded-xl pl-4 pr-14 py-3 text-sm text-white focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] font-mono"
                  />
                  <span className="absolute right-4 text-xs font-bold text-slate-400 pointer-events-none">
                    KG
                  </span>
                </div>
                <div className="flex gap-1.5 mt-2">
                  {[0.5, 1, 2, 5, 10, 20].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setCalcWeight(preset)}
                      className={`text-[11px] px-2 py-0.5 rounded border transition-colors ${
                        calcWeight === preset
                          ? 'bg-purple-900 text-purple-200 border-[#7C5CFC]'
                          : 'bg-[#0D071F] text-slate-400 border-purple-900/60 hover:text-white'
                      }`}
                    >
                      {preset}kg
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    4. Box Quantity
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">Carton count</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={calcQty}
                  onChange={(e) => setCalcQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-[#0D071F] border border-purple-800/80 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">Consignment box count</p>
              </div>
            </div>

            {/* Calculated Result Strip */}
            <div className="mt-8 pt-6 border-t border-purple-900/40 bg-[#0E0824]/90 p-4 sm:p-6 rounded-2xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
              <div className="space-y-1.5 flex-1 min-w-0 w-full">
                {liveCalculation.isAvailable ? (
                  <>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                        Total Air Courier Charge:
                      </span>
                      <span className="text-3xl sm:text-4xl font-black text-[#FF6B00]">
                        {liveCalculation.currencySymbol}
                        {liveCalculation.totalPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">BDT All-Inclusive</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-300">
                      <span className="text-[#A78BFA] font-semibold">
                        Chargeable: {liveCalculation.chargeableWeight} KG
                      </span>
                      <span>•</span>
                      <span>{calcCountry?.name}</span>
                      <span>•</span>
                      <span>{calcProduct?.name}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-medium">
                        Door-to-door transit: {calcCountry?.estimatedDays}
                      </span>
                    </div>

                    {liveCalculation.breakdown.length > 0 && (
                      <div className="text-[11px] text-slate-400 font-mono break-words">
                        {liveCalculation.breakdown.join(' | ')}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center gap-2.5 text-amber-400 bg-amber-950/40 border border-amber-800/60 p-3 rounded-xl">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <div className="font-bold text-sm">
                        {liveCalculation.unavailableReason || 'Custom corporate pricing required.'}
                      </div>
                      <div className="text-xs text-amber-300/80">
                        Please call hotline 16999 or submit an online booking request for direct customs booking.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <button
                  onClick={handleBookFromCalc}
                  disabled={!liveCalculation.isAvailable}
                  className={`w-full lg:w-auto px-8 py-3.5 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-lg ${
                    liveCalculation.isAvailable
                      ? 'bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#FF6B00] text-white shadow-orange-500/25 hover:scale-[1.02]'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <span>Book This Rate Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* International Rate Card Matrix */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 text-xs font-bold uppercase tracking-widest mb-2">
                <span>Country Rates & Weight Slabs</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Comprehensive International Rate Card
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Real-time tariff per country. Click any destination to load into the instant quotation engine.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                placeholder="Search country or code (e.g. UK, Malaysia)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#150D2E] border border-purple-800/80 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B00]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Global Gateways' },
              { id: 'middle_east', label: 'Middle East (Saudi, UAE, Qatar, Oman)' },
              { id: 'west', label: 'UK, USA, Canada & Europe' },
              { id: 'asia', label: 'Malaysia, Singapore & Asia' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedRegion(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRegion === tab.id
                    ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20'
                    : 'bg-[#150D2E] text-slate-400 hover:text-white border border-purple-900/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table Container */}
          <div className="bg-[#150D2E] border border-purple-900/50 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto w-full">
              <table className="w-full min-w-[700px] text-left text-xs sm:text-sm">
                <thead className="bg-[#0E0824] text-slate-400 uppercase tracking-wider text-[11px] font-mono border-b border-purple-900/40">
                  <tr>
                    <th className="py-4 px-6">Destination Country</th>
                    <th className="py-4 px-6">Transit Time</th>
                    <th className="py-4 px-6">Documents (1st KG)</th>
                    <th className="py-4 px-6">Clothes (0–1 KG)</th>
                    <th className="py-4 px-6">Additional KG Rate</th>
                    <th className="py-4 px-6">Weight Slabs / Rules</th>
                    <th className="py-4 px-6 text-right">Instant Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-900/30 font-medium text-slate-300">
                  {filteredCountries.map((c) => {
                    const docRule = getRuleForCountryProduct(c.id, 'p-doc');
                    const clothRule = getRuleForCountryProduct(c.id, 'p-cloth');

                    const docPrice = docRule?.basePrice || c.basePrice;
                    const clothPrice =
                      clothRule?.pricingType === 'slabs' && clothRule.slabs && clothRule.slabs[0]
                        ? clothRule.slabs[0].price
                        : clothRule?.basePrice || c.basePrice + 200;

                    const addPrice = clothRule?.additionalKgPrice || c.additionalKgPrice;

                    return (
                      <tr key={c.id} className="hover:bg-[#1C123D]/60 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{c.flag}</span>
                            <div>
                              <div className="font-bold text-white text-sm">{c.name}</div>
                              <div className="text-[10px] text-purple-300 font-mono">
                                ISO: {c.code} • Currency: {c.currency}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5 text-purple-300 font-mono text-xs">
                            <Clock className="w-3.5 h-3.5 text-[#FF6B00]" />
                            <span>{c.estimatedDays}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="font-black text-white font-mono text-base">
                            {settings.currencySymbol || '৳'}{docPrice.toLocaleString()}
                          </div>
                          <span className="text-[10px] text-slate-400">Fixed Priority</span>
                        </td>

                        <td className="py-4 px-6">
                          <div className="font-black text-[#FF6B00] font-mono text-base">
                            {settings.currencySymbol || '৳'}{clothPrice.toLocaleString()}
                          </div>
                          <span className="text-[10px] text-slate-400">Garments / Saree</span>
                        </td>

                        <td className="py-4 px-6">
                          <div className="font-mono text-slate-300">
                            +{settings.currencySymbol || '৳'}{addPrice.toLocaleString()} / KG
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono">Incremental</span>
                        </td>

                        <td className="py-4 px-6">
                          {clothRule?.pricingType === 'slabs' && clothRule.slabs ? (
                            <div className="flex flex-wrap gap-1">
                              {clothRule.slabs.slice(0, 3).map((s, idx) => (
                                <span
                                  key={idx}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-200 font-mono"
                                >
                                  {s.minKg}-{s.maxKg}k: {settings.currencySymbol || '৳'}{s.price}
                                </span>
                              ))}
                              {clothRule.slabs.length > 3 && (
                                <span className="text-[10px] text-slate-400 self-center">
                                  +{clothRule.slabs.length - 3} more
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-400">
                              Base + Additional KG Structure
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleSelectCountryForCalc(c.id, 'p-cloth')}
                            className="px-3.5 py-1.5 rounded-lg bg-purple-950 hover:bg-[#FF6B00] text-purple-200 hover:text-white border border-purple-800 hover:border-orange-500 font-bold text-xs transition-all flex items-center gap-1 ml-auto shadow-sm"
                          >
                            <span>Calculate</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pricing Terms & Volumetric FAQ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="bg-[#150D2E] border border-purple-900/40 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 flex items-center justify-center text-[#FF6B00]">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Chargeable Weight Rule</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              International airlines charge by whichever is greater: actual scale weight vs volumetric weight.
              Formula: <strong>Length × Width × Height (cm) ÷ 5000</strong>.
            </p>
          </div>

          <div className="bg-[#150D2E] border border-purple-900/40 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 flex items-center justify-center text-[#FF6B00]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">All-Inclusive Guarantee</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our rates include airport screening, fuel surcharge, export customs clearance, and residential delivery.
              No hidden surprise levies at delivery point.
            </p>
          </div>

          <div className="bg-[#150D2E] border border-purple-900/40 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-950 flex items-center justify-center text-[#FF6B00]">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Direct Priority Cargo Flights</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consignments depart directly from Hazrat Shahjalal International Airport (DAC) on scheduled carriers:
              Biman, Emirates, Qatar Airways, Saudia, and Singapore Airlines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
