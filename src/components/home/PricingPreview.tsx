import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Clock, ArrowRight, CheckCircle, Plane } from 'lucide-react';

export const PricingPreview: React.FC<{ onSelectRate: (countryId: string) => void }> = ({
  onSelectRate,
}) => {
  const { countries, settings } = useData();
  const [activeFilter, setActiveFilter] = useState<'all' | 'asia' | 'middle_east' | 'west'>('all');

  const activeCountries = countries.filter((c) => c.status === 'active');

  const filteredCountries = activeCountries.filter((c) => {
    if (activeFilter === 'asia') return ['MY', 'SG', 'IN', 'JP'].includes(c.code);
    if (activeFilter === 'middle_east') return ['SA', 'AE', 'QA', 'OM'].includes(c.code);
    if (activeFilter === 'west') return ['GB', 'US', 'CA', 'AU', 'IT', 'DE'].includes(c.code);
    return true;
  });

  return (
    <section className="py-20 bg-slate-950 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/80 text-purple-300 text-xs font-bold uppercase tracking-widest mb-3">
            <span>Competitive International Rates</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Transparent Rate Card from Bangladesh
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            All prices in Bangladeshi Taka (BDT). Includes fuel surcharge, airport loading and door-to-door delivery.
          </p>

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {[
              { id: 'all', label: 'All Destinations' },
              { id: 'middle_east', label: 'Middle East (Gulf)' },
              { id: 'west', label: 'UK, USA & Europe' },
              { id: 'asia', label: 'Malaysia & Asia' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeFilter === tab.id
                    ? 'bg-[#FF6B00] text-white shadow-md shadow-orange-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing Table Card */}
        <div className="bg-[#130B29] border border-purple-900/60 rounded-3xl overflow-hidden shadow-2xl w-full">
          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[650px] text-left text-xs sm:text-sm">
              <thead className="bg-[#0B0618] text-slate-400 uppercase tracking-wider text-[11px] font-mono border-b border-purple-900/50">
                <tr>
                  <th className="py-4 px-6">Destination Country</th>
                  <th className="py-4 px-6">Transit Time</th>
                  <th className="py-4 px-6">Base Rate (1st KG)</th>
                  <th className="py-4 px-6">Additional KG</th>
                  <th className="py-4 px-6">Customs Route</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-900/30 font-medium text-slate-300">
                {filteredCountries.slice(0, 10).map((c) => (
                  <tr key={c.id} className="hover:bg-[#1C123B]/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{c.flag}</span>
                        <div>
                          <div className="font-bold text-white">{c.name}</div>
                          <div className="text-[10px] text-purple-300 font-mono">ISO: {c.code}</div>
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
                      <span className="font-black text-[#FF6B00] font-mono text-base">
                        {settings.currencySymbol || '৳'}{c.basePrice?.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="font-mono text-slate-300">
                        +{settings.currencySymbol || '৳'}{c.additionalKgPrice?.toLocaleString()} / KG
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-[11px] text-slate-400 max-w-[200px] truncate block">
                        {c.notes ? c.notes.slice(0, 45) + '...' : 'Direct priority flight corridor'}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => onSelectRate(c.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-purple-950/80 hover:bg-[#FF6B00] text-purple-200 hover:text-white border border-purple-800 hover:border-orange-500 font-bold text-xs transition-all flex items-center gap-1 ml-auto"
                      >
                        <span>Calculate</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-[#0E0720] border-t border-purple-900/40 text-center">
            <button
              onClick={() => onSelectRate('all')}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#FF6B00] hover:text-white hover:underline transition-colors"
            >
              <span>Explore All Destination Rates & Product Weight Slabs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
