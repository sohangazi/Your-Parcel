import React from 'react';
import {
  ShieldCheck,
  Plane,
  Clock,
  PhoneCall,
  Scale,
  Sparkles,
  Award,
  CheckCircle2,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      title: 'Dedicated Dhaka Export Gate',
      desc: 'Our direct ramp-side handling at Hazrat Shahjalal International Airport eliminates third-party delays, ensuring same-day flight manifestation.',
      icon: Plane,
      metric: 'Daily',
      metricLabel: 'Flight Manifests',
    },
    {
      title: 'Global Customs Pre-Clearance',
      desc: 'Our certified customs specialists prepare airway paperwork according to specific Saudi (ZATCA), UK (HMRC), US (CBP), and Malaysian standards.',
      icon: ShieldCheck,
      metric: '99.8%',
      metricLabel: 'Clearance Rate',
    },
    {
      title: 'Transparent Bangladesh Pricing',
      desc: 'No hidden destination handling charges or surprise volumetric spikes. What you calculate is exactly what you pay in BDT.',
      icon: Scale,
      metric: '0%',
      metricLabel: 'Hidden Surcharges',
    },
    {
      title: '24/7 Expatriate Support Hotline',
      desc: 'Multilingual assistance in Bangla and English via hotline 16999 and live WhatsApp support for continuous peace of mind.',
      icon: PhoneCall,
      metric: '24/7',
      metricLabel: 'Active Operations',
    },
  ];

  return (
    <section className="py-20 bg-slate-900/40 border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-bold uppercase tracking-widest">
              <Award className="w-3.5 h-3.5" />
              <span>International Reliability</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Why Shippers Across Bangladesh Trust{' '}
              <span className="text-[#FF6B00]">YOUR PARCEL</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              International courier delivery is not just about moving cardboard boxes—it’s about delivering urgent university dreams, cherished family celebrations, and vital business commitments without anxiety.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Tamper-proof waterproof outer sealing on every consignment',
                'Live GPS tracking with immediate milestone SMS alerts',
                'Complimentary pickup across Dhaka, Chittagong & Sylhet divisions',
                'Direct airline partnerships with Qatar Airways, Emirates & Biman',
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs sm:text-sm text-slate-200">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {points.map((pt, index) => {
              const Icon = pt.icon;
              return (
                <div
                  key={index}
                  className="bg-slate-950 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-amber-400 font-mono">{pt.metric}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-medium">{pt.metricLabel}</div>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {pt.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {pt.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
