
-- Contact messages table
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (public form)
CREATE POLICY "Public insert contact_messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Only authenticated can read/delete
CREATE POLICY "Auth read contact_messages" ON public.contact_messages
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Auth delete contact_messages" ON public.contact_messages
  FOR DELETE TO authenticated USING (true);

-- Skills table
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Technical',
  icon_name text DEFAULT 'Cpu',
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read skills" ON public.skills
  FOR SELECT USING (true);

CREATE POLICY "Auth insert skills" ON public.skills
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Auth update skills" ON public.skills
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Auth delete skills" ON public.skills
  FOR DELETE TO authenticated USING (true);
