import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { GraduationCap, Target, Lightbulb, Crown } from "lucide-react";

const highlights = [
  { icon: GraduationCap, label: "Class 10 CBSE", desc: "PCM track ahead" },
  { icon: Target, label: "B.Tech CSE", desc: "Career goal" },
  { icon: Crown, label: "Head Boy", desc: "School leadership" },
  { icon: Lightbulb, label: "Innovator", desc: "AI & IoT builder" },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
              {highlights.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="bg-card border border-border rounded-lg p-5 text-center hover:border-primary/50 transition-colors group"
                >
                  <item.icon className="mx-auto mb-3 text-primary group-hover:text-glow transition-colors" size={28} />
                  <h3 className="font-display text-sm font-semibold text-foreground mb-1">{item.label}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
