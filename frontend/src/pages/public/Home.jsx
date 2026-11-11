import { useState, useEffect } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Dumbbell,
  Flame,
  HeartPulse,
  Sparkles,
  Trophy,
  Users,
  Shield,
  Target,
  Clock,
  Compass,
  Award,
  ChevronDown,
  ShoppingBag,
  Activity,
  Play,
  Layers,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@/components/ui/Button';
import ScrollReveal from '@/components/public/ScrollReveal';
import ImageLightbox from '@/components/public/ImageLightbox';
import TestimonialCarousel from '@/components/public/TestimonialCarousel';
import StatsCounter from '@/components/public/StatsCounter';
import SectionDivider from '@/components/public/SectionDivider';
import TransformationShowcase from '@/components/public/TransformationShowcase';
import { fetchMembershipPlans } from '@/redux/slices/membershipPlanSlice';
import { fetchProducts } from '@/redux/slices/productSlice';
import { formatCurrency } from '@/utils/formatters';

// Facilities Showcase Data
const FACILITIES = [
  {
    id: 1,
    title: 'Heavy Strength & Power Racks',
    tag: 'Strength Zone',
    description: 'Competition-grade power racks, calibrated plates, and Olympic bars engineered for heavy compound lifts.',
    src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 2,
    title: 'Free Weights & Dumbbell Array',
    tag: 'Free Weights',
    description: 'Precision urethane dumbbells ranging up to heavy dumbbell pairs, dual adjustable benches, and cable towers.',
    src: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 3,
    title: 'High-Performance Cardio Deck',
    tag: 'Cardiovascular',
    description: 'Curved motorless treadmills, stair climbers, concept rowers, and air bikes for targeted metabolic conditioning.',
    src: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 4,
    title: 'Functional Turf & Movement Bay',
    tag: 'Functional Space',
    description: 'High-density indoor sled turf, kettlebell stations, plyo boxes, and resistance band anchors for athletic drills.',
    src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 5,
    title: 'Plate-Loaded Machine Isolations',
    tag: 'Hypertrophy Area',
    description: 'Biomechanically precise convergent and divergent resistance machines designed for targeted muscle engagement.',
    src: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 6,
    title: 'Mobility & Recovery Zone',
    tag: 'Recovery Space',
    description: 'Dedicated warm-up floor, foam rollers, massage guns, stretching mats, and controlled breathing spaces.',
    src: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80',
  },
];

// Training Programs
const PROGRAMS = [
  {
    id: 'strength',
    title: 'Strength & Power Development',
    level: 'All Experience Levels',
    focus: 'Compound Lifts & Progressive Overload',
    description: 'Master the barbell squat, bench press, deadlift, and overhead press with structured periodization models.',
    image: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'hypertrophy',
    title: 'Hypertrophy & Physique Architecture',
    level: 'Intermediate to Advanced',
    focus: 'Muscle Volume & Controlled Tempo',
    description: 'High-tension hypertrophy protocols emphasizing full range of motion, mechanical tension, and balanced symmetry.',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'conditioning',
    title: 'Metabolic Conditioning & Engine',
    level: 'All Levels',
    focus: 'Cardiovascular Work Capacity',
    description: 'High-output interval work on assault bikes, rowers, and sleds to elevate VO2 max and burn energy efficiently.',
    image: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pt',
    title: '1-on-1 Elite Personal Coaching',
    level: 'Custom Tailored',
    focus: 'Individual Goals & Biomechanics',
    description: 'Dedicated individual instruction with movement screening, personalized programming, and accountability.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
  },
];

// Coaches & Trainers
const COACHES = [
  {
    name: 'Kabir Malhotra',
    role: 'Head Strength Coach & Director',
    experience: '8+ Years Experience',
    specs: 'Powerlifting & Biomechanics',
    bio: 'Certified strength and conditioning specialist focused on structural balance, lifting technique, and injury prevention.',
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Ananya Deshmukh',
    role: 'Physique & Conditioning Coach',
    experience: '6+ Years Experience',
    specs: 'Hypertrophy & Female Strength',
    bio: 'Dedicated to empowering athletes with progressive strength programming and structured body composition strategies.',
    image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Devendra Rana',
    role: 'Mobility & Athletic Performance',
    experience: '7+ Years Experience',
    specs: 'Functional Training & Recovery',
    bio: 'Specialist in joint longevity, core stabilization, and dynamic athletic movement for high-performance training.',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
  },
];

