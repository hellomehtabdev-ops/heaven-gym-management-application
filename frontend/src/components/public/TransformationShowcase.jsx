import { useState, useEffect, useRef } from 'react';
import {
  Award,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  X,
  Clock,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BeforeAfterSlider from './BeforeAfterSlider';
import ScrollReveal from './ScrollReveal';
import { transformationService } from '@/services/transformationService';

export default function TransformationShowcase({ className = '' }) {
  const [transformations, setTransformations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    let active = true;
    transformationService
      .getPublicTransformations({ limit: 8 })
      .then((data) => {
        if (active) {
          setTransformations(data.rows || []);
        }
      })
      .catch(() => {
        if (active) setTransformations([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -420, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 420, behavior: 'smooth' });
    }
  };

  return (
    <section className={`relative py-24 sm:py-32 overflow-hidden bg-[#07080b] ${className}`}>
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-brand-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 -z-10 h-96 w-96 rounded-full bg-amber-500/5 blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Editorial Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.25em] text-brand-400 backdrop-blur-md">
                <Sparkles size={14} className="text-brand-400" />
                Verified Milestones
              </div>

              <h2 className="mt-4 font-display text-2xl sm:text-4xl lg:text-6xl font-black tracking-tight text-white leading-tight break-words">
                REAL PROGRESS. <br />
                <span className="bg-gradient-to-r from-brand-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  MEASURABLE RESULTS.
                </span>
              </h2>

              <p className="mt-4 text-base sm:text-lg text-surface-300 leading-relaxed">
                Authentic before-and-after transformations documented at Heaven Gym. Every milestone reflects disciplined training, customized nutrition, and relentless consistency.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {transformations.length > 2 && (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={scrollLeft}
                    aria-label="Previous transformations"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 hover:border-brand-500 active:scale-95"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={scrollRight}
                    aria-label="Next transformations"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:bg-white/10 hover:border-brand-500 active:scale-95"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}

              <Link
                to="/transformations"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white transition hover:border-brand-500 hover:bg-brand-500/10 active:scale-95"
              >
                <span>Explore All</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Carousel Content */}
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.02] p-5 h-96 flex flex-col justify-end"
              >
                <div className="h-4 w-24 bg-white/10 rounded mb-3" />
                <div className="h-6 w-3/4 bg-white/10 rounded mb-2" />
                <div className="h-4 w-1/2 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : transformations.length > 0 ? (
          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto pb-8 pt-2 scroll-smooth snap-x snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {transformations.map((item) => (
              <div
                key={item._id}
                className="w-[320px] sm:w-[400px] shrink-0 snap-start flex flex-col rounded-3xl border border-white/10 bg-[#0e1017] p-5 shadow-2xl transition-all duration-300 hover:border-brand-500/40 hover:-translate-y-1"
              >
                {/* Interactive comparison slider inside card */}
                <div className="relative mb-5">
                  <BeforeAfterSlider
                    beforeImage={item.before_image?.url}
                    afterImage={item.after_image?.url}
                    beforeLabel="BEFORE"
                    afterLabel="AFTER"
                    initialPosition={50}
                    aspectRatio="aspect-[4/5]"
                  />

                  {item.duration && (
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/80 px-3 py-1 text-[10px] font-mono font-semibold text-white backdrop-blur-md">
                      <Clock size={11} className="text-amber-400" />
                      {item.duration}
                    </div>
                  )}
                </div>

                {/* Information */}
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="rounded bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-brand-400">
                      {item.category}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                      <ShieldCheck size={13} /> Verified
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-white line-clamp-1">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs text-surface-300 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {item.achievement && (
                    <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-300 font-medium">
                      ★ {item.achievement}
                    </div>
                  )}

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-white hover:text-brand-400 transition"
                    >
                      <SlidersHorizontal size={14} /> Full View & Story
                    </button>
                    <Link
                      to="/transformations"
                      className="text-xs font-mono text-surface-400 hover:text-white"
                    >
                      All Stories &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Authentic Empty State - No fabricated stories */
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.01] p-12 text-center max-w-xl mx-auto">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-amber-400">
              <Award size={28} />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold text-white">
              Authentic Milestones in Progress
            </h3>
            <p className="mt-2 text-sm text-surface-400 leading-relaxed">
              Heaven Gym showcases authentic member transformations only. Certified coach-verified milestones will appear here as members complete their training protocols.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/membership"
                className="rounded-full bg-brand-600 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white transition hover:bg-brand-500"
              >
                Begin Your Journey
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-surface-300 hover:text-white hover:border-white/30"
              >
                Consult a Coach
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Details Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#0d0f15] p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => setSelectedItem(null)}
              aria-label="Close transformation detail"
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-surface-300 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div>
                <BeforeAfterSlider
                  beforeImage={selectedItem.before_image?.url}
                  afterImage={selectedItem.after_image?.url}
                  beforeLabel="BEFORE"
                  afterLabel="AFTER"
                  aspectRatio="aspect-[4/5] sm:aspect-[16/11]"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="rounded bg-brand-500/20 border border-brand-500/30 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-brand-400">
                    {selectedItem.category}
                  </span>
                  <h3 className="mt-3 font-display text-2xl sm:text-3xl font-black text-white">
                    {selectedItem.title}
                  </h3>
                  {selectedItem.duration && (
                    <p className="mt-1 text-xs font-mono text-surface-400">
                      Training Period: {selectedItem.duration}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-brand-400 font-bold mb-1">
                    Transformation Summary
                  </p>
                  <p className="text-xs text-surface-300 leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                {selectedItem.achievement && (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1">
                      Verified Milestones
                    </p>
                    <p className="text-xs text-amber-200 font-medium">
                      ★ {selectedItem.achievement}
                    </p>
                  </div>
                )}

                {selectedItem.story && (
                  <blockquote className="border-l-2 border-brand-500 pl-4 italic text-xs text-surface-300 leading-relaxed">
                    &ldquo;{selectedItem.story}&rdquo;
                  </blockquote>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Official Heaven Gym Milestone
                  </span>
                  <Link
                    to="/membership"
                    onClick={() => setSelectedItem(null)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-brand-500 transition"
                  >
                    Start Training &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
