import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Users, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ShowMoreLink from "@/components/ShowMoreLink";

type Mentor = {
  id: string;
  name: string;
  description: string | null;
  photo_url: string | null;
};

interface Props { limit?: number }

const MentorsSection = ({ limit }: Props) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<Mentor | null>(null);

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

  const visible = limit ? mentors.slice(0, limit) : mentors;
  const hasMore = limit ? mentors.length > limit : false;

  return (
    <section id="mentors" className="section-padding bg-secondary/20" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2 text-center">
            My <span className="text-primary">Mentors</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-4 rounded-full" />
          <p className="text-center text-sm text-muted-foreground max-w-xl mx-auto mb-10">
            The people who guide, challenge, and inspire me along the way. Tap a photo to view it full size.
          </p>

          {!loaded ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-card border border-border rounded-xl p-6 animate-pulse h-56" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((m, i) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 * i }}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 hover:box-glow transition-all text-center"
                >
                  {m.photo_url ? (
                    <button
                      type="button"
                      onClick={() => setSelected(m)}
                      aria-label={`View full photo of ${m.name}`}
                      className="block mx-auto mb-4 cursor-zoom-in group focus:outline-none"
                    >
                      <img
                        src={m.photo_url}
                        alt={m.name}
                        loading="lazy"
                        decoding="async"
                        className="w-24 h-24 rounded-full object-cover border-2 border-primary/40 group-hover:border-primary transition-all group-hover:scale-105"
                      />
                    </button>
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

          {hasMore && (
            <ShowMoreLink to="/mentors" count={mentors.length - (limit ?? 0)} label="See all mentors" />
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 text-foreground hover:text-primary" aria-label="Close">
              <X size={28} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selected.photo_url && (
                <img
                  src={selected.photo_url}
                  alt={selected.name}
                  className="max-w-[80vw] max-h-[75vh] rounded-xl object-contain"
                />
              )}
              <h3 className="font-display text-lg font-bold text-foreground mt-4">{selected.name}</h3>
              {selected.description && (
                <p className="text-xs text-muted-foreground max-w-md text-center mt-1 whitespace-pre-line">{selected.description}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default MentorsSection;
