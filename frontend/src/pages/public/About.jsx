import { useEffect, useState } from 'react';
import {
  ArrowRight,
  Check,
  Dumbbell,
  Target,
  Users,
  Shield,
  Award,
  Flame,
  Compass,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import ScrollReveal from '@/components/public/ScrollReveal';
import ImageLightbox from '@/components/public/ImageLightbox';
import SectionDivider from '@/components/public/SectionDivider';
import api from '@/services/apiClient';

const ENVIRONMENT_IMAGES = [
  {
    id: 1,
    title: 'Main Strength Floor',
    description: 'Illustrative gym image. Visit or contact Heaven Gym to confirm its current layout and available facilities.',
    src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 2,
    title: 'Strength Training',
    description: 'Illustrative training image. Ask the gym about the equipment currently available.',
    src: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 3,
    title: 'Fitness Training',
    description: 'Illustrative fitness image. Contact Heaven Gym for details about its training spaces.',
    src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80',
  },
];

const BRAND_VALUES = [
  {
    icon: Target,
    title: 'Deliberate Intention',
    text: 'Every training session has a clear objective. We eliminate mindless workouts in favor of structured progression.',
  },
  {
    icon: Shield,
    title: 'Structural Safety & Form',
    text: 'Ego lifting has no home here. We prioritize clean movement patterns and joint health for lifetime capability.',
  },
  {
    icon: Flame,
    title: 'Uncompromised Consistency',
    text: 'Progress is not made in a single heroic day; it is forged across months of disciplined attendance.',
  },
  {
    icon: Users,
    title: 'Mutual Respect',
    text: 'Whether lifting 20kg or 200kg, every member who shows up with earnest effort commands equal respect.',
  },
];

export default function About() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [openingHours, setOpeningHours] = useState('');

  useEffect(() => {
    let active = true;
    api.get('/gym-settings').then(({ data }) => {
      if (active) setOpeningHours(data?.opening_hours || '');
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  const openLightbox = (index) => {
    setCurrentIdx(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-[#070709] text-white selection:bg-brand-500 selection:text-white">
      {/* 1. CINEMATIC ABOUT HERO */}
      <section className="relative overflow-hidden pt-36 pb-24 lg:pt-44 lg:pb-32">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1920&q=80"
            alt="Illustrative gym interior"
            className="h-full w-full object-cover filter brightness-[0.3] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/75 to-transparent" />
          <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-brand-600/20 blur-[130px] pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-down">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-400 backdrop-blur-md">
              <Sparkles size={13} /> The Heaven Standard
            </span>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <h1 className="mt-6 max-w-3xl font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.03em] leading-tight">
              BUILT FOR PEOPLE WHO <br />
              <span className="public-text-crimson-gradient">KEEP SHOWING UP.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={250}>
            <p className="mt-6 max-w-2xl text-base sm:text-lg text-surface-300 leading-relaxed">
              Heaven Gym was created as a serious haven for physical transformation. We stripped away the gimmicks, noise, and distractions to engineer a space where effort leads to measurable progress.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider variant="dark" />

      {/* 2. INTRODUCTION & 3. BRAND PHILOSOPHY */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 items-center">
            <ScrollReveal animation="fade-right">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                  Our Purpose
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
                  LESS DISTRACTION. <br />
                  <span className="public-text-silver-gradient">MORE INTENTION.</span>
                </h2>
                <p className="mt-6 text-sm sm:text-base text-surface-300 leading-relaxed">
                  We believe consistent effort and a clear training purpose can make fitness a meaningful part of everyday life. Heaven Gym’s facilities, equipment, and available support can be explored by contacting or visiting the gym.
                </p>
                <p className="mt-4 text-sm sm:text-base text-surface-300 leading-relaxed">
                  We cater to individuals who view fitness not as a temporary chore, but as an enduring discipline that builds character, energy, and physical capability.
                </p>

                <div className="mt-8 flex items-center gap-4">
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center min-w-[120px]">
                    <p className="font-display text-lg font-bold leading-tight text-brand-400">{openingHours || 'Ask us'}</p>
                    <p className="mt-1 text-[11px] text-surface-400 uppercase tracking-wider font-mono">Current Opening Hours</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center min-w-[120px]">
                    <p className="font-display text-2xl font-bold text-white">Zero</p>
                    <p className="text-[11px] text-surface-400 uppercase tracking-wider font-mono">Compromise</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left">
              <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-gradient-to-br from-brand-950/40 to-ink-950 p-8 sm:p-12">
                <div className="h-12 w-12 rounded-2xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 mb-8">
                  <Dumbbell size={24} />
                </div>
                <blockquote className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
                  &ldquo;The best version of you isn&rsquo;t found in sudden breakthroughs. It is built one disciplined session at a time.&rdquo;
                </blockquote>
                <p className="mt-6 font-mono text-xs text-brand-400 uppercase tracking-widest">
                  &mdash; The Heaven Gym Philosophy
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. MISSION & VISION */}
      <section className="py-20 bg-ink-950/70 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                Direction & Intent
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
                MISSION & VISION.
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            <ScrollReveal animation="fade-right">
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 h-full">
                <div className="flex items-center gap-3 text-brand-400 mb-4 font-mono text-xs font-bold uppercase tracking-wider">
                  <Compass size={18} /> Our Mission
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  Empowering Real Transformation
                </h3>
                <p className="text-sm text-surface-300 leading-relaxed">
                  To offer a place where people can pursue their fitness goals through regular training. Contact Heaven Gym to learn about the equipment, facilities, and coaching options currently available.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left">
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 h-full">
                <div className="flex items-center gap-3 text-brand-400 mb-4 font-mono text-xs font-bold uppercase tracking-wider">
                  <Award size={18} /> Our Vision
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  A Benchmark for Athletic Fitness
                </h3>
                <p className="text-sm text-surface-300 leading-relaxed">
                  To keep building a gym experience centered on consistency, respect, and helping members work toward their individual fitness goals.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 5. TRAINING PHILOSOPHY & 6. GYM ENVIRONMENT */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="max-w-2xl">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                Lifting Fundamentals
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
                HOW WE TRAIN.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-surface-400">
                These are general training concepts. Choose exercises and training intensity appropriate to your experience and seek qualified guidance when needed:
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Progressive Resistance',
                desc: 'Deliberately increasing load, repetitions, or time-under-tension across weeks to force muscular and neurological adaptation.',
              },
              {
                title: 'Joint Centric Mechanics',
                desc: 'Selecting exercises that align with your individual skeletal structure and joint angles to protect connective tissue.',
              },
              {
                title: 'Metabolic Conditioning',
                desc: 'Building work capacity through structured sprint work, sled pushes, and interval pacing to strengthen the cardiovascular engine.',
              },
              {
                title: 'Central Nervous Recovery',
                desc: 'Balancing intense sessions with adequate sleep, hydration, and active recovery to avoid overtraining and plateaus.',
              },
              {
                title: 'Nutritional Support',
                desc: 'Fueling sessions with quality protein and wholesome energy sources to optimize lean mass retention and repair.',
              },
              {
                title: 'Lifelong Longevity',
                desc: 'Training not just for temporary vanity, but for bone density, metabolic health, and physical capability for decades.',
              },
            ].map((item, idx) => (
              <ScrollReveal key={item.title} animation="fade-up" delay={idx * 60}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-500/40 transition duration-300">
                  <div className="h-2 w-8 bg-brand-500 rounded-full mb-4" />
                  <h3 className="font-display text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-surface-400 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FACILITIES SHOWCASE (INLINE PREVIEW) */}
      <section className="py-20 bg-ink-950/80 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                  Gym Photo Gallery
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
                  THE TRAINING GROUNDS.
                </h2>
              </div>
              <span className="text-xs font-mono text-surface-400 uppercase tracking-wider">
                Illustrative images — select to enlarge
              </span>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 md:grid-cols-3">
            {ENVIRONMENT_IMAGES.map((img, idx) => (
              <ScrollReveal key={img.id} animation="fade-up" delay={idx * 90}>
                <button
                  type="button"
                  onClick={() => openLightbox(idx)}
                  aria-label={`Enlarge image: ${img.title}`}
                  className="group w-full text-left cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-brand-500/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-500"
                >
                  <div className="aspect-[16/11] overflow-hidden bg-black/40">
                    <img
                      src={img.src}
                      alt={img.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-base font-bold text-white group-hover:text-brand-400 transition-colors">
                      {img.title}
                    </h3>
                    <p className="mt-1 text-xs text-surface-400 leading-relaxed">
                      {img.description}
                    </p>
                  </div>
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 8. COACHING APPROACH & 9. FITNESS COMMUNITY */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <ScrollReveal animation="fade-right">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1000&q=80"
                  alt="Personal training and fitness coaching"
                  loading="lazy"
                  className="h-full w-full object-cover filter contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-brand-400 font-bold">
                    Training Support
                  </span>
                  <p className="font-display text-lg font-bold text-white">
                    Ask About Coaching
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                  Culture & Community
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white leading-tight">
                  A COMMUNITY OF FOCUS.
                </h2>
                <p className="mt-6 text-sm sm:text-base text-surface-300 leading-relaxed">
                  People come to gyms with different backgrounds and fitness goals. Ask the Heaven Gym team about its membership options and the environment you can expect during a visit.
                </p>
                <p className="mt-4 text-sm sm:text-base text-surface-300 leading-relaxed">
                  If coaching or exercise guidance is important to you, contact the gym to confirm what support is available and whether it suits your needs.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    'Ask about beginner support and coaching availability',
                    'Confirm available equipment before your visit',
                    'Ask the team about cleaning and safety practices',
                  ].map((pt) => (
                    <div key={pt} className="flex items-center gap-3 text-sm text-surface-200">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 10. BRAND VALUES */}
      <section className="py-20 bg-ink-950/80 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                Core Pillars
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
                THE PRINCIPLES WE STAND FOR.
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BRAND_VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <ScrollReveal key={val.title} animation="fade-up" delay={idx * 80}>
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-500 transition duration-300">
                    <div className="h-11 w-11 rounded-xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center text-brand-400 mb-5">
                      <Icon size={20} />
                    </div>
                    <h3 className="font-display text-base font-bold text-white mb-2">{val.title}</h3>
                    <p className="text-xs text-surface-400 leading-relaxed">{val.text}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* 11. JOIN HEAVEN GYM CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/30 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center lg:px-8">
          <ScrollReveal animation="fade-up">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
              Start Today
            </span>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl font-black text-white">
              EXPERIENCE THE STANDARD IN PERSON.
            </h2>
            <p className="mt-4 text-base text-surface-300 max-w-xl mx-auto">
              Choose an access plan that fits your schedule, or come in to inspect the facility firsthand.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link to="/membership">
                <Button size="lg" className="bg-brand-600 hover:bg-brand-500 text-white font-bold uppercase tracking-wider text-xs px-8 py-4 shadow-xl shadow-brand-600/30">
                  Explore Membership Plans <ArrowRight size={16} className="ml-1.5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-white/20 text-white hover:border-brand-500 text-xs font-bold uppercase tracking-wider px-8 py-4">
                  Visit The Gym
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Lightbox for Environment Images */}
      <ImageLightbox
        isOpen={lightboxOpen}
        images={ENVIRONMENT_IMAGES}
        currentIndex={currentIdx}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setCurrentIdx((prev) => (prev + 1) % ENVIRONMENT_IMAGES.length)}
        onPrev={() => setCurrentIdx((prev) => (prev - 1 + ENVIRONMENT_IMAGES.length) % ENVIRONMENT_IMAGES.length)}
      />
    </div>
  );
}
