import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const defaultDocs = [
  { id: "1", title: "Report Card – Class 9", category: "Report Cards", file_url: null },
  { id: "2", title: "Report Card – Class 10", category: "Report Cards", file_url: null },
  { id: "3", title: "Competition Certificates", category: "Certificates", file_url: null },
  { id: "4", title: "Project Documentation", category: "Projects", file_url: null },
];

const PAGE_SIZE = 4;

const DocumentsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [documents, setDocuments] = useState(defaultDocs);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) setDocuments(data);
    };
    fetch();
  }, []);

  const visibleDocs = documents.slice(0, visibleCount);
  const hasMore = visibleCount < documents.length;

  return (
    <section id="documents" className="section-padding" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2 text-center">
            <span className="text-primary">Documents</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-10 rounded-full" />

          <div className="space-y-3">
            {visibleDocs.map((doc, i) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 * i }}
                className="flex items-center justify-between bg-card border border-border rounded-lg px-5 py-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <FileText className="text-primary shrink-0" size={20} />
                  <div>
                    <h3 className="text-sm text-foreground font-medium font-body">{doc.title}</h3>
                    <p className="text-xs text-muted-foreground">{doc.category}</p>
                  </div>
                </div>
                {doc.file_url ? (
                  <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 text-xs font-display font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
                    <Download size={14} /> Download
                  </a>
                ) : (
                  <span className="text-xs text-muted-foreground">Coming soon</span>
                )}
              </motion.div>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="px-6 py-2.5 text-xs font-display font-semibold text-primary border border-primary/40 rounded-lg hover:bg-primary/10 transition-colors"
              >
                Load More ({documents.length - visibleCount} left)
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default DocumentsSection;
