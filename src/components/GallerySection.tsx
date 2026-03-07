import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { X, ImageIcon } from "lucide-react";

const placeholderPhotos = [
  { id: 1, caption: "WildSentry Prototype", category: "Projects" },
  { id: 2, caption: "Innovation Event", category: "Events" },
  { id: 3, caption: "Award Ceremony", category: "Awards" },
  { id: 4, caption: "Circuit Building", category: "Prototypes" },
  { id: 5, caption: "EV Armour Demo", category: "Projects" },
  { id: 6, caption: "Team Collaboration", category: "Events" },
];

const GallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  return (
    <section id="gallery" className="section-padding bg-card/30" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2 text-center">
            Photo <span className="text-primary">Gallery</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-10 rounded-full" />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {placeholderPhotos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.08 * i }}
                onClick={() => setSelectedPhoto(photo.id)}
                className="aspect-square bg-card border border-border rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/40 hover:box-glow transition-all group"
              >
                <ImageIcon className="text-muted-foreground group-hover:text-primary transition-colors mb-2" size={32} />
                <p className="text-xs text-muted-foreground font-body text-center px-2">{photo.caption}</p>
                <span className="text-[10px] text-primary/60 mt-1">{photo.category}</span>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6 font-body">
            Photos will appear here once uploaded via the admin dashboard.
          </p>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 text-foreground hover:text-primary"
            >
              <X size={28} />
            </button>
            <div className="bg-card border border-border rounded-2xl p-10 max-w-md text-center">
              <ImageIcon className="text-muted-foreground mx-auto mb-4" size={64} />
              <p className="text-muted-foreground font-body">
                {placeholderPhotos.find(p => p.id === selectedPhoto)?.caption}
              </p>
              <p className="text-xs text-muted-foreground mt-2">Photo placeholder — upload via admin dashboard</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
