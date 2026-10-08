import React, { useState } from 'react';
import { Search, Plane, ShieldCheck, ArrowRight } from 'lucide-react';

interface InstantTrackingBarProps {
  onTrack: (trackingNumber: string) => void;
}

export const InstantTrackingBar: React.FC<InstantTrackingBarProps> = ({ onTrack }) => {
  const [num, setNum] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (num.trim()) {
      onTrack(num.trim());
    }
  };

  return (
    <section className="py-14 bg-gradient-to-r from-[#0C071E] via-[#120A2B] to-[#0C071E] border-y border-purple-900/30 text-white relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#140D2E]/90 border border-purple-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#FF6B00]">
                <Plane className="w-3.5 h-3.5" />
                <span>INSTANT AIRWAY BILL LOCATOR</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">Have a Parcel on the Way?</h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Enter your 11-digit consignment number to see real-time flight telemetry.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full md:w-auto flex-1 max-w-md flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="e.g. YP8840291BD"
                  value={num}
                  onChange={(e) => setNum(e.target.value.toUpperCase())}
                  className="w-full bg-[#0D071F] border border-purple-800 rounded-xl pl-10 pr-3 py-3 text-sm text-white placeholder-slate-500 font-mono tracking-wider focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#FF6B00] text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 flex-shrink-0"
              >
                <span>Track</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
