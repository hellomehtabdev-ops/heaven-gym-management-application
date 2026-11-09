import { useEffect, useState } from 'react';
import { Clock3, Mail, MapPin, Phone } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import api from '@/services/apiClient';

export default function Contact() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get('/gym-settings')
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

  return (
    <div>
      <section className="bg-ink-950 pb-20 pt-36 text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-400">Contact</p>
          <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold tracking-[-.04em] sm:text-6xl">
            Have a question?<br /><span className="text-brand-400">Let’s talk.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-surface-300">
            Contact the Heaven Gym team for membership information, store orders, or a visit.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-[.8fr_1.2fr] lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Find us"
              title="Get in touch."
              description="Use the gym’s current contact details below. These details are managed by the gym administrator."
            />
            <div className="mt-10 space-y-6">
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"><MapPin size={18} /></span>
                <div>
                  <p className="text-sm font-semibold text-ink-900 dark:text-white">Gym address</p>
                  <p className="mt-1 text-sm text-surface-500">{loading ? 'Loading address…' : address || 'Address not added yet'}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"><Phone size={18} /></span>
                <div>
                  <p className="text-sm font-semibold text-ink-900 dark:text-white">Phone</p>
                  {phone
                    ? <a className="mt-1 block text-sm text-brand-600 hover:underline dark:text-brand-400" href={`tel:${phone.replace(/[^+\d]/g, '')}`}>{phone}</a>
                    : <p className="mt-1 text-sm text-surface-500">{loading ? 'Loading phone…' : 'Phone number not added yet'}</p>}
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"><Mail size={18} /></span>
                <div>
                  <p className="text-sm font-semibold text-ink-900 dark:text-white">Email</p>
                  {email
                    ? <a className="mt-1 block text-sm text-brand-600 hover:underline dark:text-brand-400" href={`mailto:${email}`}>{email}</a>
                    : <p className="mt-1 text-sm text-surface-500">{loading ? 'Loading email…' : 'Email address not added yet'}</p>}
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"><Clock3 size={18} /></span>
                <div>
                  <p className="text-sm font-semibold text-ink-900 dark:text-white">Opening hours</p>
                  <p className="mt-1 text-sm text-surface-500">Please confirm today’s hours with the gym before visiting.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm dark:border-surface-800 dark:bg-surface-900 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-ink-950 dark:text-white">Speak with the gym team</h2>
            <p className="mt-3 text-sm leading-6 text-surface-500">
              The online message form is not connected to a message-delivery service, so it has been removed rather than showing a false success message. Please use the verified phone number or email address listed here.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {phone && <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">Call Heaven Gym</a>}
              {email && <a href={`mailto:${email}`} className="inline-flex items-center justify-center rounded-xl border border-surface-300 px-5 py-3 text-sm font-semibold text-ink-800 hover:bg-surface-50 dark:border-surface-700 dark:text-white dark:hover:bg-surface-800">Email Heaven Gym</a>}
              {!loading && !phone && !email && <p className="text-sm text-surface-500">The gym administrator needs to add a phone number or email in Admin Settings.</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
