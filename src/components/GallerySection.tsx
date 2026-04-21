import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { X, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Photo = { id: string; caption: string; category: string; image_url: string };

const PAGE_SIZE = 6;

const GallerySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const fetchPhotos = async () => {
      const { data } = await supabase.from("photos").select("*").order("sort_order");
      if (data) setPhotos(data);
    };
    fetchPhotos();
  }, []);

  const closeLightbox = useCallback(() => setSelectedPhoto(null), []);

  const hasPhotos = photos.length > 0;
  const visiblePhotos = photos.slice(0, visibleCount);
  const hasMore = visibleCount < photos.length;

  return (
    <section id="gallery" className="section-padding bg-card/30" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2 text-center">
            Photo <span className="text-primary">Gallery</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-10 rounded-full" />

          {hasPhotos ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {visiblePhotos.map((photo) => (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo)}
                    className="aspect-square rounded-xl overflow-hidden cursor-pointer border border-border hover:border-primary/40 hover:box-glow transition-all group relative will-change-transform"
                  >
                    <img
                      src={photo.image_url}
                      alt={photo.caption}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3">
                      <p className="text-xs text-foreground truncate">{photo.caption}</p>
                      <span className="text-[10px] text-primary/60">{photo.category}</span>
                    </div>
                  </div>
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="px-6 py-2.5 text-xs font-display font-semibold text-primary border border-primary/40 rounded-lg hover:bg-primary/10 transition-colors"
                  >
                    Load More ({photos.length - visibleCount} left)
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(n => (
                <div key={n} className="aspect-square bg-card border border-border rounded-xl flex flex-col items-center justify-center">
                  <ImageIcon className="text-muted-foreground mb-2" size={32} />
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <button onClick={closeLightbox} className="absolute top-6 right-6 text-foreground hover:text-primary">
              <X size={28} />
            </button>
            <img src={selectedPhoto.image_url} alt={selectedPhoto.caption} className="max-w-full max-h-[80vh] rounded-xl object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
