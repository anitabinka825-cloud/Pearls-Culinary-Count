import React, { useEffect, useState } from 'react';
import { SiteSettingsForm, adminGetSettings, adminSaveSettings } from '../../services/api';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { card, input, btnPrimary, Notice } from './adminUi';

type Field = keyof SiteSettingsForm;

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className={`${card} p-5 space-y-4`}>
      <div>
        <h3 className="font-bold text-sm text-neutral-900">{title}</h3>
        {hint && <p className="text-xs text-neutral-500 mt-0.5">{hint}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

export function AdminSettings() {
  const [form, setForm] = useState<SiteSettingsForm | null>(null);
  const [saved, setSaved] = useState<SiteSettingsForm | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const { apply } = useSiteSettings();

  useEffect(() => {
    adminGetSettings().then((s) => { setForm(s); setSaved(s); }).catch((e) => setError(e.message));
  }, []);

  if (!form) return error ? <Notice kind="error">{error}</Notice> : <Notice kind="info">Loading settings…</Notice>;
  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const set = (k: Field, v: string | boolean) => { setForm({ ...form, [k]: v }); setDone(false); };
  const text = (k: Field, label: string, placeholder = '', hint = '') => (
    <label className="text-xs font-semibold text-neutral-600 block">
      {label}
      <input className={`${input} mt-1 font-normal`} value={form[k] as string} placeholder={placeholder}
        onChange={(e) => set(k, e.target.value)} />
      {hint && <span className="block mt-1 font-normal text-neutral-500">{hint}</span>}
    </label>
  );

  const save = async () => {
    if (form.ordersPaused && !saved?.ordersPaused &&
        !window.confirm('Pause online orders? Customers will not be able to check out until you switch this off.')) return;
    setBusy(true);
    setError('');
    try {
      const s = await adminSaveSettings(form);
      setForm(s);
      setSaved(s);
      setDone(true);
      // Update the live site straight away (the server does the same for everyone else within a minute).
      apply({
        phone: s.phone, whatsapp: s.whatsapp, email: s.email,
        socials: { instagram: s.instagram, facebook: s.facebook, tiktok: s.tiktok, youtube: s.youtube, x: s.x },
        careHours: s.careHours, announcement: s.announcement, ordersPaused: s.ordersPaused,
        pauseMessage: s.ordersPaused ? s.pauseMessage || 'Online ordering is paused for now. Please message us on WhatsApp or check back soon.' : '',
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <Notice kind="info">Anything you leave empty uses the website's built-in details. Changes show on the site within about a minute.</Notice>

      <Section title="Online ordering" hint="Use this for holidays or when you are fully booked. Custom-order enquiries stay open.">
        <label className="flex items-center gap-3 text-sm font-semibold text-neutral-800 sm:col-span-2">
          <input type="checkbox" className="w-4 h-4 accent-[#DE1B76]" checked={form.ordersPaused}
            onChange={(e) => set('ordersPaused', e.target.checked)} />
          Pause online orders
        </label>
        {form.ordersPaused && (
          <div className="sm:col-span-2">
            {text('pauseMessage', 'Message customers will see', 'We are on holiday until Monday 3 November.')}
          </div>
        )}
      </Section>

      <Section title="Announcement bar" hint="A short notice shown at the very top of every page. Leave empty for none.">
        <div className="sm:col-span-2">{text('announcement', 'Announcement', 'Closed on Monday for stocktaking.')}</div>
      </Section>

      <Section title="Contact details" hint="Shown in the header, footer, Contact page and customer-care window.">
        {text('phone', 'Phone number', '055 247 1271')}
        {text('whatsapp', 'WhatsApp number', 'Same as phone', 'Leave empty to use the phone number.')}
        {text('email', 'Email address', 'hello@yourdomain.com')}
        {text('careHours', 'Customer care hours', 'Mon–Sat, 8am–6pm')}
      </Section>

      <Section title="Social media" hint="Paste the link to each page. Only links on the right website are accepted.">
        {text('instagram', 'Instagram', 'instagram.com/yourpage')}
        {text('facebook', 'Facebook', 'facebook.com/yourpage')}
        {text('tiktok', 'TikTok', 'tiktok.com/@yourpage')}
        {text('youtube', 'YouTube', 'youtube.com/@yourchannel')}
        {text('x', 'X (Twitter)', 'x.com/yourpage')}
      </Section>

      <Section title="Your alerts" hint="Private — never shown on the website.">
        {text('ownerAlertPhone', 'Phone to text for new orders and enquiries', '055 247 1271', 'Needs Sailup connected. Leave empty for no alerts.')}
      </Section>

      {error && <Notice kind="error">{error}</Notice>}
      <div className="flex items-center gap-3 sticky bottom-4">
        <button type="button" className={btnPrimary} disabled={busy || !dirty} onClick={save}>
          {busy ? 'Saving…' : 'Save changes'}
        </button>
        {done && !dirty && <span className="text-xs font-semibold text-green-700" role="status">Saved</span>}
      </div>
    </div>
  );
}
