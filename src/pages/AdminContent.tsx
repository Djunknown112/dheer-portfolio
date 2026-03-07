import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";
import { toast } from "sonner";

const contentKeys = [
  { key: "about_paragraph_1", label: "About - Paragraph 1", type: "textarea" as const },
  { key: "about_paragraph_2", label: "About - Paragraph 2", type: "textarea" as const },
  { key: "about_paragraph_3", label: "About - Paragraph 3", type: "textarea" as const },
  { key: "contact_email", label: "Contact Email", type: "input" as const },
  { key: "contact_location", label: "Location", type: "input" as const },
  { key: "hero_subtitle", label: "Hero Subtitle", type: "input" as const },
  { key: "youtube_link", label: "YouTube Channel Link", type: "input" as const },
  { key: "github_link", label: "GitHub Link", type: "input" as const },
  { key: "linkedin_link", label: "LinkedIn Link", type: "input" as const },
];

const AdminContent = () => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from("site_content").select("*");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach(d => { map[d.key] = d.value; });
        setValues(map);
      }
    };
    fetchContent();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    for (const { key } of contentKeys) {
      const val = values[key] || "";
      if (!val) continue;
      const { data: existing } = await supabase.from("site_content").select("id").eq("key", key).maybeSingle();
      if (existing) {
        await supabase.from("site_content").update({ value: val }).eq("key", key);
      } else {
        await supabase.from("site_content").insert({ key, value: val });
      }
    }
    toast.success("Content saved!");
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">Content Editor</h1>
        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-display font-semibold hover:opacity-90 disabled:opacity-50">
          <Save size={14} /> {saving ? "Saving..." : "Save All"}
        </button>
      </div>

      <div className="space-y-4 max-w-2xl">
        {contentKeys.map(({ key, label, type }) => (
          <div key={key}>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">{label}</label>
            {type === "textarea" ? (
              <textarea
                value={values[key] || ""}
                onChange={e => setValues({...values, [key]: e.target.value})}
                rows={3}
                className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
              />
            ) : (
              <input
                value={values[key] || ""}
                onChange={e => setValues({...values, [key]: e.target.value})}
                className="w-full bg-card border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContent;
