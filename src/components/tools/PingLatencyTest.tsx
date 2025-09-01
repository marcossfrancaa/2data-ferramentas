import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Wifi, Zap, Activity, Clock, Server, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PingResult {
  host: string;
  timestamp: number;
  responseTime: number;
  status: 'success' | 'failed' | 'timeout';
}

interface LatencyStats {
  min: number;
  max: number;
  avg: number;
  jitter: number;
  packetLoss: number;
}

export const PingLatencyTest = () => {
  const [host, setHost] = useState('google.com');
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<PingResult[]>([]);
  const [currentTest, setCurrentTest] = useState(0);
  const [totalTests] = useState(10);
  const [stats, setStats] = useState<LatencyStats | null>(null);
  const { toast } = useToast();

  const cleanHost = (input: string) => {
    return input.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  };

  const testLatency = async (targetHost: string): Promise<PingResult> => {
    const startTime = performance.now();
    
    try {
      // Simular teste de latência usando fetch com timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      // Tentar fazer uma requisição HEAD ou usar uma API de ping
      const response = await fetch(`https://${targetHost}`, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      const responseTime = performance.now() - startTime;
      
      return {
        host: targetHost,
        timestamp: Date.now(),
        responseTime: Math.round(responseTime),
        status: 'success'
      };
    } catch (error: any) {
      const responseTime = performance.now() - startTime;
      
      if (error.name === 'AbortError') {
        return {
          host: targetHost,
          timestamp: Date.now(),
          responseTime: 5000,
          status: 'timeout'
        };
      }
      
      // Para requests CORS blocked, ainda podemos medir o tempo
      return {
        host: targetHost,
        timestamp: Date.now(),
        responseTime: Math.round(responseTime),
        status: responseTime < 5000 ? 'success' : 'failed'
      };
    }
  };

  const runPingTest = async () => {
    if (!host.trim()) {
      toast({
        title: "Erro",
        description: "Digite um host válido para testar",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setResults([]);
    setStats(null);
    setCurrentTest(0);
    
    try {
      const targetHost = cleanHost(host.trim());
      const testResults: PingResult[] = [];
      
      toast({
        title: "Teste Iniciado",
        description: `Testando latência para ${targetHost}...`,
      });

      for (let i = 0; i < totalTests; i++) {
        setCurrentTest(i + 1);
        
        const result = await testLatency(targetHost);
        testResults.push(result);
        setResults([...testResults]);
        
        // Aguardar 1 segundo entre testes
        if (i < totalTests - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // Calcular estatísticas
      const successfulTests = testResults.filter(r => r.status === 'success');
      const timeouts = testResults.filter(r => r.status === 'timeout').length;
      const failed = testResults.filter(r => r.status === 'failed').length;
      
      if (successfulTests.length > 0) {
        const times = successfulTests.map(r => r.responseTime);
        const min = Math.min(...times);
        const max = Math.max(...times);
        const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
        
        // Calcular jitter (variação da latência)
        const avgTime = avg;
        const jitter = Math.round(
          Math.sqrt(times.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / times.length)
        );
        
        const packetLoss = Math.round(((timeouts + failed) / totalTests) * 100);
        
        setStats({ min, max, avg, jitter, packetLoss });
        
        toast({
          title: "Teste Concluído!",
          description: `Latência média: ${avg}ms | Perda de pacotes: ${packetLoss}%`,
        });
      } else {
        toast({
          title: "Teste Falhou",
          description: "Não foi possível estabelecer conexão com o host",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro no Teste",
        description: "Falha ao executar teste de latência",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getLatencyColor = (ms: number) => {
    if (ms < 50) return 'text-green-600';
    if (ms < 100) return 'text-yellow-600';
    if (ms < 200) return 'text-orange-600';
    return 'text-red-600';
  };

  const getLatencyLabel = (ms: number) => {
    if (ms < 20) return 'Excelente';
    if (ms < 50) return 'Muito Boa';
    if (ms < 100) return 'Boa';
    if (ms < 200) return 'Regular';
    return 'Alta';
  };

  const progress = isRunning ? (currentTest / totalTests) * 100 : 0;

  const popularHosts = [
    { name: 'Google', host: 'google.com' },
    { name: 'Cloudflare', host: '1.1.1.1' },
    { name: 'GitHub', host: 'github.com' },
    { name: 'Amazon', host: 'amazon.com' },
    { name: 'Microsoft', host: 'microsoft.com' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Wifi className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Teste de Ping e Latência</h1>
        </div>
        <p className="text-muted-foreground">
          Mede o tempo de resposta e estabilidade da conexão com servidores remotos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-500" />
            Configuração do Teste
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="host">Host ou IP para Testar</Label>
              <Input
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="google.com ou 8.8.8.8"
                disabled={isRunning}
                className="font-mono"
              />
            </div>

            <div>
              <Label>Hosts Populares</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {popularHosts.map((item) => (
                  <Button
                    key={item.host}
                    variant="outline"
                    size="sm"
                    onClick={() => setHost(item.host)}
                    disabled={isRunning}
                    className="text-xs"
                  >
                    {item.name}
                  </Button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progresso do Teste</span>
                <span className="text-sm text-muted-foreground">
                  {currentTest}/{totalTests} pings
                </span>
              </div>
              <Progress value={progress} className="mb-4" />
              
              <Button
                onClick={runPingTest}
                disabled={isRunning || !host.trim()}
                className="w-full"
              >
                <Zap className={`w-4 h-4 mr-2 ${isRunning ? 'animate-pulse' : ''}`} />
                {isRunning ? 'Testando...' : 'Iniciar Teste de Ping'}
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-500" />
            Estatísticas de Latência
          </h3>
          
          {stats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg border">
                  <div className="text-2xl font-bold text-green-600">{stats.min}ms</div>
                  <div className="text-sm text-muted-foreground">Mínima</div>
                </div>
                <div className="text-center p-3 bg-red-50 rounded-lg border">
                  <div className="text-2xl font-bold text-red-600">{stats.max}ms</div>
                  <div className="text-sm text-muted-foreground">Máxima</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg border">
                  <div className={`text-2xl font-bold ${getLatencyColor(stats.avg)}`}>
                    {stats.avg}ms
                  </div>
                  <div className="text-sm text-muted-foreground">Média</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg border">
                  <div className="text-2xl font-bold text-purple-600">{stats.jitter}ms</div>
                  <div className="text-sm text-muted-foreground">Jitter</div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-accent/10 rounded-lg border">
                <div className="text-xl font-semibold mb-2">
                  Qualidade da Conexão: {getLatencyLabel(stats.avg)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Perda de Pacotes: {stats.packetLoss}%
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Globe className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Execute um teste para ver as estatísticas</p>
            </div>
          )}
        </Card>
      </div>

      {results.length > 0 && (
        <Card className="mt-6 p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            Resultados dos Pings
          </h3>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-accent/5 rounded border text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-muted-foreground">
                    #{index + 1}
                  </span>
                  <span className="font-medium">
                    ping {result.host}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`font-mono font-semibold ${
                    result.status === 'success' 
                      ? getLatencyColor(result.responseTime)
                      : result.status === 'timeout' 
                        ? 'text-red-600' 
                        : 'text-gray-500'
                  }`}>
                    {result.status === 'success' 
                      ? `${result.responseTime}ms`
                      : result.status === 'timeout'
                        ? 'Timeout'
                        : 'Falhou'
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Wifi className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-blue-800 mb-2">📊 Interpretação dos Resultados</h4>
            <div className="text-blue-700 space-y-1">
              <p>• <strong>Latência:</strong> Tempo para dados viajarem até o servidor e voltar</p>
              <p>• <strong>Jitter:</strong> Variação da latência (menor é melhor para jogos/calls)</p>
              <p>• <strong>&lt; 50ms:</strong> Excelente para qualquer uso</p>
              <p>• <strong>50-100ms:</strong> Boa para navegação e streaming</p>
              <p>• <strong>&gt; 200ms:</strong> Pode causar lentidão perceptível</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};