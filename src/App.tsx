import { lazy, Suspense } from "react";
import { Toaster } from "@ui/components/ui/toaster";
import { Toaster as Sonner } from "@ui/components/ui/sonner";
import { TooltipProvider } from "@ui/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@infrastructure/auth";
import { ProtectedRoute } from "@infrastructure/auth";
const AppLayout = lazy(() => import("@ui/components/layout/AppLayout").then(m => ({ default: m.AppLayout })));

// Lazy-loaded route components to reduce initial JS bundle
const DashboardPage = lazy(() => import("@ui/pages/DashboardPage"));
const LoginPage = lazy(() => import("@ui/pages/auth/LoginPage"));
const SignupPage = lazy(() => import("@ui/pages/auth/SignupPage"));
const ManualPage = lazy(() => import("@ui/pages/ManualPage"));
const ServicePage = lazy(() => import("@ui/pages/ServicePage"));
const ServiceDetailPage = lazy(() => import("@ui/pages/ServiceDetailPage"));
const NewServicePage = lazy(() => import("@ui/pages/NewServicePage"));
const AreasPage = lazy(() => import("@ui/pages/AreasPage"));
const NewAreaPage = lazy(() => import("@ui/pages/NewAreaPage"));
const NewOperationPage = lazy(() => import("@ui/pages/NewOperationPage"));
const SettingsPage = lazy(() => import("@ui/pages/SettingsPage"));
const AssistantPage = lazy(() => import("@ui/pages/AssistantPage"));
const NotFound = lazy(() => import("@ui/pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

const PageLoader = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/e-ManuAi-2026">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public auth routes */}
              <Route path="/prihlaseni" element={<LoginPage />} />
              <Route path="/registrace" element={<SignupPage />} />

              {/* Protected routes with app layout */}
              <Route element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/manual" element={<ManualPage />} />
                <Route path="/manual/:section" element={<ManualPage />} />
                <Route path="/servis" element={<ServicePage />} />
                <Route path="/servis/novy" element={<NewServicePage />} />
                <Route path="/servis/:id" element={<ServiceDetailPage />} />
                <Route path="/arealy" element={<AreasPage />} />
                <Route path="/arealy/novy" element={<NewAreaPage />} />
                <Route path="/arealy/:id" element={<AreasPage />} />
                <Route path="/provoz/novy" element={<NewOperationPage />} />
                <Route path="/nastaveni" element={<SettingsPage />} />
                <Route path="/asistent" element={<AssistantPage />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
