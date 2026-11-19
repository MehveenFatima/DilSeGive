import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { ScrollToTop } from "./components/ScrollToTop";
import { DonorSummary } from "./components/donor/DonorSummary";
import { DonationList } from "./components/donor/DonationList";
import { ImpactReports } from "./components/donor/ImpactReports";
import { DonorProfile } from "./components/donor/DonorProfile";

// Pages are loaded on demand so the first visit downloads less JavaScript
const Index = lazy(() => import("./pages/Index"));
const Campaigns = lazy(() => import("./pages/Campaigns"));
const CampaignDetail = lazy(() => import("./pages/CampaignDetail"));
const Transparency = lazy(() => import("./pages/Transparency"));
const DonorDashboard = lazy(() => import("./pages/DonorDashboard"));
const NgoDashboard = lazy(() => import("./pages/NgoDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="animate-pulse text-muted-foreground">Loading...</p>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/campaigns" element={<Campaigns />} />
            <Route path="/campaigns/:id" element={<CampaignDetail />} />
            <Route path="/transparency" element={<Transparency />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute role="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/donor-dashboard" 
              element={
                <ProtectedRoute role="donor">
                  <DonorDashboard />
                </ProtectedRoute>
              } 
            >
              <Route index element={<DonorSummary />} />
              <Route path="donations" element={<DonationList />} />
              <Route path="reports" element={<ImpactReports />} />
              <Route path="profile" element={<DonorProfile />} />
            </Route>
          
            {/* Fallback for old/wrong paths */}
            <Route path="/donor" element={<Navigate to="/donor-dashboard" replace />} />
            <Route path="/ngo" element={<Navigate to="/ngo-dashboard" replace />} />

            <Route 
              path="/ngo-dashboard" 
              element={
                <ProtectedRoute role="ngo">
                  <NgoDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRedirect />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const DashboardRedirect = () => {
  const role = localStorage.getItem("role");

  if (role === null) {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return <Navigate to="/" replace />;
    return <p className="p-8 text-center animate-pulse">Loading dashboard...</p>;
  }
  
  if (role === "ngo") return <Navigate to="/ngo-dashboard" replace />;
  if (role === "admin") return <Navigate to="/admin" replace />;
  if (role === "donor") return <Navigate to="/donor-dashboard" replace />;
  
  return <Navigate to="/" replace />;
};

export default App;
