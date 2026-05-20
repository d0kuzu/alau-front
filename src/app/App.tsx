import { Toaster } from "@/shared/ui/toaster";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { LanguageProvider } from "@/shared/contexts/LanguageContext";
import Index from "@/features/landing/pages/Index";
import Auth from "@/features/auth/pages/Auth";
import Login from "@/features/auth/pages/Login";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import V2Dashboard from "@/features/dashboard/pages/V2Dashboard";
import NotFound from "./NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/frontend/login" element={<Login />} />
              <Route path="/v2/login" element={<Navigate to="/login" replace />} />
              <Route path="/frontend/v2/login" element={<Navigate to="/frontend/login" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/dashboard/assistants/:assistantId" element={<Dashboard />} />
              <Route path="/v2/dashboard" element={<V2Dashboard />} />
              <Route path="/frontend/v2/dashboard" element={<V2Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
