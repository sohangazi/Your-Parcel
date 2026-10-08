import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Shipment, ShipmentStatus } from '../../types';
import {
  Search,
  Package,
  CheckCircle2,
  Clock,
  MapPin,
  Plane,
  Truck,
  Building,
  User,
  AlertCircle,
  Printer,
  Share2,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';

interface TrackingViewProps {
  initialTrackingNumber?: string;
  onClose?: () => void;
}

const TIMELINE_STEPS: { status: ShipmentStatus; label: string; icon: any }[] = [
  { status: 'order_received', label: 'Order Received', icon: Package },
  { status: 'picked_up', label: 'Picked Up', icon: Truck },
  { status: 'processing', label: 'Processing', icon: Building },
  { status: 'in_transit', label: 'In Transit', icon: Plane },
  { status: 'arrived_destination', label: 'Arrived at Destination', icon: MapPin },
  { status: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle2 },
];

const STATUS_PROGRESS: Record<ShipmentStatus, number> = {
  order_received: 1,
  picked_up: 2,
  processing: 3,
  in_transit: 4,
  arrived_destination: 5,
  out_for_delivery: 6,
  delivered: 7,
  cancelled: 0,
};

export const TrackingView: React.FC<TrackingViewProps> = ({
  initialTrackingNumber = 'YP8840291BD',
  onClose,
}) => {
  const { shipments, findShipmentByTrackingNumber, settings } = useData();
  const [searchInput, setSearchInput] = useState(initialTrackingNumber);
  const [activeTrackingNumber, setActiveTrackingNumber] = useState(initialTrackingNumber);
  const [copied, setCopied] = useState(false);

  // Live lookup from Firebase via context
  const shipment = findShipmentByTrackingNumber(activeTrackingNumber);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveTrackingNumber(searchInput.trim().toUpperCase());
    }
  };

  const handleCopy = () => {
    if (shipment?.trackingNumber) {
      navigator.clipboard.writeText(shipment.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const currentStepNumber = shipment ? STATUS_PROGRESS[shipment.status] || 1 : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Header & Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="text-xs uppercase font-extrabold tracking-widest text-cyan-400 mb-1">
                REAL-TIME AIRWAY TRACKING
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">Track Your International Parcel</h1>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
              >
                Close Tracking
              </button>
            )}
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter Consignment or Tracking Number (e.g. YP8840291BD)..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-12 pr-4 py-3.5 text-sm sm:text-base text-white placeholder-slate-500 font-mono tracking-wider focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 shadow-inner"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Track Now</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Tracking Chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span>Quick Live Examples:</span>
            {['YP8840291BD', 'YP9918234BD', 'YP7721540BD'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setSearchInput(num);
                  setActiveTrackingNumber(num);
                }}
                className={`font-mono px-2.5 py-1 rounded-lg border transition-colors ${
                  activeTrackingNumber === num
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Tracking Details Result */}
        {shipment ? (
          <div className="space-y-6">
            {/* Status Summary Banner */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl sm:text-2xl font-mono font-black text-cyan-400">
                      {shipment.trackingNumber}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                      title="Copy Tracking Number"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {shipment.paymentStatus === 'paid' ? 'Paid & Verified' : 'Payment Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Route: <strong className="text-slate-200">{shipment.senderCity || 'Dhaka'}, Bangladesh</strong> → <strong className="text-amber-400">{shipment.destinationCountry}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Waybill</span>
                  </button>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 font-medium">Estimated Delivery</div>
                    <div className="text-sm font-bold text-emerald-400">{shipment.estimatedDelivery}</div>
                  </div>
                </div>
              </div>

              {/* Current Status Highlight */}
              <div className="py-6 flex flex-wrap items-center justify-between gap-4 bg-slate-950/60 -mx-6 sm:-mx-8 px-6 sm:px-8 my-6 border-y border-slate-800/80">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Plane className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">Current Milestone</div>
                    <div className="text-lg font-black text-white capitalize">
                      {shipment.status.replace(/_/g, ' ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800">
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>{shipment.currentLocation}</span>
                </div>
              </div>

              {/* Visual 7-Step Progress Stepper */}
              <div className="pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
                  Delivery Progress Pipeline
                </div>

                <div className="relative">
                  {/* Connecting line */}
                  <div className="hidden lg:block absolute top-1/2 left-6 right-6 h-1 bg-slate-800 -translate-y-1/2 z-0" />
                  <div
                    className="hidden lg:block absolute top-1/2 left-6 h-1 bg-gradient-to-r from-cyan-500 via-amber-400 to-emerald-500 -translate-y-1/2 z-0 transition-all duration-700"
                    style={{
                      width: `${Math.min(100, Math.max(0, ((currentStepNumber - 1) / (TIMELINE_STEPS.length - 1)) * 100))}%`,
                    }}
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 relative z-10">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const stepNumber = idx + 1;
                      const isCompleted = stepNumber < currentStepNumber;
                      const isCurrent = stepNumber === currentStepNumber;
                      const StepIcon = step.icon;

                      return (
                        <div key={step.status} className="flex flex-col items-center text-center">
                          <div
                            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all mb-2.5 shadow-md ${
                              isCurrent
                                ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/30 scale-110 font-bold'
                                : isCompleted
                                ? 'bg-emerald-500 text-slate-950 font-bold'
                                : 'bg-slate-800 text-slate-500 border border-slate-700'
                            }`}
                          >
                            <StepIcon className="w-5 h-5" />
                          </div>
                          <span
                            className={`text-xs font-bold leading-tight ${
                              isCurrent
                                ? 'text-amber-400'
                                : isCompleted
                                ? 'text-slate-200'
                                : 'text-slate-500'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Split Details & Event Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Consignment Info */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Package className="w-4 h-4 text-cyan-400" />
                  <span>Consignment Specifications</span>
                </h3>

                <div className="space-y-3.5 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Parcel Type</span>
                    <span className="font-bold text-white">{shipment.productName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Scale Weight</span>
                    <span className="font-mono font-bold text-cyan-300">{shipment.weight} KG</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Dimensions</span>
                    <span className="font-mono text-slate-300">{shipment.dimensions || 'Standard Carton'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Consignment Value / Price</span>
                    <span className="font-bold text-amber-400">{settings.currencySymbol || '৳'}{shipment.totalPrice?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Payment Channel</span>
                    <span className="font-medium text-slate-300">{shipment.paymentMethod}</span>
                  </div>
                </div>

                {/* Shipper & Consignee */}
                <div className="pt-2 space-y-4">
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Shipper (Bangladesh)
                    </div>
                    <div className="font-bold text-white">{shipment.senderName}</div>
                    <div className="text-slate-400">{shipment.senderAddress}, {shipment.senderCity || 'Dhaka'}</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Consignee (Destination)
                    </div>
                    <div className="font-bold text-white">{shipment.receiverName}</div>
                    <div className="text-slate-400">{shipment.receiverAddress}, {shipment.destinationCountry}</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Tracking History Events */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Real-Time Milestone Log</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    {shipment.events?.length || 0} Checkpoints
                  </span>
                </div>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {shipment.events && shipment.events.length > 0 ? (
                    [...shipment.events].reverse().map((event, i) => (
                      <div key={event.id || i} className="relative group">
                        {/* Dot */}
                        <div
                          className={`absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 transition-colors ${
                            i === 0
                              ? 'bg-amber-400 ring-4 ring-amber-400/20'
                              : 'bg-cyan-500'
                          }`}
                        />

                        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 transition-colors group-hover:border-slate-700">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                            <span className="font-bold text-sm text-white">{event.title}</span>
                            <span className="text-[11px] font-mono text-slate-400">{event.timestamp}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-mono mb-1">
                            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{event.location}</span>
                          </div>

                          {event.note && (
                            <p className="text-xs text-slate-300 leading-relaxed mt-2 pt-2 border-t border-slate-900">
                              {event.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-500 italic py-4">No events logged yet.</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty / Not Found State */
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">We Couldn't Find a Shipment With This Tracking Number</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Please double check the consignment ID on your receipt, or try one of our active demo tracking IDs above (e.g. <strong>YP8840291BD</strong>).
            </p>
            <div className="pt-2">
              <a
                href={`https://wa.me/${(settings.whatsappNumber || '').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors"
              >
                <span>Need assistance? Chat with Operations on WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
