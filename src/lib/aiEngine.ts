import type { Priority, Sentiment, Status } from './supabase';

export interface AnalysisResult {
  category: string;
  subcategory: string;
  department: string;
  priority: Priority;
  sentiment: Sentiment;
  confidence: number;
  suggestedStatus: Status;
}

interface CategoryRule {
  category: string;
  department: string;
  keywords: { match: string[]; subcategory: string }[];
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    category: 'Roads',
    department: 'Roads & Infrastructure',
    keywords: [
      { match: ['pothole', 'potholes', 'crater', 'broken road', 'damaged road'], subcategory: 'Pothole' },
      { match: ['speed breaker', 'speed bump', 'hump'], subcategory: 'Safety' },
      { match: ['footpath', 'sidewalk', 'pavement'], subcategory: 'Footpath' },
      { match: ['road sign', 'signboard', 'direction board'], subcategory: 'Signage' },
    ],
  },
  {
    category: 'Water',
    department: 'Water Supply Board',
    keywords: [
      { match: ['water supply', 'no water', 'low pressure', 'irregular water', 'tanker'], subcategory: 'Supply' },
      { match: ['leak', 'pipe burst', 'pipe leak', 'burst pipe'], subcategory: 'Leakage' },
      { match: ['contaminated', 'dirty water', 'brown water', 'smelly water'], subcategory: 'Quality' },
    ],
  },
  {
    category: 'Electricity',
    department: 'Electricity Board',
    keywords: [
      { match: ['street light', 'streetlight', 'lamp post', 'light pole'], subcategory: 'Street Light' },
      { match: ['power cut', 'no electricity', 'outage', 'load shedding'], subcategory: 'Outage' },
      { match: ['transformer', 'fuse', 'short circuit', 'sparking'], subcategory: 'Fault' },
      { match: ['bill', 'meter', 'meter reading'], subcategory: 'Billing' },
    ],
  },
  {
    category: 'Sanitation',
    department: 'Solid Waste Management',
    keywords: [
      { match: ['garbage', 'waste', 'trash', 'rubbish', 'bin overflow', 'collection'], subcategory: 'Waste Collection' },
      { match: ['drainage', 'drain', 'sewage', 'sewer', 'overflow', 'storm water'], subcategory: 'Drainage' },
      { match: ['park', 'playground', 'equipment', 'swing', 'slide'], subcategory: 'Public Amenities' },
      { match: ['toilet', 'public toilet', 'urination'], subcategory: 'Public Toilet' },
    ],
  },
  {
    category: 'Safety',
    department: 'Traffic Police',
    keywords: [
      { match: ['traffic', 'signal', 'junction', 'jam', 'congestion', 'accident'], subcategory: 'Traffic' },
      { match: ['crime', 'theft', 'robbery', 'harassment', 'unsafe at night', 'street unsafe'], subcategory: 'Law & Order' },
      { match: ['stray dog', 'dog bite', 'dangerous dog'], subcategory: 'Animal Safety' },
    ],
  },
];

const CRITICAL_KEYWORDS = ['child', 'children', 'school', 'hospital', 'accident', 'death', 'danger', 'risk', 'emergency', 'urgent', 'fire', 'blood', 'injury', 'unsafe'];
const HIGH_KEYWORDS = ['no water', 'overflow', 'damaging', 'accident', 'risk', 'week', 'weeks', 'not working', 'broken', 'dead', 'pitch dark', 'unsafe'];
const FRUSTRATION_KEYWORDS = ['frustrated', 'fed up', 'tired', 'again and again', 'useless', 'no response', 'ignored', 'weeks', 'months', 'disappointed', 'urgent', 'please help', 'desperate'];

function containsAny(text: string, words: string[]): boolean {
  return words.some((w) => text.includes(w));
}

export function analyzeComplaint(title: string, description: string): AnalysisResult {
  const text = `${title} ${description}`.toLowerCase();
  let category = 'General';
  let subcategory = 'General';
  let department = 'General Administration';
  let bestScore = 0;

  for (const rule of CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      const hits = kw.match.filter((m) => text.includes(m)).length;
      if (hits > bestScore) {
        bestScore = hits;
        category = rule.category;
        subcategory = kw.subcategory;
        department = rule.department;
      }
    }
  }

  let priority: Priority = 'medium';
  if (containsAny(text, CRITICAL_KEYWORDS)) priority = 'critical';
  else if (containsAny(text, HIGH_KEYWORDS)) priority = 'high';
  else if (bestScore > 0) priority = 'medium';
  else priority = 'low';

  if (containsAny(text, FRUSTRATION_KEYWORDS)) {
    if (priority === 'medium') priority = 'high';
  }

  let sentiment: Sentiment = 'neutral';
  if (containsAny(text, FRUSTRATION_KEYWORDS)) sentiment = 'frustrated';
  else if (containsAny(text, ['bad', 'worst', 'horrible', 'terrible', 'smell', 'dangerous', 'broken', 'dead', 'overflow', 'damaging'])) sentiment = 'negative';
  else if (containsAny(text, ['thank', 'good', 'appreciate', 'happy', 'resolved'])) sentiment = 'positive';

  const confidence = Math.min(0.98, 0.55 + bestScore * 0.18 + (category !== 'General' ? 0.1 : 0));

  const suggestedStatus: Status = priority === 'critical' ? 'in_review' : 'submitted';

  return { category, subcategory, department, priority, sentiment, confidence, suggestedStatus };
}

export function prioritySlaHours(priority: Priority): number {
  switch (priority) {
    case 'critical': return 24;
    case 'high': return 48;
    case 'medium': return 96;
    case 'low': return 168;
  }
}

export function generateTicketNumber(existingCount: number): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const num = String(existingCount + 1).padStart(4, '0');
  return `SCRS-${year}-${num}`;
}
