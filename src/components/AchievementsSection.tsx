import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
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

  const visible = limit ? achievements.slice(0, limit) : achievements;
  const hasMore = limit ? achievements.length > limit : false;

  return (
    <section id="achievements" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2 text-center">
            <span className="text-primary">Achievements</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-10 rounded-full" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {visible.map((a, i) => {
              const Icon = iconMap[a.icon_name || "Trophy"] || Trophy;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15 * i }}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:box-glow transition-all group text-center"
                >
                  {a.photo_url ? (
                    <img src={a.photo_url} alt={a.title} className="w-14 h-14 rounded-full object-cover mx-auto mb-4" />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="text-primary" size={26} />
                    </div>
                  )}
                  <h3 className="font-display text-sm font-bold text-foreground mb-2">{a.title}</h3>
                  <p className="text-xs text-muted-foreground font-body leading-relaxed">{a.description}</p>
                </motion.div>
              );
            })}
          </div>

          {hasMore && (
            <ShowMoreLink to="/achievements" count={achievements.length - (limit ?? 0)} label="See all achievements" />
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;
