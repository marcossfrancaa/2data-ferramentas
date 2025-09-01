import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, MapPin, Shield, Wifi, Copy, RefreshCw, Monitor } from 'lucide-react';
import { toast } from 'sonner';

interface IpLookupData {
  ip: string;
  country: string;
  country_code: string;
  city: string;
  region: string;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  latitude: number;
  longitude: number;
  postal: string;
  calling_code: string;
  flag: string;
  emoji_flag: string;
  asn: {
    asn: string;
    name: string;
    domain: string;
    route: string;
    type: string;
  };
}

export const IpLookup = () => {
  const [inputIp, setInputIp] = useState('');
  const [ipData, setIpData] = useState<IpLookupData | null>(null);
  const [loading, setLoading] = useState(false);

  const validateIp = (ip: string) => {
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  };

  const fetchIpInfo = async () => {
    if (inputIp.trim() && !validateIp(inputIp.trim())) {
      toast.error('Formato de IP inválido');
      return;
    }

    setLoading(true);
    try {
      // Consulta na IPWho.is API
      const url = inputIp.trim() ? `https://ipwho.is/${inputIp.trim()}` : 'https://ipwho.is/';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Erro ao consultar IP');
      }
      
      const data = await response.json();
      
      if (!data.success && data.success !== undefined) {
        throw new Error(data.message || 'IP inválido ou não encontrado');
      }
      
      const ipInfo = {
        ip: data.ip || inputIp || 'Não disponível',
        country: data.country || 'Não disponível',
        country_code: data.country_code || '',
        city: data.city || 'Não disponível',
        region: data.region || 'Não disponível',
        timezone: data.timezone?.id || data.timezone || 'Não disponível',
        isp: data.connection?.org || data.connection?.isp || data.org || 'Não disponível',
        org: data.connection?.org || data.org || 'Não disponível',
        as: data.connection?.asn?.toString() || 'Não disponível',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        postal: data.postal || 'Não disponível',
        calling_code: data.calling_code || '',
        flag: data.flag?.emoji || '',
        emoji_flag: data.flag?.emoji || '',
        asn: {
          asn: data.connection?.asn?.toString() || '',
          name: data.connection?.org || '',
          domain: data.connection?.domain || '',
          route: '',
          type: data.type || ''
        }
      };

      setIpData(ipInfo);
      toast.success('Informações do IP obtidas com sucesso!');
    } catch (error: any) {
      toast.error(`Erro ao consultar IP: ${error.message}`);
      setIpData(null);
    } finally {
      setLoading(false);
    }
  };

  const getMyIp = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://ipwho.is/');
      const data = await response.json();
      
      if (!data.success && data.success !== undefined) {
        throw new Error('Não foi possível obter seu IP');
      }
      
      setInputIp(data.ip);
      
      const ipInfo = {
        ip: data.ip || 'Não disponível',
        country: data.country || 'Não disponível',
        country_code: data.country_code || '',
        city: data.city || 'Não disponível',
        region: data.region || 'Não disponível',
        timezone: data.timezone?.id || data.timezone || 'Não disponível',
        isp: data.connection?.org || data.connection?.isp || 'Não disponível',
        org: data.connection?.org || 'Não disponível',
        as: data.connection?.asn?.toString() || 'Não disponível',
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        postal: data.postal || 'Não disponível',
        calling_code: data.calling_code || '',
        flag: data.flag?.emoji || '',
        emoji_flag: data.flag?.emoji || '',
        asn: {
          asn: data.connection?.asn?.toString() || '',
          name: data.connection?.org || '',
          domain: data.connection?.domain || '',
          route: '',
          type: data.type || ''
        }
      };

      setIpData(ipInfo);
      toast.success('Seu IP foi detectado!');
    } catch (error) {
      toast.error('Erro ao obter seu IP');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência`);
  };

  const InfoCard = ({ 
    icon: Icon, 
    title, 
    value, 
    copyable = false 
  }: { 
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
          <CardTitle>Consulta de Endereço de IP</CardTitle>
          <CardDescription>
            Digite um endereço de IP para ver sua localização e informações de rede, ou 
            deixe em branco para consultar o seu próprio IP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Ex: 8.8.8.8 ou deixe vazio para seu IP"
                value={inputIp}
                onChange={(e) => setInputIp(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchIpInfo()}
              />
            </div>
            <Button 
              onClick={fetchIpInfo}
              disabled={loading}
              className="min-w-[120px]"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Consultar
            </Button>
            <Button 
              onClick={getMyIp}
              disabled={loading}
              variant="outline"
              className="min-w-[120px]"
            >
              <Monitor className="h-4 w-4 mr-2" />
              Consultar Meu IP
            </Button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Obtendo informações do IP...</p>
              </div>
            </div>
          )}

          {ipData && !loading && (
            <>
              {/* IP Principal */}
              <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="space-y-2 mb-4">
                  <h2 className="text-3xl font-bold flex items-center justify-center gap-2 font-mono">
                    {ipData.ip}
                    {ipData.emoji_flag && <span className="text-2xl">{ipData.emoji_flag}</span>}
                  </h2>
                  <div className="text-lg text-muted-foreground">
                    <span className="font-semibold">Seu IP Real:</span> 
                    <span className="font-mono bg-background/50 px-2 py-1 rounded ml-2">
                      {ipData.ip}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground mb-4">
                  📍 {ipData.city}, {ipData.region}, {ipData.country}
                </p>
                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={() => copyToClipboard(ipData.ip, 'IP')}
                    variant="outline"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar IP
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(`${ipData.city}, ${ipData.region}, ${ipData.country}`, 'Localização')}
                    variant="outline"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Copiar Localização
                  </Button>
                </div>
              </div>

              {/* Informações de Localização */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localização
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard 
                    icon={Globe} 
                    title="País" 
                    value={`${ipData.country} (${ipData.country_code})`} 
                  />
                  <InfoCard icon={MapPin} title="Cidade" value={ipData.city} />
                  <InfoCard icon={MapPin} title="Região/Estado" value={ipData.region} />
                  <InfoCard icon={Globe} title="Fuso Horário" value={ipData.timezone} />
                  <InfoCard 
                    icon={MapPin} 
                    title="CEP/Código Postal" 
                    value={ipData.postal} 
                  />
                  {ipData.calling_code && (
                    <InfoCard 
                      icon={Globe} 
                      title="Código de Discagem" 
                      value={ipData.calling_code} 
                    />
                  )}
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
                  <InfoCard icon={Wifi} title="ISP" value={ipData.isp} copyable />
                  <InfoCard icon={Shield} title="Organização" value={ipData.org} copyable />
                  <InfoCard icon={Shield} title="ASN" value={ipData.as} copyable />
                  {ipData.asn.name && (
                    <InfoCard icon={Wifi} title="Nome ASN" value={ipData.asn.name} />
                  )}
                </div>
              </div>

              {/* Informações sobre a API */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  🌐 Fonte dos Dados
                </h3>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• <strong>API Principal:</strong> IPWho.is - Serviço oficial de geolocalização de IP</li>
                  <li>• <strong>Dados incluem:</strong> Localização, ISP, ASN, coordenadas geográficas</li>
                  <li>• <strong>Privacidade:</strong> Use VPN para ocultar seu IP real</li>
                  <li>• <strong>Precisão:</strong> Localização aproximada baseada no provedor de internet</li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};