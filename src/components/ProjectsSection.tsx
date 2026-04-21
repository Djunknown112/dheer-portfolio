import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ExternalLink, ChevronRight, Cpu, Shield, BrainCircuit, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const iconMap: Record<string, React.ComponentType<any>> = { Cpu, Shield, BrainCircuit };
const defaultProjects = [
  {
    id: "1", title: "WildSentry", icon_name: "Cpu",
    description: "A wildlife monitoring system designed to reduce human-wildlife conflict using sensors and communication systems.",
    features: ["GPS Tracking", "Pulse Monitoring", "Accelerometer Detection", "Solar-Powered", "GSM Communication"],
    technologies: ["Arduino", "GPS Module", "GSM Module", "Solar Panel", "Sensors"],
    youtube_link: "https://youtube.com/@wildsentry_original?si=jZrDHo06TsEX6nd_",
    color_from: "emerald-500/20", color_to: "cyan-500/20",
  },
  {
    id: "2", title: "EV Armour", icon_name: "Shield",
    description: "A safety system designed to prevent electric vehicle battery fires with real-time monitoring and automatic responses.",
    features: ["Battery Temp Monitoring", "Smoke Detection", "Auto Battery Disconnect", "Real-Time Alerts", "Display System"],
    technologies: ["Temperature Sensors", "Smoke Sensors", "Relay Module", "LCD Display", "Microcontroller"],
    youtube_link: null, color_from: "orange-500/20", color_to: "red-500/20",
  },
  {
    id: "3", title: "Ric – AI IoT Pendant", icon_name: "BrainCircuit",
    description: "A wearable AI assistant device designed to function as a secondary phone and personal assistant.",
    features: ["Voice Assistant", "Call & Message", "SOS Emergency Alerts", "Offline AI", "Gesture Control", "Emotion Detection"],
    technologies: ["AI/ML", "IoT", "Bluetooth", "Microphone", "Accelerometer"],
    youtube_link: null, color_from: "violet-500/20", color_to: "blue-500/20",
  },
];

const colorMap: Record<string, string> = {
  "emerald-500/20": "from-emerald-500/20 to-cyan-500/20",
  "orange-500/20": "from-orange-500/20 to-red-500/20",
  "violet-500/20": "from-violet-500/20 to-blue-500/20",
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeProject, setActiveProject] = useState(0);
  const [projects, setProjects] = useState(defaultProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from("projects").select("*").order("sort_order");
      if (data && data.length > 0) setProjects(data);
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="section-padding bg-card/30" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2 text-center">
            My <span className="text-primary">Projects</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-10 rounded-full" />

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {projects.map((p, i) => {
              const Icon = iconMap[p.icon_name || "Cpu"] || Cpu;
              return (
                <button
                  key={p.id}
                  onClick={() => setActiveProject(i)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-display text-xs font-semibold transition-all ${
                    activeProject === i
                      ? "bg-primary text-primary-foreground box-glow"
                      : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
                  }`}
                >
                  <Icon size={16} />
                  {p.title}
                </button>
              );
            })}
          </div>

          {projects.map((project, i) => {
            if (activeProject !== i) return null;
            const Icon = iconMap[project.icon_name || "Cpu"] || Cpu;
            const gradient = colorMap[project.color_from || ""] || "from-emerald-500/20 to-cyan-500/20";

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`bg-gradient-to-br ${gradient} border border-border rounded-2xl p-6 sm:p-10`}
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="text-primary" size={32} />
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">{project.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-6 font-body leading-relaxed">{project.description}</p>

                    <div className="flex flex-wrap gap-3 mb-6">
                      {project.youtube_link && (
                        <a href={project.youtube_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium">
                          <ExternalLink size={14} /> Watch on YouTube
                        </a>
                      )}
                      {(project as any).website_link && (
                        <a href={(project as any).website_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-display font-semibold hover:opacity-90 transition-opacity">
                          <Globe size={14} /> View Website
                        </a>
                      )}
                    </div>

                    <div className="mb-6">
                      <h4 className="font-display text-xs tracking-wider text-primary uppercase mb-3">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {(project.technologies || []).map((t) => (
                          <span key={t} className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full">{t}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-display text-xs tracking-wider text-primary uppercase mb-4">Key Features</h4>
                    <div className="space-y-3">
                      {(project.features || []).map((f) => (
                        <div key={f} className="flex items-center gap-3 bg-background/50 rounded-lg px-4 py-3">
                          <ChevronRight className="text-primary shrink-0" size={16} />
                          <span className="text-sm text-foreground font-body">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
