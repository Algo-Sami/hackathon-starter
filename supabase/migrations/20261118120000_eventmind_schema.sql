-- ==============================================================================
-- EVENTMIND AI — COMPREHENSIVE SUPABASE DATABASE SCHEMA
-- Row Level Security (RLS) enabled on EVERY table with explicit policies.
-- Aligned with PRD & Phases 3, 4, 7, 8, 9, 12, 13, 14, 15, 16, 17
-- ==============================================================================

-- 1. Profiles Table Extension
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'Event Organizer',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table was partially created
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT NOT NULL DEFAULT 'Event Organizer';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'email') THEN
    ALTER TABLE public.profiles ADD COLUMN email TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'updated_at') THEN
    ALTER TABLE public.profiles ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are readable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL DEFAULT 'Islamabad, Pakistan',
  event_date TEXT NOT NULL DEFAULT '18 Nov 2026',
  start_time TEXT NOT NULL DEFAULT '01:00 PM',
  end_time TEXT NOT NULL DEFAULT '05:00 PM',
  expected_attendance INTEGER NOT NULL DEFAULT 177,
  number_of_teams INTEGER NOT NULL DEFAULT 50,
  budget_limit NUMERIC NOT NULL DEFAULT 650000,
  current_budget NUMERIC NOT NULL DEFAULT 400050,
  event_status TEXT NOT NULL DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Events are readable by authenticated users" ON public.events;
CREATE POLICY "Events are readable by authenticated users"
  ON public.events FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
CREATE POLICY "Authenticated users can create events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update events" ON public.events;
CREATE POLICY "Authenticated users can update events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete their events" ON public.events;
CREATE POLICY "Authenticated users can delete their events"
  ON public.events FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

-- 3. Event Members Table
CREATE TABLE IF NOT EXISTS public.event_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'Event Organizer',
  membership_status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

ALTER TABLE public.event_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Members can view membership" ON public.event_members;
CREATE POLICY "Members can view membership"
  ON public.event_members FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Members can insert membership" ON public.event_members;
CREATE POLICY "Members can insert membership"
  ON public.event_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Members can update their membership" ON public.event_members;
CREATE POLICY "Members can update their membership"
  ON public.event_members FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Members can delete their membership" ON public.event_members;
CREATE POLICY "Members can delete their membership"
  ON public.event_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. Shared Event Plans Table (Single source of truth per event)
CREATE TABLE IF NOT EXISTS public.shared_event_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE UNIQUE,
  version INTEGER NOT NULL DEFAULT 1,
  is_valid BOOLEAN NOT NULL DEFAULT true,
  event_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  venue_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  catering_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  budget_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  schedule_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  judging_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  staff_details JSONB NOT NULL DEFAULT '{}'::jsonb,
  requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
  risks JSONB NOT NULL DEFAULT '[]'::jsonb,
  pending_questions JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.shared_event_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Shared plan readable by authenticated users" ON public.shared_event_plans;
CREATE POLICY "Shared plan readable by authenticated users"
  ON public.shared_event_plans FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert shared plans" ON public.shared_event_plans;
CREATE POLICY "Authenticated users can insert shared plans"
  ON public.shared_event_plans FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update shared plans" ON public.shared_event_plans;
CREATE POLICY "Authenticated users can update shared plans"
  ON public.shared_event_plans FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Messages Table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_name TEXT NOT NULL DEFAULT 'Anonymous Contributor',
  sender_role TEXT NOT NULL DEFAULT 'Event Contributor',
  message_content TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'voice_transcription', 'document', 'system'
  processing_status TEXT NOT NULL DEFAULT 'completed', -- 'pending', 'processing', 'completed', 'failed', 'queued'
  decision_status TEXT, -- 'accepted', 'rejected', 'unresolved', 'pending'
  decision_reason TEXT,
  affected_sections JSONB DEFAULT '[]'::jsonb,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Messages readable by authenticated users" ON public.messages;
CREATE POLICY "Messages readable by authenticated users"
  ON public.messages FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert messages" ON public.messages;
CREATE POLICY "Authenticated users can insert messages"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update messages" ON public.messages;
CREATE POLICY "Authenticated users can update messages"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 6. Plan Change History Table
CREATE TABLE IF NOT EXISTS public.plan_change_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  message_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  changed_by TEXT NOT NULL,
  changed_by_role TEXT NOT NULL,
  affected_section TEXT NOT NULL,
  previous_value TEXT,
  new_value TEXT,
  change_reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Accepted', -- 'Accepted', 'Rejected', 'Needs Clarification'
  ai_provider TEXT NOT NULL DEFAULT 'gemini',
  ai_model TEXT NOT NULL DEFAULT 'gemini-3.8-flash',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.plan_change_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "History readable by authenticated users" ON public.plan_change_history;
CREATE POLICY "History readable by authenticated users"
  ON public.plan_change_history FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert history" ON public.plan_change_history;
CREATE POLICY "Authenticated users can insert history"
  ON public.plan_change_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 7. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  recipient_role TEXT, -- e.g. 'Finance Person' or target roles
  recipient_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_change_id UUID REFERENCES public.plan_change_history(id) ON DELETE SET NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Notifications readable by authenticated users" ON public.notifications;
