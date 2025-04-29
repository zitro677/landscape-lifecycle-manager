
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";
import DashboardPage from "./components/dashboard/DashboardPage";
import InvoicesPage from "./components/invoices/InvoicesPage";
import InvoiceForm from "./components/invoices/InvoiceForm";
import ProposalsPage from "./components/proposals/ProposalsPage";
import ProposalForm from "./components/proposals/ProposalForm";
import FinancesPage from "./components/finances/FinancesPage";
import ProjectsPage from "./components/projects/ProjectsPage";
import ProjectDetail from "./components/projects/ProjectDetail";
import ProjectForm from "./components/projects/ProjectForm";
import LoginPage from "./components/auth/LoginPage";
import { AuthProvider, useAuth } from "./components/auth/AuthProvider";
import ClientsPage from "./components/clients/ClientsPage";
import ClientForm from "./components/clients/ClientForm";
import SettingsPage from "./components/settings/SettingsPage";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

// Auth guard component to protect routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Save the current path to redirect back after login
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => (
  <AnimatePresence mode="wait">
    <Routes>
      <Route path="/auth" element={<LoginPage />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="invoices/new" element={<InvoiceForm />} />
        <Route path="invoices/edit/:id" element={<InvoiceForm />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="clients/new" element={<ClientForm />} />
        <Route path="clients/edit/:id" element={<ClientForm />} />
        <Route path="proposals" element={<ProposalsPage />} />
        <Route path="proposals/new" element={<ProposalForm />} />
        <Route path="proposals/edit/:id" element={<ProposalForm />} />
        <Route path="finances" element={<FinancesPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/edit/:id" element={<ProjectForm />} />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
      
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AnimatePresence>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
