import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Trophy, Crown, Award } from "lucide-react";

const achievements = [
  {
    icon: Crown,
    title: "Head Boy of School",
    description: "Elected as Head Boy, demonstrating leadership, responsibility, and the ability to inspire peers.",
  },
  {
    icon: Trophy,
    title: "Kidovation Innovation Award",
    description: "Won the Kidovation Innovation Award for WildSentry — a wildlife monitoring system combating human-wildlife conflict.",
  },
  {
    icon: Award,
    title: "Technology & Innovation Projects",
    description: "Active participation in technology competitions and innovation exhibitions, showcasing cutting-edge student projects.",
  },
];

const AchievementsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="achievements" className="section-padding" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2 text-center">
            <span className="text-primary">Achievements</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-10 rounded-full" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.15 * i }}
                className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:box-glow transition-all group text-center"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <a.icon className="text-primary" size={26} />
                </div>
                <h3 className="font-display text-sm font-bold text-foreground mb-2">{a.title}</h3>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">{a.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AchievementsSection;
