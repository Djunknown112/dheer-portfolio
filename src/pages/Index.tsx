import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { useThemeLoader } from "@/hooks/useTheme";
import AboutSection from "@/components/AboutSection";
import LazySection from "@/components/LazySection";
import Footer from "@/components/Footer";

// Code-split below-the-fold sections so they don't ship in the initial bundle
const ProjectsSection = lazy(() => import("@/components/ProjectsSection"));
const AchievementsSection = lazy(() => import("@/components/AchievementsSection"));
const MentorsSection = lazy(() => import("@/components/MentorsSection"));
const SkillsSection = lazy(() => import("@/components/SkillsSection"));
const DocumentsSection = lazy(() => import("@/components/DocumentsSection"));
const GallerySection = lazy(() => import("@/components/GallerySection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const ReviewsSection = lazy(() => import("@/components/ReviewsSection"));

const SectionFallback = ({ h = "400px" }: { h?: string }) => (
  <div style={{ minHeight: h }} />
);

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

      <LazySection id="projects" minHeight="600px">
        <Suspense fallback={<SectionFallback h="600px" />}>
          <ProjectsSection />
        </Suspense>
      </LazySection>

      <LazySection id="achievements" minHeight="500px">
        <Suspense fallback={<SectionFallback h="500px" />}>
          <AchievementsSection />
        </Suspense>
      </LazySection>

      <LazySection id="mentors" minHeight="400px">
        <Suspense fallback={<SectionFallback h="400px" />}>
          <MentorsSection />
        </Suspense>
      </LazySection>

      <LazySection id="skills" minHeight="500px">
        <Suspense fallback={<SectionFallback h="500px" />}>
          <SkillsSection />
        </Suspense>
      </LazySection>

      <LazySection id="documents" minHeight="400px">
        <Suspense fallback={<SectionFallback h="400px" />}>
          <DocumentsSection />
        </Suspense>
      </LazySection>

      <LazySection id="gallery" minHeight="600px">
        <Suspense fallback={<SectionFallback h="600px" />}>
          <GallerySection />
        </Suspense>
      </LazySection>

      <LazySection id="contact" minHeight="500px">
        <Suspense fallback={<SectionFallback h="500px" />}>
          <ContactSection />
        </Suspense>
      </LazySection>

      <LazySection id="reviews" minHeight="400px">
        <Suspense fallback={<SectionFallback h="400px" />}>
          <ReviewsSection />
        </Suspense>
      </LazySection>

      <Footer />
    </div>
  );
};

export default Index;
