import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { Helmet } from "react-helmet-async";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Helmet>
        <title>Admin Login — Dheer Joshi Portfolio</title>
        <meta name="description" content="Restricted admin sign-in for the Dheer Joshi Portfolio content management system." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://dheer-portfolio.lovable.app/admin/login" />
        <meta property="og:title" content="Admin Login — Dheer Joshi Portfolio" />
        <meta property="og:description" content="Restricted admin sign-in." />
        <meta property="og:url" content="https://dheer-portfolio.lovable.app/admin/login" />
      </Helmet>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold text-primary text-glow">Portfolio</h1>
          <p className="text-sm text-muted-foreground mt-2">Portfolio Management Dashboard</p>
        </div>

        <form onSubmit={handleLogin} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-muted-foreground" size={16} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-muted-foreground" size={16} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-display text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={async () => {
              if (!email) { setError("Enter your email first"); return; }
              setLoading(true);
              const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/admin/reset-password`,
              });
              if (error) setError(error.message);
              else setError("Password reset email sent! Check your inbox.");
              setLoading(false);
            }}
            className="w-full text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            Forgot Password?
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-4">
          <a href="/" className="text-primary hover:underline">← Back to Portfolio</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
