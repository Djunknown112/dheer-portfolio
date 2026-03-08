import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface Highlight {
  id: string;
  label: string;
  description: string;
  icon_name: string | null;
  sort_order: number | null;
}

const AdminAboutHighlights = () => {
  const [items, setItems] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const { data } = await supabase.from("about_highlights").select("*").order("sort_order");
    if (data) setItems(data);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    const { error } = await supabase.from("about_highlights").insert({
      label: "New Highlight",
      description: "Description",
      icon_name: "Star",
      sort_order: items.length,
    });
    if (error) return toast.error(error.message);
    toast.success("Added!");
    fetchItems();
  };

  const handleUpdate = async (item: Highlight) => {
    const { error } = await supabase.from("about_highlights").update({
      label: item.label,
      description: item.description,
      icon_name: item.icon_name,
      sort_order: item.sort_order,
    }).eq("id", item.id);
    if (error) return toast.error(error.message);
    toast.success("Saved!");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this highlight?")) return;
    await supabase.from("about_highlights").delete().eq("id", id);
    toast.success("Deleted!");
    fetchItems();
  };

  const update = (id: string, field: keyof Highlight, value: string | number) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  if (loading) return <div className="text-muted-foreground text-sm">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">About Me – Highlights</h1>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-display font-semibold hover:opacity-90">
          <Plus size={14} /> Add Highlight
        </button>
      </div>

      <div className="space-y-4 max-w-2xl">
        {items.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Label</label>
                <input
                  value={item.label}
                  onChange={e => update(item.id, "label", e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Description</label>
                <input
                  value={item.description}
                  onChange={e => update(item.id, "description", e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Icon Name (Lucide)</label>
                <input
                  value={item.icon_name || ""}
                  onChange={e => update(item.id, "icon_name", e.target.value)}
                  placeholder="e.g. GraduationCap"
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Sort Order</label>
                <input
                  type="number"
                  value={item.sort_order ?? 0}
                  onChange={e => update(item.id, "sort_order", parseInt(e.target.value) || 0)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => handleUpdate(item)} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-semibold hover:opacity-90">
                <Save size={12} /> Save
              </button>
              <button onClick={() => handleDelete(item.id)} className="flex items-center gap-1.5 text-destructive border border-destructive/30 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-destructive/10">
                <Trash2 size={12} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAboutHighlights;
