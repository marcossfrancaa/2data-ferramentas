import React from 'react';
import { Link } from 'react-router-dom';
import { X, Trash2, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFavorites } from '@/contexts/FavoritesContext';
import { toolsByCategory } from '@/lib/toolsData';
import { cn } from '@/lib/utils';

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onToolSelect: (toolId: string) => void;
}

export const FavoritesPanel: React.FC<FavoritesPanelProps> = ({
  isOpen,
  onClose,
  onToolSelect
}) => {
  const { favoriteTools, removeFavorite, clearAllFavorites, getFavoritesCount } = useFavorites();

  // Obter dados completos das ferramentas favoritas
  const allTools = Object.values(toolsByCategory).flat();
  const favoriteToolsData = allTools.filter(tool => favoriteTools.includes(tool.id));

  const handleToolClick = (toolId: string) => {
    onToolSelect(toolId);
    onClose();
  };

  const handleRemoveFavorite = (toolId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFavorite(toolId);
  };

  const handleClearAll = () => {
    clearAllFavorites();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="relative">
              <Star className="h-6 w-6 fill-yellow-500 text-yellow-500" />
              <Heart className="h-3 w-3 fill-red-500 text-red-500 absolute -top-1 -right-1" />
            </div>
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Suas Ferramentas Favoritas
            </span>
            {getFavoritesCount() > 0 && (
              <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
                {getFavoritesCount()}
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription className="text-base">
            Acesse rapidamente suas ferramentas preferidas
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {favoriteToolsData.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Star className="h-16 w-16 text-muted-foreground/30 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                Nenhuma ferramenta favorita ainda
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Clique na estrela ⭐ das ferramentas para adicioná-las aos seus favoritos
              </p>
              <Button onClick={onClose} variant="outline">
                Explorar Ferramentas
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Botão para limpar todos */}
              {favoriteToolsData.length > 1 && (
                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearAll}
                    className="text-red-600 hover:bg-red-50 hover:border-red-200"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpar Todos
                  </Button>
                </div>
              )}

              {/* Lista de ferramentas favoritas */}
              <div className="grid gap-3">
                {favoriteToolsData.map((tool) => (
                  <Card 
                    key={tool.id}
                    className="p-4 hover:shadow-md transition-all duration-200 cursor-pointer group bg-gradient-card border-border/50"
                  >
                    <Link 
                      to={`/ferramenta/${tool.id}`}
                      onClick={() => handleToolClick(tool.id)}
                      className="block"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
                              {tool.name}
                            </h4>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {tool.description}
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleRemoveFavorite(tool.id, e)}
                          className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all duration-200 flex-shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>

              {/* Dica */}
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-3">
                  <Star className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200 text-sm">
                      💡 Dica Profissional
                    </h4>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                      Seus favoritos são salvos localmente no navegador e estarão disponíveis sempre que você voltar!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};