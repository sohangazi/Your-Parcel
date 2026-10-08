import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Country } from '../../types';
import {
  Globe2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
  X,
  Clock,
  DollarSign,
} from 'lucide-react';

export const AdminCountries: React.FC = () => {
  const { countries, products, saveCountry, deleteCountry, settings } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [flag, setFlag] = useState('');
  const [currency, setCurrency] = useState('BDT');
  const [basePrice, setBasePrice] = useState(1500);
  const [additionalKgPrice, setAdditionalKgPrice] = useState(650);
  const [estimatedDays, setEstimatedDays] = useState('3-5 Business Days');
  const [isPopular, setIsPopular] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [availableProductIds, setAvailableProductIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const filtered = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingCountry(null);
    setName('');
    setCode('');
    setFlag('🌍');
    setCurrency('BDT');
    setBasePrice(1600);
    setAdditionalKgPrice(700);
    setEstimatedDays('3-5 Business Days');
    setIsPopular(false);
    setStatus('active');
    setAvailableProductIds(products.map((p) => p.id));
    setNotes('');
    setModalOpen(true);
  };

  const handleOpenEdit = (country: Country) => {
    setEditingCountry(country);
    setName(country.name);
    setCode(country.code);
    setFlag(country.flag);
    setCurrency(country.currency || 'BDT');
    setBasePrice(country.basePrice || 1500);
    setAdditionalKgPrice(country.additionalKgPrice || 600);
    setEstimatedDays(country.estimatedDays || '3-5 Business Days');
    setIsPopular(Boolean(country.isPopular));
    setStatus(country.status);
    setAvailableProductIds(country.availableProductIds || []);
    setNotes(country.notes || '');
    setModalOpen(true);
  };

  const handleProductToggle = (productId: string) => {
    setAvailableProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingCountry ? editingCountry.id : `c-${code.toLowerCase()}`;

    const countryPayload: Country = {
      id,
      name,
      code: code.toUpperCase(),
      flag: flag || '🌍',
      currency,
      basePrice,
      additionalKgPrice,
      estimatedDays,
      isPopular,
      status,
      availableProductIds,
      notes,
      createdAt: editingCountry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveCountry(countryPayload);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Destination Countries & Corridors</h1>
          <p className="text-xs text-slate-400">
            Configure destination countries, transit times, base rates, and assigned parcel permissions.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add Destination Country</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search country or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Total: <strong className="text-white">{countries.length}</strong> Countries
        </span>
      </div>

      {/* Countries Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((c) => (
          <div
            key={c.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{c.flag}</span>
                  <div>
                    <h3 className="font-bold text-base text-white">{c.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">ISO: {c.code}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {c.isPopular && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-950 text-amber-300 border border-amber-800">
                      Popular
                    </span>
                  )}
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      c.status === 'active'
                        ? 'bg-emerald-950 text-emerald-300'
                        : 'bg-rose-950 text-rose-300'
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 py-3 border-y border-slate-800 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Transit Days:</span>
                  <span>{c.estimatedDays}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Rate (1st KG):</span>
                  <span className="font-mono font-bold text-amber-400">
                    {settings.currencySymbol || '৳'}{c.basePrice?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Additional KG:</span>
                  <span className="font-mono text-slate-300">
                    +{settings.currencySymbol || '৳'}{c.additionalKgPrice?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Permitted Products:</span>
                  <span className="text-cyan-400 font-mono font-bold">
                    {c.availableProductIds?.length || 0} / {products.length}
                  </span>
                </div>
              </div>

              {c.notes && (
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-2 italic">
                  {c.notes}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleOpenEdit(c)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit Country</span>
              </button>

              <button
                onClick={() => {
                  if (confirm(`Are you sure you want to delete ${c.name}?`)) {
                    deleteCountry(c.id, c.name);
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-rose-950 text-rose-400 transition-colors"
                title="Delete Country"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Country Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg">
                {editingCountry ? `Edit ${editingCountry.name}` : 'Add Destination Country'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1 font-bold">Country Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Malaysia"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">ISO Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    placeholder="e.g. MY"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Flag Emoji</label>
                  <input
                    type="text"
                    placeholder="🇲🇾"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-base"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-400 mb-1 font-bold">Estimated Delivery Days</label>
                  <input
                    type="text"
                    placeholder="e.g. 3-5 Business Days"
                    value={estimatedDays}
                    onChange={(e) => setEstimatedDays(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Base Rate 1st KG (BDT)</label>
                  <input
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Additional KG Rate (BDT)</label>
                  <input
                    type="number"
                    value={additionalKgPrice}
                    onChange={(e) => setAdditionalKgPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="active">Active (Available)</option>
                    <option value="inactive">Inactive (Suspended)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="popCheck"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 bg-slate-950 border-slate-700"
                  />
                  <label htmlFor="popCheck" className="text-slate-300 font-bold cursor-pointer">
                    Show as "Popular Destination" on Homepage
                  </label>
                </div>
              </div>

              {/* Assign Permitted Products */}
              <div>
                <label className="block text-slate-400 mb-1.5 font-bold">
                  Permitted Products for this Destination (Section 10)
                </label>
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                  {products.map((p) => {
                    const isChecked = availableProductIds.includes(p.id);
                    return (
                      <label key={p.id} className="flex items-center gap-2 cursor-pointer text-slate-300">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleProductToggle(p.id)}
                          className="w-3.5 h-3.5 rounded text-cyan-400 bg-slate-900 border-slate-700"
                        />
                        <span>{p.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Customs & Shipping Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Arabic invoice required for Riyadh clearance. Personal gift threshold info."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white resize-none"
                />
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
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Save Country
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
