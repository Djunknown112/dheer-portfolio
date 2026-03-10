import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminResetPassword from "./pages/AdminResetPassword";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProjects from "./pages/AdminProjects";
import AdminAchievements from "./pages/AdminAchievements";
import AdminDocuments from "./pages/AdminDocuments";
import AdminPhotos from "./pages/AdminPhotos";
import AdminContent from "./pages/AdminContent";
import AdminSkills from "./pages/AdminSkills";
import AdminMessages from "./pages/AdminMessages";
import AdminAboutHighlights from "./pages/AdminAboutHighlights";
import AdminAppearance from "./pages/AdminAppearance";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="achievements" element={<AdminAchievements />} />
              <Route path="documents" element={<AdminDocuments />} />
              <Route path="photos" element={<AdminPhotos />} />
              <Route path="content" element={<AdminContent />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="messages" element={<AdminMessages />} />
              <Route path="about-highlights" element={<AdminAboutHighlights />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
