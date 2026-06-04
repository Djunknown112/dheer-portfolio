import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { SortableList } from "@/components/admin/SortableList";

type Photo = { id: string; caption: string; category: string; image_url: string };

const AdminPhotos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ caption: "", category: "Projects" });
  const [files, setFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchPhotos = async () => {
    const { data } = await supabase.from("photos").select("*").order("sort_order");
    if (data) setPhotos(data);
  };

  useEffect(() => { fetchPhotos(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files || files.length === 0) { toast.error("Select at least one image"); return; }
    setUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = `${Date.now()}-${file.name}`;
      const { error: uploadErr } = await supabase.storage.from("gallery").upload(path, file);
      if (uploadErr) { toast.error(`Upload failed: ${file.name}`); continue; }
      const { data } = supabase.storage.from("gallery").getPublicUrl(path);

      await supabase.from("photos").insert({
        caption: form.caption || file.name,
        category: form.category,
        image_url: data.publicUrl,
      });
    }

    toast.success("Photos uploaded!");
    setShowForm(false);
    setUploading(false);
    fetchPhotos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("photos").delete().eq("id", id);
    toast.success("Deleted");
    fetchPhotos();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">Photo Gallery</h1>
        <button onClick={() => { setShowForm(true); setForm({ caption: "", category: "Projects" }); setFiles(null); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-display font-semibold hover:opacity-90">
          <Plus size={14} /> Upload Photos
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-background/80 z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={20} /></button>
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Upload Photos</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Caption" value={form.caption} onChange={e => setForm({...form, caption: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary">
                <option>Projects</option>
                <option>Achievements</option>
                <option>Events</option>
                <option>Prototypes</option>
              </select>
              <input type="file" accept="image/*" multiple onChange={e => setFiles(e.target.files)} className="w-full text-sm text-foreground" />
              <button type="submit" disabled={uploading} className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-display font-semibold hover:opacity-90 disabled:opacity-50">
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </form>
          </div>
        </div>
      )}

      {photos.length === 0 ? (
        <p className="text-sm text-muted-foreground">No photos yet.</p>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">Hover a photo and drag the handle to reorder.</p>
          <SortableList
            items={photos}
            setItems={setPhotos}
            table="photos"
            layout="grid"
            gridClassName="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {(p) => (
              <div className="relative group rounded-xl overflow-hidden border border-border">
                <img src={p.image_url} alt={p.caption} className="w-full aspect-square object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                  <p className="text-xs text-foreground truncate">{p.caption}</p>
                  <p className="text-[10px] text-muted-foreground">{p.category}</p>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )}
          </SortableList>
        </>
      )}
    </div>
  );
};

export default AdminPhotos;
