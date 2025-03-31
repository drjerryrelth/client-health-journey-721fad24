
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { useEffect } from "react";
import { initializeDemoRelationships } from "./services/demo-data-initializer";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import MealPlanGenerator from "./pages/MealPlanGenerator";
import MyProfile from "./pages/MyProfile";

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

const AppContent = () => {
  // Initialize demo relationships on app start
  useEffect(() => {
    initializeDemoRelationships()
      .catch(err => console.error('Error initializing demo data:', err));
  }, []);
  
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        {/* Dashboard - handles role-based routing internally */}
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/coach-dashboard/*" element={<Dashboard />} />
        <Route path="/client-dashboard/*" element={<Dashboard />} />
        
        {/* Client routes that are handled by ClientRoutes */}
        <Route path="/client/*" element={<Dashboard />} />
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
      </Routes>
    </TooltipProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
