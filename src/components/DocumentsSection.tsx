import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileText, Download } from "lucide-react";

const documents = [
  { title: "Report Card – Class 9", category: "Report Cards" },
  { title: "Report Card – Class 10", category: "Report Cards" },
  { title: "Competition Certificates", category: "Certificates" },
  { title: "Project Documentation", category: "Projects" },
];

const DocumentsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="documents" className="section-padding" ref={ref}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2 text-center">
            <span className="text-primary">Documents</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-10 rounded-full" />

          <div className="space-y-3">
            {documents.map((doc, i) => (
              <motion.div
                key={doc.title}
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
                <button className="flex items-center gap-1.5 px-4 py-2 text-xs font-display font-semibold text-primary border border-primary/30 rounded-lg hover:bg-primary/10 transition-colors">
                  <Download size={14} />
                  Download
                </button>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6 font-body">
            Documents will be available for download once uploaded via the admin dashboard.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default DocumentsSection;
