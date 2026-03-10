import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Upload, Palette } from "lucide-react";
import { toast } from "sonner";

const colorPresets = [
  { name: "Cyan (Default)", h: "185", s: "80", l: "55" },
  { name: "Electric Blue", h: "220", s: "90", l: "55" },
  { name: "Purple", h: "270", s: "80", l: "60" },
  { name: "Green", h: "150", s: "70", l: "50" },
  { name: "Orange", h: "30", s: "90", l: "55" },
  { name: "Rose", h: "340", s: "80", l: "55" },
  { name: "Gold", h: "45", s: "90", l: "50" },
  { name: "Teal", h: "170", s: "70", l: "45" },
];

const AdminAppearance = () => {
  const [profileUrl, setProfileUrl] = useState("");
  const [heroUrl, setHeroUrl] = useState("");
  const [primaryH, setPrimaryH] = useState("185");
  const [primaryS, setPrimaryS] = useState("80");
  const [primaryL, setPrimaryL] = useState("55");
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
        if (map["theme_primary_h"]) setPrimaryH(map["theme_primary_h"]);
        if (map["theme_primary_s"]) setPrimaryS(map["theme_primary_s"]);
        if (map["theme_primary_l"]) setPrimaryL(map["theme_primary_l"]);
      }
    };
    fetchContent();
  }, []);

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
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

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setPrimaryH(preset.h);
    setPrimaryS(preset.s);
    setPrimaryL(preset.l);
  };

  const handleSave = async () => {
    setSaving(true);
    const entries: Record<string, string> = {
      theme_primary_h: primaryH,
      theme_primary_s: primaryS,
      theme_primary_l: primaryL,
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
    toast.success("Appearance saved! Changes will reflect on the live site.");
    setSaving(false);
  };

  const previewColor = `hsl(${primaryH}, ${primaryS}%, ${primaryL}%)`;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">Appearance</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-display font-semibold hover:opacity-90 disabled:opacity-50">
          <Save size={14} /> {saving ? "Saving..." : "Save All"}
        </button>
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

      {/* Theme Colors */}
      <div className="bg-card border border-border rounded-lg p-5 space-y-5 max-w-3xl">
        <h2 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
          <Palette size={16} className="text-primary" /> Theme Color
        </h2>

        {/* Color Presets */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground font-medium">Presets</span>
          <div className="flex flex-wrap gap-2">
            {colorPresets.map((preset) => {
              const c = `hsl(${preset.h}, ${preset.s}%, ${preset.l}%)`;
              const isActive = primaryH === preset.h && primaryS === preset.s && primaryL === preset.l;
              return (
                <button
                  key={preset.name}
                  onClick={() => applyPreset(preset)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${isActive ? "border-foreground bg-secondary" : "border-border hover:border-muted-foreground"}`}
                >
                  <span className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: c }} />
                  {preset.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Sliders */}
        <div className="space-y-3">
          <span className="text-xs text-muted-foreground font-medium">Custom Color</span>
          <div className="space-y-2">
            <label className="flex items-center justify-between text-xs text-muted-foreground">
              Hue ({primaryH}°)
              <input type="range" min="0" max="360" value={primaryH} onChange={e => setPrimaryH(e.target.value)} className="w-48 accent-primary" />
            </label>
            <label className="flex items-center justify-between text-xs text-muted-foreground">
              Saturation ({primaryS}%)
              <input type="range" min="0" max="100" value={primaryS} onChange={e => setPrimaryS(e.target.value)} className="w-48 accent-primary" />
            </label>
            <label className="flex items-center justify-between text-xs text-muted-foreground">
              Lightness ({primaryL}%)
              <input type="range" min="20" max="80" value={primaryL} onChange={e => setPrimaryL(e.target.value)} className="w-48 accent-primary" />
            </label>
          </div>
        </div>

        {/* Preview */}
        <div className="flex items-center gap-4 pt-2">
          <span className="text-xs text-muted-foreground">Preview:</span>
          <div className="w-12 h-12 rounded-lg border border-border" style={{ backgroundColor: previewColor }} />
          <div className="space-y-1">
            <span className="block text-sm font-display font-semibold" style={{ color: previewColor }}>Sample Heading</span>
            <span className="block text-xs" style={{ color: previewColor, opacity: 0.7 }}>Sample accent text</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAppearance;
