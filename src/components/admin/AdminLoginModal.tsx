import React, { useState } from 'react';
import { useAuth, AUTHORIZED_SUPER_ADMIN_EMAIL } from '../../context/AuthContext';
import { Lock, ShieldCheck, Mail, LogIn, AlertCircle, KeyRound, ShieldAlert, X } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const AdminLoginModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ isOpen, onClose, onSuccess }) => {
  const { loginWithGoogle, loginWithMasterKey, authError, clearAuthError } = useAuth();
  const [masterSecretKey, setMasterSecretKey] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showKeyField, setShowKeyField] = useState(false);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setLocalError(null);
    clearAuthError();
    try {
      await loginWithGoogle();
      onSuccess();
    } catch (e: any) {
      console.error(e);
      setLocalError(e.message || 'অথেন্টিকেশন ব্যর্থ হয়েছে। শুধুমাত্র অনুমোদিত একাউন্ট দিয়ে চেষ্টা করুন।');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleMasterKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterSecretKey.trim()) {
      setLocalError('এডমিন মাস্টার সিক্রেট কি প্রদান করুন।');
      return;
    }

    setIsLoggingIn(true);
    setLocalError(null);
    clearAuthError();
    try {
      await loginWithMasterKey(masterSecretKey);
      onSuccess();
    } catch (e: any) {
      setLocalError(e.message || 'ভুল মাস্টার কি। প্রবেশাধিকার প্রত্যাখ্যাত।');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070412]/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#140D2E] border border-purple-800/80 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-white space-y-6 relative animate-in fade-in zoom-in-95 duration-200 shadow-purple-950/60">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-purple-900/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Logo & Lock Icon */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandLogo size="md" showTagline={false} lightText={true} />
          </div>

          <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-800/80 flex items-center justify-center text-[#FF6B00] mx-auto shadow-lg shadow-orange-500/10">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Secure Admin Gateway
            </h2>
            <p className="text-xs text-purple-300 font-mono mt-1">
              Protected Management Console
            </p>
          </div>
        </div>

        {/* Strict Access Security Notice in Bengali & English */}
        <div className="p-3.5 rounded-2xl bg-purple-950/80 border border-purple-700/60 space-y-1.5 text-left">
          <div className="flex items-center gap-2 text-xs font-bold text-[#FF6B00]">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>প্রবেশাধিকার সংরক্ষিত / Access Strictly Restricted</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            এই এডমিন প্যানেলে শুধুমাত্র অনুমোদিত সুপার এডমিন (<strong>{AUTHORIZED_SUPER_ADMIN_EMAIL}</strong>) প্রবেশ করতে পারেন। অন্য কারো প্রবেশ সম্পূর্ণ নিষিদ্ধ।
          </p>
        </div>

        {/* Error notification */}
        {(authError || localError) && (
          <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-700 text-red-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="font-medium leading-relaxed">{localError || authError}</div>
          </div>
        )}

        {/* Primary Google Auth */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-black text-sm shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 hover:scale-[1.01]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign in with Authorized Google Account</span>
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setShowKeyField(!showKeyField)}
              className="text-[11px] text-purple-300 hover:text-[#FF6B00] transition-colors font-mono inline-flex items-center gap-1"
            >
              <KeyRound className="w-3 h-3" />
              <span>{showKeyField ? 'Hide Master Key Option' : 'Or Enter with Admin Master Secret Key'}</span>
            </button>
          </div>
        </div>

        {/* Master Key Input Form */}
        {showKeyField && (
          <form onSubmit={handleMasterKeySubmit} className="pt-2 border-t border-purple-900/50 space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1.5 font-mono">
                Admin Master Secret Key:
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter private master secret..."
                  value={masterSecretKey}
                  onChange={(e) => setMasterSecretKey(e.target.value)}
                  className="w-full bg-[#0B0619] border border-purple-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#FF6B00] font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#4A2B97] to-[#FF6B00] hover:from-[#5B2EAF] hover:to-[#FF7A1A] font-bold text-xs text-white transition-all shadow-md shadow-orange-500/10 flex items-center justify-center gap-2"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Authorize & Enter Console</span>
            </button>
          </form>
        )}

        <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-purple-900/40">
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Zero-Trust ABAC Guarded
          </span>
          <button onClick={onClose} className="hover:text-white transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
