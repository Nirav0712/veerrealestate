'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Home,
  FileText,
  Menu,
  LayoutTemplate,
  Layers,
  Image as ImageIcon,
  Phone,
  Search,
  Settings,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Copy,
  Check,
  Upload,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  HelpCircle,
  MapPin,
  Building2,
  PhoneCall,
  Mail,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Edit3,
  X,
  Sliders,
  Navigation,
} from 'lucide-react';
import SeoSettingsForm from './SeoSettingsForm';

type ManagementSubTab =
  | 'homepage'
  | 'pages'
  | 'header'
  | 'footer'
  | 'sections'
  | 'media'
  | 'contact'
  | 'seo'
  | 'settings';

export default function WebsiteManagementTab({ initialSubTab }: { initialSubTab?: ManagementSubTab }) {
  const [activeSubTab, setActiveSubTab] = useState<ManagementSubTab>(initialSubTab || 'homepage');
  const [homepageSection, setHomepageSection] = useState<'hero' | 'about' | 'stats' | 'brand_promise' | 'core_values' | 'why_choose_us'>('hero');
  const [pageSection, setPageSection] = useState<'about_us' | 'contact_us' | 'builder_consultation'>('about_us');
  
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Content Store State for all sections
  const [contentStore, setContentStore] = useState<Record<string, any>>({});

  // Dynamic Branches State
  const [branches, setBranches] = useState<any[]>([]);
  const [branchesLoading, setBranchesLoading] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any | null>(null);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [savingBranch, setSavingBranch] = useState(false);

  // Media Library state
  const [mediaFiles, setMediaFiles] = useState<Array<{ name: string; url: string; size: number; updatedAt: string; extension: string; folder: string }>>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load all sections from server
  const loadAllContent = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const data = await res.json();
        // Unwrap content objects
        const unwrapped: Record<string, any> = {};
        for (const [k, v] of Object.entries(data)) {
          unwrapped[k] = (v as any).content || {};
        }
        setContentStore(unwrapped);
      } else {
        // Fallback to public API
        const fallbackRes = await fetch('/api/content');
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          const unwrapped: Record<string, any> = {};
          for (const [k, v] of Object.entries(fallbackData)) {
            unwrapped[k] = (v as any).content || {};
          }
          setContentStore(unwrapped);
        }
      }
    } catch (err: any) {
      console.error('Failed to load website content:', err);
      setFeedback({ type: 'error', message: 'Failed to load website content from database.' });
    } finally {
      setLoading(false);
    }
  };

  // Load media files
  const loadMedia = async () => {
    try {
      setMediaLoading(true);
      const res = await fetch('/api/admin/media');
      if (res.ok) {
        const data = await res.json();
        setMediaFiles(data.files || []);
      }
    } catch (err) {
      console.error('Error loading media:', err);
    } finally {
      setMediaLoading(false);
    }
  };

  // Load branches
  const loadBranches = async () => {
    try {
      setBranchesLoading(true);
      const res = await fetch('/api/admin/branches');
      if (res.ok) {
        const data = await res.json();
        setBranches(data.branches || []);
      }
    } catch (err) {
      console.error('Failed to load branches:', err);
    } finally {
      setBranchesLoading(false);
    }
  };

  useEffect(() => {
    loadAllContent();
    loadBranches();
  }, []);

  useEffect(() => {
    if (activeSubTab === 'media') {
      loadMedia();
    }
    if (activeSubTab === 'contact' || activeSubTab === 'footer') {
      loadBranches();
    }
  }, [activeSubTab]);

  const handleAddNewBranch = () => {
    setEditingBranch({
      id: '',
      name: '',
      displayTitle: '',
      address: '',
      city: 'Ahmedabad',
      state: 'Gujarat',
      postalCode: '380052',
      country: 'India',
      phones: [{ number: '', label: 'Office' }],
      email: 'horseveer@gmail.com',
      whatsapp: '919727027052',
      mapUrl: '',
      mapEmbedUrl: '',
      facebook: '',
      instagram: '',
      youtube: '',
      googleReview: '',
      linkedin: '',
      isActive: 1,
      displayOrder: branches.length + 1,
    });
    setIsBranchModalOpen(true);
  };

  const handleEditBranch = (b: any) => {
    setEditingBranch({
      ...b,
      phones: Array.isArray(b.phones) && b.phones.length > 0 ? b.phones : [{ number: '', label: 'Office' }],
      isActive: b.isActive ? 1 : 0,
    });
    setIsBranchModalOpen(true);
  };

  const handleSaveBranch = async () => {
    if (!editingBranch) return;
    if (!editingBranch.name || !editingBranch.name.trim()) {
      alert('Please enter a branch name.');
      return;
    }
    if (!editingBranch.address || !editingBranch.address.trim()) {
      alert('Please enter the branch address.');
      return;
    }

    try {
      setSavingBranch(true);
      const isNew = !editingBranch.id || !branches.some((b) => b.id === editingBranch.id);
      const endpoint = isNew ? '/api/admin/branches' : `/api/admin/branches/${editingBranch.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBranch),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save branch');
      }

      setFeedback({ type: 'success', message: `Branch "${editingBranch.name}" saved successfully!` });
      setTimeout(() => setFeedback(null), 3500);
      setIsBranchModalOpen(false);
      setEditingBranch(null);
      await loadBranches();
    } catch (err: any) {
      alert(err.message || 'Error saving branch');
    } finally {
      setSavingBranch(false);
    }
  };

  const handleDeleteBranch = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete branch "${name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/branches/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete');
      }
      setFeedback({ type: 'success', message: `Branch "${name}" deleted successfully.` });
      setTimeout(() => setFeedback(null), 3000);
      await loadBranches();
    } catch (err: any) {
      alert(err.message || 'Error deleting branch');
    }
  };

  const handleToggleBranchActive = async (b: any) => {
    try {
      const updatedActive = b.isActive ? 0 : 1;
      const res = await fetch(`/api/admin/branches/${b.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: updatedActive }),
      });
      if (res.ok) {
        setBranches((prev) =>
          prev.map((item) => (item.id === b.id ? { ...item, isActive: updatedActive } : item))
        );
      }
    } catch (err) {
      console.error('Error toggling branch status:', err);
    }
  };

  const handleMoveBranch = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= branches.length) return;

    const newBranches = [...branches];
    const temp = newBranches[index];
    newBranches[index] = newBranches[newIndex];
    newBranches[newIndex] = temp;

    setBranches(newBranches);

    try {
      const orderedIds = newBranches.map((b) => b.id);
      await fetch('/api/admin/branches/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
    } catch (err) {
      console.error('Error saving reorder:', err);
    }
  };

  // Save specific section to DB
  const saveSection = async (sectionKey: string, customData?: any) => {
    const dataToSave = customData !== undefined ? customData : contentStore[sectionKey];
    if (!dataToSave) return;

    try {
      setSavingKey(sectionKey);
      setFeedback(null);

      const res = await fetch(`/api/admin/content/${sectionKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: sectionKey.replace(/_/g, ' ').toUpperCase(),
          contentData: dataToSave,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to save');
      }

      setFeedback({ type: 'success', message: `Section "${sectionKey}" saved & published successfully!` });
      setTimeout(() => setFeedback(null), 4000);
    } catch (err: any) {
      console.error('Error saving section:', err);
      setFeedback({ type: 'error', message: err.message || 'Error saving changes' });
    } finally {
      setSavingKey(null);
    }
  };

  // Helper to update state
  const updateSectionField = (sectionKey: string, fieldPath: string[], value: any) => {
    setContentStore((prev) => {
      const section = { ...(prev[sectionKey] || {}) };
      let cursor = section;
      for (let i = 0; i < fieldPath.length - 1; i++) {
        const p = fieldPath[i];
        if (!cursor[p] || typeof cursor[p] !== 'object') {
          cursor[p] = {};
        } else {
          cursor[p] = Array.isArray(cursor[p]) ? [...cursor[p]] : { ...cursor[p] };
        }
        cursor = cursor[p];
      }
      cursor[fieldPath[fieldPath.length - 1]] = value;
      return { ...prev, [sectionKey]: section };
    });
  };

  // Handle direct file upload and auto-insert URL
  const handleFileUpload = async (file: File, onUploaded: (url: string) => void) => {
    try {
      setUploadingMedia(true);
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'image');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: fd,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Upload failed');
      }

      onUploaded(data.url);
      setFeedback({ type: 'success', message: 'Image uploaded successfully!' });
      setTimeout(() => setFeedback(null), 3000);
      if (activeSubTab === 'media') loadMedia();
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploadingMedia(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const deleteMedia = async (filename: string, folder: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${filename}"?`)) return;
    try {
      const res = await fetch(`/api/admin/media?filename=${encodeURIComponent(filename)}&folder=${folder}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Delete failed');
      setFeedback({ type: 'success', message: 'Media file removed.' });
      loadMedia();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Convenience getters for sections with default fallbacks
  const heroData = contentStore.homepage_hero || {};
  const aboutData = contentStore.homepage_about || {};
  const statsData = contentStore.homepage_promise_stats || {};
  const brandPromiseData = contentStore.homepage_brand_promise || {};
  const coreValuesData = contentStore.homepage_core_values || {};
  const whyChooseUsData = contentStore.homepage_why_choose_us || {};
  const visibilityData = contentStore.homepage_section_visibility || {};
  const headerData = contentStore.header_config || {};
  const footerData = contentStore.footer_config || {};
  const contactData = contentStore.company_info || contentStore.page_contact_us || {};
  const settingsData = contentStore.website_settings || {};
  const pageAboutData = contentStore.page_about_us || {};
  const pageContactData = contentStore.page_contact_us || {};
  const pageBuilderData = contentStore.page_builder_consultation || {};
  const contactFormSettings = contentStore.contact_form_settings || {};

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-xs">
        <RefreshCw className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-4" />
        <h3 className="text-base font-bold text-slate-800">Loading Centralized CMS...</h3>
        <p className="text-xs text-slate-500 mt-1">Connecting to database and fetching website configuration.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* CMS Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] tracking-wide uppercase">
              Super Admin CMS
            </span>
            <span className="text-xs text-slate-400">Database-Backed</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">Centralized Website Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage live website copy, hero slides, about section, promise cards, values, navigation, footer and settings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadAllContent}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-500' : ''}`} />
            <span>Reload Content</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>Live Website</span>
          </a>
        </div>
      </div>

      {/* Toast Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-semibold animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
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

      {/* 9 Main Sub-Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-2 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          {[
            { id: 'homepage', label: '1. Homepage Sections', icon: Home },
            { id: 'pages', label: '2. Website Pages', icon: FileText },
            { id: 'header', label: '3. Header & Nav', icon: Menu },
            { id: 'footer', label: '4. Footer', icon: LayoutTemplate },
            { id: 'sections', label: '5. Section Visibility', icon: Layers },
            { id: 'media', label: '6. Images & Media', icon: ImageIcon },
            { id: 'contact', label: '7. Contact & Social', icon: Phone },
            { id: 'seo', label: '8. Global SEO', icon: Search },
            { id: 'settings', label: '9. Website Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as ManagementSubTab)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          SUB-TAB 1: HOMEPAGE SECTIONS
          ======================================================== */}
      {activeSubTab === 'homepage' && (
        <div className="space-y-6">
          {/* Sub-section pill selector */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-100/70 p-1.5 rounded-xl border border-slate-200">
            {[
              { id: 'hero', label: 'Hero Banner' },
              { id: 'about', label: 'About Veer Real Estate' },
              { id: 'stats', label: 'Our Promise & Stats' },
              { id: 'brand_promise', label: 'BRAND PROMISE' },
              { id: 'core_values', label: 'Core Values' },
              { id: 'why_choose_us', label: 'Why Choose Us' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setHomepageSection(s.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  homepageSection === s.id
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* 1.1 HERO BANNER */}
          {homepageSection === 'hero' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Hero Section & Carousel</h3>
                  <p className="text-xs text-slate-500">Edit the top banner title, subtitle, description, and background slide images.</p>
                </div>
                <button
                  onClick={() => saveSection('homepage_hero')}
                  disabled={savingKey === 'homepage_hero'}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingKey === 'homepage_hero' ? 'Saving...' : 'Save Hero Banner'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Heading (supports \n for break)</label>
                  <textarea
                    rows={2}
                    value={heroData.title || ''}
                    onChange={(e) => updateSectionField('homepage_hero', ['title'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="Your Trusted Partner in Real Estate"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={heroData.subtitle || ''}
                    onChange={(e) => updateSectionField('homepage_hero', ['subtitle'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    placeholder="Find the Right Property. Make the Right Decision. Build Your Future."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hero Description Paragraph</label>
                <textarea
                  rows={3}
                  value={heroData.description || ''}
                  onChange={(e) => updateSectionField('homepage_hero', ['description'], e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  placeholder="Since 2012, Veer Real Estate has been helping homebuyers, property owners and investors..."
                />
              </div>

              {/* Slide Images */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-slate-700">Background Slides ({heroData.slides?.length || 0})</label>
                  <button
                    onClick={() => {
                      const slides = [...(heroData.slides || [])];
                      slides.push({
                        url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80',
                        alt: 'Ahmedabad Luxury Property',
                      });
                      updateSectionField('homepage_hero', ['slides'], slides);
                    }}
                    className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Slide</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(heroData.slides || []).map((slide: any, idx: number) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row items-center gap-3">
                      {/* Thumbnail */}
                      <div className="w-16 h-12 rounded-lg bg-slate-200 overflow-hidden shrink-0 relative border border-slate-300">
                        <img src={slide.url} alt={slide.alt || 'Slide'} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                        <input
                          type="text"
                          value={slide.url || ''}
                          onChange={(e) => {
                            const slides = [...heroData.slides];
                            slides[idx] = { ...slides[idx], url: e.target.value };
                            updateSectionField('homepage_hero', ['slides'], slides);
                          }}
                          placeholder="Image URL"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                        <input
                          type="text"
                          value={slide.alt || ''}
                          onChange={(e) => {
                            const slides = [...heroData.slides];
                            slides[idx] = { ...slides[idx], alt: e.target.value };
                            updateSectionField('homepage_hero', ['slides'], slides);
                          }}
                          placeholder="Alt description for SEO"
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        />
                      </div>

                      {/* Upload direct replacement */}
                      <label className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold cursor-pointer shrink-0 flex items-center gap-1">
                        <Upload className="w-3 h-3" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              handleFileUpload(f, (newUrl) => {
                                const slides = [...heroData.slides];
                                slides[idx] = { ...slides[idx], url: newUrl };
                                updateSectionField('homepage_hero', ['slides'], slides);
                              });
                            }
                          }}
                        />
                      </label>

                      <button
                        onClick={() => {
                          const slides = heroData.slides.filter((_: any, i: number) => i !== idx);
                          updateSectionField('homepage_hero', ['slides'], slides);
                        }}
                        className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Remove slide"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 1.2 ABOUT SECTION */}
          {homepageSection === 'about' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">About Veer Real Estate Section</h3>
                  <p className="text-xs text-slate-500">Edit heading, description, 4 bullet guarantees, founder photo, and CTA button.</p>
                </div>
                <button
                  onClick={() => saveSection('homepage_about')}
                  disabled={savingKey === 'homepage_about'}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingKey === 'homepage_about' ? 'Saving...' : 'Save About Section'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Top Badge Text</label>
                  <input
                    type="text"
                    value={aboutData.category || ''}
                    onChange={(e) => updateSectionField('homepage_about', ['category'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="About Veer Real Estate"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Heading</label>
                  <input
                    type="text"
                    value={aboutData.title || ''}
                    onChange={(e) => updateSectionField('homepage_about', ['title'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="Trusted Real Estate Broker in Ahmedabad"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={aboutData.tagline || ''}
                    onChange={(e) => updateSectionField('homepage_about', ['tagline'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="More Than Property. We Build Trust."
                  />
                </div>
              </div>

              {/* Paragraphs */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">Body Paragraphs (3 blocks)</label>
                {(aboutData.paragraphs || []).map((p: string, idx: number) => (
                  <textarea
                    key={idx}
                    rows={2}
                    value={p}
                    onChange={(e) => {
                      const pars = [...(aboutData.paragraphs || [])];
                      pars[idx] = e.target.value;
                      updateSectionField('homepage_about', ['paragraphs'], pars);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder={`Paragraph ${idx + 1}`}
                  />
                ))}
              </div>

              {/* 4 Bullets */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Bullet Guarantees (4 points)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(aboutData.bullets || []).map((b: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                      <input
                        type="text"
                        value={b}
                        onChange={(e) => {
                          const bullets = [...(aboutData.bullets || [])];
                          bullets[idx] = e.target.value;
                          updateSectionField('homepage_about', ['bullets'], bullets);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Founder Image & Logo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Founder Photo (Sudhir Prajapati)</span>
                    <label className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-[11px] font-semibold cursor-pointer flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            handleFileUpload(f, (newUrl) => updateSectionField('homepage_about', ['founderImage'], newUrl));
                          }
                        }}
                      />
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={aboutData.founderImage || '/images/team/sudhir.jpeg'}
                      alt="Founder"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-300"
                    />
                    <input
                      type="text"
                      value={aboutData.founderImage || ''}
                      onChange={(e) => updateSectionField('homepage_about', ['founderImage'], e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      placeholder="Founder Photo URL"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">CTA Button & Happy Customers</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">Button Label</label>
                      <input
                        type="text"
                        value={aboutData.buttonText || ''}
                        onChange={(e) => updateSectionField('homepage_about', ['buttonText'], e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        placeholder="More About Us"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-500 mb-0.5">Button URL</label>
                      <input
                        type="text"
                        value={aboutData.buttonUrl || ''}
                        onChange={(e) => updateSectionField('homepage_about', ['buttonUrl'], e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                        placeholder="/about-us"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1.3 OUR PROMISE & STATS */}
          {homepageSection === 'stats' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Our Promise & Statistics Section</h3>
                  <p className="text-xs text-slate-500">Edit the 4 circular counters (98%, 5K+, 100+, 15+) and the investing guide text.</p>
                </div>
                <button
                  onClick={() => saveSection('homepage_promise_stats')}
                  disabled={savingKey === 'homepage_promise_stats'}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingKey === 'homepage_promise_stats' ? 'Saving...' : 'Save Promise & Stats'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={statsData.title || ''}
                    onChange={(e) => updateSectionField('homepage_promise_stats', ['title'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="Our Promise"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={statsData.subtitle || ''}
                    onChange={(e) => updateSectionField('homepage_promise_stats', ['subtitle'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="Right Property. Right Guidance. Right Decision."
                  />
                </div>
              </div>

              {/* 4 Stat Circles */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">4 Circular Statistic Counters</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {(statsData.stats || []).map((s: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center space-y-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Counter #{idx + 1}</span>
                      <input
                        type="text"
                        value={s.value || ''}
                        onChange={(e) => {
                          const stats = [...(statsData.stats || [])];
                          stats[idx] = { ...stats[idx], value: e.target.value };
                          updateSectionField('homepage_promise_stats', ['stats'], stats);
                        }}
                        className="w-full px-2 py-1.5 text-center font-bold text-slate-900 rounded-lg border border-slate-200 text-sm bg-white"
                        placeholder="e.g. 98%"
                      />
                      <input
                        type="text"
                        value={s.label || ''}
                        onChange={(e) => {
                          const stats = [...(statsData.stats || [])];
                          stats[idx] = { ...stats[idx], label: e.target.value };
                          updateSectionField('homepage_promise_stats', ['stats'], stats);
                        }}
                        className="w-full px-2 py-1 text-center text-slate-600 rounded-lg border border-slate-200 text-xs bg-white"
                        placeholder="Label"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Investing Copy */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <label className="block text-xs font-bold text-slate-700">Smart Real Estate Investing Section</label>
                <input
                  type="text"
                  value={statsData.investingTitle || ''}
                  onChange={(e) => updateSectionField('homepage_promise_stats', ['investingTitle'], e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                  placeholder="Smart Real Estate Investing Starts Here"
                />

                {(statsData.investingParagraphs || []).map((ip: string, idx: number) => (
                  <textarea
                    key={idx}
                    rows={2}
                    value={ip}
                    onChange={(e) => {
                      const pars = [...(statsData.investingParagraphs || [])];
                      pars[idx] = e.target.value;
                      updateSectionField('homepage_promise_stats', ['investingParagraphs'], pars);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder={`Investing paragraph ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 1.4 BRAND PROMISE */}
          {homepageSection === 'brand_promise' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">BRAND PROMISE Section</h3>
                  <p className="text-xs text-slate-500">Edit the two cards: "Our (Mission)" and "Our Core Purpose".</p>
                </div>
                <button
                  onClick={() => saveSection('homepage_brand_promise')}
                  disabled={savingKey === 'homepage_brand_promise'}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingKey === 'homepage_brand_promise' ? 'Saving...' : 'Save Brand Promise'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={brandPromiseData.title || ''}
                    onChange={(e) => updateSectionField('homepage_brand_promise', ['title'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="BRAND PROMISE"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={brandPromiseData.subtitle || ''}
                    onChange={(e) => updateSectionField('homepage_brand_promise', ['subtitle'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="Turning Property Dreams into Reality Since 2012"
                  />
                </div>
              </div>

              {/* Card 1: Mission */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <span className="text-xs font-bold text-amber-700 uppercase">Card 1: Our Mission</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={brandPromiseData.mission?.title || ''}
                    onChange={(e) => updateSectionField('homepage_brand_promise', ['mission', 'title'], e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    placeholder="Card Title (e.g. Our (Mission))"
                  />
                  <input
                    type="text"
                    value={brandPromiseData.mission?.intro || ''}
                    onChange={(e) => updateSectionField('homepage_brand_promise', ['mission', 'intro'], e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    placeholder="Intro Line"
                  />
                </div>
                <input
                  type="text"
                  value={brandPromiseData.mission?.highlights || ''}
                  onChange={(e) => updateSectionField('homepage_brand_promise', ['mission', 'highlights'], e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  placeholder="Highlights (e.g. Honest Advice • Verified Property Solutions...)"
                />
                <textarea
                  rows={3}
                  value={brandPromiseData.mission?.body || ''}
                  onChange={(e) => updateSectionField('homepage_brand_promise', ['mission', 'body'], e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  placeholder="Mission Body Description"
                />
              </div>

              {/* Card 2: Core Purpose */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <span className="text-xs font-bold text-amber-700 uppercase">Card 2: Our Core Purpose</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={brandPromiseData.corePurpose?.title || ''}
                    onChange={(e) => updateSectionField('homepage_brand_promise', ['corePurpose', 'title'], e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    placeholder="Card Title (e.g. Our Core Purpose)"
                  />
                  <input
                    type="text"
                    value={brandPromiseData.corePurpose?.intro || ''}
                    onChange={(e) => updateSectionField('homepage_brand_promise', ['corePurpose', 'intro'], e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    placeholder="Intro Line"
                  />
                </div>
                <textarea
                  rows={2}
                  value={brandPromiseData.corePurpose?.bodyParagraph1 || ''}
                  onChange={(e) => updateSectionField('homepage_brand_promise', ['corePurpose', 'bodyParagraph1'], e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  placeholder="Purpose Paragraph 1"
                />
                <textarea
                  rows={2}
                  value={brandPromiseData.corePurpose?.bodyParagraph2 || ''}
                  onChange={(e) => updateSectionField('homepage_brand_promise', ['corePurpose', 'bodyParagraph2'], e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  placeholder="Purpose Paragraph 2"
                />
              </div>
            </div>
          )}

          {/* 1.5 CORE VALUES */}
          {homepageSection === 'core_values' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Core Values Section</h3>
                  <p className="text-xs text-slate-500">Edit the 5 cards: Integrity, Resourceful, Transparency, Service Excellence, Knowledge.</p>
                </div>
                <button
                  onClick={() => saveSection('homepage_core_values')}
                  disabled={savingKey === 'homepage_core_values'}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingKey === 'homepage_core_values' ? 'Saving...' : 'Save Core Values'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={coreValuesData.title || ''}
                    onChange={(e) => updateSectionField('homepage_core_values', ['title'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="Core Values"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={coreValuesData.subtitle || ''}
                    onChange={(e) => updateSectionField('homepage_core_values', ['subtitle'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="Driven by Values. Focused on Your Future."
                  />
                </div>
              </div>

              {/* 5 Value Cards */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700">5 Value Cards</label>
                {(coreValuesData.values || []).map((val: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Value #{idx + 1}</span>
                      <span className="text-[11px] text-slate-400">Icon: {val.icon}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={val.title || ''}
                        onChange={(e) => {
                          const values = [...(coreValuesData.values || [])];
                          values[idx] = { ...values[idx], title: e.target.value };
                          updateSectionField('homepage_core_values', ['values'], values);
                        }}
                        className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white font-bold"
                        placeholder="Value Title (e.g. Integrity)"
                      />
                      <input
                        type="text"
                        value={val.icon || ''}
                        onChange={(e) => {
                          const values = [...(coreValuesData.values || [])];
                          values[idx] = { ...values[idx], icon: e.target.value };
                          updateSectionField('homepage_core_values', ['values'], values);
                        }}
                        className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                        placeholder="FontAwesome Icon Class"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={val.description || ''}
                      onChange={(e) => {
                        const values = [...(coreValuesData.values || [])];
                        values[idx] = { ...values[idx], description: e.target.value };
                        updateSectionField('homepage_core_values', ['values'], values);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white"
                      placeholder="Value Description"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 1.6 WHY CHOOSE US */}
          {homepageSection === 'why_choose_us' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Why Choose Veer Real Estate</h3>
                  <p className="text-xs text-slate-500">Edit the 4 benefit cards (Verified Listings, Best Prices, Expert Guidance, Legal Support).</p>
                </div>
                <button
                  onClick={() => saveSection('homepage_why_choose_us')}
                  disabled={savingKey === 'homepage_why_choose_us'}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingKey === 'homepage_why_choose_us' ? 'Saving...' : 'Save Why Choose Us'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={whyChooseUsData.title || ''}
                    onChange={(e) => updateSectionField('homepage_why_choose_us', ['title'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="Why Choose Veer Real Estate?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section Subtitle</label>
                  <input
                    type="text"
                    value={whyChooseUsData.subtitle || ''}
                    onChange={(e) => updateSectionField('homepage_why_choose_us', ['subtitle'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    placeholder="Your Property Journey, Simplified."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(whyChooseUsData.items || []).map((item: any, idx: number) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => {
                        const items = [...(whyChooseUsData.items || [])];
                        items[idx] = { ...items[idx], title: e.target.value };
                        updateSectionField('homepage_why_choose_us', ['items'], items);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-bold"
                      placeholder="Benefit Title"
                    />
                    <textarea
                      rows={2}
                      value={item.desc || ''}
                      onChange={(e) => {
                        const items = [...(whyChooseUsData.items || [])];
                        items[idx] = { ...items[idx], desc: e.target.value };
                        updateSectionField('homepage_why_choose_us', ['items'], items);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-TAB 2: WEBSITE PAGES
          ======================================================== */}
      {activeSubTab === 'pages' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 bg-slate-100/70 p-1.5 rounded-xl border border-slate-200">
            {[
              { id: 'about_us', label: 'About Us Page' },
              { id: 'contact_us', label: 'Contact Us Page' },
              { id: 'builder_consultation', label: 'Builder Consultation Page' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setPageSection(p.id as any)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  pageSection === p.id
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          {pageSection === 'about_us' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">About Us Page (/about-us)</h3>
                  <p className="text-xs text-slate-500">Manage headline, founder spotlight and story.</p>
                </div>
                <button
                  onClick={() => saveSection('page_about_us')}
                  disabled={savingKey === 'page_about_us'}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingKey === 'page_about_us' ? 'Saving...' : 'Save About Page'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hero Title</label>
                  <input
                    type="text"
                    value={pageAboutData.heroTitle || ''}
                    onChange={(e) => updateSectionField('page_about_us', ['heroTitle'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={pageAboutData.heroSubtitle || ''}
                    onChange={(e) => updateSectionField('page_about_us', ['heroSubtitle'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <span className="text-xs font-bold text-slate-800">Founder Spotlight</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={pageAboutData.founderName || ''}
                    onChange={(e) => updateSectionField('page_about_us', ['founderName'], e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    placeholder="Founder Name"
                  />
                  <input
                    type="text"
                    value={pageAboutData.founderImage || ''}
                    onChange={(e) => updateSectionField('page_about_us', ['founderImage'], e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                    placeholder="Photo URL"
                  />
                </div>
                <textarea
                  rows={2}
                  value={pageAboutData.founderParagraph1 || ''}
                  onChange={(e) => updateSectionField('page_about_us', ['founderParagraph1'], e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  placeholder="Founder bio paragraph 1"
                />
                <textarea
                  rows={2}
                  value={pageAboutData.founderParagraph2 || ''}
                  onChange={(e) => updateSectionField('page_about_us', ['founderParagraph2'], e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  placeholder="Founder bio paragraph 2"
                />
              </div>
            </div>
          )}

          {pageSection === 'contact_us' && (
            <div className="space-y-6">
              {/* Branch Management Callout */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Dynamic Multi-Branch Office Addresses</h4>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      Branch offices, phone numbers with labels, WhatsApp, and Google Maps are unified under <strong>Branch Management</strong> and dynamically update both the Contact page and Footer.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveSubTab('contact')}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs flex items-center gap-1.5"
                >
                  <span>Go to Branch Management</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Contact Form Settings */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Contact Inquiry Form Settings</h3>
                    <p className="text-xs text-slate-500">
                      Configure form headline, subject dropdown options, optional marketing consent text, and success notifications.
                    </p>
                  </div>
                  <button
                    onClick={() => saveSection('contact_form_settings')}
                    disabled={savingKey === 'contact_form_settings'}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingKey === 'contact_form_settings' ? 'Saving...' : 'Save Form Settings'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Form Heading</label>
                    <input
                      type="text"
                      value={contactFormSettings.title || 'Send Message'}
                      onChange={(e) => updateSectionField('contact_form_settings', ['title'], e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Submit Button Label</label>
                    <input
                      type="text"
                      value={contactFormSettings.submitButtonText || 'Send via WhatsApp'}
                      onChange={(e) => updateSectionField('contact_form_settings', ['submitButtonText'], e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Inquiry Notification Email</label>
                    <input
                      type="email"
                      value={contactFormSettings.notificationEmail || 'horseveer@gmail.com'}
                      onChange={(e) => updateSectionField('contact_form_settings', ['notificationEmail'], e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Hero Subtitle</label>
                  <input
                    type="text"
                    value={contactFormSettings.subtitle || "Have questions? We're here to help you find your dream property"}
                    onChange={(e) => updateSectionField('contact_form_settings', ['subtitle'], e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                {/* Subject Dropdown Options Manager */}
                <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Dynamic Subject Dropdown Options</h4>
                      <p className="text-[11px] text-slate-500">Inquiry categories users can choose from when submitting the contact form.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const subjects = Array.isArray(contactFormSettings.subjects) ? [...contactFormSettings.subjects] : [];
                        subjects.push({ id: 'sub_' + Date.now().toString(36), label: 'New Subject' });
                        updateSectionField('contact_form_settings', ['subjects'], subjects);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Subject</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {(contactFormSettings.subjects || [
                      { id: 'buy', label: 'Buying' },
                      { id: 'sell', label: 'Selling' },
                      { id: 'rent', label: 'Renting' },
                      { id: 'invest', label: 'Investment Consultation' },
                      { id: 'builder', label: 'Builder Consultation' },
                      { id: 'general', label: 'General Inquiry' },
                    ]).map((sub: any, sIdx: number) => (
                      <div key={sub.id || sIdx} className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-white">
                        <input
                          type="text"
                          value={sub.label || ''}
                          onChange={(e) => {
                            const subjects = [...(contactFormSettings.subjects || [])];
                            subjects[sIdx] = { ...subjects[sIdx], label: e.target.value };
                            updateSectionField('contact_form_settings', ['subjects'], subjects);
                          }}
                          className="flex-1 px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-medium"
                          placeholder="Subject label"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const subjects = contactFormSettings.subjects.filter((_: any, i: number) => i !== sIdx);
                            updateSectionField('contact_form_settings', ['subjects'], subjects);
                          }}
                          className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                          title="Delete Subject"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Marketing Consent & Success Message */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 border border-slate-200/80 rounded-xl p-4 bg-slate-50/50">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={contactFormSettings.showMarketingConsent !== false}
                        onChange={(e) =>
                          updateSectionField('contact_form_settings', ['showMarketingConsent'], e.target.checked)
                        }
                        className="rounded accent-amber-500 h-4 w-4"
                      />
                      <span>Show Optional Marketing Consent Checkbox</span>
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Unselected by default as per compliance regulations.
                    </p>
                    <textarea
                      rows={2}
                      value={
                        contactFormSettings.marketingConsentText ||
                        'I would like to receive communication via SMS, RCS SMS, Email & WhatsApp services for offers, updates & transactions.'
                      }
                      onChange={(e) =>
                        updateSectionField('contact_form_settings', ['marketingConsentText'], e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      placeholder="Consent text displayed beside checkbox"
                    />
                  </div>

                  <div className="space-y-2 border border-slate-200/80 rounded-xl p-4 bg-slate-50/50">
                    <label className="block text-xs font-bold text-slate-800">Submission Success Message</label>
                    <p className="text-[11px] text-slate-500">
                      Shown to the user once the inquiry is successfully saved in the CRM.
                    </p>
                    <textarea
                      rows={3}
                      value={
                        contactFormSettings.successMessage ||
                        'Thank you! Your message has been sent. Our property consultant will contact you shortly.'
                      }
                      onChange={(e) =>
                        updateSectionField('contact_form_settings', ['successMessage'], e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                      placeholder="Confirmation message"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {pageSection === 'builder_consultation' && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Builder Consultation (/builder-consultation)</h3>
                  <p className="text-xs text-slate-500">Marketing & sales advisory landing page content for real estate builders.</p>
                </div>
                <button
                  onClick={() => saveSection('page_builder_consultation')}
                  disabled={savingKey === 'page_builder_consultation'}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingKey === 'page_builder_consultation' ? 'Saving...' : 'Save Builder Page'}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Page Title</label>
                <input
                  type="text"
                  value={pageBuilderData.title || ''}
                  onChange={(e) => updateSectionField('page_builder_consultation', ['title'], e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                <textarea
                  rows={2}
                  value={pageBuilderData.subtitle || ''}
                  onChange={(e) => updateSectionField('page_builder_consultation', ['subtitle'], e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Text</label>
                <input
                  type="text"
                  value={pageBuilderData.ctaText || ''}
                  onChange={(e) => updateSectionField('page_builder_consultation', ['ctaText'], e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-TAB 3: HEADER & NAVIGATION
          ======================================================== */}
      {activeSubTab === 'header' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Header & Navigation Menu</h3>
              <p className="text-xs text-slate-500">Configure site logo, direct contact number, CTA button and navigation items.</p>
            </div>
            <button
              onClick={() => saveSection('header_config')}
              disabled={savingKey === 'header_config'}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingKey === 'header_config' ? 'Saving...' : 'Save Header'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Logo URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={headerData.logoUrl || ''}
                  onChange={(e) => updateSectionField('header_config', ['logoUrl'], e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <label className="p-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 cursor-pointer shrink-0">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleFileUpload(f, (u) => updateSectionField('header_config', ['logoUrl'], u));
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Header Phone Number</label>
              <input
                type="text"
                value={headerData.phone || ''}
                onChange={(e) => updateSectionField('header_config', ['phone'], e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">CTA Button Text & Link</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={headerData.ctaText || ''}
                  onChange={(e) => updateSectionField('header_config', ['ctaText'], e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  placeholder="Button Text"
                />
                <input
                  type="text"
                  value={headerData.ctaUrl || ''}
                  onChange={(e) => updateSectionField('header_config', ['ctaUrl'], e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  placeholder="URL"
                />
              </div>
            </div>
          </div>

          {/* Nav Links */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs font-bold text-slate-700">Main Menu Links</label>
              <button
                onClick={() => {
                  const links = [...(headerData.navLinks || [])];
                  links.push({ label: 'New Link', url: '/' });
                  updateSectionField('header_config', ['navLinks'], links);
                }}
                className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Menu Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {(headerData.navLinks || []).map((link: any, idx: number) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-xs font-bold text-slate-400 w-6 text-center">{idx + 1}</span>
                  <input
                    type="text"
                    value={link.label || ''}
                    onChange={(e) => {
                      const links = [...headerData.navLinks];
                      links[idx] = { ...links[idx], label: e.target.value };
                      updateSectionField('header_config', ['navLinks'], links);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-bold"
                    placeholder="Link Label"
                  />
                  <input
                    type="text"
                    value={link.url || ''}
                    onChange={(e) => {
                      const links = [...headerData.navLinks];
                      links[idx] = { ...links[idx], url: e.target.value };
                      updateSectionField('header_config', ['navLinks'], links);
                    }}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                    placeholder="Destination Path (/about-us)"
                  />
                  <button
                    onClick={() => {
                      const links = headerData.navLinks.filter((_: any, i: number) => i !== idx);
                      updateSectionField('header_config', ['navLinks'], links);
                    }}
                    className="p-1.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 4: FOOTER
          ======================================================== */}
      {activeSubTab === 'footer' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Footer Management</h3>
                <p className="text-xs text-slate-500">
                  Manage company branding, Quick Links, Property Types, Builder Consultation banner, and copyright disclaimers.
                </p>
              </div>
              <button
                onClick={() => saveSection('footer_config')}
                disabled={savingKey === 'footer_config'}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingKey === 'footer_config' ? 'Saving...' : 'Save Footer'}</span>
              </button>
            </div>

            {/* 1. Company Section */}
            <div className="border border-slate-200/70 rounded-xl p-4 bg-slate-50/50 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Company Branding in Footer</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={footerData.companyName || 'Veer Real Estate'}
                    onChange={(e) => updateSectionField('footer_config', ['companyName'], e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={footerData.tagline || 'Your Trusted Partner in Real Estate'}
                    onChange={(e) => updateSectionField('footer_config', ['tagline'], e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Footer Logo URL</label>
                  <input
                    type="text"
                    value={footerData.logoUrl || '/images/veer-logo-old.png'}
                    onChange={(e) => updateSectionField('footer_config', ['logoUrl'], e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Description</label>
                <textarea
                  rows={2}
                  value={footerData.description || ''}
                  onChange={(e) => updateSectionField('footer_config', ['description'], e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  placeholder="Short description displayed below the logo in the footer."
                />
              </div>
            </div>

            {/* 2. Quick Links Manager */}
            <div className="border border-slate-200/70 rounded-xl p-4 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <LinkIcon className="w-3.5 h-3.5 text-amber-600" />
                    <span>Column 2: Quick Links</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">Add, edit, reorder or toggle links in the Quick Links column.</p>
                </div>
                <button
                  onClick={() => {
                    const links = Array.isArray(footerData.quickLinks) ? [...footerData.quickLinks] : [];
                    links.push({
                      id: 'ql_' + Date.now().toString(36),
                      label: 'New Link',
                      url: '/',
                      is_active: true,
                      is_new: false,
                      order: links.length + 1,
                    });
                    updateSectionField('footer_config', ['quickLinks'], links);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Quick Link</span>
                </button>
              </div>

              <div className="space-y-2">
                {(footerData.quickLinks || []).map((ql: any, idx: number) => (
                  <div
                    key={ql.id || idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <span className="text-xs font-bold text-slate-400 w-5 text-center">{idx + 1}</span>
                    <input
                      type="text"
                      value={ql.label || ''}
                      onChange={(e) => {
                        const links = [...footerData.quickLinks];
                        links[idx] = { ...links[idx], label: e.target.value };
                        updateSectionField('footer_config', ['quickLinks'], links);
                      }}
                      placeholder="Label"
                      className="w-40 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium"
                    />
                    <input
                      type="text"
                      value={ql.url || ''}
                      onChange={(e) => {
                        const links = [...footerData.quickLinks];
                        links[idx] = { ...links[idx], url: e.target.value };
                        updateSectionField('footer_config', ['quickLinks'], links);
                      }}
                      placeholder="Destination Path (/about-us)"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold px-2 py-1 rounded bg-amber-50 border border-amber-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(ql.is_new)}
                        onChange={(e) => {
                          const links = [...footerData.quickLinks];
                          links[idx] = { ...links[idx], is_new: e.target.checked };
                          updateSectionField('footer_config', ['quickLinks'], links);
                        }}
                        className="rounded accent-amber-500"
                      />
                      <span>"New" Badge</span>
                    </label>
                    <button
                      onClick={() => {
                        const links = [...footerData.quickLinks];
                        links[idx] = { ...links[idx], is_active: ql.is_active === false ? true : false };
                        updateSectionField('footer_config', ['quickLinks'], links);
                      }}
                      title={ql.is_active === false ? 'Hidden' : 'Visible'}
                      className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                        ql.is_active === false
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}
                    >
                      {ql.is_active === false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        if (idx === 0) return;
                        const links = [...footerData.quickLinks];
                        const t = links[idx];
                        links[idx] = links[idx - 1];
                        links[idx - 1] = t;
                        updateSectionField('footer_config', ['quickLinks'], links);
                      }}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (idx === footerData.quickLinks.length - 1) return;
                        const links = [...footerData.quickLinks];
                        const t = links[idx];
                        links[idx] = links[idx + 1];
                        links[idx + 1] = t;
                        updateSectionField('footer_config', ['quickLinks'], links);
                      }}
                      disabled={idx === footerData.quickLinks.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (!confirm(`Remove quick link "${ql.label}"?`)) return;
                        const links = footerData.quickLinks.filter((_: any, i: number) => i !== idx);
                        updateSectionField('footer_config', ['quickLinks'], links);
                      }}
                      className="p-1.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                      title="Delete Link"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Property Types Manager */}
            <div className="border border-slate-200/70 rounded-xl p-4 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-amber-600" />
                    <span>Column 3: Property Types</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">Manage property category links displayed in the footer.</p>
                </div>
                <button
                  onClick={() => {
                    const pts = Array.isArray(footerData.propertyTypes) ? [...footerData.propertyTypes] : [];
                    pts.push({
                      id: 'pt_' + Date.now().toString(36),
                      label: 'New Property Type',
                      url: '/properties?type=',
                      is_active: true,
                      order: pts.length + 1,
                    });
                    updateSectionField('footer_config', ['propertyTypes'], pts);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Property Type</span>
                </button>
              </div>

              <div className="space-y-2">
                {(footerData.propertyTypes || []).map((pt: any, idx: number) => (
                  <div
                    key={pt.id || idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <span className="text-xs font-bold text-slate-400 w-5 text-center">{idx + 1}</span>
                    <input
                      type="text"
                      value={pt.label || ''}
                      onChange={(e) => {
                        const pts = [...footerData.propertyTypes];
                        pts[idx] = { ...pts[idx], label: e.target.value };
                        updateSectionField('footer_config', ['propertyTypes'], pts);
                      }}
                      placeholder="Label"
                      className="w-44 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium"
                    />
                    <input
                      type="text"
                      value={pt.url || ''}
                      onChange={(e) => {
                        const pts = [...footerData.propertyTypes];
                        pts[idx] = { ...pts[idx], url: e.target.value };
                        updateSectionField('footer_config', ['propertyTypes'], pts);
                      }}
                      placeholder="URL (/properties?type=Apartment)"
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    />
                    <button
                      onClick={() => {
                        const pts = [...footerData.propertyTypes];
                        pts[idx] = { ...pts[idx], is_active: pt.is_active === false ? true : false };
                        updateSectionField('footer_config', ['propertyTypes'], pts);
                      }}
                      title={pt.is_active === false ? 'Hidden' : 'Visible'}
                      className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                        pt.is_active === false
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      }`}
                    >
                      {pt.is_active === false ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => {
                        if (idx === 0) return;
                        const pts = [...footerData.propertyTypes];
                        const t = pts[idx];
                        pts[idx] = pts[idx - 1];
                        pts[idx - 1] = t;
                        updateSectionField('footer_config', ['propertyTypes'], pts);
                      }}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (idx === footerData.propertyTypes.length - 1) return;
                        const pts = [...footerData.propertyTypes];
                        const t = pts[idx];
                        pts[idx] = pts[idx + 1];
                        pts[idx + 1] = t;
                        updateSectionField('footer_config', ['propertyTypes'], pts);
                      }}
                      disabled={idx === footerData.propertyTypes.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (!confirm(`Remove property type "${pt.label}"?`)) return;
                        const pts = footerData.propertyTypes.filter((_: any, i: number) => i !== idx);
                        updateSectionField('footer_config', ['propertyTypes'], pts);
                      }}
                      className="p-1.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Column 4: Dynamic Active Branches Preview */}
            <div className="border border-slate-200/70 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Column 4: Active Branches in Footer</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    These branch cards are generated dynamically from active records in Branch Management (Sub-tab 7).
                  </p>
                </div>
                <button
                  onClick={() => setActiveSubTab('contact')}
                  className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>Manage Branches →</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {branches.filter((b) => b.isActive).map((b) => (
                  <div key={b.id} className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{b.displayTitle || b.name}</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-semibold">
                        Active
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{b.address}</p>
                    <div className="flex flex-wrap gap-1 text-[10px] text-slate-600">
                      {Array.isArray(b.phones) &&
                        b.phones.map((p: any, i: number) => (
                          <span key={i} className="bg-slate-100 px-1.5 py-0.5 rounded">
                            {typeof p === 'string' ? p : p.number}
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Builder Consultation Special Banner Editor */}
            <div className="border border-slate-200/70 rounded-xl p-4 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Builder Consultation Special Banner</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">Gold-accented banner above the footer bottom line.</p>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerData.builderBanner?.enabled !== false}
                    onChange={(e) =>
                      updateSectionField('footer_config', ['builderBanner', 'enabled'], e.target.checked)
                    }
                    className="rounded accent-amber-500"
                  />
                  <span>Banner Enabled</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Banner Title</label>
                  <input
                    type="text"
                    value={footerData.builderBanner?.title || ''}
                    onChange={(e) =>
                      updateSectionField('footer_config', ['builderBanner', 'title'], e.target.value)
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge Text</label>
                  <input
                    type="text"
                    value={footerData.builderBanner?.badgeText || ''}
                    onChange={(e) =>
                      updateSectionField('footer_config', ['builderBanner', 'badgeText'], e.target.value)
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Banner Subtitle</label>
                <textarea
                  rows={2}
                  value={footerData.builderBanner?.subtitle || ''}
                  onChange={(e) =>
                    updateSectionField('footer_config', ['builderBanner', 'subtitle'], e.target.value)
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Consultant Name</label>
                  <input
                    type="text"
                    value={footerData.builderBanner?.consultantName || ''}
                    onChange={(e) =>
                      updateSectionField('footer_config', ['builderBanner', 'consultantName'], e.target.value)
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={footerData.builderBanner?.buttonText || ''}
                    onChange={(e) =>
                      updateSectionField('footer_config', ['builderBanner', 'buttonText'], e.target.value)
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Button URL</label>
                  <input
                    type="text"
                    value={footerData.builderBanner?.buttonUrl || ''}
                    onChange={(e) =>
                      updateSectionField('footer_config', ['builderBanner', 'buttonUrl'], e.target.value)
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>
            </div>

            {/* 6. Legal, Copyright & RERA Disclaimer */}
            <div className="border border-slate-200/70 rounded-xl p-4 bg-slate-50/50 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-amber-600" />
                <span>Copyright & RERA Disclaimer</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Copyright Notice</label>
                  <input
                    type="text"
                    value={footerData.copyright || ''}
                    onChange={(e) => updateSectionField('footer_config', ['copyright'], e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Builder Link Text</label>
                  <input
                    type="text"
                    value={footerData.builderLinkText || ''}
                    onChange={(e) => updateSectionField('footer_config', ['builderLinkText'], e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">RERA Disclaimer</label>
                <textarea
                  rows={2}
                  value={footerData.reraDisclaimer || ''}
                  onChange={(e) => updateSectionField('footer_config', ['reraDisclaimer'], e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 5: SECTION VISIBILITY
          ======================================================== */}
      {activeSubTab === 'sections' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Homepage Section Visibility</h3>
              <p className="text-xs text-slate-500">Enable or disable specific sections on the public homepage with a single toggle.</p>
            </div>
            <button
              onClick={() => saveSection('homepage_section_visibility')}
              disabled={savingKey === 'homepage_section_visibility'}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingKey === 'homepage_section_visibility' ? 'Saving...' : 'Save Visibility Toggles'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { key: 'hero', name: 'Hero Banner & Search' },
              { key: 'partners', name: 'Partner Developers Logo Bar' },
              { key: 'about', name: 'About Veer Real Estate' },
              { key: 'stats', name: 'Our Promise & Statistics' },
              { key: 'featured_properties', name: 'Featured Properties Grid' },
              { key: 'projects_in_motion', name: 'Projects in Motion (Video Slider)' },
              { key: 'brand_promise', name: 'BRAND PROMISE Cards' },
              { key: 'luxury_projects', name: 'Exclusive Luxury Projects Slider' },
              { key: 'core_values', name: 'Core Values Cards' },
              { key: 'why_choose_us', name: 'Why Choose Veer Real Estate' },
              { key: 'google_reviews', name: 'Google Reviews & Testimonials' },
            ].map((sec) => {
              const isVisible = visibilityData[sec.key] !== false;
              return (
                <div
                  key={sec.key}
                  onClick={() => updateSectionField('homepage_section_visibility', [sec.key], !isVisible)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isVisible
                      ? 'border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 opacity-60'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{sec.name}</h4>
                    <span className={`text-[11px] font-semibold ${isVisible ? 'text-emerald-700' : 'text-slate-500'}`}>
                      {isVisible ? 'Active & Visible' : 'Hidden from public'}
                    </span>
                  </div>

                  <div className={`p-2 rounded-lg ${isVisible ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-500'}`}>
                    {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 6: IMAGES & MEDIA LIBRARY
          ======================================================== */}
      {activeSubTab === 'media' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Images & Media Library</h3>
              <p className="text-xs text-slate-500">Upload new property assets, browse existing website photos and copy public URLs.</p>
            </div>

            <div className="flex items-center gap-2">
              <label className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploadingMedia ? 'Uploading...' : 'Upload New Asset'}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f, () => loadMedia());
                  }}
                />
              </label>

              <button
                onClick={loadMedia}
                disabled={mediaLoading}
                className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
                title="Refresh Library"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${mediaLoading ? 'animate-spin text-amber-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Media Grid */}
          {mediaLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-6 h-6 animate-spin text-amber-500 mx-auto mb-2" />
              <p className="text-xs text-slate-500">Scanning media directory...</p>
            </div>
          ) : mediaFiles.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
              <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-600">No media uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {mediaFiles.map((file, idx) => (
                <div key={idx} className="group relative rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col justify-between">
                  <div className="aspect-square relative overflow-hidden bg-slate-200">
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        (e.target as any).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><path fill="%23ccc" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1zm-4.44-6.19l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.26.33-.02.81.4.81h10.96c.41 0 .66-.48.4-.81l-2.55-3.37c-.2-.26-.59-.26-.78-.01z"/></svg>';
                      }}
                    />
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] uppercase font-bold">
                      {file.folder}
                    </span>
                  </div>

                  <div className="p-2">
                    <p className="text-[11px] font-semibold text-slate-800 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-[9px] text-slate-400">
                      {(file.size / 1024).toFixed(0)} KB • {file.extension.toUpperCase()}
                    </p>

                    <div className="flex items-center justify-between gap-1 mt-2 pt-1.5 border-t border-slate-200">
                      <button
                        onClick={() => copyToClipboard(file.url)}
                        className="text-[10px] text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
                        title="Copy URL"
                      >
                        {copiedUrl === file.url ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedUrl === file.url ? 'Copied' : 'Copy'}</span>
                      </button>

                      {file.folder === 'uploads' && (
                        <button
                          onClick={() => deleteMedia(file.name, file.folder)}
                          className="text-[10px] text-rose-500 hover:text-rose-700 p-0.5"
                          title="Delete File"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================
          SUB-TAB 7: CONTACT & SOCIAL + MULTI-BRANCH MANAGEMENT
          ======================================================== */}
      {activeSubTab === 'contact' && (
        <div className="space-y-6">
          {/* Branch Offices Management Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <span>Dynamic Branch Offices Management</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Manage physical branches, independent phone numbers with custom labels, WhatsApp chat, Google Maps and social media channels. Changes immediately update both the Footer and Contact Us page.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={loadBranches}
                  disabled={branchesLoading}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  title="Refresh Branches"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${branchesLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={handleAddNewBranch}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Branch</span>
                </button>
              </div>
            </div>

            {branchesLoading && branches.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading branches from database...</div>
            ) : branches.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-xl">
                No branches configured yet. Click "Add New Branch" to create your first office.
              </div>
            ) : (
              <div className="space-y-3">
                {branches.map((b, idx) => {
                  const phoneList = Array.isArray(b.phones)
                    ? b.phones.map((p: any) => (typeof p === 'string' ? { number: p, label: 'Office' } : p))
                    : [];

                  return (
                    <div
                      key={b.id || idx}
                      className={`p-4 rounded-xl border transition-all ${
                        b.isActive
                          ? 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                          : 'border-slate-200 bg-slate-50 opacity-60'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        {/* Branch Details */}
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              #{idx + 1}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900">{b.name}</h4>
                            {b.displayTitle && b.displayTitle !== b.name && (
                              <span className="text-xs text-slate-500 font-medium">({b.displayTitle})</span>
                            )}
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                b.isActive
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {b.isActive ? 'Active on Website' : 'Inactive / Hidden'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed flex items-start gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                            <span>{b.address}</span>
                          </p>

                          {/* Phone numbers chips */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {phoneList.map((ph: any, pIdx: number) => (
                              <span
                                key={pIdx}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900"
                              >
                                <PhoneCall className="w-3 h-3 text-amber-600" />
                                <span className="text-[10px] text-amber-600 uppercase font-bold">
                                  {ph.label || 'Office'}:
                                </span>
                                <span>{ph.number}</span>
                              </span>
                            ))}

                            {b.whatsapp && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800">
                                <i className="fab fa-whatsapp text-xs text-emerald-600"></i>
                                <span>+{b.whatsapp}</span>
                              </span>
                            )}

                            {b.email && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                <Mail className="w-3 h-3 text-slate-500" />
                                <span>{b.email}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                          <button
                            onClick={() => handleToggleBranchActive(b)}
                            title={b.isActive ? 'Deactivate branch' : 'Activate branch'}
                            className={`p-2 rounded-lg border text-xs cursor-pointer ${
                              b.isActive
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                            }`}
                          >
                            {b.isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleMoveBranch(idx, 'up')}
                            disabled={idx === 0}
                            title="Move Up"
                            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveBranch(idx, 'down')}
                            disabled={idx === branches.length - 1}
                            title="Move Down"
                            className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditBranch(b)}
                            title="Edit Branch"
                            className="p-2 rounded-lg border border-slate-200 bg-white text-amber-700 hover:bg-amber-50 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBranch(b.id, b.name)}
                            title="Delete Branch"
                            className="p-2 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Edit / Add Branch Modal */}
          {isBranchModalOpen && editingBranch && (
            <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden my-8">
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <h3 className="text-base font-bold text-slate-900">
                      {editingBranch.id && branches.some((b) => b.id === editingBranch.id)
                        ? `Edit Branch: ${editingBranch.name}`
                        : 'Add New Office Branch'}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setIsBranchModalOpen(false);
                      setEditingBranch(null);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Branch Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingBranch.name || ''}
                        onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                        placeholder="e.g. East Ahmedabad"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Display Title</label>
                      <input
                        type="text"
                        value={editingBranch.displayTitle || ''}
                        onChange={(e) => setEditingBranch({ ...editingBranch, displayTitle: e.target.value })}
                        placeholder="Title displayed on footer/contact (e.g. East Ahmedabad Office)"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* Complete Address */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Complete Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={editingBranch.address || ''}
                      onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                      placeholder="e.g. C-238, Sumel 7, Odhav, Ahmedabad - 382415"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        value={editingBranch.city || 'Ahmedabad'}
                        onChange={(e) => setEditingBranch({ ...editingBranch, city: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                      <input
                        type="text"
                        value={editingBranch.state || 'Gujarat'}
                        onChange={(e) => setEditingBranch({ ...editingBranch, state: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Postal Code</label>
                      <input
                        type="text"
                        value={editingBranch.postalCode || '380052'}
                        onChange={(e) => setEditingBranch({ ...editingBranch, postalCode: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Country</label>
                      <input
                        type="text"
                        value={editingBranch.country || 'India'}
                        onChange={(e) => setEditingBranch({ ...editingBranch, country: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* Multiple Phone Numbers Manager */}
                  <div className="border border-slate-200/80 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                        <span>Phone Numbers (Multiple Supported)</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const currentPhones = Array.isArray(editingBranch.phones) ? [...editingBranch.phones] : [];
                          currentPhones.push({ number: '', label: 'Office' });
                          setEditingBranch({ ...editingBranch, phones: currentPhones });
                        }}
                        className="text-xs text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Phone</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {(editingBranch.phones || []).map((ph: any, pIdx: number) => (
                        <div key={pIdx} className="flex items-center gap-2">
                          <select
                            value={ph.label || 'Office'}
                            onChange={(e) => {
                              const newPhones = [...editingBranch.phones];
                              newPhones[pIdx] = { ...newPhones[pIdx], label: e.target.value };
                              setEditingBranch({ ...editingBranch, phones: newPhones });
                            }}
                            className="w-32 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs bg-white font-semibold"
                          >
                            <option value="Office">Office</option>
                            <option value="Sales">Sales</option>
                            <option value="Support">Support</option>
                            <option value="Direct">Direct</option>
                            <option value="Reception">Reception</option>
                            <option value="General">General</option>
                          </select>
                          <input
                            type="text"
                            value={ph.number || ''}
                            onChange={(e) => {
                              const newPhones = [...editingBranch.phones];
                              newPhones[pIdx] = { ...newPhones[pIdx], number: e.target.value };
                              setEditingBranch({ ...editingBranch, phones: newPhones });
                            }}
                            placeholder="+91 93769 96179"
                            className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newPhones = editingBranch.phones.filter((_: any, i: number) => i !== pIdx);
                              setEditingBranch({ ...editingBranch, phones: newPhones });
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700 cursor-pointer"
                            title="Remove Phone"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Email & WhatsApp */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        value={editingBranch.email || ''}
                        onChange={(e) => setEditingBranch({ ...editingBranch, email: e.target.value })}
                        placeholder="horseveer@gmail.com"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        WhatsApp Number (Digits with country code)
                      </label>
                      <input
                        type="text"
                        value={editingBranch.whatsapp || ''}
                        onChange={(e) => setEditingBranch({ ...editingBranch, whatsapp: e.target.value })}
                        placeholder="919727027052"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* Google Maps Link & Map Embed */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Google Maps URL</label>
                      <input
                        type="text"
                        value={editingBranch.mapUrl || ''}
                        onChange={(e) => setEditingBranch({ ...editingBranch, mapUrl: e.target.value })}
                        placeholder="https://maps.google.com/?q=..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Google Maps Embed URL (Iframe src)
                      </label>
                      <input
                        type="text"
                        value={editingBranch.mapEmbedUrl || ''}
                        onChange={(e) => setEditingBranch({ ...editingBranch, mapEmbedUrl: e.target.value })}
                        placeholder="https://www.google.com/maps/embed?..."
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="border-t border-slate-100 pt-3 space-y-3">
                    <label className="block text-xs font-bold text-slate-700">Branch-Specific Social Links</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">Facebook URL</label>
                        <input
                          type="text"
                          value={editingBranch.facebook || ''}
                          onChange={(e) => setEditingBranch({ ...editingBranch, facebook: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">Instagram URL</label>
                        <input
                          type="text"
                          value={editingBranch.instagram || ''}
                          onChange={(e) => setEditingBranch({ ...editingBranch, instagram: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">YouTube URL</label>
                        <input
                          type="text"
                          value={editingBranch.youtube || ''}
                          onChange={(e) => setEditingBranch({ ...editingBranch, youtube: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-500 mb-1">Google Review URL</label>
                        <input
                          type="text"
                          value={editingBranch.googleReview || ''}
                          onChange={(e) => setEditingBranch({ ...editingBranch, googleReview: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-[11px] text-slate-500 mb-1">LinkedIn URL</label>
                        <input
                          type="text"
                          value={editingBranch.linkedin || ''}
                          onChange={(e) => setEditingBranch({ ...editingBranch, linkedin: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Active Toggle & Order */}
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(editingBranch.isActive)}
                        onChange={(e) => setEditingBranch({ ...editingBranch, isActive: e.target.checked ? 1 : 0 })}
                        className="rounded accent-amber-500 h-4 w-4"
                      />
                      <span className="text-xs font-bold text-slate-800">Active (Visible on Website)</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Display Order:</span>
                      <input
                        type="number"
                        value={editingBranch.displayOrder || 0}
                        onChange={(e) =>
                          setEditingBranch({ ...editingBranch, displayOrder: parseInt(e.target.value) || 0 })
                        }
                        className="w-16 px-2 py-1 rounded border border-slate-200 text-xs text-center"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 p-4 border-t border-slate-100 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => {
                      setIsBranchModalOpen(false);
                      setEditingBranch(null);
                    }}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBranch}
                    disabled={savingBranch}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{savingBranch ? 'Saving...' : 'Save Branch'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Company General Information Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Company Master Contact Information</h3>
                <p className="text-xs text-slate-500">Edit business phone, WhatsApp redirection number, and master company details.</p>
              </div>
              <button
                onClick={() => saveSection('company_info')}
                disabled={savingKey === 'company_info'}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingKey === 'company_info' ? 'Saving...' : 'Save Company Info'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={contactData.companyName || 'Veer Real Estate'}
                  onChange={(e) => updateSectionField('company_info', ['companyName'], e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Phone Number</label>
                <input
                  type="text"
                  value={contactData.phone || '+91 97270 27052'}
                  onChange={(e) => updateSectionField('company_info', ['phone'], e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Target (e.g. 919727027052)</label>
                <input
                  type="text"
                  value={contactData.whatsapp || '919727027052'}
                  onChange={(e) => updateSectionField('company_info', ['whatsapp'], e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={contactData.email || 'info@veerrealestate.com'}
                  onChange={(e) => updateSectionField('company_info', ['email'], e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Physical Office Address</label>
                <input
                  type="text"
                  value={contactData.address || 'Ahmedabad, Gujarat, India'}
                  onChange={(e) => updateSectionField('company_info', ['address'], e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-3">Company Social Media URLs</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">East Ahmedabad Facebook</label>
                  <input
                    type="text"
                    value={contactData.eastFb || 'https://www.facebook.com/people/Veer-Real-Estate-East-Ahmedabad/61571731020972/'}
                    onChange={(e) => updateSectionField('company_info', ['eastFb'], e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">West Ahmedabad Facebook</label>
                  <input
                    type="text"
                    value={contactData.westFb || 'https://www.facebook.com/people/Veer-Real-Estate/61558935522154/'}
                    onChange={(e) => updateSectionField('company_info', ['westFb'], e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">East Ahmedabad Instagram</label>
                  <input
                    type="text"
                    value={contactData.eastInsta || 'https://www.instagram.com/veerrealestateeastahmedabad/?hl=en'}
                    onChange={(e) => updateSectionField('company_info', ['eastInsta'], e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">West Ahmedabad Instagram</label>
                  <input
                    type="text"
                    value={contactData.westInsta || 'https://www.instagram.com/veer.real_estate/'}
                    onChange={(e) => updateSectionField('company_info', ['westInsta'], e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">YouTube Channel</label>
                  <input
                    type="text"
                    value={contactData.youtube || 'https://www.youtube.com/@VeerRealEstate'}
                    onChange={(e) => updateSectionField('company_info', ['youtube'], e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={contactData.linkedin || 'https://www.linkedin.com/company/veer-real-estate-ahmedabad/?viewAsMember=true'}
                    onChange={(e) => updateSectionField('company_info', ['linkedin'], e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-TAB 8: GLOBAL SEO SETTINGS
          ======================================================== */}
      {activeSubTab === 'seo' && (
        <div className="space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-bold text-amber-900">
                Centralized Technical SEO: Integrated directly with Google Search Console & Schema Generators.
              </span>
            </div>
          </div>
          <SeoSettingsForm />
        </div>
      )}

      {/* ========================================================
          SUB-TAB 9: WEBSITE SETTINGS
          ======================================================== */}
      {activeSubTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Global Website Settings</h3>
              <p className="text-xs text-slate-500">Configure global website title, notification routing, and maintenance mode.</p>
            </div>
            <button
              onClick={() => saveSection('website_settings')}
              disabled={savingKey === 'website_settings'}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingKey === 'website_settings' ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Website Brand Name</label>
              <input
                type="text"
                value={settingsData.siteName || 'Veer Real Estate'}
                onChange={(e) => updateSectionField('website_settings', ['siteName'], e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={settingsData.tagline || 'Your Trusted Partner in Real Estate'}
                onChange={(e) => updateSectionField('website_settings', ['tagline'], e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Notification Email (Receives all leads & inquiries)</label>
              <input
                type="email"
                value={settingsData.notificationEmail || 'info@veerrealestate.com'}
                onChange={(e) => updateSectionField('website_settings', ['notificationEmail'], e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Google Analytics Measurement ID</label>
              <input
                type="text"
                value={settingsData.googleAnalyticsId || 'G-XXXXXXXXXX'}
                onChange={(e) => updateSectionField('website_settings', ['googleAnalyticsId'], e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-900">Maintenance Mode</h4>
              <p className="text-[11px] text-slate-500">Temporarily show a maintenance notice to public visitors while Super Admin can still log in.</p>
            </div>
            <button
              onClick={() => updateSectionField('website_settings', ['maintenanceMode'], !settingsData.maintenanceMode)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                settingsData.maintenanceMode
                  ? 'bg-rose-500 text-white'
                  : 'bg-slate-200 text-slate-700'
              }`}
            >
              {settingsData.maintenanceMode ? 'Enabled (Site Paused)' : 'Disabled (Live)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

