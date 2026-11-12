import { useState, useEffect } from 'react';
import {
  Award,
  Filter,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Clock,
  X,
  Dumbbell,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import BeforeAfterSlider from '@/components/public/BeforeAfterSlider';
import ScrollReveal from '@/components/public/ScrollReveal';
import Card3D from '@/components/public/Card3D';
import { transformationService } from '@/services/transformationService';

export default function Transformations() {
  const [transformations, setTransformations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    transformationService
      .getPublicTransformations({
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        limit: 30,
      })
      .then((data) => {
        if (active) {
          setTransformations(data.rows || []);
          if (data.categories?.length) {
            setCategories(data.categories);
          }
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
  }, [selectedCategory]);

  return (
    <div className="bg-[#06070a] text-white min-h-screen pt-32 pb-24">
      {/* Hero Header */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-white/10">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[160px]" />
        </div>

        <div className="mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <ScrollReveal animation="fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.25em] text-brand-400 backdrop-blur-md">
              <Sparkles size={14} className="text-brand-400" />
              Verified Member Achievements
            </div>

            <h1 className="mt-5 font-display text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-white leading-tight break-words">
              BODY TRANSFORMATIONS. <br />
              <span className="bg-gradient-to-r from-brand-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                BUILT THROUGH DISCIPLINE.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-surface-300 leading-relaxed">
              Explore authentic, coach-verified physical milestones achieved by members of Heaven Gym. No fabricated before-and-after imagery. Real effort, calibrated nutrition, and progressive overload.
            </p>
          </ScrollReveal>

          {/* Filter Categories */}
          {categories.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`rounded-full px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'bg-white/5 text-surface-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                All Milestones ({transformations.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-5 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                    selectedCategory === cat
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                      : 'bg-white/5 text-surface-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Grid */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="animate-pulse rounded-3xl border border-white/10 bg-white/[0.02] p-5 h-[480px] flex flex-col justify-end"
              >
                <div className="h-4 w-28 bg-white/10 rounded mb-3" />
                <div className="h-6 w-3/4 bg-white/10 rounded mb-2" />
                <div className="h-4 w-1/2 bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : transformations.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {transformations.map((item) => (
              <Card3D key={item._id} className="h-full">
                <article className="flex flex-col h-full rounded-3xl border border-white/10 bg-[#0e1017] p-5 shadow-2xl transition-all duration-300 hover:border-brand-500/40">
                  {/* Before / After comparison slider */}
                  <div className="relative mb-5">
                    <BeforeAfterSlider
                      beforeImage={item.before_image?.url}
                      afterImage={item.after_image?.url}
                      beforeLabel="BEFORE"
                      afterLabel="AFTER"
                      initialPosition={48}
                      aspectRatio="aspect-[4/5]"
                    />

                    {item.duration && (
                      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/85 px-3 py-1 text-[10px] font-mono font-semibold text-white backdrop-blur-md">
                        <Clock size={11} className="text-amber-400" />
                        {item.duration}
                      </div>
                    )}
                  </div>

                  {/* Meta details */}
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="rounded bg-brand-500/10 border border-brand-500/20 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-brand-400">
                        {item.category}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                        <ShieldCheck size={13} /> Official Milestone
                      </span>
                    </div>

                    <h2 className="font-display text-lg font-bold text-white line-clamp-1">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-xs text-surface-300 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>

                    {item.achievement && (
                      <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-300 font-medium line-clamp-2">
                        ★ {item.achievement}
                      </div>
                    )}

                    <div className="mt-auto pt-5 border-t border-white/10 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveItem(item)}
                        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-white hover:text-brand-400 transition"
                      >
                        <SlidersHorizontal size={14} /> Full Comparison & Story
                      </button>
                    </div>
                  </div>
                </article>
              </Card3D>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.01] p-16 text-center max-w-xl mx-auto">
            <Award className="mx-auto text-amber-400" size={36} />
            <h3 className="mt-4 font-display text-xl font-bold text-white">
              Authentic Transformations In Progress
            </h3>
            <p className="mt-2 text-sm text-surface-400 leading-relaxed">
              Heaven Gym does not display stock photos or simulated results. Certified before-and-after transformations will be published here as soon as our coaches log active milestones.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/membership"
                className="rounded-full bg-brand-600 px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-brand-500 transition"
              >
                Join Heaven Gym
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-white/15 px-6 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-surface-300 hover:text-white transition"
              >
                Contact Trainers
              </Link>
            </div>
          </div>
        )}

        {/* Ethical Transparency Statement */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center max-w-2xl mx-auto">
          <p className="text-xs text-surface-400 leading-relaxed font-mono">
            * All results are earned through personalized resistance protocols, cardiovascular conditioning, balanced caloric intake, and consistent sleep hygiene. Individual adaptation rates vary depending on genetics and adherence.
          </p>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#0d0f15] p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => setActiveItem(null)}
              aria-label="Close modal"
              className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-surface-300 hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
              <div>
                <BeforeAfterSlider
                  beforeImage={activeItem.before_image?.url}
                  afterImage={activeItem.after_image?.url}
                  beforeLabel="BEFORE"
                  afterLabel="AFTER"
                  aspectRatio="aspect-[4/5] sm:aspect-[16/11]"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <span className="rounded bg-brand-500/20 border border-brand-500/30 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider text-brand-400">
                    {activeItem.category}
                  </span>
                  <h3 className="mt-3 font-display text-2xl sm:text-3xl font-black text-white">
                    {activeItem.title}
                  </h3>
                  {activeItem.duration && (
                    <p className="mt-1 text-xs font-mono text-surface-400">
                      Training Period: {activeItem.duration}
                    </p>
                  )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-[11px] font-mono uppercase tracking-wider text-brand-400 font-bold mb-1">
                    Protocol & Journey
                  </p>
                  <p className="text-xs text-surface-300 leading-relaxed">
                    {activeItem.description}
                  </p>
                </div>

                {activeItem.achievement && (
                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 p-4">
                    <p className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold mb-1">
                      Key Milestones
                    </p>
                    <p className="text-xs text-amber-200 font-medium">
                      ★ {activeItem.achievement}
                    </p>
                  </div>
                )}

                {activeItem.story && (
                  <blockquote className="border-l-2 border-brand-500 pl-4 italic text-xs text-surface-300 leading-relaxed">
                    &ldquo;{activeItem.story}&rdquo;
                  </blockquote>
                )}

                <div className="pt-4 flex items-center justify-between border-t border-white/10">
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Official Heaven Gym Milestone
                  </span>
                  <Link
                    to="/membership"
                    onClick={() => setActiveItem(null)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-brand-500 transition"
                  >
                    Start Your Training &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
