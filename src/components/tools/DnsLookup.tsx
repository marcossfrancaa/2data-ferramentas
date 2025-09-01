
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, Shield, CheckCircle, XCircle, Copy, RefreshCw, Clock, Server } from 'lucide-react';
import { toast } from 'sonner';

interface DnsRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

interface DnsResponse {
  Status: number;
  TC: boolean;
  RD: boolean;
  RA: boolean;
  AD: boolean;
  CD: boolean;
  Question: Array<{
    name: string;
    type: number;
  }>;
  Answer?: DnsRecord[];
}

interface DnsResult {
  domain: string;
  exists: boolean;
  records: DnsRecord[];
  status: number;
  responseTime: number;
}

export const DnsLookup = () => {
  const [domain, setDomain] = useState('');
  const [dnsResult, setDnsResult] = useState<DnsResult | null>(null);
  const [loading, setLoading] = useState(false);

  const cleanDomain = (input: string) => {
    // Remove protocolo e www se existir
    return input.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  };

  const checkDomain = async () => {
    if (!domain.trim()) {
      toast.error('Digite um domínio válido');
      return;
    }

    setLoading(true);
    const startTime = Date.now();
    
    try {
      const cleanedDomain = cleanDomain(domain.trim());
      
      // Usar Google DNS over HTTPS
      const url = `https://dns.google/resolve?name=${cleanedDomain}&type=A`;
      const response = await fetch(url);
      const data: DnsResponse = await response.json();
      
      const responseTime = Date.now() - startTime;
      
      const result: DnsResult = {
        domain: cleanedDomain,
        exists: !!(data.Answer && data.Answer.length > 0),
        records: data.Answer || [],
        status: data.Status,
        responseTime
      };
      
      setDnsResult(result);
      
      if (result.exists) {
        toast.success(`✅ O domínio ${cleanedDomain} está registrado!`);
      } else {
        toast.info(`❌ O domínio ${cleanedDomain} pode estar disponível.`);
      }
    } catch (error: any) {
      toast.error(`Erro ao consultar DNS: ${error.message}`);
      setDnsResult(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência`);
  };

  const getRecordTypeText = (type: number) => {
    const types: { [key: number]: string } = {
      1: 'A (IPv4)',
      2: 'NS (Name Server)',
      5: 'CNAME (Canonical Name)',
      15: 'MX (Mail Exchange)',
      16: 'TXT (Text)',
      28: 'AAAA (IPv6)',
    };
    return types[type] || `Type ${type}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Consulta DNS - Verificador de Domínio</CardTitle>
          <CardDescription>
            Verifique se um domínio está registrado usando resolução DNS gratuita
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Ex: google.com, facebook.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && checkDomain()}
              />
            </div>
            <Button 
              onClick={checkDomain}
              disabled={loading}
              className="min-w-[120px]"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Consultando...' : 'Verificar'}
            </Button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Consultando DNS...</p>
              </div>
            </div>
          )}

          {dnsResult && !loading && (
            <>
              {/* Status do Domínio */}
              <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                {dnsResult.exists ? (
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                )}
                <h2 className="text-3xl font-bold mb-2">{dnsResult.domain}</h2>
                <p className="text-lg mb-4">
                  {dnsResult.exists ? (
                    <span className="text-green-600 font-semibold">✅ Domínio REGISTRADO</span>
                  ) : (
                    <span className="text-red-600 font-semibold">❌ Domínio pode estar DISPONÍVEL</span>
                  )}
                </p>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {dnsResult.responseTime}ms
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    Status: {dnsResult.status}
                  </div>
                </div>
                <Button
                  onClick={() => copyToClipboard(dnsResult.domain, 'Domínio')}
                  variant="outline"
                  className="mt-4"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Domínio
                </Button>
              </div>

              {/* Registros DNS */}
              {dnsResult.records.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Registros DNS Encontrados
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {dnsResult.records.map((record, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Globe className="h-4 w-4 text-primary" />
                                <span className="font-medium">{getRecordTypeText(record.type)}</span>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  TTL: {record.TTL}s
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground break-all">
                                <strong>Nome:</strong> {record.name}
                              </p>
                              <p className="text-sm text-muted-foreground break-all">
                                <strong>Dados:</strong> {record.data}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(record.data, 'Registro DNS')}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Informações sobre a ferramenta */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              🌐 Como Funciona
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• <strong>100% Gratuito:</strong> Usa Google DNS over HTTPS (dns.google)</li>
              <li>• <strong>Ilimitado:</strong> Sem restrições de consultas</li>
              <li>• <strong>Confiável:</strong> Infraestrutura do Google Public DNS</li>
              <li>• <strong>Verificação:</strong> Se tem registros A, o domínio está registrado</li>
              <li>• <strong>Disponibilidade:</strong> Se não tem registros, pode estar disponível</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
