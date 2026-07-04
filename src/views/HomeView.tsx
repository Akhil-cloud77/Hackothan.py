import { useState, useEffect } from 'react';
import {
  Shield, Zap, Brain, Route, MessageSquare, BarChart3, ArrowRight,
  Users, Clock, CheckCircle2, TrendingUp, MapPin, Cpu,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { ViewKey } from '../components/nav';

interface Props {
  setView: (v: ViewKey) => void;
  role: 'citizen' | 'agent';
  setRole: (r: 'citizen' | 'agent') => void;
}

export function HomeView({ setView, role, setRole }: Props) {
  const [stats, setStats] = useState({ total: 0, resolved: 0, avgHours: 0, active: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('complaints').select('status, created_at, resolved_at');
      if (data) {
        type Row = { status: string; created_at: string; resolved_at: string | null };
        const rows = data as Row[];
        const total = rows.length;
        const resolvedRows = rows.filter((d) => d.status === 'resolved' && d.resolved_at);
        const hours = resolvedRows.length
          ? Math.round(
              resolvedRows.reduce((acc, d) => {
                const ms = new Date(d.resolved_at!).getTime() - new Date(d.created_at).getTime();
                return acc + ms / 3.6e6;
              }, 0) / resolvedRows.length,
            )
          : 0;
        setStats({
          total,
          resolved: rows.filter((d) => d.status === 'resolved').length,
          avgHours: hours,
          active: rows.filter((d) => !['resolved', 'rejected'].includes(d.status)).length,
        });
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-accent-950 text-white">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-accent-500/40 blur-3xl" />
          <div className="absolute top-1/3 -left-24 h-80 w-80 rounded-full bg-primary-400/30 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3.5 py-1.5 text-xs font-semibold backdrop-blur-sm mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-success-400 animate-pulse-soft" />
                AI-Powered Civic Grievance Platform
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
                Complaints that get <span className="bg-gradient-to-r from-accent-300 to-primary-200 bg-clip-text text-transparent">resolved</span>, not buried.
              </h1>
              <p className="mt-6 text-lg text-primary-100/90 leading-relaxed max-w-xl">
                Citizens file grievances in plain language. SCRS auto-categorizes,
                scores priority by urgency, routes to the right department, and
                tracks every step to resolution — transparently.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => setView('file')} className="btn bg-white text-primary-700 hover:bg-primary-50 px-6 py-3.5 text-base">
                  File a Complaint <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => setView('dashboard')} className="btn bg-white/10 text-white border border-white/25 hover:bg-white/20 px-6 py-3.5 text-base backdrop-blur-sm">
                  View Agent Console
                </button>
              </div>
              <div className="mt-8 flex items-center gap-6 text-sm text-primary-100/80">
                <div className="flex items-center gap-2"><Cpu className="h-4 w-4" /> AI auto-routing</div>
                <div className="flex items-center gap-2"><Clock className="h-4 w-4" /> SLA tracking</div>
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Geo-tagged</div>
              </div>
            </div>

            {/* Live mini dashboard preview */}
            <div className="animate-fade-up [animation-delay:150ms]">
              <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <div className="text-sm font-semibold text-white/80">Live Platform Snapshot</div>
                  <div className="flex items-center gap-1.5 text-xs text-success-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-success-400 animate-pulse-soft" /> Real-time
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <StatCard icon={MessageSquare} label="Total Complaints" value={loading ? '—' : stats.total} tint="from-primary-400/30 to-primary-500/10" />
                  <StatCard icon={Clock} label="Active" value={loading ? '—' : stats.active} tint="from-warning-400/30 to-warning-500/10" />
                  <StatCard icon={CheckCircle2} label="Resolved" value={loading ? '—' : stats.resolved} tint="from-success-400/30 to-success-500/10" />
                  <StatCard icon={Zap} label="Avg Resolution" value={loading ? '—' : `${stats.avgHours}h`} tint="from-accent-400/30 to-accent-500/10" />
                </div>
                <div className="mt-4 rounded-2xl bg-white/5 border border-white/10 p-4">
                  <div className="text-xs text-white/60 mb-2 font-semibold uppercase tracking-wider">Resolution Rate</div>
                  <div className="flex items-end gap-3">
                    <div className="text-3xl font-display font-extrabold text-white">
                      {loading || stats.total === 0 ? '—' : `${Math.round((stats.resolved / stats.total) * 100)}%`}
                    </div>
                    <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-success-400 to-accent-400 transition-all duration-1000"
                        style={{ width: loading ? '0%' : `${(stats.resolved / Math.max(stats.total, 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-sm font-bold uppercase tracking-wider text-primary-600 mb-3">How it works</div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">From grievance to resolution in four steps</h2>
          <p className="mt-4 text-neutral-600">No helpline queues. No lost reference numbers. Just describe your problem and SCRS handles the rest.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: MessageSquare, title: '1. Describe', text: 'Citizen writes the complaint in plain language — no forms to puzzle out, no category dropdowns.', iconBg: 'bg-primary-100 text-primary-600' },
            { icon: Brain, title: '2. AI Analyzes', text: 'Engine detects category, subcategory, urgency, and citizen sentiment automatically.', iconBg: 'bg-accent-100 text-accent-600' },
            { icon: Route, title: '3. Auto-Routes', text: 'Routed to the correct department with a priority-based SLA deadline assigned.', iconBg: 'bg-warning-100 text-warning-700' },
            { icon: CheckCircle2, title: '4. Resolves', text: 'Agents work the queue by priority; citizens track every status change live.', iconBg: 'bg-success-100 text-success-700' },
          ].map((s, i) => (
            <div key={i} className="card p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl mb-4 ${s.iconBg}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">{s.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Role switcher CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-5">
          <RoleCard
            active={role === 'citizen'}
            onClick={() => { setRole('citizen'); setView('file'); }}
            icon={Users}
            title="I'm a Citizen"
            text="Report a civic issue and track its resolution with a transparent ticket timeline."
            cta="File a Complaint"
            iconBg="bg-primary-100 text-primary-600"
            ctaColor="text-primary-600"
            activeRing="ring-primary-400"
          />
          <RoleCard
            active={role === 'agent'}
            onClick={() => { setRole('agent'); setView('dashboard'); }}
            icon={Shield}
            title="I'm an Official / Agent"
            text="Work a priority-ordered queue, update statuses, and monitor SLA compliance."
            cta="Open Agent Console"
            iconBg="bg-accent-100 text-accent-600"
            ctaColor="text-accent-600"
            activeRing="ring-accent-400"
          />
        </div>
      </section>

      {/* Feature grid */}
      <section className="bg-white border-y border-neutral-200/70">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-sm font-bold uppercase tracking-wider text-accent-600 mb-3">Why SCRS</div>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">Built for speed, transparency, and trust</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Brain, title: 'NLP Categorization', text: 'Trained keyword + sentiment engine maps free-text complaints to the correct civic department in milliseconds.' },
              { icon: Zap, title: 'Priority Scoring', text: 'Critical-signal detection (school zones, accidents, water outages) auto-escalates urgent complaints to the front of the queue.' },
              { icon: Clock, title: 'SLA Tracking', text: 'Every complaint gets a deadline based on priority. Overdue items are flagged red so nothing slips through.' },
              { icon: Route, title: 'Smart Routing', text: 'No more "wrong department" rejections. Complaints land in the right team inbox on the first try.' },
              { icon: BarChart3, title: 'Analytics', text: 'Officials see category breakdowns, department load, and resolution trends to allocate resources intelligently.' },
              { icon: TrendingUp, title: 'Transparent Trail', text: 'Citizens follow an immutable status timeline — from submitted to resolved — with no black boxes.' },
            ].map((f, i) => (
              <div key={i} className="group rounded-2xl p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors mb-4">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display font-bold text-neutral-900 mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, tint }: { icon: typeof Shield; label: string; value: string | number; tint: string }) {
  return (
    <div className={`rounded-2xl bg-gradient-to-br ${tint} border border-white/15 p-4`}>
      <Icon className="h-5 w-5 text-white/80 mb-3" />
      <div className="text-2xl font-display font-extrabold text-white">{value}</div>
      <div className="text-xs text-white/60 font-medium mt-0.5">{label}</div>
    </div>
  );
}

function RoleCard({ active, onClick, icon: Icon, title, text, cta, iconBg, ctaColor, activeRing }: {
  active: boolean; onClick: () => void; icon: typeof Shield; title: string; text: string; cta: string; iconBg: string; ctaColor: string; activeRing: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`card p-7 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-glow ${active ? `ring-2 ${activeRing}` : ''}`}
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl mb-4 ${iconBg}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="font-display font-bold text-xl text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-600 leading-relaxed mb-5">{text}</p>
      <span className={`inline-flex items-center gap-2 text-sm font-semibold ${ctaColor}`}>
        {cta} <ArrowRight className="h-4 w-4" />
      </span>
    </button>
  );
}
