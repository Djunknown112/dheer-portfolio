import SectionPageShell from "@/components/SectionPageShell";
import PageHead from "@/components/PageHead";
import MentorsSection from "@/components/MentorsSection";
const MentorsPage = () => (
  <SectionPageShell>
    <PageHead title="Mentors — Dheer Joshi" description="People who have guided Dheer Joshi's technical and academic journey." path="/mentors" />
    <MentorsSection />
  </SectionPageShell>
);
export default MentorsPage;
