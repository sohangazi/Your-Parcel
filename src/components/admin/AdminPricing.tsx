import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { PricingRule, WeightSlab } from '../../types';
import { calculateShippingPrice } from '../../utils/pricingEngine';
import {
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Copy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  X,
  Sparkles,
  Calculator,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const AdminPricing: React.FC = () => {
  const { countries, products, pricingRules, savePricingRule, deletePricingRule, settings } = useData();

  const [selectedCountryId, setSelectedCountryId] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [publishConfirmModal, setPublishConfirmModal] = useState<PricingRule | null>(null);

  // Form State
  const [countryId, setCountryId] = useState('c-my');
  const [productId, setProductId] = useState('p-doc');
  const [pricingType, setPricingType] = useState<'slabs' | 'base_plus_additional'>('base_plus_additional');
  const [baseKg, setBaseKg] = useState(1);
  const [basePrice, setBasePrice] = useState(1400);
  const [additionalKgPrice, setAdditionalKgPrice] = useState(600);
  const [slabs, setSlabs] = useState<WeightSlab[]>([
    { minKg: 0, maxKg: 1, price: 1600 },
    { minKg: 1, maxKg: 2, price: 2200 },
    { minKg: 2, maxKg: 3, price: 2800 },
    { minKg: 3, maxKg: 5, price: 4000 },
  ]);
  const [status, setStatus] = useState<'active' | 'draft' | 'inactive'>('active');

  // Test Calculator State inside Pricing Tab
  const [testCountryId, setTestCountryId] = useState('c-my');
  const [testProductId, setTestProductId] = useState('p-doc');
  const [testWeight, setTestWeight] = useState(1.5);

  const testCountry = countries.find((c) => c.id === testCountryId);
  const testProduct = products.find((p) => p.id === testProductId);

  const testCalculation = useMemo(() => {
    return calculateShippingPrice({
      country: testCountry,
      product: testProduct,
      weight: testWeight,
      pricingRules,
      currencySymbol: settings.currencySymbol || '৳',
    });
  }, [testCountry, testProduct, testWeight, pricingRules, settings.currencySymbol]);

  // Filtered Rules
  const filteredRules = pricingRules.filter(
    (r) => selectedCountryId === 'all' || r.countryId === selectedCountryId
  );

  const handleOpenAdd = () => {
    setEditingRule(null);
    setCountryId(countries[0]?.id || 'c-my');
    setProductId(products[0]?.id || 'p-doc');
    setPricingType('base_plus_additional');
    setBaseKg(1);
    setBasePrice(1500);
    setAdditionalKgPrice(650);
    setSlabs([
      { minKg: 0, maxKg: 1, price: 1600 },
      { minKg: 1, maxKg: 2, price: 2200 },
      { minKg: 2, maxKg: 3, price: 2800 },
      { minKg: 3, maxKg: 5, price: 4000 },
    ]);
    setStatus('active');
    setModalOpen(true);
  };

  const handleOpenEdit = (rule: PricingRule) => {
    setEditingRule(rule);
    setCountryId(rule.countryId);
    setProductId(rule.productId);
    setPricingType(rule.pricingType);
    setBaseKg(rule.baseKg || 1);
    setBasePrice(rule.basePrice || 1400);
    setAdditionalKgPrice(rule.additionalKgPrice || 600);
    setSlabs(
      rule.slabs || [
        { minKg: 0, maxKg: 1, price: 1600 },
        { minKg: 1, maxKg: 2, price: 2200 },
      ]
    );
    setStatus(rule.status);
    setModalOpen(true);
  };

  const handleDuplicate = (rule: PricingRule) => {
    setEditingRule(null);
    setCountryId(rule.countryId);
    setProductId(rule.productId);
    setPricingType(rule.pricingType);
    setBaseKg(rule.baseKg || 1);
    setBasePrice(rule.basePrice || 1400);
    setAdditionalKgPrice(rule.additionalKgPrice || 600);
    setSlabs(rule.slabs ? [...rule.slabs] : []);
    setStatus('draft');
    setModalOpen(true);
  };

  const handleAddSlab = () => {
    const last = slabs[slabs.length - 1];
    const newMin = last ? last.maxKg : 0;
    const newMax = newMin + 2;
    const newPrice = last ? last.price + 800 : 1500;
    setSlabs([...slabs, { minKg: newMin, maxKg: newMax, price: newPrice }]);
  };

  const handleRemoveSlab = (index: number) => {
    setSlabs(slabs.filter((_, i) => i !== index));
  };

  const handleUpdateSlab = (index: number, field: keyof WeightSlab, val: number) => {
    const updated = [...slabs];
    updated[index] = { ...updated[index], [field]: val };
    setSlabs(updated);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const c = countries.find((item) => item.id === countryId);
    const p = products.find((item) => item.id === productId);

    const payload: PricingRule = {
      id: editingRule ? editingRule.id : `pr-${countryId.replace('c-', '')}-${p?.code.toLowerCase() || Date.now()}`,
      countryId,
      countryName: c?.name || 'Destination',
      productId,
      productName: p?.name || 'Product',
      pricingType,
      baseKg,
      basePrice,
      additionalKgPrice,
      slabs,
      status,
      version: editingRule?.version || 1,
      createdAt: editingRule?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Show publish confirmation dialog before executing
    setPublishConfirmModal(payload);
    setModalOpen(false);
  };

  const handleConfirmPublish = async () => {
    if (publishConfirmModal) {
      await savePricingRule(publishConfirmModal);
      setPublishConfirmModal(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Country + Product Dynamic Pricing Engine</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              Live Real-Time Sync
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure matrix pricing for Country → Product → Weight. Modifications reflect instantly on public calculator.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#FF6B00] text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-orange-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Pricing Rule</span>
        </button>
      </div>

      {/* Live In-Admin Simulator */}
      <div className="bg-[#140D2E] border border-purple-800/60 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF6B00] uppercase tracking-wider">
            <Calculator className="w-4 h-4" />
            <span>Real-Time Pricing Simulation Sandbox</span>
          </div>
          <span className="text-[11px] text-purple-300">Verifies current Firebase rules logic</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-bold">Select Country</label>
            <select
              value={testCountryId}
              onChange={(e) => setTestCountryId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            >
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-bold">Select Product</label>
            <select
              value={testProductId}
              onChange={(e) => setTestProductId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-bold">Test Weight (KG)</label>
            <input
              type="number"
              step="0.5"
              min="0.1"
              value={testWeight}
              onChange={(e) => setTestWeight(parseFloat(e.target.value) || 0.5)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
            />
          </div>
        </div>

        {/* Calculation Sandbox Output */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Simulated Price</span>
            <div className="text-2xl font-black text-[#FF6B00] font-mono">
              {settings.currencySymbol || '৳'}{testCalculation.totalPrice.toLocaleString()} BDT
            </div>
            <div className="text-[11px] text-slate-400">
              Rule Matched: <strong className="text-purple-300 font-bold">{testCalculation.matchedRuleType}</strong>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            {testCalculation.breakdown.map((b, i) => (
              <div key={i} className="font-mono text-[11px] text-slate-300">
                • {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter by Country */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter by Destination:</span>
          <select
            value={selectedCountryId}
            onChange={(e) => setSelectedCountryId(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
          >
            <option value="all">All Destinations ({pricingRules.length} Rules)</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing Rules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRules.map((rule) => {
          const isSlabs = rule.pricingType === 'slabs';

          return (
            <div
              key={rule.id}
              className="bg-[#140D2E] border border-purple-900/40 hover:border-purple-700 rounded-3xl p-5 space-y-4 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-black text-base text-white">{rule.countryName}</h3>
                    <span className="text-xs font-bold text-[#FF6B00]">{rule.productName}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      rule.status === 'active'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {rule.status} (v{rule.version || 1})
                  </span>
                </div>

                {/* Structure Display */}
                <div className="p-3.5 rounded-2xl bg-[#0C061A] border border-purple-900/40 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                    <span>Pricing Engine:</span>
                    <span className="text-purple-300 font-mono">{rule.pricingType}</span>
                  </div>

                  {isSlabs ? (
                    <div className="space-y-1.5 pt-1">
                      {rule.slabs?.map((slab, i) => (
                        <div key={i} className="flex justify-between text-slate-300 font-mono text-[11px]">
                          <span>{slab.minKg} - {slab.maxKg} KG:</span>
                          <span className="font-bold text-[#FF6B00]">
                            {settings.currencySymbol || '৳'}{slab.price.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                        <span>First {rule.baseKg || 1} KG:</span>
                        <span className="font-bold text-[#FF6B00]">
                          {settings.currencySymbol || '৳'}{rule.basePrice?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-slate-300 font-mono text-[11px]">
                        <span>Each Add'l KG:</span>
                        <span className="font-bold text-purple-300 font-mono">
                          +{settings.currencySymbol || '৳'}{rule.additionalKgPrice?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-purple-900/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(rule)}
                    className="px-3 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 text-purple-200 hover:text-white border border-purple-800 font-bold transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#FF6B00]" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDuplicate(rule)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Duplicate Rule"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Delete pricing rule for ${rule.countryName} -> ${rule.productName}?`)) {
                      deletePricingRule(rule.id);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-rose-950 text-rose-400 transition-colors"
                  title="Delete Rule"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Rule Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg">
                {editingRule ? `Edit Rule: ${editingRule.countryName}` : 'Add Country + Product Pricing Rule'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Country *</label>
                  <select
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Product Category *</label>
                  <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing Type Selection */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-bold">Pricing Calculation Model</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPricingType('base_plus_additional')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      pricingType === 'base_plus_additional'
                        ? 'bg-purple-900/60 text-purple-200 border-purple-500 font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <div>Base + Additional KG</div>
                    <div className="text-[10px] text-slate-400 font-normal">e.g. 1st KG ৳1,400 + ৳600/add'l KG</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPricingType('slabs')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      pricingType === 'slabs'
                        ? 'bg-orange-950/60 text-[#FF6B00] border-[#FF6B00] font-bold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <div>Weight Slabs (Bracketed)</div>
                    <div className="text-[10px] text-slate-400 font-normal">e.g. 0-1 KG, 1-2 KG, 2-3 KG fixed rates</div>
                  </button>
                </div>
              </div>

              {/* Base + Additional Fields */}
              {pricingType === 'base_plus_additional' && (
                <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <div>
                    <label className="block text-slate-400 mb-1">Base Weight (KG)</label>
                    <input
                      type="number"
                      value={baseKg}
                      onChange={(e) => setBaseKg(parseFloat(e.target.value) || 1)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Base Price (BDT)</label>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Add'l KG Price (BDT)</label>
                    <input
                      type="number"
                      value={additionalKgPrice}
                      onChange={(e) => setAdditionalKgPrice(parseFloat(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Slabs Fields */}
              {pricingType === 'slabs' && (
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300">Weight Slabs Matrix</span>
                    <button
                      type="button"
                      onClick={handleAddSlab}
                      className="text-[#FF6B00] font-bold hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Slab</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {slabs.map((slab, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-1">
                          <input
                            type="number"
                            step="0.5"
                            value={slab.minKg}
                            onChange={(e) => handleUpdateSlab(i, 'minKg', parseFloat(e.target.value) || 0)}
                            className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 font-mono text-center"
                          />
                          <span className="text-slate-500">to</span>
                          <input
                            type="number"
                            step="0.5"
                            value={slab.maxKg}
                            onChange={(e) => handleUpdateSlab(i, 'maxKg', parseFloat(e.target.value) || 0)}
                            className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 font-mono text-center"
                          />
                          <span className="text-slate-400 font-mono">KG =</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={slab.price}
                            onChange={(e) => handleUpdateSlab(i, 'price', parseInt(e.target.value) || 0)}
                            className="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-1.5 font-mono text-amber-400 font-bold"
                          />
                          <span className="text-slate-400">BDT</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSlab(i)}
                          className="p-1 text-slate-500 hover:text-rose-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="active">Active (Publishes to Public Calculator)</option>
                  <option value="draft">Draft (Private in Admin Only)</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black"
                >
                  Review & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog Before Publishing Price (Section 11) */}
      {publishConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-md w-full p-6 text-white space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-black text-lg text-white">Publish Price Modification?</h3>
              <p className="text-xs text-slate-300">
                You are about to publish new live shipping charges for:
              </p>
              <div className="text-sm font-bold text-amber-400 pt-1">
                {publishConfirmModal.countryName} → {publishConfirmModal.productName}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 font-mono">
              Calculation Type: {publishConfirmModal.pricingType} <br />
              Status: {publishConfirmModal.status.toUpperCase()}
            </div>

            <p className="text-[11px] text-slate-400 text-center">
              This change will immediately synchronize across all customer web browser sessions via Firebase Firestore.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPublishConfirmModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmPublish}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20"
              >
                Confirm & Sync Firebase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
