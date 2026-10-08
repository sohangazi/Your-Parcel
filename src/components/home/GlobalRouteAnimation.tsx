import React, { useState, useEffect } from 'react';
import { Plane, Compass, Globe, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface RouteDestination {
  id: string;
  name: string;
  country: string;
  code: string;
  flag: string;
  x: number; // percentage in SVG coordinate space
  y: number;
  curveControlY: number;
  flightTime: string;
  dailyFlights: string;
}

const DESTINATIONS: RouteDestination[] = [
  {
    id: 'my',
    name: 'Kuala Lumpur',
    country: 'Malaysia',
    code: 'MY',
    flag: '🇲🇾',
    x: 64,
    y: 65,
    curveControlY: 48,
    flightTime: '3-5 Days Express',
    dailyFlights: 'Daily Air Cargo MH/BG',
  },
  {
    id: 'sa',
    name: 'Riyadh',
    country: 'Saudi Arabia',
    code: 'SA',
    flag: '🇸🇦',
    x: 35,
    y: 52,
    curveControlY: 30,
    flightTime: '4-6 Days Express',
    dailyFlights: 'SV Cargo Direct',
  },
  {
    id: 'ae',
    name: 'Dubai',
    country: 'UAE',
    code: 'AE',
    flag: '🇦🇪',
    x: 42,
    y: 48,
    curveControlY: 28,
    flightTime: '3-4 Days Priority',
    dailyFlights: 'Emirates SkyCargo 2x Daily',
  },
  {
    id: 'gb',
    name: 'London',
    country: 'United Kingdom',
    code: 'GB',
    flag: '🇬🇧',
    x: 22,
    y: 28,
    curveControlY: 8,
    flightTime: '3-5 Days Express',
    dailyFlights: 'Biman/BA Express Gate',
  },
  {
    id: 'us',
    name: 'New York',
    country: 'USA',
    code: 'US',
    flag: '🇺🇸',
    x: 8,
    y: 34,
    curveControlY: 10,
    flightTime: '4-6 Days Air Freight',
    dailyFlights: 'JFK Dedicated Transshipment',
  },
  {
    id: 'au',
    name: 'Sydney',
    country: 'Australia',
    code: 'AU',
    flag: '🇦🇺',
    x: 85,
    y: 80,
    curveControlY: 62,
    flightTime: '4-7 Days Priority',
    dailyFlights: 'SQ/MH Air Corridor',
  },
  {
    id: 'sg',
    name: 'Singapore',
    country: 'Singapore',
    code: 'SG',
    flag: '🇸🇬',
    x: 68,
    y: 68,
    curveControlY: 52,
    flightTime: '2-4 Days Superfast',
    dailyFlights: 'Changi Direct Priority',
  },
  {
    id: 'ca',
    name: 'Toronto',
    country: 'Canada',
    code: 'CA',
    flag: '🇨🇦',
    x: 10,
    y: 22,
    curveControlY: 4,
    flightTime: '4-7 Days Air Freight',
    dailyFlights: 'Air Canada / Biman Corridors',
  },
];

// Origin: Dhaka, Bangladesh
const DHAKA_ORIGIN = { x: 55, y: 50 };

export const GlobalRouteAnimation: React.FC = () => {
  const [activeDest, setActiveDest] = useState<RouteDestination>(DESTINATIONS[0]);

  // Auto cycle active destination for demonstration
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDest((prev) => {
        const currentIndex = DESTINATIONS.findIndex((d) => d.id === prev.id);
        const nextIndex = (currentIndex + 1) % DESTINATIONS.length;
        return DESTINATIONS[nextIndex];
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#140C2C] via-[#0F0822] to-[#0A0518] p-6 border border-purple-900/40 shadow-2xl overflow-hidden">
      {/* Background World Grid Overlay */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#7c5cfc_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Header telemetry */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-900/30">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] animate-ping" />
          <span className="text-xs uppercase tracking-widest text-[#FF6B00] font-mono font-bold">
            Live Global Route Network
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <span className="text-slate-300">
            ORIGIN: <strong className="text-emerald-400">DHAKA (DAC), BANGLADESH</strong>
          </span>
          <span className="hidden sm:inline">→</span>
          <span className="text-slate-300 hidden sm:inline">
            DESTINATION: <strong className="text-[#FF6B00]">{activeDest.name.toUpperCase()} ({activeDest.code})</strong>
          </span>
        </div>
      </div>

      {/* SVG Canvas for Map and Arcs */}
      <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] my-2 select-none overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full preserve-3d overflow-hidden"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Linear gradient for route lines */}
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C5CFC" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#9333EA" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FF6B00" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="activeRouteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C5CFC" />
              <stop offset="50%" stopColor="#FF7700" />
              <stop offset="100%" stopColor="#FF5A00" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* World Lat/Long contour lines */}
          <line x1="0" y1="25" x2="100" y2="25" stroke="#1e293b" strokeWidth="0.2" strokeDasharray="1,2" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" strokeWidth="0.3" strokeDasharray="1,2" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#1e293b" strokeWidth="0.2" strokeDasharray="1,2" />
          <line x1="25" y1="0" x2="25" y2="100" stroke="#1e293b" strokeWidth="0.2" strokeDasharray="1,2" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" strokeWidth="0.2" strokeDasharray="1,2" />
          <line x1="75" y1="0" x2="75" y2="100" stroke="#1e293b" strokeWidth="0.2" strokeDasharray="1,2" />

          {/* Render Route Arcs from Dhaka to all destinations */}
          {DESTINATIONS.map((dest) => {
            const isActive = dest.id === activeDest.id;
            // Quadratic bezier curve from Dhaka to destination
            const pathD = `M ${DHAKA_ORIGIN.x} ${DHAKA_ORIGIN.y} Q ${(DHAKA_ORIGIN.x + dest.x) / 2} ${dest.curveControlY} ${dest.x} ${dest.y}`;

            return (
              <g key={dest.id} className="transition-all duration-300">
                {/* Background route path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={isActive ? '#38bdf8' : '#334155'}
                  strokeWidth={isActive ? '0.8' : '0.25'}
                  strokeDasharray={isActive ? '2,1' : '1,2'}
                  className={isActive ? 'animate-pulse' : 'opacity-40'}
                  filter={isActive ? 'url(#glow)' : undefined}
                />

                {/* Animated traveling dash line for active route */}
                {isActive && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#activeRouteGradient)"
                    strokeWidth="1.1"
                    strokeDasharray="4,6"
                    className="transition-all"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="100"
                      to="0"
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  </path>
                )}
              </g>
            );
          })}

          {/* Origin Hub Marker: Dhaka, Bangladesh */}
          <g transform={`translate(${DHAKA_ORIGIN.x}, ${DHAKA_ORIGIN.y})`}>
            {/* Outer radar ripple */}
            <circle r="4" fill="none" stroke="#10b981" strokeWidth="0.3" opacity="0.6">
              <animate attributeName="r" from="1" to="8" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="2.2" fill="#10b981" opacity="0.3" />
            <circle r="1.3" fill="#10b981" stroke="#ffffff" strokeWidth="0.4" />
          </g>

          {/* Destination Nodes */}
          {DESTINATIONS.map((dest) => {
            const isActive = dest.id === activeDest.id;
            return (
              <g
                key={dest.id}
                transform={`translate(${dest.x}, ${dest.y})`}
                onClick={() => setActiveDest(dest)}
                className="cursor-pointer group"
              >
                {isActive && (
                  <circle r="3.5" fill="none" stroke="#f59e0b" strokeWidth="0.4">
                    <animate attributeName="r" from="1.5" to="6" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="1" to="0" dur="1.8s" repeatCount="indefinite" />
                  </circle>
                )}
                <circle
                  r={isActive ? '1.8' : '1.1'}
                  fill={isActive ? '#f59e0b' : '#64748b'}
                  stroke="#ffffff"
                  strokeWidth="0.3"
                  className="transition-all duration-300 group-hover:scale-125"
                />
              </g>
            );
          })}
        </svg>

        {/* Origin Label Floating Overlay */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-8 pointer-events-none"
          style={{ left: `${DHAKA_ORIGIN.x}%`, top: `${DHAKA_ORIGIN.y}%` }}
        >
          <div className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 shadow-lg backdrop-blur-sm whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            🇧🇩 DHAKA CENTRAL HUB
          </div>
        </div>

        {/* Active Destination Tooltip Card */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-12 transition-all duration-500 z-20 pointer-events-none"
          style={{ left: `${activeDest.x}%`, top: `${activeDest.y}%` }}
        >
          <div className="bg-slate-900/95 border border-amber-500/60 text-white px-3 py-1.5 rounded-lg shadow-xl backdrop-blur-md text-xs whitespace-nowrap flex items-center gap-2">
            <span className="text-base">{activeDest.flag}</span>
            <div>
              <p className="font-bold text-amber-300 flex items-center gap-1">
                {activeDest.name}, {activeDest.country}
              </p>
              <p className="text-[10px] text-slate-300 font-mono">
                {activeDest.flightTime} • {activeDest.dailyFlights}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Destination Quick Selector Buttons */}
      <div className="relative z-10 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-slate-400 font-medium">Direct Express Corridors:</span>
        <div className="flex flex-wrap gap-1.5">
          {DESTINATIONS.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDest(d)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-1 ${
                activeDest.id === d.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-850 hover:text-white border border-slate-700/60'
              }`}
            >
              <span>{d.flag}</span>
              <span>{d.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
