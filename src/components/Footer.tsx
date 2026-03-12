import { Youtube, Github, Linkedin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Footer = () => {
  const [links, setLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("site_content").select("key, value")
        .in("key", ["youtube_link", "github_link", "linkedin_link"]);
      if (data) {
        const map: Record<string, string> = {};
        data.forEach(d => { map[d.key] = d.value; });
        setLinks(map);
      }
    };
    fetch();
  }, []);

  return (
    <footer className="border-t border-border py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Dheer Joshi. All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          {links.youtube_link && (
            <a href={links.youtube_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Youtube size={18} />
            </a>
          )}
          {links.github_link && (
            <a href={links.github_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Github size={18} />
            </a>
          )}
          {links.linkedin_link && (
            <a href={links.linkedin_link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
