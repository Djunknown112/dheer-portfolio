import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import ShowMoreLink from "@/components/ShowMoreLink";

type FunProject = {
  id: string;
  name: string;
  category: string | null;
  description: string;
};

const db = supabase as any;

const FunProjectsSection = ({ limit }: { limit?: number }) => {
  const [items, setItems] = useState<FunProject[]>([]);

  useEffect(() => {
    db.from("fun_projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .then(({ data }: any) => data && setItems(data));
  }, []);

  if (items.length === 0) return null;
  const shown = limit ? items.slice(0, limit) : items;

  return (
    <section id="fun-projects" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 text-primary mb-2">
            <Sparkles size={18} />
            <span className="text-xs uppercase tracking-widest font-display">Just for fun</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Fun Projects
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Small experiments and side builds I made purely for fun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {shown.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h3 className="font-display text-lg font-semibold text-foreground">{p.name}</h3>
                {p.category && (
                  <span className="text-[10px] uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap">
                    {p.category}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            </motion.div>
          ))}
        </div>

        {limit && items.length > limit && (
          <div className="mt-8 text-center">
            <ShowMoreLink to="/fun-projects" />
          </div>
        )}
      </div>
    </section>
  );
};

export default FunProjectsSection;
