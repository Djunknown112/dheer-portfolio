DROP FUNCTION IF EXISTS public.get_public_reviews();
CREATE OR REPLACE FUNCTION public.get_public_reviews()
RETURNS TABLE(id uuid, name text, rating int, message text, created_at timestamptz, avatar_hash text)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT id, name, rating, message, created_at,
         md5(lower(btrim(email))) AS avatar_hash
  FROM public.reviews
  WHERE hidden = false
  ORDER BY created_at DESC;
$$;
GRANT EXECUTE ON FUNCTION public.get_public_reviews() TO anon, authenticated;