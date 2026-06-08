import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { icons, Cpu, ChevronDown, ChevronUp } from "lucide-react";

interface Skill {
  id: string;
  name: string;
  category: string;
  icon_name: string | null;
  sort_order: number | null;
}

const getIcon = (iconName: string | null) => {
  if (!iconName) return Cpu;
  return (icons as Record<string, any>)[iconName] || Cpu;
};

const PAGE_SIZE = 6;

const CATEGORIES: { key: string; label: string; align: "left" | "center" | "right" }[] = [
  { key: "Technical", label: "Technical", align: "left" },
  { key: "Soft Skill", label: "Soft Skills", align: "center" },
  { key: "Learning", label: "Learning", align: "right" },
];

const SkillColumn = ({
  skills,
  label,
  isInView,
  align,
}: {
  skills: Skill[];
  label: string;
  isInView: boolean;
  align: "left" | "center" | "right";
}) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? skills : skills.slice(0, PAGE_SIZE);
  const hasMore = skills.length > PAGE_SIZE;

  const xFrom = align === "left" ? -20 : align === "right" ? 20 : 0;
  const yFrom = align === "center" ? 20 : 0;

  if (skills.length === 0) return null;

  return (
    <div>
      <h3 className="font-display text-sm tracking-wider text-primary uppercase mb-5">
        {label}
      </h3>
      <div className="space-y-3">
        {visible.map((s, i) => {
          const Icon = getIcon(s.icon_name);
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, x: xFrom, y: yFrom }}
              animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
              transition={{ delay: 0.05 * i, duration: 0.4 }}
              className="flex items-center gap-4 bg-card border border-border rounded-lg px-4 sm:px-5 py-3.5 sm:py-4 hover:border-primary/40 hover:-translate-y-0.5 transition-all"
            >
              <Icon className="text-primary shrink-0" size={22} />
              <span className="text-sm text-foreground font-body font-medium">{s.name}</span>
            </motion.div>
          );
        })}
        {hasMore && (
          <button
            onClick={() => setShowAll((v) => !v)}
            className="w-full flex items-center justify-center gap-1.5 mt-1 py-2 text-xs font-display font-semibold tracking-wider uppercase text-primary hover:text-primary/80 transition-colors"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp size={14} />
              </>
            ) : (
              <>
                Show More ({skills.length - PAGE_SIZE}) <ChevronDown size={14} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [skills, setSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const fetchSkills = async () => {
      const { data } = await supabase
        .from("skills")
        .select("*")
        .order("sort_order", { ascending: true });
      if (data) setSkills(data);
    };
    fetchSkills();
  }, []);

  return (
    <section id="skills" className="section-padding bg-card/30" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2 text-center">
            Skills &amp; <span className="text-primary">Interests</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-10 rounded-full" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {CATEGORIES.map((c) => (
              <SkillColumn
                key={c.key}
                label={c.label}
                align={c.align}
                isInView={isInView}
                skills={skills.filter((s) => s.category === c.key)}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
