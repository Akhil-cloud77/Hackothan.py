import { useState, useEffect, useCallback } from 'react';
import {
  Loader2, AlertTriangle, Clock, CheckCircle2, MessageSquare,
  TrendingUp, Building2, ChevronRight, X, Brain, Zap, BarChart3,
} from 'lucide-react';
import { supabase, type Complaint, type Status } from '../lib/supabase';
import { PriorityBadge, StatusBadge, STATUS_LABEL } from '../components/Badges';
import type { ViewKey } from '../components/nav';

interface Props {
  setView: (v: ViewKey) => void;
}

const PRIORITY_ORDER: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
const NEXT_STATUS: Record<Status, Status | null> = {
  submitted: 'in_review',
  in_review: 'assigned',
  assigned: 'in_progress',
  in_progress: 'resolved',
  resolved: null,
  rejected: null,
};

export function DashboardView({ setView }: Props) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [actionNote, setActionNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
    setComplaints((data as Complaint[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const active = complaints.filter((c) => !['resolved', 'rejected'].includes(c.status));
  const resolved = complaints.filter((c) => c.status === 'resolved');
  const overdue = active.filter((c) => c.sla_deadline && new Date(c.sla_deadline).getTime() < Date.now());
  const resolutionRate = complaints.length ? Math.round((resolved.length / complaints.length) * 100) : 0;

  const queue = [...active].sort((a, b) => {
    const po = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    if (po !== 0) return po;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });

  const byCategory = aggregate(complaints, 'category');
  const byDepartment = aggregate(complaints, 'department');
  const byStatus = aggregate(complaints, 'status');
  const maxCat = Math.max(1, ...byCategory.map((d) => d.count));

  async function advanceStatus(c: Complaint) {
    const next = NEXT_STATUS[c.status];
    if (!next) return;
    setUpdating(true);
    const patch: Partial<Complaint> = { status: next };
    if (next === 'resolved') patch.resolved_at = new Date().toISOString();
    const { error } = await supabase.from('complaints').update(patch).eq('id', c.id);
    if (error) { setUpdating(false); return; }
    await supabase.from('complaint_events').insert({
      complaint_id: c.id,
      status: next,
      message: actionNote.trim() || `Status advanced to ${STATUS_LABEL[next]}.`,
      actor: 'agent',
    });
    setActionNote('');
    setUpdating(false);
    setSelected(null);
    load();
  }

  async function rejectComplaint(c: Complaint) {
    setUpdating(true);
    const { error } = await supabase.from('complaints').update({ status: 'rejected' }).eq('id', c.id);
    if (error) { setUpdating(false); return; }
    await supabase.from('complaint_events').insert({
      complaint_id: c.id,
      status: 'rejected',
      message: actionNote.trim() || 'Complaint rejected after review.',
      actor: 'agent',
    });
    setActionNote('');
    setUpdating(false);
    setSelected(null);
    load();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">Agent Console</h1>
          <p className="mt-2 text-neutral-600">Priority-ordered work queue with live analytics and SLA monitoring.</p>
        </div>
        <button onClick={() => setView('track')} className="btn-secondary text-sm">
          View full register <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi icon={MessageSquare} label="Total" value={complaints.length} tint="bg-primary-100 text-primary-600" />
        <Kpi icon={Clock} label="Active" value={active.length} tint="bg-warning-100 text-warning-700" />
        <Kpi icon={AlertTriangle} label="Overdue SLA" value={overdue.length} tint="bg-error-100 text-error-600" highlight={overdue.length > 0} />
        <Kpi icon={CheckCircle2} label="Resolution Rate" value={`${resolutionRate}%`} tint="bg-success-100 text-success-700" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-neutral-400"><Loader2 className="h-6 w-6 animate-spin" /></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Analytics */}
          <div className="lg:col-span-1 space-y-6">
            <div className="card p-5">
              <h3 className="font-display font-bold text-neutral-900 mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary-600" /> By Category</h3>
              <div className="space-y-3">
                {byCategory.map((c) => (
                  <div key={c.key}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-neutral-700">{c.key}</span>
                      <span className="font-bold text-neutral-900">{c.count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-400 to-accent-400 transition-all duration-700" style={{ width: `${(c.count / maxCat) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-display font-bold text-neutral-900 mb-4 flex items-center gap-2"><Building2 className="h-4 w-4 text-accent-600" /> Department Load</h3>
              <div className="space-y-2.5">
                {byDepartment.map((d) => (
                  <div key={d.key} className="flex items-center justify-between text-sm">
                    <span className="text-neutral-600 truncate pr-2">{d.key}</span>
                    <span className="badge bg-neutral-100 text-neutral-600 shrink-0">{d.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-5">
              <h3 className="font-display font-bold text-neutral-900 mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-success-600" /> Status Breakdown</h3>
              <div className="grid grid-cols-2 gap-2">
                {byStatus.map((s) => (
                  <div key={s.key} className="rounded-lg bg-neutral-50 px-3 py-2">
                    <div className="text-lg font-display font-bold text-neutral-900">{s.count}</div>
                    <div className="text-xs text-neutral-500">{STATUS_LABEL[s.key as Status] ?? s.key}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Priority queue */}
          <div className="lg:col-span-2">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-neutral-900 flex items-center gap-2"><Zap className="h-4 w-4 text-warning-600" /> Priority Queue</h3>
                <span className="text-xs text-neutral-400">{queue.length} active</span>
              </div>
              {queue.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-10 w-10 text-success-300 mx-auto mb-2" />
                  <p className="text-neutral-500 font-medium">Queue is clear. All complaints resolved.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[640px] overflow-y-auto scrollbar-thin pr-1">
                  {queue.map((c) => {
                    const isOverdue = c.sla_deadline && new Date(c.sla_deadline).getTime() < Date.now();
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelected(c)}
                        className={`w-full text-left rounded-xl border p-4 transition-all hover:shadow-soft hover:-translate-y-0.5 ${
                          isOverdue ? 'border-error-200 bg-error-50/40' : 'border-neutral-200 bg-white hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="font-mono text-[11px] font-bold text-primary-600">{c.ticket_number}</span>
                              <PriorityBadge priority={c.priority} />
                              <StatusBadge status={c.status} />
                              {isOverdue && <span className="badge bg-error-100 text-error-700"><AlertTriangle className="h-3 w-3" /> Overdue</span>}
                            </div>
                            <div className="font-semibold text-neutral-900 text-sm truncate">{c.title}</div>
                            <div className="text-xs text-neutral-500 mt-1 flex items-center gap-3 flex-wrap">
                              <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {c.department}</span>
                              <span>{new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-neutral-300 shrink-0 mt-1" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selected && (
        <ActionModal
          complaint={selected}
          note={actionNote}
          setNote={setActionNote}
          onClose={() => { setSelected(null); setActionNote(''); }}
          onAdvance={() => advanceStatus(selected)}
          onReject={() => rejectComplaint(selected)}
          updating={updating}
        />
      )}
    </div>
  );
}

function aggregate(items: Complaint[], key: keyof Complaint) {
  const map = new Map<string, number>();
  for (const c of items) {
    const k = String(c[key]);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return Array.from(map.entries()).map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count);
}

function Kpi({ icon: Icon, label, value, tint, highlight }: { icon: typeof Clock; label: string; value: string | number; tint: string; highlight?: boolean }) {
  return (
    <div className={`card p-5 ${highlight ? 'ring-2 ring-error-200' : ''}`}>
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tint} mb-3`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-2xl font-display font-extrabold text-neutral-900">{value}</div>
      <div className="text-xs text-neutral-500 font-medium mt-0.5">{label}</div>
    </div>
  );
}

function ActionModal({ complaint, note, setNote, onClose, onAdvance, onReject, updating }: {
  complaint: Complaint; note: string; setNote: (s: string) => void; onClose: () => void;
  onAdvance: () => void; onReject: () => void; updating: boolean;
}) {
  const next = NEXT_STATUS[complaint.status];
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-neutral-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg card p-6 animate-fade-up">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="font-mono text-xs font-bold text-primary-600">{complaint.ticket_number}</span>
            <h2 className="font-display font-bold text-xl text-neutral-900 mt-1">{complaint.title}</h2>
          </div>
          <button onClick={onClose} className="btn-ghost p-2"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
        </div>

        <p className="text-sm text-neutral-600 leading-relaxed mb-4">{complaint.description}</p>

        <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3 text-sm space-y-1.5 mb-4">
          <div className="flex justify-between"><span className="text-neutral-500">Department</span><span className="font-semibold text-neutral-800">{complaint.department}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">Filed by</span><span className="font-semibold text-neutral-800">{complaint.citizen_name}</span></div>
          <div className="flex justify-between"><span className="text-neutral-500">SLA deadline</span><span className="font-semibold text-neutral-800">{complaint.sla_deadline ? new Date(complaint.sla_deadline).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</span></div>
        </div>

        <div className="mb-4">
          <label className="label">Action note (visible to citizen)</label>
          <textarea className="input min-h-[72px] resize-y" placeholder="Add a note about this status change..." value={note} onChange={(e) => setNote(e.target.value)} />
        </div>

        <div className="flex flex-wrap gap-3">
          {next ? (
            <button onClick={onAdvance} disabled={updating} className="btn-primary">
              {updating ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</> : <><Brain className="h-4 w-4" /> Advance to {STATUS_LABEL[next]}</>}
            </button>
          ) : (
            <span className="badge bg-success-100 text-success-700 px-3 py-2"><CheckCircle2 className="h-4 w-4" /> Terminal status</span>
          )}
          {complaint.status !== 'rejected' && complaint.status !== 'resolved' && (
            <button onClick={onReject} disabled={updating} className="btn bg-error-50 text-error-700 border border-error-200 hover:bg-error-100 px-5 py-3">
              Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
