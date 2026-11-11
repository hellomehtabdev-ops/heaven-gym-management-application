import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

/**
 * ImageLightbox Component
 * Cinematic fullscreen image viewer with keyboard navigation and accessible dismiss.
 */
export default function ImageLightbox({
  images = [],
  currentIndex = 0,
  isOpen = false,
  onClose,
  onNext,
  onPrev,
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      {/* Top bar controls */}
      <div
        className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 text-white/80">
          <span className="font-mono text-xs uppercase tracking-wider text-brand-400 font-semibold">
            {currentIndex + 1} / {images.length}
          </span>
          {currentImage.title && (
            <span className="text-sm font-medium border-l border-white/20 pl-3 hidden sm:inline">
              {currentImage.title}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        >
          <X size={20} />
        </button>
      </div>

      {/* Prev button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onPrev?.();
          }}
          aria-label="Previous image"
          className="absolute left-4 z-20 hidden md:flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-brand-600 hover:border-brand-500 focus:outline-none"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {/* Image container */}
      <div
        className="relative max-h-[85vh] max-w-[92vw] overflow-hidden rounded-2xl shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage.src || currentImage.image_url}
          alt={currentImage.alt || currentImage.title || 'Heaven Gym visual'}
          className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl select-none"
        />

        {(currentImage.title || currentImage.description) && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-6 text-white">
            {currentImage.tag && (
              <span className="inline-block px-2.5 py-0.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider bg-brand-600 rounded">
                {currentImage.tag}
              </span>
            )}
            {currentImage.title && (
              <h3 className="font-display text-lg font-bold">
                {currentImage.title}
              </h3>
            )}
            {currentImage.description && (
              <p className="mt-1 text-xs text-white/70 max-w-xl">
                {currentImage.description}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNext?.();
          }}
          aria-label="Next image"
          className="absolute right-4 z-20 hidden md:flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md transition hover:bg-brand-600 hover:border-brand-500 focus:outline-none"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {/* Mobile navigation bar */}
      {images.length > 1 && (
        <div
          className="absolute bottom-4 inset-x-0 z-20 flex md:hidden items-center justify-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={onPrev}
            aria-label="Previous image"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/80 border border-white/20 text-white"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs font-mono text-white/80 bg-black/60 px-3 py-1.5 rounded-full border border-white/10">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            type="button"
            onClick={onNext}
            aria-label="Next image"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/80 border border-white/20 text-white"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