CREATE POLICY "Notifications readable by authenticated users"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert notifications" ON public.notifications;
CREATE POLICY "Authenticated users can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update notifications" ON public.notifications;
CREATE POLICY "Authenticated users can update notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 8. AI Requests Table (Queue & Resilient Execution)
CREATE TABLE IF NOT EXISTS public.ai_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_role TEXT NOT NULL DEFAULT 'Event Organizer',
  task_type TEXT NOT NULL DEFAULT 'message_analysis',
  request_payload JSONB NOT NULL,
  request_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  retry_count INTEGER NOT NULL DEFAULT 0,
  next_retry_at TIMESTAMPTZ,
  selected_provider TEXT,
  selected_model TEXT,
  error_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "AI requests readable by authenticated users" ON public.ai_requests;
CREATE POLICY "AI requests readable by authenticated users"
  ON public.ai_requests FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert AI requests" ON public.ai_requests;
CREATE POLICY "Authenticated users can insert AI requests"
  ON public.ai_requests FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update AI requests" ON public.ai_requests;
CREATE POLICY "Authenticated users can update AI requests"
  ON public.ai_requests FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 9. AI Usage Logs Table (Truthful Token & Latency Tracking)
CREATE TABLE IF NOT EXISTS public.ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES public.ai_requests(id) ON DELETE SET NULL,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_role TEXT,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  task_type TEXT NOT NULL DEFAULT 'message_analysis',
  input_tokens INTEGER,
  output_tokens INTEGER,
  total_tokens INTEGER,
  response_time_ms INTEGER NOT NULL DEFAULT 0,
  cache_hit BOOLEAN NOT NULL DEFAULT false,
  fallback_used BOOLEAN NOT NULL DEFAULT false,
  request_status TEXT NOT NULL DEFAULT 'completed',
  error_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.ai_usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usage logs readable by authenticated users" ON public.ai_usage_logs;
CREATE POLICY "Usage logs readable by authenticated users"
  ON public.ai_usage_logs FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert usage logs" ON public.ai_usage_logs;
CREATE POLICY "Authenticated users can insert usage logs"
  ON public.ai_usage_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 10. AI Response Cache Table
CREATE TABLE IF NOT EXISTS public.ai_response_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL UNIQUE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  response_data JSONB NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

ALTER TABLE public.ai_response_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Cache readable by authenticated users" ON public.ai_response_cache;
CREATE POLICY "Cache readable by authenticated users"
  ON public.ai_response_cache FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert cache" ON public.ai_response_cache;
CREATE POLICY "Authenticated users can insert cache"
  ON public.ai_response_cache FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can update cache" ON public.ai_response_cache;
CREATE POLICY "Authenticated users can update cache"
  ON public.ai_response_cache FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can delete expired cache" ON public.ai_response_cache;
CREATE POLICY "Authenticated users can delete expired cache"
  ON public.ai_response_cache FOR DELETE
  TO authenticated
  USING (true);

-- ── Helpful Indexes for Performance ──
CREATE INDEX IF NOT EXISTS idx_messages_event_id ON public.messages(event_id, created_at);
CREATE INDEX IF NOT EXISTS idx_history_event_id ON public.plan_change_history(event_id, created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON public.notifications(recipient_role, is_read);
CREATE INDEX IF NOT EXISTS idx_ai_requests_status ON public.ai_requests(request_status, next_retry_at);
CREATE INDEX IF NOT EXISTS idx_ai_cache_key ON public.ai_response_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_ai_usage_event ON public.ai_usage_logs(event_id, created_at);

-- ── Default Physical Hackathon Event Seed (Islamabad 2026) ──
INSERT INTO public.events (
  id,
  event_name,
  description,
  location,
  event_date,
  start_time,
  end_time,
  expected_attendance,
  number_of_teams,
  budget_limit,
  current_budget,
  event_status
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Physical Hackathon Islamabad',
  'Centralized physical student hackathon in Islamabad with 150 students, 10 staff, 17 judges.',
  'Islamabad, Pakistan',
  '18 Nov 2026',
  '01:00 PM',
  '05:00 PM',
  177,
  50,
  650000,
  400050,
  'active'
)
ON CONFLICT (id) DO NOTHING;

-- ── Default Central Shared Event Plan Seed ──
INSERT INTO public.shared_event_plans (
  id,
  event_id,
  version,
  is_valid,
  event_details,
  venue_details,
  catering_details,
  budget_details,
  schedule_details,
  judging_details,
  staff_details,
  requirements,
  risks,
  pending_questions
)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000001',
  2,
  true,
  '{"eventName": "Physical Hackathon Islamabad", "location": "Islamabad, Pakistan", "headcount": 177, "teams": 50}'::jsonb,
  '{"name": "Islamabad Innovation Hall B (Pak-China Friendship Centre)", "capacity": 220, "cost": 180000, "status": "approved"}'::jsonb,
  '{"headcount": 177, "unitPrice": 650, "deliveryCharges": 5000, "totalCost": 120050, "itemDescription": "Premium Chicken Biryani Box + Cold Drink / Mineral Water"}'::jsonb,
  '{"approvedTotal": 650000, "totalCommitted": 400050, "remainingBalance": 249950, "currency": "PKR"}'::jsonb,
  '{"durationHours": 4.0, "startTime": "01:00 PM", "endTime": "05:00 PM", "prayerBreakIncluded": true}'::jsonb,
  '{"totalTeams": 50, "availableJudges": 17, "teamsPerJudge": 3, "allocationStatus": "feasible"}'::jsonb,
  '{"count": 10, "role": "On-site logistics, registration, audio/visual"}'::jsonb,
  '["150 students across 50 teams", "15-minute mandatory Asr prayer break", "Budget ceiling Rs 650,000"]'::jsonb,
  '["Potential motorway traffic delay for Dr. Tariq accommodated in parallel group 3", "Strict capacity limit: Room D with 80 seats rejected"]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (event_id) DO NOTHING;
