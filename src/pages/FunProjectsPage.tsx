import SectionPageShell from "@/components/SectionPageShell";
import PageHead from "@/components/PageHead";
import FunProjectsSection from "@/components/FunProjectsSection";
const FunProjectsPage = () => (
  <SectionPageShell>
    <PageHead title="Fun Projects — Dheer Joshi" description="Small side projects and experiments by Dheer Joshi." path="/fun-projects" />
    <FunProjectsSection />
  </SectionPageShell>
);
export default FunProjectsPage;
