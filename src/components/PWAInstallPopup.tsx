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
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  // Mostrar popup após 30 segundos APENAS em mobile real
  useEffect(() => {
    const hasShownBefore = localStorage.getItem('pwa-install-popup-shown');
    const lastShown = localStorage.getItem('pwa-install-popup-last-shown');
    const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
    
    // Detectar se é mobile REAL (não desktop em modo responsivo)
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isRealMobile = isMobile && (isMobileDevice || isTouchDevice) && window.innerWidth <= 768;
    
    // Mostrar se nunca mostrou ou se passou mais de 1 dia
    const shouldShow = !hasShownBefore || (lastShown && parseInt(lastShown) < oneDayAgo);
    
    if (isRealMobile && shouldShow && !hasShown) {
      // Mostra após 30 segundos
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem('pwa-install-popup-shown', 'true');
        localStorage.setItem('pwa-install-popup-last-shown', Date.now().toString());
      }, 30000);

      return () => clearTimeout(timer);
    }
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
      <DialogContent className="sm:max-w-md mx-4 border-2 shadow-2xl w-[calc(100vw-2rem)] max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-green-500 rounded-full blur-sm opacity-50"></div>
              <div className="relative bg-gradient-to-r from-blue-500 to-green-500 p-2 rounded-full">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Instalar 2Data
            </span>
          </DialogTitle>
          <DialogDescription className="text-base text-center">
            🚀 Instale o 2Data no seu celular para acesso instantâneo e offline!
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-green-950/30 rounded-xl border-2 border-gradient-to-r from-blue-200 to-green-200 dark:from-blue-800 dark:to-green-800">
            <div className="text-center">
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-2xl blur-lg opacity-30 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-green-500 p-4 rounded-2xl">
                  <Smartphone className="h-12 w-12 text-white mx-auto" />
                  <Download className="h-5 w-5 text-white absolute -bottom-1 -right-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full p-1 animate-bounce" />
                </div>
              </div>
              <p className="font-bold text-lg mb-2 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                ⚡ App Nativo ⚡
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>✨ Acesso instantâneo</p>
                <p>📱 Interface otimizada</p>
                <p>🔄 Funciona offline</p>
              </div>
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
          
          <div className="flex gap-3">
            <Button 
              onClick={handleInstall}
              className="flex-1 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              size="lg"
            >
              <Download className="h-4 w-4 mr-2" />
              {isIOSSafari ? '📋 Ver Instruções' : '⬇️ Instalar App'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClose}
              size="lg"
              className="border-2 hover:bg-muted/50 transition-all duration-200"
            >
              ⏰ Depois
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};