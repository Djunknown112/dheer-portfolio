import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type FunProject = {
  id: string;
  name: string;
  category: string | null;
  description: string;
  sort_order: number;
};

const db = supabase as any;

const AdminFunProjects = () => {
  const [items, setItems] = useState<FunProject[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FunProject | null>(null);
  const [form, setForm] = useState({ name: "", category: "", description: "" });
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    const { data } = await db
      .from("fun_projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (data) setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", category: "", description: "" });
    setShowForm(true);
  };

  const openEdit = (fp: FunProject) => {
    setEditing(fp);
    setForm({ name: fp.name, category: fp.category || "", description: fp.description });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        category: form.category || null,
        description: form.description,
      };
      if (editing) {
        const { error } = await db.from("fun_projects").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Fun project updated");
      } else {
        const { error } = await db.from("fun_projects").insert({ ...payload, sort_order: items.length });
        if (error) throw error;
        toast.success("Fun project added");
      }
      setShowForm(false);
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this fun project?")) return;
    await db.from("fun_projects").delete().eq("id", id);
    toast.success("Deleted");
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">Fun Projects</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-display font-semibold hover:opacity-90"
        >
          <Plus size={14} /> Add Fun Project
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-background/80 z-50 flex items-start justify-center pt-20 px-4 overflow-auto">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              {editing ? "Edit" : "New"} Fun Project
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <input
                placeholder="Category (e.g. Game, Web, Prank, Prototype)"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <textarea
                placeholder="Short description (1-2 lines)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={3}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
              />
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-display font-semibold hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving…" : editing ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No fun projects yet. Add your first one.</p>
      ) : (
        <div className="space-y-2">
          {items.map((fp) => (
            <div key={fp.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground truncate">{fp.name}</h3>
                  {fp.category && (
                    <span className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      {fp.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1">{fp.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(fp)} className="p-2 text-muted-foreground hover:text-primary">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(fp.id)} className="p-2 text-muted-foreground hover:text-destructive">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminFunProjects;
