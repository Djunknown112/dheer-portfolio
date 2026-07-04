import { useEffect, useState } from "react";
import SectionPageShell from "@/components/SectionPageShell";
import PageHead from "@/components/PageHead";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Briefcase, Trophy, Users, Wrench, Image as ImageIcon, FileText, MessageSquare } from "lucide-react";

const SummaryPage = () => {
  const [data, setData] = useState<any>({ projects: [], achievements: [], mentors: [], skills: [], photos: [], docs: [], reviews: [], content: {} });

  useEffect(() => {
    (async () => {
      const [p, a, m, s, ph, d, r, sc] = await Promise.all([
        supabase.from("projects").select("*"),
        supabase.from("achievements").select("*"),
        (supabase.from as any)("mentors").select("*"),
        supabase.from("skills").select("*"),
        supabase.from("photos").select("*"),
        supabase.from("documents").select("*"),
        supabase.rpc("get_public_reviews"),
        supabase.from("site_content").select("*"),
      ]);
      const contentMap: Record<string, string> = {};
      (sc.data || []).forEach((row: any) => { contentMap[row.key] = row.value; });
      setData({
        projects: p.data || [], achievements: a.data || [], mentors: m.data || [],
        skills: s.data || [], photos: ph.data || [], docs: d.data || [],
        reviews: r.data || [], content: contentMap,
      });
    })();
  }, []);

  const Card = ({ icon: Icon, title, count, to, children }: any) => (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <Icon size={18} />
          <h3 className="font-display text-sm font-bold text-foreground">{title}</h3>
        </div>
        <span className="text-xs text-muted-foreground">{count}</span>
      </div>
      {children}
      <Link to={to} className="inline-block text-xs font-display font-semibold text-primary hover:underline">
        View all →
      </Link>
    </div>
  );

  return (
    <SectionPageShell>
      <PageHead title="Summary — Dheer Joshi" description="A one-page recap of Dheer Joshi's projects, mentors, achievements, and skills." path="/summary" />
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-center mb-2">
            Complete <span className="text-primary">Summary</span>
          </h1>
          <div className="w-16 h-1 bg-primary mx-auto mb-4 rounded-full" />
          <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto text-sm">
            An overview of who I am, what I've built, who guides me, and what I've achieved so far.
          </p>

          {/* About */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6 space-y-3">
            <h2 className="font-display text-lg font-bold text-primary">About Me</h2>
            <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: data.content.about_paragraph_1 || "I'm Dheer Joshi, a student innovator focused on IoT and AI." }} />
            <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: data.content.about_paragraph_2 || "" }} />
            <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: data.content.about_paragraph_3 || "" }} />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Card icon={Briefcase} title="Projects" count={data.projects.length} to="/projects">
              <ul className="text-xs text-muted-foreground space-y-1">
                {data.projects.slice(0, 5).map((p: any) => <li key={p.id}>• {p.title}</li>)}
              </ul>
            </Card>
            <Card icon={Trophy} title="Achievements" count={data.achievements.length} to="/achievements">
              <ul className="text-xs text-muted-foreground space-y-1">
                {data.achievements.slice(0, 5).map((a: any) => <li key={a.id}>• {a.title}</li>)}
              </ul>
            </Card>
            <Card icon={Users} title="Mentors" count={data.mentors.length} to="/mentors">
              <ul className="text-xs text-muted-foreground space-y-1">
                {data.mentors.slice(0, 5).map((m: any) => <li key={m.id}>• {m.name}</li>)}
              </ul>
            </Card>
            <Card icon={Wrench} title="Skills" count={data.skills.length} to="/skills">
              <p className="text-xs text-muted-foreground">
                {data.skills.slice(0, 8).map((s: any) => s.name).join(", ")}
              </p>
            </Card>
            <Card icon={ImageIcon} title="Photos" count={data.photos.length} to="/gallery">
              <div className="grid grid-cols-4 gap-1">
                {data.photos.slice(0, 4).map((p: any) => (
                  <img key={p.id} src={p.image_url} alt="" className="aspect-square object-cover rounded" />
                ))}
              </div>
            </Card>
            <Card icon={FileText} title="Documents" count={data.docs.length} to="/documents">
              <ul className="text-xs text-muted-foreground space-y-1">
                {data.docs.slice(0, 5).map((d: any) => <li key={d.id}>• {d.title}</li>)}
              </ul>
            </Card>
            <Card icon={MessageSquare} title="Reviews" count={data.reviews.length} to="/reviews">
              <p className="text-xs text-muted-foreground italic line-clamp-3">
                {data.reviews[0] ? `"${data.reviews[0].message}" — ${data.reviews[0].name}` : "No reviews yet."}
              </p>
            </Card>
          </div>

          <div className="mt-10 text-center">
            <Link to="/chat" className="inline-flex px-6 py-3 rounded-lg bg-primary text-primary-foreground font-display text-sm font-semibold hover:opacity-90">
              Chat with a Bot About Me →
            </Link>
          </div>
        </div>
      </section>
    </SectionPageShell>
  );
};

export default SummaryPage;
