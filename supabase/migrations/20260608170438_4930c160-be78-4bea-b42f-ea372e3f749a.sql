
-- Admin helper
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((auth.jwt() ->> 'email') = 'dheerjoshi2606@gmail.com', false);
$$;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;

-- ===== Reviews: protect emails and hidden rows =====
DROP POLICY IF EXISTS "Public read reviews" ON public.reviews;
CREATE POLICY "Admin read reviews" ON public.reviews FOR SELECT TO authenticated USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.get_public_reviews()
RETURNS TABLE(id uuid, name text, rating int, message text, created_at timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, name, rating, message, created_at
  FROM public.reviews
  WHERE hidden = false
  ORDER BY created_at DESC;
$$;
GRANT EXECUTE ON FUNCTION public.get_public_reviews() TO anon, authenticated;

-- ===== Documents: exclude sensitive categories from public reads =====
DROP POLICY IF EXISTS "Public read documents" ON public.documents;
CREATE POLICY "Public read non-sensitive documents" ON public.documents
  FOR SELECT TO anon, authenticated
  USING (category NOT IN ('Report Cards'));
CREATE POLICY "Admin read all documents" ON public.documents
  FOR SELECT TO authenticated
  USING (public.is_admin());

-- ===== Lock down all write policies to admin only =====
-- projects
DROP POLICY IF EXISTS "Auth insert projects" ON public.projects;
DROP POLICY IF EXISTS "Auth update projects" ON public.projects;
DROP POLICY IF EXISTS "Auth delete projects" ON public.projects;
CREATE POLICY "Admin insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update projects" ON public.projects FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete projects" ON public.projects FOR DELETE TO authenticated USING (public.is_admin());

-- achievements
DROP POLICY IF EXISTS "Auth insert achievements" ON public.achievements;
DROP POLICY IF EXISTS "Auth update achievements" ON public.achievements;
DROP POLICY IF EXISTS "Auth delete achievements" ON public.achievements;
CREATE POLICY "Admin insert achievements" ON public.achievements FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update achievements" ON public.achievements FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete achievements" ON public.achievements FOR DELETE TO authenticated USING (public.is_admin());

-- documents
DROP POLICY IF EXISTS "Auth insert documents" ON public.documents;
DROP POLICY IF EXISTS "Auth update documents" ON public.documents;
DROP POLICY IF EXISTS "Auth delete documents" ON public.documents;
CREATE POLICY "Admin insert documents" ON public.documents FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update documents" ON public.documents FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete documents" ON public.documents FOR DELETE TO authenticated USING (public.is_admin());

-- photos
DROP POLICY IF EXISTS "Auth insert photos" ON public.photos;
DROP POLICY IF EXISTS "Auth update photos" ON public.photos;
DROP POLICY IF EXISTS "Auth delete photos" ON public.photos;
CREATE POLICY "Admin insert photos" ON public.photos FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update photos" ON public.photos FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete photos" ON public.photos FOR DELETE TO authenticated USING (public.is_admin());

-- project_photos
DROP POLICY IF EXISTS "Auth insert project_photos" ON public.project_photos;
DROP POLICY IF EXISTS "Auth update project_photos" ON public.project_photos;
DROP POLICY IF EXISTS "Auth delete project_photos" ON public.project_photos;
CREATE POLICY "Admin insert project_photos" ON public.project_photos FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update project_photos" ON public.project_photos FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete project_photos" ON public.project_photos FOR DELETE TO authenticated USING (public.is_admin());

-- site_content
DROP POLICY IF EXISTS "Auth insert site_content" ON public.site_content;
DROP POLICY IF EXISTS "Auth update site_content" ON public.site_content;
DROP POLICY IF EXISTS "Auth delete site_content" ON public.site_content;
CREATE POLICY "Admin insert site_content" ON public.site_content FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update site_content" ON public.site_content FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete site_content" ON public.site_content FOR DELETE TO authenticated USING (public.is_admin());

-- skills
DROP POLICY IF EXISTS "Auth insert skills" ON public.skills;
DROP POLICY IF EXISTS "Auth update skills" ON public.skills;
DROP POLICY IF EXISTS "Auth delete skills" ON public.skills;
CREATE POLICY "Admin insert skills" ON public.skills FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update skills" ON public.skills FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete skills" ON public.skills FOR DELETE TO authenticated USING (public.is_admin());

-- about_highlights
DROP POLICY IF EXISTS "Auth insert about_highlights" ON public.about_highlights;
DROP POLICY IF EXISTS "Auth update about_highlights" ON public.about_highlights;
DROP POLICY IF EXISTS "Auth delete about_highlights" ON public.about_highlights;
CREATE POLICY "Admin insert about_highlights" ON public.about_highlights FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update about_highlights" ON public.about_highlights FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete about_highlights" ON public.about_highlights FOR DELETE TO authenticated USING (public.is_admin());

-- reviews (admin manage)
DROP POLICY IF EXISTS "Auth delete reviews" ON public.reviews;
DROP POLICY IF EXISTS "Auth update reviews" ON public.reviews;
CREATE POLICY "Admin delete reviews" ON public.reviews FOR DELETE TO authenticated USING (public.is_admin());
CREATE POLICY "Admin update reviews" ON public.reviews FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- contact_messages
DROP POLICY IF EXISTS "Auth read contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Auth delete contact_messages" ON public.contact_messages;
CREATE POLICY "Admin read contact_messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin delete contact_messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.is_admin());

-- ===== Storage: stop public listing of documents bucket =====
-- Public file URLs continue to work via /object/public/, this only blocks API listing.
DROP POLICY IF EXISTS "Public read documents-bucket" ON storage.objects;
CREATE POLICY "Admin list documents-bucket" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'documents' AND public.is_admin());
