
DROP POLICY IF EXISTS "Auth upload project-photos" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete project-photos" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload achievement-photos" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete achievement-photos" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload documents-bucket" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete documents-bucket" ON storage.objects;
DROP POLICY IF EXISTS "Auth upload gallery" ON storage.objects;
DROP POLICY IF EXISTS "Auth delete gallery" ON storage.objects;

CREATE POLICY "Admin upload project-photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'project-photos' AND public.is_admin());
CREATE POLICY "Admin delete project-photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'project-photos' AND public.is_admin());
CREATE POLICY "Admin update project-photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'project-photos' AND public.is_admin()) WITH CHECK (bucket_id = 'project-photos' AND public.is_admin());

CREATE POLICY "Admin upload achievement-photos" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'achievement-photos' AND public.is_admin());
CREATE POLICY "Admin delete achievement-photos" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'achievement-photos' AND public.is_admin());
CREATE POLICY "Admin update achievement-photos" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'achievement-photos' AND public.is_admin()) WITH CHECK (bucket_id = 'achievement-photos' AND public.is_admin());

CREATE POLICY "Admin upload documents-bucket" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'documents' AND public.is_admin());
CREATE POLICY "Admin delete documents-bucket" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'documents' AND public.is_admin());
CREATE POLICY "Admin update documents-bucket" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'documents' AND public.is_admin()) WITH CHECK (bucket_id = 'documents' AND public.is_admin());

CREATE POLICY "Admin upload gallery" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'gallery' AND public.is_admin());
CREATE POLICY "Admin delete gallery" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'gallery' AND public.is_admin());
CREATE POLICY "Admin update gallery" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'gallery' AND public.is_admin()) WITH CHECK (bucket_id = 'gallery' AND public.is_admin());
