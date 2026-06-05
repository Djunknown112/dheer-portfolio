import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Theme presets the admin can apply with one click.
 * Each preset defines Primary, Secondary, and Background as HSL triplets.
 */
export interface ThemePreset {
  name: string;
  primary: [string, string, string];    // [h, s, l]
  secondary: [string, string, string];
  background: [string, string, string];
}

export const themePresets: ThemePreset[] = [
  { name: "Cyber Dark (Default)", primary: ["185", "80", "55"], secondary: ["220", "15", "15"], background: ["220", "20", "7"] },
  { name: "IIRA Orange",         primary: ["28", "85", "48"],  secondary: ["30", "35", "30"],  background: ["40", "33", "96"] },
  { name: "Royal Blue",          primary: ["220", "90", "55"], secondary: ["220", "40", "20"], background: ["220", "20", "97"] },
  { name: "Forest Green",        primary: ["150", "60", "40"], secondary: ["150", "30", "20"], background: ["140", "20", "96"] },
  { name: "Berry Purple",        primary: ["280", "70", "55"], secondary: ["280", "30", "20"], background: ["280", "25", "97"] },
  { name: "Ruby Red",            primary: ["355", "80", "50"], secondary: ["355", "30", "20"], background: ["20", "25", "97"] },
  { name: "Teal Ocean",          primary: ["175", "65", "42"], secondary: ["190", "35", "18"], background: ["190", "25", "97"] },
];

const setVar = (root: HTMLElement, key: string, value: string) => root.style.setProperty(key, value);

const hsl = (h: string, s: string, l: string) => `${h} ${s}% ${l}%`;

const lighten = (h: string, s: string, l: string, amt: number) =>
  hsl(h, s, String(Math.min(100, Math.max(0, Number(l) + amt))));

/**
 * Applies 3 customizable colors as CSS variables across the whole design system.
 * - Primary drives buttons, links, accents, glow.
 * - Secondary drives muted surfaces and borders.
 * - Background drives the page background, cards and popovers.
 * Foreground tokens auto-flip between dark/light text based on background lightness.
 */
export const applyTheme = (
  primary: [string, string, string],
  secondary: [string, string, string],
  background: [string, string, string],
) => {
  const root = document.documentElement;
  const [ph, ps, pl] = primary;
  const [sh, ss, sl] = secondary;
  const [bh, bs, bl] = background;
  const bgLight = Number(bl) > 50;

  const fg = bgLight ? hsl("220", "25", "12") : hsl("210", "40", "98");
  const mutedFg = bgLight ? hsl("220", "10", "40") : hsl("215", "20", "65");
  const cardL = bgLight ? Math.max(0, Number(bl) - 2) : Math.min(100, Number(bl) + 3);
  const borderL = bgLight ? Math.max(0, Number(bl) - 8) : Math.min(100, Number(bl) + 11);

  const primaryHsl = hsl(ph, ps, pl);
  const secondaryHsl = hsl(sh, ss, sl);

  // Background family
  setVar(root, "--background", hsl(bh, bs, bl));
  setVar(root, "--foreground", fg);
  setVar(root, "--card", hsl(bh, bs, String(cardL)));
  setVar(root, "--card-foreground", fg);
  setVar(root, "--popover", hsl(bh, bs, String(cardL)));
  setVar(root, "--popover-foreground", fg);
  setVar(root, "--muted", hsl(bh, bs, String(cardL)));
  setVar(root, "--muted-foreground", mutedFg);
  setVar(root, "--border", hsl(bh, bs, String(borderL)));
  setVar(root, "--input", hsl(bh, bs, String(borderL)));

  // Secondary
  setVar(root, "--secondary", secondaryHsl);
  setVar(root, "--secondary-foreground", Number(sl) > 50 ? hsl("220", "25", "12") : hsl("210", "40", "98"));

  // Primary / accent / ring / glow
  setVar(root, "--primary", primaryHsl);
  setVar(root, "--primary-foreground", Number(pl) > 60 ? hsl("220", "25", "12") : hsl("0", "0", "100"));
  setVar(root, "--accent", primaryHsl);
  setVar(root, "--accent-foreground", Number(pl) > 60 ? hsl("220", "25", "12") : hsl("0", "0", "100"));
  setVar(root, "--ring", primaryHsl);
  setVar(root, "--glow", primaryHsl);
  setVar(root, "--glow-muted", lighten(ph, String(Math.max(0, Number(ps) - 20)), pl, -25));
  setVar(root, "--sidebar-primary", primaryHsl);
  setVar(root, "--sidebar-ring", primaryHsl);
};

export const useThemeLoader = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const { data } = await supabase.from("site_content").select("*");
        const map: Record<string, string> = {};
        if (data) data.forEach(d => { map[d.key] = d.value; });

        const primary: [string, string, string] = [
          map["theme_primary_h"] ?? "185",
          map["theme_primary_s"] ?? "80",
          map["theme_primary_l"] ?? "55",
        ];
        const secondary: [string, string, string] = [
          map["theme_secondary_h"] ?? "220",
          map["theme_secondary_s"] ?? "15",
          map["theme_secondary_l"] ?? "15",
        ];
        const background: [string, string, string] = [
          map["theme_background_h"] ?? "220",
          map["theme_background_s"] ?? "20",
          map["theme_background_l"] ?? "7",
        ];
        applyTheme(primary, secondary, background);
      } catch {
        // fallback to css defaults
      }
      setLoaded(true);
    };
    loadTheme();
  }, []);

  return loaded;
};
