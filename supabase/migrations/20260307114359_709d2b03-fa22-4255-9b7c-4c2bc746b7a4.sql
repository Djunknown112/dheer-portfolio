
-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  youtube_link TEXT,
  category TEXT,
  icon_name TEXT DEFAULT 'Cpu',
  color_from TEXT DEFAULT 'emerald-500/20',
  color_to TEXT DEFAULT 'cyan-500/20',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT DEFAULT 'Trophy',
  date DATE,
  photo_url TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  file_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Photos table
CREATE TABLE public.photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  caption TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  image_url TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Project photos (multiple per project)
CREATE TABLE public.project_photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Site content (about, skills, contact info etc.)
CREATE TABLE public.site_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Public read policies (portfolio is public)
CREATE POLICY "Public read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Public read achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Public read documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Public read photos" ON public.photos FOR SELECT USING (true);
CREATE POLICY "Public read project_photos" ON public.project_photos FOR SELECT USING (true);
CREATE POLICY "Public read site_content" ON public.site_content FOR SELECT USING (true);

-- Admin write policies (authenticated users can write)
CREATE POLICY "Auth insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update projects" ON public.projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete projects" ON public.projects FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert achievements" ON public.achievements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update achievements" ON public.achievements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete achievements" ON public.achievements FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert documents" ON public.documents FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update documents" ON public.documents FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete documents" ON public.documents FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert photos" ON public.photos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update photos" ON public.photos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete photos" ON public.photos FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert project_photos" ON public.project_photos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update project_photos" ON public.project_photos FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete project_photos" ON public.project_photos FOR DELETE TO authenticated USING (true);

CREATE POLICY "Auth insert site_content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth update site_content" ON public.site_content FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth delete site_content" ON public.site_content FOR DELETE TO authenticated USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_photos_updated_at BEFORE UPDATE ON public.photos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_content_updated_at BEFORE UPDATE ON public.site_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('project-photos', 'project-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('achievement-photos', 'achievement-photos', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- Storage policies
CREATE POLICY "Public read project-photos" ON storage.objects FOR SELECT USING (bucket_id = 'project-photos');
CREATE POLICY "Auth upload project-photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-photos');
CREATE POLICY "Auth delete project-photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-photos');

CREATE POLICY "Public read achievement-photos" ON storage.objects FOR SELECT USING (bucket_id = 'achievement-photos');
CREATE POLICY "Auth upload achievement-photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'achievement-photos');
CREATE POLICY "Auth delete achievement-photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'achievement-photos');

CREATE POLICY "Public read documents-bucket" ON storage.objects FOR SELECT USING (bucket_id = 'documents');
CREATE POLICY "Auth upload documents-bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents');
CREATE POLICY "Auth delete documents-bucket" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'documents');

CREATE POLICY "Public read gallery" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Auth upload gallery" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "Auth delete gallery" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery');
