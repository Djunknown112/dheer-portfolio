import SectionPageShell from "@/components/SectionPageShell";
import PageHead from "@/components/PageHead";
import ReviewsSection from "@/components/ReviewsSection";
const ReviewsPage = () => (
  <SectionPageShell>
    <PageHead title="Reviews — Dheer Joshi" description="Public reviews and testimonials about Dheer Joshi's work." path="/reviews" />
    <ReviewsSection />
  </SectionPageShell>
);
export default ReviewsPage;
