import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { icons, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Highlight {
  id: string;
  label: string;
  description: string;
  icon_name: string | null;
  sort_order: number | null;
}

const fallbackHighlights: Highlight[] = [
  { id: "1", label: "Class 10 CBSE", description: "PCM track ahead", icon_name: "GraduationCap", sort_order: 1 },
  { id: "2", label: "B.Tech CSE", description: "Career goal", icon_name: "Target", sort_order: 2 },
  { id: "3", label: "Head Boy", description: "School leadership", icon_name: "Crown", sort_order: 3 },
  { id: "4", label: "Innovator", description: "AI & IoT builder", icon_name: "Lightbulb", sort_order: 4 },
];

const getIcon = (name: string | null) => {
  if (!name) return Star;
  return (icons as Record<string, any>)[name] || Star;
};

const fallbackParagraphs = [
  'I\'m <span class="text-foreground font-semibold">Dheer Joshi</span>, a driven and curious student currently in Class 10 (CBSE) from Vadodara, India. My passion lies at the intersection of technology and real-world problem solving.',
  'With a strong foundation in Artificial Intelligence, IoT, and embedded systems, I\'ve already built projects like <span class="text-primary">WildSentry</span> — a wildlife monitoring system — and <span class="text-primary">EV Armour</span>, a safety system for electric vehicles.',
  'As the <span class="text-foreground font-semibold">Head Boy</span> of my school, I lead with responsibility and inspire others to think innovatively. My goal is to pursue <span class="text-primary">B.Tech in Computer Science Engineering</span> and contribute to technologies that make the world safer and smarter.',
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [highlights, setHighlights] = useState<Highlight[]>(fallbackHighlights);
  const [paragraphs, setParagraphs] = useState<string[]>(fallbackParagraphs);

  useEffect(() => {
    const fetchData = async () => {
      const { data: hlData } = await supabase.from("about_highlights").select("*").order("sort_order");
      if (hlData && hlData.length > 0) setHighlights(hlData);

      const { data: contentData } = await supabase.from("site_content").select("*");
      if (contentData) {
        const map: Record<string, string> = {};
        contentData.forEach(d => { map[d.key] = d.value; });
        const p1 = map["about_paragraph_1"];
        const p2 = map["about_paragraph_2"];
        const p3 = map["about_paragraph_3"];
        if (p1 || p2 || p3) {
          setParagraphs([
            p1 || fallbackParagraphs[0],
            p2 || fallbackParagraphs[1],
            p3 || fallbackParagraphs[2],
          ]);
        }
      }
    };
    fetchData();
  }, []);

  return (
    <section id="about" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2 text-center">
            About <span className="text-primary">Me</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-10 rounded-full" />

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div className="space-y-5">
              <p className="text-muted-foreground leading-relaxed font-body">
                I'm <span className="text-foreground font-semibold">Dheer Joshi</span>, a driven and curious student currently in Class 10 (CBSE) from Vadodara, India. My passion lies at the intersection of technology and real-world problem solving.
              </p>
              <p className="text-muted-foreground leading-relaxed font-body">
                With a strong foundation in Artificial Intelligence, IoT, and embedded systems, I've already built projects like <span className="text-primary">WildSentry</span> — a wildlife monitoring system — and <span className="text-primary">EV Armour</span>, a safety system for electric vehicles.
              </p>
              <p className="text-muted-foreground leading-relaxed font-body">
                As the <span className="text-foreground font-semibold">Head Boy</span> of my school, I lead with responsibility and inspire others to think innovatively. My goal is to pursue <span className="text-primary">B.Tech in Computer Science Engineering</span> and contribute to technologies that make the world safer and smarter.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item, i) => {
                const Icon = getIcon(item.icon_name);
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="bg-card border border-border rounded-lg p-5 text-center hover:border-primary/50 transition-colors group"
                  >
                    <Icon className="mx-auto mb-3 text-primary group-hover:text-glow transition-colors" size={28} />
                    <h3 className="font-display text-sm font-semibold text-foreground mb-1">{item.label}</h3>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
