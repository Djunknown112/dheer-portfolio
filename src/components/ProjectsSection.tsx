import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ExternalLink, ChevronRight, Cpu, Shield, BrainCircuit, Globe, Sparkles } from "lucide-react";
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

const mergeWithDefaultProjects = (databaseProjects: typeof defaultProjects) => {
  const projectsByTitle = new Map(databaseProjects.map((project) => [project.title.toLowerCase(), project]));
  const missingDefaults = defaultProjects.filter((project) => !projectsByTitle.has(project.title.toLowerCase()));
  return [...databaseProjects, ...missingDefaults];
};

const colorMap: Record<string, string> = {
  "emerald-500/20": "from-emerald-500/25 via-teal-500/15 to-cyan-500/25",
  "orange-500/20": "from-orange-500/25 via-amber-500/15 to-red-500/25",
  "violet-500/20": "from-violet-500/25 via-indigo-500/15 to-blue-500/25",
};

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeProject, setActiveProject] = useState(0);
  const [projects, setProjects] = useState(defaultProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true });
      if (data && data.length > 0) setProjects(mergeWithDefaultProjects(data));
    };
    fetchProjects();
  }, []);

  return (
    <section
      id="projects"
      ref={ref}
      className="relative section-padding overflow-hidden bg-gradient-to-b from-background via-card/50 to-background"
    >
      {/* Decorative orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 mb-4 sm:mb-6"
          >
            <Sparkles className="text-primary" size={14} />
            <span className="text-xs font-display font-semibold tracking-[0.2em] uppercase text-primary">
              Featured Work
            </span>
          </motion.div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-3 leading-[1.05]">
            My <span className="text-primary text-glow">Projects</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-4 rounded-full" />
          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-4">
            Real-world systems I&apos;ve built combining hardware, software and AI.
          </p>
        </motion.div>

        {/* Project switcher */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 px-2">
          {projects.map((p, i) => {
            const Icon = iconMap[p.icon_name || "Cpu"] || Cpu;
            return (
              <button
                key={p.id}
                onClick={() => setActiveProject(i)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg font-display text-xs font-semibold transition-all active:scale-95 ${
                  activeProject === i
                    ? "bg-primary text-primary-foreground box-glow scale-105"
                    : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
                }`}
              >
                <Icon size={16} />
                <span className="truncate max-w-[140px]">{p.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active project card */}
        {projects.map((project, i) => {
          if (activeProject !== i) return null;
          const Icon = iconMap[project.icon_name || "Cpu"] || Cpu;
          const gradient = colorMap[project.color_from || ""] || "from-emerald-500/25 via-teal-500/15 to-cyan-500/25";

          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`relative bg-gradient-to-br ${gradient} border border-primary/20 rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl shadow-primary/5`}
            >
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-card/60 backdrop-blur-sm -z-10" />

              <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/15 border border-primary/30 flex items-center justify-center">
                      <Icon className="text-primary" size={26} />
                    </div>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground leading-tight">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base mb-6 font-body leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mb-6">
                    {project.youtube_link && (
                      <a
                        href={project.youtube_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                      >
                        <ExternalLink size={14} /> Watch on YouTube
                      </a>
                    )}
                    {(project as any).website_link && (
                      <a
                        href={(project as any).website_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-display font-semibold hover:opacity-90 transition-opacity"
                      >
                        <Globe size={14} /> View Website
                      </a>
                    )}
                  </div>

                  <div className="mb-2">
                    <h4 className="font-display text-xs tracking-wider text-primary uppercase mb-3">
                      Technologies
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(project.technologies || []).map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 text-xs bg-secondary/80 backdrop-blur-sm text-secondary-foreground rounded-full border border-border"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-display text-xs tracking-wider text-primary uppercase mb-4">
                    Key Features
                  </h4>
                  <div className="space-y-2.5">
                    {(project.features || []).map((f, idx) => (
                      <motion.div
                        key={f}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * idx }}
                        className="flex items-center gap-3 bg-background/60 backdrop-blur-sm rounded-lg px-4 py-3 border border-border hover:border-primary/40 hover:-translate-y-0.5 transition-all"
                      >
                        <ChevronRight className="text-primary shrink-0" size={16} />
                        <span className="text-sm text-foreground font-body">{f}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectsSection;
