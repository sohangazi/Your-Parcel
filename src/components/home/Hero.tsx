import React from 'react';
import { useData } from '../../context/DataContext';
import { GlobalRouteAnimation } from './GlobalRouteAnimation';
import {
  ArrowRight,
  Search,
  Calculator,
  ShieldCheck,
  Plane,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle,
} from 'lucide-react';

interface HeroProps {
  onSendClick: () => void;
  onTrackClick: () => void;
  onQuoteClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onSendClick, onTrackClick, onQuoteClick }) => {
  const { settings } = useData();

  return (
    <section className="relative overflow-hidden bg-[#0A051A] pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-purple-900/30 w-full max-w-full">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#7C5CFC]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FF6B00]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Brand Statement & Actions */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Clean Origin Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#150D2E] border border-purple-800 text-purple-200 text-xs font-medium">
              <span className="h-2 w-2 rounded-full bg-[#FF6B00]"></span>
              <span>International Courier · Express Air from Bangladesh</span>
            </div>

            {/* Clean Title */}
            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                Send Parcels Worldwide with <span className="text-[#FF6B00]">Confidence</span>
              </h1>
              <p className="mt-3 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {settings.heroSubtitle ||
                  'Door-to-door express delivery from Bangladesh to 220+ countries. Fast flight dispatch, simple customs clearance, and real-time tracking.'}
              </p>
            </div>

            {/* Clean CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={onSendClick}
                className="px-6 py-3.5 rounded-xl bg-[#FF6B00] hover:bg-[#e66000] text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2"
              >
                <span>Book a Parcel</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onTrackClick}
                className="px-5 py-3.5 rounded-xl bg-[#150D2E] hover:bg-[#1E1342] text-white font-semibold text-sm sm:text-base border border-purple-800/80 transition-all flex items-center gap-2"
              >
                <Search className="w-4 h-4 text-[#FF6B00]" />
                <span>Track Parcel</span>
              </button>
            </div>

            {/* Minimal Inline Trust Points */}
            <div className="pt-4 border-t border-purple-900/40 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-5 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> Free Doorstep Pickup
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> 3–5 Days Express Delivery
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" /> 100% Insured & Trackable
              </span>
            </div>
          </div>

          {/* Right Column: Global Route Animation Visual */}
          <div className="lg:col-span-6">
            <GlobalRouteAnimation />
          </div>
        </div>
      </div>
    </section>
  );
};
