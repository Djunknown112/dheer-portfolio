import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/hooks/useAuth";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import PageTransition from "@/components/PageTransition";

const NotFound = lazy(() => import("./pages/NotFound"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminResetPassword = lazy(() => import("./pages/AdminResetPassword"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminProjects = lazy(() => import("./pages/AdminProjects"));
const AdminAchievements = lazy(() => import("./pages/AdminAchievements"));
const AdminMentors = lazy(() => import("./pages/AdminMentors"));
const AdminDocuments = lazy(() => import("./pages/AdminDocuments"));
const AdminPhotos = lazy(() => import("./pages/AdminPhotos"));
const AdminContent = lazy(() => import("./pages/AdminContent"));
const AdminSkills = lazy(() => import("./pages/AdminSkills"));
const AdminMessages = lazy(() => import("./pages/AdminMessages"));
const AdminAboutHighlights = lazy(() => import("./pages/AdminAboutHighlights"));
const AdminAppearance = lazy(() => import("./pages/AdminAppearance"));
const AdminReviews = lazy(() => import("./pages/AdminReviews"));

const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const FunProjectsPage = lazy(() => import("./pages/FunProjectsPage"));
const AdminFunProjects = lazy(() => import("./pages/AdminFunProjects"));
const AchievementsPage = lazy(() => import("./pages/AchievementsPage"));
const MentorsPage = lazy(() => import("./pages/MentorsPage"));
const SkillsPage = lazy(() => import("./pages/SkillsPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const DocumentsPage = lazy(() => import("./pages/DocumentsPage"));
const ReviewsPage = lazy(() => import("./pages/ReviewsPage"));
const SummaryPage = lazy(() => import("./pages/SummaryPage"));
const ChatbotPage = lazy(() => import("./pages/ChatbotPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

const RouteFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center text-primary text-sm font-display animate-pulse">
    Loading…
  </div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  const wrap = (el: JSX.Element) => <PageTransition>{el}</PageTransition>;
  return (
    <AnimatePresence mode="wait">
      <Suspense key={location.pathname} fallback={<RouteFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={wrap(<Index />)} />
          <Route path="/projects" element={wrap(<ProjectsPage />)} />
          <Route path="/fun-projects" element={wrap(<FunProjectsPage />)} />
          <Route path="/achievements" element={wrap(<AchievementsPage />)} />
          <Route path="/mentors" element={wrap(<MentorsPage />)} />
          <Route path="/skills" element={wrap(<SkillsPage />)} />
          <Route path="/gallery" element={wrap(<GalleryPage />)} />
          <Route path="/documents" element={wrap(<DocumentsPage />)} />
          <Route path="/reviews" element={wrap(<ReviewsPage />)} />
          <Route path="/summary" element={wrap(<SummaryPage />)} />
          <Route path="/chat" element={wrap(<ChatbotPage />)} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/reset-password" element={<AdminResetPassword />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="fun-projects" element={<AdminFunProjects />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="mentors" element={<AdminMentors />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="photos" element={<AdminPhotos />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="skills" element={<AdminSkills />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="about-highlights" element={<AdminAboutHighlights />} />
            <Route path="appearance" element={<AdminAppearance />} />
            <Route path="reviews" element={<AdminReviews />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
