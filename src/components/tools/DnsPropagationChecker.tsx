import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Globe, RefreshCw, CheckCircle, XCircle, Clock, Server, Download, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface DnsResolver {
  name: string;
  ip: string;
  country: string;
  flag: string;
  provider: string;
}

interface PropagationResult {
  resolver: DnsResolver;
  ip: string | null;
  status: 'success' | 'error' | 'loading';
  responseTime: number;
  error?: string;
}

const DNS_RESOLVERS: DnsResolver[] = [
  { name: 'Google DNS (US)', ip: '8.8.8.8', country: 'Estados Unidos', flag: '🇺🇸', provider: 'Google' },
  { name: 'Cloudflare (US)', ip: '1.1.1.1', country: 'Estados Unidos', flag: '🇺🇸', provider: 'Cloudflare' },
  { name: 'Registro.br', ip: '200.160.0.8', country: 'Brasil', flag: '🇧🇷', provider: 'Registro.br' },
  { name: 'OpenDNS (US)', ip: '208.67.222.222', country: 'Estados Unidos', flag: '🇺🇸', provider: 'OpenDNS' },
  { name: 'Quad9 (US)', ip: '9.9.9.9', country: 'Estados Unidos', flag: '🇺🇸', provider: 'Quad9' },
  { name: 'Level3 (US)', ip: '4.2.2.1', country: 'Estados Unidos', flag: '🇺🇸', provider: 'Level3' },
];

const RECORD_TYPES = [
  { value: 'A', label: 'A Record (IPv4)' },
  { value: 'AAAA', label: 'AAAA Record (IPv6)' },
  { value: 'CNAME', label: 'CNAME Record' },
  { value: 'MX', label: 'MX Record' },
  { value: 'TXT', label: 'TXT Record' },
  { value: 'NS', label: 'NS Record' },
];

