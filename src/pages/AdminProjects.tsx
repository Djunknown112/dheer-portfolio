import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { SortableList } from "@/components/admin/SortableList";

type Project = {
  id: string;
  title: string;
  description: string;
  features: string[];
  technologies: string[];
  youtube_link: string | null;
  website_link: string | null;
  category: string | null;
  sort_order: number | null;
};

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", features: "", technologies: "", youtube_link: "", website_link: "", category: ""
  });

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").order("sort_order");
    if (data) setProjects(data);
  };

  useEffect(() => { fetchProjects(); }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", description: "", features: "", technologies: "", youtube_link: "", website_link: "", category: "" });
    setShowForm(true);
  };

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      features: (p.features || []).join(", "),
      technologies: (p.technologies || []).join(", "),
      youtube_link: p.youtube_link || "",
      website_link: p.website_link || "",
      category: p.category || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description,
      features: form.features.split(",").map(s => s.trim()).filter(Boolean),
      technologies: form.technologies.split(",").map(s => s.trim()).filter(Boolean),
      youtube_link: form.youtube_link || null,
      website_link: form.website_link || null,
      category: form.category || null,
    };

    if (editing) {
      const { error } = await supabase.from("projects").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Project updated!");
    } else {
      const { error } = await supabase.from("projects").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Project created!");
    }
    setShowForm(false);
    fetchProjects();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    toast.success("Project deleted");
    fetchProjects();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-bold text-foreground">Projects</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-display font-semibold hover:opacity-90">
          <Plus size={14} /> Add Project
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-background/80 z-50 flex items-start justify-center pt-20 px-4 overflow-auto">
          <div className="bg-card border border-border rounded-xl p-6 w-full max-w-lg relative">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
            <h2 className="font-display text-lg font-bold text-foreground mb-4">
              {editing ? "Edit Project" : "New Project"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} required rows={3} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none" />
              <input placeholder="Features (comma separated)" value={form.features} onChange={e => setForm({...form, features: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <input placeholder="Technologies (comma separated)" value={form.technologies} onChange={e => setForm({...form, technologies: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <input placeholder="YouTube Link (optional)" value={form.youtube_link} onChange={e => setForm({...form, youtube_link: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <input placeholder="Project Website Link (optional)" value={form.website_link} onChange={e => setForm({...form, website_link: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <input placeholder="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-background border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary" />
              <button type="submit" className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-display font-semibold hover:opacity-90">
                {editing ? "Update" : "Create"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Project list */}
      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects yet. Add your first one!</p>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">Drag the handle on the left to reorder. Top item appears first on the site.</p>
          <SortableList items={projects} setItems={setProjects} table="projects">
            {(p) => (
              <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{p.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-1">{p.description}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(p)} className="p-2 text-muted-foreground hover:text-primary"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                </div>
              </div>
            )}
          </SortableList>
        </>
      )}
    </div>
  );
};

export default AdminProjects;
