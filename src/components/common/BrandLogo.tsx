import React, { useState } from 'react';
import { useData } from '../../context/DataContext';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  lightText?: boolean;
  overrideLogoUrl?: string;
  overrideBrandName?: string;
  overrideTagline?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  lightText = true,
  overrideLogoUrl,
  overrideBrandName,
  overrideTagline,
}) => {
  const { settings } = useData();
  const [imageError, setImageError] = useState(false);

  // Determine active logo url and text
  const activeLogoUrl = overrideLogoUrl !== undefined ? overrideLogoUrl : settings?.logoUrl;
  const brandName = overrideBrandName || settings?.brandName || 'YOUR PARCEL';
  const tagline = overrideTagline || settings?.tagline || 'our responsibility';

  // Dimension scaling
  const dimensions = {
    sm: { iconSize: 34, imgHeight: 'h-8 sm:h-9', textMain: 'text-xl sm:text-2xl', textSub: 'text-[9px] sm:text-[10px]' },
    md: { iconSize: 46, imgHeight: 'h-10 sm:h-12', textMain: 'text-2xl sm:text-3xl', textSub: 'text-[10px] sm:text-[11px]' },
    lg: { iconSize: 58, imgHeight: 'h-14 sm:h-16', textMain: 'text-3xl sm:text-4xl', textSub: 'text-xs sm:text-sm' },
    xl: { iconSize: 72, imgHeight: 'h-16 sm:h-20', textMain: 'text-4xl sm:text-5xl', textSub: 'text-sm sm:text-base' },
  }[size];

  // Parse brand name into two words if possible for distinctive two-tone styling
  const nameParts = brandName.split(' ');
  const firstWord = nameParts[0] || 'Your';
  const remainingWords = nameParts.slice(1).join(' ') || 'Parcel';

  const renderMonogram = () => (
    <svg
      width={dimensions.iconSize}
      height={dimensions.iconSize}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      <defs>
        <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A2B97" />
          <stop offset="100%" stopColor="#371E7D" />
        </linearGradient>
        <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7700" />
          <stop offset="100%" stopColor="#FF5A00" />
        </linearGradient>
      </defs>

      {/* Letter 'Y' in Deep Royal Purple */}
      <path
        d="M 12 48 L 32 46 L 52 92 L 52 142 L 32 142 L 32 94 Z"
        fill="url(#purpleGrad)"
      />
      <path
        d="M 12 48 L 52 48 L 78 86 L 62 94 Z"
        fill="url(#purpleGrad)"
      />

      {/* The Ascending Roadway */}
      <path
        d="M 44 142 L 58 142 Q 62 108 78 76 Q 88 56 102 38 L 90 38 Q 72 62 58 98 Q 48 120 44 142 Z"
        fill="#FFFFFF"
      />

      {/* Dashed Road Line */}
      <path
        d="M 50 140 Q 64 102 82 70 Q 90 52 96 40"
        stroke="#1F1E28"
        strokeWidth="3.2"
        strokeDasharray="6 5"
        fill="none"
      />

      {/* Forward Arrow Head */}
      <path
        d="M 86 44 L 114 26 L 108 58 L 98 48 Z"
        fill="url(#purpleGrad)"
      />

      {/* Letter 'P' in Vibrant Courier Orange */}
      <path
        d="M 104 48 L 126 30 L 122 58 L 114 50 Z"
        fill="url(#orangeGrad)"
      />
      <path
        d="M 58 142 L 78 142 L 78 102 Q 106 104 124 90 Q 138 78 138 60 Q 138 46 122 40 L 110 52 Q 120 56 120 64 Q 120 74 108 82 Q 94 90 78 86 L 78 70 Q 94 62 106 46 L 94 40 Q 80 60 70 82 Q 62 102 58 142 Z"
        fill="url(#orangeGrad)"
      />
    </svg>
  );

  return (
    <div className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${className}`}>
      {/* Custom Uploaded Logo Image OR Monogram SVG */}
      {activeLogoUrl && !imageError ? (
        <div className="flex-shrink-0 flex items-center justify-center">
          <img
            src={activeLogoUrl}
            alt={brandName}
            onError={() => setImageError(true)}
            className={`${dimensions.imgHeight} w-auto max-w-[140px] sm:max-w-[200px] object-contain drop-shadow-md rounded-lg transition-transform`}
          />
        </div>
      ) : (
        renderMonogram()
      )}

      {/* Brand Logotype Typography (Shown alongside monogram or if custom image doesn't replace entire lockup) */}
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-baseline leading-none truncate">
          <span className={`${dimensions.textMain} font-black tracking-tight text-[#7C5CFC] drop-shadow-sm`}>
            {firstWord}
          </span>
          <span className={`${dimensions.textMain} font-black tracking-tight text-[#FF6B00] ml-1.5 drop-shadow-sm`}>
            {remainingWords}
          </span>
        </div>
        {showTagline && (
          <span
            className={`${dimensions.textSub} font-medium tracking-normal mt-0.5 lowercase truncate ${
              lightText ? 'text-slate-300' : 'text-slate-700'
            }`}
          >
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
};
