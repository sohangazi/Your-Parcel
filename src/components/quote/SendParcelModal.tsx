import React, { useState, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { calculateShippingPrice } from '../../utils/pricingEngine';
import {
  X,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Scale,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Copy,
  Check,
  ShieldCheck,
  Plane,
} from 'lucide-react';

interface SendParcelModalProps {
  isOpen: boolean;
  onClose: () => void;
  preset?: {
    destinationCountryId: string;
    productId: string;
    weight: number;
    quantity: number;
    lengthCm?: number;
    widthCm?: number;
    heightCm?: number;
    calculatedPrice: number;
  };
}

export const SendParcelModal: React.FC<SendParcelModalProps> = ({
  isOpen,
  onClose,
  preset,
}) => {
  const { countries, products, pricingRules, submitQuoteRequest, settings } = useData();

  const activeCountries = useMemo(() => countries.filter((c) => c.status === 'active'), [countries]);
  const activeProducts = useMemo(() => products.filter((p) => p.status === 'active'), [products]);

  // Form State
  const [step, setStep] = useState<1 | 2>(1);
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [senderCity, setSenderCity] = useState('Dhaka');

  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverEmail, setReceiverEmail] = useState('');
  const [receiverAddress, setReceiverAddress] = useState('');
  const [destinationCountryId, setDestinationCountryId] = useState(
    preset?.destinationCountryId || 'c-my'
  );

  const [productId, setProductId] = useState(preset?.productId || 'p-doc');
  const [weight, setWeight] = useState(preset?.weight || 1);
  const [quantity, setQuantity] = useState(preset?.quantity || 1);
  const [dimensions, setDimensions] = useState(
    preset?.lengthCm ? `${preset.lengthCm}x${preset.widthCm}x${preset.heightCm} cm` : ''
  );
  const [description, setDescription] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successQuoteId, setSuccessQuoteId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Selected Country & Product
  const selectedCountry = useMemo(
    () => activeCountries.find((c) => c.id === destinationCountryId) || activeCountries[0],
    [activeCountries, destinationCountryId]
  );

  const filteredProducts = useMemo(() => {
    if (!selectedCountry) return activeProducts;
    if (selectedCountry.availableProductIds && selectedCountry.availableProductIds.length > 0) {
      return activeProducts.filter((p) => selectedCountry.availableProductIds.includes(p.id));
    }
    return activeProducts;
  }, [selectedCountry, activeProducts]);

  const selectedProduct = useMemo(
    () => filteredProducts.find((p) => p.id === productId) || filteredProducts[0],
    [filteredProducts, productId]
  );

  // Live dynamic rate
  const calculation = useMemo(() => {
    return calculateShippingPrice({
      country: selectedCountry,
      product: selectedProduct,
      weight,
      quantity,
      pricingRules,
      currencySymbol: settings.currencySymbol || '৳',
    });
  }, [selectedCountry, selectedProduct, weight, quantity, pricingRules, settings.currencySymbol]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!senderName || !senderPhone || !receiverName || !receiverPhone || !receiverAddress) {
      setErrorMessage('Please fill in all required sender and receiver fields.');
      return;
    }

    if (!selectedCountry || !selectedProduct) {
      setErrorMessage('Please select a destination country and parcel type.');
      return;
    }

    setIsSubmitting(true);
    try {
      const quoteId = await submitQuoteRequest({
        senderName,
        senderPhone,
        senderEmail: senderEmail || 'not-provided@client.com',
        senderAddress,
        senderCity,
        receiverName,
        receiverPhone,
        receiverEmail: receiverEmail || 'not-provided@client.com',
        receiverAddress,
        destinationCountry: selectedCountry.name,
        destinationCountryCode: selectedCountry.code,
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        weight,
        quantity,
        dimensions: dimensions || 'Standard Carton',
        description: description || `${selectedProduct.name} personal parcel`,
        calculatedPrice: calculation.totalPrice,
        currency: 'BDT',
      });

      setSuccessQuoteId(quoteId);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage('Failed to submit booking. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (successQuoteId) {
      navigator.clipboard.writeText(successQuoteId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-white relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {successQuoteId ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-2xl font-black text-white">Booking Request Received!</h3>
              <p className="text-sm text-slate-300 mt-1 max-w-md mx-auto">
                Your parcel booking has been recorded in our central operations desk. An agent will contact you shortly to confirm doorstep collection.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 max-w-sm mx-auto flex items-center justify-between gap-3">
              <div className="text-left">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Reference Request ID</span>
                <span className="font-mono font-bold text-cyan-400 text-sm">{successQuoteId}</span>
              </div>
              <button
                onClick={handleCopyId}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Copy ID"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="text-xs text-slate-400 space-y-1">
              <div>Destination: <strong className="text-amber-400">{selectedCountry?.name}</strong></div>
              <div>Estimated Charge: <strong className="text-white">{settings.currencySymbol || '৳'}{calculation.totalPrice.toLocaleString()}</strong></div>
              <div>Hotline Support: <strong className="text-cyan-400">{settings.hotline}</strong></div>
            </div>

            <div className="pt-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Multi-Step Booking Form */
          <div>
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-1">
                <Package className="w-4 h-4" />
                <span>Step {step} of 2 • International Parcel Dispatch</span>
              </div>
              <h2 className="text-2xl font-black text-white">
                {step === 1 ? '1. Sender & Receiver Information' : '2. Parcel Details & Rate Confirmation'}
              </h2>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 ? (
                /* Step 1: Parties */
                <div className="space-y-4">
                  {/* Sender Section */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Sender in Bangladesh (Pickup)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Kabir Hossain"
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Phone Number (+880) *</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. 01712345678"
                          value={senderPhone}
                          onChange={(e) => setSenderPhone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Pickup City in BD</label>
                        <select
                          value={senderCity}
                          onChange={(e) => setSenderCity(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                        >
                          <option value="Dhaka">Dhaka</option>
                          <option value="Chittagong">Chittagong</option>
                          <option value="Sylhet">Sylhet</option>
                          <option value="Rajshahi">Rajshahi</option>
                          <option value="Khulna">Khulna</option>
                          <option value="Cumilla">Cumilla</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-slate-400 mb-1">Street Address for Pickup *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. House 14, Road 5, Dhanmondi"
                          value={senderAddress}
                          onChange={(e) => setSenderAddress(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Receiver Section */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Receiver Abroad (Consignee)</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Receiver Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Farhan Rahman"
                          value={receiverName}
                          onChange={(e) => setReceiverName(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Receiver Mobile / WhatsApp *</label>
                        <input
                          type="tel"
                          required
                          placeholder="e.g. +60123456789"
                          value={receiverPhone}
                          onChange={(e) => setReceiverPhone(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Destination Country *</label>
                        <select
                          value={destinationCountryId}
                          onChange={(e) => setDestinationCountryId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                        >
                          {activeCountries.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.flag} {c.name} ({c.code})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Full Destination Address *</label>
                        <input
                          type="text"
                          required
                          placeholder="Street, City, Postal Code"
                          value={receiverAddress}
                          onChange={(e) => setReceiverAddress(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (!senderName || !senderPhone || !receiverName || !receiverPhone || !receiverAddress) {
                          setErrorMessage('Please fill in required sender and receiver contact details.');
                          return;
                        }
                        setErrorMessage(null);
                        setStep(2);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <span>Next: Parcel Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 2: Parcel Specs & Confirmation */
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Parcel Category *</label>
                        <select
                          value={productId}
                          onChange={(e) => setProductId(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                        >
                          {filteredProducts.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Scale Weight (KG) *</label>
                        <input
                          type="number"
                          step="0.5"
                          min="0.1"
                          max="150"
                          value={weight}
                          onChange={(e) => setWeight(parseFloat(e.target.value) || 0.5)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Quantity of Parcels</label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Dimensions (e.g. 30x20x15 cm)</label>
                        <input
                          type="text"
                          placeholder="Optional (L x W x H)"
                          value={dimensions}
                          onChange={(e) => setDimensions(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">Detailed Description of Goods</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. 2 Jamdani Sharees and 1 Panjabi as personal family gift."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none resize-none"
                      />
                    </div>
                  </div>

                  {/* Dynamic Rate Summary from Firebase */}
                  <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-cyan-400 block">
                        Estimated Shipping Rate (Firebase Verified)
                      </span>
                      <div className="text-2xl font-black text-amber-400">
                        {settings.currencySymbol || '৳'}{calculation.totalPrice.toLocaleString()} BDT
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {selectedCountry?.name} • {calculation.chargeableWeight} KG • {selectedCountry?.estimatedDays}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Tamper-Proof Guarantee</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
                    >
                      <span>{isSubmitting ? 'Recording Booking...' : 'Confirm & Request Pickup'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
