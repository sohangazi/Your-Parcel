import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { QuoteRequest } from '../../types';
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Phone,
  MessageSquare,
  ArrowRight,
  Package,
  Search,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdminQuotes: React.FC = () => {
  const { quoteRequests, updateQuoteRequestStatus, convertQuoteToShipment, settings } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [convertingId, setConvertingId] = useState<string | null>(null);
  const [convertedNotice, setConvertedNotice] = useState<string | null>(null);

  const filtered = quoteRequests.filter((q) => {
    const matchesSearch =
      q.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.senderPhone.includes(searchTerm) ||
      q.destinationCountry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleConvert = async (quote: QuoteRequest) => {
    setConvertingId(quote.id);
    try {
      const shipment = await convertQuoteToShipment(quote);
      setConvertedNotice(
        `Successfully converted booking into active Shipment: ${shipment.trackingNumber}`
      );
      setTimeout(() => setConvertedNotice(null), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setConvertingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Customer Booking Requests</h1>
          <p className="text-xs text-slate-400">
            Review incoming parcel booking inquiries, approve, or convert directly to active tracking shipments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-3 py-1.5 rounded-xl">
            {quoteRequests.filter((q) => q.status === 'pending').length} Pending Action
          </span>
        </div>
      </div>

      {convertedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="font-bold">{convertedNotice}</span>
          </div>
        </div>
      )}

      {/* Filter strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Search by Customer name, phone, or destination..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
        >
          <option value="all">All Request Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="converted">Converted to Shipment</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Quotes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((quote) => {
          const isPending = quote.status === 'pending';
          const isConverted = quote.status === 'converted';

          return (
            <div
              key={quote.id}
              className={`bg-slate-900 border rounded-3xl p-6 transition-all space-y-4 ${
                isPending
                  ? 'border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">{quote.id}</span>
                  <h3 className="font-bold text-base text-white">{quote.senderName}</h3>
                </div>
                <span
                  className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${
                    isPending
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : isConverted
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {quote.status}
                </span>
              </div>

              {/* Details table */}
              <div className="space-y-2 py-3 border-y border-slate-800/80 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Destination:</span>
                  <span className="font-bold text-amber-400">{quote.destinationCountry}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Parcel Specs:</span>
                  <span className="text-slate-200">
                    {quote.weight} KG • {quote.productName} ({quote.quantity || 1} pcs)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Calculated Charge:</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {settings.currencySymbol || '৳'}{quote.calculatedPrice?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Receiver:</span>
                  <span className="text-slate-200">{quote.receiverName} ({quote.receiverPhone})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pickup Address:</span>
                  <span className="text-slate-300 truncate max-w-[240px]">
                    {quote.senderAddress}, {quote.senderCity || 'Dhaka'}
                  </span>
                </div>
                {quote.description && (
                  <div className="pt-1 text-[11px] text-slate-400 italic">
                    Note: "{quote.description}"
                  </div>
                )}
                {quote.adminNotes && (
                  <div className="pt-1 text-[11px] text-cyan-400 font-mono">
                    Admin: {quote.adminNotes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${quote.senderPhone}`}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-colors"
                    title="Call Customer"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://wa.me/${quote.senderPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 transition-colors"
                    title="WhatsApp Customer"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  {isPending && (
                    <>
                      <button
                        onClick={() => updateQuoteRequestStatus(quote.id, 'rejected', 'Declined by operations')}
                        className="px-3 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-950 text-rose-300 text-xs font-bold border border-rose-800/60 transition-colors"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleConvert(quote)}
                        disabled={convertingId === quote.id}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md shadow-amber-500/20 disabled:opacity-50"
                      >
                        <Package className="w-3.5 h-3.5" />
                        <span>{convertingId === quote.id ? 'Converting...' : 'Convert to Shipment'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-500 text-xs">
            No booking requests found matching criteria.
          </div>
        )}
      </div>
    </div>
  );
};
