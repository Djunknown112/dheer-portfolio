import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const mainLinks = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "Summary", to: "/summary" },
  { label: "Chat", to: "/chat" },
];

const moreLinks = [
  { label: "About", to: "/#about" },
  { label: "Achievements", to: "/achievements" },
  { label: "Mentors", to: "/mentors" },
  { label: "Skills", to: "/skills" },
  { label: "Gallery", to: "/gallery" },
  { label: "Documents", to: "/documents" },
  { label: "Reviews", to: "/reviews" },
  { label: "Contact", to: "/#contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 50);
      if (y > 100 && y > lastY.current + 5) setHidden(true);
      else if (y < lastY.current - 5) setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (to: string) => {
    setIsOpen(false);
    setMoreOpen(false);
    if (to.includes("#")) {
      const [path, hash] = to.split("#");
      if (location.pathname !== (path || "/")) {
        navigate(to);
      } else {
        window.dispatchEvent(new Event("lovable:preload-all"));
        requestAnimationFrame(() => {
          const el = document.getElementById(hash);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top, behavior: "smooth" });
          }
        });
      }
    } else {
      navigate(to);
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
    }`;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <NavLink to="/" className="font-display text-lg font-bold text-primary shrink-0">
            Portfolio
          </NavLink>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {mainLinks.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"} className={linkClass}>
                {l.label}
              </NavLink>
            ))}

            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen((v) => !v)}
                className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                More <ChevronDown size={14} className={`transition-transform ${moreOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {moreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 mt-2 w-48 bg-card/95 backdrop-blur-xl border border-border rounded-lg shadow-lg py-1"
                  >
                    {moreLinks.map((l) => (
                      <button
                        key={l.to}
                        onClick={() => go(l.to)}
                        className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-secondary/50 transition-colors"
                      >
                        {l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            className="md:hidden text-foreground p-2"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {[...mainLinks, ...moreLinks].map((l) => (
                <button
                  key={l.to}
                  onClick={() => go(l.to)}
                  className="w-full text-left block py-2.5 px-2 text-sm text-muted-foreground hover:text-primary hover:bg-secondary/50 rounded transition-colors"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
