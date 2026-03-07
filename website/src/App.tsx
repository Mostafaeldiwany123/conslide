import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Install from "./pages/Install";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AiPolicy from "./pages/AiPolicy";
import Support from "./pages/Support";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AuthRedirectHandler = () => {
  const { session, profile } = useAuth();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const port = localStorage.getItem('app_port');
    if (session?.user && port) {
      localStorage.removeItem('app_port');
      setRedirecting(true);

      const payload = {
        user_id: session.user.id,
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        tier: profile?.tier || 'free'
      };

      fetch(`http://127.0.0.1:${port}/callback_post`, {
        method: 'POST',
        body: JSON.stringify(payload)
      }).catch(() => { });
    }
  }, [session]);

  if (redirecting) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">You're all set!</h1>
          <p className="text-gray-500 mb-6">Your account has been connected successfully. You can now go back to the Conslide app.</p>
          <p className="text-sm text-gray-400 mb-6">You can safely close this tab.</p>
          <a href="/" className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    );
  }

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AuthRedirectHandler />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/install" element={<Install />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/ai-policy" element={<AiPolicy />} />
            <Route path="/support" element={<Support />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;