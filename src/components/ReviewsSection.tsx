import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";
import ShowMoreLink from "@/components/ShowMoreLink";

interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  created_at: string;
  avatar_hash?: string | null;
  avatar_url?: string | null;
}

interface Props { limit?: number }

const ReviewsSection = ({ limit }: Props) => {
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const reviews = limit ? allReviews.slice(0, limit) : allReviews;
  const hasMore = limit ? allReviews.length > limit : false;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

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
    if (data) setAllReviews(data as Review[]);
  };

  const next = () => { setDirection(1); setIndex((i) => (i + 1) % reviews.length); };
  const prev = () => { setDirection(-1); setIndex((i) => (i - 1 + reviews.length) % reviews.length); };

  const handleGoogleSignIn = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/#reviews",
    });
    if (result.error) {
      toast({ title: "Sign-in failed", description: String((result.error as any).message ?? result.error), variant: "destructive" });
    }
  };

  const handleSignOut = async () => { await supabase.auth.signOut(); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please sign in with Google first", variant: "destructive" });
      return;
    }
    if (!message.trim()) {
      toast({ title: "Please write a review", variant: "destructive" });
      return;
    }
    const meta = (user.user_metadata ?? {}) as Record<string, any>;
    const name = meta.full_name || meta.name || user.email?.split("@")[0] || "Anonymous";
    const avatar_url = meta.avatar_url || meta.picture || null;

    setSubmitting(true);
    const { error } = await supabase.from("reviews").insert({
      name,
      email: user.email ?? "",
      rating,
      message: message.trim(),
      avatar_url,
      user_id: user.id,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Failed to submit review", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Review submitted! Thank you 🎉" });
      setRating(5); setMessage("");
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
                  <img
                    key={current.id}
                    src={
                      current.avatar_url ||
                      (current.avatar_hash
                        ? `https://www.gravatar.com/avatar/${current.avatar_hash}?s=160&d=404`
                        : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(current.name)}&backgroundType=gradientLinear&backgroundColor=00897b,1e88e5,5e35b1,8e24aa,d81b60,f4511e`)
                    }
                    onError={(e) => {
                      const img = e.currentTarget;
                      const fallback = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(current.name)}&backgroundType=gradientLinear&backgroundColor=00897b,1e88e5,5e35b1,8e24aa,d81b60,f4511e`;
                      if (img.src !== fallback) img.src = fallback;
                    }}
                    alt={`${current.name}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="absolute top-4 right-4 w-11 h-11 rounded-full border-2 border-primary/40 object-cover bg-muted shadow-md"
                  />
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
        {hasMore && <ShowMoreLink to="/reviews" count={allReviews.length - (limit ?? 0)} label="See all reviews" />}

        {/* Review Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto bg-card border border-border rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Leave a Review</h3>
            {user && (
              <button
                onClick={handleSignOut}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
              >
                <LogOut size={12} /> Sign out
              </button>
            )}
          </div>

          {!user ? (
            <div className="text-center py-4 space-y-3">
              <p className="text-sm text-muted-foreground">
                Sign in with Google so your real profile photo and name appear on your review.
              </p>
              <button
                onClick={handleGoogleSignIn}
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-lg bg-background border border-border text-foreground font-medium text-sm hover:bg-secondary transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 0-24c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 24 44c11 0 20-9 20-20 0-1.2-.1-2.3-.4-3.5z"/>
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16.1 19 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"/>
                  <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"/>
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4 5.5l6.3 5.3C41.4 35 44 30 44 24c0-1.2-.1-2.3-.4-3.5z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border">
                <img
                  src={(user.user_metadata as any)?.avatar_url || (user.user_metadata as any)?.picture}
                  alt="You"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-border"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {(user.user_metadata as any)?.full_name || (user.user_metadata as any)?.name || user.email}
                  </p>
                  <p className="text-xs text-muted-foreground">Posting as your Google account</p>
                </div>
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
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ReviewsSection;
