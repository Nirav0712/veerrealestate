'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Building2,
  Home,
  FolderKanban,
  MapPin,
  Users,
  FileText,
  Globe,
  Settings,
  Plus,
  Trash2,
  Edit3,
  Eye,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  RefreshCw,
  Upload,
  Image as ImageIcon,
  Save,
  Phone,
  MessageSquare,
  ShieldCheck,
  Calendar,
  LogOut,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { generateKeywordSuggestions } from '@/lib/seo';

type ActiveTab =
  | 'dashboard'
  | 'properties'
  | 'projects'
  | 'locations'
  | 'leads'
  | 'crm'
  | 'blog'
  | 'content'
  | 'seo';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Dynamic Navigation states
  const [propNavOpen, setPropNavOpen] = useState(false);
  const [projNavOpen, setProjNavOpen] = useState(false);
  const [propFilterLocation, setPropFilterLocation] = useState('all');
  const [projFilterLocation, setProjFilterLocation] = useState('all');

  // Core Data States
  const [properties, setProperties] = useState<any[]>([]);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [leadStats, setLeadStats] = useState<Record<string, number>>({ New: 0, Contacted: 0, Qualified: 0, Converted: 0, Lost: 0 });
  const [blogs, setBlogs] = useState<any[]>([]);
  const [websiteContent, setWebsiteContent] = useState<Record<string, any>>({});

  // CRM Customer Inquiries States
  const [crmInquiries, setCrmInquiries] = useState<any[]>([]);
  const [crmMetrics, setCrmMetrics] = useState<any>({ total: 0, byStatus: {}, byLeadType: {} });
  const [crmLoading, setCrmLoading] = useState(false);
  const [crmSearch, setCrmSearch] = useState('');
  const [crmStatusFilter, setCrmStatusFilter] = useState('all');
  const [crmTypeFilter, setCrmTypeFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initial load
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchProperties(),
        fetchProjects(),
        fetchLocations(),
        fetchLeads(),
        fetchCrmInquiries(),
        fetchBlogs(),
        fetchWebsiteContent(),
      ]);
    } catch (e) {
      console.error('Error loading initial data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCrmInquiries = async (search = crmSearch, status = crmStatusFilter, leadType = crmTypeFilter) => {
    try {
      setCrmLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status && status !== 'all') params.set('status', status);
      if (leadType && leadType !== 'all') params.set('leadType', leadType);

      const res = await fetch(`/api/admin/crm?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setCrmInquiries(data.inquiries || []);
        if (data.metrics) setCrmMetrics(data.metrics);
      }
    } catch (e) {
      console.error('Error fetching CRM inquiries:', e);
    } finally {
      setCrmLoading(false);
    }
  };

  const updateCrmInquiry = async (id: number, status: string, notes?: string, assignedTo?: string, followUpDate?: string) => {
    try {
      const res = await fetch(`/api/admin/crm/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, internalNotes: notes, assignedTo, followUpDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update inquiry');
      showToast(`Inquiry marked as ${status}`);
      fetchCrmInquiries(crmSearch, crmStatusFilter, crmTypeFilter);
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry({
          ...selectedInquiry,
          status,
          internalNotes: notes !== undefined ? notes : selectedInquiry.internalNotes,
          assignedTo: assignedTo !== undefined ? assignedTo : selectedInquiry.assignedTo,
          followUpDate: followUpDate !== undefined ? followUpDate : selectedInquiry.followUpDate,
        });
      }
    } catch (err: any) {
      alert(err.message || 'Error updating inquiry');
    }
  };

  const deleteCrmInquiry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this customer inquiry?')) return;
    try {
      const res = await fetch(`/api/admin/crm/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete inquiry');
      showToast('Inquiry deleted successfully');
      setSelectedInquiry(null);
      fetchCrmInquiries(crmSearch, crmStatusFilter, crmTypeFilter);
    } catch (err: any) {
      alert(err.message || 'Error deleting inquiry');
    }
  };

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties?includeDrafts=true');
      if (res.ok) {
        const data = await res.json();
        setProperties(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects?includeDrafts=true');
      if (res.ok) {
        const data = await res.json();
        setProjectsList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await fetch('/api/admin/locations');
      if (res.ok) {
        const data = await res.json();
        setLocations(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLeads = async (search = '', status = 'all') => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (status !== 'all') params.set('status', status);
      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads || []);
        if (data.stats) setLeadStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs?includeDrafts=true');
      if (res.ok) {
        const data = await res.json();
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWebsiteContent = async () => {
    try {
      const res = await fetch('/api/content');
      if (res.ok) {
        const data = await res.json();
        setWebsiteContent(data || {});
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // SHARED UPLOAD HELPER WITH SIZE & LIMIT CHECK
  // ==========================================
  const uploadFile = async (
    file: File,
    typeCategory: 'image' | 'document' = 'image'
  ): Promise<string> => {
    // 1. Client-side size check (Strictly < 20MB for images, < 30MB for documents)
    const limit = typeCategory === 'document' ? 30 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size >= limit) {
      const limitMb = typeCategory === 'document' ? 30 : 20;
      throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(2)} MB). Must be strictly smaller than ${limitMb} MB.`);
    }

    // 2. Client-side MIME type check
    if (typeCategory === 'image') {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Invalid image type. Only JPG, PNG, and WEBP images are supported.');
      }
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', typeCategory);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Failed to upload file');
    }

    return data.url;
  };

  // ==========================================
  // 1. PROPERTIES MANAGEMENT STATE & ACTIONS
  // ==========================================
  const [propSearch, setPropSearch] = useState('');
  const [propFilterType, setPropFilterType] = useState('all');
  const [propFilterStatus, setPropFilterStatus] = useState('all');
  const [showPropModal, setShowPropModal] = useState(false);
  const [editingProp, setEditingProp] = useState<any | null>(null);
  const [propFormData, setPropFormData] = useState<any>({});
  const [isUploadingPropImg, setIsUploadingPropImg] = useState(false);
  const [deleteConfirmPropId, setDeleteConfirmPropId] = useState<number | null>(null);

  const openNewPropertyModal = () => {
    setEditingProp(null);
    setPropFormData({
      title: '',
      price: 0,
      priceOnRequest: false,
      isNegotiable: true,
      maintenanceCharges: '',
      location: locations[0]?.name || 'East Ahmedabad',
      locationId: locations[0]?.id || null,
      locality: '',
      address: '',
      pincode: '',
      type: 'Apartment',
      status: 'For Sale',
      transaction: 'resale',
      availability: 'Available',
      publishStatus: 'published',
      area: 0,
      areaUnit: 'sqft',
      carpetArea: 0,
      builtUpArea: 0,
      superBuiltUpArea: 0,
      plotArea: 0,
      bedrooms: 2,
      bathrooms: 2,
      balconies: 1,
      furnishing: 'Semi-Furnished',
      floorNumber: 1,
      totalFloors: 10,
      facing: 'East',
      propertyAge: '0-1 year',
      possessionDate: 'Ready to Move',
      parking: 1,
      amenities: ['24x7 Security', 'Lift', 'Power Backup', 'Water Supply'],
      reraNumber: '',
      ownershipType: 'Freehold',
      approvals: ['AUDA', 'RERA'],
      featured: false,
      images: [],
      coverImage: '',
      description: '',
      yearBuilt: new Date().getFullYear(),
      metaTitle: '',
      metaDescription: '',
      primaryKeyword: '',
      canonicalUrl: '',
      // Dynamic Category & Purpose fields
      listingPurpose: 'Sell',
      propertyCategory: 'Residential Apartment',
      propertySubtype: 'Apartment',
      monthlyRent: '',
      securityDeposit: '',
      leaseDuration: '11 Months',
      lockInPeriod: '6 Months',
      preferredTenant: 'Any',
      plotFrontage: '',
      plotDepth: '',
      roadWidth: '',
      zoning: '',
      landUse: 'Residential',
      naNocStatus: 'NA Passed',
      isCornerPlot: false,
      boundaryWall: false,
      washrooms: 1,
      powerLoad: '',
      fitOutStatus: 'Warm Shell',
      permittedUse: '',
      irrigationType: 'Borewell',
      waterAccess: true,
      electricityConnection: 'Three Phase',
      landRecordDetails: '',
      contactPerson: 'Sudhir Prajapati',
      contactPhone: '+91 98765 43210',
      contactEmail: 'info@veerrealestate.in',
      societyName: '',
      highlights: '',
      pricePerUnit: '',
    });
    setShowPropModal(true);
  };

  const openEditPropertyModal = (p: any) => {
    setEditingProp(p);
    setPropFormData({
      ...p,
      images: Array.isArray(p.images) ? p.images : [],
      amenities: Array.isArray(p.amenities) ? p.amenities : [],
      approvals: Array.isArray(p.approvals) ? p.approvals : [],
    });
    setShowPropModal(true);
  };

  const handlePropertyImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentImages = propFormData.images || [];
    // Strict max 6 images check
    if (currentImages.length + files.length > 6) {
      alert(`Property images cannot exceed 6 images. You already have ${currentImages.length} images.`);
      e.target.value = '';
      return;
    }

    try {
      setIsUploadingPropImg(true);
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i], 'image');
        newUrls.push(url);
      }
      const updated = [...currentImages, ...newUrls].slice(0, 6);
      setPropFormData({
        ...propFormData,
        images: updated,
        coverImage: propFormData.coverImage || updated[0],
      });
      showToast('Images uploaded successfully');
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setIsUploadingPropImg(false);
      e.target.value = '';
    }
  };

  const removePropertyImage = (indexToRemove: number) => {
    const updated = (propFormData.images || []).filter((_: any, i: number) => i !== indexToRemove);
    setPropFormData({
      ...propFormData,
      images: updated,
      coverImage: propFormData.coverImage === propFormData.images[indexToRemove] ? (updated[0] || '') : propFormData.coverImage,
    });
  };

  const saveProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propFormData.title?.trim()) {
      alert('Property title is required');
      return;
    }

    // Auto-generate keywords if blank
    if (!propFormData.primaryKeyword) {
      propFormData.primaryKeyword = generateKeywordSuggestions({
        title: propFormData.title,
        type: propFormData.type,
        location: propFormData.location,
        bedrooms: propFormData.bedrooms,
        status: propFormData.status,
      });
    }

    try {
      const url = editingProp ? `/api/properties/${editingProp.id}` : '/api/properties';
      const method = editingProp ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propFormData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save property');

      showToast(editingProp ? 'Property updated successfully!' : 'Property created successfully!');
      setShowPropModal(false);
      fetchProperties();
    } catch (err: any) {
      alert(err.message || 'Error saving property');
    }
  };

  const deleteProperty = async (id: number) => {
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete property');
      showToast('Property deleted successfully');
      setDeleteConfirmPropId(null);
      fetchProperties();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ==========================================
  // 2. PROJECTS MANAGEMENT STATE & ACTIONS
  // ==========================================
  const [projSearch, setProjSearch] = useState('');
  const [projFilterZone, setProjFilterZone] = useState('all');
  const [showProjModal, setShowProjModal] = useState(false);
  const [editingProj, setEditingProj] = useState<any | null>(null);
  const [projFormData, setProjFormData] = useState<any>({});
  const [isUploadingProjImg, setIsUploadingProjImg] = useState(false);
  const [deleteConfirmProjId, setDeleteConfirmProjId] = useState<number | null>(null);

  const openNewProjectModal = () => {
    setEditingProj(null);
    setProjFormData({
      name: '',
      projectCode: '',
      slug: '',
      builderName: 'Veer Real Estate & Associates',
      tagline: '',
      description: '',
      category: 'Residential',
      status: 'Under Construction',
      zone: 'East',
      locationName: locations[0]?.name || 'Narol, Ahmedabad',
      locationId: locations[0]?.id || null,
      fullAddress: '',
      pincode: '',
      priceMin: 2500000,
      priceMax: 5000000,
      displayPrice: '₹ 25 Lakh Onwards',
      landArea: '1200 sqft',
      totalTowers: 2,
      totalFloors: 10,
      totalUnits: 56,
      availableUnits: 20,
      configurations: '2 & 3 BHK',
      launchDate: '',
      expectedPossession: 'Dec 2026',
      actualCompletion: '',
      constructionMilestones: '',
      reraNumber: '',
      isReraExempt: false,
      reraExemptionReason: '',
      reraApprovedBy: '',
      reraPhases: '',
      amenities: ['Club House', 'Gymnasium', 'Landscaped Garden', 'Children Play Area', '24x7 Security'],
      approvals: ['AUDA', 'RERA Approved'],
      coverImage: '',
      galleryImages: [],
      masterPlanImage: '',
      sitePlanImage: '',
      brochureUrl: '',
      featured: false,
      publishStatus: 'published',
      floorPlans: [
        {
          towerBlockName: 'Tower A',
          floorNumber: 'Typical Floor (1-10)',
          unitType: '2 BHK Luxury',
          carpetArea: 650,
          builtUpArea: 950,
          areaUnit: 'sqft',
          imageUrl: '/images/east/AARADHANA_2.jpeg',
          description: 'Spacious 2 BHK with master bedroom and private balcony',
        },
      ],
      metaTitle: '',
      metaDescription: '',
      primaryKeyword: '',
      canonicalUrl: '',
    });
    setShowProjModal(true);
  };

  const openEditProjectModal = async (proj: any) => {
    setEditingProj(proj);
    try {
      // Fetch fresh project with floor plans
      const res = await fetch(`/api/projects/${proj.id}`);
      if (res.ok) {
        const fullData = await res.json();
        setProjFormData({
          ...fullData,
          galleryImages: Array.isArray(fullData.galleryImages) ? fullData.galleryImages : [],
          floorPlans: Array.isArray(fullData.floorPlans) ? fullData.floorPlans : [],
          amenities: Array.isArray(fullData.amenities) ? fullData.amenities : [],
          approvals: Array.isArray(fullData.approvals) ? fullData.approvals : [],
        });
      } else {
        setProjFormData(proj);
      }
    } catch {
      setProjFormData(proj);
    }
    setShowProjModal(true);
  };

  const handleProjectGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const currentImages = projFormData.galleryImages || [];
    // Strict max 10 gallery images
    if (currentImages.length + files.length > 10) {
      alert(`Project gallery cannot exceed 10 images. You already have ${currentImages.length} images.`);
      e.target.value = '';
      return;
    }

    try {
      setIsUploadingProjImg(true);
      const newUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadFile(files[i], 'image');
        newUrls.push(url);
      }
      const updated = [...currentImages, ...newUrls].slice(0, 10);
      setProjFormData({
        ...projFormData,
        galleryImages: updated,
        coverImage: projFormData.coverImage || updated[0],
      });
      showToast('Gallery images uploaded successfully');
    } catch (err: any) {
      alert(err.message || 'Upload failed');
    } finally {
      setIsUploadingProjImg(false);
      e.target.value = '';
    }
  };

  const removeProjectGalleryImage = (index: number) => {
    const updated = (projFormData.galleryImages || []).filter((_: any, i: number) => i !== index);
    setProjFormData({
      ...projFormData,
      galleryImages: updated,
      coverImage: projFormData.coverImage === projFormData.galleryImages[index] ? (updated[0] || '') : projFormData.coverImage,
    });
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projFormData.name?.trim()) {
      alert('Project name is required');
      return;
    }

    // Strict RERA Validation for published projects
    const isPublished = projFormData.publishStatus !== 'draft';
    if (isPublished) {
      if (!projFormData.isReraExempt && !projFormData.reraNumber?.trim()) {
        alert('RERA registration number is strictly mandatory before publishing a project. If legally exempt, check the RERA Exemption workflow and provide approval justification.');
        return;
      }
      if (projFormData.isReraExempt) {
        if (!projFormData.reraExemptionReason?.trim() || projFormData.reraExemptionReason.trim().length < 8) {
          alert('A detailed legal exemption reason (minimum 8 characters) is mandatory for RERA-exempt projects.');
          return;
        }
        if (!projFormData.reraApprovedBy?.trim()) {
          alert('Reviewer / approval authority name is required for RERA-exempt projects.');
          return;
        }
      }
    }

    try {
      const url = editingProj ? `/api/projects/${editingProj.id}` : '/api/projects';
      const method = editingProj ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projFormData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save project');

      showToast(editingProj ? 'Project updated successfully!' : 'Project created successfully!');
      setShowProjModal(false);
      fetchProjects();
    } catch (err: any) {
      alert(err.message || 'Error saving project');
    }
  };

  const deleteProject = async (id: number) => {
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete project');
      showToast('Project deleted successfully');
      setDeleteConfirmProjId(null);
      fetchProjects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Floor plan helpers
  const addFloorPlan = () => {
    setProjFormData({
      ...projFormData,
      floorPlans: [
        ...(projFormData.floorPlans || []),
        {
          towerBlockName: 'Tower A',
          floorNumber: '1st - 5th Floor',
          unitType: '3 BHK Premium',
          carpetArea: 850,
          builtUpArea: 1250,
          areaUnit: 'sqft',
          imageUrl: '',
          description: '',
        },
      ],
    });
  };

  const updateFloorPlan = (index: number, field: string, val: any) => {
    const updated = [...(projFormData.floorPlans || [])];
    updated[index] = { ...updated[index], [field]: val };
    setProjFormData({ ...projFormData, floorPlans: updated });
  };

  const removeFloorPlan = (index: number) => {
    const updated = (projFormData.floorPlans || []).filter((_: any, i: number) => i !== index);
    setProjFormData({ ...projFormData, floorPlans: updated });
  };

  // ==========================================
  // 3. LOCATIONS MANAGEMENT STATE & ACTIONS
  // ==========================================
  const [showLocModal, setShowLocModal] = useState(false);
  const [editingLoc, setEditingLoc] = useState<any | null>(null);
  const [locFormData, setLocFormData] = useState<any>({ name: '', zone: 'East', city: 'Ahmedabad', state: 'Gujarat', active: true });

  const openNewLocationModal = () => {
    setEditingLoc(null);
    setLocFormData({ name: '', slug: '', zone: 'East', city: 'Ahmedabad', state: 'Gujarat', pincode: '', description: '', active: true });
    setShowLocModal(true);
  };

  const openEditLocationModal = (loc: any) => {
    setEditingLoc(loc);
    setLocFormData(loc);
    setShowLocModal(true);
  };

  const saveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locFormData.name?.trim()) {
      alert('Location name is required');
      return;
    }

    try {
      const url = editingLoc ? `/api/admin/locations/${editingLoc.id}` : '/api/admin/locations';
      const method = editingLoc ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locFormData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save location');

      showToast(editingLoc ? 'Location updated successfully!' : 'Location created successfully!');
      setShowLocModal(false);
      fetchLocations();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteLocation = async (loc: any) => {
    if (!confirm(`Are you sure you want to delete "${loc.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/locations/${loc.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete location');

      showToast('Location deleted successfully');
      fetchLocations();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ==========================================
  // 4. BUILDER LEADS MANAGEMENT
  // ==========================================
  const [leadSearch, setLeadSearch] = useState('');
  const [leadStatusFilter, setLeadStatusFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const updateLeadStatus = async (id: number, status: string, notes?: string, assignedTo?: string, followUpDate?: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, internalNotes: notes, assignedTo, followUpDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update lead');

      showToast(`Lead updated to "${status}"`);
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(data.lead);
      }
      fetchLeads(leadSearch, leadStatusFilter);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteLead = async (id: number) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete lead');
      showToast('Lead deleted');
      setSelectedLead(null);
      fetchLeads(leadSearch, leadStatusFilter);
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ==========================================
  // 5. BLOG CMS STATE & ACTIONS
  // ==========================================
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);
  const [blogFormData, setBlogFormData] = useState<any>({});

  const openNewBlogModal = () => {
    setEditingBlog(null);
    setBlogFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: 'Sudhir Prajapati',
      category: 'Market Trends',
      tags: ['Ahmedabad', 'Real Estate', 'Guide'],
      featuredImage: '/images/east/AARADHANA_2.jpeg',
      imageAlt: '',
      readTime: '5 min read',
      publishStatus: 'published',
      publishedAt: new Date().toISOString().split('T')[0],
      metaTitle: '',
      metaDescription: '',
      primaryKeyword: '',
    });
    setShowBlogModal(true);
  };

  const openEditBlogModal = async (b: any) => {
    setEditingBlog(b);
    try {
      const res = await fetch(`/api/blogs/${b.slug || b.id}`);
      if (res.ok) {
        const full = await res.json();
        setBlogFormData({
          ...full,
          tags: Array.isArray(full.tags) ? full.tags : [],
          publishedAt: full.publishedAt ? new Date(full.publishedAt).toISOString().split('T')[0] : '',
        });
      } else {
        setBlogFormData(b);
      }
    } catch {
      setBlogFormData(b);
    }
    setShowBlogModal(true);
  };

  const saveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogFormData.title?.trim() || !blogFormData.content?.trim()) {
      alert('Blog title and content are required');
      return;
    }

    try {
      const url = editingBlog ? `/api/blogs/${editingBlog.slug || editingBlog.id}` : '/api/blogs';
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogFormData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save blog post');

      showToast(editingBlog ? 'Blog updated successfully!' : 'Blog created successfully!');
      setShowBlogModal(false);
      fetchBlogs();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const deleteBlog = async (identifier: string | number) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return;
    try {
      const res = await fetch(`/api/blogs/${identifier}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete blog');
      showToast('Blog deleted');
      fetchBlogs();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // ==========================================
  // 6. WEBSITE CONTENT STATE & ACTIONS
  // ==========================================
  const [contentSectionKey, setContentSectionKey] = useState<'hero_slides' | 'company_info' | 'about_us'>('hero_slides');
  const [editableContent, setEditableContent] = useState<any>({});

  useEffect(() => {
    if (websiteContent[contentSectionKey]?.content) {
      setEditableContent(websiteContent[contentSectionKey].content);
    }
  }, [contentSectionKey, websiteContent]);

  const saveWebsiteContentSection = async () => {
    try {
      const res = await fetch(`/api/admin/content/${contentSectionKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: websiteContent[contentSectionKey]?.title || contentSectionKey,
          contentData: editableContent,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save section content');

      showToast(`Saved "${contentSectionKey}" successfully!`);
      fetchWebsiteContent();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch('/api/logout');
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col md:flex-row font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-bold text-slate-950 text-sm">
            VR
          </div>
          <span className="font-bold text-base tracking-wide">Veer Admin CMS</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
        </button>
      </div>

      {/* ========================================================
          SIDEBAR NAVIGATION
          ======================================================== */}
      <aside
        className={`${
          mobileSidebarOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-slate-950 text-slate-300 border-r border-slate-850 flex-shrink-0 flex flex-col justify-between p-4 md:sticky md:top-0 md:h-screen z-30`}
      >
        <div className="space-y-6">
          {/* Logo Brand */}
          <div className="hidden md:flex items-center gap-3 px-2 py-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center font-extrabold text-slate-950 text-base shadow-lg shadow-amber-500/20">
              VR
            </div>
            <div>
              <h2 className="font-bold text-white text-base leading-tight tracking-wide">Veer Real Estate</h2>
              <p className="text-[11px] text-amber-400 font-medium">Enterprise CMS v2.0</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            <button
              onClick={() => { setActiveTab('dashboard'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'hover:bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
            </button>

            {/* Properties Navigation with Dynamic Locations */}
            <div>
              <div className="flex items-center">
                <button
                  onClick={() => {
                    setActiveTab('properties');
                    setPropFilterLocation('all');
                    setMobileSidebarOpen(false);
                  }}
                  className={`flex-1 flex items-center justify-between px-3.5 py-2.5 rounded-l-xl text-sm font-semibold transition-all ${
                    activeTab === 'properties' && propFilterLocation === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'hover:bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4" />
                    <span>Properties</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'properties' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {properties.length}
                  </span>
                </button>
                <button
                  onClick={() => setPropNavOpen(!propNavOpen)}
                  className="px-2 py-2.5 hover:bg-slate-900 text-slate-400 hover:text-white rounded-r-xl transition"
                  title="Toggle Locations Submenu"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${propNavOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Dynamic Location Sub-links */}
              {propNavOpen && (
                <div className="ml-5 mt-1 pl-3 border-l-2 border-slate-800 space-y-1 text-xs py-1">
                  <button
                    onClick={() => {
                      setActiveTab('properties');
                      setPropFilterLocation('all');
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                      activeTab === 'properties' && propFilterLocation === 'all'
                        ? 'bg-amber-500/20 text-amber-400 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    • All Properties
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('properties');
                      setPropFilterLocation('East');
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                      activeTab === 'properties' && propFilterLocation === 'East'
                        ? 'bg-amber-500/20 text-amber-400 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    • East Ahmedabad
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('properties');
                      setPropFilterLocation('West');
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                      activeTab === 'properties' && propFilterLocation === 'West'
                        ? 'bg-amber-500/20 text-amber-400 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    • West Ahmedabad
                  </button>
                  {locations
                    .filter((l) => l.name !== 'East Ahmedabad' && l.name !== 'West Ahmedabad' && l.active !== false)
                    .map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          setActiveTab('properties');
                          setPropFilterLocation(loc.name);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full text-left py-1.5 px-2.5 rounded-lg transition truncate ${
                          activeTab === 'properties' && propFilterLocation === loc.name
                            ? 'bg-amber-500/20 text-amber-400 font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                        }`}
                      >
                        • {loc.name}
                      </button>
                    ))}
                </div>
              )}
            </div>

            {/* Projects Navigation with Dynamic Locations */}
            <div>
              <div className="flex items-center">
                <button
                  onClick={() => {
                    setActiveTab('projects');
                    setProjFilterLocation('all');
                    setMobileSidebarOpen(false);
                  }}
                  className={`flex-1 flex items-center justify-between px-3.5 py-2.5 rounded-l-xl text-sm font-semibold transition-all ${
                    activeTab === 'projects' && projFilterLocation === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'hover:bg-slate-900 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FolderKanban className="w-4 h-4" />
                    <span>Projects</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'projects' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {projectsList.length}
                  </span>
                </button>
                <button
                  onClick={() => setProjNavOpen(!projNavOpen)}
                  className="px-2 py-2.5 hover:bg-slate-900 text-slate-400 hover:text-white rounded-r-xl transition"
                  title="Toggle Projects Submenu"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${projNavOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Dynamic Projects Location Sub-links */}
              {projNavOpen && (
                <div className="ml-5 mt-1 pl-3 border-l-2 border-slate-800 space-y-1 text-xs py-1">
                  <button
                    onClick={() => {
                      setActiveTab('projects');
                      setProjFilterLocation('all');
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                      activeTab === 'projects' && projFilterLocation === 'all'
                        ? 'bg-amber-500/20 text-amber-400 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    • All Projects
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('projects');
                      setProjFilterLocation('East');
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                      activeTab === 'projects' && projFilterLocation === 'East'
                        ? 'bg-amber-500/20 text-amber-400 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    • East Ahmedabad
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('projects');
                      setProjFilterLocation('West');
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition ${
                      activeTab === 'projects' && projFilterLocation === 'West'
                        ? 'bg-amber-500/20 text-amber-400 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                    }`}
                  >
                    • West Ahmedabad
                  </button>
                  {locations
                    .filter((l) => l.name !== 'East Ahmedabad' && l.name !== 'West Ahmedabad' && l.active !== false)
                    .map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          setActiveTab('projects');
                          setProjFilterLocation(loc.name);
                          setMobileSidebarOpen(false);
                        }}
                        className={`w-full text-left py-1.5 px-2.5 rounded-lg transition truncate ${
                          activeTab === 'projects' && projFilterLocation === loc.name
                            ? 'bg-amber-500/20 text-amber-400 font-bold'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                        }`}
                      >
                        • {loc.name}
                      </button>
                    ))}
                </div>
              )}
            </div>

            <button
              onClick={() => { setActiveTab('locations'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'locations'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'hover:bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>Locations</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'locations' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                {locations.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('leads'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'leads'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'hover:bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Builder Leads</span>
              </div>
              {leadStats.New > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold">
                  {leadStats.New} new
                </span>
              )}
            </button>

            {/* CRM Module (Customer Inquiries) */}
            <button
              onClick={() => { setActiveTab('crm'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'crm'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'hover:bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>CRM Inquiries</span>
              </div>
              {(crmMetrics.byStatus?.New || 0) > 0 ? (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold animate-pulse">
                  {crmMetrics.byStatus?.New} new
                </span>
              ) : (
                <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'crm' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                  {crmInquiries.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('blog'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'blog'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'hover:bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>Blog Articles</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === 'blog' ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                {blogs.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('content'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'content'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'hover:bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4" />
                <span>Website Content</span>
              </div>
            </button>

            <button
              onClick={() => { setActiveTab('seo'); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'seo'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                  : 'hover:bg-slate-900 text-slate-300 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4" />
                <span>SEO &amp; Sitemap</span>
              </div>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-6 border-t border-slate-800/80 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              View Live Website
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ========================================================
          MAIN CONTENT AREA
          ======================================================== */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight capitalize">
              {activeTab === 'dashboard' && 'Control Panel & Overview'}
              {activeTab === 'properties' && 'Property Management'}
              {activeTab === 'projects' && 'Project Management'}
              {activeTab === 'locations' && 'Dynamic Locations'}
              {activeTab === 'leads' && 'Builder Consultation Leads'}
              {activeTab === 'blog' && 'Blog & Articles CMS'}
              {activeTab === 'content' && 'Website Content Management'}
              {activeTab === 'seo' && 'Technical & On-Page SEO'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Veer Real Estate Enterprise Content Management System
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              disabled={isLoading}
              className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-sm transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-500' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {activeTab === 'properties' && (
              <button
                onClick={openNewPropertyModal}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Add Property
              </button>
            )}

            {activeTab === 'projects' && (
              <button
                onClick={openNewProjectModal}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Add Project
              </button>
            )}

            {activeTab === 'locations' && (
              <button
                onClick={openNewLocationModal}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                Add Location
              </button>
            )}

            {activeTab === 'blog' && (
              <button
                onClick={openNewBlogModal}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 flex items-center gap-2 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                New Blog Post
              </button>
            )}
          </div>
        </header>

        {/* ========================================================
            TAB 1: DASHBOARD OVERVIEW
            ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div
                onClick={() => setActiveTab('properties')}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Properties</span>
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Building2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{properties.length}</div>
                <div className="text-[11px] text-slate-500 mt-1">Listed residential & commercial</div>
              </div>

              <div
                onClick={() => setActiveTab('projects')}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projects</span>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{projectsList.length}</div>
                <div className="text-[11px] text-slate-500 mt-1">East & West Ahmedabad</div>
              </div>

              <div
                onClick={() => setActiveTab('locations')}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Locations</span>
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MapPin className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{locations.length}</div>
                <div className="text-[11px] text-slate-500 mt-1">Active micro-markets</div>
              </div>

              <div
                onClick={() => setActiveTab('leads')}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Builder Leads</span>
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{leads.length}</div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  {leadStats.New || 0} requiring follow-up
                </div>
              </div>

              <div
                onClick={() => setActiveTab('blog')}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group col-span-2 sm:col-span-1"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Articles</span>
                  <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{blogs.length}</div>
                <div className="text-[11px] text-slate-500 mt-1">Published insights</div>
              </div>
            </div>

            {/* Recent Builder Leads Section */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Recent Builder Consultation Inquiries</h3>
                  <p className="text-xs text-slate-500">Live submissions from the Builder Consultation portal</p>
                </div>
                <button
                  onClick={() => setActiveTab('leads')}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                >
                  View All Leads ({leads.length}) <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {leads.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-sm">
                  No consultation leads recorded yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-150 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="pb-3">Builder / Contact</th>
                        <th className="pb-3">Location &amp; Stage</th>
                        <th className="pb-3">Challenge</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads.slice(0, 5).map((ld) => (
                        <tr key={ld.id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 pr-4">
                            <div className="font-semibold text-slate-900">{ld.fullName}</div>
                            <div className="text-xs text-slate-500">{ld.companyName || 'Individual Builder'} • {ld.phone}</div>
                          </td>
                          <td className="py-3.5 pr-4 text-xs">
                            <div className="font-medium text-slate-700">{ld.projectLocation}</div>
                            <div className="text-slate-400">{ld.projectStage}</div>
                          </td>
                          <td className="py-3.5 pr-4 text-xs text-slate-600 max-w-xs truncate">
                            {ld.mainChallenge}
                          </td>
                          <td className="py-3.5 pr-4">
                            <span
                              className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                ld.status === 'New'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ld.status === 'Contacted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ld.status === 'Qualified'
                                  ? 'bg-purple-100 text-purple-800'
                                  : ld.status === 'Converted'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {ld.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => { setSelectedLead(ld); setActiveTab('leads'); }}
                              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-700 cursor-pointer"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: PROPERTIES MANAGEMENT
            ======================================================== */}
        {activeTab === 'properties' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search properties by title, location, code..."
                  value={propSearch}
                  onChange={(e) => setPropSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={propFilterType}
                  onChange={(e) => setPropFilterType(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
                >
                  <option value="all">All Types</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="House">House</option>
                  <option value="Condo">Condo</option>
                  <option value="Land">Land / Plot</option>
                  <option value="Retail">Retail / Commercial</option>
                </select>

                <select
                  value={propFilterStatus}
                  onChange={(e) => setPropFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
                >
                  <option value="all">All Statuses</option>
                  <option value="For Sale">For Sale</option>
                  <option value="For Rent">For Rent</option>
                </select>
              </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4">Property</th>
                      <th className="py-3.5 px-4">Type &amp; BHK</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Location</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Images</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {properties
                      .filter((p) => {
                        if (propFilterType !== 'all' && p.type !== propFilterType) return false;
                        if (propFilterStatus !== 'all' && p.status !== propFilterStatus) return false;
                        if (propSearch) {
                          const s = propSearch.toLowerCase();
                          return (
                            p.title?.toLowerCase().includes(s) ||
                            p.location?.toLowerCase().includes(s) ||
                            p.propertyCode?.toLowerCase().includes(s)
                          );
                        }
                        return true;
                      })
                      .map((p) => {
                        const imgs = Array.isArray(p.images) ? p.images : [];
                        const cover = p.coverImage || (imgs.length > 0 ? imgs[0] : '/images/east/AARADHANA_2.jpeg');
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 relative overflow-hidden flex-shrink-0 border border-slate-200">
                                  <Image src={cover} alt={p.title} fill className="object-cover" unoptimized />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 leading-tight">{p.title}</div>
                                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">{p.propertyCode || `VRE-${p.id}`}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-xs">
                              <span className="font-semibold text-slate-700">{p.type}</span>
                              <span className="text-slate-400 ml-1.5">• {p.bedrooms ? `${p.bedrooms} BHK` : 'Commercial'}</span>
                            </td>
                            <td className="py-3 px-4 text-xs font-bold text-slate-900">
                              {p.priceOnRequest
                                ? 'Price on Request'
                                : p.price >= 10000000
                                ? `₹ ${(p.price / 10000000).toFixed(2)} Cr`
                                : `₹ ${(p.price / 100000).toFixed(2)} L`}
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-600">
                              {p.location}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                  p.status === 'For Sale' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center text-xs font-semibold text-slate-500">
                              {imgs.length} / 6
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/properties/${p.id}`}
                                  target="_blank"
                                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                                  title="View Public Page"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => openEditPropertyModal(p)}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmPropId(p.id)}
                                  className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: PROJECTS MANAGEMENT
            ======================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search projects by name, builder, zone..."
                  value={projSearch}
                  onChange={(e) => setProjSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={projFilterZone}
                  onChange={(e) => setProjFilterZone(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
                >
                  <option value="all">All Zones</option>
                  <option value="East">East Ahmedabad</option>
                  <option value="West">West Ahmedabad</option>
                </select>
              </div>
            </div>

            {/* Projects Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4">Project</th>
                      <th className="py-3.5 px-4">Zone &amp; Category</th>
                      <th className="py-3.5 px-4">Builder</th>
                      <th className="py-3.5 px-4">Pricing</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Gallery</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projectsList
                      .filter((p) => {
                        if (projFilterZone !== 'all' && p.zone !== projFilterZone) return false;
                        if (projSearch) {
                          const s = projSearch.toLowerCase();
                          return (
                            p.name?.toLowerCase().includes(s) ||
                            p.builderName?.toLowerCase().includes(s) ||
                            p.locationName?.toLowerCase().includes(s)
                          );
                        }
                        return true;
                      })
                      .map((p) => {
                        const imgs = Array.isArray(p.galleryImages) ? p.galleryImages : [];
                        const cover = p.coverImage || (imgs.length > 0 ? imgs[0] : '/images/east/AARADHANA_2.jpeg');
                        const zoneFolder = p.zone === 'West' ? 'west' : 'east';
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 relative overflow-hidden flex-shrink-0 border border-slate-200">
                                  <Image src={cover} alt={p.name} fill className="object-cover" unoptimized />
                                </div>
                                <div>
                                  <div className="font-bold text-slate-900 leading-tight">{p.name}</div>
                                  <div className="text-[11px] text-slate-400 mt-0.5">{p.locationName || p.zone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-xs">
                              <span className="font-semibold text-slate-700">{p.zone} Ahmedabad</span>
                              <span className="text-slate-400 ml-1.5">• {p.category}</span>
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-600 truncate max-w-xs">
                              {p.builderName}
                            </td>
                            <td className="py-3 px-4 text-xs font-bold text-amber-700">
                              {p.displayPrice || 'On Request'}
                            </td>
                            <td className="py-3 px-4">
                              <span className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center text-xs font-semibold text-slate-500">
                              {imgs.length} / 10
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <Link
                                  href={`/projects/${zoneFolder}/${p.slug}`}
                                  target="_blank"
                                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                                  title="View Public Page"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                                <button
                                  onClick={() => openEditProjectModal(p)}
                                  className="p-1.5 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 cursor-pointer"
                                  title="Edit Project"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmProjId(p.id)}
                                  className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 cursor-pointer"
                                  title="Delete Project"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: LOCATIONS MANAGEMENT
            ======================================================== */}
        {activeTab === 'locations' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Ahmedabad &amp; Regional Micro-Markets</h3>
                <p className="text-xs text-slate-500">Dynamic location references used by property and project selectors</p>
              </div>
              <button
                onClick={openNewLocationModal}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Location
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Location Name</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Zone</th>
                    <th className="py-3 px-4">Linked Properties</th>
                    <th className="py-3 px-4">Linked Projects</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {locations.map((loc) => (
                    <tr key={loc.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-semibold text-slate-900">{loc.name}</td>
                      <td className="py-3 px-4 font-mono text-xs text-slate-500">{loc.slug}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {loc.zone}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs font-bold text-slate-700">{loc.propertyCount || 0}</td>
                      <td className="py-3 px-4 text-xs font-bold text-slate-700">{loc.projectCount || 0}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            loc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {loc.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditLocationModal(loc)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteLocation(loc)}
                            className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 cursor-pointer"
                            title="Safe Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5: BUILDER LEADS MANAGEMENT
            ======================================================== */}
        {activeTab === 'leads' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Lead Stats Filter Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
              {['all', 'New', 'Contacted', 'Qualified', 'Converted', 'Lost'].map((st) => (
                <button
                  key={st}
                  onClick={() => {
                    setLeadStatusFilter(st);
                    fetchLeads(leadSearch, st);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    leadStatusFilter === st
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="text-[11px] uppercase tracking-wider font-semibold">
                    {st === 'all' ? 'All Leads' : st}
                  </div>
                  <div className="text-lg font-black mt-0.5">
                    {st === 'all'
                      ? leads.length
                      : leadStats[st] || 0}
                  </div>
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div className="relative w-full max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search leads by name, company, phone, location..."
                  value={leadSearch}
                  onChange={(e) => {
                    setLeadSearch(e.target.value);
                    fetchLeads(e.target.value, leadStatusFilter);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Leads Table & Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Table */}
              <div className={`${selectedLead ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Lead</th>
                        <th className="py-3 px-4">Location &amp; Stage</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leads.map((ld) => (
                        <tr
                          key={ld.id}
                          onClick={() => setSelectedLead(ld)}
                          className={`hover:bg-slate-50/75 cursor-pointer transition-colors ${
                            selectedLead?.id === ld.id ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <div className="font-bold text-slate-900">{ld.fullName}</div>
                            <div className="text-xs text-slate-500">{ld.companyName || 'Builder'} • {ld.phone}</div>
                          </td>
                          <td className="py-3 px-4 text-xs">
                            <div className="font-medium text-slate-800">{ld.projectLocation}</div>
                            <div className="text-slate-400">{ld.projectStage}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                ld.status === 'New'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : ld.status === 'Contacted'
                                  ? 'bg-blue-100 text-blue-800'
                                  : ld.status === 'Qualified'
                                  ? 'bg-purple-100 text-purple-800'
                                  : ld.status === 'Converted'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {ld.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedLead(ld); }}
                              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                            >
                              Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Selected Lead Detail Card */}
              {selectedLead && (
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5 animate-in slide-in-from-right-3 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-150">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{selectedLead.fullName}</h3>
                      <p className="text-xs text-slate-500">{selectedLead.companyName || 'Independent Builder'}</p>
                    </div>
                    <button
                      onClick={() => setSelectedLead(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="font-semibold text-slate-600">Phone / WhatsApp:</span>
                      <a
                        href={`https://wa.me/${selectedLead.phone.replace(/[^\d]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-emerald-600 hover:underline flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        {selectedLead.phone}
                      </a>
                    </div>

                    {selectedLead.email && (
                      <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="font-semibold text-slate-600">Email:</span>
                        <span className="font-medium text-slate-800">{selectedLead.email}</span>
                      </div>
                    )}

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                      <span className="font-semibold text-slate-600 block">Project Location &amp; Stage:</span>
                      <p className="font-bold text-slate-800">{selectedLead.projectLocation} — {selectedLead.projectStage}</p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                      <span className="font-semibold text-slate-600 block">Primary Challenge:</span>
                      <p className="font-semibold text-amber-700">{selectedLead.mainChallenge}</p>
                    </div>

                    {selectedLead.requirements && (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                        <span className="font-semibold text-slate-600 block">Additional Notes / Requirements:</span>
                        <p className="text-slate-700">{selectedLead.requirements}</p>
                      </div>
                    )}
                  </div>

                  {/* Status & Assignment Editor */}
                  <div className="pt-2 border-t border-slate-150 space-y-3 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Lead Status</label>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value, selectedLead.internalNotes, selectedLead.assignedTo, selectedLead.followUpDate)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Assigned Advisor</label>
                      <input
                        type="text"
                        placeholder="e.g. Sudhir Prajapati"
                        defaultValue={selectedLead.assignedTo || ''}
                        onBlur={(e) => updateLeadStatus(selectedLead.id, selectedLead.status, selectedLead.internalNotes, e.target.value, selectedLead.followUpDate)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Internal Follow-Up Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Add private consultation notes, discussion points..."
                        defaultValue={selectedLead.internalNotes || ''}
                        onBlur={(e) => updateLeadStatus(selectedLead.id, selectedLead.status, e.target.value, selectedLead.assignedTo, selectedLead.followUpDate)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <button
                        onClick={() => deleteLead(selectedLead.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        Delete Lead
                      </button>
                      <span className="text-[11px] text-slate-400">
                        Submitted: {new Date(selectedLead.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 5B: CRM CUSTOMER INQUIRIES & LEAD PIPELINE
            ======================================================== */}
        {activeTab === 'crm' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Lead Status Filter Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
              {[
                { id: 'all', label: 'All Inquiries', count: crmInquiries.length },
                { id: 'New', label: 'New', count: crmMetrics.byStatus?.New || 0 },
                { id: 'Contacted', label: 'Contacted', count: crmMetrics.byStatus?.Contacted || 0 },
                { id: 'Qualified', label: 'Qualified', count: crmMetrics.byStatus?.Qualified || 0 },
                { id: 'Site Visit Scheduled', label: 'Site Visit', count: crmMetrics.byStatus?.['Site Visit Scheduled'] || 0 },
                { id: 'Negotiation', label: 'Negotiation', count: crmMetrics.byStatus?.Negotiation || 0 },
                { id: 'Converted', label: 'Converted', count: crmMetrics.byStatus?.Converted || 0 },
                { id: 'Lost', label: 'Lost', count: crmMetrics.byStatus?.Lost || 0 },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    setCrmStatusFilter(st.id);
                    fetchCrmInquiries(crmSearch, st.id, crmTypeFilter);
                  }}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                    crmStatusFilter === st.id
                      ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className="text-[10px] uppercase tracking-wider font-semibold truncate">
                    {st.label}
                  </div>
                  <div className="text-base font-black mt-0.5">
                    {st.count}
                  </div>
                </button>
              ))}
            </div>

            {/* Search & Lead Type Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search inquiries by name, phone, email, project..."
                  value={crmSearch}
                  onChange={(e) => {
                    setCrmSearch(e.target.value);
                    fetchCrmInquiries(e.target.value, crmStatusFilter, crmTypeFilter);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <select
                  value={crmTypeFilter}
                  onChange={(e) => {
                    setCrmTypeFilter(e.target.value);
                    fetchCrmInquiries(crmSearch, crmStatusFilter, e.target.value);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
                >
                  <option value="all">All Inquiry Types ({crmMetrics.total || crmInquiries.length})</option>
                  <option value="property">Property Inquiries ({crmMetrics.byLeadType?.property || 0})</option>
                  <option value="project">Project Inquiries ({crmMetrics.byLeadType?.project || 0})</option>
                  <option value="contact">Contact Page Leads ({crmMetrics.byLeadType?.contact || 0})</option>
                  <option value="general">General Leads ({crmMetrics.byLeadType?.general || 0})</option>
                </select>

                <button
                  onClick={() => fetchCrmInquiries()}
                  disabled={crmLoading}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 text-slate-600"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${crmLoading ? 'animate-spin text-amber-500' : ''}`} />
                  Sync
                </button>
              </div>
            </div>

            {/* Inquiries Grid: Table + Detail Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Table */}
              <div className={`${selectedInquiry ? 'lg:col-span-7' : 'lg:col-span-12'} bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                        <th className="py-3 px-4">Customer Lead</th>
                        <th className="py-3 px-4">Type &amp; Subject</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Follow-Up</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {crmInquiries.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-slate-400">
                            No customer inquiries found matching your filters.
                          </td>
                        </tr>
                      ) : (
                        crmInquiries.map((inq) => (
                          <tr
                            key={inq.id}
                            onClick={() => setSelectedInquiry(inq)}
                            className={`hover:bg-slate-50/75 cursor-pointer transition-colors ${
                              selectedInquiry?.id === inq.id ? 'bg-amber-50/40' : ''
                            }`}
                          >
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{inq.name}</div>
                              <div className="text-xs text-slate-500">
                                {inq.phone} {inq.email ? `• ${inq.email}` : ''}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-xs">
                              <span className={`inline-block font-bold text-[10px] uppercase px-1.5 py-0.5 rounded mr-1.5 ${
                                inq.leadType === 'property'
                                  ? 'bg-blue-100 text-blue-800'
                                  : inq.leadType === 'project'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}>
                                {inq.leadType}
                              </span>
                              <span className="font-medium text-slate-800 truncate max-w-[150px] inline-block align-bottom">
                                {inq.propertyTitle || inq.projectTitle || inq.source || 'General'}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                  inq.status === 'New'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : inq.status === 'Contacted'
                                    ? 'bg-blue-100 text-blue-800'
                                    : inq.status === 'Qualified'
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : inq.status === 'Site Visit Scheduled'
                                    ? 'bg-amber-100 text-amber-800'
                                    : inq.status === 'Negotiation'
                                    ? 'bg-orange-100 text-orange-800'
                                    : inq.status === 'Converted'
                                    ? 'bg-emerald-200 text-emerald-950 font-black'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {inq.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs text-slate-500">
                              {inq.followUpDate ? (
                                <span className="font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                                  {new Date(inq.followUpDate).toLocaleDateString()}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedInquiry(inq); }}
                                className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Selected Inquiry Detail Card */}
              {selectedInquiry && (
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-5 animate-in slide-in-from-right-3 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-150">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{selectedInquiry.name}</h3>
                      <p className="text-xs text-slate-500">
                        Inquiry #{selectedInquiry.id} • {selectedInquiry.leadType?.toUpperCase()}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedInquiry(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    {/* Quick WhatsApp / Phone Call Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`https://wa.me/${(selectedInquiry.phone || '').replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Hello ${selectedInquiry.name}, thank you for contacting Veer Real Estate regarding ${selectedInquiry.propertyTitle || selectedInquiry.projectTitle || 'our listings'}. How can we assist you?`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold hover:bg-emerald-100 flex items-center justify-center gap-1.5 transition"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        Chat WhatsApp
                      </a>
                      <a
                        href={`tel:${selectedInquiry.phone}`}
                        className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 font-bold hover:bg-blue-100 flex items-center justify-center gap-1.5 transition"
                      >
                        <Phone className="w-4 h-4 text-blue-600" />
                        Call Client
                      </a>
                    </div>

                    {/* Email */}
                    {selectedInquiry.email && (
                      <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="font-semibold text-slate-600">Email:</span>
                        <a href={`mailto:${selectedInquiry.email}`} className="text-amber-600 hover:underline font-medium">
                          {selectedInquiry.email}
                        </a>
                      </div>
                    )}

                    {/* Linked Record Details */}
                    {(selectedInquiry.propertyTitle || selectedInquiry.projectTitle) && (
                      <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
                        <span className="font-bold text-amber-900 block mb-1">Inquired For:</span>
                        <div className="font-semibold text-slate-800">
                          {selectedInquiry.propertyTitle || selectedInquiry.projectTitle}
                        </div>
                        {selectedInquiry.propertyId && (
                          <Link
                            href={`/properties/${selectedInquiry.propertyId}`}
                            target="_blank"
                            className="text-xs text-amber-700 hover:underline font-bold inline-flex items-center gap-1 mt-1"
                          >
                            Open Property Page <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                        {selectedInquiry.projectSlug && (
                          <Link
                            href={`/projects/east/${selectedInquiry.projectSlug}`}
                            target="_blank"
                            className="text-xs text-amber-700 hover:underline font-bold inline-flex items-center gap-1 mt-1"
                          >
                            Open Project Page <ExternalLink className="w-3 h-3" />
                          </Link>
                        )}
                      </div>
                    )}

                    {/* Customer Message */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="font-semibold text-slate-600 block mb-1">Customer Message:</span>
                      <p className="text-slate-800 italic leading-relaxed">
                        &quot;{selectedInquiry.message || 'No specific message provided.'}&quot;
                      </p>
                    </div>

                    {/* Status Changer */}
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Lead Status</label>
                      <select
                        value={selectedInquiry.status}
                        onChange={(e) => updateCrmInquiry(selectedInquiry.id, e.target.value, selectedInquiry.internalNotes, selectedInquiry.assignedTo, selectedInquiry.followUpDate)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-800"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                        <option value="Negotiation">Negotiation</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </div>

                    {/* Follow-Up Date */}
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Follow-Up Date</label>
                      <input
                        type="date"
                        value={selectedInquiry.followUpDate ? selectedInquiry.followUpDate.split('T')[0] : ''}
                        onChange={(e) => updateCrmInquiry(selectedInquiry.id, selectedInquiry.status, selectedInquiry.internalNotes, selectedInquiry.assignedTo, e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>

                    {/* Assigned Advisor */}
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Assigned Advisor / Agent</label>
                      <input
                        type="text"
                        placeholder="e.g. Sudhir Prajapati"
                        defaultValue={selectedInquiry.assignedTo || ''}
                        onBlur={(e) => updateCrmInquiry(selectedInquiry.id, selectedInquiry.status, selectedInquiry.internalNotes, e.target.value, selectedInquiry.followUpDate)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>

                    {/* Internal Notes */}
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Internal Follow-Up Notes</label>
                      <textarea
                        rows={3}
                        placeholder="Add private inquiry notes, budget discussion, site visit notes..."
                        defaultValue={selectedInquiry.internalNotes || ''}
                        onBlur={(e) => updateCrmInquiry(selectedInquiry.id, selectedInquiry.status, e.target.value, selectedInquiry.assignedTo, selectedInquiry.followUpDate)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                      />
                    </div>

                    <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                      <button
                        onClick={() => deleteCrmInquiry(selectedInquiry.id)}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        Delete Inquiry
                      </button>
                      <span className="text-[11px] text-slate-400">
                        Received: {new Date(selectedInquiry.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 6: BLOG CMS MANAGEMENT
            ======================================================== */}
        {activeTab === 'blog' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Author</th>
                    <th className="py-3 px-4">Publish Status</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {blogs.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">{b.title}</div>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">{b.slug}</div>
                      </td>
                      <td className="py-3 px-4 text-xs">
                        <span className="font-semibold text-slate-700">{b.category}</span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">{b.author}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            b.publishStatus === 'published'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {b.publishStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500">
                        {b.publishedAt ? new Date(b.publishedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/blog/${b.slug || b.id}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                            title="View Public Post"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEditBlogModal(b)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 rounded-lg hover:bg-blue-50 cursor-pointer"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteBlog(b.slug || b.id)}
                            className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 7: WEBSITE CONTENT MANAGEMENT
            ======================================================== */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Section selector buttons */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              {[
                { key: 'hero_slides', label: 'Homepage Hero Slides' },
                { key: 'company_info', label: 'Company Contact & Socials' },
                { key: 'about_us', label: 'About Us Content' },
              ].map((sec) => (
                <button
                  key={sec.key}
                  onClick={() => setContentSectionKey(sec.key as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    contentSectionKey === sec.key
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {sec.label}
                </button>
              ))}
            </div>

            {/* Dynamic Section Editor */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 capitalize">
                    Edit {contentSectionKey.replace('_', ' ')}
                  </h3>
                  <p className="text-xs text-slate-500">Live data rendered on public pages</p>
                </div>
                <button
                  onClick={saveWebsiteContentSection}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" /> Save Section
                </button>
              </div>

              {/* HERO SLIDES EDITOR */}
              {contentSectionKey === 'hero_slides' && (
                <div className="space-y-4">
                  {(editableContent.slides || []).map((sl: any, idx: number) => (
                    <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-700">Slide #{idx + 1}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Image URL</label>
                          <input
                            type="text"
                            value={sl.image || ''}
                            onChange={(e) => {
                              const updated = [...editableContent.slides];
                              updated[idx].image = e.target.value;
                              setEditableContent({ ...editableContent, slides: updated });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-semibold mb-1">Headline Title</label>
                          <input
                            type="text"
                            value={sl.title || ''}
                            onChange={(e) => {
                              const updated = [...editableContent.slides];
                              updated[idx].title = e.target.value;
                              setEditableContent({ ...editableContent, slides: updated });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                          />
                        </div>
                      </div>
                      <div className="text-xs">
                        <label className="block text-slate-600 font-semibold mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={sl.subtitle || ''}
                          onChange={(e) => {
                            const updated = [...editableContent.slides];
                            updated[idx].subtitle = e.target.value;
                            setEditableContent({ ...editableContent, slides: updated });
                          }}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* COMPANY INFO EDITOR */}
              {contentSectionKey === 'company_info' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Company Name</label>
                    <input
                      type="text"
                      value={editableContent.companyName || ''}
                      onChange={(e) => setEditableContent({ ...editableContent, companyName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Contact Phone</label>
                    <input
                      type="text"
                      value={editableContent.phone || ''}
                      onChange={(e) => setEditableContent({ ...editableContent, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">WhatsApp Number (e.g. 919727027052)</label>
                    <input
                      type="text"
                      value={editableContent.whatsapp || ''}
                      onChange={(e) => setEditableContent({ ...editableContent, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Email</label>
                    <input
                      type="text"
                      value={editableContent.email || ''}
                      onChange={(e) => setEditableContent({ ...editableContent, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Years of Experience</label>
                    <input
                      type="text"
                      value={editableContent.experienceYears || ''}
                      onChange={(e) => setEditableContent({ ...editableContent, experienceYears: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Properties Sold Counter</label>
                    <input
                      type="text"
                      value={editableContent.propertiesSold || ''}
                      onChange={(e) => setEditableContent({ ...editableContent, propertiesSold: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              )}

              {/* ABOUT US CONTENT EDITOR */}
              {contentSectionKey === 'about_us' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Main Heading</label>
                    <input
                      type="text"
                      value={editableContent.heading || ''}
                      onChange={(e) => setEditableContent({ ...editableContent, heading: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Detailed Description</label>
                    <textarea
                      rows={4}
                      value={editableContent.description || ''}
                      onChange={(e) => setEditableContent({ ...editableContent, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Founder Name</label>
                      <input
                        type="text"
                        value={editableContent.founderName || ''}
                        onChange={(e) => setEditableContent({ ...editableContent, founderName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Founder Role</label>
                      <input
                        type="text"
                        value={editableContent.founderRole || ''}
                        onChange={(e) => setEditableContent({ ...editableContent, founderRole: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 8: TECHNICAL & ON-PAGE SEO
            ======================================================== */}
        {activeTab === 'seo' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dynamic Sitemap Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900">XML Sitemap</h3>
                  </div>
                  <Link
                    href="/sitemap.xml"
                    target="_blank"
                    className="text-xs font-bold text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    View /sitemap.xml <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Generated automatically at runtime from published properties, projects, blogs, and static routes. All private drafts are excluded.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5 font-mono text-slate-700">
                  <div>Published Properties: {properties.length}</div>
                  <div>Published Projects: {projectsList.length}</div>
                  <div>Published Blog Articles: {blogs.length}</div>
                  <div>Active Micro-Markets: {locations.length}</div>
                </div>
              </div>

              {/* Robots Directives Card */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-slate-900">Robots.txt Directives</h3>
                  </div>
                  <Link
                    href="/robots.txt"
                    target="_blank"
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    View /robots.txt <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Protects administrative paths while giving search engine bots complete access to public listings and sitemaps.
                </p>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-mono text-slate-700">
                  <div>User-agent: *</div>
                  <div className="text-emerald-700">Allow: /</div>
                  <div className="text-rose-700">Disallow: /admin/</div>
                  <div className="text-rose-700">Disallow: /login</div>
                  <div className="text-rose-700">Disallow: /api/</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 1: COMPLETE PROPERTY FORM (PHASE 3)
            ======================================================== */}
        {showPropModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 animate-in zoom-in-95 duration-150">
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {editingProp ? `Edit Property #${editingProp.id}` : 'Create New Property'}
                  </h3>
                  <p className="text-xs text-slate-500">Complete multi-section property specifications</p>
                </div>
                <button onClick={() => setShowPropModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body with 10 Form Sections */}
              <form onSubmit={saveProperty} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* 1. Basic Info */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">1. Basic Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="font-semibold text-slate-700 mb-1 block">Title *</label>
                      <input
                        type="text"
                        required
                        value={propFormData.title || ''}
                        onChange={(e) => setPropFormData({ ...propFormData, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Property Code</label>
                      <input
                        type="text"
                        placeholder="e.g. VRE-0010"
                        value={propFormData.propertyCode || ''}
                        onChange={(e) => setPropFormData({ ...propFormData, propertyCode: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Description</label>
                    <textarea
                      rows={3}
                      value={propFormData.description || ''}
                      onChange={(e) => setPropFormData({ ...propFormData, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {/* 2. Classification & Availability (Dynamic Categories & Purposes) */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">2. Classification &amp; Availability</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Property Category *</label>
                      <select
                        value={propFormData.propertyCategory || 'Residential Apartment'}
                        onChange={(e) => {
                          const cat = e.target.value;
                          let defaultSub = 'Apartment';
                          if (cat === 'Independent Residential') defaultSub = 'Villa';
                          else if (cat === 'Plot & Land') defaultSub = 'Residential Plot';
                          else if (cat === 'Agricultural Land') defaultSub = 'Agricultural Land';
                          else if (cat === 'Commercial') defaultSub = 'Office';
                          else if (cat === 'Industrial') defaultSub = 'Warehouse';
                          else if (cat === 'Hospitality & Co-living') defaultSub = 'PG';
                          setPropFormData({
                            ...propFormData,
                            propertyCategory: cat,
                            propertySubtype: defaultSub,
                            type: cat === 'Plot & Land' || cat === 'Agricultural Land' ? 'Land' : (cat === 'Commercial' || cat === 'Industrial' ? 'Retail' : 'Apartment'),
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800"
                      >
                        <option value="Residential Apartment">Residential Apartment</option>
                        <option value="Independent Residential">Independent Residential</option>
                        <option value="Plot & Land">Plot &amp; Land</option>
                        <option value="Agricultural Land">Agricultural Land</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Hospitality & Co-living">Hospitality &amp; Co-living</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Property Sub-Type *</label>
                      <select
                        value={propFormData.propertySubtype || 'Apartment'}
                        onChange={(e) => setPropFormData({ ...propFormData, propertySubtype: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      >
                        {propFormData.propertyCategory === 'Residential Apartment' && (
                          <>
                            <option value="Flat">Flat</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Studio Apartment">Studio Apartment</option>
                            <option value="Penthouse">Penthouse</option>
                          </>
                        )}
                        {propFormData.propertyCategory === 'Independent Residential' && (
                          <>
                            <option value="Independent House">Independent House</option>
                            <option value="Bungalow">Bungalow</option>
                            <option value="Villa">Villa</option>
                            <option value="Row House">Row House</option>
                            <option value="Duplex">Duplex</option>
                          </>
                        )}
                        {propFormData.propertyCategory === 'Plot & Land' && (
                          <>
                            <option value="Residential Plot">Residential Plot</option>
                            <option value="Commercial Plot">Commercial Plot</option>
                            <option value="Farmhouse">Farmhouse</option>
                          </>
                        )}
                        {propFormData.propertyCategory === 'Agricultural Land' && (
                          <>
                            <option value="Agricultural Land">Agricultural Land</option>
                            <option value="Farm Land">Farm Land</option>
                          </>
                        )}
                        {propFormData.propertyCategory === 'Commercial' && (
                          <>
                            <option value="Office">Office</option>
                            <option value="Shop">Shop</option>
                            <option value="Showroom">Showroom</option>
                            <option value="Retail Space">Retail Space</option>
                            <option value="Commercial Plot">Commercial Plot</option>
                          </>
                        )}
                        {propFormData.propertyCategory === 'Industrial' && (
                          <>
                            <option value="Warehouse">Warehouse</option>
                            <option value="Industrial Property">Industrial Property</option>
                            <option value="Factory">Factory</option>
                          </>
                        )}
                        {propFormData.propertyCategory === 'Hospitality & Co-living' && (
                          <>
                            <option value="PG">PG</option>
                            <option value="Hostel">Hostel</option>
                            <option value="Co-working Space">Co-working Space</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Listing Purpose *</label>
                      <select
                        value={propFormData.listingPurpose || (propFormData.status === 'For Rent' ? 'Rent' : 'Sell')}
                        onChange={(e) => {
                          const p = e.target.value;
                          setPropFormData({
                            ...propFormData,
                            listingPurpose: p,
                            status: (p === 'Rent' || p === 'Lease' || p === 'Commercial Lease' || p === 'PG / Co-living') ? 'For Rent' : 'For Sale',
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold text-amber-800"
                      >
                        <option value="Sell">Sell (For Sale)</option>
                        <option value="Buy">Buy</option>
                        <option value="Rent">Rent</option>
                        <option value="Lease">Lease</option>
                        <option value="Commercial Lease">Commercial Lease</option>
                        <option value="PG / Co-living">PG / Co-living</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Publish Status</label>
                      <select
                        value={propFormData.publishStatus || 'published'}
                        onChange={(e) => setPropFormData({ ...propFormData, publishStatus: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft (Private)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* CONDITIONAL SECTION A: Rental & Lease Terms */}
                {(['Rent', 'Lease', 'Commercial Lease', 'PG / Co-living'].includes(propFormData.listingPurpose) || propFormData.status === 'For Rent') && (
                  <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 space-y-3 animate-in fade-in duration-200">
                    <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-700" />
                      Rental &amp; Lease Terms
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Monthly Rent (₹) *</label>
                        <input
                          type="number"
                          placeholder="e.g. 25000"
                          value={propFormData.monthlyRent || ''}
                          onChange={(e) => setPropFormData({ ...propFormData, monthlyRent: e.target.value, price: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold text-amber-900"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Security Deposit (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 50000"
                          value={propFormData.securityDeposit || ''}
                          onChange={(e) => setPropFormData({ ...propFormData, securityDeposit: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Preferred Tenant</label>
                        <select
                          value={propFormData.preferredTenant || 'Any'}
                          onChange={(e) => setPropFormData({ ...propFormData, preferredTenant: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        >
                          <option value="Any">Anyone</option>
                          <option value="Family">Family Only</option>
                          <option value="Bachelors">Bachelors Allowed</option>
                          <option value="Company">Corporate / Company Lease</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Lease Duration</label>
                        <input
                          type="text"
                          placeholder="e.g. 11 Months"
                          value={propFormData.leaseDuration || '11 Months'}
                          onChange={(e) => setPropFormData({ ...propFormData, leaseDuration: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* CONDITIONAL SECTION B: Plot & Land Specifications */}
                {(propFormData.propertyCategory === 'Plot & Land' || propFormData.propertyCategory === 'Agricultural Land' || propFormData.type === 'Land' || (propFormData.propertySubtype && propFormData.propertySubtype.includes('Plot'))) && (
                  <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-200/80 space-y-3 animate-in fade-in duration-200">
                    <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-700" />
                      Plot Dimensions &amp; Zoning Details
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Frontage (ft)</label>
                        <input
                          type="number"
                          placeholder="e.g. 40"
                          value={propFormData.plotFrontage || ''}
                          onChange={(e) => setPropFormData({ ...propFormData, plotFrontage: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Depth (ft)</label>
                        <input
                          type="number"
                          placeholder="e.g. 60"
                          value={propFormData.plotDepth || ''}
                          onChange={(e) => setPropFormData({ ...propFormData, plotDepth: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Road Width (ft)</label>
                        <input
                          type="number"
                          placeholder="e.g. 30"
                          value={propFormData.roadWidth || ''}
                          onChange={(e) => setPropFormData({ ...propFormData, roadWidth: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">NA / NOC Status</label>
                        <select
                          value={propFormData.naNocStatus || 'NA Passed'}
                          onChange={(e) => setPropFormData({ ...propFormData, naNocStatus: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-semibold"
                        >
                          <option value="NA Passed">NA Title Clear</option>
                          <option value="NA Applied">NA Under Process</option>
                          <option value="Agricultural">Agricultural Land</option>
                          <option value="NOC Available">NOC Received</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-6 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(propFormData.isCornerPlot)}
                          onChange={(e) => setPropFormData({ ...propFormData, isCornerPlot: e.target.checked })}
                        />
                        <span className="font-semibold text-slate-700">Corner Plot (Two Roads)</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(propFormData.boundaryWall)}
                          onChange={(e) => setPropFormData({ ...propFormData, boundaryWall: e.target.checked })}
                        />
                        <span className="font-semibold text-slate-700">Boundary Wall Constructed</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* CONDITIONAL SECTION C: Commercial & Industrial Specifications */}
                {(['Commercial', 'Industrial'].includes(propFormData.propertyCategory) || propFormData.type === 'Retail') && (
                  <div className="bg-blue-50/60 p-4 rounded-xl border border-blue-200/80 space-y-3 animate-in fade-in duration-200">
                    <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-700" />
                      Commercial &amp; Industrial Fit-Out
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Total Washrooms</label>
                        <input
                          type="number"
                          value={propFormData.washrooms || 1}
                          onChange={(e) => setPropFormData({ ...propFormData, washrooms: parseInt(e.target.value) || 1 })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Power Load</label>
                        <input
                          type="text"
                          placeholder="e.g. 25 kVA / 50 HP"
                          value={propFormData.powerLoad || ''}
                          onChange={(e) => setPropFormData({ ...propFormData, powerLoad: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Fit-Out Status</label>
                        <select
                          value={propFormData.fitOutStatus || 'Warm Shell'}
                          onChange={(e) => setPropFormData({ ...propFormData, fitOutStatus: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        >
                          <option value="Bare Shell">Bare Shell</option>
                          <option value="Warm Shell">Warm Shell</option>
                          <option value="Fully Furnished">Fully Furnished</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Permitted Use</label>
                        <input
                          type="text"
                          placeholder="e.g. Retail, IT Office, Clinic"
                          value={propFormData.permittedUse || ''}
                          onChange={(e) => setPropFormData({ ...propFormData, permittedUse: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* CONDITIONAL SECTION D: Agricultural Land Records */}
                {propFormData.propertyCategory === 'Agricultural Land' && (
                  <div className="bg-lime-50/60 p-4 rounded-xl border border-lime-200/80 space-y-3 animate-in fade-in duration-200">
                    <h4 className="font-bold text-lime-900 text-sm">Agricultural Records &amp; Irrigation</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Irrigation Source</label>
                        <select
                          value={propFormData.irrigationType || 'Borewell'}
                          onChange={(e) => setPropFormData({ ...propFormData, irrigationType: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        >
                          <option value="Canal">Canal Water</option>
                          <option value="Borewell">Borewell</option>
                          <option value="Drip">Drip Irrigation</option>
                          <option value="Well">Well</option>
                          <option value="Rainfed">Rainfed</option>
                        </select>
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">Electricity Connection</label>
                        <select
                          value={propFormData.electricityConnection || 'Three Phase'}
                          onChange={(e) => setPropFormData({ ...propFormData, electricityConnection: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        >
                          <option value="Three Phase">Three Phase Agricultural</option>
                          <option value="Single Phase">Single Phase</option>
                          <option value="Solar">Solar Powered</option>
                          <option value="None">None</option>
                        </select>
                      </div>
                      <div className="md:col-span-2">
                        <label className="font-semibold text-slate-700 mb-1 block">Land Record Details (7/12, Survey No)</label>
                        <input
                          type="text"
                          placeholder="e.g. Survey No. 142/2, 7/12 Clear Title"
                          value={propFormData.landRecordDetails || ''}
                          onChange={(e) => setPropFormData({ ...propFormData, landRecordDetails: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Location */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">3. Location Specifications</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Micro-Market / Location *</label>
                      <select
                        value={propFormData.locationId || ''}
                        onChange={(e) => {
                          const selected = locations.find((l) => l.id === parseInt(e.target.value));
                          setPropFormData({
                            ...propFormData,
                            locationId: selected ? selected.id : null,
                            location: selected ? selected.name : propFormData.location,
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-semibold text-slate-800"
                      >
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name} ({loc.zone})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Locality / Landmark</label>
                      <input
                        type="text"
                        placeholder="Near S.P. Ring Road"
                        value={propFormData.locality || ''}
                        onChange={(e) => setPropFormData({ ...propFormData, locality: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Pincode</label>
                      <input
                        type="text"
                        placeholder="382405"
                        value={propFormData.pincode || ''}
                        onChange={(e) => setPropFormData({ ...propFormData, pincode: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Pricing & Areas */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">4. Pricing &amp; Area Specifications</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Price (INR)</label>
                      <input
                        type="number"
                        disabled={propFormData.priceOnRequest}
                        value={propFormData.price || 0}
                        onChange={(e) => setPropFormData({ ...propFormData, price: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="priceOnRequest"
                        checked={propFormData.priceOnRequest || false}
                        onChange={(e) => setPropFormData({ ...propFormData, priceOnRequest: e.target.checked })}
                      />
                      <label htmlFor="priceOnRequest" className="font-semibold text-slate-700">Price on Request</label>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Total Area</label>
                      <input
                        type="number"
                        value={propFormData.area || 0}
                        onChange={(e) => setPropFormData({ ...propFormData, area: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Area Unit</label>
                      <select
                        value={propFormData.areaUnit || 'sqft'}
                        onChange={(e) => setPropFormData({ ...propFormData, areaUnit: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="sqft">Sq. Feet</option>
                        <option value="sqyard">Sq. Yards</option>
                        <option value="sqmeter">Sq. Meters</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Carpet Area</label>
                      <input
                        type="number"
                        placeholder="Carpet sqft"
                        value={propFormData.carpetArea || ''}
                        onChange={(e) => setPropFormData({ ...propFormData, carpetArea: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Super Built-up</label>
                      <input
                        type="number"
                        placeholder="Super built-up"
                        value={propFormData.superBuiltUpArea || ''}
                        onChange={(e) => setPropFormData({ ...propFormData, superBuiltUpArea: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Maintenance Charges</label>
                      <input
                        type="text"
                        placeholder="₹ 1,500 / month"
                        value={propFormData.maintenanceCharges || ''}
                        onChange={(e) => setPropFormData({ ...propFormData, maintenanceCharges: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Configuration & Details */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">5. Unit Configuration</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Bedrooms / BHK</label>
                      <input
                        type="number"
                        value={propFormData.bedrooms || 0}
                        onChange={(e) => setPropFormData({ ...propFormData, bedrooms: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Bathrooms</label>
                      <input
                        type="number"
                        value={propFormData.bathrooms || 0}
                        onChange={(e) => setPropFormData({ ...propFormData, bathrooms: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Balconies</label>
                      <input
                        type="number"
                        value={propFormData.balconies || 0}
                        onChange={(e) => setPropFormData({ ...propFormData, balconies: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Furnishing</label>
                      <select
                        value={propFormData.furnishing || 'Semi-Furnished'}
                        onChange={(e) => setPropFormData({ ...propFormData, furnishing: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="Unfurnished">Unfurnished</option>
                        <option value="Semi-Furnished">Semi-Furnished</option>
                        <option value="Fully-Furnished">Fully-Furnished</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 6. Images Upload (Strictly <= 6 images, < 20MB) */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">6. Property Images (Max 6 Images, Strictly &lt; 20 MB each)</h4>
                      <p className="text-[11px] text-slate-500">MIME type verified JPG, PNG, and WEBP only.</p>
                    </div>
                    <span className="font-bold text-xs text-amber-700">
                      {(propFormData.images || []).length} / 6 Images
                    </span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {(propFormData.images || []).map((imgUrl: string, idx: number) => (
                      <div key={idx} className="relative aspect-square rounded-xl bg-slate-200 overflow-hidden border border-slate-300 group">
                        <Image src={imgUrl} alt={`Upload ${idx + 1}`} fill className="object-cover" unoptimized />
                        <button
                          type="button"
                          onClick={() => removePropertyImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {(propFormData.images || []).length < 6 && (
                      <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl flex flex-col items-center justify-center cursor-pointer p-3 aspect-square text-center bg-white transition-colors">
                        <Upload className="w-5 h-5 text-slate-400 mb-1" />
                        <span className="text-[10px] font-bold text-slate-600">
                          {isUploadingPropImg ? 'Uploading...' : 'Add Image'}
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp"
                          disabled={isUploadingPropImg}
                          onChange={handlePropertyImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* 7. SEO Metadata */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">7. SEO Metadata &amp; Keywords</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Meta Title</label>
                      <input
                        type="text"
                        placeholder="3 BHK Apartment for Sale in Narol | Veer Real Estate"
                        value={propFormData.metaTitle || ''}
                        onChange={(e) => setPropFormData({ ...propFormData, metaTitle: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Primary Keywords</label>
                      <input
                        type="text"
                        placeholder="3 BHK in Narol, buy flat Ahmedabad"
                        value={propFormData.primaryKeyword || ''}
                        onChange={(e) => setPropFormData({ ...propFormData, primaryKeyword: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowPropModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider shadow-md shadow-amber-500/20"
                  >
                    {editingProp ? 'Update Property' : 'Publish Property'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirmPropId && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Delete Property?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete this property record? This action cannot be undone.
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setDeleteConfirmPropId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteProperty(deleteConfirmPropId)}
                  className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 2: COMPLETE PROJECT FORM (PHASE 4)
            ======================================================== */}
        {showProjModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-slate-200 animate-in zoom-in-95 duration-150">
              <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {editingProj ? `Edit Project: ${editingProj.name}` : 'Create Independent Project'}
                  </h3>
                  <p className="text-xs text-slate-500">Master plans, floor-wise planning, towers &amp; galleries</p>
                </div>
                <button onClick={() => setShowProjModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={saveProject} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                {/* 1. Basic Project Info */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">1. Project Overview</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2">
                      <label className="font-semibold text-slate-700 mb-1 block">Project Name *</label>
                      <input
                        type="text"
                        required
                        value={projFormData.name || ''}
                        onChange={(e) => setProjFormData({ ...projFormData, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Builder / Developer</label>
                      <input
                        type="text"
                        value={projFormData.builderName || ''}
                        onChange={(e) => setProjFormData({ ...projFormData, builderName: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Zone *</label>
                      <select
                        value={projFormData.zone || 'East'}
                        onChange={(e) => setProjFormData({ ...projFormData, zone: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold"
                      >
                        <option value="East">East Ahmedabad</option>
                        <option value="West">West Ahmedabad</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Category</label>
                      <select
                        value={projFormData.category || 'Residential'}
                        onChange={(e) => setProjFormData({ ...projFormData, category: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Mixed Use">Mixed Use</option>
                        <option value="Township">Township</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Construction Status</label>
                      <select
                        value={projFormData.status || 'Under Construction'}
                        onChange={(e) => setProjFormData({ ...projFormData, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Pre-launch">Pre-launch</option>
                        <option value="Under Construction">Under Construction</option>
                        <option value="Ready to Move">Ready to Move</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Display Price</label>
                      <input
                        type="text"
                        placeholder="₹ 26 Lakh Onwards"
                        value={projFormData.displayPrice || ''}
                        onChange={(e) => setProjFormData({ ...projFormData, displayPrice: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold text-amber-700"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Description</label>
                    <textarea
                      rows={3}
                      value={projFormData.description || ''}
                      onChange={(e) => setProjFormData({ ...projFormData, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {/* 2. RERA Registration & Legal Exemption Workflow (MANDATORY) */}
                <div className={`p-4 rounded-xl border space-y-3 transition-colors ${
                  projFormData.isReraExempt ? 'bg-amber-50/70 border-amber-200' : 'bg-emerald-50/70 border-emerald-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <ShieldCheck className={`w-4 h-4 ${projFormData.isReraExempt ? 'text-amber-600' : 'text-emerald-600'}`} />
                        RERA Registration &amp; Legal Compliance *
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Mandatory for all published projects under RERA Act. Do not fabricate unverified numbers.
                      </p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-xs">
                      <input
                        type="checkbox"
                        checked={Boolean(projFormData.isReraExempt)}
                        onChange={(e) => setProjFormData({ ...projFormData, isReraExempt: e.target.checked })}
                      />
                      <span className="font-bold text-amber-900 text-xs">Project is Legally Exempt</span>
                    </label>
                  </div>

                  {!projFormData.isReraExempt ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">
                          Gujarat RERA Registration Number *
                        </label>
                        <input
                          type="text"
                          required={projFormData.publishStatus !== 'draft'}
                          placeholder="e.g. PR/GJ/AHMEDABAD/AHMEDABAD CITY/AUDA/RAA12345/010125"
                          value={projFormData.reraNumber || ''}
                          onChange={(e) => setProjFormData({ ...projFormData, reraNumber: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-emerald-300 bg-white font-mono font-bold text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 mb-1 block">
                          Phase-Level Registrations (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="Phase 1: PR/GJ/... ; Phase 2: PR/GJ/..."
                          value={projFormData.reraPhases || ''}
                          onChange={(e) => setProjFormData({ ...projFormData, reraPhases: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="font-semibold text-amber-950 mb-1 block">
                          Exemption Legal Rationale &amp; Statutory Basis *
                        </label>
                        <textarea
                          rows={2}
                          required
                          placeholder="State exact legal exemption reason (e.g., Plotted layout under 500 sq meters or renovation without marketing)..."
                          value={projFormData.reraExemptionReason || ''}
                          onChange={(e) => setProjFormData({ ...projFormData, reraExemptionReason: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-amber-950 mb-1 block">
                          Reviewed &amp; Approved Authority Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Legal Officer / Chief Architect Name"
                          value={projFormData.reraApprovedBy || ''}
                          onChange={(e) => setProjFormData({ ...projFormData, reraApprovedBy: e.target.value })}
                          className="w-full px-3 py-2 rounded-lg border border-amber-300 bg-white text-xs mb-2"
                        />
                        <p className="text-[10px] text-amber-800">
                          Exemptions are audited and recorded with timestamp and reviewer accountability.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. Scale, Specifications & Construction Milestones */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">3. Project Scale, Units &amp; Milestones</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Project Code</label>
                      <input
                        type="text"
                        placeholder="VPR-1001"
                        value={projFormData.projectCode || ''}
                        onChange={(e) => setProjFormData({ ...projFormData, projectCode: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Land Area</label>
                      <input
                        type="text"
                        placeholder="e.g. 5 Acres / 15000 sqyd"
                        value={projFormData.landArea || ''}
                        onChange={(e) => setProjFormData({ ...projFormData, landArea: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Total Towers / Blocks</label>
                      <input
                        type="number"
                        value={projFormData.totalTowers || 1}
                        onChange={(e) => setProjFormData({ ...projFormData, totalTowers: parseInt(e.target.value) || 1 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Total Floors per Tower</label>
                      <input
                        type="number"
                        value={projFormData.totalFloors || 10}
                        onChange={(e) => setProjFormData({ ...projFormData, totalFloors: parseInt(e.target.value) || 10 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Total Units</label>
                      <input
                        type="number"
                        value={projFormData.totalUnits || 0}
                        onChange={(e) => setProjFormData({ ...projFormData, totalUnits: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Available Units</label>
                      <input
                        type="number"
                        value={projFormData.availableUnits || 0}
                        onChange={(e) => setProjFormData({ ...projFormData, availableUnits: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Configurations</label>
                      <input
                        type="text"
                        placeholder="2 BHK, 3 BHK, 4 BHK, Retail"
                        value={projFormData.configurations || ''}
                        onChange={(e) => setProjFormData({ ...projFormData, configurations: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Expected Possession</label>
                      <input
                        type="text"
                        placeholder="e.g. Dec 2026"
                        value={projFormData.expectedPossession || projFormData.possessionDate || ''}
                        onChange={(e) => setProjFormData({ ...projFormData, expectedPossession: e.target.value, possessionDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Launch Date</label>
                      <input
                        type="date"
                        value={projFormData.launchDate ? projFormData.launchDate.split('T')[0] : ''}
                        onChange={(e) => setProjFormData({ ...projFormData, launchDate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 mb-1 block">Construction Milestones</label>
                      <input
                        type="text"
                        placeholder="e.g. Foundation Complete, 5th Floor Slab Cast, Finishing in Progress"
                        value={projFormData.constructionMilestones || ''}
                        onChange={(e) => setProjFormData({ ...projFormData, constructionMilestones: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Gallery Images (Strictly <= 10, < 20MB) */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">2. Project Gallery (Max 10 Images, Strictly &lt; 20 MB each)</h4>
                      <p className="text-[11px] text-slate-500">JPG, PNG, and WEBP supported</p>
                    </div>
                    <span className="font-bold text-xs text-amber-700">
                      {(projFormData.galleryImages || []).length} / 10 Images
                    </span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                    {(projFormData.galleryImages || []).map((imgUrl: string, idx: number) => (
                      <div key={idx} className="relative aspect-square rounded-xl bg-slate-200 overflow-hidden border border-slate-300">
                        <Image src={imgUrl} alt={`Proj ${idx + 1}`} fill className="object-cover" unoptimized />
                        <button
                          type="button"
                          onClick={() => removeProjectGalleryImage(idx)}
                          className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {(projFormData.galleryImages || []).length < 10 && (
                      <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl flex flex-col items-center justify-center cursor-pointer p-2 aspect-square text-center bg-white transition-colors">
                        <Upload className="w-4 h-4 text-slate-400 mb-1" />
                        <span className="text-[9px] font-bold text-slate-600">
                          {isUploadingProjImg ? '...' : '+ Upload'}
                        </span>
                        <input
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/webp"
                          disabled={isUploadingProjImg}
                          onChange={handleProjectGalleryUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* 3. Floor-Wise Planning */}
                <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">3. Floor-Wise Planning &amp; Tower Layouts</h4>
                      <p className="text-[11px] text-slate-500">Add multiple tower/block configurations and floor plans</p>
                    </div>
                    <button
                      type="button"
                      onClick={addFloorPlan}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Floor Plan
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(projFormData.floorPlans || []).map((fp: any, idx: number) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-5 gap-2.5 items-center">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500">Tower / Block</label>
                          <input
                            type="text"
                            value={fp.towerBlockName || ''}
                            onChange={(e) => updateFloorPlan(idx, 'towerBlockName', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500">Floor Range</label>
                          <input
                            type="text"
                            value={fp.floorNumber || ''}
                            onChange={(e) => updateFloorPlan(idx, 'floorNumber', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500">Unit Type</label>
                          <input
                            type="text"
                            value={fp.unitType || ''}
                            onChange={(e) => updateFloorPlan(idx, 'unitType', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500">Plan Image URL</label>
                          <input
                            type="text"
                            placeholder="/uploads/plan.webp"
                            value={fp.imageUrl || ''}
                            onChange={(e) => updateFloorPlan(idx, 'imageUrl', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs"
                          />
                        </div>
                        <div className="flex items-center justify-end gap-2 pt-3">
                          <button
                            type="button"
                            onClick={() => removeFloorPlan(idx)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowProjModal(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider shadow-md shadow-amber-500/20"
                  >
                    {editingProj ? 'Update Project' : 'Publish Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Project Confirmation Modal */}
        {deleteConfirmProjId && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Delete Project?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to permanently delete this project and all its floor plans?
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <button
                  onClick={() => setDeleteConfirmProjId(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteProject(deleteConfirmProjId)}
                  className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 3: LOCATION FORM (PHASE 5)
            ======================================================== */}
        {showLocModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 p-6 space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-150 pb-3">
                <h3 className="font-bold text-base text-slate-900">
                  {editingLoc ? `Edit Location: ${editingLoc.name}` : 'Add New Location'}
                </h3>
                <button onClick={() => setShowLocModal(false)} className="p-1 rounded-lg text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={saveLocation} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 mb-1 block">Location Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science City"
                    value={locFormData.name || ''}
                    onChange={(e) => setLocFormData({ ...locFormData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Zone</label>
                    <select
                      value={locFormData.zone || 'East'}
                      onChange={(e) => setLocFormData({ ...locFormData, zone: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    >
                      <option value="East">East</option>
                      <option value="West">West</option>
                      <option value="North">North</option>
                      <option value="Central">Central</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">City</label>
                    <input
                      type="text"
                      value={locFormData.city || 'Ahmedabad'}
                      onChange={(e) => setLocFormData({ ...locFormData, city: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="locActive"
                    checked={locFormData.active !== false}
                    onChange={(e) => setLocFormData({ ...locFormData, active: e.target.checked })}
                  />
                  <label htmlFor="locActive" className="font-semibold text-slate-700">Active (Visible in public filters &amp; selectors)</label>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-150">
                  <button
                    type="button"
                    onClick={() => setShowLocModal(false)}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 font-bold text-slate-950"
                  >
                    Save Location
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 4: BLOG FORM (PHASE 6)
            ======================================================== */}
        {showBlogModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200 animate-in zoom-in-95 duration-150">
              <div className="px-6 py-4 border-b border-slate-150 flex items-center justify-between bg-slate-50/50 rounded-t-2xl">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    {editingBlog ? `Edit Article: ${editingBlog.title}` : 'Draft New Blog Article'}
                  </h3>
                  <p className="text-xs text-slate-500">Real estate market trends, buying guides &amp; investment insights</p>
                </div>
                <button onClick={() => setShowBlogModal(false)} className="p-1 rounded-lg text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={saveBlog} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 mb-1 block">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={blogFormData.title || ''}
                    onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Category</label>
                    <select
                      value={blogFormData.category || 'Market Trends'}
                      onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    >
                      <option value="Market Trends">Market Trends</option>
                      <option value="Buying Guide">Buying Guide</option>
                      <option value="Investment">Investment</option>
                      <option value="Luxury Living">Luxury Living</option>
                      <option value="Finance">Finance</option>
                      <option value="Location Guide">Location Guide</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Author</label>
                    <input
                      type="text"
                      value={blogFormData.author || ''}
                      onChange={(e) => setBlogFormData({ ...blogFormData, author: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 mb-1 block">Publish Status</label>
                    <select
                      value={blogFormData.publishStatus || 'published'}
                      onChange={(e) => setBlogFormData({ ...blogFormData, publishStatus: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 font-bold"
                    >
                      <option value="published">Published</option>
                      <option value="draft">Draft (Private)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 mb-1 block">Short Excerpt</label>
                  <textarea
                    rows={2}
                    value={blogFormData.excerpt || ''}
                    onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 mb-1 block">Full Article Content (HTML / Text) *</label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Enter article body with paragraphs or HTML headings..."
                    value={blogFormData.content || ''}
                    onChange={(e) => setBlogFormData({ ...blogFormData, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 mb-1 block">Featured Image URL</label>
                  <input
                    type="text"
                    value={blogFormData.featuredImage || ''}
                    onChange={(e) => setBlogFormData({ ...blogFormData, featuredImage: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>

                <div className="pt-3 border-t border-slate-150 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowBlogModal(false)}
                    className="px-4 py-2 rounded-lg border border-slate-200 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 font-bold text-slate-950"
                  >
                    Save Article
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
