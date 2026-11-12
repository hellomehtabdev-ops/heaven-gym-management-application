import { useEffect, useState } from 'react';
import {
  Clock3,
  Mail,
  MapPin,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import ScrollReveal from '@/components/public/ScrollReveal';
import SectionDivider from '@/components/public/SectionDivider';
import api from '@/services/apiClient';
import { getWhatsAppNumber } from '@/utils/phone';

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api
      .get('/gym-settings')
      .then(({ data }) => {
        if (active) setSettings(data);
      })
      .catch(() => {
        if (active) setSettings({});
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const phone = settings?.contact_phone?.trim() || '';
  const email = settings?.contact_email?.trim() || '';
  const address = settings?.address?.trim() || '';
  const cleanPhone = phone.replace(/[^+\d]/g, '');
  const internationalNumber = getWhatsAppNumber(phone);

  return (
    <div className="bg-[#070709] text-white selection:bg-brand-500 selection:text-white min-h-screen">
      {/* =========================================================================
          CONTACT HERO
          ========================================================================= */}
      <section className="relative overflow-hidden pt-36 pb-20 lg:pt-44 lg:pb-28">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1920&q=80"
            alt="Contact Heaven Gym Facility"
            className="h-full w-full object-cover filter brightness-[0.22] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-transparent" />
          <div className="absolute -top-20 right-1/4 h-80 w-80 rounded-full bg-brand-600/20 blur-[130px] pointer-events-none" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 lg:px-8">
          <ScrollReveal animation="fade-down">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-400 backdrop-blur-md">
              <Sparkles size={13} /> Direct Communication
            </span>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={150}>
            <h1 className="mt-6 max-w-3xl font-display text-4xl sm:text-6xl font-black tracking-[-0.03em] leading-tight">
              HAVE A QUESTION? <br />
              <span className="public-text-crimson-gradient">LET&rsquo;S TALK.</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={250}>
            <p className="mt-4 max-w-xl text-base sm:text-lg text-surface-300 leading-relaxed">
              Connect with Heaven Gym front desk for membership admissions, facility tours, store orders, or coaching consultations.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <SectionDivider variant="dark" />

      {/* =========================================================================
          CONTACT DETAILS & ACTION CARDS
          ========================================================================= */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
            {/* Left: Contact Info Cards */}
            <ScrollReveal animation="fade-right">
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-brand-500">
                  Verified Details
                </p>
                <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
                  VISIT & CONNECT.
                </h2>
                <p className="mt-2 text-sm text-surface-400 max-w-lg">
                  Below are the officially configured gym contact details, managed in real time by gym administration.
                </p>

                <div className="mt-10 grid gap-5 sm:grid-cols-2">
                  {/* Address Card */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-500/40 transition duration-300">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 border border-brand-500/25 text-brand-400 mb-4">
                      <MapPin size={20} />
                    </div>
                    <h3 className="font-display text-base font-bold text-white">Facility Address</h3>
                    <p className="mt-2 text-xs leading-relaxed text-surface-300">
                      {loading ? (
                        <span className="animate-pulse text-surface-500">Retrieving official location...</span>
                      ) : address ? (
                        address
                      ) : (
                        'Address not yet specified in administration settings.'
                      )}
                    </p>
                    {address && (
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 text-[11px] font-mono font-bold text-brand-400 hover:underline uppercase tracking-wider"
                      >
                        Open In Google Maps <ExternalLink size={12} />
                      </a>
                    )}
                  </div>

                  {/* Phone Card */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-500/40 transition duration-300">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 border border-brand-500/25 text-brand-400 mb-4">
                      <Phone size={20} />
                    </div>
                    <h3 className="font-display text-base font-bold text-white">Phone Inquiries</h3>
                    <p className="mt-2 text-xs leading-relaxed text-surface-300">
                      {loading ? (
                        <span className="animate-pulse text-surface-500">Loading verified phone...</span>
                      ) : phone ? (
                        <a href={`tel:${cleanPhone}`} className="text-white hover:text-brand-400 font-mono font-semibold transition">
                          {phone}
                        </a>
                      ) : (
                        'Phone number not yet specified.'
                      )}
                    </p>
                    <p className="mt-2 text-[11px] text-surface-500">
                      Direct line to reception desk during open hours.
                    </p>
                  </div>

                  {/* Email Card */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-500/40 transition duration-300">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 border border-brand-500/25 text-brand-400 mb-4">
                      <Mail size={20} />
                    </div>
                    <h3 className="font-display text-base font-bold text-white">Email Communications</h3>
                    <p className="mt-2 text-xs leading-relaxed text-surface-300">
                      {loading ? (
                        <span className="animate-pulse text-surface-500">Loading verified email...</span>
                      ) : email ? (
                        <a href={`mailto:${email}`} className="text-white hover:text-brand-400 font-mono transition break-all">
                          {email}
                        </a>
                      ) : (
                        'Email address not yet specified.'
                      )}
                    </p>
                    <p className="mt-2 text-[11px] text-surface-500">
                      For corporate inquiries, billing, or feedback.
                    </p>
                  </div>

                  {/* Hours Card */}
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-500/40 transition duration-300">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/15 border border-brand-500/25 text-brand-400 mb-4">
                      <Clock3 size={20} />
                    </div>
                    <h3 className="font-display text-base font-bold text-white">Operating Schedule</h3>
                    <p className="mt-2 text-xs font-mono text-white font-semibold">
                      Monday &ndash; Sunday: 5:00 AM &ndash; 10:00 PM
                    </p>
                    <p className="mt-2 text-[11px] text-surface-500">
                      Doors open early every morning for discipline lifters.
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: Direct Action Panel */}
            <ScrollReveal animation="fade-left">
              <div className="rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-black p-7 sm:p-10 shadow-2xl">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-3 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-brand-400">
                  <ShieldCheck size={14} /> Official Support
                </span>

                <h3 className="mt-5 font-display text-2xl font-bold text-white">
                  Speak Directly With The Gym Team
                </h3>

                <p className="mt-3 text-xs leading-relaxed text-surface-300">
                  To ensure 100% genuine response and avoid lost web forms, our desk communicates directly via phone call, email, or verified instant message.
                </p>

                <div className="mt-8 space-y-3.5">
                  {phone && (
                    <a
                      href={`tel:${cleanPhone}`}
                      className="flex items-center justify-between rounded-xl bg-brand-600 px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-500"
                    >
                      <span className="flex items-center gap-2">
                        <Phone size={16} /> Call Heaven Gym Desk
                      </span>
                      <ArrowRight size={16} />
                    </a>
                  )}

                  {phone && (
                    <a
                      href={`https://wa.me/${internationalNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 transition hover:bg-emerald-500/20"
                    >
                      <span className="flex items-center gap-2">
                        <MessageSquare size={16} /> Chat On WhatsApp
                      </span>
                      <ExternalLink size={16} />
                    </a>
                  )}

                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-6 py-4 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:border-brand-500 hover:bg-brand-500/10"
                    >
                      <span className="flex items-center gap-2">
                        <Mail size={16} /> Send Email Inquiries
                      </span>
                      <ArrowRight size={16} />
                    </a>
                  )}

                  {!loading && !phone && !email && (
                    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-300">
                      The gym administrator has not yet configured phone or email in the Admin Settings panel.
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-surface-400">
                  <span>Ready to join immediately?</span>
                  <Link to="/register" className="font-bold text-brand-400 hover:underline">
                    Create Account &rarr;
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
