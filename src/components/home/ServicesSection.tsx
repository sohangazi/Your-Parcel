import React from 'react';
import { Plane, FileText, Shirt, Gift, ArrowRight } from 'lucide-react';

export const ServicesSection: React.FC<{ onBookService: () => void }> = ({ onBookService }) => {
  const services = [
    {
      title: 'Express Air Courier',
      description: 'Fastest door-to-door delivery worldwide for urgent parcels, gifts, and packages.',
      icon: Plane,
      time: '3–5 Days',
    },
    {
      title: 'Documents & Transcripts',
      description: 'Tamper-proof, waterproof security pouches for university transcripts, passports and contracts.',
      icon: FileText,
      time: '3–4 Days',
    },
    {
      title: 'Garments & Commercial Samples',
      description: 'Export sample shipping for apparel, fabric swatches and business consignments.',
      icon: Shirt,
      time: '4–6 Days',
    },
    {
      title: 'Family & Expat Gift Boxes',
      description: 'Safe shipping for traditional dry foods, Eid gifts, and clothes to family abroad.',
      icon: Gift,
      time: '3–5 Days',
    },
  ];

  return (
    <section id="services" className="py-16 bg-[#0C071E] border-b border-purple-900/30 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#150D2E] border border-purple-800 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>What We Ship</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Tailored Courier Services
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Dedicated handling for every category with free doorstep collection.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="bg-[#140D2E] border border-purple-900/40 hover:border-[#FF6B00]/70 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-[#FF6B00]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                      {srv.time}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#FF6B00] transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <button
                  onClick={onBookService}
                  className="w-full mt-5 py-2.5 rounded-xl bg-[#0D071F] border border-purple-800/80 hover:border-[#FF6B00] hover:bg-[#FF6B00] text-xs font-bold text-purple-200 hover:text-white flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>Book This</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
