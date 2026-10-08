import React from 'react';
import { ClipboardCheck, Truck, PlaneTakeoff, Home, ArrowRight } from 'lucide-react';

export const HowItWorks: React.FC<{ onBookClick: () => void }> = ({ onBookClick }) => {
  const steps = [
    {
      step: '01',
      title: 'Book & Doorstep Pickup',
      description: 'Book online in 1 minute. We collect from your home or office in Dhaka, Ctg, or Sylhet with free security packing.',
      icon: Truck,
      color: 'text-[#FF6B00]',
    },
    {
      step: '02',
      title: 'Direct Flight & Customs',
      description: 'Dispatched on daily cargo flights from Dhaka with expedited customs clearance and live Airway Bill tracking.',
      icon: PlaneTakeoff,
      color: 'text-purple-400',
    },
    {
      step: '03',
      title: 'Delivered to Doorstep',
      description: 'Handed over directly to your recipient abroad with digital signature and delivery confirmation.',
      icon: Home,
      color: 'text-emerald-400',
    },
  ];

  return (
    <section className="py-16 bg-[#0A051A] border-b border-purple-900/30 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#150D2E] border border-purple-800 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            How It Works
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            From your doorstep in Bangladesh to your recipient's hands worldwide.
          </p>
        </div>

        {/* 3 Steps Minimal Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-[#120B27] border border-purple-900/40 hover:border-[#FF6B00]/50 rounded-2xl p-6 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-purple-900/70 group-hover:text-[#FF6B00]/40 transition-colors font-mono">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-[#FF6B00] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-purple-900/30 flex items-center text-xs text-slate-500 font-medium">
                  <span>Step {idx + 1} of 3</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
