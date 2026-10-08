import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth, AUTHORIZED_SUPER_ADMIN_EMAIL } from '../../context/AuthContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  ArrowRight,
  Search,
  Phone,
  ShieldCheck,
  Menu,
  X,
  Lock,
  Sparkles,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openSendModal: () => void;
  openTrackModal: (trackingNum?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openSendModal,
  openTrackModal,
}) => {
  const { settings } = useData();
  const { isAdmin, currentUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickTrackNumber, setQuickTrackNumber] = useState('');

  const handleQuickTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTrackNumber.trim()) {
      openTrackModal(quickTrackNumber.trim());
      setQuickTrackNumber('');
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'pricing', label: 'Pricing & Rates' },
    { id: 'quote', label: 'Quick Quote' },
    { id: 'destinations', label: 'Destinations' },
    { id: 'services', label: 'Services' },
    { id: 'track', label: 'Track Parcel' },
    { id: 'blog', label: 'Shipping Guides' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-purple-900/30 text-white shadow-xl">
      {/* Top micro bar */}
      <div className="bg-[#120B24] border-b border-purple-900/40 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse"></span>
              Live Cargo Departures: Dhaka (DAC) → Global Destinations
            </span>
            <span className="hidden md:inline-block text-purple-900">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <Phone className="w-3 h-3 text-[#FF6B00]" />
              Hotline: <strong className="text-white">{settings.hotline || '16999'}</strong> ({settings.phone})
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded text-[11px] font-medium">
              <ShieldCheck className="w-3 h-3" />
              100% Guaranteed Delivery
            </span>
            <button
              onClick={() => setCurrentTab('admin')}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
                isAdmin
                  ? 'bg-purple-900/60 text-purple-200 border border-purple-500/50 hover:bg-purple-800/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-850'
              }`}
              title="Secure Admin Portal (Restricted to gazisohan37@gmail.com)"
            >
              <Lock className="w-3 h-3 text-[#FF6B00]" />
              {isAdmin ? 'Admin Dashboard (Active)' : 'Admin Portal'}
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with exact visual identity */}
          <div
            onClick={() => setCurrentTab('home')}
            className="cursor-pointer group py-1 flex-shrink min-w-0 pr-2"
          >
            <BrandLogo size="md" showTagline={true} lightText={true} className="hidden sm:inline-flex" />
            <BrandLogo size="sm" showTagline={false} lightText={true} className="inline-flex sm:hidden" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  currentTab === item.id
                    ? 'text-[#FF6B00] bg-purple-950/60 shadow-sm border border-purple-800/60'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Header Quick Tracking & Action CTA */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleQuickTrack} className="relative w-48 xl:w-56">
              <input
                type="text"
                placeholder="Track YP... (e.g. 8840291)"
                value={quickTrackNumber}
                onChange={(e) => setQuickTrackNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] transition-all font-mono"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </form>

            <button
              onClick={openSendModal}
              className="relative group overflow-hidden bg-gradient-to-r from-[#FF6B00] via-[#FF7700] to-[#E65100] hover:from-[#FF7700] hover:to-[#FF5A00] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 flex items-center gap-1.5"
            >
              <span>Send a Parcel</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={openSendModal}
              className="bg-[#FF6B00] text-white font-bold px-3 py-1.5 rounded-lg text-xs"
            >
              Send
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-purple-900/40 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleQuickTrack} className="relative">
            <input
              type="text"
              placeholder="Enter Tracking ID (e.g. YP8840291BD)..."
              value={quickTrackNumber}
              onChange={(e) => setQuickTrackNumber(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 font-mono focus:border-[#FF6B00]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </form>

          <div className="grid grid-cols-2 gap-2 pt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-sm text-left font-medium transition-colors ${
                  currentTab === item.id
                    ? 'bg-purple-900/60 text-[#FF6B00] border border-purple-700/60'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setCurrentTab('admin');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1.5 text-xs text-[#A78BFA] hover:text-[#FF6B00]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal (Restricted)</span>
            </button>
            <span className="text-xs text-slate-400">
              Hotline: <strong className="text-white">{settings.hotline}</strong>
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
