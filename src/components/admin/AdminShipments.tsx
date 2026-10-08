import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Shipment, ShipmentStatus } from '../../types';
import {
  Package,
  Search,
  Plus,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Plane,
  X,
  Edit2,
  Printer,
  ChevronDown,
  ChevronRight,
  Filter,
} from 'lucide-react';

export const AdminShipments: React.FC = () => {
  const { shipments, saveShipment, updateShipmentStatus, countries, products, settings } = useData();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [countryFilter, setCountryFilter] = useState<string>('all');

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [advancingStatusShipment, setAdvancingStatusShipment] = useState<Shipment | null>(null);

  // Status advance form
  const [newStatus, setNewStatus] = useState<ShipmentStatus>('in_transit');
  const [newLocation, setNewLocation] = useState('');
  const [newNote, setNewNote] = useState('');

  // Create form state
  const [trackingNumber, setTrackingNumber] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [senderCity, setSenderCity] = useState('Dhaka');

  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [destCountry, setDestCountry] = useState('Malaysia');

  const [selectedProductId, setSelectedProductId] = useState('p-doc');
  const [weight, setWeight] = useState(1);
  const [totalPrice, setTotalPrice] = useState(1500);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>('paid');
  const [paymentMethod, setPaymentMethod] = useState('bKash Merchant');
  const [initialStatus, setInitialStatus] = useState<ShipmentStatus>('order_received');

  // Filtered List
  const filtered = shipments.filter((s) => {
    const matchesSearch =
      s.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.receiverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destinationCountry.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    const matchesCountry = countryFilter === 'all' || s.destinationCountry === countryFilter;

    return matchesSearch && matchesStatus && matchesCountry;
  });

  const handleOpenCreate = () => {
    const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
    setTrackingNumber(`YP${randomDigits}BD`);
    setSenderName('');
    setSenderPhone('');
    setSenderAddress('');
    setReceiverName('');
    setReceiverPhone('');
    setReceiverAddress('');
    setWeight(1);
    setTotalPrice(1500);
    setShowCreateModal(true);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find((p) => p.id === selectedProductId);
    const country = countries.find((c) => c.name === destCountry);

    const newShip: Shipment = {
      id: `ship-${Date.now()}`,
      trackingNumber,
      senderName,
      senderPhone,
      senderEmail: senderEmail || 'client@yourparcel.com',
      senderAddress,
      senderCity,
      receiverName,
      receiverPhone,
      receiverEmail: receiverEmail || 'client@yourparcel.com',
      receiverAddress,
      destinationCountry: destCountry,
      destinationCountryCode: country?.code || 'INT',
      productId: selectedProductId,
      productName: prod?.name || 'Package',
      weight,
      quantity: 1,
      totalPrice,
      currency: 'BDT',
      paymentStatus,
      paymentMethod,
      status: initialStatus,
      currentLocation: `${senderCity} Central Hub, Bangladesh`,
      estimatedDelivery: 'In 3-5 Business Days',
      events: [
        {
          id: `ev-${Date.now()}`,
          status: initialStatus,
          title: 'Shipment Created and Booked',
          location: `${senderCity} Central Operations Hub`,
          note: 'Waybill officially recorded in international air system.',
          timestamp: new Date().toLocaleString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await saveShipment(newShip);
    setShowCreateModal(false);
  };

  const handleAdvanceStatusSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (advancingStatusShipment) {
      await updateShipmentStatus(
        advancingStatusShipment.id,
        newStatus,
        newLocation || advancingStatusShipment.currentLocation,
        newNote
      );
      setAdvancingStatusShipment(null);
      setNewLocation('');
      setNewNote('');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Title & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Shipment & Consignment Management</h1>
          <p className="text-xs text-slate-400">
            Control live status progressions, tracking events, and consignment waybills.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Waybill</span>
        </button>
      </div>

      {/* Filters Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <input
            type="text"
            placeholder="Search by Waybill (YP...), Sender, Receiver, or Country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Statuses</option>
            <option value="order_received">Order Received</option>
            <option value="picked_up">Picked Up</option>
            <option value="processing">Processing</option>
            <option value="in_transit">In Transit</option>
            <option value="arrived_destination">Arrived Destination</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
          >
            <option value="all">All Destination Countries</option>
            {countries.map((c) => (
              <option key={c.id} value={c.name}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] font-mono border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Tracking / Date</th>
                <th className="py-3.5 px-5">Shipper (Origin)</th>
                <th className="py-3.5 px-5">Consignee (Dest)</th>
                <th className="py-3.5 px-5">Product & Weight</th>
                <th className="py-3.5 px-5">Price / Payment</th>
                <th className="py-3.5 px-5">Current Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300 font-medium">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-850/50 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-mono font-bold text-cyan-400">{s.trackingNumber}</div>
                    <div className="text-[10px] text-slate-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="font-bold text-white">{s.senderName}</div>
                    <div className="text-[11px] text-slate-400">{s.senderCity || 'Dhaka'} • {s.senderPhone}</div>
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="font-bold text-white">{s.receiverName}</div>
                    <div className="text-[11px] text-amber-400">{s.destinationCountry}</div>
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="text-white">{s.productName}</div>
                    <div className="font-mono text-[11px] text-slate-400">{s.weight} KG</div>
                  </td>

                  <td className="py-3.5 px-5">
                    <div className="font-mono font-bold text-amber-400">
                      {settings.currencySymbol || '৳'}{s.totalPrice?.toLocaleString()}
                    </div>
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        s.paymentStatus === 'paid' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                      }`}
                    >
                      {s.paymentStatus}
                    </span>
                  </td>

                  <td className="py-3.5 px-5">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        s.status === 'delivered'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : s.status === 'in_transit'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      }`}
                    >
                      {s.status.replace(/_/g, ' ')}
                    </span>
                    <div className="text-[10px] text-slate-500 truncate max-w-[150px] mt-0.5">
                      {s.currentLocation}
                    </div>
                  </td>

                  <td className="py-3.5 px-5 text-right space-x-2">
                    <button
                      onClick={() => {
                        setAdvancingStatusShipment(s);
                        setNewStatus(s.status);
                        setNewLocation(s.currentLocation);
                        setNewNote('');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-colors"
                    >
                      Advance Status
                    </button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-slate-500">
                    No shipments match the selected criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advance Status Modal */}
      {advancingStatusShipment && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 text-white space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base">
                Advance Tracking: <span className="font-mono text-cyan-400">{advancingStatusShipment.trackingNumber}</span>
              </h3>
              <button
                onClick={() => setAdvancingStatusShipment(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdvanceStatusSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-bold">New Shipment Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ShipmentStatus)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                >
                  <option value="order_received">Order Received</option>
                  <option value="picked_up">Parcel Picked Up</option>
                  <option value="processing">Processing at Export Hub</option>
                  <option value="in_transit">In Transit (Air Cargo Flight)</option>
                  <option value="arrived_destination">Arrived at Destination Airport</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered & Signed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Current Physical Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sepang Cargo Hub, KLIA Airport, Malaysia"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-bold">Customs / Dispatch Event Note</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Inbound customs inspection passed. Dispatched to local regional sorting unit."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdvancingStatusShipment(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Update Status & Sync Firebase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Shipment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-lg">Generate International Waybill</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-mono">Assigned Waybill:</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">{trackingNumber}</span>
              </div>

              {/* Sender & Receiver */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-cyan-400">Sender (Bangladesh)</span>
                  <input
                    type="text"
                    required
                    placeholder="Sender Name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Address in BD"
                    value={senderAddress}
                    onChange={(e) => setSenderAddress(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5"
                  />
                </div>

                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-amber-400">Receiver (Abroad)</span>
                  <input
                    type="text"
                    required
                    placeholder="Receiver Name"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5"
                  />
                  <input
                    type="tel"
                    required
                    placeholder="Phone"
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Destination Address"
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5"
                  />
                </div>
              </div>

              {/* Destination & Goods */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Destination Country</label>
                  <select
                    value={destCountry}
                    onChange={(e) => setDestCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2"
                  >
                    {countries.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Product</label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Weight (KG)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0.5)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 font-mono"
                  />
                </div>
              </div>

              {/* Price & Initial Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Total Charge (BDT)</label>
                  <input
                    type="number"
                    value={totalPrice}
                    onChange={(e) => setTotalPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Payment Status</label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2"
                  >
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Initial Status</label>
                  <select
                    value={initialStatus}
                    onChange={(e) => setInitialStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2"
                  >
                    <option value="order_received">Order Received</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="processing">Processing</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold"
                >
                  Save Waybill to Firestore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