// Nutrition & Recovery Cards
const NUTRITION_CARDS = [
  {
    title: 'Protein Synthesis & Timing',
    category: 'Nutrition Fundamentals',
    description: 'Prioritize adequate daily complete protein (1.6g–2.2g per kg bodyweight) distributed across 3–4 meals to maximize muscular recovery.',
    badge: 'Dietary Standard',
  },
  {
    title: 'Intra-Workout Hydration & Salts',
    category: 'Cellular Performance',
    description: 'Sustained muscular contraction requires optimal sodium, potassium, and fluid balance before, during, and after intense sessions.',
    badge: 'Hydration',
  },
  {
    title: 'Sleep Architecture (7–9 Hours)',
    category: 'Systemic Recovery',
    description: 'Deep REM and Slow-Wave Sleep are non-negotiable for human growth hormone release, central nervous system restoration, and mental focus.',
    badge: 'Recovery',
  },
  {
    title: 'Movement Prep & Deload Weeks',
    category: 'Injury Prevention',
    description: 'Incorporate 10-minute dynamic warm-ups prior to loaded sets and schedule deliberate deload blocks to allow connective tissue adaptation.',
    badge: 'Longevity',
  },
];

// Gallery Images
const GALLERY_ITEMS = [
  {
    id: 101,
    title: 'Olympic Lifting Platforms',
    tag: 'Equipment',
    src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 102,
    title: 'Dumbbell Conditioning Rack',
    tag: 'Free Weights',
    src: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 103,
    title: 'Chalk & Barbell Grip',
    tag: 'Discipline',
    src: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 104,
    title: 'High-Output Cardio Deck',
    tag: 'Cardio',
    src: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 105,
    title: 'Athletic Turf Training',
    tag: 'Functional',
    src: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 106,
    title: 'Plate-Loaded Racks',
    tag: 'Machines',
    src: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=1200&q=80',
  },
];

