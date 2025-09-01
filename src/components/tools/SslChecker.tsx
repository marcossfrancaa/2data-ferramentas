import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, ShieldCheck, ShieldAlert, Globe, Calendar, Lock, Server, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface SSLInfo {
  valid: boolean;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  daysRemaining: number;
  protocol: string;
  cipher: string;
  grade: string;
}

export const SslChecker = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [sslInfo, setSslInfo] = useState<SSLInfo | null>(null);
  const [error, setError] = useState('');

  const formatDomain = (input: string) => {
    // Remove protocolo se existir
    let formatted = input.replace(/^https?:\/\//, '');
    // Remove caminho se existir
    formatted = formatted.split('/')[0];
    // Remove porta se existir
    formatted = formatted.split(':')[0];
    return formatted;
  };

  const checkSSL = async () => {
    if (!domain) {
      toast.error('Digite um domínio para verificar');
      return;
    }

    setLoading(true);
    setError('');
    setSslInfo(null);

    const formattedDomain = formatDomain(domain);

    // Simulação de verificação SSL
    // Em produção, isso seria feito através de uma API backend
    setTimeout(() => {
      // Simulação para domínios conhecidos
      const knownDomains: { [key: string]: SSLInfo } = {
        'google.com': {
          valid: true,
          issuer: 'Google Trust Services LLC',
          subject: '*.google.com',
          validFrom: '2024-01-15',
          validTo: '2024-04-08',
          daysRemaining: 45,
          protocol: 'TLS 1.3',
          cipher: 'TLS_AES_256_GCM_SHA384',
          grade: 'A+'
        },
        'facebook.com': {
          valid: true,
          issuer: 'DigiCert Inc',
          subject: '*.facebook.com',
          validFrom: '2024-01-01',
          validTo: '2024-12-31',
          daysRemaining: 280,
          protocol: 'TLS 1.3',
          cipher: 'TLS_AES_128_GCM_SHA256',
          grade: 'A'
        },
        'github.com': {
          valid: true,
          issuer: 'DigiCert Inc',
          subject: 'github.com',
          validFrom: '2024-02-08',
          validTo: '2025-03-07',
          daysRemaining: 380,
          protocol: 'TLS 1.3',
          cipher: 'TLS_CHACHA20_POLY1305_SHA256',
          grade: 'A+'
        }
      };

      if (knownDomains[formattedDomain]) {
        setSslInfo(knownDomains[formattedDomain]);
      } else {
        // Simulação genérica para outros domínios
        const randomValid = Math.random() > 0.2;
        const randomDays = Math.floor(Math.random() * 365) + 1;
        const validFrom = new Date();
        validFrom.setDate(validFrom.getDate() - (365 - randomDays));
        const validTo = new Date();
        validTo.setDate(validTo.getDate() + randomDays);

        setSslInfo({
          valid: randomValid,
          issuer: randomValid ? 'Let\'s Encrypt' : 'Unknown',
          subject: formattedDomain,
          validFrom: validFrom.toISOString().split('T')[0],
          validTo: validTo.toISOString().split('T')[0],
          daysRemaining: randomDays,
          protocol: randomValid ? 'TLS 1.2' : 'SSL 3.0',
          cipher: randomValid ? 'TLS_RSA_WITH_AES_256_GCM_SHA384' : 'Unknown',
          grade: randomValid ? (randomDays > 30 ? 'B' : 'C') : 'F'
        });
      }

      setLoading(false);
    }, 1500);
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'text-green-600';
      case 'B':
        return 'text-blue-600';
      case 'C':
        return 'text-yellow-600';
      case 'D':
      case 'E':
        return 'text-orange-600';
      case 'F':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getExpiryStatus = (days: number) => {
    if (days <= 0) return { color: 'text-red-600', message: 'Expirado!' };
    if (days <= 7) return { color: 'text-red-600', message: 'Expira em breve!' };
    if (days <= 30) return { color: 'text-orange-600', message: 'Renovação recomendada' };
    if (days <= 90) return { color: 'text-yellow-600', message: 'Atenção necessária' };
    return { color: 'text-green-600', message: 'Válido' };
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Verificador SSL/TLS</CardTitle>
          <CardDescription>
            Verifique o certificado SSL e a segurança de um domínio
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <Input
              placeholder="Digite o domínio (ex: google.com)"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && checkSSL()}
            />
            <Button onClick={checkSSL} disabled={loading}>
              {loading ? 'Verificando...' : 'Verificar SSL'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {sslInfo && (
            <div className="space-y-4">
              {/* Status Principal */}
              <div className={`p-4 rounded-lg border-2 ${
                sslInfo.valid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {sslInfo.valid ? (
                      <ShieldCheck className="h-8 w-8 text-green-600" />
                    ) : (
                      <ShieldAlert className="h-8 w-8 text-red-600" />
                    )}
                    <div>
                      <h3 className={`font-semibold text-lg ${
                        sslInfo.valid ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {sslInfo.valid ? 'Certificado Válido' : 'Certificado Inválido'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDomain(domain)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getGradeColor(sslInfo.grade)}`}>
                      {sslInfo.grade}
                    </div>
                    <p className="text-xs text-muted-foreground">Nota SSL</p>
                  </div>
                </div>
              </div>

              {/* Informações do Certificado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Server className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">Emissor</h4>
                        <p className="text-sm text-muted-foreground">{sslInfo.issuer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">Domínio</h4>
                        <p className="text-sm text-muted-foreground">{sslInfo.subject}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">Validade</h4>
                        <p className="text-sm text-muted-foreground">
                          De: {new Date(sslInfo.validFrom).toLocaleDateString('pt-BR')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Até: {new Date(sslInfo.validTo).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">Dias Restantes</h4>
                        <p className={`text-sm font-semibold ${getExpiryStatus(sslInfo.daysRemaining).color}`}>
                          {sslInfo.daysRemaining} dias
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getExpiryStatus(sslInfo.daysRemaining).message}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">Protocolo</h4>
                        <p className="text-sm text-muted-foreground">{sslInfo.protocol}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">Cifra</h4>
                        <p className="text-sm text-muted-foreground break-all">{sslInfo.cipher}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recomendações */}
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recomendações de Segurança:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    {sslInfo.daysRemaining <= 30 && (
                      <li>• Renove o certificado em breve (menos de 30 dias restantes)</li>
                    )}
                    {sslInfo.protocol === 'TLS 1.2' && (
                      <li>• Considere atualizar para TLS 1.3 para melhor segurança</li>
                    )}
                    {sslInfo.grade !== 'A+' && sslInfo.grade !== 'A' && (
                      <li>• Melhore a configuração SSL para obter uma nota melhor</li>
                    )}
                    {!sslInfo.valid && (
                      <li className="text-red-600">• Certificado inválido ou expirado - ação imediata necessária!</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}

          <div className="mt-6 p-4 bg-secondary/50 rounded-lg space-y-2">
            <h3 className="font-semibold">Sobre Certificados SSL/TLS</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• SSL/TLS criptografa dados entre o navegador e o servidor</li>
              <li>• Certificados válidos são essenciais para segurança e SEO</li>
              <li>• TLS 1.3 é a versão mais recente e segura</li>
              <li>• Certificados devem ser renovados antes de expirar</li>
              <li>• Uma nota A ou A+ indica excelente configuração de segurança</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};