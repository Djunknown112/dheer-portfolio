import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

type Achievement = {
  id: string;
  title: string;
  description: string;
  icon_name: string | null;
  date: string | null;
  photo_url: string | null;
};

const AdminAchievements = () => {
  const [items, setItems] = useState<Achievement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "" });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const fetch = async () => {
    const { data } = await supabase.from("achievements").select("*").order("sort_order");
    if (data) setItems(data);
  };

  useEffect(() => { fetch(); }, []);

  const openNew = () => { setEditing(null); setForm({ title: "", description: "", date: "" }); setPhotoFile(null); setShowForm(true); };
  const openEdit = (a: Achievement) => { setEditing(a); setForm({ title: a.title, description: a.description, date: a.date || "" }); setPhotoFile(null); setShowForm(true); };

  const uploadPhoto = async (file: File) => {
    const path = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("achievement-photos").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("achievement-photos").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let photo_url = editing?.photo_url || null;
    if (photoFile) {
      try { photo_url = await uploadPhoto(photoFile); } catch { toast.error("Photo upload failed"); return; }
    }
    const payload = { title: form.title, description: form.description, date: form.date || null, photo_url };

    if (editing) {
      const { error } = await supabase.from("achievements").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Updated!");
    } else {
      const { error } = await supabase.from("achievements").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Created!");
    }
    setShowForm(false);
    fetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("achievements").delete().eq("id", id);
    toast.success("Deleted");
    fetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">Achievements</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-display font-semibold hover:opacity-90">
          <Plus size={14} /> Add Achievement
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-background/80 z-50 flex items-start justify-center pt-20 px-4 overflow-auto">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={20} /></button>
            <h2 className="font-display text-lg font-bold text-foreground mb-4">{editing ? "Edit" : "New"} Achievement</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={3} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" />
              <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary" />
              <div>
                <label className="text-xs text-muted-foreground">Photo</label>
                <input type="file" accept="image/*" onChange={e => setPhotoFile(e.target.files?.[0] || null)} className="w-full text-sm text-foreground mt-1" />
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-display font-semibold hover:opacity-90">
                {editing ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No achievements yet.</p>}
        {items.map((a) => (
          <div key={a.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {a.photo_url && <img src={a.photo_url} alt={a.title} className="w-10 h-10 rounded-lg object-cover" />}
              <div>
                <h3 className="text-sm font-semibold text-foreground">{a.title}</h3>
                <p className="text-xs text-muted-foreground">{a.date}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(a)} className="p-2 text-muted-foreground hover:text-primary"><Pencil size={16} /></button>
              <button onClick={() => handleDelete(a.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAchievements;
