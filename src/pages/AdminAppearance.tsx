import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Upload, Palette } from "lucide-react";
import { toast } from "sonner";
import { themePresets, applyTheme, type ThemePreset } from "@/hooks/useTheme";
import { enhanceImage } from "@/lib/imageEnhance";

type Triple = [string, string, string];

const ColorEditor = ({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: Triple;
  onChange: (v: Triple) => void;
}) => {
  const [h, s, l] = value;
  const color = `hsl(${h}, ${s}%, ${l}%)`;
  return (
    <div className="flex gap-4 items-start">
      <div
        className="w-20 h-20 rounded-xl border border-border shrink-0"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 space-y-2">
        <div>
          <div className="text-sm font-display font-semibold text-foreground">{label}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Hue</span>
            <input
              type="number" min={0} max={360}
              value={h}
              onChange={(e) => onChange([e.target.value, s, l])}
              className="px-2 py-1.5 rounded bg-background border border-border text-xs text-foreground"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Sat %</span>
            <input
              type="number" min={0} max={100}
              value={s}
              onChange={(e) => onChange([h, e.target.value, l])}
              className="px-2 py-1.5 rounded bg-background border border-border text-xs text-foreground"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Light %</span>
            <input
              type="number" min={0} max={100}
              value={l}
              onChange={(e) => onChange([h, s, e.target.value])}
              className="px-2 py-1.5 rounded bg-background border border-border text-xs text-foreground"
            />
          </label>
        </div>
      </div>
    </div>
  );
};

