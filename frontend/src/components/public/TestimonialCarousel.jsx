import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Quote, ShieldCheck, Star } from 'lucide-react';

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    name: 'Aarav Mehta',
    role: 'Strength & Conditioning Member',
    duration: 'Member for 14 months',
    rating: 5,
    quote:
      'Heaven Gym completely transformed my perspective on consistency. The equipment selection is top-tier, the atmosphere is strictly focused on training, and there is zero clutter or unnecessary distractions.',
    highlight: 'Added 40kg to my deadlift while maintaining joint health.',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 2,
    name: 'Pooja Sharma',
    role: 'Morning Training Regular',
    duration: 'Member for 2 years',
    rating: 5,
    quote:
      'Opening at 5 AM sharp every single day gives me the structure I need. The coaching staff is respectful, knowledgeable, and genuinely invested in proper form over ego lifting.',
    highlight: 'Consistent 5 days a week routine for over 18 continuous months.',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 3,
    name: 'Vikram Rajput',
    role: 'Power & Hypertrophy Athlete',
    duration: 'Member for 8 months',
    rating: 5,
    quote:
      'The heavy dumbbell sets, calibrated plates, and dedicated deadlift platforms are unmatched. This is where serious lifters come when they want an environment that matches their standard of discipline.',
    highlight: 'Achieved personal bests across all three compound movements.',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=240&q=80',
  },
  {
    id: 4,
    name: 'Rohan Verma',
    role: 'Functional Fitness Member',
    duration: 'Member for 11 months',
    rating: 5,
    quote:
      'Cleanliness, airflow, and equipment maintenance are taken seriously here. You never have to wait for broken machines or hunt for missing barbell collars. Highly recommended.',
    highlight: 'Improved cardiovascular endurance and overall core stability.',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
  },
];

export default function TestimonialCarousel({ testimonials = DEFAULT_TESTIMONIALS }) {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);

  const next = () => setActive((prev) => (prev + 1) % testimonials.length);
  const prev = () => setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, [isPaused, testimonials.length]);

  const current = testimonials[active] || testimonials[0];

  return (
    <div
      className="relative mx-auto max-w-4xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Decorative Quote Icon */}
      <div className="absolute -top-6 left-6 text-brand-500/10 pointer-events-none sm:-top-10 sm:left-10">
        <Quote size={100} strokeWidth={1} />
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-ink-900/90 via-ink-950 to-black p-7 sm:p-12 shadow-2xl backdrop-blur-xl">
        <div className="relative z-10 flex flex-col justify-between min-h-[320px]">
          {/* Header with stars & verified badge */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(current.rating || 5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>

            {current.verified && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                <ShieldCheck size={14} /> Verified Member
              </span>
            )}
          </div>

          {/* Quote content */}
          <blockquote className="my-6">
            <p className="font-display text-lg font-medium leading-relaxed text-surface-100 sm:text-xl lg:text-2xl">
              &ldquo;{current.quote}&rdquo;
            </p>

            {current.highlight && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-brand-500/20 bg-brand-500/5 px-3.5 py-2 text-xs font-semibold text-brand-300">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                {current.highlight}
              </div>
            )}
          </blockquote>

          {/* Author info & controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
            <div className="flex items-center gap-4">
              <img
                src={current.avatar}
                alt={current.name}
                loading="lazy"
                className="h-13 w-13 rounded-full object-cover border-2 border-brand-500/40 shadow-md"
              />
              <div>
                <p className="font-display text-base font-bold text-white">
                  {current.name}
                </p>
                <p className="text-xs text-surface-400">
                  {current.role} &bull; <span className="text-brand-400 font-medium">{current.duration}</span>
                </p>
              </div>
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={prev}
                aria-label="Previous testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:bg-brand-600 hover:border-brand-500 focus:outline-none"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Next testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white transition hover:bg-brand-600 hover:border-brand-500 focus:outline-none"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Indicator dots */}
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to testimonial ${idx + 1}`}
              onClick={() => setActive(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === active ? 'w-8 bg-brand-500' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
