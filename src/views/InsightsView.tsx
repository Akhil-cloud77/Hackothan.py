import {
  TrendingUp, Target, Users, Lightbulb, Globe, BarChart3,
  AlertCircle, CheckCircle2, ArrowRight, Building2, Smartphone,
} from 'lucide-react';
import type { ViewKey } from '../components/nav';

interface Props {
  setView?: (v: ViewKey) => void;
}

export function InsightsView({ setView }: Props) {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      <div className="mb-10">
        <div className="text-sm font-bold uppercase tracking-wider text-primary-600 mb-2">Market Research</div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">The Civic Grievance Landscape</h1>
        <p className="mt-3 text-neutral-600 max-w-2xl">An analysis of how citizen complaints are handled today — the gaps, the audience, and the trends driving demand for a smarter system.</p>
      </div>

      {/* Existing solutions */}
      <Section icon={Building2} title="Existing Solutions" tint="bg-primary-100 text-primary-600">
        <div className="grid sm:grid-cols-2 gap-4">
          <SolutionCard name="CPGRAMS (India)" desc="Centralized Public Grievance Redress and Monitoring System. The national portal for government grievances. Broad reach but cumbersome forms and slow feedback loops." />
          <SolutionCard name="Municipal Helplines / 1916" desc="Phone-based complaint lines run by city corporations. High friction, no tracking, calls often go unanswered during peak hours." />
          <SolutionCard name="Local App Portals" desc="City-specific apps (e.g. Bangalore One, MCGM 24x7). Fragmented across cities, inconsistent UX, low citizen adoption." />
          <SolutionCard name="Social Media Tagging" desc="Citizens tweet at municipal handles. Reactive, public-shame driven, no structured tracking or SLA." />
        </div>
      </Section>

      {/* Gaps */}
      <Section icon={AlertCircle} title="Gaps & Unmet Needs" tint="bg-error-100 text-error-600">
        <div className="grid sm:grid-cols-2 gap-3">
          <Gap text="No automatic categorization — citizens must know which department to pick, leading to misrouted complaints." />
          <Gap text="No priority intelligence — a broken street light near a school is treated the same as a missing park bench." />
          <Gap text="Black-box status — citizens file and wait blindly with no granular timeline or ETA." />
          <Gap text="No SLA enforcement — deadlines are aspirational, not tracked or surfaced." />
          <Gap text="Fragmented across cities and departments — no unified citizen experience." />
          <Gap text="No sentiment or frustration detection — repeat complainants and angry citizens aren't flagged for de-escalation." />
        </div>
      </Section>

      {/* Target audience */}
      <Section icon={Users} title="Target Audience & Pain Points" tint="bg-accent-100 text-accent-600">
        <div className="grid md:grid-cols-3 gap-4">
          <PersonaCard
            title="Citizens"
            pain="Don't know which department handles their issue. Lose ticket references. Can't tell if anything is happening. Feel ignored."
            need="Plain-language filing and a transparent status timeline."
          />
          <PersonaCard
            title="Municipal Officials"
            pain="Drowning in unsorted complaints. Manual sorting wastes hours. Can't tell what's urgent. No analytics to allocate staff."
            need="Auto-categorized, priority-ordered queue with analytics."
          />
          <PersonaCard
            title="City Administrators"
            pain="No visibility into complaint hotspots, recurring issues, or department performance. Can't make data-driven decisions."
            need="Aggregate dashboards showing trends, load, and resolution rates."
          />
        </div>
      </Section>

      {/* Trends & stats */}
      <Section icon={TrendingUp} title="Trends, Technologies & Stats" tint="bg-success-100 text-success-600">
        <div className="grid sm:grid-cols-2 gap-4">
          <StatCard stat="1.4B+" label="Indian citizens served by municipal bodies — the world's largest civic service population." />
          <StatCard stat="~5M+" label="Public grievances logged via CPGRAMS annually, with rising year-over-year volume." />
          <StatCard stat="700M+" label="Smartphone users in India — mobile-first complaint filing is now viable at scale." />
          <StatCard stat="NLP + LLMs" label="Mature, cheap text-classification APIs make auto-routing production-ready in 2024-25." />
        </div>
        <div className="mt-4 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100 p-5">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-primary-600 mt-0.5 shrink-0" />
            <p className="text-sm text-neutral-700 leading-relaxed">
              <span className="font-bold">The trend window is open.</span> India's Digital India push, the rise of urban local-body apps,
              and the maturity of NLP/LLM tooling converge in 2025 — making an AI-assisted grievance platform both technically
              feasible and politically aligned with smart-city mandates.
            </p>
          </div>
        </div>
      </Section>

      {/* Execution plan */}
      <Section icon={Target} title="Execution Plan — Hackathon Roadmap" tint="bg-warning-100 text-warning-700">
        <div className="space-y-3">
          {[
            { phase: 'Phase 1 · Ideation (0-2h)', items: ['Define MVP scope — file, AI-route, track, agent console.', 'Sketch user flows for citizen + agent personas.', 'Pick tech stack (React + Supabase + NLP engine).'] },
            { phase: 'Phase 2 · Design (2-5h)', items: ['Build design system: color ramps, typography, components.', 'Wireframe all 4 core screens in Figma or on paper.', 'Define complaint schema and status state machine.'] },
            { phase: 'Phase 3 · Development (5-20h)', items: ['Set up Supabase schema + RLS policies + seed data.', 'Build AI categorization + priority + sentiment engine.', 'Implement File, Track, and Agent Console views.', 'Wire live AI analysis panel into the form.'] },
            { phase: 'Phase 4 · Testing & Polish (20-24h)', items: ['Test end-to-end: file → route → track → resolve.', 'Fix edge cases (empty states, overdue SLA, errors).', 'Add animations, hover states, mobile responsiveness.'] },
            { phase: 'Phase 5 · Demo & Pitch (last 1h)', items: ['Prepare 3-min live demo script (golden path).', 'Rehearse pitch — problem, solution, USP, demo, future.', 'Record a backup screencast in case of network issues.'] },
          ].map((p, i) => (
            <div key={i} className="rounded-xl border border-neutral-200 p-4">
              <div className="font-display font-bold text-neutral-900 mb-2">{p.phase}</div>
              <ul className="space-y-1.5">
                {p.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="h-4 w-4 text-success-500 mt-0.5 shrink-0" /> {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 grid sm:grid-cols-4 gap-3">
          {[
            { role: 'Frontend Lead', desc: 'React views, UI, animations' },
            { role: 'Backend / DB Lead', desc: 'Supabase schema, RLS, seed' },
            { role: 'AI / Logic Lead', desc: 'NLP engine, routing, scoring' },
            { role: 'Design + Pitch Lead', desc: 'Visual polish, pitch deck, demo' },
          ].map((r) => (
            <div key={r.role} className="rounded-lg bg-neutral-50 border border-neutral-200 p-3">
              <div className="font-semibold text-sm text-neutral-900">{r.role}</div>
              <div className="text-xs text-neutral-500 mt-0.5">{r.desc}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* MVP & USP */}
      <div className="grid md:grid-cols-2 gap-5 mt-10">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3"><Smartphone className="h-5 w-5 text-primary-600" /><h3 className="font-display font-bold text-lg text-neutral-900">MVP Scope</h3></div>
          <ul className="space-y-2 text-sm text-neutral-600">
            <Bullet>Plain-language complaint filing with live AI analysis panel.</Bullet>
            <Bullet>Auto category + department routing + priority scoring.</Bullet>
            <Bullet>Sentiment detection (neutral / negative / frustrated).</Bullet>
            <Bullet>Priority-based SLA deadline assignment.</Bullet>
            <Bullet>Citizen tracking with immutable status timeline.</Bullet>
            <Bullet>Agent console: priority queue + status advancement.</Bullet>
            <Bullet>Analytics: by category, department, status, resolution rate.</Bullet>
          </ul>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-3"><Lightbulb className="h-5 w-5 text-accent-600" /><h3 className="font-display font-bold text-lg text-neutral-900">Unique Selling Proposition</h3></div>
          <ul className="space-y-2 text-sm text-neutral-600">
            <Bullet><b>Live AI as you type</b> — instant categorization before submit, not after.</Bullet>
            <Bullet><b>Priority intelligence</b> — critical-signal keywords escalate automatically.</Bullet>
            <Bullet><b>Sentiment-aware</b> — frustrated citizens flagged for de-escalation.</Bullet>
            <Bullet><b>SLA enforcement</b> — overdue items turn red in the queue.</Bullet>
            <Bullet><b>Transparent timeline</b> — every status change visible to the citizen.</Bullet>
            <Bullet><b>Scalable</b> — rule-based NLP runs in the browser, zero API cost.</Bullet>
          </ul>
        </div>
      </div>

      {/* Tech stack options */}
      <Section icon={BarChart3} title="Execution Perspectives — Three Tech Stacks" tint="bg-primary-100 text-primary-600">
        <div className="grid md:grid-cols-3 gap-4">
          <StackCard
            label="Option 1 · Rapid Demo"
            stack={['Python', 'Flask', 'SQLite', 'Jinja2']}
            pros="Fastest to prototype. Great if the team is Python-fluent. Simple SSR."
            cons="Limited real-time UI polish. Harder to make it look production-grade."
            best="Teams strong in Python; tight timeframes."
          />
          <StackCard
            label="Option 2 · This Build"
            stack={['React + Vite', 'TypeScript', 'Supabase', 'Tailwind']}
            pros="Beautiful responsive UI, live AI panel, real-time DB, zero backend ops. Deploy in one click."
            cons="JS/React learning curve if team is new to it."
            best="Teams wanting a polished, demo-winning UI."
            highlight
          />
          <StackCard
            label="Option 3 · AI-Native"
            stack={['Next.js', 'OpenAI API', 'Postgres', 'Vercel']}
            pros="LLM-powered categorization and summarization. Highest accuracy on free text."
            cons="API cost per request. Network dependency. Harder to demo offline."
            best="Post-hackathon scaling; teams with LLM experience."
          />
        </div>
      </Section>

      {/* Tips */}
      <Section icon={Globe} title="Tips for Beginners to Win" tint="bg-accent-100 text-accent-600">
        <div className="grid sm:grid-cols-2 gap-3">
          <Tip title="Nail the demo, not the features" text="Judges remember a crisp 3-minute live walkthrough of one golden path, not a feature list. Rehearse it out loud." />
          <Tip title="Tell a story first" text="Open with a relatable pain: 'A pothole near a school went unreported for 3 weeks…' Then show how SCRS would've escalated it in seconds." />
          <Tip title="Show the AI working live" text="Type a complaint with 'school' and 'danger' and let the engine flip it to Critical in front of the judges. That's the wow moment." />
          <Tip title="Innovative but realistic" text="A rule-based NLP engine that runs in-browser is demo-safe and impressive. Don't depend on a paid API that might fail on stage." />
          <Tip title="Design matters" text="A polished UI signals competence. Spend 20% of time on spacing, color hierarchy, and animations — it changes how judges perceive the whole project." />
          <Tip title="Have a backup screencast" text="Record a 60-second demo video as insurance against bad Wi-Fi at the venue. It has saved many teams." />
          <Tip title="Know your numbers" text="Memorize 2-3 stats (grievances per year, smartphone penetration) to drop naturally in the pitch — it builds credibility." />
          <Tip title="End with the roadmap" text="Judges fund momentum. Close with 'next: multilingual NLP, WhatsApp integration, city-wide rollout' to show this isn't a toy." />
        </div>
      </Section>

      {setView && (
        <div className="mt-10 text-center">
          <button onClick={() => setView('pitch')} className="btn-primary text-base">
            See the Pitch Deck <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function Section({ icon: Icon, title, tint, children }: { icon: typeof TrendingUp; title: string; tint: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${tint}`}><Icon className="h-4.5 w-4.5" /></div>
        <h2 className="font-display font-bold text-xl text-neutral-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function SolutionCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="font-semibold text-neutral-900 mb-1">{name}</div>
      <p className="text-sm text-neutral-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function Gap({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg bg-error-50/60 border border-error-100 p-3">
      <AlertCircle className="h-4 w-4 text-error-500 mt-0.5 shrink-0" />
      <p className="text-sm text-neutral-700">{text}</p>
    </div>
  );
}

function PersonaCard({ title, pain, need }: { title: string; pain: string; need: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4">
      <div className="font-display font-bold text-neutral-900 mb-2">{title}</div>
      <div className="text-xs font-bold uppercase tracking-wider text-error-500 mb-1">Pain</div>
      <p className="text-sm text-neutral-600 mb-3">{pain}</p>
      <div className="text-xs font-bold uppercase tracking-wider text-success-600 mb-1">Need</div>
      <p className="text-sm text-neutral-600">{need}</p>
    </div>
  );
}

function StatCard({ stat, label }: { stat: string; label: string }) {
  return (
    <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-4">
      <div className="font-display text-2xl font-extrabold text-primary-600">{stat}</div>
      <div className="text-sm text-neutral-600 mt-1">{label}</div>
    </div>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <CheckCircle2 className="h-4 w-4 text-success-500 mt-0.5 shrink-0" />
      <span>{children}</span>
    </li>
  );
}

function StackCard({ label, stack, pros, cons, best, highlight }: { label: string; stack: string[]; pros: string; cons: string; best: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? 'border-primary-300 ring-2 ring-primary-100 bg-primary-50/30' : 'border-neutral-200'}`}>
      <div className="font-display font-bold text-neutral-900 mb-2">{label}</div>
      <div className="flex flex-wrap gap-1.5 mb-3">
        {stack.map((s) => <span key={s} className="badge bg-neutral-100 text-neutral-600 font-mono text-[11px]">{s}</span>)}
      </div>
      <div className="text-xs font-bold uppercase tracking-wider text-success-600 mb-0.5">Pros</div>
      <p className="text-sm text-neutral-600 mb-2">{pros}</p>
      <div className="text-xs font-bold uppercase tracking-wider text-error-500 mb-0.5">Cons</div>
      <p className="text-sm text-neutral-600 mb-2">{cons}</p>
      <div className="text-xs font-bold uppercase tracking-wider text-primary-600 mb-0.5">Best for</div>
      <p className="text-sm text-neutral-600">{best}</p>
    </div>
  );
}

function Tip({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-neutral-200 p-4 hover:border-accent-200 transition-colors">
      <div className="font-semibold text-neutral-900 mb-1">{title}</div>
      <p className="text-sm text-neutral-600 leading-relaxed">{text}</p>
    </div>
  );
}
