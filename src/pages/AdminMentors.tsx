import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { enhanceImage } from "@/lib/imageEnhance";

type Mentor = {
  id: string;
  name: string;
  description: string | null;
  photo_url: string | null;
  sort_order: number;
};

const db = supabase as any;

const AdminMentors = () => {
  const [items, setItems] = useState<Mentor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Mentor | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchItems = async () => {
    const { data } = await db.from("mentors").select("*").order("sort_order");
    if (data) setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", description: "" });
    setPhotoFile(null);
    setShowForm(true);
  };

  const openEdit = (m: Mentor) => {
    setEditing(m);
    setForm({ name: m.name, description: m.description || "" });
    setPhotoFile(null);
    setShowForm(true);
  };

  const uploadPhoto = async (rawFile: File) => {
    const file = await enhanceImage(rawFile);
    const path = `mentors/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("gallery").upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("gallery").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let photo_url = editing?.photo_url || null;
      if (photoFile) {
        photo_url = await uploadPhoto(photoFile);
      }
      const payload = {
        name: form.name,
        description: form.description || null,
        photo_url,
      };
      if (editing) {
        const { error } = await db.from("mentors").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Mentor updated");
      } else {
        const { error } = await db.from("mentors").insert({ ...payload, sort_order: items.length });
        if (error) throw error;
        toast.success("Mentor added");
      }
      setShowForm(false);
      fetchItems();
    } catch (err: any) {
      toast.error(err.message || "Failed to save mentor");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this mentor?")) return;
    await db.from("mentors").delete().eq("id", id);
    toast.success("Deleted");
    fetchItems();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">My Mentors</h1>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-display font-semibold hover:opacity-90"
        >
          <Plus size={14} /> Add Mentor
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
              {editing ? "Edit" : "New"} Mentor
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                placeholder="Mentor name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
              />
              <textarea
                placeholder="Who are they? (role, why they matter to you, etc.)"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
              />
              <div>
                <label className="text-xs text-muted-foreground">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-foreground mt-1"
                />
                {editing?.photo_url && !photoFile && (
                  <img src={editing.photo_url} alt="" className="w-16 h-16 rounded-full object-cover mt-2" />
                )}
              </div>
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
        <p className="text-sm text-muted-foreground">No mentors yet. Add your first one.</p>
      ) : (
        <div className="space-y-2">
          {items.map((m) => (
            <div key={m.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                {m.photo_url ? (
                  <img src={m.photo_url} alt={m.name} className="w-12 h-12 rounded-full object-cover shrink-0" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 shrink-0" />
                )}
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-foreground truncate">{m.name}</h3>
                  {m.description && (
                    <p className="text-xs text-muted-foreground truncate">{m.description}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(m)} className="p-2 text-muted-foreground hover:text-primary">
                  <Pencil size={16} />
                </button>
                <button onClick={() => handleDelete(m.id)} className="p-2 text-muted-foreground hover:text-destructive">
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

export default AdminMentors;
