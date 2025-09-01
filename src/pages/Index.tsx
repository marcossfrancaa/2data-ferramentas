
import { useState, useEffect } from 'react';
import { ModernSidebar } from '@/components/ModernSidebar';
import { ModernHeader } from '@/components/ModernHeader';
import { ModernHomePage } from '@/components/ModernHomePage';
import { Footer } from '@/components/Footer';
import { FavoritesPopup } from '@/components/FavoritesPopup';
import { PWAInstallPopup } from '@/components/PWAInstallPopup';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  // Registra o Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  // Fecha sidebar mobile ao redimensionar para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile]);

  return (
    <>
      <div className="min-h-screen bg-background">
        <ModernSidebar 
          selectedTool="home" 
          onToolSelect={() => {}} 
          searchQuery={searchQuery}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          isMobileOpen={isMobileSidebarOpen}
          onMobileClose={handleMobileSidebarClose}
        />
        <div className={`transition-all duration-300 flex flex-col min-h-screen ${
          isMobile 
            ? 'ml-0' 
            : sidebarCollapsed 
              ? 'lg:ml-16' 
              : 'lg:ml-80'
        }`}>
          <ModernHeader 
            onSearch={handleSearch} 
            onToolSelect={() => {}} 
            onMobileMenuToggle={handleMobileMenuToggle}
          />
          <div className="flex-1">
            <ModernHomePage onToolSelect={() => {}} />
          </div>
          {/* Footer sempre no final da página */}
          <Footer />
        </div>
      </div>
      
      {/* Popups */}
      <FavoritesPopup />
      <PWAInstallPopup />
    </>
  );
};

export default Index;
