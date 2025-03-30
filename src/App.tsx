
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ClientDashboard from "./pages/ClientDashboard";
import ClientPortal from "./pages/ClientPortal";
import CheckIn from "./pages/CheckIn";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

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
            
            {/* Admin/Coach routes */}
            <Route element={<MainLayout requiredRoles={['admin', 'coach']} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clients" element={<Dashboard />} />
              <Route path="/programs" element={<Dashboard />} />
              <Route path="/check-ins" element={<Dashboard />} />
              <Route path="/reports" element={<Dashboard />} />
              <Route path="/settings" element={<Dashboard />} />
            </Route>
            
            {/* Client routes */}
            <Route element={<MainLayout requiredRoles={['client']} />}>
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/client-portal" element={<ClientPortal />} />
              <Route path="/check-in" element={<CheckIn />} />
              <Route path="/progress" element={<ClientDashboard />} />
              <Route path="/my-program" element={<ClientDashboard />} />
              <Route path="/profile" element={<ClientDashboard />} />
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
