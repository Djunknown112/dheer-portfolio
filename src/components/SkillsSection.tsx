import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Cpu, type LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";

interface Skill {
  id: string;
  name: string;
  category: string;
  icon_name: string | null;
  sort_order: number | null;
}

const iconCache: Record<string, React.ComponentType<LucideProps>> = {};

const DynamicIcon = ({ name, ...props }: { name: string | null } & LucideProps) => {
  if (!name) return <Cpu {...props} />;
  const kebab = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  if (!(kebab in dynamicIconImports)) return <Cpu {...props} />;
  if (!iconCache[kebab]) {
    iconCache[kebab] = lazy(dynamicIconImports[kebab as keyof typeof dynamicIconImports]);
  }
  const LazyIcon = iconCache[kebab];
  return (
    <Suspense fallback={<Cpu {...props} />}>
      <LazyIcon {...props} />
    </Suspense>
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

  const technical = skills.filter(s => s.category === "Technical");
  const soft = skills.filter(s => s.category === "Soft Skill");

  return (
    <section id="skills" className="section-padding bg-card/30" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2 text-center">
            Skills & <span className="text-primary">Interests</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-10 rounded-full" />

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <h3 className="font-display text-sm tracking-wider text-primary uppercase mb-5">Technical</h3>
              <div className="space-y-3">
                {technical.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-4 bg-card border border-border rounded-lg px-5 py-4 hover:border-primary/40 transition-colors"
                  >
                    <DynamicIcon name={s.icon_name} className="text-primary shrink-0" size={22} />
                    <span className="text-sm text-foreground font-body font-medium">{s.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-sm tracking-wider text-primary uppercase mb-5">Soft Skills</h3>
              <div className="space-y-3">
                {soft.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-4 bg-card border border-border rounded-lg px-5 py-4 hover:border-primary/40 transition-colors"
                  >
                    <DynamicIcon name={s.icon_name} className="text-primary shrink-0" size={22} />
                    <span className="text-sm text-foreground font-body font-medium">{s.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SkillsSection;