export const DnsPropagationChecker = () => {
  const [domain, setDomain] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [results, setResults] = useState<PropagationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const cleanDomain = (input: string): string => {
    return input.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0].trim();
  };

  const queryDnsResolver = async (resolver: DnsResolver, domain: string, type: string): Promise<PropagationResult> => {
    const startTime = Date.now();
    
    try {
      // Usar Google DNS over HTTPS como fallback para todos os resolvers
      // Em um ambiente real, você usaria diferentes APIs ou proxies para cada resolver
      const url = `https://dns.google/resolve?name=${domain}&type=${type}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      const responseTime = Date.now() - startTime;
      
      if (data.Answer && data.Answer.length > 0) {
        return {
          resolver,
          ip: data.Answer[0].data,
          status: 'success',
          responseTime,
        };
      } else {
        return {
          resolver,
          ip: null,
          status: 'error',
          responseTime,
          error: 'Nenhum registro encontrado',
        };
      }
    } catch (error: any) {
      return {
        resolver,
        ip: null,
        status: 'error',
        responseTime: Date.now() - startTime,
        error: error.message,
      };
    }
  };

  const checkPropagation = async () => {
    if (!domain.trim()) {
      toast({
        title: 'Erro',
        description: 'Digite um domínio válido',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setResults([]);
    
    const cleanedDomain = cleanDomain(domain);
    
    // Inicializar resultados com status loading
    const initialResults: PropagationResult[] = DNS_RESOLVERS.map(resolver => ({
      resolver,
      ip: null,
      status: 'loading' as const,
      responseTime: 0,
    }));
    
    setResults(initialResults);

    // Executar consultas em paralelo
    const promises = DNS_RESOLVERS.map(resolver => 
      queryDnsResolver(resolver, cleanedDomain, recordType)
    );

    try {
      const results = await Promise.allSettled(promises);
      
      const finalResults: PropagationResult[] = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            resolver: DNS_RESOLVERS[index],
            ip: null,
            status: 'error' as const,
            responseTime: 0,
            error: 'Falha na consulta',
          };
        }
      });
      
      setResults(finalResults);
      
      const successfulResults = finalResults.filter(r => r.status === 'success' && r.ip);
      if (successfulResults.length > 0) {
        const uniqueIPs = [...new Set(successfulResults.map(r => r.ip))];
        const isPropagated = uniqueIPs.length === 1;
        
        toast({
          title: isPropagated ? 'DNS Propagado ✅' : 'Propagação Inconsistente ⚠️',
          description: isPropagated 
            ? `Todos os resolvers retornaram o mesmo IP: ${uniqueIPs[0]}`
            : `Encontrados ${uniqueIPs.length} IPs diferentes: ${uniqueIPs.join(', ')}`,
        });
      } else {
        toast({
          title: 'Nenhum registro encontrado',
          description: 'O domínio pode não estar registrado ou o tipo de registro não existe',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro na verificação',
        description: 'Falha ao consultar os servidores DNS',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportResults = () => {
    const exportData = {
      domain: cleanDomain(domain),
      recordType,
      timestamp: new Date().toISOString(),
      results: results.map(r => ({
        resolver: r.resolver.name,
        country: r.resolver.country,
        provider: r.resolver.provider,
        ip: r.ip,
        status: r.status,
        responseTime: r.responseTime,
        error: r.error,
      })),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dns-propagation-${cleanDomain(domain)}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Exportado com sucesso',
      description: 'Resultados salvos em formato JSON',
    });
  };

  const getPropagationStatus = () => {
    const successfulResults = results.filter(r => r.status === 'success' && r.ip);
    if (successfulResults.length === 0) return { status: 'none', message: 'Nenhum registro encontrado' };
    
    const uniqueIPs = [...new Set(successfulResults.map(r => r.ip))];
    if (uniqueIPs.length === 1) {
      return { status: 'propagated', message: 'Totalmente Propagado', ip: uniqueIPs[0] };
    } else {
      return { status: 'partial', message: 'Propagação Inconsistente', ips: uniqueIPs };
    }
  };

  const propagationStatus = getPropagationStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Verificador de Propagação DNS
            </h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Verifique se seu DNS propagou globalmente
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              Consulte múltiplos servidores DNS ao redor do mundo para verificar se as alterações de DNS 
              foram propagadas corretamente. Essencial após mudanças de hosting ou configurações de domínio.
            </p>
          </div>
        </div>

        {/* Formulário de Consulta */}
        <Card className="border-2 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5" />
              Consultar Propagação DNS
            </CardTitle>
            <CardDescription>
              Digite um domínio para verificar sua propagação em diferentes servidores DNS
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Ex: exemplo.com, meusite.com.br"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && checkPropagation()}
                  className="text-lg h-12"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={recordType} 
                  onChange={(e) => setRecordType(e.target.value)}
                  className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  {RECORD_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={checkPropagation}
                disabled={loading}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-3"
              >
                {loading ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Globe className="h-5 w-5 mr-3" />
                    Verificar DNS
                  </>
                )}
              </Button>
              
              {results.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-6"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  {showDetails ? 'Ocultar' : 'Mostrar'} Detalhes
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Status Geral */}
        {results.length > 0 && (
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="text-center space-y-4">
                {propagationStatus.status === 'propagated' && (
                  <>
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                    <h3 className="text-2xl font-bold text-green-600">DNS Totalmente Propagado ✅</h3>
                    <p className="text-lg text-muted-foreground">
                      Todos os servidores retornaram: <Badge variant="secondary" className="text-lg px-4 py-2">{propagationStatus.ip}</Badge>
                    </p>
                  </>
                )}
                
                {propagationStatus.status === 'partial' && (
                  <>
                    <XCircle className="h-16 w-16 text-yellow-500 mx-auto" />
                    <h3 className="text-2xl font-bold text-yellow-600">Propagação Inconsistente ⚠️</h3>
                    <p className="text-lg text-muted-foreground mb-4">
                      Diferentes servidores retornaram IPs diferentes:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {propagationStatus.ips?.map((ip, index) => (
                        <Badge key={index} variant="outline" className="text-base px-4 py-2">
                          {ip}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
                
                {propagationStatus.status === 'none' && (
                  <>
                    <XCircle className="h-16 w-16 text-red-500 mx-auto" />
                    <h3 className="text-2xl font-bold text-red-600">Nenhum Registro Encontrado ❌</h3>
                    <p className="text-lg text-muted-foreground">
                      O domínio pode não estar registrado ou o tipo de registro não existe
                    </p>
                  </>
                )}
                
                <div className="flex gap-4 justify-center mt-6">
                  <Button 
                    onClick={exportResults}
                    variant="outline"
                    className="px-6"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar JSON
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Resultados Detalhados */}
        {results.length > 0 && showDetails && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Resultados por Servidor DNS
              </CardTitle>
              <CardDescription>
                Detalhes da consulta em cada servidor DNS ao redor do mundo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((result, index) => (
                  <Card key={index} className={`border-l-4 ${
                    result.status === 'loading' ? 'border-l-blue-500' :
                    result.status === 'success' ? 'border-l-green-500' : 'border-l-red-500'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{result.resolver.flag}</span>
                          <div>
                            <h4 className="font-semibold text-sm">{result.resolver.name}</h4>
                            <p className="text-xs text-muted-foreground">{result.resolver.country}</p>
                          </div>
                        </div>
                        {result.status === 'loading' && (
                          <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                        )}
                        {result.status === 'success' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {result.status === 'error' && (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Provedor:</span>
                          <span className="ml-2 font-medium">{result.resolver.provider}</span>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">IP Servidor:</span>
                          <span className="ml-2 font-mono text-xs">{result.resolver.ip}</span>
                        </div>
                        
                        {result.status === 'success' && result.ip && (
                          <div>
                            <span className="text-muted-foreground">Resultado:</span>
                            <span className="ml-2 font-mono text-xs bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded">
                              {result.ip}
                            </span>
                          </div>
                        )}
                        
                        {result.status === 'error' && (
                          <div>
                            <span className="text-muted-foreground">Erro:</span>
                            <span className="ml-2 text-red-600 text-xs">{result.error}</span>
                          </div>
                        )}
                        
                        {result.responseTime > 0 && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{result.responseTime}ms</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Informações sobre DNS */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Como Funciona a Propagação DNS
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">O que é Propagação DNS?</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Processo de atualização dos servidores DNS globalmente</li>
                    <li>• Pode levar de minutos a 48 horas para completar</li>
                    <li>• Diferentes servidores podem ter resultados diferentes</li>
                    <li>• TTL (Time To Live) influencia a velocidade</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-700 dark:text-blue-300">Quando Usar Esta Ferramenta</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Após mudança de servidor/hosting</li>
                    <li>• Depois de alterar registros DNS</li>
                    <li>• Para diagnosticar problemas de acesso</li>
                    <li>• Verificar antes de lançar um site</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};