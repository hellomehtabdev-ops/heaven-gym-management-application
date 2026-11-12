import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Briefcase,
  Building,
  CheckCircle2,
  Dumbbell,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import ScrollReveal from '@/components/public/ScrollReveal';
import Card3D from '@/components/public/Card3D';
import api from '@/services/apiClient';

export default function Franchise() {
  const [gymSettings, setGymSettings] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    investmentRange: '₹30L – ₹50L',
    gymExperience: 'Yes, looking to upgrade/expand',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

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

  const phone = gymSettings?.contact_phone?.replace(/\D/g, '') || '';
  const internationalNumber = phone.length === 10 ? `91${phone}` : phone;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // If WhatsApp available, open pre-filled enquiry
    if (internationalNumber) {
      const text = encodeURIComponent(
        `Hello Heaven Gym Team,\n\nI am submitting a Franchise & Gym Business Enquiry:\nName: ${formData.name}\nPhone: ${formData.phone}\nEmail: ${formData.email}\nCity: ${formData.city}\nEstimated Investment: ${formData.investmentRange}\nExperience: ${formData.gymExperience}\nNotes: ${formData.message}`
      );
      window.open(`https://wa.me/${internationalNumber}?text=${text}`, '_blank');
    }
  };

  const PILLARS = [
    {
      icon: Building,
      title: 'Facility Layout & Architecture',
      description:
        'Professional zoning plans engineered for high-throughput member flows, vibration-isolated deadlift bays, acoustic dampening, and luxury locker spaces.',
    },
    {
      icon: Dumbbell,
      title: 'Commercial Equipment Sourcing',
      description:
        'Direct procurement access to certified biomechanically accurate plate-loaded machines, Olympic racks, and commercial cardio decks at commercial partner pricing.',
    },
    {
      icon: Users,
      title: 'Staff & Coach Training Curriculum',
      description:
        'Comprehensive standard operating procedures (SOPs) for front-desk concierge, personal trainers, nutrition consultants, and daily maintenance crews.',
    },
    {
      icon: Briefcase,
      title: 'Integrated Gym Management System',
      description:
        'Turnkey cloud software handling member subscriptions, Razorpay digital checkouts, attendance tracking, and supplement retail billing out of the box.',
    },
  ];

  return (
    <div className="bg-[#06070a] text-white min-h-screen pt-32 pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-white/10">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-[180px]" />
        </div>

        <div className="mx-auto max-w-7xl px-5 lg:px-8 text-center">
          <ScrollReveal animation="fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-[0.25em] text-brand-400 backdrop-blur-md">
              <Sparkles size={14} className="text-brand-400" />
              Business Expansion & Partnerships
            </div>

            <h1 className="mt-5 font-display text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight text-white leading-tight break-words">
              BUILD YOUR FITNESS BUSINESS <br />
              <span className="bg-gradient-to-r from-brand-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                WITH HEAVEN GYM.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-surface-300 leading-relaxed">
              Partner with an ultra-premium fitness brand. From facility architecture and precision equipment sourcing to management software and coach certifications.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
        <ScrollReveal animation="fade-up">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-500">
              The Heaven Gym Advantage
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-black text-white">
              TURNKEY FITNESS INFRASTRUCTURE.
            </h2>
            <p className="mt-3 text-sm text-surface-400">
              We provide practical operational blueprints developed through real facility ownership.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p) => (
            <Card3D key={p.title} className="h-full">
              <div className="flex flex-col h-full rounded-3xl border border-white/10 bg-[#0e1017] p-6 shadow-xl hover:border-brand-500/30 transition">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400 mb-5">
                  <p.icon size={24} />
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-2">{p.title}</h3>
                <p className="text-xs text-surface-300 leading-relaxed mt-auto">{p.description}</p>
              </div>
            </Card3D>
          ))}
        </div>
      </section>

      {/* Enquiry Form & Contact details */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-12">
        <div className="grid gap-12 lg:grid-cols-12 items-start">
          {/* Information Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-3xl border border-white/10 bg-[#0e1017] p-8 space-y-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-brand-500">
                  Franchise Concierge
                </span>
                <h3 className="mt-2 font-display text-2xl font-black text-white">
                  Schedule a Business Consultation
                </h3>
                <p className="mt-2 text-xs text-surface-400 leading-relaxed">
                  Our development team evaluates territory viability, demographic demand, space requirements, and operational feasibility.
                </p>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                {gymSettings?.contact_phone && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-brand-400">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-surface-500">
                        Phone Enquiries
                      </p>
                      <a href={`tel:${gymSettings.contact_phone}`} className="text-sm font-mono font-bold text-white hover:text-brand-400">
                        {gymSettings.contact_phone}
                      </a>
                    </div>
                  </div>
                )}

                {gymSettings?.contact_email && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-brand-400">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-surface-500">
                        Direct Email
                      </p>
                      <a href={`mailto:${gymSettings.contact_email}`} className="text-sm font-mono font-bold text-white hover:text-brand-400">
                        {gymSettings.contact_email}
                      </a>
                    </div>
                  </div>
                )}

                {gymSettings?.address && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-brand-400 shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono uppercase tracking-wider text-surface-500">
                        Corporate Flagship
                      </p>
                      <p className="text-xs text-surface-300">{gymSettings.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs text-amber-300">
                <span className="font-bold">Transparent Disclosure:</span> Heaven Gym does not guarantee speculative investment returns. All prospective partnerships require rigorous location scouting and financial capability verification.
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-white/10 bg-[#0e1017] p-8 sm:p-10 shadow-2xl">
              <h3 className="font-display text-2xl font-black text-white">
                Submit Partnership Application
              </h3>
              <p className="mt-1 text-xs text-surface-400">
                Fill out the form below. An authorized representative will get in touch within 24–48 hours.
              </p>

              {submitted ? (
                <div className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center">
                  <ShieldCheck size={36} className="mx-auto text-emerald-400 mb-2" />
                  <h4 className="font-display text-lg font-bold text-white">Enquiry Prepared!</h4>
                  <p className="mt-1 text-xs text-surface-300">
                    Your enquiry details have been forwarded to our corporate concierge team.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-brand-400"
                  >
                    Send another enquiry &rarr;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold font-mono uppercase text-surface-300">
                        Full Name *
                      </span>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Vikram Singhania"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 text-white"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-xs font-bold font-mono uppercase text-surface-300">
                        Mobile Number *
                      </span>
                      <input
                        required
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 text-white"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold font-mono uppercase text-surface-300">
                        Email Address *
                      </span>
                      <input
                        required
                        type="email"
                        placeholder="e.g. contact@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 text-white"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-xs font-bold font-mono uppercase text-surface-300">
                        Target City / Territory *
                      </span>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Mumbai, Bangalore, Pune"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 text-white"
                      />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1 block text-xs font-bold font-mono uppercase text-surface-300">
                        Estimated Capital Budget
                      </span>
                      <select
                        value={formData.investmentRange}
                        onChange={(e) => setFormData({ ...formData, investmentRange: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#0b0d14] px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 text-white"
                      >
                        <option value="₹30L – ₹50L">₹30 Lakhs – ₹50 Lakhs</option>
                        <option value="₹50L – ₹1 Crore">₹50 Lakhs – ₹1 Crore</option>
                        <option value="₹1 Crore – ₹2.5 Crore">₹1 Crore – ₹2.5 Crore</option>
                        <option value="₹2.5 Crore+">₹2.5 Crore+ (Flagship Mega-Facility)</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-1 block text-xs font-bold font-mono uppercase text-surface-300">
                        Fitness Industry Background
                      </span>
                      <select
                        value={formData.gymExperience}
                        onChange={(e) => setFormData({ ...formData, gymExperience: e.target.value })}
                        className="w-full rounded-xl border border-white/10 bg-[#0b0d14] px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 text-white"
                      >
                        <option value="Yes, looking to upgrade/expand">Existing Gym Owner / Operator</option>
                        <option value="Entrepreneur exploring fitness">First-time Fitness Entrepreneur</option>
                        <option value="Commercial real estate owner">Commercial Property / Land Owner</option>
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="mb-1 block text-xs font-bold font-mono uppercase text-surface-300">
                      Property Details or Questions (Optional)
                    </span>
                    <textarea
                      rows="3"
                      placeholder="Specify carpet area, preferred location, or specific requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-sm outline-none focus:border-brand-500 text-white"
                    />
                  </label>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-xs font-mono font-bold uppercase tracking-wider text-white shadow-xl shadow-brand-600/30 hover:bg-brand-500 transition active:scale-95"
                  >
                    <Send size={15} /> Submit Franchise Enquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
