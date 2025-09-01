import { useState, useMemo, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { toolsByCategory } from '@/lib/toolsData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onToolSelect: (toolId: string) => void;
}

export const SearchModal = ({ isOpen, onClose, onToolSelect }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Função auxiliar para cálculo de distância Levenshtein
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  };

  // Função auxiliar para similaridade (Levenshtein simplificado)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  };

  // Filtrar ferramentas baseado na busca
  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return toolsByCategory;
    
    const query = searchQuery.toLowerCase().trim();
    const filtered: { [key: string]: Array<{ id: string; name: string; description: string }> } = {};
    
    Object.entries(toolsByCategory).forEach(([category, tools]) => {
      const matchingTools = tools.filter(tool => {
        const toolName = tool.name.toLowerCase();
        const toolDesc = tool.description.toLowerCase();
        const toolId = tool.id.toLowerCase();
        
        // Busca mais precisa com múltiplos critérios e pontuação
        const searchTargets = [toolName, toolDesc, toolId].join(' ');
        
        // 1. Match exato (prioridade máxima)
        if (toolName.includes(query) || toolDesc.includes(query) || toolId.includes(query)) {
          return true;
        }
        
        // 2. Match de palavras individuais
        const queryWords = query.split(/\s+/);
        const hasAllWords = queryWords.every(word => 
          word.length >= 2 && searchTargets.includes(word)
        );
        
        if (hasAllWords) return true;
        
        // 3. Match fuzzy apenas para queries de 3+ caracteres
        if (query.length >= 3) {
          const words = searchTargets.split(/\s+/);
          return words.some(word => 
            word.length >= 3 && (
              word.startsWith(query) || 
              word.includes(query) ||
              calculateSimilarity(word, query) > 0.6
            )
          );
        }
        
        return false;
      });
      
      if (matchingTools.length > 0) {
        filtered[category] = matchingTools;
      }
    });
    
    return filtered;
  }, [searchQuery]);

  const handleToolClick = (toolId: string) => {
    onToolSelect(toolId);
    onClose();
    setSearchQuery('');
  };

  const handleClose = () => {
    onClose();
    setSearchQuery('');
  };

  // Prevenir scroll quando modal está aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Fechar com ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-card rounded-2xl shadow-2xl border border-border/50 animate-scale-in max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Digite para buscar ferramentas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-lg bg-background/50 border-border/50 focus:border-primary/50 rounded-xl"
                autoFocus
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-12 w-12 rounded-xl hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {Object.keys(filteredResults).length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhuma ferramenta encontrada</h3>
              <p className="text-muted-foreground">
                Tente buscar com palavras-chave diferentes
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(filteredResults).map(([category, tools]) => (
                <div key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-medium">
                      {category}
                    </Badge>
                    <div className="flex-1 h-px bg-border/50" />
                  </div>
                  
                   <div className="grid gap-2">
                     {tools.map((tool) => (
                       <Link
                         key={tool.id}
                         to={`/ferramenta/${tool.id}`}
                         onClick={() => onClose()}
                         className="block w-full text-left p-4 rounded-xl hover:bg-accent/50 transition-all duration-200 group border border-transparent hover:border-border/50"
                       >
                         <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                           {tool.name}
                         </div>
                         <div className="text-sm text-muted-foreground mt-1 group-hover:text-muted-foreground/80">
                           {tool.description}
                         </div>
                       </Link>
                     ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border/50 bg-muted/20">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-background rounded border text-xs">↑↓</kbd>
              <span>navegar</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-background rounded border text-xs">↵</kbd>
              <span>selecionar</span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-background rounded border text-xs">esc</kbd>
              <span>fechar</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};