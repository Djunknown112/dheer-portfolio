import SectionPageShell from "@/components/SectionPageShell";
import PageHead from "@/components/PageHead";
import DocumentsSection from "@/components/DocumentsSection";
const DocumentsPage = () => (
  <SectionPageShell>
    <PageHead title="Documents — Dheer Joshi" description="Academic marksheets and certificates for Dheer Joshi." path="/documents" />
    <DocumentsSection />
  </SectionPageShell>
);
export default DocumentsPage;
