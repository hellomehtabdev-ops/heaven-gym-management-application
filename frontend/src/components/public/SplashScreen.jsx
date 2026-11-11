import { useEffect } from 'react';
import HeavenLogo from '@/components/public/HeavenLogo';

export default function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#070709] text-white">
      {/* Background ambient radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(220,38,38,0.18)_0%,transparent_60%)]" />

      <div className="relative z-10 animate-fade-up text-center px-6">
        <div className="mx-auto mb-6 flex justify-center">
          <HeavenLogo variant="emblem" size="xl" />
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight">
          HEAVEN<span className="text-brand-500">GYM</span>
        </h1>

        <p className="mt-2 font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-[0.32em] text-surface-400">
          Built Through Discipline
        </p>

        {/* Shimmer loading bar */}
        <div className="mx-auto mt-7 h-1 w-36 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 animate-[shimmer_1.2s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-brand-600 via-brand-400 to-white" />
        </div>
      </div>
    </div>
  );
}
