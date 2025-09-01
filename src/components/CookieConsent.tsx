import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Settings, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já interagiu com o popup
    const hasConsented = localStorage.getItem('cookie-consent');
    
    if (!hasConsented) {
      // Mostrar popup após 2 segundos
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie-consent', 'accepted-all');
    localStorage.setItem('cookie-analytics', 'true');
    localStorage.setItem('cookie-marketing', 'true');
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('cookie-consent', 'rejected-all');
    localStorage.setItem('cookie-analytics', 'false');
    localStorage.setItem('cookie-marketing', 'false');
    setIsVisible(false);
  };

  const handleEssentialOnly = () => {
    localStorage.setItem('cookie-consent', 'essential-only');
    localStorage.setItem('cookie-analytics', 'false');
    localStorage.setItem('cookie-marketing', 'false');
    setIsVisible(false);
  };

  const handleClose = () => {
    // Considerar como "aceitar essenciais" quando fechar
    handleEssentialOnly();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]" />
      
      {/* Cookie Popup */}
      <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[9999] animate-in slide-in-from-bottom-4 duration-500">
        <Card className="relative bg-gradient-to-br from-purple-900 via-slate-800 to-slate-900 border-purple-500/20 text-white shadow-2xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute right-3 top-3 text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="p-6 pt-12">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-purple-300" />
              <h3 className="font-bold text-lg">A sua privacidade é muito importante</h3>
            </div>
            
            <p className="text-sm text-white/90 leading-relaxed mb-1">
              Utilizamos cookies para garantir a melhor experiência e coletar dados sobre como os visitantes interagem com 
              nosso site. Ao clicar em <strong>"Aceitar todos"</strong>, você concorda com o uso de todos os cookies para anúncios, 
              personalizações e análises, conforme descrito em nossa{' '}
              <Link 
                to="/politica-de-cookies" 
                className="text-purple-300 hover:text-purple-200 underline"
                onClick={() => setIsVisible(false)}
              >
                Política de Cookies
              </Link>
              .
            </p>
            
            <div className="flex flex-col gap-3 mt-6">
              <Button
                onClick={handleAcceptAll}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium"
              >
                Aceitar todos
              </Button>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleRejectAll}
                  variant="secondary"
                  className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white font-medium"
                >
                  Rejeitar todos
                </Button>
                
                <Button
                  onClick={handleEssentialOnly}
                  variant="secondary"
                  className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white font-medium flex items-center gap-1"
                >
                  <Settings className="h-3 w-3" />
                  Apenas essenciais
                </Button>
              </div>
            </div>
            
            <p className="text-xs text-white/60 mt-4 text-center">
              Você pode alterar suas preferências a qualquer momento visitando nossa página de configurações de cookies.
            </p>
          </div>
        </Card>
      </div>
    </>
  );
};