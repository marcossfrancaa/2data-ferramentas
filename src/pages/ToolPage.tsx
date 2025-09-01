import { useParams, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ModernSidebar } from '@/components/ModernSidebar';
import { ToolContainer } from '@/components/ToolContainer';
import { ModernHeader } from '@/components/ModernHeader';
import { Footer } from '@/components/Footer';
import { PWAInstallPopup } from '@/components/PWAInstallPopup';
import { ThemeProvider } from '@/hooks/use-theme';
import { useIsMobile } from '@/hooks/use-mobile';
import { SEOHead } from '@/components/SEOHead';
import { getToolSEO, generateStructuredData } from '@/lib/seoData';
import { generateStructuredData as generateToolStructuredData } from '@/lib/searchConsole';
import { toolsByCategory } from '@/lib/toolsData';
import { trackPageView } from '@/lib/analytics';
import { gtmTrackPageView } from '@/lib/gtm';

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();

  if (!toolId) {
    return <Navigate to="/" replace />;
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const handleMobileSidebarClose = () => {
    setIsMobileSidebarOpen(false);
  };

  // Encontrar dados da ferramenta
  const findTool = () => {
    for (const category of Object.values(toolsByCategory)) {
      const tool = category.find(t => t.id === toolId);
      if (tool) return tool;
    }
    return null;
  };

  const currentTool = findTool();
  const seoData = getToolSEO(toolId || '');

  // Rastrear visualização da página da ferramenta
  useEffect(() => {
    if (toolId) {
      const fullPath = `/ferramenta/${toolId}`;
      trackPageView(fullPath);
      gtmTrackPageView(fullPath);
    }
  }, [toolId]);

  // Fecha sidebar mobile ao redimensionar para desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile]);

  // Gerar dados estruturados específicos para a ferramenta
  const toolStructuredData = currentTool ? generateToolStructuredData('tool', {
    id: toolId || '',
    name: currentTool.name,
    description: currentTool.description,
    category: 'FERRAMENTAS'
  }) : null;

  return (
    <ThemeProvider defaultTheme="system" storageKey="devtools-theme">
      {currentTool && seoData && (
        <SEOHead
          title={seoData.title}
          description={seoData.description}
          keywords={seoData.keywords}
          canonicalUrl={`https://2data.com.br/ferramenta/${toolId}`}
          structuredData={toolStructuredData ? [toolStructuredData] : generateStructuredData(toolId, currentTool.name, currentTool.description)}
        />
      )}
      <div className="min-h-screen bg-background">
        <ModernSidebar 
          selectedTool={toolId} 
          onToolSelect={() => {}} // Navigation will be handled by router
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
          <ModernHeader onSearch={handleSearch} onToolSelect={() => {}} onMobileMenuToggle={handleMobileMenuToggle} />
          <div className="flex-1">
            <ToolContainer toolId={toolId} />
          </div>
          {/* Footer sempre no final da página */}
          <Footer />
        </div>
      </div>
      
      {/* PWA Install Popup */}
      <PWAInstallPopup />
    </ThemeProvider>
  );
};

export default ToolPage;