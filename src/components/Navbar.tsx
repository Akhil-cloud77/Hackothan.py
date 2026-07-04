import { Shield, User, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { NAV_ITEMS, type ViewKey } from './nav';

interface NavbarProps {
  view: ViewKey;
  setView: (v: ViewKey) => void;
  role: 'citizen' | 'agent';
  setRole: (r: 'citizen' | 'agent') => void;
}

export function Navbar({ view, setView, role, setRole }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-neutral-200/70">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <button
            onClick={() => setView('home')}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-glow transition-transform group-hover:scale-105">
              <Shield className="h-5 w-5" />
            </div>
            <div className="hidden sm:block text-left">
              <div className="font-display font-extrabold text-neutral-900 leading-none tracking-tight">SCRS</div>
              <div className="text-[10px] text-neutral-500 font-medium tracking-wide uppercase">Smart Complaints</div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = view === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setView(item.key)}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all ${
                    active
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 hover:border-neutral-300 transition-all"
              >
                {role === 'citizen' ? <User className="h-4 w-4 text-primary-600" /> : <Shield className="h-4 w-4 text-accent-600" />}
                <span className="hidden sm:inline">{role === 'citizen' ? 'Citizen' : 'Agent'}</span>
                <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 card p-1.5 animate-fade-in">
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-neutral-400">Switch perspective</div>
                  <button
                    onClick={() => { setRole('citizen'); setMenuOpen(false); }}
                    className={`flex items-start gap-3 w-full rounded-lg px-3 py-2.5 text-left transition-colors ${role === 'citizen' ? 'bg-primary-50' : 'hover:bg-neutral-50'}`}
                  >
                    <User className="h-4 w-4 mt-0.5 text-primary-600" />
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">Citizen</div>
                      <div className="text-xs text-neutral-500">File & track complaints</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { setRole('agent'); setMenuOpen(false); }}
                    className={`flex items-start gap-3 w-full rounded-lg px-3 py-2.5 text-left transition-colors ${role === 'agent' ? 'bg-accent-50' : 'hover:bg-neutral-50'}`}
                  >
                    <Shield className="h-4 w-4 mt-0.5 text-accent-600" />
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">Agent / Official</div>
                      <div className="text-xs text-neutral-500">Resolve & analyze queue</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="lg:hidden btn-ghost p-2"
              aria-label="Menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileOpen ? <path d="M6 6l12 12M6 18L18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {mobileOpen && (
          <nav className="lg:hidden pb-4 grid grid-cols-2 gap-2 animate-fade-in">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = view === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => { setView(item.key); setMobileOpen(false); }}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all ${
                    active ? 'bg-primary-50 text-primary-700' : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
