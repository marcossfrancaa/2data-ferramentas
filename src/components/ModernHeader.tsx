import { useState, useEffect } from 'react';
import { Search, Sun, Moon, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { useIsMobile } from '@/hooks/use-mobile';
import { SearchModal } from './SearchModal';

interface ModernHeaderProps {
  onSearch: (query: string) => void;
  onToolSelect?: (toolId: string) => void;
  onMobileMenuToggle?: () => void;
}

export const ModernHeader = ({ onSearch, onToolSelect, onMobileMenuToggle }: ModernHeaderProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const handleToolSelect = (toolId: string) => {
    if (onToolSelect) {
      onToolSelect(toolId);
    }
    closeSearchModal();
  };

  // Atalho de teclado para abrir busca (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearchModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 lg:h-20 border-b border-border/50 bg-card/80 backdrop-blur-sm px-4 lg:px-6 flex items-center justify-between shadow-soft relative z-30">
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              className="p-2 hover:bg-primary/10 lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
          )}
          
          {/* Logo para mobile */}
          {isMobile && (
            <h1 className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
              2Data
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Search button - adaptado para mobile */}
          <button
            onClick={openSearchModal}
            className="flex items-center gap-2 px-2 lg:px-3 py-2 bg-background/50 border border-border/50 rounded-lg hover:border-primary/50 transition-all duration-200 hover:shadow-sm group"
          >
            <Search className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            {!isMobile && (
              <>
                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                  Buscar ferramentas...
                </span>
                <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded text-muted-foreground">
                  ⌘K
                </kbd>
              </>
            )}
          </button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 lg:h-10 lg:w-10 hover:bg-primary/10 transition-all duration-300 hover:scale-110"
          >
            <Sun className="h-4 w-4 lg:h-5 lg:w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 lg:h-5 lg:w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen}
        onClose={closeSearchModal}
        onToolSelect={handleToolSelect}
      />
    </>
  );
};