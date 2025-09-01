import { useState, useEffect } from 'react';
import { Search, Sun, Moon, Menu, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';
import { useIsMobile } from '@/hooks/use-mobile';
import { useFavorites } from '@/contexts/FavoritesContext';
import { SearchModal } from './SearchModal';
import { FavoritesPanel } from './FavoritesPanel';
import { cn } from '@/lib/utils';

interface ModernHeaderProps {
  onSearch: (query: string) => void;
  onToolSelect?: (toolId: string) => void;
  onMobileMenuToggle?: () => void;
}

export const ModernHeader = ({ onSearch, onToolSelect, onMobileMenuToggle }: ModernHeaderProps) => {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isFavoritesPanelOpen, setIsFavoritesPanelOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();
  const { getFavoritesCount } = useFavorites();
  
  const favoritesCount = getFavoritesCount();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const openFavoritesPanel = () => {
    setIsFavoritesPanelOpen(true);
  };

  const closeFavoritesPanel = () => {
    setIsFavoritesPanelOpen(false);
  };

  const handleToolSelect = (toolId: string) => {
    if (onToolSelect) {
      onToolSelect(toolId);
    }
    closeSearchModal();
    closeFavoritesPanel();
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
      <header className="h-14 sm:h-16 lg:h-20 border-b border-border/50 bg-card/80 backdrop-blur-sm px-3 sm:px-4 lg:px-6 flex items-center justify-between shadow-soft relative z-30">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile menu button */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMobileMenuToggle}
              className="p-2 sm:p-3 hover:bg-primary/10 lg:hidden min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] touch-manipulation hover:scale-105 transition-all duration-200"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 hover:rotate-180" />
            </Button>
          )}
          
          {/* Logo para mobile */}
          {isMobile && (
            <h1 className="text-base sm:text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
              2Data
            </h1>
          )}
        </div>
        
        <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
          {/* Search button - adaptado para mobile */}
          <button
            onClick={openSearchModal}
            className={cn(
              "flex items-center gap-2 bg-background/50 border border-border/50 rounded-lg hover:border-primary/50 transition-all duration-200 hover:shadow-sm group touch-manipulation",
              isMobile ? "px-2.5 sm:px-3 py-2.5 sm:py-3 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px]" : "px-4 py-2.5 min-h-[40px]"
            )}
          >
            <Search className={cn(
              "text-muted-foreground group-hover:text-primary transition-colors",
              isMobile ? "w-4 h-4 sm:w-5 sm:h-5" : "w-4 h-4"
            )} />
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

          {/* Botão de Favoritos */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openFavoritesPanel}
            className={cn(
              "relative hover:bg-primary/10 transition-all duration-300 hover:scale-110 touch-manipulation group",
              isMobile ? "h-10 w-10 sm:h-11 sm:w-11 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-2.5 sm:p-3" : "h-10 w-10 lg:h-11 lg:w-11"
            )}
          >
            <Star className={cn(
              "transition-all duration-200 group-hover:text-yellow-500",
              favoritesCount > 0 ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground",
              isMobile ? "h-4 w-4 sm:h-5 sm:w-5" : "h-4 w-4 lg:h-5 lg:w-5"
            )} />
            {favoritesCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs font-bold bg-yellow-500 border-2 border-background"
              >
                {favoritesCount > 99 ? '99+' : favoritesCount}
              </Badge>
            )}
            <span className="sr-only">Favoritos ({favoritesCount})</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
              "hover:bg-primary/10 transition-all duration-300 hover:scale-110 touch-manipulation group relative overflow-hidden",
              "before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-amber-400/20 before:to-blue-400/20 before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
              isMobile ? "h-10 w-10 sm:h-11 sm:w-11 min-w-[40px] min-h-[40px] sm:min-w-[44px] sm:min-h-[44px] p-2.5 sm:p-3" : "h-10 w-10 lg:h-11 lg:w-11"
            )}
          >
            <Sun className={cn(
              "relative z-10 rotate-0 scale-100 transition-all duration-500 dark:-rotate-180 dark:scale-0 group-hover:text-amber-500 group-hover:drop-shadow-md",
              isMobile ? "h-4 w-4 sm:h-5 sm:w-5" : "h-4 w-4 lg:h-5 lg:w-5"
            )} />
            <Moon className={cn(
              "absolute z-10 rotate-180 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100 group-hover:text-blue-400 group-hover:drop-shadow-md",
              isMobile ? "h-4 w-4 sm:h-5 sm:w-5" : "h-4 w-4 lg:h-5 lg:w-5"
            )} />
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
      
      {/* Favorites Panel */}
      <FavoritesPanel 
        isOpen={isFavoritesPanelOpen}
        onClose={closeFavoritesPanel}
        onToolSelect={handleToolSelect}
      />
    </>
  );
};