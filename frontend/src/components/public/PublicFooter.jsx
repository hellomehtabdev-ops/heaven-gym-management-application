import { useState, useEffect } from 'react';
import { Instagram, Facebook, Youtube, ArrowUpRight, MapPin, Phone, Mail, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeavenLogo from '@/components/public/HeavenLogo';
import api from '@/services/apiClient';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const [gymSettings, setGymSettings] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/gym-settings')
      .then(({ data }) => {
        if (active) setGymSettings(data);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <footer className="relative border-t border-white/10 bg-[#050608] text-white overflow-hidden w-full max-w-full">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 h-80 w-[450px] sm:w-[700px] max-w-full rounded-full bg-brand-600/10 blur-[150px]" />

      <div className="relative mx-auto max-w-7xl px-5 pt-20 pb-12 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr_1.4fr]">
          {/* Brand Column */}
          <div className="space-y-5">
            <Link to="/" className="inline-block focus:outline-none">
              <HeavenLogo variant="footer" size="lg" />
            </Link>

            <p className="max-w-sm text-xs sm:text-sm leading-relaxed text-surface-400">
              An ultra-premium luxury fitness sanctuary engineered for longevity, strength, and genuine human potential. Designed for individuals who demand uncompromising standards.
            </p>

            {gymSettings?.address && (
              <p className="flex items-start gap-2 text-xs text-surface-400 max-w-xs">
                <MapPin size={15} className="text-brand-500 shrink-0 mt-0.5" />
                <span>{gymSettings.address}</span>
              </p>
            )}

            <div className="flex items-center gap-2.5 pt-2">
              {gymSettings?.instagram_url && <a
                href={gymSettings.instagram_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Follow Heaven Gym on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-surface-300 transition duration-200 hover:border-brand-500 hover:bg-brand-600 hover:text-white"
              >
                <Instagram size={17} />
              </a>}
              {gymSettings?.facebook_url && <a
                href={gymSettings.facebook_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Follow Heaven Gym on Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-surface-300 transition duration-200 hover:border-brand-500 hover:bg-brand-600 hover:text-white"
              >
                <Facebook size={17} />
              </a>}
              {gymSettings?.youtube_url && <a
                href={gymSettings.youtube_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Follow Heaven Gym on YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-surface-300 transition duration-200 hover:border-brand-500 hover:bg-brand-600 hover:text-white"
              >
                <Youtube size={17} />
              </a>}
            </div>
          </div>

          {/* Experience & Facilities Column */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white mb-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Experience
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-surface-400 font-medium">
              <li>
                <Link to="/" className="transition hover:text-white hover:translate-x-0.5 inline-block">
                  Home Experience
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-white hover:translate-x-0.5 inline-block">
                  About Heaven Gym
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="transition hover:text-white hover:translate-x-0.5 inline-block">
                  All 11+ Facilities
                </Link>
              </li>
              <li>
                <Link to="/transformations" className="transition hover:text-white hover:translate-x-0.5 inline-block">
                  Body Transformations
                </Link>
              </li>
              <li>
                <Link to="/membership" className="transition hover:text-white hover:translate-x-0.5 inline-block">
                  Membership & Offers
                </Link>
              </li>
              <li>
                <Link to="/franchise" className="transition hover:text-white hover:translate-x-0.5 inline-block">
                  Franchise Opportunity
                </Link>
              </li>
            </ul>
          </div>

          {/* Store & Services Column */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white mb-5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> Stores & Legal
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-surface-400 font-medium">
              <li>
                <Link to="/store" className="transition hover:text-white hover:translate-x-0.5 inline-block">
                  Supplement Store
                </Link>
              </li>
              <li>
                <Link to="/gym-equipment" className="transition hover:text-white hover:translate-x-0.5 inline-block">
                  Gym Equipment Store
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-white hover:translate-x-0.5 inline-block">
                  Contact & Concierge
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="transition hover:text-white hover:translate-x-0.5 inline-block">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="transition hover:text-white hover:translate-x-0.5 inline-block">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition hover:text-white hover:translate-x-0.5 inline-block">
                  Member Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Hours & Concierge Card */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-brand-400 font-mono text-xs font-bold uppercase tracking-wider">
                <Clock size={14} /> Club Hours
              </div>
              <p className="mt-2 text-base font-bold text-white">
                {gymSettings?.opening_hours || 'Contact us for current opening hours.'}
              </p>
              <p className="mt-1 text-xs text-surface-400 leading-relaxed">
                Contact the Heaven Gym team for current facility access and availability details.
              </p>

              {gymSettings?.contact_phone && (
                <div className="mt-4 pt-3 border-t border-white/10 text-xs text-surface-300">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-surface-500 block">
                    Direct Phone Line
                  </span>
                  <a href={`tel:${gymSettings.contact_phone}`} className="font-mono font-bold text-white hover:text-brand-400 transition">
                    {gymSettings.contact_phone}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brand-400 transition hover:text-brand-300"
              >
                Join Heaven Gym
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <ShieldCheck size={13} /> Official Club
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-surface-500 font-mono">
          <p>© {currentYear} Heaven Gym. All rights reserved. Ultra-Premium Fitness Experience.</p>
          <div className="flex items-center gap-6">
            <span className="text-[11px] text-surface-400 uppercase tracking-widest">
              STRENGTH &bull; LUXURY &bull; PERFORMANCE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
