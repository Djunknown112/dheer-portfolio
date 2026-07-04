import SectionPageShell from "@/components/SectionPageShell";
import PageHead from "@/components/PageHead";
import AchievementsSection from "@/components/AchievementsSection";
const AchievementsPage = () => (
  <SectionPageShell>
    <PageHead title="Achievements — Dheer Joshi" description="Awards, recognitions, and competition results earned by Dheer Joshi." path="/achievements" />
    <AchievementsSection />
  </SectionPageShell>
);
export default AchievementsPage;