export default function Home() {
  const dispatch = useDispatch();
  const plans = useSelector((state) => state.membershipPlans.items);
  const products = useSelector((state) => state.products.items);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState(FACILITIES);

  useEffect(() => {
    dispatch(fetchMembershipPlans());
    dispatch(fetchProducts());
  }, [dispatch]);

  const openLightbox = (imagesList, index) => {
    setLightboxImages(imagesList);
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-[#070709] text-white selection:bg-brand-500 selection:text-white">
      {/* =========================================================================
          SECTION B: CINEMATIC HERO SECTION (INSPIRED BY REFERENCE IMAGE 1)
          - Deep black cinematic background
          - Large athletic subject in dramatic chiaroscuro studio lighting on the right
          - Bold, high-contrast typography with crimson red accenting
          - High-contrast white CTA button + preview pill
          ========================================================================= */}
      <section className="relative min-h-[92vh] lg:min-h-screen flex items-center overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24 bg-black">
        {/* Background Athletic Subject (Chiaroscuro lighting right-aligned) */}
        <div className="absolute inset-0 z-0 flex justify-end overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1800&q=85"
            alt="Elite Athletic Training at Heaven Gym"
            className="h-full w-full lg:w-[65%] object-cover object-top filter brightness-[0.45] contrast-125 lg:brightness-[0.75] transition-all duration-700 select-none pointer-events-none"
          />
          {/* Subtle gradient fades to ensure headline readability on left */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/90 to-transparent lg:w-[65%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60" />
          <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-brand-600/15 blur-[150px] pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8 w-full">
          <div className="max-w-2xl lg:max-w-3xl">
            {/* Top Brand Tag */}
            <ScrollReveal animation="fade-down" delay={80}>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/35 bg-brand-500/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.25em] text-brand-400 backdrop-blur-md">
                <Sparkles size={13} className="text-brand-400" />
                Premier Fitness Club &bull; Purnia
              </div>
            </ScrollReveal>

            {/* Primary Headline (Direct Reference Image 1 Design Direction) */}
            <ScrollReveal animation="fade-up" delay={180}>
              <h1 className="mt-6 font-display text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.03] tracking-[-0.035em] uppercase">
                TAKE YOUR <span className="text-brand-500">FITNESS</span> <br />
                TO THE NEXT LEVEL
              </h1>
            </ScrollReveal>

            {/* Supporting Copy */}
            <ScrollReveal animation="fade-up" delay={280}>
              <p className="mt-6 max-w-xl text-base sm:text-lg leading-relaxed text-surface-300">
                An elite training sanctuary engineered for discipline, strength, and genuine physical development. High-caliber equipment, certified coaching, and an environment that holds you to a higher standard.
              </p>
            </ScrollReveal>

            {/* Action CTA Buttons (Reference Image 1: High Contrast White Button + Preview Pill) */}
            <ScrollReveal animation="fade-up" delay={380}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link to="/register">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-surface-200 hover:scale-105 shadow-2xl active:scale-95"
                  >
                    <span>Get Started</span>
                    <ArrowRight size={17} strokeWidth={2.5} />
                  </button>
                </Link>

                <button
                  type="button"
                  onClick={() => openLightbox(FACILITIES, 0)}
                  className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-md transition hover:border-brand-500 hover:bg-brand-500/10"
                >
                  <span>Explore Facilities</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white shadow-md transition group-hover:scale-110">
                    <Play size={13} fill="currentColor" />
                  </span>
                </button>
              </div>
            </ScrollReveal>

            {/* Operational Highlights */}
            <ScrollReveal animation="fade-up" delay={480}>
              <div className="mt-12 grid grid-cols-3 max-w-md gap-4 border-t border-white/10 pt-6">
                <div>
                  <p className="font-display text-2xl font-black text-white">5:00 AM</p>
                  <p className="mt-1 text-[11px] text-surface-400 font-mono">Daily Opening</p>
                </div>
                <div className="border-l border-white/10 pl-4">
                  <p className="font-display text-2xl font-black text-brand-400">100%</p>
                  <p className="mt-1 text-[11px] text-surface-400 font-mono">Honest Effort</p>
                </div>
                <div className="border-l border-white/10 pl-4">
                  <p className="font-display text-2xl font-black text-white">6+ Zones</p>
                  <p className="mt-1 text-[11px] text-surface-400 font-mono">Precision Spaces</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-1 opacity-60 hover:opacity-100 transition">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-surface-400">
            Scroll Down
          </span>
          <ChevronDown size={15} className="animate-bounce text-brand-400" />
        </div>
      </section>

      {/* =========================================================================
          SECTION C: EDITORIAL CONTENT SECTION (INSPIRED BY REFERENCE IMAGE 2)
          - Crisp white/light surface for visual contrast & variety
          - Bold headline: "SUPPORTING YOUR FITNESS JOURNEY"
          - Dual athlete images
          - Red button with integrated arrow box: [ About Us | ↗ ]
          ========================================================================= */}
      <section className="bg-[#f8fafc] text-slate-900 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            {/* Athletic Photography Frame */}
            <ScrollReveal animation="fade-right">
              <div className="relative aspect-[4/5] max-w-lg mx-auto overflow-hidden rounded-3xl shadow-2xl bg-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1000&q=80"
                  alt="Athlete Training at Heaven Gym"
                  loading="lazy"
                  className="h-full w-full object-cover filter contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-brand-400 font-bold">
                    HEAVEN GYM STANDARD
                  </span>
                  <p className="font-display text-xl font-bold mt-1">
                    Engineered for Maximum Mechanical Tension
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Editorial Content */}
            <ScrollReveal animation="fade-left">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-[0.25em] text-brand-600">
                  Built For Your Best Self
                </span>

                <h2 className="mt-3 font-display text-3xl sm:text-5xl font-black tracking-tight text-slate-950 leading-tight">
                  SUPPORTING YOUR <br />
                  <span className="text-brand-600">FITNESS JOURNEY.</span>
                </h2>

                <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed">
                  Heaven Gym is designed to deliver a complete fitness experience, with spacious workout zones, advanced resistance equipment, and certified coaches who understand biomechanics.
                </p>

                <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed">
                  Whether your focus is compound powerlifting, muscle hypertrophy, or functional endurance, our facility provides the exact environment you need to build consistency and measurable results.
                </p>

                {/* Integrated Red Button with Arrow Box (Reference Image 2 Style) */}
                <div className="mt-9 flex items-center">
                  <Link to="/about" className="group inline-flex items-stretch rounded-xl overflow-hidden shadow-xl shadow-brand-600/25">
                    <span className="bg-brand-600 px-7 py-4 text-xs font-bold uppercase tracking-wider text-white transition group-hover:bg-brand-500">
                      About Heaven Gym
                    </span>
                    <span className="flex items-center justify-center bg-brand-700 px-4 text-white transition group-hover:bg-brand-600">
                      <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION D: FACILITIES SHOWCASE
          ========================================================================= */}
      <section className="py-20 bg-ink-950/80 border-y border-white/5 relative">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                  Facilities & Infrastructure
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
                  TRAIN IN AN ENVIRONMENT BUILT FOR PROGRESS.
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-surface-400">
                  Each zone is engineered for maximum performance, ergonomic safety, and zero congestion.
                </p>
              </div>

              <span className="text-xs font-mono text-surface-400 uppercase tracking-wider hidden sm:block">
                Click any zone to inspect
              </span>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FACILITIES.map((facility, index) => (
              <ScrollReveal key={facility.id} animation="fade-up" delay={index * 80}>
                <div
                  onClick={() => openLightbox(FACILITIES, index)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-lg transition-all duration-300 hover:border-brand-500/50 hover:-translate-y-1"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-black/40">
                    <img
                      src={facility.src}
                      alt={facility.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108 filter contrast-105"
                    />
                  </div>

                  <div className="p-6">
                    <span className="inline-block rounded-md bg-brand-500/15 border border-brand-500/25 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-400">
                      {facility.tag}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                      {facility.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-surface-400 line-clamp-2">
                      {facility.description}
                    </p>
                  </div>

                  <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/60 border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Sparkles size={14} className="text-brand-400" />
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION E: BODY TRANSFORMATION EXPERIENCE (INTERACTIVE BEFORE & AFTER)
          "TRANSFORMATION IS BUILT, NOT GIVEN."
          ========================================================================= */}
      <section className="py-24 lg:py-32 bg-black border-b border-white/5">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <TransformationShowcase />
        </div>
      </section>

      {/* =========================================================================
          SECTION F: TRAINING PROGRAMS
          ========================================================================= */}
      <section className="py-20 bg-ink-950/70 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                  Disciplined Pathways
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
                  FIND YOUR TRAINING DIRECTION.
                </h2>
                <p className="mt-2 text-sm text-surface-400 max-w-xl">
                  Whether building absolute strength or developing conditioning, our structured pathways guide your routine.
                </p>
              </div>

              <Link to="/membership">
                <Button variant="outline" className="border-white/20 text-white hover:border-brand-500 text-xs uppercase tracking-wider font-bold">
                  View All Access Plans &rarr;
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {PROGRAMS.map((prog, index) => (
              <ScrollReveal key={prog.id} animation="fade-up" delay={index * 90}>
                <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-all duration-300 hover:border-brand-500 hover:-translate-y-1.5 h-full">
                  <div>
                    <div className="aspect-[4/3] overflow-hidden bg-black/40 relative">
                      <img
                        src={prog.image}
                        alt={prog.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105 filter contrast-110"
                      />
                      <span className="absolute bottom-3 left-3 rounded bg-black/80 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-brand-400 border border-white/15">
                        {prog.level}
                      </span>
                    </div>

                    <div className="p-5">
                      <h3 className="font-display text-base font-bold text-white group-hover:text-brand-400 transition-colors">
                        {prog.title}
                      </h3>
                      <p className="mt-1 text-[11px] font-mono text-brand-400">
                        {prog.focus}
                      </p>
                      <p className="mt-3 text-xs leading-relaxed text-surface-400">
                        {prog.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <Link to="/membership" className="inline-flex items-center gap-1 text-xs font-bold text-white group-hover:text-brand-400 transition-colors">
                      Learn Program Details <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION G: COACHES AND TRAINERS
          ========================================================================= */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                Certified Mentorship
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
                THE PEOPLE BEHIND YOUR PROGRESS.
              </h2>
              <p className="mt-3 text-sm text-surface-400">
                Heaven Gym coaches possess verified credentials and a commitment to movement quality, safety, and sustainable strength.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {COACHES.map((coach, index) => (
              <ScrollReveal key={coach.name} animation="fade-up" delay={index * 100}>
                <div className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition hover:border-brand-500/50">
                  <div className="aspect-[4/5] overflow-hidden bg-black/40 relative">
                    <img
                      src={coach.image}
                      alt={coach.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 filter contrast-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-brand-400">
                        {coach.experience}
                      </span>
                      <h3 className="font-display text-xl font-bold text-white">
                        {coach.name}
                      </h3>
                      <p className="text-xs text-surface-300">
                        {coach.role}
                      </p>
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="inline-block rounded bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-brand-300 mb-3">
                      Specialization: {coach.specs}
                    </span>
                    <p className="text-xs leading-relaxed text-surface-400">
                      {coach.bio}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION H: MEMBER TESTIMONIALS (CAROUSEL)
          ========================================================================= */}
      <section className="py-20 bg-ink-950/80 border-y border-white/5 relative">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                Verified Reviews
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
                THE HEAVEN GYM EXPERIENCE.
              </h2>
              <p className="mt-3 text-sm text-surface-400">
                Hear directly from the lifters and athletes who show up every single week.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <TestimonialCarousel />
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION I: FITNESS STATISTICS
          ========================================================================= */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="mb-10 text-center">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                Operational Numbers
              </p>
              <h2 className="mt-2 font-display text-2xl sm:text-3xl font-black text-white">
                METRICS ROOTED IN REALITY.
              </h2>
            </div>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <StatsCounter />
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION J: NUTRITION & RECOVERY EDUCATION
          ========================================================================= */}
      <section className="py-20 bg-ink-950/70 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                Physical Longevity
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
                PROGRESS GOES BEYOND THE WORKOUT.
              </h2>
              <p className="mt-3 text-sm text-surface-400">
                Training stimulates adaptation, but nutrition, sleep, and recovery build the result.
              </p>
            </div>
          </ScrollReveal>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {NUTRITION_CARDS.map((card, i) => (
              <ScrollReveal key={card.title} animation="fade-up" delay={i * 80}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition duration-300 hover:border-brand-500/40">
                  <span className="rounded bg-brand-500/10 border border-brand-500/20 px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-brand-400">
                    {card.badge}
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold text-white">
                    {card.title}
                  </h3>
                  <p className="mt-1 text-xs text-surface-400 font-mono">
                    {card.category}
                  </p>
                  <p className="mt-3 text-xs leading-relaxed text-surface-300">
                    {card.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION J.5: MEMBERSHIP PREVIEW (LIVE PLANS)
          ========================================================================= */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                  Membership Access
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
                  CHOOSE YOUR LEVEL OF COMMITMENT.
                </h2>
                <p className="mt-2 text-sm text-surface-400 max-w-xl">
                  Start where you are. Build from there. Every plan gives you the space to train with purpose.
                </p>
              </div>

              <Link to="/membership">
                <Button variant="outline" className="border-white/20 text-white hover:border-brand-500 text-xs font-bold uppercase tracking-wider">
                  View All Plans &rarr;
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          {plans && plans.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.slice(0, 3).map((plan, index) => {
                const isFeatured = index === 1;
                const duration = Math.max(1, Number(plan.duration_days || 30));

                return (
                  <ScrollReveal key={plan.id} animation="fade-up" delay={index * 100}>
                    <div
                      className={`relative flex flex-col justify-between rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 ${
                        isFeatured
                          ? 'border-brand-500 bg-gradient-to-b from-brand-950/40 via-white/[0.04] to-transparent shadow-xl shadow-brand-500/10'
                          : 'border-white/10 bg-white/[0.02] hover:border-white/25'
                      }`}
                    >
                      {isFeatured && (
                        <span className="absolute top-5 right-5 rounded-full bg-brand-600 px-3 py-1 font-mono text-[9px] font-bold uppercase tracking-wider text-white">
                          Popular Plan
                        </span>
                      )}

                      <div>
                        <h3 className="font-display text-xl font-bold text-white">{plan.name}</h3>
                        <p className="mt-1 text-xs font-mono text-surface-400">{duration} Days Gym Access</p>

                        <div className="mt-5 flex items-baseline gap-2">
                          <span className="font-display text-3xl font-black text-white">
                            {formatCurrency(plan.price)}
                          </span>
                          <span className="text-xs text-surface-400 font-mono">
                            / {plan.duration_days >= 180 ? '6 mo' : plan.duration_days >= 90 ? '3 mo' : 'mo'}
                          </span>
                        </div>

                        <ul className="mt-6 space-y-2.5 border-t border-white/10 pt-5">
                          {(plan.features || []).slice(0, 4).map((feature, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2 text-xs text-surface-300">
                              <Check size={14} className="mt-0.5 text-brand-400 shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-7 pt-4 border-t border-white/5">
                        <Link to="/register" className="block">
                          <Button
                            className={`w-full text-xs font-bold uppercase tracking-wider py-3 ${
                              isFeatured
                                ? 'bg-brand-600 hover:bg-brand-500 text-white'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                            }`}
                          >
                            Get Started
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION K: FEATURED STORE PRODUCTS (LIVE API / REDUX)
          ========================================================================= */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                  Certified Supplements
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
                  FUEL YOUR FITNESS JOURNEY.
                </h2>
                <p className="mt-2 text-sm text-surface-400 max-w-xl">
                  Tested proteins, performance supplements, and training essentials from the official Heaven Gym pro store.
                </p>
              </div>

              <Link to="/store">
                <Button variant="outline" className="border-white/20 text-white hover:border-brand-500 text-xs font-bold uppercase tracking-wider">
                  Browse Store Catalog <ShoppingBag size={14} className="ml-1.5" />
                </Button>
              </Link>
            </div>
          </ScrollReveal>

          {products && products.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((product) => {
                const imgUrl = product.image_url || product.images?.[0]?.url;
                const price = product.sale_price || product.price;

                return (
                  <ScrollReveal key={product.id} animation="fade-up">
                    <div className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-4 transition-all duration-300 hover:border-brand-500 hover:-translate-y-1 h-full">
                      <div>
                        <div className="flex aspect-square items-center justify-center rounded-xl bg-black/40 p-4 overflow-hidden relative">
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={product.name}
                              loading="lazy"
                              className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <ShoppingBag size={48} className="text-brand-500/50" />
                          )}
                          {product.sale_price && (
                            <span className="absolute top-3 right-3 rounded bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                              Sale
                            </span>
                          )}
                        </div>

                        <div className="mt-4">
                          <p className="text-[10px] font-mono uppercase tracking-wider text-brand-400">
                            {product.category_id?.name || product.brand || 'Nutrition'}
                          </p>
                          <h3 className="mt-1 font-display text-sm font-bold text-white line-clamp-1 group-hover:text-brand-400 transition-colors">
                            {product.name}
                          </h3>
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="font-display text-base font-extrabold text-white">
                              {formatCurrency(price)}
                            </span>
                            {product.sale_price && (
                              <span className="text-xs text-surface-500 line-through">
                                {formatCurrency(product.price)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10">
                        <Link to="/store">
                          <Button size="sm" className="w-full text-xs font-bold uppercase tracking-wider bg-brand-600 hover:bg-brand-500 text-white">
                            View Product
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
              <ShoppingBag className="mx-auto text-brand-500 mb-2" size={32} />
              <p className="text-sm font-semibold text-white">Official store catalog syncing...</p>
              <Link to="/store" className="mt-3 inline-block text-xs font-bold text-brand-400 hover:underline">
                Explore Pro Store &rarr;
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION L: PREMIUM GALLERY
          ========================================================================= */}
      <section className="py-20 bg-ink-950/80 border-y border-white/5">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                Visual Tour
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
                INSIDE HEAVEN GYM.
              </h2>
              <p className="mt-3 text-sm text-surface-400">
                Explore our world-class layout, precision equipment, and athletic atmosphere.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {GALLERY_ITEMS.map((item, index) => (
              <ScrollReveal key={item.id} animation="zoom-in" delay={index * 60}>
                <div
                  onClick={() => openLightbox(GALLERY_ITEMS, index)}
                  className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-black/40 aspect-[4/3] shadow-md transition hover:border-brand-500/60"
                >
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 filter contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-brand-400">
                      {item.tag}
                    </span>
                    <p className="font-display text-sm font-bold text-white">
                      {item.title}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION M: FINAL CALL TO ACTION
          ========================================================================= */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/40 via-brand-600/20 to-black pointer-events-none" />
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-brand-600/25 blur-[150px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-5xl px-5 text-center lg:px-8">
          <ScrollReveal animation="fade-up">
            <span className="inline-block rounded-full border border-brand-500/40 bg-brand-500/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.25em] text-brand-400">
              The Standard Awaits
            </span>

            <h2 className="mt-6 font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
              YOUR NEXT CHAPTER <br />
              <span className="public-text-crimson-gradient">STARTS HERE.</span>
            </h2>

            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-surface-300 leading-relaxed">
              Build consistency. Develop strength. Make every training session count. Join Heaven Gym today and experience fitness done with intention.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-brand-600 hover:bg-brand-500 text-white font-bold uppercase tracking-wider text-sm px-9 py-4 shadow-2xl shadow-brand-600/40 border border-brand-400/30"
                >
                  Join Heaven Gym <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>

              <Link to="/membership">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 bg-white/[0.04] text-white hover:border-brand-500 hover:bg-brand-500/10 text-sm font-semibold uppercase tracking-wider px-8 py-4 backdrop-blur-md"
                >
                  Explore Memberships
                </Button>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Global Gallery Lightbox Modal */}
      <ImageLightbox
        isOpen={lightboxOpen}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNext={() => setLightboxIndex((prev) => (prev + 1) % lightboxImages.length)}
        onPrev={() => setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length)}
      />
    </div>
  );
}
