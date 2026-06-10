
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS user_id uuid;

DROP POLICY IF EXISTS "Public insert reviews" ON public.reviews;
CREATE POLICY "Authenticated users insert own review"
ON public.reviews FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

GRANT INSERT, SELECT ON public.reviews TO authenticated;

DROP FUNCTION IF EXISTS public.get_public_reviews();
CREATE FUNCTION public.get_public_reviews()
RETURNS TABLE(id uuid, name text, rating integer, message text, created_at timestamptz, avatar_hash text, avatar_url text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, name, rating, message, created_at,
         md5(lower(btrim(email))) AS avatar_hash,
         avatar_url
  FROM public.reviews
  WHERE hidden = false
  ORDER BY created_at DESC;
$$;
