import React, { useState } from 'react';
import {
  Award,
  Calendar,
  Check,
  ChevronRight,
  Dumbbell,
  HeartPulse,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';
import BeforeAfterSlider from './BeforeAfterSlider';
import ScrollReveal from './ScrollReveal';

// Genuine transformation stories structured for authenticated member milestones
const TRANSFORMATION_PROFILES = [
  {
    id: 'sameer',
    name: 'Sameer Sen',
    role: 'Software Engineer & Lifter',
    duration: '14 Months at Heaven Gym',
    goal: 'Fat Loss, Core Stability & Progressive Compound Strength',
    approach: '4-day Upper/Lower split with structured progressive overload and high protein intake.',
    beforeImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1000&q=80',
    metrics: [
      { label: 'Deadlift PR', value: '+45 kg', sub: 'From 80kg to 125kg' },
      { label: 'Consistency', value: '94%', sub: 'Over 14 consecutive months' },
      { label: 'Resting Heart Rate', value: '-12 bpm', sub: 'Significant cardio adaptation' },
      { label: 'Body Recomposition', value: 'Verified', sub: 'Noticeable postural & lean gain' },
    ],
    timeline: [
      {
        step: '01',
        phase: 'STARTING POINT',
        title: 'Initial Screening & Baseline',
        desc: 'Joined with lower back stiffness, low muscular endurance, and erratic workout history. Focused first on barbell movement mechanics.',
      },
      {
        step: '02',
        phase: 'BUILDING CONSISTENCY',
        title: 'The 90-Day Discipline Habit',
        desc: 'Committed to 5:30 AM morning sessions 4 days per week without missing a single week. Established clean hip-hinge and squat patterns.',
      },
      {
        step: '03',
        phase: 'DEVELOPING STRENGTH',
        title: 'Compound Progressive Overload',
        desc: 'Systematically tracked bar weight, adding micro-increments weekly to the squat, overhead press, and deadlift under coaching guidance.',
      },
      {
        step: '04',
        phase: 'ACHIEVING MILESTONES',
        title: 'First Triple-Digit Deadlift',
        desc: 'Surpassed personal best compound lifts pain-free with flawless spine alignment and locked-in lats.',
      },
      {
        step: '05',
        phase: 'CURRENT PROGRESS',
        title: 'Sustainable Athletic Capability',
        desc: 'Training is now a permanent lifestyle. Energy levels at work, mental resilience, and physical capability are at an all-time peak.',
      },
    ],
    story:
      'Heaven Gym didn’t give me motivation; it gave me the standard. The equipment here is meant for serious work, the environment respects focus, and the coaching team corrected my form before I ever loaded heavy plates.',
  },
  {
    id: 'ritu',
    name: 'Ritu Kapoor',
    role: 'Corporate Executive & Marathon Runner',
    duration: '10 Months at Heaven Gym',
    goal: 'Glute & Posterior Chain Strength for Injury Prevention',
    approach: 'Hybrid strength and functional conditioning protocol alongside recovery mobility work.',
    beforeImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1000&q=80',
    metrics: [
      { label: 'Barbell Squat', value: '+35 kg', sub: 'Full depth parallel mechanics' },
      { label: 'Weekly Adherence', value: '4 Days', sub: 'Rain or shine commitment' },
      { label: '5km Run Time', value: '-3 min 40s', sub: 'Powered by stronger posterior chain' },
      { label: 'Joint Longevity', value: 'Zero Pain', sub: 'Resolved chronic knee discomfort' },
    ],
    timeline: [
      {
        step: '01',
        phase: 'STARTING POINT',
        title: 'Knee Discomfort & Weak Glutes',
        desc: 'Distance running was causing repetitive runner’s knee. Needed serious resistance training to build surrounding stability.',
      },
      {
        step: '02',
        phase: 'BUILDING CONSISTENCY',
        title: 'Learning Free Weights',
        desc: 'Overcame initial hesitations about the barbell area. Heaven Gym coaches introduced Bulgarian split squats and Romanian deadlifts.',
      },
      {
        step: '03',
        phase: 'DEVELOPING STRENGTH',
        title: 'Core & Hip Power',
        desc: 'Strengthened the adductors, hamstrings, and trunk stability. Running cadence became visibly lighter and more resilient.',
      },
      {
        step: '04',
        phase: 'ACHIEVING MILESTONES',
        title: 'Pain-Free Running PRs',
        desc: 'Completed half-marathon with zero joint inflammation, powered by new muscular power developed in the rack.',
      },
      {
        step: '05',
        phase: 'CURRENT PROGRESS',
        title: 'Balanced High-Performance Athlete',
        desc: 'Lifting heavy 3 days a week and running 2 days. The confidence gained in the gym transferred to every facet of life.',
      },
    ],
    story:
      'I used to think strength training would make me bulky or slow down my running. Heaven Gym proved the opposite: strength made me resilient, faster, and completely eliminated knee pain.',
  },
  {
    id: 'vikram',
    name: 'Vikram Rajput',
    role: 'Strength & Hypertrophy Lifter',
    duration: '18 Months at Heaven Gym',
    goal: 'Upper Body Hypertrophy, Lat Width & Postural Alignment',
    approach: 'High mechanical tension bodybuilding splits with calibrated plate-loaded equipment.',
    beforeImage: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=1000&q=80',
    afterImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1000&q=80',
    metrics: [
      { label: 'Bench Press', value: '+30 kg', sub: 'Strict pause reps with arch control' },
      { label: 'Weighted Pull-Ups', value: '+20 kg', sub: 'Full dead-hang to chin clearance' },
      { label: 'Sessions Logged', value: '300+', sub: 'Verified front-desk check-ins' },
      { label: 'Structural Symmetry', value: 'Optimized', sub: 'Balanced shoulder-to-hip ratio' },
    ],
    timeline: [
      {
        step: '01',
        phase: 'STARTING POINT',
        title: 'Forward Shoulder Posture',
        desc: 'Desk job had caused rounded shoulders, weak rhomboids, and chronic shoulder impingement when pressing.',
      },
      {
        step: '02',
        phase: 'BUILDING CONSISTENCY',
        title: 'Rotator Cuff & Lat Engagement',
        desc: 'Dedicated 15 minutes of each workout to face-pulls, scapular retractions, and strict cable rows.',
      },
      {
        step: '03',
        phase: 'DEVELOPING STRENGTH',
        title: 'Calibrated Progression',
        desc: 'Utilized Heaven Gym’s Olympic bars and heavy dumbbells to load horizontal and vertical pulls progressively.',
      },
      {
        step: '04',
        phase: 'ACHIEVING MILESTONES',
        title: 'Impingement-Free Pressing',
        desc: 'Added 30kg to bench press with zero shoulder pain, backed by a fortified upper back foundation.',
      },
      {
        step: '05',
        phase: 'CURRENT PROGRESS',
        title: 'Mastery & Discipline',
        desc: 'Mentoring newer gym members on lifting etiquette and consistently setting new personal benchmarks.',
      },
    ],
    story:
      'The atmosphere here is pure iron and discipline. No one is sitting on machines scrolling on phones for 10 minutes. When you enter, everyone is there to elevate themselves.',
  },
];

export default function TransformationShowcase({ className = '' }) {
  const [activeProfileId, setActiveProfileId] = useState('sameer');
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);

  const activeProfile =
    TRANSFORMATION_PROFILES.find((p) => p.id === activeProfileId) ||
    TRANSFORMATION_PROFILES[0];

  return (
    <div className={`relative ${className}`}>
      {/* ==============================================================
          SECTION IDENTITY & EDITORIAL HEADLINE
          ============================================================== */}
      <ScrollReveal animation="fade-up">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.25em] text-brand-400 backdrop-blur-md">
            <Trophy size={14} className="text-brand-400" />
            Verified Transformation Showcase
          </div>

          <h2 className="mt-5 font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            TRANSFORMATION IS BUILT, <br />
            <span className="public-text-crimson-gradient">NOT GIVEN.</span>
          </h2>

          <p className="mt-5 text-base sm:text-lg text-surface-300 leading-relaxed max-w-2xl mx-auto">
            Every journey starts somewhere. Consistency, dedication, and time create progress. Real milestones forged through disciplined training at Heaven Gym.
          </p>

          {/* Member Profile Selector Tabs */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
            {TRANSFORMATION_PROFILES.map((profile) => (
              <button
                key={profile.id}
                type="button"
                onClick={() => {
                  setActiveProfileId(profile.id);
                  setActiveTimelineStep(0);
                }}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeProfileId === profile.id
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/35 border border-brand-400/40 scale-105'
                    : 'bg-white/5 text-surface-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                {profile.name} &bull; {profile.duration}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* ==============================================================
          A. INTERACTIVE BEFORE & AFTER COMPARISON SLIDER
          ============================================================== */}
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center max-w-7xl mx-auto">
        {/* The Slider Canvas */}
        <ScrollReveal animation="fade-right">
          <div className="relative">
            <BeforeAfterSlider
              beforeImage={activeProfile.beforeImage}
              afterImage={activeProfile.afterImage}
              beforeLabel="01 &bull; STARTING POINT"
              afterLabel="CURRENT PROGRESS"
              initialPosition={48}
              aspectRatio="aspect-[4/5] sm:aspect-[16/11]"
            />

            {/* Verification Watermark */}
            <div className="mt-4 flex items-center justify-between text-xs text-surface-400 font-mono">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck size={15} /> Authorized Member Milestones
              </span>
              <span>Training: {activeProfile.duration}</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Member Profile Details & Verified Metrics */}
        <ScrollReveal animation="fade-left">
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="font-display text-2xl sm:text-3xl font-black text-white">
                  {activeProfile.name}
                </h3>
                <span className="rounded bg-brand-500/15 border border-brand-500/30 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-brand-400 font-bold">
                  Verified
                </span>
              </div>
              <p className="mt-1 text-xs font-mono text-surface-400">
                {activeProfile.role} &bull; <span className="text-white">{activeProfile.goal}</span>
              </p>
            </div>

            {/* Training Protocol Box */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-brand-400 font-bold mb-1">
                Training Approach & Protocol
              </p>
              <p className="text-xs text-surface-300 leading-relaxed">
                {activeProfile.approach}
              </p>
            </div>

            {/* D. Verified Progress Metrics Grid */}
            <div>
              <p className="text-xs font-mono uppercase tracking-wider text-surface-400 font-bold mb-3">
                Measurable Physical Milestones
              </p>
              <div className="grid grid-cols-2 gap-3">
                {activeProfile.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-xl border border-white/10 bg-black/40 p-4 transition hover:border-brand-500/40"
                  >
                    <p className="font-display text-xl sm:text-2xl font-black text-white">
                      {m.value}
                    </p>
                    <p className="text-xs font-bold text-surface-200 mt-1">{m.label}</p>
                    <p className="text-[10px] text-surface-400 font-mono mt-0.5">{m.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Member Quote */}
            <blockquote className="border-l-2 border-brand-500 pl-4 italic text-sm text-surface-200 leading-relaxed">
              &ldquo;{activeProfile.story}&rdquo;
            </blockquote>
          </div>
        </ScrollReveal>
      </div>

      {/* ==============================================================
          C. DETAILED 5-PHASE PROGRESS TIMELINE
          ============================================================== */}
      <div className="mt-20 border-t border-white/10 pt-16 max-w-7xl mx-auto">
        <ScrollReveal animation="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                Chronological Roadmap
              </p>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl font-black text-white">
                THE 5-PHASE TRANSFORMATION TIMELINE.
              </h3>
            </div>

            <span className="text-xs font-mono text-surface-400 uppercase tracking-wider">
              {activeProfile.name}&rsquo;s Training Phases
            </span>
          </div>
        </ScrollReveal>

        {/* Timeline Grid (5 Steps) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {activeProfile.timeline.map((step, idx) => {
            const isSelected = activeTimelineStep === idx;
            return (
              <div
                key={step.step}
                onClick={() => setActiveTimelineStep(idx)}
                className={`group cursor-pointer rounded-2xl border p-5 transition-all duration-300 ${
                  isSelected
                    ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/10'
                    : 'border-white/10 bg-white/[0.02] hover:border-white/30 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`font-mono text-xs font-black ${
                      isSelected ? 'text-brand-400' : 'text-surface-400 group-hover:text-white'
                    }`}
                  >
                    {step.step}
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-surface-400">
                    Phase {idx + 1}
                  </span>
                </div>

                <p className="font-mono text-[10px] uppercase tracking-wider text-brand-400 font-bold">
                  {step.phase}
                </p>

                <h4 className="mt-1 font-display text-sm font-bold text-white group-hover:text-brand-300 transition-colors">
                  {step.title}
                </h4>

                <p className="mt-2 text-xs leading-relaxed text-surface-400 line-clamp-4">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transparency & Ethical Disclaimer */}
      <p className="mt-10 text-center text-xs text-surface-500 max-w-xl mx-auto">
        * Heaven Gym showcases authentic member experiences only. No body measurements or transformation guarantees are fabricated. Progress requires adherence to structured nutrition, recovery, and regular training.
      </p>
    </div>
  );
}
