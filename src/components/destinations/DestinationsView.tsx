import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Search, Plane, Clock, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export const DestinationsView: React.FC<{
  onSelectCountry: (countryId: string) => void;
}> = ({ onSelectCountry }) => {
  const { countries, settings } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const activeCountries = countries.filter((c) => c.status === 'active');

  const filtered = activeCountries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-bold uppercase tracking-widest">
            <Plane className="w-3.5 h-3.5" />
            <span>220+ Countries & Territories</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            International Destination Corridors
          </h1>
          <p className="text-sm sm:text-base text-slate-400">
            Export courier services departing daily from Dhaka Central Airport Gateway with pre-cleared customs routing.
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search destination country or ISO code (e.g. Malaysia, SA, UK)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Countries Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((country) => (
            <div
              key={country.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{country.flag}</span>
                  <span className="font-mono text-xs text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {country.code}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                  {country.name}
                </h3>

                <div className="space-y-2 py-4 border-y border-slate-800/80 my-4 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      Flight Transit:
                    </span>
                    <span className="font-semibold text-slate-200">{country.estimatedDays}</span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Base Rate (1st KG):</span>
                    <span className="font-bold text-amber-400">
                      {settings.currencySymbol || '৳'}{country.basePrice?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-400">
                    <span>Each Add'l KG:</span>
                    <span className="font-mono text-slate-300">
                      +{settings.currencySymbol || '৳'}{country.additionalKgPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>

                {country.notes && (
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                    {country.notes}
                  </p>
                )}
              </div>

              <button
                onClick={() => onSelectCountry(country.id)}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-amber-500 hover:text-slate-950 border border-slate-800 font-bold text-xs text-cyan-300 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Calculate & Book</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
