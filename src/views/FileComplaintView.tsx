import { useState, useMemo, useEffect } from 'react';
import {
  Brain, Sparkles, Loader2, CheckCircle2, ArrowRight, Copy,
  User, FileText, AlertTriangle, Route, Clock,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { analyzeComplaint, prioritySlaHours, generateTicketNumber } from '../lib/aiEngine';
import { PriorityBadge, SentimentTag } from '../components/Badges';
import type { ViewKey } from '../components/nav';

interface Props {
  setView: (v: ViewKey) => void;
}

type Step = 'form' | 'success';

export function FileComplaintView({ setView }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('form');
  const [ticketNumber, setTicketNumber] = useState('');

  const analysis = useMemo(
    () => (description.trim().length > 12 || title.trim().length > 3 ? analyzeComplaint(title, description) : null),
    [title, description],
  );

  const canSubmit = title.trim().length > 3 && description.trim().length > 12 && citizenName.trim() && phone.trim() && location.trim();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !analysis) return;
    setSubmitting(true);
    setError(null);
    try {
      const { count } = await supabase.from('complaints').select('*', { count: 'exact', head: true });
      const ticket = generateTicketNumber(count ?? 0);
      const sla = prioritySlaHours(analysis.priority);
      const { data, error: insertError } = await supabase
        .from('complaints')
        .insert({
          ticket_number: ticket,
          title: title.trim(),
          description: description.trim(),
          category: analysis.category,
          subcategory: analysis.subcategory,
          priority: analysis.priority,
          status: analysis.suggestedStatus,
          citizen_name: citizenName.trim(),
          citizen_phone: phone.trim(),
          citizen_email: email.trim() || null,
          location: location.trim(),
          city: city.trim(),
          department: analysis.department,
          sentiment: analysis.sentiment,
          ai_confidence: analysis.confidence,
          sla_deadline: new Date(Date.now() + sla * 3600 * 1000).toISOString(),
        })
        .select()
        .single();

      if (insertError || !data) throw insertError ?? new Error('Insert failed');

      await supabase.from('complaint_events').insert([
        { complaint_id: data.id, status: 'submitted', message: 'Complaint filed by citizen and received by SCRS.', actor: 'citizen' },
        ...(analysis.suggestedStatus === 'in_review'
          ? [{ complaint_id: data.id, status: 'in_review' as const, message: 'Auto-escalated to review due to critical priority.', actor: 'system' as const }]
          : []),
      ]);

      setTicketNumber(ticket);
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 'success') {
    return <SuccessScreen ticketNumber={ticketNumber} setView={setView} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">File a Complaint</h1>
        <p className="mt-2 text-neutral-600">Describe your issue in plain language. Our AI engine will categorize and route it instantly.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-5">
          <div className="card p-6">
            <h2 className="font-display font-bold text-lg text-neutral-900 mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary-600" /> Complaint Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="label">Title <span className="text-error-500">*</span></label>
                <input className="input" placeholder="e.g. Large pothole damaging vehicles" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
              </div>
              <div>
                <label className="label">Description <span className="text-error-500">*</span></label>
                <textarea
                  className="input min-h-[140px] resize-y"
                  placeholder="Describe the issue in detail. When and where did you notice it? How is it affecting you or others?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={1500}
                />
                <div className="mt-1 text-right text-xs text-neutral-400">{description.length}/1500</div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-display font-bold text-lg text-neutral-900 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-accent-600" /> Your Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name <span className="text-error-500">*</span></label>
                <input className="input" placeholder="Your name" value={citizenName} onChange={(e) => setCitizenName(e.target.value)} />
              </div>
              <div>
                <label className="label">Phone <span className="text-error-500">*</span></label>
                <input className="input" placeholder="10-digit mobile" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={13} />
              </div>
              <div>
                <label className="label">Email (optional)</label>
                <input className="input" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="label">City</label>
                <input className="input" value={city} onChange={(e) => setCity(e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Location / Landmark <span className="text-error-500">*</span></label>
                <input className="input" placeholder="e.g. MG Road, near metro gate 2" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-error-50 border border-error-200 text-error-700 px-4 py-3 text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <div className="flex items-center gap-3">
            <button type="submit" disabled={!canSubmit || submitting} className="btn-primary text-base">
              {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</> : <><Sparkles className="h-4 w-4" /> Submit Complaint</>}
            </button>
            <button type="button" onClick={() => setView('track')} className="btn-ghost">Cancel</button>
          </div>
        </div>

        {/* Live AI analysis panel */}
        <div className="lg:col-span-2">
          <div className="sticky top-24">
            <div className="card p-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-neutral-900 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-accent-600" /> AI Analysis
                </h2>
                {analysis && (
                  <span className="badge bg-accent-100 text-accent-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-500 animate-pulse-soft" /> Live
                  </span>
                )}
              </div>

              {!analysis ? (
                <div className="rounded-xl border-2 border-dashed border-neutral-200 p-8 text-center">
                  <Brain className="h-10 w-10 text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm text-neutral-400">Start typing a title and description. The AI will analyze your complaint in real time.</p>
                </div>
              ) : (
                <div className="space-y-4 animate-fade-in">
                  <div className="rounded-xl bg-gradient-to-br from-accent-50 to-primary-50 border border-accent-100 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent-700 mb-1">
                      <Route className="h-3.5 w-3.5" /> Routed Department
                    </div>
                    <div className="font-display font-bold text-neutral-900">{analysis.department}</div>
                    <div className="text-xs text-neutral-500 mt-0.5">{analysis.category} → {analysis.subcategory}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Priority</div>
                      <PriorityBadge priority={analysis.priority} />
                    </div>
                    <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-1.5">Sentiment</div>
                      <SentimentTag sentiment={analysis.sentiment} />
                    </div>
                  </div>

                  <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-neutral-500 mb-2">
                      <Clock className="h-3.5 w-3.5" /> Target Resolution (SLA)
                    </div>
                    <div className="text-sm font-bold text-neutral-900">{prioritySlaHours(analysis.priority)} hours</div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-neutral-500">AI Confidence</span>
                      <span className="font-bold text-neutral-900">{Math.round(analysis.confidence * 100)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-accent-400 to-primary-500 transition-all duration-500" style={{ width: `${analysis.confidence * 100}%` }} />
                    </div>
                  </div>

                  {analysis.priority === 'critical' && (
                    <div className="rounded-xl bg-error-50 border border-error-200 p-3 flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-error-600 mt-0.5 shrink-0" />
                      <div className="text-xs text-error-700">
                        <span className="font-bold">Critical urgency detected.</span> This complaint will be escalated for immediate review.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function SuccessScreen({ ticketNumber, setView }: { ticketNumber: string; setView: (v: ViewKey) => void }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
      <div className="card p-8 lg:p-10 text-center animate-fade-up">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success-100 text-success-600 mb-5">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-neutral-900 tracking-tight">Complaint Submitted</h1>
        <p className="mt-3 text-neutral-600">Your complaint has been analyzed, categorized, and routed to the right department. Save your ticket number to track progress.</p>

        <div className="mt-6 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 p-5">
          <div className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-1">Your Ticket Number</div>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-2xl font-bold text-neutral-900 tracking-wider">{ticketNumber}</span>
            <button
              onClick={() => { navigator.clipboard.writeText(ticketNumber); setCopied(true); }}
              className="btn-ghost p-1.5"
              aria-label="Copy ticket"
            >
              {copied ? <CheckCircle2 className="h-4 w-4 text-success-600" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => setView('track')} className="btn-primary">
            Track My Complaints <ArrowRight className="h-4 w-4" />
          </button>
          <button onClick={() => setView('home')} className="btn-secondary">Back to Home</button>
        </div>
      </div>
    </div>
  );
}
