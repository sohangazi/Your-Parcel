import React from 'react';
import { useData } from '../../context/DataContext';
import {
  Package,
  Plane,
  Truck,
  CheckCircle2,
  Clock,
  DollarSign,
  Globe2,
  Boxes,
  ClipboardList,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (section: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { shipments, quoteRequests, countries, products, settings } = useData();

  // Metrics
  const totalShipments = shipments.length;
  const inTransit = shipments.filter((s) => s.status === 'in_transit').length;
  const pending = shipments.filter(
    (s) => s.status === 'order_received' || s.status === 'picked_up' || s.status === 'processing'
  ).length;
  const delivered = shipments.filter((s) => s.status === 'delivered').length;
  const cancelled = shipments.filter((s) => s.status === 'cancelled').length;

  const totalRevenue = shipments
    .filter((s) => s.status !== 'cancelled')
    .reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  const pendingQuotes = quoteRequests.filter((q) => q.status === 'pending').length;
  const activeCountries = countries.filter((c) => c.status === 'active').length;
  const activeProducts = products.filter((p) => p.status === 'active').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Operations Command Center</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry of export flights, quotation bookings, and revenue streams from Bangladesh.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('shipments')}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
          >
            <Package className="w-4 h-4" />
            <span>New Shipment</span>
          </button>
          <button
            onClick={() => onNavigate('pricing')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
          >
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span>Manage Pricing</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Shipments</span>
            <Package className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">{totalShipments}</div>
          <div className="text-[11px] text-cyan-400 font-medium">Export waybills manifested</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">In Flight / Transit</span>
            <Plane className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{inTransit}</div>
          <div className="text-[11px] text-slate-400">En route to destination</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Delivered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{delivered}</div>
          <div className="text-[11px] text-emerald-400 font-medium">100% Signed handover</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono">
            {settings.currencySymbol || '৳'}{totalRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400">Consignment bookings</div>
        </div>
      </div>

      {/* Secondary Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigate('quotes')}
          className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Pending Quotes</span>
            <ClipboardList className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1 font-mono">{pendingQuotes}</div>
        </div>

        <div
          onClick={() => onNavigate('countries')}
          className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Active Countries</span>
            <Globe2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1 font-mono">{activeCountries}</div>
        </div>

        <div
          onClick={() => onNavigate('products')}
          className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl cursor-pointer transition-colors"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Parcel Categories</span>
            <Boxes className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1 font-mono">{activeProducts}</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Processing Hubs</span>
            <Truck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl font-bold text-white mt-1 font-mono">4 (DAC/CGP/ZYL)</div>
        </div>
      </div>

      {/* Split Tables: Recent Shipments & Recent Quotes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Shipments */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Recent Active Shipments</h3>
              <p className="text-xs text-slate-400">Latest international waybills created</p>
            </div>
            <button
              onClick={() => onNavigate('shipments')}
              className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {shipments.slice(0, 5).map((s) => (
              <div key={s.id} className="py-3 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-cyan-400">{s.trackingNumber}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                      {s.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300">
                    {s.senderName} → <strong className="text-white">{s.destinationCountry}</strong> ({s.weight} KG)
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-xs text-amber-400">
                    {settings.currencySymbol || '৳'}{s.totalPrice?.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Quote Requests */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Incoming Booking Inquiries</h3>
              <p className="text-xs text-slate-400">Customers awaiting confirmation</p>
            </div>
            <button
              onClick={() => onNavigate('quotes')}
              className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Manage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {quoteRequests.slice(0, 5).map((q) => (
              <div key={q.id} className="py-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{q.senderName}</span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      q.status === 'pending'
                        ? 'bg-amber-950 text-amber-300'
                        : q.status === 'converted'
                        ? 'bg-emerald-950 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {q.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {q.destinationCountry} • {q.weight} KG {q.productName}
                </div>
                <div className="text-[11px] text-cyan-400 font-mono">
                  Tel: {q.senderPhone}
                </div>
              </div>
            ))}
            {quoteRequests.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-500">No booking requests logged yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
