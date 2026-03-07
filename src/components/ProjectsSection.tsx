import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, ChevronRight, Cpu, Shield, BrainCircuit } from "lucide-react";

const projects = [
  {
    title: "WildSentry",
    icon: Cpu,
    description: "A wildlife monitoring system designed to reduce human-wildlife conflict using sensors and communication systems.",
    features: ["GPS Tracking", "Pulse Monitoring", "Accelerometer Detection", "Solar-Powered", "GSM Communication"],
    tech: ["Arduino", "GPS Module", "GSM Module", "Solar Panel", "Sensors"],
    youtubeChannel: "https://www.youtube.com/@WildSentry",
    color: "from-emerald-500/20 to-cyan-500/20",
  },
  {
    title: "EV Armour",
    icon: Shield,
    description: "A safety system designed to prevent electric vehicle battery fires with real-time monitoring and automatic responses.",
    features: ["Battery Temp Monitoring", "Smoke Detection", "Auto Battery Disconnect", "Real-Time Alerts", "Display System"],
    tech: ["Temperature Sensors", "Smoke Sensors", "Relay Module", "LCD Display", "Microcontroller"],
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    title: "Ric – AI IoT Pendant",
    icon: BrainCircuit,
    description: "A wearable AI assistant device designed to function as a secondary phone and personal assistant.",
    features: ["Voice Assistant", "Call & Message", "SOS Emergency Alerts", "Offline AI", "Gesture Control", "Emotion Detection"],
    tech: ["AI/ML", "IoT", "Bluetooth", "Microphone", "Accelerometer"],
    color: "from-violet-500/20 to-blue-500/20",
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeProject, setActiveProject] = useState(0);

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

          {/* Project selector tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {projects.map((p, i) => (
              <button
                key={p.title}
                onClick={() => setActiveProject(i)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-display text-xs font-semibold transition-all ${
                  activeProject === i
                    ? "bg-primary text-primary-foreground box-glow"
                    : "bg-secondary text-secondary-foreground hover:bg-surface-hover"
                }`}
              >
                <p.icon size={16} />
                {p.title}
              </button>
            ))}
          </div>

          {/* Active project */}
          {projects.map((project, i) => (
            activeProject === i && (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`bg-gradient-to-br ${project.color} border border-border rounded-2xl p-6 sm:p-10`}
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <project.icon className="text-primary" size={32} />
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                        {project.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-6 font-body leading-relaxed">
                      {project.description}
                    </p>

                    {project.youtubeChannel && (
                      <a
                        href={project.youtubeChannel}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium mb-6"
                      >
                        <ExternalLink size={14} />
                        Watch on YouTube
                      </a>
                    )}

                    <div className="mb-6">
                      <h4 className="font-display text-xs tracking-wider text-primary uppercase mb-3">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((t) => (
                          <span key={t} className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-full">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-display text-xs tracking-wider text-primary uppercase mb-4">Key Features</h4>
                    <div className="space-y-3">
                      {project.features.map((f) => (
                        <div key={f} className="flex items-center gap-3 bg-background/50 rounded-lg px-4 py-3">
                          <ChevronRight className="text-primary shrink-0" size={16} />
                          <span className="text-sm text-foreground font-body">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
