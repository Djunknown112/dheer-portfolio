import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Mentor = {
  id: string;
  name: string;
  description: string | null;
  photo_url: string | null;
};

const MentorsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchMentors = async () => {
      const { data } = await (supabase.from as any)("mentors")
        .select("id,name,description,photo_url")
        .order("sort_order");
      if (data) setMentors(data as Mentor[]);
      setLoaded(true);
    };
    fetchMentors();
  }, []);

  if (loaded && mentors.length === 0) return null;

  return (
    <section id="mentors" className="section-padding bg-secondary/20" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2 text-center">
            My <span className="text-primary">Mentors</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4 rounded-full" />
          <p className="text-center text-sm text-muted-foreground max-w-xl mx-auto mb-10">
            The people who guide, challenge, and inspire me along the way.
          </p>

          {!loaded ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-card border border-border rounded-xl p-6 animate-pulse h-56" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mentors.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 * i }}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:box-glow transition-all text-center"
                >
                  {m.photo_url ? (
                    <img
                      src={m.photo_url}
                      alt={m.name}
                      loading="lazy"
                      decoding="async"
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-primary/40"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Users className="text-primary" size={32} />
                    </div>
                  )}
                  <h3 className="font-display text-base font-bold text-foreground mb-2">{m.name}</h3>
                  {m.description && (
                    <p className="text-xs text-muted-foreground font-body leading-relaxed whitespace-pre-line">
                      {m.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default MentorsSection;
