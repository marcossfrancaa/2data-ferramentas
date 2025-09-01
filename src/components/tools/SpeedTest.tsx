import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wifi, Zap, Download, Upload, Clock, Info } from 'lucide-react';

export const SpeedTest = () => {
  const [showIframe, setShowIframe] = useState(false);

  const startSpeedTest = () => {
    setShowIframe(true);
  };

  const resetTest = () => {
    setShowIframe(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Wifi className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Teste de Velocidade da Internet</h1>
        </div>
        <p className="text-muted-foreground">
          Teste a velocidade de download, upload e latência da sua conexão com a internet em tempo real.
        </p>
      </div>

      {!showIframe ? (
        <>
          <Card className="p-6 mb-6 text-center">
            <div className="space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
                <Zap className="w-10 h-10 text-primary" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-card-foreground mb-2">
                  Pronto para testar sua velocidade?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Clique no botão abaixo para iniciar o teste completo de velocidade da sua internet.
                </p>
                
                <Button
                  onClick={startSpeedTest}
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 transition-fast"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Iniciar Teste de Velocidade
                </Button>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 text-center">
              <Download className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-card-foreground mb-2">Download</h3>
              <p className="text-sm text-muted-foreground">
                Velocidade de recebimento de dados da internet
              </p>
            </Card>

            <Card className="p-4 text-center">
              <Upload className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <h3 className="font-semibold text-card-foreground mb-2">Upload</h3>
              <p className="text-sm text-muted-foreground">
                Velocidade de envio de dados para a internet
              </p>
            </Card>

            <Card className="p-4 text-center">
              <Clock className="w-8 h-8 text-orange-500 mx-auto mb-3" />
              <h3 className="font-semibold text-card-foreground mb-2">Ping</h3>
              <p className="text-sm text-muted-foreground">
                Tempo de resposta entre seu dispositivo e o servidor
              </p>
            </Card>
          </div>
        </>
      ) : (
        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Teste de Velocidade em Execução
              </h3>
              <Button
                onClick={resetTest}
                variant="outline"
                size="sm"
              >
                Novo Teste
              </Button>
            </div>
            
            <div className="w-full h-[600px] border rounded-lg overflow-hidden">
              <iframe
                src="https://openspeedtest.com/speedtest"
                width="100%"
                height="100%"
                frameBorder="0"
                allow="geolocation"
                title="OpenSpeedTest - Teste de Velocidade"
                className="w-full h-full"
              />
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-500" />
            Como interpretar os resultados
          </h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium text-card-foreground">Download (Mbps)</h4>
              <p className="text-muted-foreground">
                • Excelente: &gt; 100 Mbps<br/>
                • Boa: 25-100 Mbps<br/>
                • Regular: 5-25 Mbps<br/>
                • Lenta: &lt; 5 Mbps
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-card-foreground">Upload (Mbps)</h4>
              <p className="text-muted-foreground">
                • Excelente: &gt; 10 Mbps<br/>
                • Boa: 3-10 Mbps<br/>
                • Regular: 1-3 Mbps<br/>
                • Lenta: &lt; 1 Mbps
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Latência (Ping)
          </h3>
          
          <div className="space-y-3 text-sm">
            <div>
              <h4 className="font-medium text-card-foreground">Tempo de resposta</h4>
              <p className="text-muted-foreground">
                • Excelente: &lt; 20ms<br/>
                • Boa: 20-50ms<br/>
                • Regular: 50-100ms<br/>
                • Alta: &gt; 100ms
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-card-foreground">Ideal para:</h4>
              <p className="text-muted-foreground">
                • Gaming: &lt; 30ms<br/>
                • Videoconferência: &lt; 50ms<br/>
                • Streaming: &lt; 100ms<br/>
                • Navegação geral: &lt; 200ms
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Wifi className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">🚀 Sobre o OpenSpeedTest</h4>
            <p className="text-muted-foreground">
              Esta ferramenta utiliza o <strong>OpenSpeedTest</strong>, uma plataforma open-source 
              para teste de velocidade de internet. O teste é executado diretamente no seu navegador 
              sem necessidade de plugins ou downloads. Os resultados mostram a velocidade real 
              da sua conexão no momento do teste.
              <br/><br/>
              <strong>Dica:</strong> Para resultados mais precisos, feche outros programas que 
              possam estar usando a internet durante o teste.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};