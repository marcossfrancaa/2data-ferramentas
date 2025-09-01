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
    const threeDaysAgo = Date.now() - (3 * 24 * 60 * 60 * 1000);
    
    // Detectar se é mobile REAL
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isRealMobile = isMobile && (isMobileDevice || isTouchDevice) && window.innerWidth <= 768;
    
    // Verificar se já está instalado
    const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const isPWAInstalled = isStandalone || (window.navigator as any).standalone;
    
    // Mostrar se nunca mostrou ou se passou mais de 3 dias e não está instalado
    const shouldShow = !isPWAInstalled && (!hasShownBefore || (lastShown && parseInt(lastShown) < threeDaysAgo));
    
    if (isRealMobile && shouldShow && !hasShown && (deferredPrompt || isIOSSafari)) {
      // Mostra após 20 segundos
      const timer = setTimeout(() => {
        setIsOpen(true);
        setHasShown(true);
        localStorage.setItem('pwa-install-popup-shown', 'true');
        localStorage.setItem('pwa-install-popup-last-shown', Date.now().toString());
      }, 20000);

      return () => clearTimeout(timer);
    }
  }, [isMobile, hasShown, deferredPrompt]);

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
      <DialogContent className="sm:max-w-md mx-4 border-0 shadow-2xl w-[calc(100vw-2rem)] max-w-[400px] bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-sm">
        <DialogHeader className="text-center">
          <DialogTitle className="flex flex-col items-center gap-4 text-xl">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-2xl blur-md animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-primary to-secondary p-3 rounded-2xl">
                <Smartphone className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold">
              📱 Instalar 2Data
            </span>
          </DialogTitle>
          <DialogDescription className="text-base text-center leading-relaxed">
            ⚡ Transforme o 2Data em um app nativo para acesso rápido e experiência otimizada!
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-4">
          <div className="relative p-6 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl border border-primary/20 overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-primary/20 to-transparent rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-secondary/20 to-transparent rounded-full blur-xl"></div>
            
            <div className="text-center relative z-10">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-secondary/40 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-primary to-secondary p-6 rounded-3xl shadow-lg">
                  <Smartphone className="h-16 w-16 text-primary-foreground mx-auto" />
                  <Download className="h-6 w-6 text-primary-foreground absolute -bottom-2 -right-2 bg-gradient-to-r from-accent to-secondary rounded-full p-1 animate-bounce shadow-lg" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                🚀 App Nativo Grátis
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                    <span className="text-green-600">⚡</span>
                  </div>
                  <p className="font-medium">Acesso Instantâneo</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto border border-blue-500/30">
                    <span className="text-blue-600">📱</span>
                  </div>
                  <p className="font-medium">Interface Otimizada</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto border border-purple-500/30">
                    <span className="text-purple-600">🔄</span>
                  </div>
                  <p className="font-medium">Funciona Offline</p>
                </div>
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full flex items-center justify-center mx-auto border border-orange-500/30">
                    <span className="text-orange-600">🎯</span>
                  </div>
                  <p className="font-medium">Sem Anúncios</p>
                </div>
              </div>
            </div>
          </div>

          {isIOSSafari && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-5 rounded-xl border border-blue-200 dark:border-blue-800/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-blue-300/30 to-transparent rounded-full blur-lg"></div>
              <div className="relative z-10">
                <p className="text-sm font-bold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                  <span className="text-lg">📱</span>
                  Para instalar no iOS Safari:
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-300">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold min-w-[24px] text-center">1</span>
                    <span>Toque no botão</span>
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">
                      ⬆️ Compartilhar
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-blue-700 dark:text-blue-300">
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-bold min-w-[24px] text-center">2</span>
                    <span>Selecione</span>
                    <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                      <Plus className="h-3 w-3" />
                      Tela Inicial
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button 
              onClick={handleInstall}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] font-bold text-lg py-6"
              size="lg"
            >
              <Download className="h-5 w-5 mr-3" />
              {isIOSSafari ? '📋 Veja Como Instalar' : '⬇️ Instalar Agora'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClose}
              size="lg"
              className="border-2 hover:bg-muted/50 transition-all duration-200 py-6 px-4 font-medium"
            >
              ⏰ Depois
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            ✨ Grátis • Sem cadastro • Funciona offline
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};