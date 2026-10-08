import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { X, Sparkles, Plane, ChevronRight } from 'lucide-react';

export const NoticeBanner: React.FC<{ onActionClick?: () => void }> = ({ onActionClick }) => {
  const { settings } = useData();
  const [dismissed, setDismissed] = useState(false);

  if (!settings.noticeBannerActive || !settings.noticeBanner || dismissed) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-600 text-white text-xs sm:text-sm font-medium px-4 py-2 relative flex items-center justify-between shadow-sm border-b border-amber-400/20">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-1 text-center pr-6">
        <span className="flex h-2 w-2 relative flex-shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
        </span>
        <span className="truncate">{settings.noticeBanner}</span>
        {onActionClick && (
          <button
            onClick={onActionClick}
            className="underline underline-offset-2 hover:text-amber-100 flex items-center text-xs font-semibold uppercase tracking-wider ml-2 flex-shrink-0"
          >
            Check Rates <ChevronRight className="w-3 h-3 ml-0.5" />
          </button>
        )}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="p-1 hover:bg-black/10 rounded-full transition-colors flex-shrink-0"
        aria-label="Dismiss notice"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
