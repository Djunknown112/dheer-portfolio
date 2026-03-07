import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BrainCircuit, Wifi, Cpu, Bot, Smartphone, Crown, Puzzle, Lightbulb, Users } from "lucide-react";

const technicalSkills = [
  { icon: BrainCircuit, label: "Artificial Intelligence" },
  { icon: Wifi, label: "Internet of Things" },
  { icon: Cpu, label: "Embedded Systems" },
  { icon: Bot, label: "Robotics" },
  { icon: Smartphone, label: "Smart Devices" },
];

const softSkills = [
  { icon: Crown, label: "Leadership" },
  { icon: Puzzle, label: "Problem Solving" },
  { icon: Lightbulb, label: "Innovation Thinking" },
  { icon: Users, label: "Team Collaboration" },
];

const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
                {technicalSkills.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-4 bg-card border border-border rounded-lg px-5 py-4 hover:border-primary/40 transition-colors"
                  >
                    <s.icon className="text-primary shrink-0" size={22} />
                    <span className="text-sm text-foreground font-body font-medium">{s.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-display text-sm tracking-wider text-primary uppercase mb-5">Soft Skills</h3>
              <div className="space-y-3">
                {softSkills.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.1 * i }}
                    className="flex items-center gap-4 bg-card border border-border rounded-lg px-5 py-4 hover:border-primary/40 transition-colors"
                  >
                    <s.icon className="text-primary shrink-0" size={22} />
                    <span className="text-sm text-foreground font-body font-medium">{s.label}</span>
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
