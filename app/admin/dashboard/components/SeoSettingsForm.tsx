'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Save,
  CheckCircle2,
  AlertCircle,
  Globe,
  ShieldCheck,
  Search,
  ExternalLink,
  RefreshCw,
  Building,
} from 'lucide-react';

export default function SeoSettingsForm() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [form, setForm] = useState({
    siteTitle: '',
    metaDescription: '',
    canonicalDomain: 'https://veerrealestate.com',
    googleSiteVerification: '',
    googleAnalyticsId: '',
    defaultOgImage: '/images/og-default.jpg',
    robotsDefault: 'index, follow',
    organizationName: 'Veer Real Estate',
    organizationPhone: '+91 98250 00000',
    organizationEmail: 'info@veerrealestate.com',
    organizationAddress: 'Ahmedabad, Gujarat, India',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/seo-settings');
      if (res.ok) {
        const data = await res.json();
        setForm((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Failed to load SEO settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback(null);
      const res = await fetch('/api/admin/seo-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');
      setFeedback({ type: 'success', message: 'SEO & Verification settings successfully updated in database!' });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving settings' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-500 mx-auto mb-2" />
        <p className="text-xs text-slate-500">Loading SEO configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Settings Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-150 gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-500" />
              Global SEO & Google Verification Settings
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">
              Manage website canonical URL, Google Search Console verification meta tag, Analytics ID, and default robots directives.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>{saving ? 'Saving...' : 'Save SEO Configuration'}</span>
          </button>
        </div>

        {feedback && (
          <div
            className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* 1. Google Verification & Analytics */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            1. Search Console & Analytics Integration
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                Google Search Console Verification Tag (content value)
              </label>
              <input
                type="text"
                placeholder="e.g. MAzcA3AguIYWeVSbX2ynaRkn8iK9pwVyiPqCEwoKGCE"
                value={form.googleSiteVerification}
                onChange={(e) => setForm({ ...form, googleSiteVerification: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Injects &lt;meta name="google-site-verification" content="..." /&gt; across all public pages automatically.
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                Google Analytics 4 Measurement ID
              </label>
              <input
                type="text"
                placeholder="e.g. G-XXXXXXXXXX"
                value={form.googleAnalyticsId}
                onChange={(e) => setForm({ ...form, googleAnalyticsId: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Loads Google Tag Manager &amp; GA4 script asynchronously without impacting Largest Contentful Paint (LCP).
              </p>
            </div>
          </div>
        </div>

        {/* 2. Site Metadata & Canonical Domain */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-emerald-600" />
            2. Canonical Domain & Default Metadata
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                Canonical Base URL *
              </label>
              <input
                type="url"
                required
                value={form.canonicalDomain}
                onChange={(e) => setForm({ ...form, canonicalDomain: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Used in dynamic sitemap.xml, robots.txt, and canonical meta links.
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 mb-1 block">
                Default Meta Robots Directive
              </label>
              <select
                value={form.robotsDefault}
                onChange={(e) => setForm({ ...form, robotsDefault: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold"
              >
                <option value="index, follow">index, follow (Allow search indexing)</option>
                <option value="noindex, follow">noindex, follow (Hide but crawl links)</option>
                <option value="noindex, nofollow">noindex, nofollow (Block completely)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 mb-1 block">Default Homepage Title</label>
            <input
              type="text"
              value={form.siteTitle}
              onChange={(e) => setForm({ ...form, siteTitle: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 mb-1 block">Default Meta Description</label>
            <textarea
              rows={2}
              value={form.metaDescription}
              onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 mb-1 block">Default Open Graph Share Image</label>
            <input
              type="text"
              value={form.defaultOgImage}
              onChange={(e) => setForm({ ...form, defaultOgImage: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono text-xs"
            />
          </div>
        </div>

        {/* 3. Schema.org RealEstateAgent Organization Details */}
        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
          <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-purple-600" />
            3. Schema.org Organization Structured Data
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Organization Name</label>
              <input
                type="text"
                value={form.organizationName}
                onChange={(e) => setForm({ ...form, organizationName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Support Phone</label>
              <input
                type="text"
                value={form.organizationPhone}
                onChange={(e) => setForm({ ...form, organizationPhone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 mb-1 block">Support Email</label>
              <input
                type="email"
                value={form.organizationEmail}
                onChange={(e) => setForm({ ...form, organizationEmail: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

