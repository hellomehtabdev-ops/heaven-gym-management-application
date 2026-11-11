import { Instagram, Facebook, Youtube, ArrowUpRight, MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeavenLogo from '@/components/public/HeavenLogo';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/10 bg-[#060608] text-white overflow-hidden">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-brand-600/10 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr]">
          {/* Brand Column */}
          <div className="space-y-5">
            <Link to="/" className="inline-block focus:outline-none">
              <HeavenLogo variant="footer" size="lg" />
            </Link>

            <p className="max-w-sm text-sm leading-relaxed text-surface-400">
              An elite fitness club and training facility engineered for consistency, strength, and genuine physical development. Built for those who respect the daily discipline.
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow Heaven Gym on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-surface-300 transition duration-200 hover:border-brand-500 hover:bg-brand-600 hover:text-white"
              >
                <Instagram size={17} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow Heaven Gym on Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-surface-300 transition duration-200 hover:border-brand-500 hover:bg-brand-600 hover:text-white"
              >
                <Facebook size={17} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow Heaven Gym on YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-surface-300 transition duration-200 hover:border-brand-500 hover:bg-brand-600 hover:text-white"
              >
                <Youtube size={17} />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white mb-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Navigation
            </h4>
            <ul className="space-y-3 text-sm text-surface-400">
              <li>
                <Link to="/" className="transition hover:text-brand-400 hover:translate-x-0.5 inline-block">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-brand-400 hover:translate-x-0.5 inline-block">
                  About Heaven Gym
                </Link>
              </li>
              <li>
                <Link to="/membership" className="transition hover:text-brand-400 hover:translate-x-0.5 inline-block">
                  Membership Plans
                </Link>
              </li>
              <li>
                <Link to="/store" className="transition hover:text-brand-400 hover:translate-x-0.5 inline-block">
                  Supplements Store
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-brand-400 hover:translate-x-0.5 inline-block">
                  Contact & Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Standards Column */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white mb-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Standards
            </h4>
            <ul className="space-y-3 text-sm text-surface-400">
              <li>
                <Link to="/privacy-policy" className="transition hover:text-brand-400 hover:translate-x-0.5 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="transition hover:text-brand-400 hover:translate-x-0.5 inline-block">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition hover:text-brand-400 hover:translate-x-0.5 inline-block">
                  Member Portal Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="transition hover:text-brand-400 hover:translate-x-0.5 inline-block">
                  Create Member Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours & Direct Membership Card */}
          <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 backdrop-blur-md">
            <div className="flex items-center gap-2 text-brand-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Clock size={14} /> Training Schedule
            </div>
            <p className="mt-2 text-sm font-semibold text-white">
              Open Daily: 5:00 AM – 10:00 PM
            </p>
            <p className="mt-1 text-xs text-surface-400 leading-relaxed">
              Early morning and evening sessions open to all active members across all zones.
            </p>

            <div className="mt-5 pt-4 border-t border-white/10">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-400 transition hover:text-brand-300"
              >
                Join Heaven Gym Today
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-surface-500">
          <p>© {currentYear} Heaven Gym Club. All rights reserved. Built through discipline.</p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[11px] text-surface-400">
              DISCIPLINE &bull; STRENGTH &bull; CONSISTENCY
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
