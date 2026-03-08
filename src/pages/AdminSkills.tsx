import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Save, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface Skill {
  id: string;
  name: string;
  category: string;
  icon_name: string | null;
  sort_order: number | null;
}

const CATEGORIES = ["Technical", "Soft Skill"];

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
    setNewIcon("Cpu");
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

  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl font-bold text-foreground">Skills Manager</h1>

      {/* Add new skill */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3">
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
          <input
            placeholder="Icon name (e.g. Cpu, Crown)"
            value={newIcon}
            onChange={e => setNewIcon(e.target.value)}
            className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
          />
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-display font-semibold hover:opacity-90"
          >
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Skills list */}
      {CATEGORIES.map(cat => {
        const catSkills = skills.filter(s => s.category === cat);
        if (catSkills.length === 0) return null;
        return (
          <div key={cat}>
            <h2 className="text-sm font-display font-semibold text-primary uppercase tracking-wider mb-3">{cat}</h2>
            <div className="space-y-2">
              {catSkills.map(skill => (
                <div key={skill.id} className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3">
                  <GripVertical size={16} className="text-muted-foreground shrink-0" />
                  <input
                    value={skill.name}
                    onChange={e => updateSkill(skill.id, "name", e.target.value)}
                    className="flex-1 bg-transparent text-sm text-foreground focus:outline-none"
                  />
                  <input
                    value={skill.icon_name || ""}
                    onChange={e => updateSkill(skill.id, "icon_name", e.target.value)}
                    placeholder="Icon"
                    className="w-28 bg-transparent text-sm text-muted-foreground focus:outline-none"
                  />
                  <select
                    value={skill.category}
                    onChange={e => updateSkill(skill.id, "category", e.target.value)}
                    className="bg-transparent text-sm text-muted-foreground focus:outline-none"
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
          </div>
        );
      })}
    </div>
  );
};

export default AdminSkills;
