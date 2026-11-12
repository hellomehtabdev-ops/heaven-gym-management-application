import { useState, useEffect, useRef } from 'react';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Award,
  Building,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coffee,
  Crosshair,
  Crown,
  Dumbbell,
  Flame,
  HeartPulse,
  Leaf,
  Medal,
  MessageCircle,
  Music,
  Package,
  Play,
  Shield,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Tag,
  Target,
  Trophy,
  Users,
  Waves,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@/components/ui/Button';
import ScrollReveal from '@/components/public/ScrollReveal';
import Card3D from '@/components/public/Card3D';
import Hero3DCanvas from '@/components/public/Hero3DCanvas';
import TransformationShowcase from '@/components/public/TransformationShowcase';
import BeforeAfterSlider from '@/components/public/BeforeAfterSlider';
import { useGsapContext, animateStaggerCards, animateHeroSequence } from '@/utils/gsapAnimation';
import { fetchMembershipPlans } from '@/redux/slices/membershipPlanSlice';
import { fetchProducts } from '@/redux/slices/productSlice';
import { gymEquipmentService } from '@/services/gymEquipmentService';
import { formatCurrency } from '@/utils/formatters';
import api from '@/services/apiClient';
import { getWhatsAppNumber } from '@/utils/phone';

export default function Home() {
  const dispatch = useDispatch();
  const membershipPlans = useSelector((state) => state.membershipPlans.items);
  const products = useSelector((state) => state.products.items);

  const [gymSettings, setGymSettings] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const homeRef = useRef(null);
  const heroRef = useRef(null);

  useGsapContext(homeRef, () => {
    animateHeroSequence(heroRef.current);
    animateStaggerCards(homeRef.current, '.facility-preview-card', { y: 35, stagger: 0.12 });
    animateStaggerCards(homeRef.current, '.coach-card', { y: 35, stagger: 0.12 });
  });

  useEffect(() => {
    dispatch(fetchMembershipPlans());
    dispatch(fetchProducts());

    gymEquipmentService
      .getPublic({ limit: 4 })
      .then((data) => setEquipmentList(data.rows || []))
      .catch(() => {});

    api
      .get('/gym-settings')
      .then(({ data }) => setGymSettings(data))
      .catch(() => {});
  }, [dispatch]);

  const internationalPhone = getWhatsAppNumber(gymSettings?.contact_phone);

  const getWhatsAppLink = (message) => {
    if (!internationalPhone) return '';
    return `https://wa.me/${internationalPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div ref={homeRef} className="bg-[#050608] text-white selection:bg-brand-500 selection:text-white overflow-hidden">
      {/* =========================================================================
          SECTION 01 — CINEMATIC HERO / FRONT PAGE ADVERTISEMENT
          ========================================================================= */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 lg:pt-36 lg:pb-24">
        {/* Background Atmosphere Image with Controlled Cinematic Grade */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=85"
            alt="Gym training facility interior"
            className="h-full w-full object-cover filter brightness-[0.32] contrast-115"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050608] via-[#050608]/75 to-[#050608]/60" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#050608]/40 to-[#050608]" />
          <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-amber-500/10 blur-[140px] pointer-events-none" />
        </div>

        {/* Hero Content Overlay: Asymmetrical 2-Column Responsive Layout */}
        <div className="relative z-20 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 w-full py-8 lg:py-12">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left/Central Column: Headline, Subtitle, and CTAs (lg:col-span-7) */}
            <div className="lg:col-span-7 flex flex-col items-start text-left z-20">
              <div className="hero-badge inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-black/60 px-4 py-1.5 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-amber-300 backdrop-blur-xl shadow-lg">
                <Sparkles size={13} className="text-amber-400" />
                The Luxury Fitness Standard
              </div>

              <h1 className="hero-title mt-6 font-display text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-[1.08] text-white">
                BUILD STRENGTH. <br />
                <span className="bg-gradient-to-r from-amber-200 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  DISCOVER YOUR POTENTIAL.
                </span>
              </h1>

              <p className="hero-desc mt-5 max-w-xl text-sm sm:text-base lg:text-lg text-surface-300 font-normal leading-relaxed">
                More than a place to train. A space designed to help you move better, grow stronger, and build a healthier lifestyle.
              </p>

              <div className="hero-cta mt-8 flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Link to="/membership" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-mono font-bold uppercase tracking-wider px-7 py-3.5 rounded-full shadow-xl shadow-brand-600/30 border border-brand-400/25 active:scale-95 transition-all"
                  >
                    Explore Membership <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>

                <Link to="/facilities" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto border-white/20 bg-white/[0.04] text-white hover:border-amber-400 hover:bg-amber-400/10 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider px-7 py-3.5 rounded-full backdrop-blur-md active:scale-95 transition-all"
                  >
                    Explore Our Facilities
                  </Button>
                </Link>
              </div>

              {/* Verification Watermark Badges */}
              <div className="hero-cta mt-10 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4 w-full text-xs font-mono text-surface-400">
                <span className="flex items-center gap-2">
                  <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                  <span>Pristine Hygiene</span>
                </span>
                <span className="flex items-center gap-2">
                  <Dumbbell size={15} className="text-amber-400 shrink-0" />
                  <span>Calibrated Weights</span>
                </span>
                <span className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <Clock size={15} className="text-brand-400 shrink-0" />
                  <span>Open 5 AM – 10 PM</span>
                </span>
              </div>
            </div>

            {/* Right Column: Dedicated 3D Olympic Weight Plate Viewport (lg:col-span-5) */}
            <div className="lg:col-span-5 relative flex items-center justify-center w-full h-[320px] sm:h-[380px] lg:h-[500px] xl:h-[560px] pointer-events-none">
              <Hero3DCanvas />
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 02 — REAL BODY TRANSFORMATIONS
          ========================================================================= */}
      <TransformationShowcase />

      {/* =========================================================================
          SECTION 03 — FACILITIES INTRODUCTION
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#06070a] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div className="max-w-2xl">
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-500">
                  World-Class Architecture
                </span>
                <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-6xl font-black text-white leading-tight break-words">
                  EVERYTHING YOU NEED <br />
                  <span className="bg-gradient-to-r from-brand-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                    TO GO FURTHER.
                  </span>
                </h2>
                <p className="mt-4 text-base text-surface-300 leading-relaxed">
                  Every square foot of Heaven Gym has been engineered with purpose. Experience unmatched free-weight arrays, biomechanically pure resistance machines, thermal steam recovery, and pristine sanitization.
                </p>
              </div>

              <Link
                to="/facilities"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white hover:border-brand-500 hover:bg-brand-500/10 transition"
              >
                <span>Explore All Facilities</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </ScrollReveal>

          {/* Editorial Visual Composition */}
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Heavy Strength Arena',
                sub: 'Calibrated Olympic Lifting',
                src: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
                link: '/facilities#strength',
                alt: 'Strength training floor with Olympic power racks and barbells',
              },
              {
                title: 'Thermal Steam & Sauna',
                sub: 'Muscular Recovery & Relaxation',
                src: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
                link: '/facilities#steam',
                alt: 'Thermal steam recovery and relaxation suite',
              },
              {
                title: 'High-Impact Cardio Deck',
                sub: 'Curved Slat & Air Ergometers',
                src: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1000&q=80',
                link: '/facilities#cardio',
                alt: 'Cardio conditioning deck with rowers and curved treadmills',
              },
            ].map((f) => (
              <div key={f.title} className="facility-preview-card h-full">
                <Card3D className="h-full">
                  <Link
                    to={f.link}
                    className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-[#0e1017] shadow-2xl"
                  >
                    <img
                      src={f.src}
                      alt={f.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108 filter brightness-85 contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-[11px] font-mono uppercase tracking-widest text-amber-400">
                        {f.sub}
                      </p>
                      <h3 className="mt-1 font-display text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                        {f.title}
                      </h3>
                      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-surface-300 group-hover:text-white">
                        Discover Details &rarr;
                      </span>
                    </div>
                  </Link>
                </Card3D>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04 — LUXURY GYM MACHINES
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#090b10] border-t border-white/10 overflow-hidden">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <ScrollReveal animation="fade-right">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-500">
                  Precision Engineering
                </span>
                <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight break-words">
                  LUXURY PIN-SELECT & <br />
                  <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                    PLATE-LOADED MACHINES.
                  </span>
                </h2>
                <p className="mt-5 text-sm sm:text-base text-surface-300 leading-relaxed">
                  Every machine at Heaven Gym is calibrated to match natural musculoskeletal resistance curves. We reject clunky, awkward levers in favor of smooth Kevlar belt drives, converging chest presses, and multi-angle footplates that protect joints under maximum load.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    'Converging Biomechanical Arcs',
                    'Zero-Friction Kevlar Cables',
                    'Micro-Load 1.25kg Adjustments',
                    'Anatomical Ergonomic Cushioning',
                  ].map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-surface-200"
                    >
                      <CheckCircle2 size={15} className="text-amber-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <Link
                    to="/facilities#machines"
                    className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition"
                  >
                    <span>View Machine Specifications</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left">
              <div className="relative aspect-[4/3] rounded-3xl border border-white/10 overflow-hidden shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80"
                  alt="Precision Resistance Machines"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono">
                  <span className="text-white font-bold">Plate-Loaded Hack Squats & Presses</span>
                  <span className="rounded bg-black/70 px-2.5 py-1 text-amber-400 border border-white/10">
                    Pro Grade
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 05 — HYGIENIC & LUXURY ENVIRONMENT
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#050608] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center lg:grid-flow-dense">
            <ScrollReveal animation="fade-left" className="lg:col-start-2">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Pure Cleanliness
                </span>
                <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight break-words">
                  METICULOUS HYGIENE & <br />
                  <span className="text-surface-100">LUXURY ATMOSPHERE.</span>
                </h2>
                <p className="mt-5 text-sm sm:text-base text-surface-300 leading-relaxed">
                  We believe workout spaces should feel inspiring, pristine, and clean. Heaven Gym maintains high-volume air filtration, commercial climate control ventilation, and scheduled machine deep-wiping throughout every zone.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    'Hourly Deep Sanitization Cycles by Dedicated Staff',
                    'High-Volume Air Filtration & Circulation System',
                    'Dedicated Climate Control & Odor Management',
                    'Impeccably Sanitized Private Showers & Lockers',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-xs sm:text-sm text-surface-200">
                      <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-right" className="lg:col-start-1">
              <div className="relative aspect-[4/3] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80"
                  alt="Hygienic Clean Training Environment"
                  className="h-full w-full object-cover filter brightness-90 contrast-110"
                />
                <div className="absolute top-4 left-4 rounded-full border border-emerald-500/30 bg-black/80 px-3.5 py-1 text-xs font-mono text-emerald-400 backdrop-blur-md">
                  Pristine Daily Standards
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06 — CERTIFIED TRAINERS
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#08090d] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-500">
                Floor Leadership
              </span>
              <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white break-words">
                CERTIFIED MASTER COACHES.
              </h2>
              <p className="mt-4 text-sm sm:text-base text-surface-300">
                No gimmicks or random shouting. Our coaching team holds accredited certifications in human biomechanics, periodized programming, and injury prevention.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Strength & Biomechanics Specialist',
                role: 'Senior Floor Coach',
                spec: 'Barbell Form, Powerlifting & Progressive Overload',
                img: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=800&q=80',
                alt: 'Certified strength and barbell technique coach',
              },
              {
                title: 'Mobility & Conditioning Specialist',
                role: 'Athletic Movement Coach',
                spec: 'Joint Mobility, Posture & Injury Prevention',
                img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
                alt: 'Certified mobility and functional athletic movement coach',
              },
              {
                title: 'Functional Performance Coach',
                role: 'High-Work Capacity Coach',
                spec: 'Metabolic Conditioning, Turf Drills & Endurance',
                img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
                alt: 'Certified functional fitness and endurance conditioning coach',
              },
            ].map((trainer) => (
              <div key={trainer.title} className="coach-card h-full">
                <Card3D className="h-full">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-white/10 bg-[#0e1017] group shadow-2xl">
                    <img
                      src={trainer.img}
                      alt={trainer.alt}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-85 contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                      <span className="rounded bg-brand-500/20 border border-brand-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-brand-400">
                        {trainer.role}
                      </span>
                      <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold text-white">
                        {trainer.title}
                      </h3>
                      <p className="text-[11px] text-surface-400 mt-2 border-t border-white/10 pt-2 font-mono">
                        Focus: {trainer.spec}
                      </p>
                    </div>
                  </div>
                </Card3D>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-surface-400 font-mono">
            Illustrative coaching specializations. Dedicated personal training consultations and trainer bookings are arranged directly at the Heaven Gym reception desk.
          </p>
        </div>
      </section>

      {/* =========================================================================
          SECTION 07 — DIETICIAN & NUTRITION GUIDANCE
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#06070a] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <ScrollReveal animation="fade-right">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-amber-400">
                  Calculated Fuel
                </span>
                <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight break-words">
                  PERSONALIZED DIET & <br />
                  <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                    NUTRITION GUIDANCE.
                  </span>
                </h2>
                <p className="mt-5 text-sm sm:text-base text-surface-300 leading-relaxed">
                  Training provides the stimulus; nutrition provides the adaptation. Our qualified nutrition specialists calculate your precise basal metabolic expenditure and configure realistic caloric and macronutrient targets designed for sustainable daily adherence.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    'Basal Metabolic Rate Profiling',
                    'Calculated Protein & Macro Splits',
                    'Sustainable Non-Starvation Protocols',
                    'Routine InBody Body-Fat Tracking',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-surface-200"
                    >
                      <Flame size={15} className="text-amber-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left">
              <div className="relative aspect-[4/3] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80"
                  alt="Nutritional Consultation"
                  className="h-full w-full object-cover filter brightness-90 contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-xs font-mono text-amber-300 font-bold uppercase tracking-wider">
                    Evidence-Based Nutrition
                  </p>
                  <p className="text-sm font-semibold text-white mt-1">
                    Integrated directly with your training progression
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 08 — STRENGTH TRAINING AREA
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#08090d] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center lg:grid-flow-dense">
            <ScrollReveal animation="fade-left" className="lg:col-start-2">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-500">
                  The Iron Sanctum
                </span>
                <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight break-words">
                  DEDICATED STRENGTH & <br />
                  <span className="public-text-crimson-gradient">POWERLIFTING ARENA.</span>
                </h2>
                <p className="mt-5 text-sm sm:text-base text-surface-300 leading-relaxed">
                  No lines, no crowding, no lightweight compromises. Built with heavy power racks, knurled Olympic power bars, vibration-dampened deadlift platforms, and steel dumbbell pairs going up to heavy competition loads.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {[
                    'Calibrated Steel Bumper Plates',
                    'Dual Dumbbell Runs to 50+ kg',
                    'Competition Power Racks with Safeties',
                    'Anti-Vibration Deadlift Decks',
                  ].map((feat) => (
                    <div
                      key={feat}
                      className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-surface-200"
                    >
                      <Dumbbell size={15} className="text-brand-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-right" className="lg:col-start-1">
              <div className="relative aspect-[4/3] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80"
                  alt="Free Weight Strength Arena"
                  className="h-full w-full object-cover filter brightness-90 contrast-110"
                />
                <div className="absolute bottom-4 left-4 rounded-full border border-brand-500/30 bg-black/80 px-3.5 py-1 text-xs font-mono text-brand-400 backdrop-blur-md">
                  Competition Power Standards
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 09 — WORLD-CLASS CARDIO SECTION
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#06070a] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <ScrollReveal animation="fade-right">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-400">
                  Aerobic Capacity
                </span>
                <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight break-words">
                  HIGH-OUTPUT CARDIO & <br />
                  <span className="text-cyan-200">METABOLIC ENGINE DECK.</span>
                </h2>
                <p className="mt-5 text-sm sm:text-base text-surface-300 leading-relaxed">
                  Engineered for real cardiovascular conditioning. Features non-motorized curved dynamic slat treadmills that encourage natural running mechanics, commercial air ergometers, Concept2 rowers, and smooth low-impact ellipticals with individual heart-rate telemetry.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    'Self-Powered Curved Treadmills for Natural Running Mechanics',
                    'Concept2 Rowers and Ski-Ergs for Full-Body Output',
                    'Commercial Assault Bikes for High-Intensity Intervals',
                    'Integrated Zone-Based Heart Telemetry Displays',
                  ].map((c) => (
                    <div key={c} className="flex items-center gap-3 text-xs sm:text-sm text-surface-200">
                      <Activity size={17} className="text-cyan-400 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left">
              <div className="relative aspect-[4/3] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=80"
                  alt="Cardio Deck"
                  className="h-full w-full object-cover filter brightness-90 contrast-110"
                />
                <div className="absolute bottom-4 left-4 rounded-full border border-cyan-500/30 bg-black/80 px-3.5 py-1 text-xs font-mono text-cyan-300 backdrop-blur-md">
                  Metabolic Conditioning Deck
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10 — STEAM FACILITY
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#090a0f] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center lg:grid-flow-dense">
            <ScrollReveal animation="fade-left" className="lg:col-start-2">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-amber-400">
                  Thermal Recovery
                </span>
                <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight break-words">
                  RESTORATIVE THERMAL <br />
                  <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                    STEAM FACILITY.
                  </span>
                </h2>
                <p className="mt-5 text-sm sm:text-base text-surface-300 leading-relaxed">
                  Post-training recovery helps you recharge. Warm steam therapy relieves muscular tension, relaxes connective tissues, and provides a calming retreat after intense lifting sessions.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    'Controlled Warm Steam for Post-Workout Muscle Relaxation',
                    'Hygienically Sanitized Granite Chamber Architecture',
                    'Direct Access to Refreshing Private Showers',
                    'Included in Active Premium Heaven Gym Memberships',
                  ].map((s) => (
                    <div key={s} className="flex items-center gap-3 text-xs sm:text-sm text-surface-200">
                      <Waves size={17} className="text-amber-400 shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-right" className="lg:col-start-1">
              <div className="relative aspect-[4/3] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80"
                  alt="Steam Facility"
                  className="h-full w-full object-cover filter brightness-85 contrast-110"
                />
                <div className="absolute bottom-4 left-4 rounded-full border border-amber-500/30 bg-black/80 px-3.5 py-1 text-xs font-mono text-amber-300 backdrop-blur-md">
                  Thermal Wellness Suite
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11 — ZUMBA AREA
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#06070a] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <ScrollReveal animation="fade-right">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-pink-400">
                  Rhythm & Caloric Burn
                </span>
                <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight break-words">
                  HIGH-ENERGY ZUMBA & <br />
                  <span className="text-pink-300">GROUP MOVEMENT STUDIO.</span>
                </h2>
                <p className="mt-5 text-sm sm:text-base text-surface-300 leading-relaxed">
                  Experience exhilarating group fitness choreographed by certified energetic instructors. Featuring sprung hardwood flooring that absorbs 60% of joint impact, full-length acoustic mirrors, and immersive sound.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    'Shock-Absorbing Sprung Hardwood Timber Flooring',
                    'Concert-Grade Acoustic Sound Distribution',
                    'Energetic Choreographed Cardio Dance Sessions',
                    'Supportive Community Environment for All Experience Levels',
                  ].map((z) => (
                    <div key={z} className="flex items-center gap-3 text-xs sm:text-sm text-surface-200">
                      <Music size={17} className="text-pink-400 shrink-0" />
                      <span>{z}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left">
              <div className="relative aspect-[4/3] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80"
                  alt="Zumba Group Fitness Studio"
                  className="h-full w-full object-cover filter brightness-90 contrast-110"
                />
                <div className="absolute bottom-4 left-4 rounded-full border border-pink-500/30 bg-black/80 px-3.5 py-1 text-xs font-mono text-pink-300 backdrop-blur-md">
                  Group Movement Studio
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 12 — CAFE AREA
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#0a0807] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center lg:grid-flow-dense">
            <ScrollReveal animation="fade-left" className="lg:col-start-2">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-amber-500">
                  Nutritional Recovery
                </span>
                <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight break-words">
                  NUTRITIONAL RECOVERY & <br />
                  <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                    FUEL BAR.
                  </span>
                </h2>
                <p className="mt-5 text-sm sm:text-base text-surface-300 leading-relaxed">
                  Support your workouts with convenient on-demand fitness nutrition. The fuel bar offers protein shakes, pre-workout beverages, electrolyte drinks, and healthy recovery snacks to keep your training on track.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    'Freshly Prepared Protein & Recovery Shakes',
                    'Pre-Workout & Energy Hydration Options',
                    'Zero-Sugar Electrolyte & Mineral Refreshments',
                    'Comfortable Member Seating & Lounge Area',
                  ].map((c) => (
                    <div key={c} className="flex items-center gap-3 text-xs sm:text-sm text-surface-200">
                      <Coffee size={17} className="text-amber-400 shrink-0" />
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-right" className="lg:col-start-1">
              <div className="relative aspect-[4/3] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"
                  alt="Heaven Gym Cafe & Fuel Bar"
                  className="h-full w-full object-cover filter brightness-90 contrast-110"
                />
                <div className="absolute bottom-4 left-4 rounded-full border border-amber-500/30 bg-black/80 px-3.5 py-1 text-xs font-mono text-amber-300 backdrop-blur-md">
                  In-House Fuel Bar
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 13 — HYROX / CROSSFIT AREA
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#06070a] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <ScrollReveal animation="fade-right">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-500">
                  Functional Power
                </span>
                <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight break-words">
                  FUNCTIONAL CONDITIONING & <br />
                  <span className="text-brand-400">ATHLETIC TURF ZONE.</span>
                </h2>
                <p className="mt-5 text-sm sm:text-base text-surface-300 leading-relaxed">
                  A dedicated high-density turf zone built for sled pushes, farmer carries, battle ropes, slam balls, and dynamic athletic conditioning circuits.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    'Indoor Turf Track for Sled Work & Movement Drills',
                    'Push-Pull Prowler Sleds & Battle Ropes',
                    'Comprehensive Kettlebell and Slam Ball Stations',
                    'Plyometric Boxes & Functional Conditioning Gear',
                  ].map((h) => (
                    <div key={h} className="flex items-center gap-3 text-xs sm:text-sm text-surface-200">
                      <Crosshair size={17} className="text-brand-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-left">
              <div className="relative aspect-[4/3] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80"
                  alt="Functional Turf Zone"
                  className="h-full w-full object-cover filter brightness-90 contrast-110"
                />
                <div className="absolute bottom-4 left-4 rounded-full border border-brand-500/30 bg-black/80 px-3.5 py-1 text-xs font-mono text-brand-400 backdrop-blur-md">
                  Functional Conditioning Zone
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 14 — YOGA AREA
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#080a0a] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-center lg:grid-flow-dense">
            <ScrollReveal animation="fade-left" className="lg:col-start-2">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-400">
                  Mind-Body Alignment
                </span>
                <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight break-words">
                  MOBILITY, BREATH & <br />
                  <span className="text-emerald-300">YOGA SANCTUARY.</span>
                </h2>
                <p className="mt-5 text-sm sm:text-base text-surface-300 leading-relaxed">
                  A tranquil, acoustically dampened studio with natural bamboo flooring and soft ambient lighting. Dedicated to Vinyasa flow, deep spinal decompression, joint mobility, and mindful recovery.
                </p>

                <div className="mt-8 space-y-3">
                  {[
                    'Sound-Insulated Studio Away from Heavy Weight Floor',
                    'Natural Timber Flooring with Soft Non-Slip Cork Mats',
                    'Mobility Foam Rollers, Resistance Bands & Cork Blocks',
                    'Guided Breathwork & Joint Decompression Classes',
                  ].map((y) => (
                    <div key={y} className="flex items-center gap-3 text-xs sm:text-sm text-surface-200">
                      <Leaf size={17} className="text-emerald-400 shrink-0" />
                      <span>{y}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-right" className="lg:col-start-1">
              <div className="relative aspect-[4/3] rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80"
                  alt="Yoga Studio"
                  className="h-full w-full object-cover filter brightness-90 contrast-110"
                />
                <div className="absolute bottom-4 left-4 rounded-full border border-emerald-500/30 bg-black/80 px-3.5 py-1 text-xs font-mono text-emerald-300 backdrop-blur-md">
                  Mind-Body Studio
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 15 — MEDICAL / FIRST-AID FACILITIES
          ========================================================================= */}
      <section className="relative py-20 sm:py-28 bg-[#06070a] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-8 sm:p-14">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-red-400">
                  Member Safety Protocols
                </span>
                <h2 className="mt-2 font-display text-2xl sm:text-4xl font-black text-white">
                  FIRST-AID & SAFETY READINESS.
                </h2>
                <p className="mt-4 text-xs sm:text-sm text-surface-300 leading-relaxed">
                  Member safety is a core priority. Floor staff and trainers are trained in first-aid protocols, standard safety procedures, and rapid assistance for training discomfort or minor injuries.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  'First-Aid Safety Station on Training Floor',
                  'Staff Trained in Safety & Injury Guidance',
                  'Cold Pack & Sprain Management Supplies',
                  'Established Emergency Protocols & Quick Access',
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-black/40 p-3.5 text-xs text-surface-200"
                  >
                    <HeartPulse size={16} className="text-red-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 16 — SUPPLEMENT STORE
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#08090d] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-500">
                  Nutritional Store
                </span>
                <h2 className="mt-2 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white break-words">
                  AUTHENTIC SUPPLEMENTS.
                </h2>
                <p className="mt-3 text-sm text-surface-300 max-w-xl">
                  100% verified, genuine nutritional supplements. Lab-tested whey isolate, micronized creatine, essential amino acids, and multivitamins.
                </p>
              </div>

              <Link
                to="/store"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white hover:border-brand-500 hover:bg-brand-500/10 transition"
              >
                <span>Explore Full Store</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>

          {products && products.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((p) => {
                const img = p.image_url || p.images?.[0]?.url;
                const price = p.sale_price || p.price;
                const waUrl = getWhatsAppLink(
                  `Hello Heaven Gym, I would like to enquire about purchasing "${p.name}".`
                );

                return (
                  <Card3D key={p.id} className="h-full">
                    <div className="flex flex-col justify-between h-full rounded-2xl border border-white/10 bg-[#0e1017] p-5 shadow-xl transition-all hover:border-brand-500/40">
                      <div>
                        <div className="relative aspect-square rounded-xl bg-black/50 p-4 flex items-center justify-center overflow-hidden border border-white/5">
                          {img ? (
                            <img
                              src={img}
                              alt={p.name}
                              loading="lazy"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Package size={42} className="text-surface-500" />
                          )}
                          {p.sale_price && (
                            <span className="absolute top-2 right-2 rounded bg-brand-600 px-2 py-0.5 text-[9px] font-mono font-bold uppercase text-white">
                              Offer
                            </span>
                          )}
                        </div>

                        <p className="mt-4 text-[10px] font-mono uppercase tracking-wider text-brand-400">
                          {p.brand || 'Nutrition'}
                        </p>
                        <h3 className="mt-1 font-display text-base font-bold text-white line-clamp-1">
                          {p.name}
                        </h3>
                        <p className="mt-1 text-xs text-surface-400 line-clamp-2">
                          {p.description}
                        </p>

                        <p className="mt-3 font-display text-lg font-black text-white">
                          {formatCurrency(price)}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2">
                        {waUrl ? (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-white hover:bg-[#1ebc59] transition"
                          >
                            <MessageCircle size={14} /> WhatsApp
                          </a>
                        ) : null}
                        <Link
                          to="/store"
                          className="inline-flex items-center justify-center rounded-xl border border-white/15 px-3 py-2 text-[11px] font-mono font-bold uppercase text-white hover:bg-white/10 transition"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  </Card3D>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-surface-400 text-sm">
              Authentic supplements inventory loading...
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 17 — MEMBERSHIP PLANS & SPECIAL OFFERS
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#06070a] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-500">
                Transparent Pricing
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white break-words">
                MEMBERSHIP PLANS & OFFERS.
              </h2>
              <p className="mt-3 text-sm text-surface-400">
                Clear distinction between our standard membership tiers and active limited promotions.
              </p>
            </div>
          </ScrollReveal>

          {membershipPlans && membershipPlans.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {membershipPlans.map((plan) => {
                const isOffer = Boolean(plan.is_offer);
                const price = Number(plan.price || 0);
                const originalPrice = Number(plan.original_price || 0);
                const discount =
                  isOffer && originalPrice > price
                    ? Math.round((1 - price / originalPrice) * 100)
                    : 0;

                return (
                  <article
                    key={plan.id}
                    className={`relative flex flex-col justify-between rounded-3xl border p-8 shadow-2xl transition hover:-translate-y-1 ${
                      isOffer
                        ? 'border-amber-500/40 bg-gradient-to-b from-amber-500/10 via-[#0e1017] to-black'
                        : 'border-white/10 bg-[#0e1017]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
                            isOffer
                              ? 'bg-amber-400 text-black font-extrabold'
                              : 'bg-white/10 text-surface-300'
                          }`}
                        >
                          {isOffer ? 'Special Offer' : 'Standard Tier'}
                        </span>
                        <span className="text-xs font-mono text-surface-400">
                          {plan.duration_days} Days
                        </span>
                      </div>

                      <h3 className="mt-5 font-display text-2xl font-bold text-white">
                        {plan.name}
                      </h3>

                      <div className="mt-4 flex items-baseline gap-2">
                        {discount > 0 && (
                          <span className="text-sm text-surface-400 line-through">
                            {formatCurrency(originalPrice)}
                          </span>
                        )}
                        <span className="font-display text-3xl font-black text-white">
                          {formatCurrency(price)}
                        </span>
                        {discount > 0 && (
                          <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                            {discount}% OFF
                          </span>
                        )}
                      </div>

                      {plan.description && (
                        <p className="mt-3 text-xs text-surface-300 leading-relaxed">
                          {plan.description}
                        </p>
                      )}

                      <div className="mt-6 space-y-2.5 pt-4 border-t border-white/10">
                        {[
                          'Full Access to Free Weights & Cardio Decks',
                          'Access to Club Amenities & Restorative Recovery',
                          'Complimentary Coach Machine Orientation',
                          'Access to Locker & Shower Suites',
                        ].map((perk) => (
                          <div key={perk} className="flex items-center gap-2 text-xs text-surface-200">
                            <Check size={14} className="text-emerald-400 shrink-0" />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-4 border-t border-white/10">
                      <Link
                        to="/membership"
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-lg hover:bg-brand-500 transition"
                      >
                        <span>Select Plan</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-surface-400 text-sm">
              Membership plans loading...
            </div>
          )}

          <div className="mt-12 text-center">
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition"
            >
              <span>Compare All Standard Plans & Benefits</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 18 — START YOUR FITNESS JOURNEY HERE
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-[#06070a] via-brand-950/20 to-[#06070a] border-t border-white/10">
        <div className="mx-auto max-w-5xl px-5 lg:px-8 text-center">
          <ScrollReveal animation="fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.25em] text-brand-400 backdrop-blur-md">
              <Sparkles size={14} />
              Take The Step
            </span>

            <h2 className="mt-5 font-display text-2xl sm:text-4xl lg:text-6xl font-black text-white leading-tight break-words">
              YOUR FITNESS JOURNEY <br />
              <span className="public-text-crimson-gradient">STARTS HERE.</span>
            </h2>

            <p className="mt-5 max-w-xl mx-auto text-base text-surface-300 leading-relaxed">
              Every strong habit begins with a single decision. Join a club where progress is taken seriously, standards are kept high, and everyone works toward their personal best.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-brand-600 hover:bg-brand-500 text-white text-xs sm:text-sm font-mono font-bold uppercase tracking-wider px-8 py-4 rounded-full shadow-2xl shadow-brand-600/40"
                >
                  Join Heaven Gym Now
                </Button>
              </Link>

              <Link to="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10 text-xs sm:text-sm font-mono font-bold uppercase tracking-wider px-8 py-4 rounded-full"
                >
                  Contact Reception
                </Button>
              </Link>

              {getWhatsAppLink('Hello Heaven Gym, I want to start my fitness journey!') && (
                <a
                  href={getWhatsAppLink('Hello Heaven Gym, I want to start my fitness journey!')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-xl hover:bg-[#1ebc59] transition"
                >
                  <MessageCircle size={16} /> WhatsApp Enquiry
                </a>
              )}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* =========================================================================
          SECTION 19 — GYM EQUIPMENT STORE
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#08090d] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-500">
                  Commercial & Home Fitness Gear
                </span>
                <h2 className="mt-2 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white break-words">
                  GYM EQUIPMENT STORE.
                </h2>
                <p className="mt-3 text-sm text-surface-300 max-w-xl">
                  Enquire about premium workout equipment for home gyms and commercial fitness facilities. Dumbbells, barbells, weight plates, and adjustable workout benches.
                </p>
              </div>

              <Link
                to="/gym-equipment"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white hover:border-brand-500 hover:bg-brand-500/10 transition"
              >
                <span>Explore Gym Equipment</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>

          {equipmentList.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {equipmentList.map((item) => {
                const img = item.images?.[0]?.url;
                const waUrl = getWhatsAppLink(
                  `Hello Heaven Gym, I would like to enquire about purchasing "${item.name}".`
                );

                return (
                  <Card3D key={item._id} className="h-full">
                    <div className="flex flex-col justify-between h-full rounded-2xl border border-white/10 bg-[#0e1017] p-5 shadow-xl transition-all hover:border-brand-500/40">
                      <div>
                        <div className="relative aspect-square rounded-xl bg-black/50 p-4 flex items-center justify-center overflow-hidden border border-white/5">
                          {img ? (
                            <img
                              src={img}
                              alt={item.name}
                              loading="lazy"
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <Dumbbell size={42} className="text-surface-500" />
                          )}
                        </div>

                        <p className="mt-4 text-[10px] font-mono uppercase tracking-wider text-brand-400">
                          {item.category}
                        </p>
                        <h3 className="mt-1 font-display text-base font-bold text-white line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-xs text-surface-400 line-clamp-2">
                          {item.description}
                        </p>

                        <p className="mt-3 font-display text-base font-black text-white">
                          {item.price_label || (item.price ? formatCurrency(item.price) : 'Enquire for Price')}
                        </p>
                      </div>

                      <div className="mt-5 pt-3 border-t border-white/10 flex items-center gap-2">
                        {waUrl ? (
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#25D366] px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-white hover:bg-[#1ebc59] transition"
                          >
                            <MessageCircle size={14} /> Enquire
                          </a>
                        ) : null}
                        <Link
                          to={`/gym-equipment/${item.slug}`}
                          className="inline-flex items-center justify-center rounded-xl border border-white/15 px-3 py-2 text-[11px] font-mono font-bold uppercase text-white hover:bg-white/10 transition"
                        >
                          Specs
                        </Link>
                      </div>
                    </div>
                  </Card3D>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 p-12 text-center text-surface-400 text-sm">
              Commercial equipment catalogue loading...
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          SECTION 20 — START YOUR OWN GYM
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#06070a] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-brand-950/40 via-[#0e1017] to-black p-8 sm:p-14">
            <div className="max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-400">
                Business Opportunity
              </span>
              <h2 className="mt-3 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight break-words">
                BUILD YOUR FITNESS BUSINESS <br />
                <span className="bg-gradient-to-r from-brand-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  WITH HEAVEN GYM.
                </span>
              </h2>
              <p className="mt-4 text-sm sm:text-base text-surface-300 leading-relaxed">
                Looking to start or develop a gym facility? We provide practical turnkey guidance — from commercial equipment procurement and floor layouts to coach training frameworks and operational software.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/franchise"
                  className="rounded-full bg-brand-600 px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-xl shadow-brand-600/30 hover:bg-brand-500 transition"
                >
                  Franchise & Setup Enquiry
                </Link>
                <Link
                  to="/contact"
                  className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-white/10 transition"
                >
                  Contact Business Team
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 21 — GYM EQUIPMENT & DETAILS (IN-DEPTH FACILITY INFRASTRUCTURE)
          ========================================================================= */}
      <section className="relative py-24 sm:py-32 bg-[#08090d] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-amber-400">
                Club Infrastructure
              </span>
              <h2 className="mt-2 font-display text-2xl sm:text-4xl lg:text-5xl font-black text-white break-words">
                PRECISION TRAINING GEAR.
              </h2>
              <p className="mt-3 text-sm text-surface-300">
                A closer look at the equipment that sets Heaven Gym apart.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Knurled Olympic Power Bars',
                desc: '20kg competition bars with precise center knurling and dual knurl marks for powerlifting and Olympic lifts.',
                icon: Dumbbell,
              },
              {
                title: 'High-Tensile Cable Systems',
                desc: 'Multi-plane dual adjustable pulleys with 1:1 and 2:1 ratio options for smooth rotational muscle activation.',
                icon: Zap,
              },
              {
                title: 'Calibrated Heavy Dumbbells',
                desc: 'Solid urethane dumbbells with welded steel cores and knurled ergonomic handles that will never loosen.',
                icon: Shield,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-[#0e1017] p-6 shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-4">
                  <item.icon size={22} />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-surface-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 22 — FRANCHISE PROMOTION BANNER
          ========================================================================= */}
      <section className="relative py-16 sm:py-24 bg-[#050608] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.04] to-transparent p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-500">
                Expansion Roadmap
              </span>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl font-black text-white">
                BECOME A HEAVEN GYM FRANCHISE PARTNER.
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-surface-300">
                Explore franchise territory availability in major metro and tier-1 hubs across India. Complete turnkey support provided.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to="/franchise"
                className="rounded-full bg-brand-600 px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-lg shadow-brand-600/30 hover:bg-brand-500 transition"
              >
                Franchise Information &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 23 is the Final Footer, rendered in PublicLayout */}
    </div>
  );
}
