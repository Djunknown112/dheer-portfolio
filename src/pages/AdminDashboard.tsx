import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FolderKanban, Trophy, FileText, ImageIcon, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ projects: 0, achievements: 0, documents: 0, photos: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [p, a, d, ph] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("achievements").select("id", { count: "exact", head: true }),
        supabase.from("documents").select("id", { count: "exact", head: true }),
        supabase.from("photos").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        projects: p.count ?? 0,
        achievements: a.count ?? 0,
        documents: d.count ?? 0,
        photos: ph.count ?? 0,
      });
    };
    fetchCounts();
  }, []);

  const cards = [
    { label: "Projects", count: counts.projects, icon: FolderKanban, to: "/admin/projects" },
    { label: "Achievements", count: counts.achievements, icon: Trophy, to: "/admin/achievements" },
    { label: "Documents", count: counts.documents, icon: FileText, to: "/admin/documents" },
    { label: "Photos", count: counts.photos, icon: ImageIcon, to: "/admin/photos" },
  ];

  const quickActions = [
    { label: "Add New Project", to: "/admin/projects", icon: FolderKanban },
    { label: "Upload Document", to: "/admin/documents", icon: FileText },
    { label: "Add Achievement", to: "/admin/achievements", icon: Trophy },
    { label: "Upload Photos", to: "/admin/photos", icon: ImageIcon },
  ];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-xl font-bold text-foreground">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link key={c.label} to={c.to} className="bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-colors">
            <c.icon className="text-primary mb-3" size={24} />
            <p className="text-2xl font-display font-bold text-foreground">{c.count}</p>
            <p className="text-xs text-muted-foreground">{c.label}</p>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-display text-sm font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              to={a.to}
              className="flex items-center gap-2 bg-secondary hover:bg-surface-hover text-secondary-foreground rounded-lg px-4 py-3 text-xs font-medium transition-colors"
            >
              <Plus size={14} className="text-primary" />
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
