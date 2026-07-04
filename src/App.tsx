import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { type ViewKey } from './components/nav';
import { HomeView } from './views/HomeView';
import { FileComplaintView } from './views/FileComplaintView';
import { TrackView } from './views/TrackView';
import { DashboardView } from './views/DashboardView';
import { InsightsView } from './views/InsightsView';
import { PitchView } from './views/PitchView';

export default function App() {
  const [view, setView] = useState<ViewKey>('home');
  const [role, setRole] = useState<'citizen' | 'agent'>('citizen');

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <Navbar view={view} setView={setView} role={role} setRole={setRole} />
      <main className="flex-1 animate-fade-in" key={view}>
        {view === 'home' && <HomeView setView={setView} role={role} setRole={setRole} />}
        {view === 'file' && <FileComplaintView setView={setView} />}
        {view === 'track' && <TrackView role={role} />}
        {view === 'dashboard' && <DashboardView setView={setView} />}
        {view === 'insights' && <InsightsView />}
        {view === 'pitch' && <PitchView />}
      </main>
      <footer className="border-t border-neutral-200/70 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-neutral-500">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success-500 animate-pulse-soft" />
            SCRS • Smart Complaint Resolution System
          </div>
          <div className="text-xs text-neutral-400">Hackathon demo • Supabase-powered • AI-assisted routing</div>
        </div>
      </footer>
    </div>
  );
}
