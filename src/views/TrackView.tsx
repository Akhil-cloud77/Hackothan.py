import { useState, useEffect, useCallback } from 'react';
import {
  Search, X, MapPin, Clock, Building2, Phone, Mail, User, Calendar,
  CheckCircle2, Circle, ArrowRight, AlertTriangle, Loader2, Inbox,
} from 'lucide-react';
import { supabase, type Complaint, type ComplaintEvent } from '../lib/supabase';
import { PriorityBadge, StatusBadge, SentimentTag, STATUS_LABEL } from '../components/Badges';
import type { ViewKey } from '../components/nav';

interface Props {
  role: 'citizen' | 'agent';
  setView?: (v: ViewKey) => void;
}

export function TrackView({ role }: Props) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [events, setEvents] = useState<ComplaintEvent[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('complaints').select('*').order('created_at', { ascending: false });
    if (statusFilter !== 'all') q = q.eq('status', statusFilter);
    if (priorityFilter !== 'all') q = q.eq('priority', priorityFilter);
    const { data } = await q.limit(200);
    setComplaints((data as Complaint[]) ?? []);
    setLoading(false);
  }, [statusFilter, priorityFilter]);

  useEffect(() => { load(); }, [load]);

  const filtered = query.trim()
    ? complaints.filter((c) => {
        const tq = query.toLowerCase();
        return (
          c.ticket_number.toLowerCase().includes(tq) ||
          c.title.toLowerCase().includes(tq) ||
          c.location.toLowerCase().includes(tq) ||
          c.citizen_name.toLowerCase().includes(tq) ||
          c.category.toLowerCase().includes(tq)
        );
      })
    : complaints;

  async function openDetail(c: Complaint) {
    setSelected(c);
    const { data } = await supabase
      .from('complaint_events')
      .select('*')
      .eq('complaint_id', c.id)
      .order('created_at', { ascending: true });
    setEvents((data as ComplaintEvent[]) ?? []);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            {role === 'citizen' ? 'Track Complaints' : 'All Complaints'}
          </h1>
          <p className="mt-2 text-neutral-600">
            {role === 'citizen' ? 'Search by ticket number, location, or keyword to follow your complaints.' : 'Full complaint register with filters and detail timeline.'}
          </p>
        </div>
        <div className="text-sm text-neutral-500">{filtered.length} complaint{filtered.length !== 1 ? 's' : ''}</div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            className="input pl-10"
            placeholder="Search ticket number, title, location, name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select className="input w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="in_review">In Review</option>
          <option value="assigned">Assigned</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select className="input w-auto" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-neutral-400">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Inbox className="h-12 w-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500 font-medium">No complaints match your filters.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((c, i) => {
            const overdue = c.sla_deadline && new Date(c.sla_deadline).getTime() < Date.now() && c.status !== 'resolved' && c.status !== 'rejected';
            return (
              <button
                key={c.id}
                onClick={() => openDetail(c)}
                className="card p-5 text-left hover:shadow-glow transition-all duration-200 hover:-translate-y-0.5 animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 40, 400)}ms` }}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="font-mono text-xs font-bold text-primary-600">{c.ticket_number}</span>
                      <PriorityBadge priority={c.priority} />
                      <StatusBadge status={c.status} />
                      {overdue && (
                        <span className="badge bg-error-50 text-error-600"><AlertTriangle className="h-3 w-3" /> SLA Overdue</span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-neutral-900 truncate">{c.title}</h3>
                    <p className="text-sm text-neutral-600 line-clamp-1 mt-1">{c.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {c.location}</span>
                      <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {c.department}</span>
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-neutral-300 shrink-0 mt-1" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selected && (
        <DetailDrawer
          complaint={selected}
          events={events}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}

function DetailDrawer({ complaint, events, onClose }: { complaint: Complaint; events: ComplaintEvent[]; onClose: () => void }) {
  const overdue = complaint.sla_deadline && new Date(complaint.sla_deadline).getTime() < Date.now() && complaint.status !== 'resolved' && complaint.status !== 'rejected';

  return (
    <div className="fixed inset-0 z-[60] flex justify-end animate-fade-in">
      <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg h-full bg-white shadow-2xl overflow-y-auto scrollbar-thin animate-slide-in">
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-neutral-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <span className="font-mono text-sm font-bold text-primary-600">{complaint.ticket_number}</span>
            <h2 className="font-display font-bold text-lg text-neutral-900 mt-0.5">{complaint.title}</h2>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X className="h-5 w-5" /></button>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div className="flex flex-wrap gap-2">
            <PriorityBadge priority={complaint.priority} />
            <StatusBadge status={complaint.status} />
            <SentimentTag sentiment={complaint.sentiment} />
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Description</div>
            <p className="text-sm text-neutral-700 leading-relaxed">{complaint.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <InfoRow icon={Building2} label="Department" value={complaint.department} />
            <InfoRow icon={MapPin} label="Location" value={complaint.location} />
            <InfoRow icon={User} label="Filed by" value={complaint.citizen_name} />
            <InfoRow icon={Phone} label="Phone" value={complaint.citizen_phone} />
            {complaint.citizen_email && <InfoRow icon={Mail} label="Email" value={complaint.citizen_email} />}
            <InfoRow icon={Calendar} label="Filed on" value={new Date(complaint.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} />
            <InfoRow icon={Clock} label="SLA deadline" value={complaint.sla_deadline ? new Date(complaint.sla_deadline).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'} overdue={!!overdue} />
            <InfoRow icon={CheckCircle2} label="AI confidence" value={`${Math.round(complaint.ai_confidence * 100)}%`} />
          </div>

          {/* Timeline */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">Status Timeline</div>
            <div className="relative pl-6">
              <div className="absolute left-[9px] top-1.5 bottom-1.5 w-px bg-neutral-200" />
              <div className="space-y-4">
                {events.length === 0 && <p className="text-sm text-neutral-400">No events recorded.</p>}
                {events.map((ev, i) => {
                  const isLast = i === events.length - 1;
                  return (
                    <div key={ev.id} className="relative">
                      <div className={`absolute -left-6 top-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full ring-4 ring-white ${
                        isLast ? 'bg-primary-500' : 'bg-neutral-300'
                      }`}>
                        {isLast ? <CheckCircle2 className="h-3.5 w-3.5 text-white" /> : <Circle className="h-2 w-2 text-white" />}
                      </div>
                      <div className="text-sm font-semibold text-neutral-900">{STATUS_LABEL[ev.status]}</div>
                      <div className="text-xs text-neutral-500">{ev.message}</div>
                      <div className="text-[11px] text-neutral-400 mt-0.5">
                        {new Date(ev.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })} • by {ev.actor}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, overdue }: { icon: typeof MapPin; label: string; value: string; overdue?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 mb-0.5">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <div className={`text-sm font-medium ${overdue ? 'text-error-600' : 'text-neutral-800'}`}>{value}</div>
    </div>
  );
}
