import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  created_at: string;
  avatar_hash?: string | null;
}

// RFC 5322-ish practical email validation
const EMAIL_RE = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const ReviewsSection = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (reviews.length < 2) return;
    const t = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(t);
  }, [reviews.length]);

  const fetchReviews = async () => {
    const { data } = await supabase.rpc("get_public_reviews");
    if (data) setReviews(data as Review[]);
  };

  const next = () => {
    setDirection(1);
    setIndex((i) => (i + 1) % reviews.length);
  };
  const prev = () => {
    setDirection(-1);
    setIndex((i) => (i - 1 + reviews.length) % reviews.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase
      .from("reviews")
      .insert({ name: name.trim(), email: email.trim(), rating, message: message.trim() });
    setSubmitting(false);
    if (error) {
      toast({ title: "Failed to submit review", variant: "destructive" });
    } else {
      toast({ title: "Review submitted! Thank you 🎉" });
      setName(""); setEmail(""); setRating(5); setMessage("");
      fetchReviews();
    }
  };

  const current = reviews[index];

  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
            What People Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Honest reviews from people who know me
          </p>
        </motion.div>

        {/* Slider */}
        {reviews.length > 0 ? (
          <div className="relative max-w-2xl mx-auto mb-16">
            <div className="relative h-64 sm:h-56 overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={current.id}
                  custom={direction}
                  initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between"
                >
                  {current.avatar_hash && (
                    <img
                      src={`https://unavatar.io/${current.avatar_hash}?fallback=https://www.gravatar.com/avatar/${current.avatar_hash}?s=80%26d=https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(current.name)}`}
                      alt={`${current.name} avatar`}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(current.name)}`;
                      }}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full border border-border object-cover bg-muted"
                    />
                  )}
                  <div className="space-y-3 pr-12">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={18}
                          className={s <= current.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/30"}
                        />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-foreground leading-relaxed line-clamp-5">
                      "{current.message}"
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-border mt-3">
                    <span className="font-semibold text-foreground text-sm">— {current.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(current.created_at).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {reviews.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous"
                  className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <ChevronLeft size={18} className="text-foreground" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next"
                  className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <ChevronRight size={18} className="text-foreground" />
                </button>

                <div className="flex justify-center gap-1.5 mt-4">
                  {reviews.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
                      aria-label={`Go to review ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40"}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-center text-muted-foreground mb-16">No reviews yet. Be the first!</p>
        )}

        {/* Review Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-card border border-border rounded-2xl p-6 space-y-4"
        >
          <h3 className="text-lg font-semibold text-foreground">Leave a Review</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              maxLength={100}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              type="email"
              maxLength={255}
              className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground mr-2">Rating:</span>
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHoveredStar(s)}
                onMouseLeave={() => setHoveredStar(0)}
              >
                <Star
                  size={22}
                  className={`transition-colors ${
                    s <= (hoveredStar || rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your review..."
            rows={3}
            maxLength={1000}
            className="w-full px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm resize-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send size={16} />
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default ReviewsSection;
