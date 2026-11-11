import React from 'react';
import { Award, Clock, Dumbbell, Shield, Trophy, Users } from 'lucide-react';

const DEFAULT_STATS = [
  {
    id: 'hours',
    icon: Clock,
    value: '5:00 AM',
    label: 'Daily Opening',
    subtext: '365 days a year dedication',
  },
  {
    id: 'zones',
    icon: Dumbbell,
    value: '6+',
    label: 'Dedicated Zones',
    subtext: 'Free weights, cardio, functional & recovery',
  },
  {
    id: 'programs',
    icon: Trophy,
    value: '100%',
    label: 'Guided Discipline',
    subtext: 'Structured progressive overload systems',
  },
  {
    id: 'standards',
    icon: Shield,
    value: '1 : 1',
    label: 'Coaching Standard',
    subtext: 'Certified attention to movement execution',
  },
];

export default function StatsCounter({ stats = DEFAULT_STATS, className = '' }) {
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ${className}`}>
      {stats.map((stat) => {
        const Icon = stat.icon || Award;
        return (
          <div
            key={stat.id}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-6 transition-all duration-300 hover:border-brand-500/40 hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                <Icon size={20} />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-surface-400">
                HEAVEN GYM
              </span>
            </div>

            <p className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white group-hover:text-brand-400 transition-colors">
              {stat.value}
            </p>

            <h3 className="mt-2 text-sm font-semibold text-surface-200">
              {stat.label}
            </h3>

            <p className="mt-1 text-xs text-surface-400 leading-relaxed">
              {stat.subtext}
            </p>

            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-brand-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        );
      })}
    </div>
  );
}
