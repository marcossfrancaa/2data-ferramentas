import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Monitor, Copy, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const BrowserInfo = () => {
  const [browserInfo, setBrowserInfo] = useState({
    navegador: '',
    versao: '',
    userAgent: '',
    idioma: '',
    plataforma: '',
    cookiesHabilitados: false,
    javaHabilitado: false,
    onlineStatus: true
  });
  const { toast } = useToast();

  useEffect(() => {
    const detectarNavegador = () => {
      const userAgent = navigator.userAgent;
      let navegador = 'Desconhecido';
      let versao = '';

      if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        navegador = 'Google Chrome';
        const match = userAgent.match(/Chrome\/([0-9.]+)/);
        versao = match ? match[1] : '';
      } else if (userAgent.includes('Firefox')) {
        navegador = 'Mozilla Firefox';
        const match = userAgent.match(/Firefox\/([0-9.]+)/);
        versao = match ? match[1] : '';
      } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        navegador = 'Safari';
        const match = userAgent.match(/Version\/([0-9.]+)/);
        versao = match ? match[1] : '';
      } else if (userAgent.includes('Edg')) {
        navegador = 'Microsoft Edge';
        const match = userAgent.match(/Edg\/([0-9.]+)/);
        versao = match ? match[1] : '';
      } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
        navegador = 'Opera';
        const match = userAgent.match(/(Opera|OPR)\/([0-9.]+)/);
        versao = match ? match[2] : '';
      }

      setBrowserInfo({
        navegador,
        versao,
        userAgent,
        idioma: navigator.language,
        plataforma: navigator.platform,
        cookiesHabilitados: navigator.cookieEnabled,
        javaHabilitado: false, // Java não é mais suportado na maioria dos navegadores
        onlineStatus: navigator.onLine
      });
    };

    detectarNavegador();

    const handleOnlineStatus = () => {
      setBrowserInfo(prev => ({ ...prev, onlineStatus: navigator.onLine }));
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const copiarInfo = () => {
    const info = `Navegador: ${browserInfo.navegador}
Versão: ${browserInfo.versao}
User Agent: ${browserInfo.userAgent}
Idioma: ${browserInfo.idioma}
Plataforma: ${browserInfo.plataforma}
Cookies: ${browserInfo.cookiesHabilitados ? 'Habilitados' : 'Desabilitados'}
Status Online: ${browserInfo.onlineStatus ? 'Online' : 'Offline'}`;

    navigator.clipboard.writeText(info);
    toast({
      title: "Copiado!",
      description: "Informações do navegador copiadas para a área de transferência",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Meu Navegador</h1>
        </div>
        <p className="text-muted-foreground">
          Informações detalhadas sobre o seu navegador e configurações.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-card-foreground">
              Informações do Navegador
            </h3>
            <Button variant="outline" size="sm" onClick={copiarInfo}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar Todas
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Navegador:</Label>
              <p className="text-lg font-semibold text-card-foreground">{browserInfo.navegador}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Versão:</Label>
              <p className="text-lg font-semibold text-card-foreground">{browserInfo.versao}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Idioma:</Label>
              <p className="text-lg text-card-foreground">{browserInfo.idioma}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Plataforma:</Label>
              <p className="text-lg text-card-foreground">{browserInfo.plataforma}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Cookies:</Label>
              <p className="text-lg text-card-foreground">
                {browserInfo.cookiesHabilitados ? '✅ Habilitados' : '❌ Desabilitados'}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Status:</Label>
              <p className="text-lg text-card-foreground">
                {browserInfo.onlineStatus ? '🟢 Online' : '🔴 Offline'}
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">User Agent:</Label>
            <div className="p-3 bg-accent/10 rounded-md">
              <p className="text-sm text-card-foreground font-mono break-all">
                {browserInfo.userAgent}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-3">
            <Monitor className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-semibold text-card-foreground mb-1">Sobre as Informações</h4>
              <p className="text-muted-foreground">
                Estas informações são coletadas diretamente do seu navegador e podem ser úteis 
                para depuração de problemas ou verificação de compatibilidade.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};