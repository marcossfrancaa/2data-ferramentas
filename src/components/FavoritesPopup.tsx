import { useState, useEffect } from 'react';
import { X, Star, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const FavoritesPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Verifica se já mostrou o popup antes
    const hasShownBefore = localStorage.getItem('favorites-popup-shown');
    if (hasShownBefore || hasShown) return;

    // Só mostra em desktop
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    // Mostra após 20 segundos
    const timer = setTimeout(() => {
      setIsOpen(true);
      setHasShown(true);
      localStorage.setItem('favorites-popup-shown', 'true');
    }, 20000);

    return () => clearTimeout(timer);
  }, [hasShown]);

  const handleAddToFavorites = () => {
    // Simula Ctrl+D para adicionar aos favoritos
    if (navigator.userAgent.includes('Chrome')) {
      // Chrome não permite programaticamente adicionar favoritos
      alert('Pressione Ctrl+D para adicionar aos favoritos!');
    }
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Star className="h-6 w-6 text-yellow-500" />
            Adicionar aos Favoritos
          </DialogTitle>
          <DialogDescription className="text-base">
            Gostando do 2Data? Adicione-nos aos seus favoritos para acesso rápido!
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border">
            <div className="text-center">
              <Keyboard className="h-12 w-12 text-blue-500 mx-auto mb-3" />
              <p className="font-semibold text-lg mb-1">Pressione</p>
              <div className="flex items-center justify-center gap-1">
                <kbd className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">Ctrl</kbd>
                <span>+</span>
                <kbd className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono">D</kbd>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Para adicionar aos favoritos
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleAddToFavorites}
              className="flex-1"
              size="lg"
            >
              <Star className="h-4 w-4 mr-2" />
              Adicionar Agora
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClose}
              size="lg"
            >
              Talvez Depois
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};