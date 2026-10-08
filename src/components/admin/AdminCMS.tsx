import React, { useState, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { BrandLogo } from '../common/BrandLogo';
import {
  Settings,
  Save,
  CheckCircle2,
  Sparkles,
  Upload,
  Image,
  RefreshCw,
  X,
  FileImage,
  Link as LinkIcon,
  Eye,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const AdminCMS: React.FC = () => {
  const { settings, updateWebsiteSettings } = useData();

  // Logo state
  const [logoUrl, setLogoUrl] = useState<string>(settings.logoUrl || '');
  const [logoType, setLogoType] = useState<'default' | 'image'>(
    settings.logoType === 'image' || (settings.logoUrl && settings.logoType !== 'default') ? 'image' : 'default'
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core brand text state
  const [brandName, setBrandName] = useState(settings.brandName || 'YOUR PARCEL');
  const [tagline, setTagline] = useState(settings.tagline || 'Your parcel, our responsibility.');
  const [heroSubtitle, setHeroSubtitle] = useState(
    settings.heroSubtitle ||
      'Fast, secure and trackable international courier service from Bangladesh to destinations around the world.'
  );
  const [phone, setPhone] = useState(settings.phone || '+880 1819-000000');
  const [hotline, setHotline] = useState(settings.hotline || '16999');
  const [email, setEmail] = useState(settings.email || 'support@yourparcel.com.bd');
  const [address, setAddress] = useState(
    settings.address || 'Level 5, Navana Tower, Gulshan-1, Dhaka-1212, Bangladesh'
  );
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber || '+8801819000000');
  const [noticeBanner, setNoticeBanner] = useState(settings.noticeBanner || '');
  const [noticeBannerActive, setNoticeBannerActive] = useState(settings.noticeBannerActive ?? true);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol || '৳');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Handle local file selection and convert to Base64 data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, SVG, WebP, etc.)');
      return;
    }

    // Check size limit (max 2MB for storage performance)
    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image file is too large. Please select an image under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result as string;
      if (result) {
        setLogoUrl(result);
        setLogoType('image');
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read the image file. Please try another image or URL.');
    };
    reader.readAsDataURL(file);
  };

  const handleResetToDefaultLogo = () => {
    setLogoUrl('');
    setLogoType('default');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    try {
      await updateWebsiteSettings({
        logoUrl: logoType === 'default' ? '' : logoUrl,
        logoType,
        brandName,
        tagline,
        heroSubtitle,
        phone,
        hotline,
        email,
        address,
        whatsappNumber,
        noticeBanner,
        noticeBannerActive,
        currencySymbol,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Website CMS & Logo Customization</h1>
            <span className="text-[10px] font-mono uppercase bg-orange-950 text-orange-400 border border-orange-800 px-2 py-0.5 rounded font-bold">
              Live Real-Time
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            আপলোড করুন আপনার ব্র্যান্ড লোগো, আপডেট করুন যোগাযোগ নম্বর, ঠিকানা ও জরুরি নোটিশ।
          </p>
        </div>

        {success && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-bold animate-in fade-in shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>লোগো এবং সেটিংস সফলভাবে আপডেট ও পাবলিশ হয়েছে!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="bg-[#120B27] border border-purple-900/50 rounded-3xl p-5 sm:p-8 space-y-8 shadow-2xl text-xs">
        {/* SECTION 1: LOGO MANAGEMENT */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-purple-900/40 pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#FF6B00] uppercase tracking-wider flex items-center gap-2">
                <Image className="w-4 h-4 text-[#FF6B00]" />
                <span>1. ব্র্যান্ড লোগো আপডেট ও সেটিংস (Brand Logo Customization)</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                আপনার নিজস্ব লোগো ছবি আপলোড করুন অথবা সরাসরি ইমেজ লিঙ্ক দিন।
              </p>
            </div>
            {logoUrl && (
              <button
                type="button"
                onClick={handleResetToDefaultLogo}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950 hover:bg-purple-900 border border-purple-800 text-purple-300 text-xs font-semibold transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>ডিফল্ট লোগোতে ফেরত যান</span>
              </button>
            )}
          </div>

          {/* Logo Mode Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label
              onClick={() => setLogoType('default')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                logoType === 'default'
                  ? 'bg-purple-900/40 border-[#FF6B00] shadow-md shadow-orange-500/10'
                  : 'bg-slate-950/60 border-purple-900/30 hover:border-purple-700 text-slate-400'
              }`}
            >
              <input
                type="radio"
                name="logoTypeOption"
                checked={logoType === 'default'}
                onChange={() => setLogoType('default')}
                className="mt-1 text-[#FF6B00] focus:ring-[#FF6B00]"
              />
              <div>
                <div className="font-bold text-white text-xs">অরিজিনাল ভেক্টর মনোগ্রাম লোগো (Default YP Vector)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  পেশাদার হাইওয়ে ও অ্যারো সংবলিত প্রিমিয়াম রয়্যাল পার্পল এবং কুরিয়ার অরেঞ্জ কালার থিম।
                </div>
              </div>
            </label>

            <label
              onClick={() => setLogoType('image')}
              className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${
                logoType === 'image'
                  ? 'bg-purple-900/40 border-[#FF6B00] shadow-md shadow-orange-500/10'
                  : 'bg-slate-950/60 border-purple-900/30 hover:border-purple-700 text-slate-400'
              }`}
            >
              <input
                type="radio"
                name="logoTypeOption"
                checked={logoType === 'image'}
                onChange={() => setLogoType('image')}
                className="mt-1 text-[#FF6B00] focus:ring-[#FF6B00]"
              />
              <div>
                <div className="font-bold text-white text-xs">কাস্টম আপলোডকৃত লোগো ছবি (Custom Uploaded Logo)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  কম্পিউটার বা মোবাইল থেকে আপনার কোম্পানির ফাইল আপলোড করুন (PNG, SVG, JPG, WebP)।
                </div>
              </div>
            </label>
          </div>

          {/* Upload and URL Inputs */}
          {logoType === 'image' && (
            <div className="space-y-4 p-4 rounded-2xl bg-[#0C061E] border border-purple-900/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Method A: File Upload */}
                <div className="space-y-2">
                  <label className="block text-slate-300 font-bold">
                    অপশন ১: ডিভাইস থেকে লোগো আপলোড (Upload File)
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-purple-800 hover:border-[#FF6B00] rounded-xl p-4 text-center cursor-pointer transition-all bg-purple-950/20 hover:bg-purple-950/40"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-[#FF6B00] mx-auto mb-2" />
                    <div className="font-bold text-white text-xs">লোগো ছবি নির্বাচন করুন</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      PNG (স্বচ্ছ ব্যাকগ্রাউন্ড সবচেয়ে ভালো), SVG, JPG বা WebP (সর্বোচ্চ ২MB)
                    </div>
                  </div>
                </div>

                {/* Method B: Direct URL */}
                <div className="space-y-2">
                  <label className="block text-slate-300 font-bold">
                    অপশন ২: লোগোর ইমেজ URL লিঙ্ক (Or Paste Logo URL)
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://example.com/my-logo.png"
                      value={logoUrl}
                      onChange={(e) => {
                        setLogoUrl(e.target.value);
                        setLogoType('image');
                      }}
                      className="w-full bg-[#150D2E] border border-purple-800 rounded-xl pl-9 pr-3 py-3 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#FF6B00]"
                    />
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    ইন্টারনেটের যেকোনো হোস্টেড ইমেজ বা ড্রাইভের ডিরেক্ট লিঙ্ক পেস্ট করতে পারেন।
                  </p>
                </div>
              </div>

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 flex items-center gap-2 text-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          )}

          {/* Interactive Live Preview Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0E0722] to-[#160D33] border border-purple-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-[#A78BFA] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>লাইভ প্রিভিউ (Live Preview) - ওয়েবসাইটে যেভাবে দেখাবে:</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {logoType === 'image' && logoUrl ? 'কাস্টম ইমেজ সক্রিয়' : 'অরিজিনাল ভেক্টর সক্রিয়'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Preview on Dark Background (Navbar mode) */}
              <div className="bg-[#0A051A] p-4 rounded-xl border border-purple-900/80 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 font-mono mb-2 uppercase">Dark Theme (Navbar & Footer)</div>
                  <BrandLogo
                    size="md"
                    showTagline={true}
                    lightText={true}
                    overrideLogoUrl={logoType === 'default' ? '' : logoUrl}
                    overrideBrandName={brandName}
                    overrideTagline={tagline}
                  />
                </div>
              </div>

              {/* Preview on Light Background */}
              <div className="bg-slate-100 p-4 rounded-xl border border-slate-300 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-600 font-mono mb-2 uppercase">Light Theme (Printed Documents)</div>
                  <BrandLogo
                    size="md"
                    showTagline={true}
                    lightText={false}
                    overrideLogoUrl={logoType === 'default' ? '' : logoUrl}
                    overrideBrandName={brandName}
                    overrideTagline={tagline}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: CORE BRAND IDENTITY */}
        <div className="pt-6 border-t border-purple-900/40 space-y-4">
          <h3 className="font-bold text-sm text-[#FF6B00] uppercase tracking-wider">
            2. ব্র্যান্ডের নাম ও স্লোগান (Brand Name & Tagline)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-bold">ব্র্যান্ডের নাম (Brand Name)</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full bg-[#0E0722] border border-purple-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF6B00]"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-bold">অফিসিয়াল স্লোগান (Official Tagline)</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#0E0722] border border-purple-800 rounded-xl px-3.5 py-2.5 text-white font-medium focus:outline-none focus:border-[#FF6B00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold">হোমপেজ সাবটাইটেল (Homepage Hero Subtitle)</label>
            <textarea
              rows={2}
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full bg-[#0E0722] border border-purple-800 rounded-xl px-3.5 py-2.5 text-white resize-none focus:outline-none focus:border-[#FF6B00]"
            />
          </div>
        </div>

        {/* SECTION 3: ANNOUNCEMENT BANNER */}
        <div className="pt-6 border-t border-purple-900/40 space-y-4">
          <h3 className="font-bold text-sm text-amber-400 uppercase tracking-wider">
            3. ওয়েবসাইটের শীর্ষ জরুরি নোটিশ ব্যানার (Top Announcement Banner)
          </h3>

          <div className="flex items-center gap-2.5 mb-2">
            <input
              type="checkbox"
              id="bannerToggle"
              checked={noticeBannerActive}
              onChange={(e) => setNoticeBannerActive(e.target.checked)}
              className="w-4 h-4 rounded text-[#FF6B00] bg-slate-950 border-purple-700 focus:ring-[#FF6B00]"
            />
            <label htmlFor="bannerToggle" className="text-slate-300 font-bold cursor-pointer">
              ওয়েবসাইটের একদম উপরে নোটিশ ব্যানার চালু রাখুন (Enable Alert Banner)
            </label>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold">বিজ্ঞপ্তির টেক্সট (Notice Text)</label>
            <input
              type="text"
              value={noticeBanner}
              onChange={(e) => setNoticeBanner(e.target.value)}
              placeholder="e.g. ✈️ Special Daily Cargo Flights now active from Dhaka to Malaysia, UAE & UK!"
              className="w-full bg-[#0E0722] border border-purple-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF6B00]"
            />
          </div>
        </div>

        {/* SECTION 4: CONTACT INFORMATION */}
        <div className="pt-6 border-t border-purple-900/40 space-y-4">
          <h3 className="font-bold text-sm text-[#FF6B00] uppercase tracking-wider">
            4. হটলাইন ও যোগাযোগ চ্যানেল (Hotlines & Office Coordinates)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-bold">২৪/৭ হটলাইন (Hotline)</label>
              <input
                type="text"
                value={hotline}
                onChange={(e) => setHotline(e.target.value)}
                className="w-full bg-[#0E0722] border border-purple-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#FF6B00]"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-bold">অফিস মোবাইল নম্বর (Phone)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#0E0722] border border-purple-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#FF6B00]"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-bold">হোয়াটসঅ্যাপ নম্বর (WhatsApp)</label>
              <input
                type="text"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                className="w-full bg-[#0E0722] border border-purple-800 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-[#FF6B00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 mb-1 font-bold">সাপোর্ট ইমেইল (Support Email)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0E0722] border border-purple-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF6B00]"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-1 font-bold">কারেন্সি সিম্বল (Currency)</label>
              <input
                type="text"
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                className="w-full bg-[#0E0722] border border-purple-800 rounded-xl px-3.5 py-2.5 text-white font-bold font-mono focus:outline-none focus:border-[#FF6B00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 mb-1 font-bold">হেড অফিস ঠিকানা (Head Office Address)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#0E0722] border border-purple-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#FF6B00]"
            />
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-6 border-t border-purple-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-slate-400">
            পরিবর্তনগুলো সেভ করার সাথে সাথে সমগ্র ওয়েবসাইটে তাৎক্ষণিকভাবে আপডেট হয়ে যাবে।
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#FF6B00] via-[#FF7700] to-[#E65100] hover:from-[#FF7A1A] hover:to-[#FF6B00] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all duration-300 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'আপডেট সেভ হচ্ছে...' : 'লোগো ও সেটিংস সেভ করুন (Publish)'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
