import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Monitor, Copy, Laptop } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SystemInfo = () => {
  const [systemInfo, setSystemInfo] = useState({
    sistemaOperacional: '',
    resolucaoTela: '',
    resolucaoDisponivel: '',
    profundidadeCor: '',
    navegador: '',
    timezone: '',
    memoria: '',
    nucleos: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const detectarSistema = () => {
      const userAgent = navigator.userAgent;
      let sistemaOperacional = 'Desconhecido';

      if (userAgent.includes('Windows NT 10.0')) {
        sistemaOperacional = 'Windows 10/11';
      } else if (userAgent.includes('Windows NT 6.3')) {
        sistemaOperacional = 'Windows 8.1';
      } else if (userAgent.includes('Windows NT 6.2')) {
        sistemaOperacional = 'Windows 8';
      } else if (userAgent.includes('Windows NT 6.1')) {
        sistemaOperacional = 'Windows 7';
      } else if (userAgent.includes('Windows NT')) {
        sistemaOperacional = 'Windows NT';
      } else if (userAgent.includes('Mac OS X')) {
        const match = userAgent.match(/Mac OS X ([0-9_]+)/);
        if (match) {
          const version = match[1].replace(/_/g, '.');
          sistemaOperacional = `macOS ${version}`;
        } else {
          sistemaOperacional = 'macOS';
        }
      } else if (userAgent.includes('Linux')) {
        sistemaOperacional = 'Linux';
      } else if (userAgent.includes('Android')) {
        sistemaOperacional = 'Android';
      } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
        sistemaOperacional = 'iOS';
      }

      const resolucaoTela = `${screen.width}x${screen.height}`;
      const resolucaoDisponivel = `${screen.availWidth}x${screen.availHeight}`;
      const profundidadeCor = screen.colorDepth ? `${screen.colorDepth} bits` : 'Não disponível';
      
      // Informações adicionais do navegador
      const memoria = (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Não disponível';
      const nucleos = (navigator as any).hardwareConcurrency ? `${(navigator as any).hardwareConcurrency} núcleos` : 'Não disponível';

      setSystemInfo({
        sistemaOperacional,
        resolucaoTela,
        resolucaoDisponivel,
        profundidadeCor,
        navegador: navigator.userAgent,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        memoria,
        nucleos
      });
    };

    detectarSistema();
  }, []);

  const copiarInfo = () => {
    const info = `Sistema Operacional: ${systemInfo.sistemaOperacional}
Resolução de tela: ${systemInfo.resolucaoTela}
Resolução disponível: ${systemInfo.resolucaoDisponivel}
Profundidade de cor: ${systemInfo.profundidadeCor}
Fuso horário: ${systemInfo.timezone}
Memória: ${systemInfo.memoria}
Núcleos CPU: ${systemInfo.nucleos}
User Agent: ${systemInfo.navegador}`;

    navigator.clipboard.writeText(info);
    toast({
      title: "Copiado!",
      description: "Informações do sistema copiadas para a área de transferência",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Laptop className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Meu Sistema Operacional</h1>
        </div>
        <p className="text-muted-foreground">
          Informações detalhadas sobre o seu sistema operacional e hardware.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-card-foreground">
              Informações do Sistema
            </h3>
            <Button variant="outline" size="sm" onClick={copiarInfo}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar Todas
            </Button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-accent/10 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Sistema Operacional:</Label>
                  <p className="text-lg font-semibold text-card-foreground">{systemInfo.sistemaOperacional}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Resolução de tela:</Label>
                  <p className="text-lg font-semibold text-card-foreground">{systemInfo.resolucaoTela}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Resolução disponível:</Label>
                <p className="text-lg text-card-foreground">{systemInfo.resolucaoDisponivel}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Profundidade de cor:</Label>
                <p className="text-lg text-card-foreground">{systemInfo.profundidadeCor}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Fuso horário:</Label>
                <p className="text-lg text-card-foreground">{systemInfo.timezone}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Memória RAM:</Label>
                <p className="text-lg text-card-foreground">{systemInfo.memoria}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Núcleos CPU:</Label>
                <p className="text-lg text-card-foreground">{systemInfo.nucleos}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">User Agent:</Label>
              <div className="p-3 bg-accent/10 rounded-md">
                <p className="text-sm text-card-foreground font-mono break-all">
                  {systemInfo.navegador}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-3">
            <Monitor className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-semibold text-card-foreground mb-1">Sobre as Informações</h4>
              <p className="text-muted-foreground">
                Estas informações são coletadas através da API do navegador e podem ser limitadas 
                por questões de privacidade. Algumas informações podem não estar disponíveis em todos os navegadores.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};