
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { useEffect } from "react";
import { initializeDemoRelationships } from "./services/demo-data-initializer";
import { ThemeProvider } from "./context/ThemeContext";
import { ClinicThemeProvider } from "./components/theme/ClinicThemeProvider";

// Import all page components
import Index from "./pages/Index";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import ClinicSignup from "./pages/ClinicSignup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import MealPlanGenerator from "./pages/MealPlanGenerator";
import MainLayout from "./components/layout/MainLayout";
import { AdminRoutes, CoachRoutes, ClientRoutes } from "./components/routes";
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';

// Create a function component for the app content to use React hooks properly
const App = () => {
  // Move queryClient inside the component
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

// Separate component for app content
const AppContent = () => {
  useEffect(() => {
    initializeDemoRelationships()
      .catch(err => console.error('Error initializing demo data:', err));
  }, []);
  
  return (
    <TooltipProvider>
      <ClinicThemeProvider>
        <Toaster />
        <Sonner />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/signup/clinic" element={<ClinicSignup />} />
          
          {/* Redirect any other signup routes to the clinic signup page */}
          <Route path="/signup/*" element={<Navigate to="/signup/clinic" replace />} />
          
          {/* Dashboard routes with role-based redirects */}
          <Route path="/dashboard/*" element={<Dashboard />} />
          
          {/* Admin routes */}
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          
          {/* Coach routes */}
          <Route path="/coach/*" element={<CoachRoutes />} />
          <Route path="/coach" element={<Navigate to="/coach/dashboard" replace />} />
          
          {/* Client routes */}
          <Route path="/client/*" element={<ClientRoutes />} />
          
          {/* Legacy routes */}
          <Route path="/coach-dashboard/*" element={<Dashboard />} />
          <Route path="/client-dashboard/*" element={<Dashboard />} />
          <Route path="/check-in" element={<Dashboard />} />
          <Route path="/progress" element={<Dashboard />} />
          <Route path="/my-program" element={<Dashboard />} />
          <Route path="/profile" element={<Dashboard />} />
          
          {/* Coach specific routes outside dashboard */}
          <Route element={<MainLayout requiredRoles={['coach']} />}>
            <Route path="/coach/meal-plan-generator" element={<MealPlanGenerator />} />
          </Route>

          {/* Admin specific routes outside dashboard */}
          <Route element={<MainLayout requiredRoles={['admin', 'super_admin']} />}>
            <Route path="/meal-plan-generator" element={<MealPlanGenerator />} />
          </Route>
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
          
          {/* Legal routes */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </ClinicThemeProvider>
    </TooltipProvider>
  );
};

export default App;
