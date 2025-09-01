import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { CookieConsent } from "@/components/CookieConsent";
import { HelmetProvider } from 'react-helmet-async';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import { initGA, trackPageView } from '@/lib/analytics';
import { initGTM, gtmTrackPageView } from '@/lib/gtm';
import { useEffect } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Sobre from "./pages/Sobre";
import TermosDeUso from "./pages/TermosDeUso";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import PoliticaCookies from "./pages/PoliticaCookies";
import Contato from "./pages/Contato";
import ToolPage from "./pages/ToolPage";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();

  useEffect(() => {
    // Inicializar Google Analytics e Google Tag Manager
    initGA();
    initGTM();
  }, []);

  useEffect(() => {
    // Rastrear page views no GA e GTM
    const fullPath = location.pathname + location.search;
    trackPageView(fullPath);
    gtmTrackPageView(fullPath);
  }, [location]);

  return (
    <>
      <Toaster />
      <Sonner />
      <CookieConsent />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/termos-de-uso" element={<TermosDeUso />} />
        <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
        <Route path="/politica-de-cookies" element={<PoliticaCookies />} />
        <Route path="/contato" element={<Contato />} />
        
        {/* Rotas das Ferramentas */}
        <Route path="/ferramenta/:toolId" element={<ToolPage />} />
        
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const App = () => {
  console.log("App component rendering - no BrowserRouter here");
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <FavoritesProvider>
            <AppContent />
          </FavoritesProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
