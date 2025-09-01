import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, MapPin, Shield, Wifi, Copy, RefreshCw, Monitor } from 'lucide-react';
import { toast } from 'sonner';

interface IpData {
  ip: string;
  country: string;
  city: string;
  region: string;
  timezone: string;
  isp: string;
  org: string;
  latitude?: number;
  longitude?: number;
  userAgent: string;
  language: string;
  platform: string;
  cookiesEnabled: boolean;
  javaEnabled: boolean;
  screenResolution: string;
  colorDepth: number;
  localTime: string;
}

export const IpInfo = () => {
  const [ipData, setIpData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(true);

  const getSystemInfo = () => {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookiesEnabled: navigator.cookieEnabled,
      javaEnabled: typeof (window as any).java !== 'undefined',
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      localTime: new Date().toLocaleString('pt-BR')
    };
  };

  const fetchIpInfo = async () => {
    setLoading(true);
    try {
      // Usar múltiplas APIs para obter informações completas
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      const systemInfo = getSystemInfo();
      
      setIpData({
        ip: data.ip || 'Não disponível',
        country: data.country_name || 'Não disponível',
        city: data.city || 'Não disponível',
        region: data.region || 'Não disponível',
        timezone: data.timezone || 'Não disponível',
        isp: data.org || 'Não disponível',
        org: data.org || 'Não disponível',
        latitude: data.latitude,
        longitude: data.longitude,
        ...systemInfo
      });
    } catch (error) {
      // Fallback com informações básicas
      const systemInfo = getSystemInfo();
      setIpData({
        ip: 'Erro ao obter IP',
        country: 'Não disponível',
        city: 'Não disponível',
        region: 'Não disponível',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isp: 'Não disponível',
        org: 'Não disponível',
        ...systemInfo
      });
      toast.error('Erro ao obter informações do IP. Mostrando dados básicos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIpInfo();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência`);
  };

  const InfoCard = ({ icon: Icon, title, value, copyable = false }: { 
    icon: any, 
    title: string, 
    value: string, 
    copyable?: boolean 
  }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 text-primary mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium mb-1">{title}</h4>
              {copyable && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(value, title)}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground break-all">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Informações do seu IP</CardTitle>
              <CardDescription>
                Veja informações detalhadas sobre seu endereço IP e sistema
              </CardDescription>
            </div>
            <Button
              onClick={fetchIpInfo}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Obtendo informações...</p>
              </div>
            </div>
          ) : ipData ? (
            <>
              {/* IP Principal */}
              <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">{ipData.ip}</h2>
                <p className="text-muted-foreground mb-4">Seu endereço IP público</p>
                <Button
                  onClick={() => copyToClipboard(ipData.ip, 'IP')}
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar IP
                </Button>
              </div>

              {/* Informações de Localização */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localização
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard icon={Globe} title="País" value={ipData.country} />
                  <InfoCard icon={MapPin} title="Cidade" value={ipData.city} />
                  <InfoCard icon={MapPin} title="Região/Estado" value={ipData.region} />
                  <InfoCard icon={Globe} title="Fuso Horário" value={ipData.timezone} />
                  {ipData.latitude && ipData.longitude && (
                    <InfoCard 
                      icon={MapPin} 
                      title="Coordenadas" 
                      value={`${ipData.latitude}, ${ipData.longitude}`}
                      copyable 
                    />
                  )}
                </div>
              </div>

              {/* Informações de Rede */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Wifi className="h-5 w-5" />
                  Provedor de Internet
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoCard icon={Wifi} title="ISP" value={ipData.isp} />
                  <InfoCard icon={Shield} title="Organização" value={ipData.org} />
                </div>
              </div>

              {/* Informações do Sistema */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Informações do Sistema
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard icon={Monitor} title="Sistema" value={ipData.platform} />
                  <InfoCard icon={Globe} title="Idioma" value={ipData.language} />
                  <InfoCard icon={Monitor} title="Resolução" value={ipData.screenResolution} />
                  <InfoCard icon={Monitor} title="Cores" value={`${ipData.colorDepth} bits`} />
                  <InfoCard icon={Shield} title="Cookies" value={ipData.cookiesEnabled ? 'Habilitados' : 'Desabilitados'} />
                  <InfoCard icon={Globe} title="Hora Local" value={ipData.localTime} />
                </div>
              </div>

              {/* User Agent */}
              <div>
                <h3 className="text-lg font-semibold mb-4">User Agent</h3>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Monitor className="h-5 w-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Navegador</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(ipData.userAgent, 'User Agent')}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground break-all font-mono">
                          {ipData.userAgent}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Informações de Privacidade */}
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                  ⚠️ Informações de Privacidade
                </h3>
                <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                  <li>• Seu IP pode revelar sua localização aproximada</li>
                  <li>• Use uma VPN para ocultar seu IP real</li>
                  <li>• Sites podem rastrear você através do seu IP</li>
                  <li>• Informações do sistema podem ser usadas para fingerprinting</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Erro ao carregar informações</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};