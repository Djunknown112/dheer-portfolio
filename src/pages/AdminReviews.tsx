import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trash2, Star, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  name: string;
  email: string;
  rating: number;
  message: string;
  created_at: string;
  hidden: boolean;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setReviews(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      toast({ title: "Failed to delete review", variant: "destructive" });
    } else {
      toast({ title: "Review deleted" });
      setReviews((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleToggleHidden = async (id: string, currentHidden: boolean) => {
    const { error } = await supabase
      .from("reviews")
      .update({ hidden: !currentHidden } as any)
      .eq("id", id);
    if (error) {
      toast({ title: "Failed to update review", variant: "destructive" });
    } else {
      toast({ title: currentHidden ? "Review is now visible" : "Review hidden" });
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, hidden: !currentHidden } : r))
      );
    }
  };

  if (loading) {
    return <div className="text-muted-foreground animate-pulse">Loading reviews...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-foreground mb-6">Reviews</h1>

      {reviews.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card border border-border rounded-xl p-4 flex items-start justify-between gap-4"
            >
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-foreground">{review.name}</span>
                  <span className="text-xs text-muted-foreground">{review.email}</span>
                  <div className="flex gap-0.5 ml-auto">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={14}
                        className={
                          s <= review.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-muted-foreground/30"
                        }
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.message}</p>
                <p className="text-xs text-muted-foreground/60">
                  {new Date(review.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => handleDelete(review.id)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                title="Delete review"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
