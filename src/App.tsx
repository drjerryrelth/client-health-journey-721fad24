
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/auth";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import ClientPortal from "./pages/ClientPortal";
import CheckIn from "./pages/CheckIn";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Admin Pages
import ClientsPage from "./pages/admin/ClientsPage";
import ClinicsPage from "./pages/admin/ClinicsPage";
import CheckInsPage from "./pages/admin/CheckInsPage";
import ProgramsPage from "./pages/admin/ProgramsPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SettingsPage from "./pages/admin/SettingsPage";
import CoachesPage from "./pages/admin/CoachesPage";
import ActivitiesPage from "./pages/admin/ActivitiesPage"; 
import ResourcesPage from "./pages/admin/ResourcesPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage"; // Import the new AdminUsersPage

// Layouts
import MainLayout from "./components/layout/MainLayout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Admin routes */}
            <Route element={<MainLayout requiredRoles={['admin']} />}>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/clients" element={<ClientsPage />} />
              <Route path="/clinics" element={<ClinicsPage />} />
              <Route path="/coaches" element={<CoachesPage />} />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/check-ins" element={<CheckInsPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/admin-users" element={<AdminUsersPage />} /> {/* Add the AdminUsersPage route */}
            </Route>
            
            {/* Coach routes */}
            <Route element={<MainLayout requiredRoles={['coach']} />}>
              <Route path="/coach-dashboard" element={<Dashboard />} />
              <Route path="/coach/clients" element={<Dashboard />} />
              <Route path="/coach/programs" element={<Dashboard />} />
              <Route path="/coach/check-ins" element={<Dashboard />} />
              <Route path="/coach/reports" element={<Dashboard />} />
              <Route path="/coach/settings" element={<Dashboard />} />
              <Route path="/coach/resources" element={<ResourcesPage />} />
              <Route path="/add-client" element={<Dashboard />} />
            </Route>
            
            {/* Client routes */}
            <Route element={<MainLayout requiredRoles={['client']} />}>
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/client-portal" element={<ClientPortal />} />
              <Route path="/check-in" element={<CheckIn />} />
              <Route path="/progress" element={<ClientDashboard />} />
              <Route path="/my-program" element={<ClientDashboard />} />
              <Route path="/profile" element={<ClientDashboard />} />
              <Route path="/client/resources" element={<ResourcesPage />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
