import SectionPageShell from "@/components/SectionPageShell";
import PageHead from "@/components/PageHead";
import ProjectsSection from "@/components/ProjectsSection";
const ProjectsPage = () => (
  <SectionPageShell>
    <PageHead title="Projects — Dheer Joshi" description="AI & IoT projects by Dheer Joshi including WildSentry, EV Armour, and Ric." path="/projects" />
    <ProjectsSection />
  </SectionPageShell>
);
export default ProjectsPage;
