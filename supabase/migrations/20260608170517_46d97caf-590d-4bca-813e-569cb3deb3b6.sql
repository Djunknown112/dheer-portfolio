
DROP POLICY IF EXISTS "Public read project-photos" ON storage.objects;
DROP POLICY IF EXISTS "Public read achievement-photos" ON storage.objects;
DROP POLICY IF EXISTS "Public read gallery" ON storage.objects;

CREATE POLICY "Admin list project-photos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'project-photos' AND public.is_admin());

CREATE POLICY "Admin list achievement-photos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'achievement-photos' AND public.is_admin());

CREATE POLICY "Admin list gallery" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'gallery' AND public.is_admin());
