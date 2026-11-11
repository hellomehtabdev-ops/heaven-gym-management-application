import React from 'react';

/**
 * SectionDivider Component
 * Luxury architectural line separator with crimson diamond center accent.
 */
export default function SectionDivider({ className = '', variant = 'dark' }) {
  const isDark = variant === 'dark';

  return (
    <div className={`relative flex items-center justify-center py-6 sm:py-8 ${className}`}>
      <div
        className={`w-full max-w-7xl mx-auto px-5 lg:px-8 flex items-center justify-center`}
      >
        <div
          className={`h-[1px] flex-1 ${
            isDark
              ? 'bg-gradient-to-r from-transparent via-white/10 to-brand-500/30'
              : 'bg-gradient-to-r from-transparent via-black/10 to-brand-500/30'
          }`}
        />
        <div className="mx-4 flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-brand-500/50" />
          <span className="h-1.5 w-1.5 rotate-45 bg-brand-500 shadow-sm shadow-brand-500/50" />
          <span className="h-1 w-1 rounded-full bg-brand-500/50" />
        </div>
        <div
          className={`h-[1px] flex-1 ${
            isDark
              ? 'bg-gradient-to-l from-transparent via-white/10 to-brand-500/30'
              : 'bg-gradient-to-l from-transparent via-black/10 to-brand-500/30'
          }`}
        />
      </div>
    </div>
  );
}
