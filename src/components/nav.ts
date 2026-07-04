import { Home, FilePlus, Search, LayoutDashboard, Lightbulb, Presentation } from 'lucide-react';

export type ViewKey = 'home' | 'file' | 'track' | 'dashboard' | 'insights' | 'pitch';

export const NAV_ITEMS: { key: ViewKey; label: string; icon: typeof Home }[] = [
  { key: 'home', label: 'Home', icon: Home },
  { key: 'file', label: 'File Complaint', icon: FilePlus },
  { key: 'track', label: 'Track', icon: Search },
  { key: 'dashboard', label: 'Agent Console', icon: LayoutDashboard },
  { key: 'insights', label: 'Insights', icon: Lightbulb },
  { key: 'pitch', label: 'Pitch Deck', icon: Presentation },
];

export const VIEW_TITLES: Record<ViewKey, string> = {
  home: 'Home',
  file: 'File a Complaint',
  track: 'Track Complaints',
  dashboard: 'Agent Console',
  insights: 'Market Insights',
  pitch: 'Pitch Deck',
};
