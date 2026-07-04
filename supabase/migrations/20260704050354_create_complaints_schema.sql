/*
# Smart Complaint Resolution System - Core Schema

1. New Tables
- `complaints`: Stores citizen complaints with AI-assisted categorization,
  priority scoring, routing to departments, and full lifecycle status.
  Columns:
    - id (uuid PK)
    - ticket_number (text, unique, human-readable e.g. SCRS-25-0001)
    - title (text, short summary)
    - description (text, full complaint text)
    - category (text, e.g. Roads, Water, Electricity, Sanitation, Safety)
    - subcategory (text, finer grain)
    - priority (text: low | medium | high | critical)
    - status (text: submitted | in_review | assigned | in_progress | resolved | rejected)
    - citizen_name (text)
    - citizen_phone (text)
    - citizen_email (text, nullable)
    - location (text, address/landmark)
    - city (text)
    - department (text, assigned department)
    - sentiment (text: positive | neutral | negative | frustrated)
    - ai_confidence (numeric 0-1, confidence of auto-categorization)
    - sla_deadline (timestamptz, target resolution time based on priority)
    - created_at (timestamptz)
    - updated_at (timestamptz)
    - resolved_at (timestamptz, nullable)
- `complaint_events`: Immutable audit trail / status timeline per complaint.
  Columns:
    - id (uuid PK)
    - complaint_id (uuid FK -> complaints.id ON DELETE CASCADE)
    - status (text, the status set at this event)
    - message (text, human-readable note)
    - actor (text: citizen | system | agent)
    - created_at (timestamptz)

2. Security
- Enable RLS on both tables.
- This is a single-tenant demo app with NO sign-in screen, so data is
  intentionally public/shared. Policies use `TO anon, authenticated` so
  the anon-key frontend can read and write its own demo data.

3. Indexes
- complaints(ticket_number) unique lookup
- complaints(status) for dashboard filtering
- complaints(category) for analytics grouping
- complaints(priority) for queue sorting
- complaint_events(complaint_id) for timeline fetch
*/

CREATE TABLE IF NOT EXISTS complaints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number text UNIQUE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  subcategory text,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'submitted',
  citizen_name text NOT NULL,
  citizen_phone text NOT NULL,
  citizen_email text,
  location text NOT NULL,
  city text NOT NULL DEFAULT 'Bengaluru',
  department text NOT NULL DEFAULT 'General Administration',
  sentiment text NOT NULL DEFAULT 'neutral',
  ai_confidence numeric(3,2) DEFAULT 0.00,
  sla_deadline timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_complaints_ticket_number ON complaints(ticket_number);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_priority ON complaints(priority);

CREATE TABLE IF NOT EXISTS complaint_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id uuid NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
  status text NOT NULL,
  message text NOT NULL,
  actor text NOT NULL DEFAULT 'system',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_complaint_id ON complaint_events(complaint_id);

ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_events ENABLE ROW LEVEL SECURITY;

-- complaints: anon + authenticated full CRUD (intentionally public demo data)
DROP POLICY IF EXISTS "anon_select_complaints" ON complaints;
CREATE POLICY "anon_select_complaints" ON complaints FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_complaints" ON complaints;
CREATE POLICY "anon_insert_complaints" ON complaints FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_complaints" ON complaints;
CREATE POLICY "anon_update_complaints" ON complaints FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_complaints" ON complaints;
CREATE POLICY "anon_delete_complaints" ON complaints FOR DELETE
  TO anon, authenticated USING (true);

-- complaint_events: anon + authenticated full CRUD
DROP POLICY IF EXISTS "anon_select_events" ON complaint_events;
CREATE POLICY "anon_select_events" ON complaint_events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_events" ON complaint_events;
CREATE POLICY "anon_insert_events" ON complaint_events FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_events" ON complaint_events;
CREATE POLICY "anon_update_events" ON complaint_events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_events" ON complaint_events;
CREATE POLICY "anon_delete_events" ON complaint_events FOR DELETE
  TO anon, authenticated USING (true);

-- Auto-update updated_at on complaint changes
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS complaints_set_updated_at ON complaints;
CREATE TRIGGER complaints_set_updated_at
  BEFORE UPDATE ON complaints
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();