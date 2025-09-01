import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Globe, Shield, Calendar, Building, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface DomainData {
  domain: string;
  registrar: string;
  registration_date: string;
  expiration_date: string;
  updated_date: string;
  name_servers: string[];
  status: string[];
  admin_name?: string;
  admin_email?: string;
  admin_organization?: string;
  registrant_name?: string;
  registrant_email?: string;
  registrant_organization?: string;
}

export const DomainLookup = () => {
  const [domain, setDomain] = useState('');
  const [domainData, setDomainData] = useState<DomainData | null>(null);
  const [loading, setLoading] = useState(false);

  const cleanDomain = (input: string) => {
    // Remove protocolo e www se existir
    return input.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  };

  const fetchDomainInfo = async () => {
    if (!domain.trim()) {
      toast.error('Digite um domínio válido');
      return;
    }

    setLoading(true);
    try {
      const cleanedDomain = cleanDomain(domain.trim());
      
      // Usar API RDAP gratuita do registro.br para domínios .br ou whoisjsonapi para outros
      let response;
      let data;
      
      if (cleanedDomain.endsWith('.br')) {
        // Para domínios .br usar RDAP do registro.br
        response = await fetch(`https://rdap.registro.br/domain/${cleanedDomain}`);
        data = await response.json();
        
        if (response.ok && data) {
          setDomainData({
            domain: cleanedDomain,
            registrar: data.entities?.[0]?.handle || 'Não disponível',
            registration_date: data.events?.find((e: any) => e.eventAction === 'registration')?.eventDate || 'Não disponível',
            expiration_date: data.events?.find((e: any) => e.eventAction === 'expiration')?.eventDate || 'Não disponível',
            updated_date: data.events?.find((e: any) => e.eventAction === 'last changed')?.eventDate || 'Não disponível',
            name_servers: data.nameservers?.map((ns: any) => ns.ldhName) || [],
            status: data.status || [],
            admin_name: data.entities?.[1]?.vcardArray?.[1]?.[1]?.[3] || 'Não disponível',
            admin_email: data.entities?.[1]?.vcardArray?.[1]?.[2]?.[3] || 'Não disponível',
            admin_organization: data.entities?.[1]?.vcardArray?.[1]?.[0]?.[3] || 'Não disponível',
            registrant_name: data.entities?.[0]?.vcardArray?.[1]?.[1]?.[3] || 'Não disponível',
            registrant_email: data.entities?.[0]?.vcardArray?.[1]?.[2]?.[3] || 'Não disponível',
            registrant_organization: data.entities?.[0]?.vcardArray?.[1]?.[0]?.[3] || 'Não disponível'
          });
        } else {
          throw new Error('Domínio não encontrado no registro.br');
        }
      } else {
        // Para outros domínios usar whoisjsonapi (gratuita)
        response = await fetch(`https://whoisjsonapi.com/v1/${cleanedDomain}`);
        data = await response.json();
        
        if (response.ok && data) {
          setDomainData({
            domain: cleanedDomain,
            registrar: data.registrar || 'Não disponível',
            registration_date: data.created || 'Não disponível',
            expiration_date: data.expires || 'Não disponível',
            updated_date: data.changed || 'Não disponível',
            name_servers: data.dns || [],
            status: data.status ? [data.status] : [],
            admin_name: 'Não disponível',
            admin_email: 'Não disponível', 
            admin_organization: 'Não disponível',
            registrant_name: 'Não disponível',
            registrant_email: 'Não disponível',
            registrant_organization: 'Não disponível'
          });
        } else {
          throw new Error('Domínio não encontrado');
        }
      }

      toast.success('Informações do domínio obtidas com sucesso!');
    } catch (error: any) {
      toast.error(`Erro ao consultar domínio: ${error.message}`);
      setDomainData(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === 'Não disponível') return dateString;
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return dateString;
    }
  };

  const InfoCard = ({ 
    icon: Icon, 
    title, 
    value, 
    copyable = false 
  }: { 
    icon: any, 
    title: string, 
    value: string | string[], 
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
                  onClick={() => copyToClipboard(
                    Array.isArray(value) ? value.join(', ') : value, 
                    title
                  )}
                  className="h-6 w-6 p-0"
                >
                  <Copy className="h-3 w-3" />
                </Button>
              )}
            </div>
            {Array.isArray(value) ? (
              <div className="space-y-1">
                {value.map((item, index) => (
                  <p key={index} className="text-sm text-muted-foreground break-all">
                    {item}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground break-all">{value}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Consulta de Domínio (WHOIS/RDAP)</CardTitle>
          <CardDescription>
            Consulte informações de registro de domínios usando o protocolo oficial RDAP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Ex: google.com, https://google.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchDomainInfo()}
              />
            </div>
            <Button 
              onClick={fetchDomainInfo}
              disabled={loading}
              className="min-w-[120px]"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Consultando...' : 'Consultar'}
            </Button>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Consultando informações do domínio...</p>
              </div>
            </div>
          )}

          {domainData && !loading && (
            <>
              {/* Domínio Principal */}
              <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">{domainData.domain}</h2>
                <p className="text-muted-foreground mb-4">Informações de registro</p>
                <Button
                  onClick={() => copyToClipboard(domainData.domain, 'Domínio')}
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Domínio
                </Button>
              </div>

              {/* Informações de Registro */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Informações de Registro
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InfoCard 
                    icon={Building} 
                    title="Registrador" 
                    value={domainData.registrar} 
                    copyable 
                  />
                  <InfoCard 
                    icon={Calendar} 
                    title="Data de Registro" 
                    value={formatDate(domainData.registration_date)} 
                  />
                  <InfoCard 
                    icon={Calendar} 
                    title="Data de Expiração" 
                    value={formatDate(domainData.expiration_date)} 
                  />
                  <InfoCard 
                    icon={Calendar} 
                    title="Última Atualização" 
                    value={formatDate(domainData.updated_date)} 
                  />
                  {domainData.status.length > 0 && (
                    <InfoCard 
                      icon={Shield} 
                      title="Status" 
                      value={domainData.status} 
                    />
                  )}
                </div>
              </div>

              {/* Name Servers */}
              {domainData.name_servers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Servidores DNS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoCard 
                      icon={Globe} 
                      title="Name Servers" 
                      value={domainData.name_servers} 
                      copyable 
                    />
                  </div>
                </div>
              )}

              {/* Informações de Contato */}
              {(domainData.registrant_name || domainData.admin_name) && (
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Informações de Contato
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {domainData.registrant_name && (
                      <InfoCard 
                        icon={Building} 
                        title="Proprietário" 
                        value={domainData.registrant_name} 
                      />
                    )}
                    {domainData.registrant_organization && (
                      <InfoCard 
                        icon={Building} 
                        title="Organização do Proprietário" 
                        value={domainData.registrant_organization} 
                      />
                    )}
                    {domainData.admin_name && (
                      <InfoCard 
                        icon={Building} 
                        title="Contato Administrativo" 
                        value={domainData.admin_name} 
                      />
                    )}
                    {domainData.admin_organization && (
                      <InfoCard 
                        icon={Building} 
                        title="Organização Admin" 
                        value={domainData.admin_organization} 
                      />
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Informações sobre APIs */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              🌐 Fontes dos Dados
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• <strong>Domínios .br:</strong> API RDAP oficial do Registro.br</li>
              <li>• <strong>Outros domínios:</strong> WhoisJSONApi (gratuita)</li>
              <li>• <strong>Protocolo RDAP:</strong> Padrão oficial para consulta de domínios</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};