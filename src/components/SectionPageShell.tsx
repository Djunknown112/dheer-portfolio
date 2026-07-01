import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useThemeLoader } from "@/hooks/useTheme";

interface Props {
  children: ReactNode;
}

/** Full-detail page wrapper for section pages (projects, achievements, etc). */
const SectionPageShell = ({ children }: Props) => {
  const themeLoaded = useThemeLoader();
  if (!themeLoaded) return <div className="min-h-screen bg-[hsl(220,20%,7%)]" />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 sm:pt-28 pb-4 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-display font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <ChevronLeft size={14} /> Back to Home
        </Link>
      </div>
      {children}
      <Footer />
    </div>
  );
};

export default SectionPageShell;
