import { useState, useEffect } from 'react';
import {
  Check,
  HelpCircle,
  Crown,
  Dumbbell,
  Sparkles,
  Tag,
  Zap,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Clock,
  Award,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@/components/ui/Button';
import ScrollReveal from '@/components/public/ScrollReveal';
import SectionDivider from '@/components/public/SectionDivider';
import { fetchMembershipPlans } from '@/redux/slices/membershipPlanSlice';
import { formatCurrency } from '@/utils/formatters';

const MEMBERSHIP_FAQS = [
  {
    q: 'What is included with my Heaven Gym membership?',
    a: 'Membership access depends on the selected plan and the gym's posted opening hours. Please confirm which training zones and amenities are included with reception before purchasing.',
  },
  {
    q: 'Can I freeze or pause my membership if I travel?',
    a: 'Membership pause or freeze options depend on the selected plan and management approval. Please ask reception about the current policy before purchasing.',
  },
  {
    q: 'Do you offer an introductory equipment orientation?',
    a: 'Ask reception whether a facility walkthrough or equipment orientation is available with your selected membership.',
  },
  {
    q: 'Are personal training sessions included or separate?',
    a: 'Personal-training availability, included guidance and any additional fees depend on the current coaching options. Contact reception for details.',
  },
  {
    q: 'How do I complete my registration and admission?',
    a: 'Click "Choose Plan" or "Join Now" to create your member profile. You can finalize your admission and activate your gym access card seamlessly online or at gym reception.',
  },
];

export default function Membership() {
  const dispatch = useDispatch();
  const plans = useSelector((state) => state.membershipPlans.items);
  const loading = useSelector((state) => state.membershipPlans.loading);

  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    dispatch(fetchMembershipPlans());
  }, [dispatch]);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="bg-[#070709] text-white selection:bg-brand-500 selection:text-white">
      {/* =========================================================================
          MEMBERSHIP HERO
          ========================================================================= */}
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1920&q=80"
            alt="Heaven Gym Membership Plans"
            className="h-full w-full object-cover filter brightness-[0.25] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-transparent" />
          <div className="absolute -top-24 right-1/4 h-80 w-80 rounded-full bg-brand-600/20 blur-[130px] pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-down">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-400 backdrop-blur-md">
              <Dumbbell size={13} /> Transparent Pricing &bull; No Surprises
            </span>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <h1 className="mt-6 max-w-3xl font-display text-4xl sm:text-6xl font-black tracking-[-0.03em] leading-tight">
              CHOOSE YOUR PLAN. <br />
              <span className="public-text-crimson-gradient">OWN YOUR PROGRESS.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={250}>
            <p className="mt-6 max-w-xl text-base sm:text-lg text-surface-300 leading-relaxed">
              Straightforward membership options built around your fitness objectives. Clean pricing, full zone access, and zero hidden complexity.
            </p>
          </ScrollReveal>

          {/* Quick trust metrics */}
          <ScrollReveal animation="fade-up" delay={350}>
            <div className="mt-10 flex flex-wrap gap-6 text-xs text-surface-400 font-mono">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" /> Official Gym Access
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} className="text-brand-400" /> Open 7 Days / Week
              </span>
              <span className="flex items-center gap-2">
                <Award size={16} className="text-amber-400" /> Calibrated Equipment
              </span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider variant="dark" />

      {/* =========================================================================
          MEMBERSHIP PLANS GRID (LIVE DATA)
          ========================================================================= */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                Official Plans
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
                MEMBERSHIPS FOR EVERY GOAL.
              </h2>
              <p className="mt-3 text-sm text-surface-400">
                Select your level of commitment and unlock access to all training floors.
              </p>
            </div>
          </ScrollReveal>

          {plans && plans.length > 0 ? (
            <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {plans.map((plan, index) => {
                const premium = /premium|elite|pro|gold|platinum|vip|year|annual/i.test(plan.name || '');
                const offer = Boolean(plan.is_offer);
                const price = Number(plan.price || 0);
                const originalPrice = Number(plan.original_price || 0);
                const duration = Math.max(1, Number(plan.duration_days || 30));
                const discount = offer && originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;

                const PlanIcon = offer ? Sparkles : premium ? Crown : Dumbbell;

                return (
                  <ScrollReveal key={plan.id} animation="fade-up" delay={index * 90}>
                    <article
                      className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border bg-gradient-to-b from-white/[0.04] to-transparent p-7 lg:p-8 transition-all duration-300 hover:-translate-y-1.5 shadow-xl ${
                        offer
                          ? 'border-amber-500/40 hover:border-amber-400 hover:shadow-amber-500/10'
                          : premium
                          ? 'border-brand-500/50 hover:border-brand-400 hover:shadow-brand-500/15'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      {/* Top strip accent */}
                      <div
                        className={`absolute top-0 inset-x-0 h-1.5 ${
                          offer
                            ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500'
                            : premium
                            ? 'bg-gradient-to-r from-red-600 via-brand-500 to-red-400'
                            : 'bg-gradient-to-r from-white/20 via-surface-400 to-white/10'
                        }`}
                      />

                      <div>
                        {/* Header badge & icon */}
                        <div className="flex items-center justify-between gap-3">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                              offer
                                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                                : premium
                                ? 'bg-brand-500/15 border-brand-500/30 text-brand-400'
                                : 'bg-white/5 border-white/10 text-white'
                            }`}
                          >
                            <PlanIcon size={22} />
                          </div>

                          <span
                            className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
                              offer
                                ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                                : premium
                                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                                : 'bg-white/10 text-surface-300 border border-white/10'
                            }`}
                          >
                            {offer ? 'Special Offer' : premium ? 'Most Popular' : 'Essential'}
                          </span>
                        </div>

                        {/* Plan Name & Duration */}
                        <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-white">
                          {plan.name}
                        </h3>
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-mono text-surface-400">
                          <Zap size={13} className="text-brand-400" />
                          <span>{duration} Days Full Facility Access</span>
                        </p>

                        {/* Pricing Panel */}
                        <div className="mt-6 rounded-2xl border border-white/10 bg-black/40 p-5">
                          <div className="flex flex-wrap items-baseline gap-2">
                            {discount > 0 && (
                              <span className="text-sm text-surface-400 line-through">
                                {formatCurrency(originalPrice)}
                              </span>
                            )}
                            <span className="font-display text-3xl sm:text-4xl font-black text-white">
                              {formatCurrency(price)}
                            </span>
                            {discount > 0 && (
                              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                                {discount}% OFF
                              </span>
                            )}
                          </div>

                          <p className="mt-1.5 text-xs font-mono text-surface-400">
                            Effective rate: ~{formatCurrency(price / duration)} per day
                          </p>

                          {plan.offer_label && (
                            <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-400">
                              <Tag size={12} /> {plan.offer_label}
                            </p>
                          )}
                        </div>

                        {/* Description */}
                        {plan.description && (
                          <p className="mt-4 text-xs leading-relaxed text-surface-300">
                            {plan.description}
                          </p>
                        )}

                        {/* Features List */}
                        <div className="mt-6 border-t border-white/10 pt-5">
                          <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-surface-400 mb-3">
                            Included Privileges
                          </p>

                          {(plan.features || []).length > 0 ? (
                            <ul className="space-y-2.5">
                              {plan.features.map((feature, fIdx) => (
                                <li
                                  key={fIdx}
                                  className="flex items-start gap-2.5 text-xs text-surface-300 leading-normal"
                                >
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
                                    <Check size={11} strokeWidth={3} />
                                  </span>
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-surface-400 italic">
                              Full access to all standard workout zones and locker amenities.
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Join Action Link */}
                      <div className="mt-8 pt-4 border-t border-white/5">
                        <Link to="/register" className="block">
                          <Button
                            className={`w-full font-bold uppercase tracking-wider text-xs py-3.5 shadow-lg ${
                              offer || premium
                                ? 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/30 border border-brand-400/25'
                                : 'bg-white/10 hover:bg-white/20 text-white border border-white/15'
                            }`}
                          >
                            Choose This Plan <ArrowRight size={15} className="ml-1.5" />
                          </Button>
                        </Link>
                        <p className="mt-2 text-center font-mono text-[10px] text-surface-400">
                          Secure registration &bull; Instant portal activation
                        </p>
                      </div>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          ) : loading ? (
            <div className="py-20 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent mx-auto mb-4" />
              <p className="text-sm text-surface-400 font-mono">Loading live membership plans...</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center max-w-lg mx-auto">
              <Dumbbell className="mx-auto text-brand-500 mb-3" size={36} />
              <h3 className="font-display text-lg font-bold text-white">Membership Plans Syncing</h3>
              <p className="mt-2 text-xs text-surface-400 leading-relaxed">
                Plans are being refreshed in the club database. Please check back shortly or speak with gym reception directly.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          MEMBERSHIP FAQS
          ========================================================================= */}
      <section className="py-20 bg-ink-950/70 border-t border-white/5">
        <div className="mx-auto max-w-4xl px-5 lg:px-8">
          <ScrollReveal animation="fade-up">
            <div className="text-center mb-12">
              <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                Frequently Answered
              </p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
                MEMBERSHIP QUESTIONS.
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-4">
            {MEMBERSHIP_FAQS.map((faq, idx) => (
              <ScrollReveal key={idx} animation="fade-up" delay={idx * 60}>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition hover:border-brand-500/40">
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none"
                  >
                    <span className="font-display text-base font-bold text-white pr-4">
                      {faq.q}
                    </span>
                    <span
                      className={`h-7 w-7 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-brand-400 transition-transform duration-200 ${
                        openFaq === idx ? 'rotate-180 bg-brand-500 text-white' : ''
                      }`}
                    >
                      <ChevronDown size={16} />
                    </span>
                  </button>

                  {openFaq === idx && (
                    <div className="px-5 pb-6 sm:px-6 pt-1 text-sm text-surface-300 leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Need help box */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-r from-brand-950/30 to-black p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 shrink-0">
                <HelpCircle size={24} />
              </div>
              <div>
                <h4 className="font-display text-base font-bold text-white">Still have questions?</h4>
                <p className="mt-1 text-xs text-surface-400">
                  Our front-desk team is ready to guide you to the perfect training plan.
                </p>
              </div>
            </div>

            <Link to="/contact">
              <Button variant="outline" className="border-white/20 text-white hover:border-brand-500 text-xs font-bold uppercase tracking-wider shrink-0">
                Contact Reception
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
