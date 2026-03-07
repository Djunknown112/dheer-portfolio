import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, X, Upload } from "lucide-react";
import { toast } from "sonner";

type Doc = { id: string; title: string; category: string; file_url: string | null };

const AdminDocuments = () => {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Report Cards" });
  const [file, setFile] = useState<File | null>(null);

  const fetchDocs = async () => {
    const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
    if (data) setDocs(data);
  };

  useEffect(() => { fetchDocs(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let file_url: string | null = null;

    if (file) {
      const path = `${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("documents").upload(path, file);
      if (error) { toast.error("Upload failed"); return; }
      const { data } = supabase.storage.from("documents").getPublicUrl(path);
      file_url = data.publicUrl;
    }

    const { error } = await supabase.from("documents").insert({ title: form.title, category: form.category, file_url });
    if (error) { toast.error(error.message); return; }
    toast.success("Document added!");
    setShowForm(false);
    setFile(null);
    fetchDocs();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await supabase.from("documents").delete().eq("id", id);
    toast.success("Deleted");
    fetchDocs();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">Documents</h1>
        <button onClick={() => { setShowForm(true); setForm({ title: "", category: "Report Cards" }); setFile(null); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-display font-semibold hover:opacity-90">
          <Plus size={14} /> Upload Document
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-background/80 z-50 flex items-start justify-center pt-20 px-4">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"><X size={20} /></button>
            <h2 className="font-display text-lg font-bold text-foreground mb-4">Upload Document</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Document Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary">
                <option>Report Cards</option>
                <option>Certificates</option>
                <option>Projects</option>
                <option>General</option>
              </select>
              <div>
                <label className="text-xs text-muted-foreground">File (PDF or Image)</label>
                <input type="file" accept=".pdf,image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-foreground mt-1" />
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-display font-semibold hover:opacity-90">
                <Upload size={14} className="inline mr-2" />Upload
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {docs.length === 0 && <p className="text-sm text-muted-foreground">No documents yet.</p>}
        {docs.map((d) => (
          <div key={d.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-foreground">{d.title}</h3>
              <p className="text-xs text-muted-foreground">{d.category}</p>
            </div>
            <div className="flex gap-2">
              {d.file_url && <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="p-2 text-primary text-xs hover:underline">View</a>}
              <button onClick={() => handleDelete(d.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDocuments;
