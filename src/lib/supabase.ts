import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Status =
  | 'submitted'
  | 'in_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'rejected';
export type Sentiment = 'positive' | 'neutral' | 'negative' | 'frustrated';

export interface Complaint {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  category: string;
  subcategory: string | null;
  priority: Priority;
  status: Status;
  citizen_name: string;
  citizen_phone: string;
  citizen_email: string | null;
  location: string;
  city: string;
  department: string;
  sentiment: Sentiment;
  ai_confidence: number;
  sla_deadline: string | null;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export interface ComplaintEvent {
  id: string;
  complaint_id: string;
  status: Status;
  message: string;
  actor: 'citizen' | 'system' | 'agent';
  created_at: string;
}
