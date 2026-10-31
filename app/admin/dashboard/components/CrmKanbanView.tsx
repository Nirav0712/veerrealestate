'use client';

import { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Building2,
  Calendar,
  User,
  ArrowRight,
  MoreVertical,
  CheckCircle,
  Archive,
  Eye,
  RefreshCw,
  Search,
  Filter,
} from 'lucide-react';

export interface CrmInquiryItem {
  id: number;
  name: string;
  phone: string;
  email?: string;
  leadType: 'property' | 'project' | 'contact' | 'general' | 'builder';
  propertyId?: number;
  propertyTitle?: string;
  projectId?: number;
  projectName?: string;
  subject?: string;
  message?: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Site Visit Scheduled' | 'Negotiation' | 'Converted' | 'Lost';
  assignedTo?: string;
  internalNotes?: string;
  followUpDate?: string;
  source?: string;
  created_at: string;
  is_archived?: boolean | number;
}

export const CRM_STAGES = [
  { id: 'New', label: 'New Lead', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', badge: 'bg-emerald-500' },
  { id: 'Contacted', label: 'Contacted', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', badge: 'bg-blue-500' },
  { id: 'Qualified', label: 'Qualified', bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-800', badge: 'bg-indigo-500' },
  { id: 'Site Visit Scheduled', label: 'Site Visit', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', badge: 'bg-amber-500' },
  { id: 'Negotiation', label: 'Negotiation', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-800', badge: 'bg-orange-500' },
  { id: 'Converted', label: 'Converted', bg: 'bg-emerald-100', border: 'border-emerald-300', text: 'text-emerald-950', badge: 'bg-emerald-600' },
  { id: 'Lost', label: 'Lost / Closed', bg: 'bg-slate-100', border: 'border-slate-200', text: 'text-slate-600', badge: 'bg-slate-400' },
] as const;

interface CrmKanbanViewProps {
  inquiries: CrmInquiryItem[];
  onUpdateInquiry: (id: number, status: string, notes?: string, assignedTo?: string, followUpDate?: string) => Promise<void>;
  onDeleteInquiry: (id: number) => Promise<void>;
  onSelectInquiry: (inq: CrmInquiryItem) => void;
  selectedInquiryId?: number | null;
  onRefresh: () => void;
  isLoading?: boolean;
}

export default function CrmKanbanView({
  inquiries,
  onUpdateInquiry,
  onDeleteInquiry,
  onSelectInquiry,
  selectedInquiryId,
  onRefresh,
  isLoading,
}: CrmKanbanViewProps) {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter inquiries
  const filtered = inquiries.filter((inq) => {
    if (filterType !== 'all' && inq.leadType !== filterType) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = inq.name?.toLowerCase().includes(q);
      const matchPhone = inq.phone?.includes(q);
      const matchEmail = inq.email?.toLowerCase().includes(q);
      const matchTarget = (inq.propertyTitle || inq.projectName || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchEmail && !matchTarget) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Top Filter & Action Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-[260px]">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search leads across pipeline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white text-slate-700"
          >
            <option value="all">All Lead Sources</option>
            <option value="property">Property Leads</option>
            <option value="project">Project Leads</option>
            <option value="contact">Contact Us Leads</option>
            <option value="builder">Builder Inquiries</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Total Pipeline Leads: <strong className="text-slate-900">{filtered.length}</strong>
          </span>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            title="Refresh Pipeline"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-500' : ''}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Horizontal Track */}
      <div className="overflow-x-auto pb-4 pt-1 no-scrollbar">
        <div className="flex gap-4 min-w-[1300px]">
          {CRM_STAGES.map((stage) => {
            const stageLeads = filtered.filter((i) => i.status === stage.id);

            return (
              <div
                key={stage.id}
                className="w-80 shrink-0 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col max-h-[78vh]"
              >
                {/* Column Header */}
                <div className={`p-3.5 border-b ${stage.border} ${stage.bg} rounded-t-2xl flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${stage.badge}`} />
                    <h4 className={`text-xs font-bold uppercase tracking-wider ${stage.text}`}>
                      {stage.label}
                    </h4>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold ${stage.bg} border ${stage.border} ${stage.text}`}>
                    {stageLeads.length}
                  </span>
                </div>

                {/* Column Cards Container */}
                <div className="p-3 overflow-y-auto space-y-3 flex-1">
                  {stageLeads.length === 0 ? (
                    <div className="py-10 text-center text-slate-400 text-xs border-2 border-dashed border-slate-200 rounded-xl">
                      No leads in {stage.label}
                    </div>
                  ) : (
                    stageLeads.map((lead) => {
                      const cleanPhone = (lead.phone || '').replace(/\D/g, '');
                      const isSelected = selectedInquiryId === lead.id;

                      return (
                        <div
                          key={lead.id}
                          onClick={() => onSelectInquiry(lead)}
                          className={`bg-white rounded-xl border p-3.5 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-2.5 relative group ${
                            isSelected
                              ? 'border-amber-500 ring-2 ring-amber-400/30'
                              : 'border-slate-200/90 hover:border-amber-300'
                          }`}
                        >
                          {/* Card Header: Lead Name & Badge */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="font-bold text-slate-900 text-sm leading-tight flex items-center gap-1.5">
                                {lead.name}
                              </div>
                              <span className="text-[11px] text-slate-500">
                                {new Date(lead.created_at).toLocaleDateString()}
                              </span>
                            </div>

                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                lead.leadType === 'property'
                                  ? 'bg-blue-100 text-blue-800'
                                  : lead.leadType === 'project'
                                  ? 'bg-purple-100 text-purple-800'
                                  : lead.leadType === 'builder'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {lead.leadType}
                            </span>
                          </div>

                          {/* Target Property / Project */}
                          {(lead.propertyTitle || lead.projectName) && (
                            <div className="text-xs text-slate-700 font-semibold bg-slate-50 p-1.5 rounded-lg border border-slate-100 truncate flex items-center gap-1.5">
                              <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{lead.propertyTitle || lead.projectName}</span>
                            </div>
                          )}

                          {/* Message snippet */}
                          {lead.message && (
                            <p className="text-xs text-slate-500 line-clamp-2 italic">
                              "{lead.message}"
                            </p>
                          )}

                          {/* Follow-up date badge */}
                          {lead.followUpDate && (
                            <div className="flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 w-fit">
                              <Calendar className="w-3 h-3" />
                              <span>Follow-up: {new Date(lead.followUpDate).toLocaleDateString()}</span>
                            </div>
                          )}

                          {/* Quick Action Buttons & Status Selector */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              {/* Direct WhatsApp Action */}
                              {cleanPhone && (
                                <a
                                  href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                                    `Hello ${lead.name}, thank you for contacting Veer Real Estate regarding ${
                                      lead.propertyTitle || lead.projectName || 'our listings'
                                    }. How can we assist you?`
                                  )}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-500 text-emerald-700 hover:text-white border border-emerald-200 flex items-center justify-center transition shadow-2xs"
                                  title="WhatsApp Customer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5 fill-current" />
                                </a>
                              )}

                              {/* Direct Phone Call Action */}
                              {lead.phone && (
                                <a
                                  href={`tel:${lead.phone}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white border border-blue-200 flex items-center justify-center transition shadow-2xs"
                                  title="Call Customer"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </a>
                              )}

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onSelectInquiry(lead);
                                }}
                                className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition text-xs"
                                title="View Details Drawer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Move Stage Selector */}
                            <select
                              value={lead.status}
                              onChange={(e) => {
                                e.stopPropagation();
                                onUpdateInquiry(lead.id, e.target.value);
                              }}
                              onClick={(e) => e.stopPropagation()}
                              className="text-[11px] font-bold py-1 px-2 rounded-lg border border-slate-200 bg-white hover:border-amber-400 focus:outline-none cursor-pointer max-w-[130px]"
                            >
                              {CRM_STAGES.map((s) => (
                                <option key={s.id} value={s.id}>
                                  → {s.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

