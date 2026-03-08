
CREATE TABLE public.about_highlights (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label text NOT NULL,
  description text NOT NULL,
  icon_name text DEFAULT 'Star',
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.about_highlights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read about_highlights" ON public.about_highlights FOR SELECT USING (true);
CREATE POLICY "Auth insert about_highlights" ON public.about_highlights FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update about_highlights" ON public.about_highlights FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete about_highlights" ON public.about_highlights FOR DELETE TO authenticated USING (true);

INSERT INTO public.about_highlights (label, description, icon_name, sort_order) VALUES
  ('Class 10 CBSE', 'PCM track ahead', 'GraduationCap', 1),
  ('B.Tech CSE', 'Career goal', 'Target', 2),
  ('Head Boy', 'School leadership', 'Crown', 3),
  ('Innovator', 'AI & IoT builder', 'Lightbulb', 4);
