import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { useThemeLoader } from "@/hooks/useTheme";
import AboutSection from "@/components/AboutSection";
import ProjectsSection from "@/components/ProjectsSection";
import AchievementsSection from "@/components/AchievementsSection";
import SkillsSection from "@/components/SkillsSection";
import DocumentsSection from "@/components/DocumentsSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import ReviewsSection from "@/components/ReviewsSection";
import Footer from "@/components/Footer";

const Index = () => {
  const themeLoaded = useThemeLoader();

  if (!themeLoaded) {
    return <div className="min-h-screen bg-[hsl(220,20%,7%)]" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <AchievementsSection />
      <SkillsSection />
      <DocumentsSection />
      <GallerySection />
      <ContactSection />
      <ReviewsSection />
      <Footer />
    </div>
  );
};

export default Index;
