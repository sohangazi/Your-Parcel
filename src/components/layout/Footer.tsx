import React from 'react';
import { useData } from '../../context/DataContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  Package,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Plane,
  ArrowRight,
  Globe,
  Lock,
} from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  openSendModal: () => void;
  openTrackModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentTab,
  openSendModal,
  openTrackModal,
}) => {
  const { settings, countries } = useData();

  const activeCountries = countries.filter((c) => c.status === 'active').slice(0, 8);

  return (
    <footer className="bg-[#0A051A] border-t border-purple-900/40 text-slate-400 text-xs sm:text-sm">
      {/* Top Value Strip */}
      <div className="border-b border-purple-900/30 bg-[#120B29]/70 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">Direct International Flights</div>
              <div className="text-xs text-slate-400">Scheduled cargo departures from Dhaka (DAC)</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-[#FF6B00] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">100% Parcel Safety Guarantee</div>
              <div className="text-xs text-slate-400">Tamper-proof waterproof outer seals</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-800 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">24/7 Helpline & WhatsApp</div>
              <div className="text-xs text-slate-400">Call {settings.hotline || '16999'} or {settings.phone}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <div className="cursor-pointer" onClick={() => setCurrentTab('home')}>
              <BrandLogo size="md" showTagline={true} lightText={true} />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              YOUR PARCEL is Bangladesh's premier international express logistics platform. We deliver personal care packages, critical documents, garments, and commercial cargo from Dhaka, Chittagong, and Sylhet to 220+ countries worldwide with real-time transparency.
            </p>

            <div className="pt-2 space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#FF6B00] flex-shrink-0 mt-0.5" />
                <span className="text-slate-300">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                <span className="text-slate-300">{settings.email}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                <span className="text-slate-300">Hotline: {settings.hotline} / Mobile: {settings.phone}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider font-mono">
              Quick Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab('pricing')} className="hover:text-[#FF6B00] font-semibold text-purple-200 transition-colors">
                  Pricing & Rate Card
                </button>
              </li>
              <li>
                <button onClick={openSendModal} className="hover:text-[#FF6B00] transition-colors">
                  Send a Parcel
                </button>
              </li>
              <li>
                <button onClick={() => openTrackModal()} className="hover:text-[#FF6B00] transition-colors">
                  Track Airway Bill
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('quote')} className="hover:text-[#FF6B00] transition-colors">
                  Instant Quote Calculator
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('destinations')} className="hover:text-[#FF6B00] transition-colors">
                  Supported Countries
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('services')} className="hover:text-[#FF6B00] transition-colors">
                  All Courier Services
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('blog')} className="hover:text-[#FF6B00] transition-colors">
                  Customs Guides & News
                </button>
              </li>
            </ul>
          </div>

          {/* Popular International Lanes */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider font-mono">
              Popular Routes
            </h4>
            <ul className="space-y-1.5 text-xs">
              {activeCountries.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => setCurrentTab('destinations')}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <span>{c.flag}</span>
                    <span>Dhaka → {c.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Bangladesh Booking Hubs */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider font-mono">
              Bangladesh Hubs
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div>
                <strong className="text-white block">Dhaka Airport Export Terminal</strong>
                <span className="text-[11px] text-slate-400">Cargo Village, HSIA, Kurmitola</span>
              </div>
              <div>
                <strong className="text-white block">Gulshan Executive Booking Desk</strong>
                <span className="text-[11px] text-slate-400">Navana Tower, Gulshan-1</span>
              </div>
              <div>
                <strong className="text-white block">Chittagong Port Branch</strong>
                <span className="text-[11px] text-slate-400">Agrabad Commercial Area</span>
              </div>
              <div>
                <strong className="text-white block">Sylhet Expatriate Care Desk</strong>
                <span className="text-[11px] text-slate-400">Zindabazar Point</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer */}
      <div className="border-t border-slate-900 bg-slate-950 py-6 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            © {new Date().getFullYear()} <strong>YOUR PARCEL</strong>. All rights reserved. Registered under Bangladesh Post & Telecommunications Regulatory Framework.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentTab('contact')}
              className="hover:text-slate-300 transition-colors"
            >
              Contact Operations
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('blog')}
              className="hover:text-slate-300 transition-colors"
            >
              Shipping Advice
            </button>
            <span>•</span>
            <button
              onClick={() => setCurrentTab('admin')}
              className="hover:text-[#FF6B00] flex items-center gap-1 transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
