import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useThemeLoader = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const { data } = await supabase.from("site_content").select("*");
        if (!data) { setLoaded(true); return; }
        const map: Record<string, string> = {};
        data.forEach(d => { map[d.key] = d.value; });

        const h = map["theme_primary_h"];
        const s = map["theme_primary_s"];
        const l = map["theme_primary_l"];

        if (h && s && l) {
          const root = document.documentElement;
          const primary = `${h} ${s}% ${l}%`;
          root.style.setProperty("--primary", primary);
          root.style.setProperty("--accent", primary);
          root.style.setProperty("--ring", primary);
          root.style.setProperty("--glow", primary);
          root.style.setProperty("--sidebar-primary", primary);
          root.style.setProperty("--sidebar-ring", primary);
          root.style.setProperty("--glow-muted", `${h} ${Math.max(0, Number(s) - 20)}% ${Math.max(0, Number(l) - 25)}%`);
        }
      } catch {
        // fallback to CSS defaults
      }
      setLoaded(true);
    };
    loadTheme();
  }, []);

  return loaded;
};
