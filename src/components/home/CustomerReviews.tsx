import React from 'react';
import { Star } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  const reviews = [
    {
      name: 'Farhan Rahman',
      location: 'Kuala Lumpur, Malaysia',
      flag: '🇲🇾',
      quote:
        'Sent 4 KG traditional sharees and Eid gifts from Dhanmondi to KL. Reached in 3 days in perfect condition with unbroken security seals.',
      rating: 5,
    },
    {
      name: 'Dr. Aminul Ahsan',
      location: 'London, United Kingdom',
      flag: '🇬🇧',
      quote:
        'Dispatched original university transcripts to London. Live Airway Bill tracking gave complete peace of mind until final doorstep handover.',
      rating: 5,
    },
    {
      name: 'Samira Chowdhury',
      location: 'Toronto, Canada',
      flag: '🇨🇦',
      quote:
        'We ship apparel samples to Canadian buyers monthly. Pickup in Dhaka is always on time and customs clearance is completely effortless.',
      rating: 5,
    },
  ];

  return (
    <section className="py-16 bg-[#0A051A] border-b border-purple-900/30 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#150D2E] border border-purple-800 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Customer Experiences</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Trusted by Senders Worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="bg-[#120B27] border border-purple-900/40 rounded-2xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-2xl">{rev.flag}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-purple-900/30">
                <div className="font-bold text-white text-sm">{rev.name}</div>
                <div className="text-xs text-slate-400">{rev.location}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
