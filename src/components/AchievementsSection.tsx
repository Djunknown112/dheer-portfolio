import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState, useMemo } from "react";
import { Trophy, Crown, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ShowMoreLink from "@/components/ShowMoreLink";

const iconMap: Record<string, React.ComponentType<any>> = { Trophy, Crown, Award };

const defaultAchievements = [
  { id: "1", icon_name: "Crown", title: "Head Boy of School", description: "Elected as Head Boy, demonstrating leadership, responsibility, and the ability to inspire peers.", photo_url: null },
  { id: "2", icon_name: "Trophy", title: "Kidovation Innovation Award", description: "Won the Kidovation Innovation Award for WildSentry — a wildlife monitoring system combating human-wildlife conflict.", photo_url: null },
  { id: "3", icon_name: "Award", title: "Technology & Innovation Projects", description: "Active participation in technology competitions and innovation exhibitions, showcasing cutting-edge student projects.", photo_url: null },
];

interface Props { limit?: number }

const AchievementsSection = ({ limit }: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [achievements, setAchievements] = useState(defaultAchievements);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("achievements").select("*").order("sort_order");
      if (data && data.length > 0) setAchievements(data);
    };
    fetchData();
  }, []);

  // Group cards by similar description length so rows look uniform.
  const sorted = useMemo(() => {
    return [...achievements].sort((a, b) => (b.description?.length ?? 0) - (a.description?.length ?? 0));
  }, [achievements]);

  const visible = limit ? sorted.slice(0, limit) : sorted;
  const hasMore = limit ? sorted.length > limit : false;

  return (
    <section id="achievements" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2 text-center">
            <span className="text-primary">Achievements</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-10 rounded-full" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {visible.map((a, i) => {
              const Icon = iconMap[a.icon_name || "Trophy"] || Trophy;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15 * i }}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 hover:box-glow transition-all group flex flex-col h-full"
                >
                  {a.photo_url ? (
                    <div className="w-full aspect-[16/9] bg-muted overflow-hidden">
                      <img
                        src={a.photo_url}
                        alt={a.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/9] bg-primary/5 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center">
                        <Icon className="text-primary" size={30} />
                      </div>
                    </div>
                  )}
                  <div className="p-5 sm:p-6 text-center flex flex-col flex-1">
                    <h3 className="font-display text-sm font-bold text-foreground mb-2">{a.title}</h3>
                    <p className="text-xs text-muted-foreground font-body leading-relaxed">{a.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {hasMore && (
            <ShowMoreLink to="/achievements" count={sorted.length - (limit ?? 0)} label="See all achievements" />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;
