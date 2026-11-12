import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import api from '@/services/apiClient';

export default function WhatsAppButton() {
  const [phone, setPhone] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let active = true;
    api
      .get('/gym-settings')
      .then(({ data }) => {
        if (active && data?.contact_phone) {
          setPhone(data.contact_phone);
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const normalizedPhone = phone.replace(/\D/g, '');
  const internationalNumber =
    normalizedPhone.length === 10 ? `91${normalizedPhone}` : normalizedPhone;

  // Contextual pre-filled message based on active route
  const getContextualMessage = () => {
    const path = location.pathname;
    if (path.includes('membership')) {
      return 'Hello Heaven Gym, I would like to enquire about your membership plans and current joining offers.';
    }
    if (path.includes('franchise')) {
      return 'Hello Heaven Gym, I am interested in exploring a Heaven Gym franchise partnership. Please share details.';
    }
    if (path.includes('transformations')) {
      return 'Hello Heaven Gym, I saw your member body transformations and would like to learn more about your coaching programs.';
    }
    if (path.includes('gym-equipment')) {
      return 'Hello Heaven Gym, I am interested in enquiring about your gym and commercial fitness equipment catalogue.';
    }
    if (path.includes('store')) {
      return 'Hello Heaven Gym, I have an enquiry regarding authentic supplements available at the Heaven Gym store.';
    }
    if (path.includes('facilities')) {
      return 'Hello Heaven Gym, I would like to schedule a walk-through tour of your luxury training facilities.';
    }
    return 'Hello Heaven Gym, I would like to know more about Heaven Gym facilities, training, and memberships.';
  };

  const whatsappUrl = internationalNumber
    ? `https://wa.me/${internationalNumber}?text=${encodeURIComponent(getContextualMessage())}`
    : '';

  // If no contact phone is configured yet in gym settings, we provide a graceful fallback or hide
  if (!whatsappUrl) return null;

  return (
    <aside
      aria-label="WhatsApp enquiry"
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
    >
      {/* Quick contextual bubble tooltip */}
      {isOpen && (
        <div className="relative mb-1 w-72 rounded-2xl border border-white/10 bg-[#0e1118]/95 p-4 text-white shadow-2xl backdrop-blur-xl animate-fade-up">
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close message preview"
            className="absolute top-2.5 right-2.5 rounded-full p-1 text-surface-400 hover:bg-white/10 hover:text-white"
          >
            <X size={14} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
              Heaven Gym Concierge
            </span>
          </div>
          <p className="text-xs text-surface-300 leading-relaxed">
            Need instant guidance on memberships, personal coaching, equipment, or facilities?
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-500 shadow-md shadow-emerald-950/40"
          >
            <MessageCircle size={15} /> Chat on WhatsApp
          </a>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="relative group">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Enquire on WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-[#128C7E] to-[#25D366] text-white shadow-2xl shadow-emerald-900/50 transition-all duration-300 hover:scale-110 hover:shadow-emerald-600/50 active:scale-95"
        >
          <MessageCircle size={28} className="drop-shadow" />
        </a>

        {/* Pulsing ring indicator */}
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-[#25D366]/30 animate-ping opacity-60" />

        {/* Hover preview trigger pill (desktop only) */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle enquiry information"
          className="hidden sm:flex absolute right-16 top-1/2 -translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-[#0e1118]/90 px-3 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        >
          <span>Chat With Us</span>
        </button>
      </div>
    </aside>
  );
}
