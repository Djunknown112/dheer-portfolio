
CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT TO public USING (true);

-- Anyone can submit a review
CREATE POLICY "Public insert reviews" ON public.reviews FOR INSERT TO public WITH CHECK (true);

-- Only authenticated users (admin) can delete
CREATE POLICY "Auth delete reviews" ON public.reviews FOR DELETE TO authenticated USING (true);
