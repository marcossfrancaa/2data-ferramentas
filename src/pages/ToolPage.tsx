import { useParams, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ModernSidebar } from '@/components/ModernSidebar';
import { ToolContainer } from '@/components/ToolContainer';
import { ModernHeader } from '@/components/ModernHeader';
import { Footer } from '@/components/Footer';
import { ThemeProvider } from '@/hooks/use-theme';

const ToolPage = () => {
  const { toolId } = useParams<{ toolId: string }>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  if (!toolId) {
    return <Navigate to="/" replace />;
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <ThemeProvider defaultTheme="system" storageKey="devtools-theme">
      <div className="min-h-screen bg-background">
        <ModernSidebar 
          selectedTool={toolId} 
          onToolSelect={() => {}} // Navigation will be handled by router
          searchQuery={searchQuery}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <div className={`${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-80'} flex flex-col min-h-screen transition-all duration-300`}>
          <ModernHeader onSearch={handleSearch} onToolSelect={() => {}} />
          <div className="flex-1">
            <ToolContainer toolId={toolId} />
          </div>
          {/* Footer sempre no final da página */}
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default ToolPage;