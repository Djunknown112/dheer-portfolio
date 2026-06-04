import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Background theme presets: each defines the dark/light surface tokens
// applied as CSS variables on :root. The accent (primary) color is
// configured separately via theme_primary_h/s/l so it stays decoupled.
export type BackgroundTheme = "dark" | "light" | "midnight" | "ocean";

export const backgroundThemes: Record<BackgroundTheme, {
  label: string;
  vars: Record<string, string>;
}> = {
  dark: {
    label: "Dark (default)",
    vars: {
      "--background": "220 20% 7%",
      "--foreground": "210 40% 98%",
      "--card": "220 20% 10%",
      "--card-foreground": "210 40% 98%",
      "--popover": "220 20% 10%",
      "--popover-foreground": "210 40% 98%",
      "--secondary": "220 15% 15%",
      "--secondary-foreground": "210 40% 98%",
      "--muted": "220 15% 15%",
      "--muted-foreground": "215 20% 65%",
      "--border": "220 15% 18%",
      "--input": "220 15% 18%",
    },
  },
  light: {
    label: "Light",
    vars: {
      "--background": "0 0% 100%",
      "--foreground": "220 25% 12%",
      "--card": "0 0% 99%",
      "--card-foreground": "220 25% 12%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "220 25% 12%",
      "--secondary": "220 15% 95%",
      "--secondary-foreground": "220 25% 12%",
      "--muted": "220 15% 95%",
      "--muted-foreground": "220 10% 40%",
      "--border": "220 15% 88%",
      "--input": "220 15% 88%",
    },
  },
  midnight: {
    label: "Midnight Purple",
    vars: {
      "--background": "265 35% 6%",
      "--foreground": "280 30% 96%",
      "--card": "265 30% 10%",
      "--card-foreground": "280 30% 96%",
      "--popover": "265 30% 10%",
      "--popover-foreground": "280 30% 96%",
      "--secondary": "265 25% 16%",
      "--secondary-foreground": "280 30% 96%",
      "--muted": "265 25% 16%",
      "--muted-foreground": "270 15% 65%",
      "--border": "265 25% 20%",
      "--input": "265 25% 20%",
    },
  },
  ocean: {
    label: "Ocean Blue",
    vars: {
      "--background": "215 50% 8%",
      "--foreground": "200 40% 97%",
      "--card": "215 45% 11%",
      "--card-foreground": "200 40% 97%",
      "--popover": "215 45% 11%",
      "--popover-foreground": "200 40% 97%",
      "--secondary": "215 40% 17%",
      "--secondary-foreground": "200 40% 97%",
      "--muted": "215 40% 17%",
      "--muted-foreground": "210 20% 65%",
      "--border": "215 35% 22%",
      "--input": "215 35% 22%",
    },
  },
};

const applyBackgroundTheme = (theme: string | undefined) => {
  const t = (theme && theme in backgroundThemes ? theme : "dark") as BackgroundTheme;
  const root = document.documentElement;
  Object.entries(backgroundThemes[t].vars).forEach(([k, v]) => root.style.setProperty(k, v));
};

export const useThemeLoader = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const { data } = await supabase.from("site_content").select("*");
        if (!data) { setLoaded(true); return; }
        const map: Record<string, string> = {};
        data.forEach(d => { map[d.key] = d.value; });

        applyBackgroundTheme(map["theme_background"]);

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
