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
      'Explore strength-training stations and resistance equipment for progressive workouts. Contact the team for the current equipment list and available weight ranges.',
    highlights: [
      'Barbells and weight plates, where available',
      'Dumbbells and free-weight options',
      'Power racks and strength stations, where available',
      'Dedicated lifting platforms, where available',
    ],
  },
  {
    id: 'machines',
    title: 'Luxury Pin-Select & Plate-Loaded Machines',
    tag: 'Precision Biomechanics',
    icon: Zap,
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1600&q=80',
    description:
      'Explore strength and resistance-training equipment for a range of movement patterns. Ask the team about the machines and stations currently available.',
    highlights: [
      'Isolateral Diverging & Converging Movements',
      'Adjustable cable stations, where available',
      'Adjustable Pivot Ergonomic Seating',
      'Plate-loaded strength equipment, where available',
    ],
  },
  {
    id: 'cardio',
    title: 'High-Performance Cardio Deck',
    tag: 'Aerobic & Metabolic Conditioning',
    icon: Activity,
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1600&q=80',
    description:
      'A cardio area for endurance and conditioning. Contact the team for the current machine list, brands and available features.',
    highlights: [
      'Treadmills for walking and running workouts',
      'Rowing and air-resistance cardio options, where available',
      'Low-Impact Commercial Ellipticals',
      'Ask about heart-rate and console features on available machines',
    ],
  },
  {
    id: 'steam',
    title: 'Thermal Steam Facility',
    tag: 'Restorative Wellness',
    icon: Waves,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
    description:
      'Post-training recovery helps you recharge. Warm steam therapy relieves muscular tension, relaxes connective tissues, and provides a calming retreat after intense training sessions.',
    highlights: [
      'Warm Steam for Muscle Relaxation & Heat Therapy',
      'Steam-room facilities, subject to current availability',
      'Private Shower & Changing Facilities',
      'Ask the team whether recovery facilities are included in your selected membership',
    ],
  },
  {
    id: 'hyrox',
    title: 'Functional Conditioning & Athletic Turf',
    tag: 'Functional Performance',
    icon: Crosshair,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80',
    description:
      'A functional training area for movement-based conditioning. Ask the team which training tools and equipment are currently available.',
    highlights: [
      'Functional movement and conditioning space, where available',
      'Sled-based training equipment, where available',
      'Functional training accessories, where available',
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
      'A calm space for mobility, stretching and guided movement sessions. Contact the team for current class schedules and studio availability.',
    highlights: [
      'Studio flooring and setup, subject to location',
      'Warm Natural Lighting & Clean Air Circulation',
      'Supportive Cork Blocks, Straps & Bolsters',
      'Guided Mobility & Flow Sessions',
    ],
  },
  {
    id: 'zumba',
    title: 'High-Energy Zumba & Group Studio',
    tag: 'Rhythm & Caloric Burn',
    icon: Music,
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1600&q=80',
    description:
      'A group movement space for guided cardio-dance and fitness sessions. Contact the team for current schedules and studio facilities.',
    highlights: [
      'Group movement studio space',
      'Acoustic Surround Sound System',
      'Full-Length Wall Mirrors for Cadence & Form',
      'Energetic Group Choreography Sessions',
    ],
  },
  {
    id: 'cafe',
    title: 'Nutrition & Fuel Bar',
    tag: 'Nutritional Recovery',
    icon: Coffee,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80',
    description:
      'Convenient post-workout nutrition right at the club. The fuel bar offers protein shakes, pre-workout options, BCAA drinks, and healthy recovery refreshments.',
    highlights: [
      'Fresh Whey Isolate Protein Shakes',
      'Pre-Workout Energy & Hydration Brews',
      'Zero-Sugar Electrolytes & Hydration Beverages',
      'Comfortable Seating & Clean Recovery Snacks',
    ],
  },
  {
    id: 'hygiene',
    title: 'Clean & Comfortable Training Spaces',
    tag: 'Pristine Standards',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
    description:
      'A comfortable training environment depends on clean equipment and organized spaces. Contact the team to learn about current cleaning routines and available facilities.',
    highlights: [
      'Ventilation and airflow across training areas',
      'Cleaning supplies and hygiene facilities, where available',
      'Regular equipment and high-touch surface cleaning',
      'Clean and organized training spaces',
    ],
  },
  {
    id: 'trainers',
    title: 'Coaching & Training Support',
    tag: 'Dedicated Coaching',
    icon: Medal,
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=1600&q=80',
    description:
      'Ask the Heaven Gym team about trainer experience, coaching availability and the support options currently offered to members.',
    highlights: [
      'Trainer experience and qualifications can be discussed with the team',
      'Form and technique guidance, where available',
      'Structured training guidance, where available',
      'Ask about personal training availability and booking options',
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
      'Individual Metabolic Rate & Caloric Profiling',
      'Customized Protein & Caloric Target Schedules',
      'Sustainable Nutrition — No Extreme Crash Diets',
      'Regular In-Body Composition Progress Checks',
    ],
  },
  {
    id: 'first-aid',
    title: 'Floor Safety & First-Aid Preparedness',
    tag: 'Member Security',
    icon: HeartPulse,
    image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1600&q=80',
    description:
      'Your physical security and health are paramount. The gym floor is monitored with trained first-aid staff, emergency supplies, cold packs for sprains, and established safety response protocols.',
    highlights: [
      'Trained First-Aid Floor Management',
      'Fully Stocked First-Aid Emergency Kits',
      'Cold Packs for Joint Sprains & Minor Strains',
      'Established Emergency Assistance Protocols',
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
