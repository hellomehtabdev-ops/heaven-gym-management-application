import React from 'react';

/**
 * Official Heaven Gym Brand Logo System
 * Authentically recreates the official winged dumbbell emblem from brand reference.
 * 
 * Features:
 * - Center horizontal dumbbell with dual plates and barbell collar
 * - Majestic feathered wings expanding symmetrically outward and upward
 * - Precision vector geometry with sharp, scalable paths
 * - Supports Dark backgrounds, Light backgrounds, Header, Footer, and Icon-only displays
 */
export default function HeavenLogo({
  variant = 'header',
  theme = 'dark',
  size = 'md',
  className = '',
  iconOnly = false,
}) {
  const isLight = theme === 'light';

  // Sizing scale
  const sizeMap = {
    xs: { iconWidth: 42, iconHeight: 26, text: 'text-sm', sub: 'text-[7px]' },
    sm: { iconWidth: 54, iconHeight: 32, text: 'text-base', sub: 'text-[8px]' },
    md: { iconWidth: 68, iconHeight: 40, text: 'text-xl', sub: 'text-[9.5px]' },
    lg: { iconWidth: 88, iconHeight: 52, text: 'text-2xl', sub: 'text-[11px]' },
    xl: { iconWidth: 120, iconHeight: 70, text: 'text-4xl', sub: 'text-[13px]' },
  };

  const { iconWidth, iconHeight, text, sub } = sizeMap[size] || sizeMap.md;

  // Primary colors
  const plateColor = isLight ? '#0f172a' : '#ffffff';
  const wingColor = isLight ? '#1e293b' : '#ffffff';
  const collarColor = isLight ? '#475569' : '#e2e8f0';

  /**
   * The Official Winged Dumbbell Emblem
   * ViewBox: 0 0 160 90
   */
  const WingedDumbbell = ({ width = iconWidth, height = iconHeight }) => (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 90"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      aria-label="Heaven Gym Winged Dumbbell Emblem"
    >
      <defs>
        <linearGradient id="hgWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id="hgRedCore" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#b91c1c" />
        </linearGradient>
      </defs>

      {/* ==============================================================
          LEFT WING (Feather layers spreading outward and upward)
          ============================================================== */}
      <g className="transition-transform duration-300 group-hover:-translate-x-1">
        {/* Top Primary Feather */}
        <path
          d="M62 42C56 32 46 20 22 15C12 13 4 15 2 17C14 22 28 28 42 36C49 40 56 42 62 42Z"
          fill={isLight ? wingColor : 'url(#hgWingGrad)'}
        />
        {/* Second Feather */}
        <path
          d="M60 45C52 38 40 28 20 26C12 25 6 28 5 30C16 34 29 40 43 45C50 48 56 47 60 45Z"
          fill={isLight ? wingColor : 'url(#hgWingGrad)'}
          opacity="0.95"
        />
        {/* Third Feather */}
        <path
          d="M58 50C50 46 38 38 23 38C16 38 12 41 11 43C20 46 32 50 44 53C50 54 55 53 58 50Z"
          fill={isLight ? wingColor : 'url(#hgWingGrad)'}
          opacity="0.9"
        />
        {/* Fourth Feather */}
        <path
          d="M56 55C48 52 38 48 28 49C22 50 18 53 18 55C26 57 36 60 45 61C50 61 54 58 56 55Z"
          fill={isLight ? wingColor : 'url(#hgWingGrad)'}
          opacity="0.85"
        />
        {/* Bottom Taper Feather */}
        <path
          d="M55 60C48 59 40 58 34 60C30 61 28 64 29 65C36 66 44 66 50 65C53 64 55 62 55 60Z"
          fill={isLight ? wingColor : 'url(#hgWingGrad)'}
          opacity="0.75"
        />
      </g>

      {/* ==============================================================
          RIGHT WING (Symmetric feather layers spreading right & up)
          ============================================================== */}
      <g className="transition-transform duration-300 group-hover:translate-x-1">
        {/* Top Primary Feather */}
        <path
          d="M98 42C104 32 114 20 138 15C148 13 156 15 158 17C146 22 132 28 118 36C111 40 104 42 98 42Z"
          fill={isLight ? wingColor : 'url(#hgWingGrad)'}
        />
        {/* Second Feather */}
        <path
          d="M100 45C108 38 120 28 140 26C148 25 154 28 155 30C144 34 131 40 117 45C110 48 104 47 100 45Z"
          fill={isLight ? wingColor : 'url(#hgWingGrad)'}
          opacity="0.95"
        />
        {/* Third Feather */}
        <path
          d="M102 50C110 46 122 38 137 38C144 38 148 41 149 43C140 46 128 50 116 53C110 54 105 53 102 50Z"
          fill={isLight ? wingColor : 'url(#hgWingGrad)'}
          opacity="0.9"
        />
        {/* Fourth Feather */}
        <path
          d="M104 55C112 52 122 48 132 49C138 50 142 53 142 55C134 57 124 60 115 61C110 61 106 58 104 55Z"
          fill={isLight ? wingColor : 'url(#hgWingGrad)'}
          opacity="0.85"
        />
        {/* Bottom Taper Feather */}
        <path
          d="M105 60C112 59 120 58 126 60C130 61 132 64 131 65C124 66 116 66 110 65C107 64 105 62 105 60Z"
          fill={isLight ? wingColor : 'url(#hgWingGrad)'}
          opacity="0.75"
        />
      </g>

      {/* ==============================================================
          CENTER DUMBBELL
          ============================================================== */}
      {/* Center Bar Grip */}
      <rect
        x="72"
        y="42"
        width="16"
        height="7"
        rx="2"
        fill="url(#hgRedCore)"
      />
      {/* Grip Knurling Accent Lines */}
      <line x1="76" y1="42" x2="76" y2="49" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="80" y1="42" x2="80" y2="49" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="84" y1="42" x2="84" y2="49" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.4" />

      {/* Left Inner Plate */}
      <rect
        x="67"
        y="33"
        width="5"
        height="25"
        rx="2.5"
        fill={plateColor}
      />
      {/* Left Outer Plate */}
      <rect
        x="61"
        y="36"
        width="4"
        height="19"
        rx="2"
        fill={collarColor}
      />

      {/* Right Inner Plate */}
      <rect
        x="88"
        y="33"
        width="5"
        height="25"
        rx="2.5"
        fill={plateColor}
      />
      {/* Right Outer Plate */}
      <rect
        x="95"
        y="36"
        width="4"
        height="19"
        rx="2"
        fill={collarColor}
      />
    </svg>
  );

  // Icon only
  if (iconOnly || variant === 'emblem' || variant === 'compact') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <WingedDumbbell />
      </div>
    );
  }

  // Primary Vertical Stacked Lockup (Ideal for Hero / Splash / Central Brand Display)
  if (variant === 'primary' || variant === 'stacked') {
    return (
      <div className={`group flex flex-col items-center text-center ${className}`}>
        <WingedDumbbell width={iconWidth * 1.3} height={iconHeight * 1.3} />
        <div className="mt-3 flex flex-col items-center leading-none">
          <span className={`font-display font-black tracking-[0.22em] ${text} ${isLight ? 'text-slate-950' : 'text-white'}`}>
            HEAVEN
          </span>
          <span className={`mt-1 font-display font-extrabold tracking-[0.35em] text-xs sm:text-sm text-brand-500`}>
            GYM
          </span>
          <span className={`mt-2 font-mono font-semibold uppercase tracking-[0.28em] ${sub} ${isLight ? 'text-slate-500' : 'text-surface-400'}`}>
            Discipline &bull; Strength
          </span>
        </div>
      </div>
    );
  }

  // Footer Lockup (Balanced branding with subtitle)
  if (variant === 'footer') {
    return (
      <div className={`group inline-flex items-center gap-4 ${className}`}>
        <WingedDumbbell width={iconWidth * 1.15} height={iconHeight * 1.15} />
        <div className="flex flex-col leading-none">
          <span className="font-display text-2xl font-black tracking-[0.14em] text-white">
            HEAVEN
          </span>
          <span className="mt-1 font-display text-sm font-extrabold tracking-[0.26em] text-brand-500">
            GYM
          </span>
          <span className="mt-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-surface-400">
            Premium Fitness Club
          </span>
        </div>
      </div>
    );
  }

  // Default Header Variation (Horizontal lockup with winged dumbbell + HEAVEN GYM)
  return (
    <div className={`group inline-flex items-center gap-3.5 ${className}`}>
      <WingedDumbbell />
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-display font-black tracking-[0.12em] text-lg sm:text-xl ${isLight ? 'text-slate-900' : 'text-white'}`}>
            HEAVEN
          </span>
          <span className="font-display font-black tracking-[0.14em] text-lg sm:text-xl text-brand-500">
            GYM
          </span>
        </div>
        <span className={`mt-1 font-mono text-[8px] sm:text-[8.5px] font-bold uppercase tracking-[0.22em] ${isLight ? 'text-slate-500' : 'text-surface-400'}`}>
          Built Through Discipline
        </span>
      </div>
    </div>
  );
}
