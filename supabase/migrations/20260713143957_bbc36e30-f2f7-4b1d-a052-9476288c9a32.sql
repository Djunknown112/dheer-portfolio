
CREATE TABLE public.fun_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.fun_projects TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.fun_projects TO authenticated;
GRANT ALL ON public.fun_projects TO service_role;
ALTER TABLE public.fun_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read fun_projects" ON public.fun_projects FOR SELECT USING (true);
CREATE POLICY "Admin insert fun_projects" ON public.fun_projects FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admin update fun_projects" ON public.fun_projects FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin delete fun_projects" ON public.fun_projects FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER update_fun_projects_updated_at BEFORE UPDATE ON public.fun_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
