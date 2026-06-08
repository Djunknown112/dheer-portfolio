import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Save, GripVertical, icons as LucideIcons } from "lucide-react";
import { toast } from "sonner";

interface Skill {
  id: string;
  name: string;
  category: string;
  icon_name: string | null;
  sort_order: number | null;
}

const CATEGORIES = ["Technical", "Soft Skill", "Learning"];

// Preset icons per category — drives the picker dropdown
const PRESET_ICONS: Record<string, string[]> = {
  Technical: ["Cpu", "Code", "Terminal", "Database", "Wrench", "CircuitBoard", "Wifi", "Bot", "Microchip", "Wand2"],
  "Soft Skill": ["Crown", "Users", "Lightbulb", "Puzzle", "Handshake", "MessageCircle", "Target", "Heart", "Smile", "Star"],
  Learning: ["Book", "BookOpen", "GraduationCap", "Lightbulb", "Brain", "Code", "Cpu", "Rocket", "Sparkles", "Library"],
};

const ALL_PRESETS = Array.from(
  new Set(Object.values(PRESET_ICONS).flat())
);

const IconPreview = ({ name, size = 16 }: { name: string | null; size?: number }) => {
  const Icon = (LucideIcons as Record<string, any>)[name || "Cpu"] || LucideIcons.Cpu;
  return <Icon size={size} className="text-primary shrink-0" />;
};

const AdminSkills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  // New skill form
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("Technical");
  const [newIcon, setNewIcon] = useState("Cpu");

  const fetchSkills = async () => {
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("category")
      .order("sort_order", { ascending: true });
    if (data) setSkills(data);
    setLoading(false);
  };

  useEffect(() => { fetchSkills(); }, []);

  // When category changes, reset icon to first preset
  useEffect(() => {
    const presets = PRESET_ICONS[newCategory] || [];
    if (presets.length && !presets.includes(newIcon)) setNewIcon(presets[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newCategory]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    const { error } = await supabase.from("skills").insert({
      name: newName.trim(),
      category: newCategory,
      icon_name: newIcon || "Cpu",
      sort_order: skills.filter(s => s.category === newCategory).length,
    });
    if (error) { toast.error("Failed to add skill"); return; }
    toast.success("Skill added!");
    setNewName("");
    setNewIcon(PRESET_ICONS[newCategory]?.[0] || "Cpu");
    fetchSkills();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("skills").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Skill deleted");
    fetchSkills();
  };

  const handleUpdate = async (skill: Skill) => {
    const { error } = await supabase.from("skills").update({
      name: skill.name,
      category: skill.category,
      icon_name: skill.icon_name,
    }).eq("id", skill.id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success("Updated!");
  };

  const updateSkill = (id: string, field: string, value: string) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  if (loading) return <div className="text-muted-foreground text-sm">Loading...</div>;

  const presetsForNew = PRESET_ICONS[newCategory] || [];

  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl font-bold text-foreground">Skills Manager</h1>

      {/* Add new skill */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-4">
        <h2 className="text-sm font-display font-semibold text-foreground">Add New Skill</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            placeholder="Skill name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          <select
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={newIcon}
            onChange={e => setNewIcon(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
          >
            {presetsForNew.map((ic) => (
              <option key={ic} value={ic}>{ic}</option>
            ))}
          </select>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-display font-semibold hover:opacity-90"
          >
            <Plus size={14} /> Add
          </button>
        </div>

        {/* Visual icon picker for the new skill */}
        <div>
          <p className="text-xs text-muted-foreground mb-2">Pick a preset icon for {newCategory}:</p>
          <div className="flex flex-wrap gap-2">
            {presetsForNew.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setNewIcon(ic)}
                title={ic}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${
                  newIcon === ic
                    ? "border-primary bg-primary/10"
                    : "border-border bg-background hover:border-primary/40"
                }`}
              >
                <IconPreview name={ic} size={18} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Skills list per category */}
      {CATEGORIES.map(cat => {
        const catSkills = skills.filter(s => s.category === cat);
        return (
          <div key={cat}>
            <h2 className="text-sm font-display font-semibold text-primary uppercase tracking-wider mb-3">
              {cat} {catSkills.length > 0 && <span className="text-muted-foreground normal-case ml-1">({catSkills.length})</span>}
            </h2>
            {catSkills.length === 0 ? (
              <p className="text-xs text-muted-foreground italic mb-2">No {cat.toLowerCase()} skills yet.</p>
            ) : (
              <div className="space-y-2">
                {catSkills.map(skill => (
                  <div key={skill.id} className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3">
                    <GripVertical size={16} className="text-muted-foreground shrink-0" />
                    <IconPreview name={skill.icon_name} size={18} />
                    <input
                      value={skill.name}
                      onChange={e => updateSkill(skill.id, "name", e.target.value)}
                      className="flex-1 bg-transparent text-sm text-foreground focus:outline-none min-w-0"
                    />
                    <select
                      value={skill.icon_name || "Cpu"}
                      onChange={e => updateSkill(skill.id, "icon_name", e.target.value)}
                      className="bg-background border border-border rounded px-2 py-1 text-xs text-muted-foreground focus:outline-none max-w-[110px]"
                    >
                      {ALL_PRESETS.map((ic) => (
                        <option key={ic} value={ic}>{ic}</option>
                      ))}
                    </select>
                    <select
                      value={skill.category}
                      onChange={e => updateSkill(skill.id, "category", e.target.value)}
                      className="bg-background border border-border rounded px-2 py-1 text-xs text-muted-foreground focus:outline-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <button onClick={() => handleUpdate(skill)} className="text-primary hover:opacity-80">
                      <Save size={16} />
                    </button>
                    <button onClick={() => handleDelete(skill.id)} className="text-destructive hover:opacity-80">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdminSkills;
