import { useState, useEffect } from 'react';
import { X, Download, Smartphone, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useIsMobile } from '@/hooks/use-mobile';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: ReadonlyArray<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [hasShown, setHasShown] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Escuta o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Só mostra em mobile e se ainda não mostrou
      const hasShownBefore = localStorage.getItem('pwa-install-popup-shown');
      if (isMobile && !hasShownBefore && !hasShown) {
        // Mostra após 15 segundos
        setTimeout(() => {
          setIsOpen(true);
          setHasShown(true);
          localStorage.setItem('pwa-install-popup-shown', 'true');
        }, 15000);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, [isMobile, hasShown]);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      // Fallback para iOS Safari
      setIsOpen(false);
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  // Detecta se é iOS Safari
  const isIOSSafari = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Smartphone className="h-6 w-6 text-blue-500" />
            Instalar 2Data
          </DialogTitle>
          <DialogDescription className="text-base">
            Instale o 2Data no seu celular para acesso rápido e offline!
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/30 dark:to-green-950/30 rounded-lg border">
            <div className="text-center">
              <div className="relative">
                <Smartphone className="h-16 w-16 text-blue-500 mx-auto mb-3" />
                <Download className="h-6 w-6 text-green-500 absolute -bottom-1 -right-1 bg-white dark:bg-gray-900 rounded-full p-1" />
              </div>
              <p className="font-semibold text-lg mb-1">App Nativo</p>
              <p className="text-sm text-muted-foreground">
                Acesso rápido, notificações e uso offline
              </p>
            </div>
          </div>

          {isIOSSafari && (
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-800 dark:text-blue-200 mb-2 font-medium">
                Para instalar no iOS Safari:
              </p>
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                <span>1. Toque no botão</span>
                <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs">
                  ⬆️ Compartilhar
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 mt-1">
                <span>2. Selecione</span>
                <div className="bg-blue-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                  <Plus className="h-3 w-3" />
                  Adicionar à Tela Inicial
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={handleInstall}
              className="flex-1"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              {isIOSSafari ? 'Ver Instruções' : 'Instalar App'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClose}
              size="lg"
            >
              Agora Não
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};