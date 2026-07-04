import SectionPageShell from "@/components/SectionPageShell";
import PageHead from "@/components/PageHead";
import GallerySection from "@/components/GallerySection";
const GalleryPage = () => (
  <SectionPageShell>
    <PageHead title="Gallery — Dheer Joshi" description="Photos from events, builds, and demonstrations by Dheer Joshi." path="/gallery" />
    <GallerySection />
  </SectionPageShell>
);
export default GalleryPage;
