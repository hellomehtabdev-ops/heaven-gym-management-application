import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ChevronsLeftRight, Sparkles } from 'lucide-react';

/**
 * Premium Interactive Before & After Comparison Slider
 * 
 * Features:
 * - Draggable vertical divider with smooth tracking
 * - Mouse drag on desktop, Touch drag on mobile
 * - Dual layered image alignment with non-distorting CSS clip-path
 * - Floating 'BEFORE' and 'AFTER' status badges
 * - Full keyboard accessibility (Arrow Left / Arrow Right)
 * - Accessible ARIA slider attributes
 */
export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'STARTING POINT',
  afterLabel = 'CURRENT PROGRESS',
  initialPosition = 50,
  aspectRatio = 'aspect-[4/5] sm:aspect-[16/10]',
  className = '',
}) {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMove = useCallback(
    (clientX) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      setSliderPosition(percentage);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return;
      handleMove(e.touches[0].clientX);
    },
    [isDragging, handleMove]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handlePointerUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [isDragging, handleMouseMove, handlePointerUp, handleTouchMove]);

  // Keyboard accessibility
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      setSliderPosition((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPosition((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div
      ref={containerRef}
      role="slider"
      tabIndex={0}
      aria-label="Before and After Transformation Comparison Slider"
      aria-valuenow={Math.round(sliderPosition)}
      aria-valuemin={0}
      aria-valuemax={100}
      onKeyDown={handleKeyDown}
      onMouseDown={(e) => {
        setIsDragging(true);
        handleMove(e.clientX);
      }}
      onTouchStart={(e) => {
        setIsDragging(true);
        handleMove(e.touches[0].clientX);
      }}
      className={`group relative select-none overflow-hidden rounded-3xl border border-white/15 bg-black shadow-2xl cursor-ew-resize focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${aspectRatio} ${className}`}
    >
      {/* ==============================================================
          LAYER 1: "AFTER" (Background Full Image)
          ============================================================== */}
      <img
        src={afterImage}
        alt="After Transformation Result at Heaven Gym"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none filter contrast-105"
      />

      {/* Floating AFTER Label */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none rounded-full border border-emerald-500/40 bg-black/75 px-3 py-1 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 backdrop-blur-md shadow-md">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          {afterLabel}
        </span>
      </div>

      {/* ==============================================================
          LAYER 2: "BEFORE" (Clipped Foreground Image)
          ============================================================== */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        <img
          src={beforeImage}
          alt="Before Transformation Baseline at Heaven Gym"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-center pointer-events-none filter brightness-95 contrast-100"
        />

        {/* Floating BEFORE Label */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none rounded-full border border-surface-400/30 bg-black/75 px-3 py-1 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-surface-300 backdrop-blur-md shadow-md">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-surface-400" />
            {beforeLabel}
          </span>
        </div>
      </div>

      {/* ==============================================================
          LAYER 3: VERTICAL SLIDER DIVIDER & DRAG HANDLE
          ============================================================== */}
      <div
        className="absolute top-0 bottom-0 z-20 pointer-events-none flex items-center justify-center -translate-x-1/2"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Crisp Vertical Line */}
        <div className="h-full w-[2px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)]" />

        {/* Circular Drag Handle */}
        <div
          className={`absolute flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-white shadow-2xl transition-transform duration-150 ${
            isDragging ? 'scale-115 shadow-brand-500/80 bg-brand-500' : 'group-hover:scale-108'
          }`}
        >
          <ChevronsLeftRight size={20} strokeWidth={2.5} />
        </div>
      </div>

      {/* Bottom helper tip */}
      <div className="absolute bottom-3 inset-x-0 z-10 pointer-events-none flex justify-center">
        <span className="rounded-full bg-black/60 px-3 py-1 text-[9px] font-mono uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm border border-white/10 hidden sm:inline-block">
          Drag slider to compare milestones
        </span>
      </div>
    </div>
  );
}
