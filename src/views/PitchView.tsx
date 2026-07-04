import { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Shield, AlertTriangle, TrendingUp,
  Lightbulb, Smartphone, Cpu, Rocket, Users, CheckCircle2,
  Target, Layers,
} from 'lucide-react';

const SLIDES = [
  {
    icon: Shield,
    tint: 'from-primary-600 to-accent-600',
    kicker: 'SCRS',
    title: 'Smart Complaint Resolution System',
    sub: 'AI-powered civic grievance platform that routes, prioritizes, and resolves — transparently.',
    body: null as null | React.ReactNode,
  },
  {
    icon: AlertTriangle,
    tint: 'from-error-600 to-warning-600',
    kicker: 'The Problem',
    title: 'Complaints get filed, then forgotten',
    sub: '',
    body: (
      <ul className="space-y-3 text-lg text-neutral-700">
        <li className="flex gap-3"><span className="text-error-500 font-bold">•</span> Citizens don't know which department to pick — complaints get misrouted and bounced.</li>
        <li className="flex gap-3"><span className="text-error-500 font-bold">•</span> A pothole near a school is treated the same priority as a missing park bench.</li>
        <li className="flex gap-3"><span className="text-error-500 font-bold">•</span> After filing, citizens wait in a black box — no timeline, no ETA, no transparency.</li>
        <li className="flex gap-3"><span className="text-error-500 font-bold">•</span> Officials drown in unsorted inboxes; no analytics to allocate staff intelligently.</li>
      </ul>
    ),
  },
  {
    icon: TrendingUp,
    tint: 'from-primary-600 to-primary-800',
    kicker: 'Market Insights',
    title: 'A massive, underserved market',
    sub: '',
    body: (
      <div className="grid grid-cols-2 gap-4">
        {[
          { n: '1.4B+', l: 'Citizens served by Indian municipal bodies' },
          { n: '~5M+', l: 'Grievances logged via CPGRAMS annually' },
          { n: '700M+', l: 'Smartphone users — mobile-first is viable' },
          { n: '2025', l: 'NLP/LLM tooling is now production-ready' },
        ].map((s) => (
          <div key={s.n} className="rounded-2xl bg-white/10 border border-white/15 p-5">
            <div className="font-display text-4xl font-extrabold text-white">{s.n}</div>
            <div className="text-sm text-primary-100 mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Lightbulb,
    tint: 'from-accent-600 to-primary-600',
    kicker: 'The Solution',
    title: 'Describe it. SCRS handles the rest.',
    sub: '',
    body: (
      <div className="grid grid-cols-4 gap-3">
        {[
          { n: '1', t: 'Describe', d: 'Citizen writes in plain language' },
          { n: '2', t: 'AI Analyzes', d: 'Category, priority, sentiment — instantly' },
          { n: '3', t: 'Auto-Routes', d: 'Right department + SLA deadline' },
          { n: '4', t: 'Resolves', d: 'Citizen tracks every step live' },
        ].map((s) => (
          <div key={s.n} className="rounded-xl bg-white/10 border border-white/15 p-4 text-center">
            <div className="font-display text-3xl font-extrabold text-white mb-1">{s.n}</div>
            <div className="font-bold text-white text-sm">{s.t}</div>
            <div className="text-xs text-primary-100 mt-1">{s.d}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Smartphone,
    tint: 'from-primary-700 to-accent-700',
    kicker: 'MVP',
    title: 'What we built this weekend',
    sub: '',
    body: (
      <div className="grid grid-cols-2 gap-3 text-base text-neutral-700">
        {[
          'Plain-language filing with live AI panel',
          'Auto category + department routing',
          'Priority scoring with critical-signal detection',
          'Sentiment analysis (neutral / frustrated)',
          'SLA deadline assignment by priority',
          'Citizen status timeline tracking',
          'Agent priority queue with status actions',
          'Analytics: category, dept, status, rates',
        ].map((f) => (
          <div key={f} className="flex items-center gap-2.5 rounded-xl bg-white/10 border border-white/15 px-4 py-3">
            <CheckCircle2 className="h-4 w-4 text-success-300 shrink-0" />
            <span className="text-white text-sm">{f}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Cpu,
    tint: 'from-accent-600 to-accent-800',
    kicker: 'USP',
    title: 'Why SCRS stands out',
    sub: '',
    body: (
      <ul className="space-y-3 text-lg">
        {[
          ['Live AI as you type', 'Categorization happens before submit — the wow moment for judges.'],
          ['Priority intelligence', 'Keywords like "school" and "danger" auto-escalate to Critical.'],
          ['Sentiment-aware', 'Frustrated repeat complainants are flagged for de-escalation.'],
          ['Zero API cost', 'Rule-based NLP runs in-browser — demo-safe, no network dependency.'],
          ['SLA enforcement', 'Overdue items turn red in the queue; nothing slips through.'],
        ].map(([t, d]) => (
          <li key={t} className="flex items-start gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white shrink-0"><CheckCircle2 className="h-4 w-4" /></span>
            <div><span className="font-bold text-white">{t}.</span> <span className="text-primary-100">{d}</span></div>
          </li>
        ))}
      </ul>
    ),
  },
  {
    icon: Layers,
    tint: 'from-primary-600 to-primary-900',
    kicker: 'Technology Stack',
    title: 'Built for speed and scale',
    sub: '',
    body: (
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white/10 border border-white/15 p-5">
          <div className="font-bold text-white mb-2">This Build (Option 2)</div>
          {['React + Vite + TypeScript', 'Supabase (Postgres + RLS)', 'Tailwind CSS design system', 'In-browser NLP engine', 'lucide-react icons'].map((s) => (
            <div key={s} className="flex items-center gap-2 text-sm text-primary-100 py-0.5"><span className="h-1.5 w-1.5 rounded-full bg-accent-400" /> {s}</div>
          ))}
        </div>
        <div className="rounded-2xl bg-white/10 border border-white/15 p-5">
          <div className="font-bold text-white mb-2">Scaling Path (Option 3)</div>
          {['Next.js + Vercel edge', 'OpenAI API for LLM routing', 'Multilingual NLP (Indic)', 'WhatsApp bot integration', 'City-wide rollout'].map((s) => (
            <div key={s} className="flex items-center gap-2 text-sm text-primary-100 py-0.5"><span className="h-1.5 w-1.5 rounded-full bg-success-400" /> {s}</div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: Rocket,
    tint: 'from-accent-600 to-primary-700',
    kicker: 'Future Roadmap',
    title: 'From hackathon to city-wide',
    sub: '',
    body: (
      <div className="grid grid-cols-4 gap-3">
        {[
          { p: 'Now', t: 'MVP', d: 'File, route, track, resolve' },
          { p: '+1 mo', t: 'Multilingual', d: 'Hindi, Kannada, Tamil input' },
          { p: '+3 mo', t: 'WhatsApp', d: 'File via chat bot, no app needed' },
          { p: '+6 mo', t: 'City Rollout', d: 'Pilot with 1 municipal corp' },
        ].map((s) => (
          <div key={s.p} className="rounded-xl bg-white/10 border border-white/15 p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-accent-300 mb-1">{s.p}</div>
            <div className="font-bold text-white text-sm">{s.t}</div>
            <div className="text-xs text-primary-100 mt-1">{s.d}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Users,
    tint: 'from-primary-700 to-accent-800',
    kicker: 'Team & Roles',
    title: 'Built by a focused four-person team',
    sub: '',
    body: (
      <div className="grid grid-cols-4 gap-3">
        {[
          { r: 'Frontend Lead', d: 'React views, UI, animations' },
          { r: 'Backend Lead', d: 'Supabase schema, RLS, seed data' },
          { r: 'AI / Logic Lead', d: 'NLP engine, routing, scoring' },
          { r: 'Design + Pitch', d: 'Visual polish, pitch, live demo' },
        ].map((s) => (
          <div key={s.r} className="rounded-xl bg-white/10 border border-white/15 p-4 text-center">
            <div className="flex h-10 w-10 mx-auto items-center justify-center rounded-full bg-white/15 text-white mb-2"><Users className="h-5 w-5" /></div>
            <div className="font-bold text-white text-sm">{s.r}</div>
            <div className="text-xs text-primary-100 mt-1">{s.d}</div>
          </div>
        ))}
      </div>
    ),
  },
  {
    icon: Target,
    tint: 'from-primary-600 to-accent-600',
    kicker: 'The Ask',
    title: 'Complaints that get resolved, not buried.',
    sub: 'SCRS turns a broken civic process into a transparent, intelligent, citizen-first experience.',
    body: (
      <div className="text-center py-6">
        <div className="text-2xl text-white font-display font-bold mb-2">Thank you.</div>
        <div className="text-primary-100">Live demo — file a complaint and watch the AI route it in real time.</div>
      </div>
    ),
  },
];

export function PitchView() {
  const [idx, setIdx] = useState(0);
  const slide = SLIDES[idx];
  const Icon = slide.icon;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-neutral-900 tracking-tight">Pitch Deck</h1>
          <p className="text-sm text-neutral-500">10 slides — use arrow keys or the buttons to navigate.</p>
        </div>
        <div className="text-sm font-semibold text-neutral-400">{idx + 1} / {SLIDES.length}</div>
      </div>

      <div
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br shadow-2xl"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') setIdx((i) => Math.min(i + 1, SLIDES.length - 1));
          if (e.key === 'ArrowLeft') setIdx((i) => Math.max(i - 1, 0));
        }}
        tabIndex={0}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${slide.tint}`} />
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-48 w-48 rounded-full bg-white/5 blur-3xl" />

        <div className="relative p-8 sm:p-12 lg:p-16 min-h-[440px] flex flex-col" key={idx}>
          <div className="animate-fade-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur text-white">
                <Icon className="h-5.5 w-5.5" />
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-white/80">{slide.kicker}</div>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] max-w-3xl">
              {slide.title}
            </h2>
            {slide.sub && <p className="mt-4 text-lg text-primary-100 max-w-2xl">{slide.sub}</p>}
            {slide.body && <div className="mt-8">{slide.body}</div>}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={() => setIdx((i) => Math.max(i - 1, 0))}
          disabled={idx === 0}
          className="btn-secondary"
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>

        <div className="flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all ${i === idx ? 'w-6 bg-primary-600' : 'w-2 bg-neutral-300 hover:bg-neutral-400'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={() => setIdx((i) => Math.min(i + 1, SLIDES.length - 1))}
          disabled={idx === SLIDES.length - 1}
          className="btn-primary"
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
