import SectionPageShell from "@/components/SectionPageShell";
import PageHead from "@/components/PageHead";
import SkillsSection from "@/components/SkillsSection";
const SkillsPage = () => (
  <SectionPageShell>
    <PageHead title="Skills — Dheer Joshi" description="Technical and soft skills of Dheer Joshi across hardware, software, and AI." path="/skills" />
    <SkillsSection />
  </SectionPageShell>
);
export default SkillsPage;
