import { useState } from 'react';
import {
  Activity,
  ArrowRight,
  Dumbbell,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '@/components/public/ScrollReveal';

const TRAINING_AREAS = [
  {
    id: 'strength',
    title: 'Strength Training',
    tag: 'Resistance Training',
    icon: Dumbbell,
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1600&q=80',
    description:
      'Ask the Heaven Gym team about the strength-training equipment, available weight ranges and workout areas currently offered at this location.',
    highlights: [
      'Ask which free-weight options are available',
      'Confirm the current strength-machine selection',
      'Check equipment availability before your visit',
      'Ask about beginner-friendly equipment guidance',
    ],
  },
  {
    id: 'cardio',
    title: 'Cardio & Conditioning',
    tag: 'Endurance Training',
    icon: Activity,
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1600&q=80',
    description:
      'If cardio is part of your routine, contact reception to confirm which machines and conditioning options are currently available.',
    highlights: [
      'Ask about available cardio machines',
      'Confirm machine features and availability',
      'Discuss options that suit your training needs',
      'Check current access and usage arrangements',
    ],
  },
  {
    id: 'functional',
    title: 'Functional Movement',
    tag: 'Movement & Mobility',
    icon: Target,
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1600&q=80',
    description:
      'Ask the team whether a dedicated functional-training area, accessories or guided movement sessions are available at the gym.',
    highlights: [
      'Confirm which functional-training tools are available',
      'Ask about movement and mobility options',
      'Check whether group sessions are scheduled',
      'Discuss suitable options with the gym team',
    ],
  },
  {
    id: 'coaching',
    title: 'Coaching & Member Support',
    tag: 'Training Guidance',
    icon: HeartPulse,
    image: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=1600&q=80',
    description:
      'Coaching services, trainer availability and individual guidance can vary. Contact Heaven Gym to confirm the current options and any additional charges.',
    highlights: [
      'Ask about trainer availability and experience',
      'Confirm whether personal training is offered',
      'Check what guidance is included in each plan',
      'Discuss membership and support options',
    ],
  },
  {
    id: 'safety',
    title: 'Gym Information & Safety',
    tag: 'Before Your Visit',
    icon: ShieldCheck,
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80',
    description:
      'Every location has its own facilities and operating arrangements. Please contact reception to confirm opening hours, hygiene arrangements and available safety support before visiting.',
    highlights: [
      'Confirm current opening hours',
      'Ask about changing and washroom facilities',
      'Check the gym\'s current cleaning arrangements',
      'Ask how to get assistance during your visit',
    ],
  },
];

export default function Facilities() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredAreas =
    activeTab === 'all'
      ? TRAINING_AREAS
      : TRAINING_AREAS.filter((area) => area.id === activeTab);

  return (
    <div className="min-h-screen bg-[#06070a] pb-24 pt-32 text-white">
      <section className="relative overflow-hidden border-b border-white/10 py-16 sm:py-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-[180px]" />
        </div>

        <div className="mx-auto max-w-7xl px-5 text-center lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-400">
              <Sparkles size={14} />
              Training Areas & Gym Information
            </div>

            <h1 className="mt-5 break-words font-display text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-5xl lg:text-7xl">
              FIND THE RIGHT WAY
              <br />
              <span className="bg-gradient-to-r from-brand-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                TO TRAIN.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-surface-300 sm:text-base">
              Explore the training areas and support options you can ask us about. Equipment, facilities, classes and services vary by location and availability, so please confirm the current details with Heaven Gym before visiting.
            </p>
          </ScrollReveal>

          <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              aria-pressed={activeTab === 'all'}
              onClick={() => setActiveTab('all')}
              className={`rounded-full px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition ${
                activeTab === 'all'
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                  : 'border border-white/10 bg-white/5 text-surface-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              All Areas ({TRAINING_AREAS.length})
            </button>
            {TRAINING_AREAS.map((area) => (
              <button
                type="button"
                key={area.id}
                aria-pressed={activeTab === area.id}
                onClick={() => setActiveTab(area.id)}
                className={`rounded-full border px-3.5 py-2 text-[11px] font-mono font-semibold uppercase tracking-wider transition ${
                  activeTab === area.id
                    ? 'border-brand-600 bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'border-white/10 bg-white/5 text-surface-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {area.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <div className="space-y-12 lg:space-y-16">
          {filteredAreas.map((area, index) => {
            const Icon = area.icon;
            const isReversed = index % 2 === 1;

            return (
              <ScrollReveal key={area.id} animation="fade-up">
                <article
                  id={area.id}
                  className={`grid items-center gap-8 rounded-3xl border border-white/10 bg-[#0e1017]/80 p-5 shadow-2xl backdrop-blur-md sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10 ${
                    isReversed ? 'lg:grid-flow-dense' : ''
                  }`}
                >
                  <div className={`relative overflow-hidden rounded-2xl ${isReversed ? 'lg:col-start-2' : ''}`}>
                    <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-white/10">
                      <img
                        src={area.image}
                        alt={`Illustrative image for ${area.title}`}
                        loading="lazy"
                        className="h-full w-full object-cover brightness-90 contrast-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0e1017]/70 via-transparent to-transparent" />
                      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/15 bg-black/75 px-3 py-1.5 text-xs font-mono font-bold text-amber-400 backdrop-blur-md">
                        <Icon size={15} />
                        <span>{area.tag}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-[10px] text-surface-500">
                      Illustrative image — contact the gym to confirm on-site facilities.
                    </p>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-500">
                        Training Information · {String(index + 1).padStart(2, '0')}
                      </span>
                      <h2 className="mt-2 font-display text-2xl font-black text-white sm:text-3xl lg:text-4xl">
                        {area.title}
                      </h2>
                    </div>

                    <p className="text-sm leading-relaxed text-surface-300 sm:text-base">
                      {area.description}
                    </p>

                    <div className="grid gap-3 pt-1 sm:grid-cols-2">
                      {area.highlights.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs text-surface-200"
                        >
                          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-brand-400" />
                          <span className="font-medium">{item}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
                      <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-lg shadow-brand-600/30 transition hover:bg-brand-500"
                      >
                        Ask the Gym <ArrowRight size={14} />
                      </Link>
                      <Link
                        to="/membership"
                        className="inline-flex items-center rounded-full border border-white/15 px-5 py-3 text-xs font-mono font-bold uppercase tracking-wider text-surface-300 transition hover:border-white/30 hover:text-white"
                      >
                        View Membership
                      </Link>
                    </div>
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-7xl px-5 lg:px-8">
        <div className="rounded-3xl border border-white/15 bg-gradient-to-r from-brand-950/40 via-[#0e1017] to-black p-8 text-center sm:p-14">
          <h2 className="font-display text-2xl font-black text-white sm:text-4xl">
            WANT TO KNOW WHAT IS AVAILABLE?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-surface-300 sm:text-base">
            Contact Heaven Gym to confirm the current equipment, facilities, opening hours and membership details before planning your visit.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="rounded-full bg-brand-600 px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-xl shadow-brand-600/30 transition hover:bg-brand-500"
            >
              Contact Heaven Gym
            </Link>
            <Link
              to="/membership"
              className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
            >
              View Membership Plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