const AdminAppearance = () => {
  const [profileUrl, setProfileUrl] = useState("");
  const [heroUrl, setHeroUrl] = useState("");
  const [primary, setPrimary] = useState<Triple>(["185", "80", "55"]);
  const [secondary, setSecondary] = useState<Triple>(["220", "15", "15"]);
  const [background, setBackground] = useState<Triple>(["220", "20", "7"]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from("site_content").select("*");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach(d => { map[d.key] = d.value; });
        if (map["profile_photo_url"]) setProfileUrl(map["profile_photo_url"]);
        if (map["hero_bg_url"]) setHeroUrl(map["hero_bg_url"]);
        setPrimary([
          map["theme_primary_h"] ?? "185",
          map["theme_primary_s"] ?? "80",
          map["theme_primary_l"] ?? "55",
        ]);
        setSecondary([
          map["theme_secondary_h"] ?? "220",
          map["theme_secondary_s"] ?? "15",
          map["theme_secondary_l"] ?? "15",
        ]);
        setBackground([
          map["theme_background_h"] ?? "220",
          map["theme_background_s"] ?? "20",
          map["theme_background_l"] ?? "7",
        ]);
      }
    };
    fetchContent();
  }, []);

  const uploadFile = async (rawFile: File, bucket: string, path: string) => {
    const file = await enhanceImage(rawFile);
    const ext = file.name.split(".").pop();
    const finalPath = path.replace(/\.[^.]+$/, `.${ext}`);
    const { data, error } = await supabase.storage.from(bucket).upload(finalPath, file, { upsert: true });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "gallery", `profile/profile-photo.${file.name.split('.').pop()}`);
      setProfileUrl(url);
      toast.success("Profile photo uploaded!");
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    }
    setUploading(false);
  };

  const handleHeroUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "gallery", `hero/hero-bg.${file.name.split('.').pop()}`);
      setHeroUrl(url);
      toast.success("Hero background uploaded!");
    } catch (err: any) {
      toast.error("Upload failed: " + err.message);
    }
    setUploading(false);
  };

  const applyPreset = (preset: ThemePreset) => {
    setPrimary(preset.primary);
    setSecondary(preset.secondary);
    setBackground(preset.background);
  };

  const handlePreview = () => {
    applyTheme(primary, secondary, background);
    toast.success("Preview applied locally — Save to keep");
  };

  const handleSave = async () => {
    setSaving(true);
    const entries: Record<string, string> = {
      theme_primary_h: primary[0], theme_primary_s: primary[1], theme_primary_l: primary[2],
      theme_secondary_h: secondary[0], theme_secondary_s: secondary[1], theme_secondary_l: secondary[2],
      theme_background_h: background[0], theme_background_s: background[1], theme_background_l: background[2],
    };
    if (profileUrl) entries["profile_photo_url"] = profileUrl;
    if (heroUrl) entries["hero_bg_url"] = heroUrl;

    for (const [key, value] of Object.entries(entries)) {
      const { data: existing } = await supabase.from("site_content").select("id").eq("key", key).maybeSingle();
      if (existing) {
        await supabase.from("site_content").update({ value }).eq("key", key);
      } else {
        await supabase.from("site_content").insert({ key, value });
      }
    }
    applyTheme(primary, secondary, background);
    toast.success("Appearance saved!");
    setSaving(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-xl font-bold text-foreground">Appearance</h1>
        <div className="flex gap-2">
          <button onClick={handlePreview} className="px-4 py-2 rounded-lg text-xs font-display font-semibold border border-border hover:bg-secondary">
            Preview
          </button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-display font-semibold hover:opacity-90 disabled:opacity-50">
            <Save size={14} /> {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      {/* Profile & Hero Photos */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Upload size={16} className="text-primary" /> Profile Photo
          </h2>
          {profileUrl && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/50 mx-auto">
              <img src={profileUrl} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="block">
            <span className="text-xs text-muted-foreground">Upload new photo</span>
            <input type="file" accept="image/*" onChange={handleProfileUpload} disabled={uploading} className="mt-1 block w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
          </label>
        </div>

        <div className="bg-card border border-border rounded-lg p-5 space-y-4">
          <h2 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
            <Upload size={16} className="text-primary" /> Hero Background
          </h2>
          {heroUrl && (
            <div className="w-full h-24 rounded-lg overflow-hidden border border-border">
              <img src={heroUrl} alt="Hero BG" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="block">
            <span className="text-xs text-muted-foreground">Upload new background</span>
            <input type="file" accept="image/*" onChange={handleHeroUpload} disabled={uploading} className="mt-1 block w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
          </label>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-4 max-w-3xl">
        <h2 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
          <Palette size={16} className="text-primary" /> Color Theme
        </h2>
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">Quick Presets</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {themePresets.map((p) => {
              const isActive =
                p.primary.join() === primary.join() &&
                p.secondary.join() === secondary.join() &&
                p.background.join() === background.join();
              return (
                <button
                  key={p.name}
                  onClick={() => applyPreset(p)}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${isActive ? "border-foreground bg-secondary" : "border-border hover:border-muted-foreground"}`}
                >
                  <div className="flex -space-x-1">
                    <span className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: `hsl(${p.primary[0]},${p.primary[1]}%,${p.primary[2]}%)` }} />
                    <span className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: `hsl(${p.secondary[0]},${p.secondary[1]}%,${p.secondary[2]}%)` }} />
                    <span className="w-6 h-6 rounded-full border border-border" style={{ backgroundColor: `hsl(${p.background[0]},${p.background[1]}%,${p.background[2]}%)` }} />
                  </div>
                  <span className="text-xs font-medium text-foreground">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom Colors */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-5 max-w-3xl">
        <h2 className="font-display text-sm font-semibold text-foreground">Custom Colors</h2>
        <ColorEditor
          label="Primary Color"
          description="Main brand color — buttons, links, highlights"
          value={primary}
          onChange={setPrimary}
        />
        <ColorEditor
          label="Secondary Color"
          description="Muted surfaces — chips, borders, alt panels"
          value={secondary}
          onChange={setSecondary}
        />
        <ColorEditor
          label="Background Color"
          description="Page background base tone (and cards)"
          value={background}
          onChange={setBackground}
        />

        {/* Live Preview */}
        <div
          className="rounded-xl border border-border p-4 space-y-3"
          style={{ backgroundColor: `hsl(${background[0]},${background[1]}%,${background[2]}%)` }}
        >
          <div className="text-xs font-medium" style={{ color: Number(background[2]) > 50 ? "#222" : "#eee" }}>
            Live Preview
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: `hsl(${primary[0]},${primary[1]}%,${primary[2]}%)` }}
            >
              Primary Button
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: `hsl(${secondary[0]},${secondary[1]}%,${secondary[2]}%)` }}
            >
              Secondary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAppearance;
