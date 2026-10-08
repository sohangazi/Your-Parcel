import React from 'react';
import { useData } from '../../context/DataContext';
import { Plane, Clock, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface PopularDestinationsProps {
  onSelectCountry: (countryId: string) => void;
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({ onSelectCountry }) => {
  const { countries, settings } = useData();

  // Dynamic filter from Firebase where isPopular is true and status is active
  const popularList = countries.filter((c) => c.status === 'active' && c.isPopular);

  return (
    <section className="py-20 bg-[#0C071E] border-b border-purple-900/30 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Popular Shipping Routes
            </h2>
            <p className="mt-1.5 text-sm text-slate-400">
              Daily air cargo departures from Dhaka to top global destinations.
            </p>
          </div>
        </div>

        {/* Dynamic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {popularList.map((country) => (
            <div
              key={country.id}
              onClick={() => onSelectCountry(country.id)}
              className="bg-[#130B29] border border-purple-900/40 hover:border-[#FF6B00]/70 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h3 className="font-bold text-base text-white group-hover:text-[#FF6B00] transition-colors">
                      {country.name}
                    </h3>
                    <span className="text-xs text-slate-400">
                      {country.estimatedDays}
                    </span>
                  </div>
                </div>

                <div className="py-2.5 border-t border-purple-900/30 flex items-baseline justify-between text-xs">
                  <span className="text-slate-400">Starting from</span>
                  <span className="font-bold text-[#FF6B00] text-base">
                    {settings.currencySymbol || '৳'}{country.basePrice?.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-purple-900/30 flex items-center justify-between text-xs font-semibold text-purple-300 group-hover:text-[#FF6B00] transition-colors">
                <span>Ship to {country.name}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
