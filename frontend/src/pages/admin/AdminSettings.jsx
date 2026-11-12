import { useEffect, useState } from 'react';
import { Save, Building } from 'lucide-react';
import AdminLoadingSkeleton from '@/components/admin/AdminLoadingSkeleton';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { gymSettingsService } from '@/services/settingsService';

export default function AdminSettings() {
  const [settings, setSettings] = useState({ gym_name: '', contact_phone: '', contact_email: '', address: '', opening_hours: '', instagram_url: '', facebook_url: '', youtube_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    gymSettingsService.get().then((data) => { setSettings(data || {}); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  function update(key, value) { setSettings((prev) => ({ ...prev, [key]: value })); }

  async function handleSave() {
    setSaving(true);
    try {
      await gymSettingsService.update(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { alert('Failed to save settings'); }
    setSaving(false);
  }

  if (loading) return <AdminLoadingSkeleton variant="form" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-950 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-surface-500">Manage gym and business configuration</p>
      </div>

      <Card>
        <div className="mb-5 flex items-center gap-2">
          <Building size={20} className="text-brand-600" />
          <h3 className="font-display text-lg font-semibold text-ink-950 dark:text-white">Gym Information</h3>
        </div>
        <div className="space-y-4">
          <Input label="Gym Name" value={settings.gym_name || ''} onChange={(e) => update('gym_name', e.target.value)} placeholder="Heaven Gym" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Contact Phone" value={settings.contact_phone || ''} onChange={(e) => update('contact_phone', e.target.value)} placeholder="Phone number" />
            <Input label="Contact Email" value={settings.contact_email || ''} onChange={(e) => update('contact_email', e.target.value)} placeholder="email@gym.com" />
          </div>
          <Input label="Address" value={settings.address || ''} onChange={(e) => update('address', e.target.value)} placeholder="Gym address" />
          <Input label="Opening Hours" value={settings.opening_hours || ''} onChange={(e) => update('opening_hours', e.target.value)} placeholder="e.g. Monday – Sunday: 5:00 AM – 10:00 PM" />
          <p className="text-xs text-surface-500">Leave blank to show that visitors should contact the gym for current hours.</p>
        </div>
      </Card>

      <Card>
        <div className="mb-5 flex items-center gap-2">
          <Building size={20} className="text-brand-600" />
          <h3 className="font-display text-lg font-semibold text-ink-950 dark:text-white">Social Profiles</h3>
        </div>
        <div className="space-y-4">
          <Input label="Instagram URL" value={settings.instagram_url || ''} onChange={(e) => update('instagram_url', e.target.value)} placeholder="https://www.instagram.com/your-profile" />
          <Input label="Facebook URL" value={settings.facebook_url || ''} onChange={(e) => update('facebook_url', e.target.value)} placeholder="https://www.facebook.com/your-page" />
          <Input label="YouTube URL" value={settings.youtube_url || ''} onChange={(e) => update('youtube_url', e.target.value)} placeholder="https://www.youtube.com/@your-channel" />
        </div>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} loading={saving}><Save size={16} /> Save Settings</Button>
        {saved && <span className="text-sm font-medium text-emerald-500">Settings saved successfully</span>}
      </div>
    </div>
  );
}
