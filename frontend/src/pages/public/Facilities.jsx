import { useState } from 'react';
import {
  Activity,
  Award,
  CheckCircle2,
  Clock,
  Coffee,
  Crosshair,
  Dumbbell,
  Flame,
  HeartPulse,
  Leaf,
  Medal,
  Music,
  PlusCircle,
  ShieldCheck,
  Sparkles,
  Waves,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/public/ScrollReveal';
import Card3D from '@/components/public/Card3D';

const FACILITIES = [
  {
    id: 'strength',
    title: 'Strength Training Arena',
    tag: 'Iron & Biomechanics',
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1600&q=80',
    description:
      'Engineered for serious progressive overload. Equipped with competition power cages, Olympic calibrated weight plates, knurled Texas power bars, dumbbell racks extending to heavy pairs, and heavy-duty adjustable incline benches.',
    highlights: [
      'Calibrated Olympic Barbells & Bumper Plates',
      'Solid Steel Dumbbells to 50+ kg',
      'Heavy-duty Power Cages with Safety Straps',
      'Deadlift Platforms with Vibration Dampening',
    ],
  },
  {
    id: 'machines',
    title: 'Luxury Pin-Select & Plate-Loaded Machines',
    tag: 'Precision Biomechanics',
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1600&q=80',
    description:
      'Engineered to match natural human muscle resistance curves. Features converging chest presses, dual cable crossovers with micro-adjustments, plate-loaded hack squats, and targeted isolateral leg machines.',
    highlights: [
      'Isolateral Diverging & Converging Movements',
      'Zero-Slack Kevlar Belt Drive Cables',
      'Adjustable Pivot Ergonomic Seating',
      'Precision Plate-Loaded Squat & Press Systems',
    ],
  },
  {
    id: 'cardio',
    title: 'High-Performance Cardio Deck',
    tag: 'Aerobic & Metabolic Conditioning',
    icon: Activity,
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1600&q=80',
    description:
      'A dedicated endurance zone configured with curved self-powered treadmills, high-incline motorized decks, commercial air bikes, Concept2 rowers, and precision elliptical cross-trainers with integrated heart-rate monitoring.',
    highlights: [
      'Non-Motorized Curved Dynamic Slat Treadmills',
      'Concept2 Rowers & Air Ergometers',
      'Low-Impact Commercial Ellipticals',
      'Interactive Zone-Based Heart Tracking',
    ],
  },
  {
    id: 'steam',
    title: 'Thermal Steam Facility',
    tag: 'Restorative Wellness',
    icon: Waves,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    description:
      'Deep post-training recovery. High-temperature botanical steam promotes vasodilation, accelerates muscular blood flow, flushes metabolic waste, and relieves systemic connective tissue tension after high-volume sessions.',
    highlights: [
      'Deep Tissue Heat Recovery at 45°C - 50°C',
      'Aromatherapeutic Botanical Infusions',
      'Impeccably Sanitized Granite Chamber',
      'Private Post-Steam Cold Rinse Showers',
    ],
  },
  {
    id: 'hyrox',
    title: 'Functional Conditioning & HYROX Zone',
    tag: 'Athletic Performance',
    icon: Crosshair,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80',
    description:
      'Dedicated high-density turf strip built for heavy sled pushing, battle ropes, plyometric boxes, farmer carry handles, sandbags, and high-intensity metabolic functional circuits.',
    highlights: [
      '30-Meter High-Density Sled & Sprint Turf',
      'Heavy Dual-Handle Push & Pull Prowler Sleds',
      'Reinforced Wall-Balls, Plyo Cubes & Sandbags',
      'Commercial Battle Ropes & Kettlebell Stacks',
    ],
  },
  {
    id: 'yoga',
    title: 'Mind-Body & Mobility Yoga Studio',
    tag: 'Mobility & Posture',
    icon: Leaf,
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1600&q=80',
    description:
      'A serene, sound-insulated hardwood studio dedicated to mobility restoration, Vinyasa flow, spine decompression, and joint longevity away from the energy of the main training floor.',
    highlights: [
      'Acoustically Dampened Natural Wood Floor',
      'Warm Natural Lighting & Clean Air Circulation',
      'Supportive Cork Blocks, Straps & Bolsters',
      'Led by Certified Mobility Instructors',
    ],
  },
  {
    id: 'zumba',
    title: 'High-Energy Zumba & Group Studio',
    tag: 'Rhythm & Caloric Burn',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80',
    description:
      'A dynamic group movement hall equipped with concert-grade surround sound, shock-absorbent sprung timber flooring, and dynamic lighting for exhilarating cardio-dance workouts.',
    highlights: [
      'Shock-Absorbent Sprung Timber Floor',
      'Concert-Grade Acoustic Sound Distribution',
      'Full-Length Wall Mirrors for Cadence & Form',
      'Certified Enthusiastic Group Choreographers',
    ],
  },
  {
    id: 'cafe',
    title: 'The Heaven Gym Fuel Bar & Cafe',
    tag: 'Nutritional Recovery',
    icon: Coffee,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80',
    description:
      'Refuel immediately after your session. The in-house cafe serves clean cold-pressed whey isolate smoothies, fresh single-origin espresso, BCAAs, electrolyte beverages, and macronutrient-balanced recovery snacks.',
    highlights: [
      'Cold-Pressed Isolate Whey & Casein Smoothies',
      'Single-Origin Espresso & Pre-Workout Brews',
      'Electrolyte & Hydration Beverages',
      'Macronutrient-Calculated Clean Snacks',
    ],
  },
  {
    id: 'hygiene',
    title: 'Clinical-Grade Hygiene & Climate Control',
    tag: 'Pristine Standards',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
    description:
      'Experience a training environment free of bad odors and clutter. Continuous hospital-grade HEPA filtration, dedicated sanitization crews cleaning machines after every shift, and organized weight racks.',
    highlights: [
      'Continuous Medical HEPA Air Filtration',
      'Touchless Sanitizer Stations Every 15 Feet',
      'Scheduled Hourly Equipment Deep-Wipes',
      'Rigorous Odor-Free Climate Regulation',
    ],
  },
  {
    id: 'trainers',
    title: 'Certified Master Trainers',
    tag: 'Elite Coaching',
    icon: Medal,
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=1600&q=80',
    description:
      'Every trainer on the floor holds accredited certifications in exercise science, biomechanics, and CPR. We emphasize precise barbell technique, injury prevention, and structured progressive training programs.',
    highlights: [
      'Accredited International Fitness Certifications',
      'Structured 1-on-1 Form & Technique Screenings',
      'Periodized Progressive Overload Planning',
      'Zero Gimmicks — Backed by Biomechanics',
    ],
  },
  {
    id: 'dietician',
    title: 'Personalized Nutrition & Diet Guidance',
    tag: 'Calculated Fuel',
    icon: Flame,
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80',
    description:
      'Training without proper nutrition is half the equation. Our nutrition team formulates realistic dietary protocols with calculated macronutrient splits tailored to your specific metabolic rate and lifestyle.',
    highlights: [
      'Individual Basal Metabolic Rate (BMR) Profiling',
      'Customized Protein & Caloric Target Schedules',
      'Sustainable Nutrition — No Extreme Crash Diets',
      'Regular In-Body Composition Progress Checks',
    ],
  },
  {
    id: 'first-aid',
    title: 'Medical Safety & First-Aid Preparedness',
    tag: 'Member Security',
    icon: HeartPulse,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1600&q=80',
    description:
      'Your physical security is non-negotiable. The gym floor is monitored with certified first-aid responders, trauma kits, ice compression stations, and established emergency response protocols.',
    highlights: [
      'CPR & AED Certified Floor Management',
      'Fully Stocked Emergency Trauma Kits',
      'Instant Ice Compression for Acute Sprains',
      'Direct Ambulance Priority Access Route',
    ],
  },
];

export default function Facilities() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredFacilities =
    activeTab === 'all'
      ? FACILITIES
      : FACILITIES.filter((f) => f.id === activeTab);

  return (
    <div className="bg-[#06070a] text-white min-h-screen pt-32 pb-24">
      {/* Header */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-white/10">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[180px]" />
        </div>

        <div className="mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <ScrollReveal animation="fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.25em] text-brand-400 backdrop-blur-md">
              <Sparkles size={14} className="text-brand-400" />
              World-Class Infrastructure
            </div>

            <h1 className="mt-5 font-display text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-white leading-tight break-words">
              EVERYTHING YOU NEED <br />
              <span className="bg-gradient-to-r from-brand-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                TO GO FURTHER.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-surface-300 leading-relaxed">
              Explore 12 signature zones meticulously engineered for athletic strength, clinical recovery, energetic group conditioning, and daily wellness.
            </p>
          </ScrollReveal>

          {/* Facility Pills */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`rounded-full px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition ${
                activeTab === 'all'
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'bg-white/5 text-surface-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              All Zones ({FACILITIES.length})
            </button>
            {FACILITIES.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveTab(f.id)}
                className={`rounded-full px-3.5 py-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider transition ${
                  activeTab === f.id
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'bg-white/5 text-surface-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                {f.title.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities List / Grid */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
        <div className="space-y-24">
          {filteredFacilities.map((facility, index) => {
            const isReversed = index % 2 === 1;
            return (
              <ScrollReveal key={facility.id} animation="fade-up">
                <article
                  id={facility.id}
                  className={`grid gap-12 lg:grid-cols-2 items-center rounded-3xl border border-white/10 bg-[#0e1017]/80 p-6 sm:p-10 shadow-2xl backdrop-blur-md ${
                    isReversed ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  {/* Photo composition */}
                  <div className={`relative overflow-hidden rounded-2xl group ${isReversed ? 'lg:col-start-2' : ''}`}>
                    <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-white/10">
                      <img
                        src={facility.image}
                        alt={facility.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 contrast-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017] via-transparent to-transparent opacity-60" />
                      
                      <div className="absolute top-4 left-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/75 px-3 py-1.5 text-xs font-mono font-bold text-amber-400 backdrop-blur-md">
                        <facility.icon size={15} />
                        <span>{facility.tag}</span>
                      </div>
                    </div>
                  </div>

                  {/* Text details */}
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-500">
                        Signature Facility &bull; Zone {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2 className="mt-2 font-display text-2xl sm:text-4xl font-black text-white">
                        {facility.title}
                      </h2>
                    </div>

                    <p className="text-sm sm:text-base text-surface-300 leading-relaxed">
                      {facility.description}
                    </p>

                    {/* Highlights bullet list */}
                    <div className="grid gap-3 sm:grid-cols-2 pt-2">
                      {facility.highlights.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-surface-200"
                        >
                          <CheckCircle2 size={15} className="text-brand-400 shrink-0 mt-0.5" />
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 flex flex-wrap items-center gap-4 border-t border-white/10">
                      <Link
                        to="/membership"
                        className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-lg shadow-brand-600/30 hover:bg-brand-500 transition"
                      >
                        <span>Access With Membership</span>
                        <ArrowRight size={14} />
                      </Link>

                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-mono font-bold uppercase tracking-wider text-surface-300 hover:text-white hover:border-white/30 transition"
                      >
                        <span>Schedule a Tour</span>
                      </Link>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* Conversion Banner */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 mt-12">
        <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-brand-950/40 via-[#0e1017] to-black p-8 sm:p-14 text-center">
          <h2 className="font-display text-3xl sm:text-5xl font-black text-white">
            EXPERIENCE THE HEAVEN GYM STANDARD.
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-surface-300">
            Book a complimentary walk-through with a master coach and explore our complete strength, cardio, and recovery floors in person.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/membership"
              className="rounded-full bg-brand-600 px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-xl shadow-brand-600/30 hover:bg-brand-500 transition"
            >
              View Membership Plans
            </Link>
            <Link
              to="/contact"
              className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white hover:bg-white/10 transition"
            >
              Contact Reception
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
