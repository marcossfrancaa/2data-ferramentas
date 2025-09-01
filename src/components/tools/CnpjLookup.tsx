import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building2, Search, Copy, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CnpjData {
  cnpj: string;
  identificador_matriz_filial: number;
  descricao_matriz_filial: string;
  razao_social: string;
  nome_fantasia: string;
  situacao_cadastral: number;
  descricao_situacao_cadastral: string;
  data_situacao_cadastral: string;
  motivo_situacao_cadastral: number;
  nome_cidade_exterior: string;
  codigo_natureza_juridica: number;
  data_inicio_atividade: string;
  cnae_fiscal: number;
  cnae_fiscal_descricao: string;
  cnaes_secundarios?: Array<{codigo: number, descricao: string}>;
  descricao_tipo_logradouro: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  uf: string;
  codigo_municipio: number;
  municipio: string;
  ddd_telefone_1: string;
  telefone_1: string;
  ddd_telefone_2: string;
  telefone_2: string;
  ddd_fax: string;
  fax: string;
  correio_eletronico: string;
  qualificacao_do_responsavel: number;
  capital_social: number;
  porte: number;
  descricao_porte: string;
}

export const CnpjLookup = () => {
  const [cnpj, setCnpj] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CnpjData | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const formatCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{0,2})/, '$1.$2.$3/$4-$5');
    }
    return numbers.substring(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const consultarCnpj = async () => {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length !== 14) {
      setError('CNPJ deve ter 14 dígitos');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Consulta na Brasil API para obter CNPJ completo com CNAEs
      const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
      
      if (!response.ok) {
        throw new Error('CNPJ não encontrado ou inválido');
      }
      
      const data = await response.json();
      
      if (data.message && data.message.includes('CNPJ NAO ENCONTRADO')) {
        setError('CNPJ não encontrado na Receita Federal');
        return;
      }

      setResult({
        cnpj: data.cnpj,
        identificador_matriz_filial: data.identificador_matriz_filial || 0,
        descricao_matriz_filial: data.descricao_matriz_filial || 'Não informado',
        razao_social: data.razao_social || data.nome_fantasia || 'Não informado',
        nome_fantasia: data.nome_fantasia || 'Não informado',
        situacao_cadastral: data.codigo_situacao_cadastral || 0,
        descricao_situacao_cadastral: data.descricao_situacao_cadastral || 'Não informado',
        data_situacao_cadastral: data.data_situacao_cadastral || '',
        motivo_situacao_cadastral: data.codigo_motivo_situacao_cadastral || 0,
        nome_cidade_exterior: data.nome_cidade_exterior || '',
        codigo_natureza_juridica: data.codigo_natureza_juridica || 0,
        data_inicio_atividade: data.data_inicio_atividade || '',
        cnae_fiscal: data.cnae_fiscal || 0,
        cnae_fiscal_descricao: data.cnae_fiscal_descricao || 'Não informado',
        cnaes_secundarios: data.cnaes_secundarios || [],
        descricao_tipo_logradouro: data.descricao_tipo_logradouro || '',
        logradouro: data.logradouro || 'Não informado',
        numero: data.numero || 'S/N',
        complemento: data.complemento || '',
        bairro: data.bairro || 'Não informado',
        cep: data.cep || 'Não informado',
        uf: data.uf || 'Não informado',
        codigo_municipio: data.codigo_municipio || 0,
        municipio: data.municipio || 'Não informado',
        ddd_telefone_1: data.ddd_telefone_1 || '',
        telefone_1: data.telefone_1 || '',
        ddd_telefone_2: data.ddd_telefone_2 || '',
        telefone_2: data.telefone_2 || '',
        ddd_fax: data.ddd_fax || '',
        fax: data.fax || '',
        correio_eletronico: data.correio_eletronico || '',
        qualificacao_do_responsavel: data.qualificacao_do_responsavel || 0,
        capital_social: data.capital_social || 0,
        porte: data.codigo_porte || 0,
        descricao_porte: data.porte || 'Não informado'
      });

      toast({
        title: "CNPJ encontrado!",
        description: `${data.razao_social || data.nome_fantasia}`,
      });
    } catch (error) {
      setError('Erro ao consultar CNPJ. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível consultar o CNPJ",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: `${label} copiado para a área de transferência`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Consulta CNPJ</h1>
        </div>
        <p className="text-muted-foreground">
          Consulte informações completas de empresas brasileiras usando dados públicos da Receita Federal.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card mb-6">
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <Label htmlFor="cnpj-input">CNPJ</Label>
            <Input
              id="cnpj-input"
              value={cnpj}
              onChange={(e) => setCnpj(formatCnpj(e.target.value))}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              className="font-mono"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={consultarCnpj}
              disabled={loading || cnpj.replace(/\D/g, '').length !== 14}
              className="bg-gradient-primary hover:opacity-90 transition-fast"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Consultando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Consultar
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-6">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-card-foreground">Informações da Empresa</h3>
            </div>
            
            {/* Dados Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <div className="flex gap-2">
                  <Input value={result.cnpj} readOnly className="font-mono" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.cnpj, 'CNPJ')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Situação</Label>
                <Input 
                  value={result.descricao_situacao_cadastral} 
                  readOnly 
                  className={result.situacao_cadastral === 2 ? 'text-green-600' : 'text-red-600'}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Razão Social</Label>
                <div className="flex gap-2">
                  <Input value={result.razao_social} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.razao_social, 'Razão Social')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {result.nome_fantasia && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Nome Fantasia</Label>
                  <div className="flex gap-2">
                    <Input value={result.nome_fantasia} readOnly />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(result.nome_fantasia, 'Nome Fantasia')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Data de Abertura</Label>
                <Input value={formatDate(result.data_inicio_atividade)} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Porte</Label>
                <Input value={result.descricao_porte} readOnly />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Atividade Principal (CNAE)</Label>
                <Input value={`${result.cnae_fiscal} - ${result.cnae_fiscal_descricao}`} readOnly />
              </div>

              {/* Atividades Secundárias */}
              {result.cnaes_secundarios && result.cnaes_secundarios.length > 0 && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Atividades Secundárias (CNAEs)</Label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {result.cnaes_secundarios.map((cnae: any, index: number) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          value={`${cnae.codigo} - ${cnae.descricao}`} 
                          readOnly 
                          className="text-sm"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(`${cnae.codigo} - ${cnae.descricao}`, 'CNAE Secundário')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Capital Social</Label>
                <Input value={formatCurrency(result.capital_social)} readOnly />
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Input value={result.descricao_matriz_filial} readOnly />
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Endereço</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label>Logradouro</Label>
                  <Input value={`${result.descricao_tipo_logradouro} ${result.logradouro}, ${result.numero}`} readOnly />
                </div>

                {result.complemento && (
                  <div className="space-y-2">
                    <Label>Complemento</Label>
                    <Input value={result.complemento} readOnly />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Bairro</Label>
                  <Input value={result.bairro} readOnly />
                </div>

                <div className="space-y-2">
                  <Label>CEP</Label>
                  <Input value={result.cep} readOnly className="font-mono" />
                </div>

                <div className="space-y-2">
                  <Label>Cidade</Label>
                  <Input value={result.municipio} readOnly />
                </div>

                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Input value={result.uf} readOnly />
                </div>
              </div>
            </div>

            {/* Contato */}
            {(result.telefone_1 || result.correio_eletronico) && (
              <div>
                <h4 className="font-medium text-card-foreground mb-3">Contato</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.telefone_1 && (
                    <div className="space-y-2">
                      <Label>Telefone 1</Label>
                      <div className="flex gap-2">
                        <Input value={`(${result.ddd_telefone_1}) ${result.telefone_1}`} readOnly className="font-mono" />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(`(${result.ddd_telefone_1}) ${result.telefone_1}`, 'Telefone')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {result.telefone_2 && (
                    <div className="space-y-2">
                      <Label>Telefone 2</Label>
                      <div className="flex gap-2">
                        <Input value={`(${result.ddd_telefone_2}) ${result.telefone_2}`} readOnly className="font-mono" />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(`(${result.ddd_telefone_2}) ${result.telefone_2}`, 'Telefone 2')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {result.correio_eletronico && (
                    <div className="space-y-2">
                      <Label>E-mail</Label>
                      <div className="flex gap-2">
                        <Input value={result.correio_eletronico} readOnly />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => copyToClipboard(result.correio_eletronico, 'E-mail')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">📊 Fonte dos Dados</h4>
            <p className="text-muted-foreground">
              Esta ferramenta utiliza a <strong>Brasil API</strong> oficial (brasilapi.com.br) para consultar 
              dados completos de empresas brasileiras diretamente da Receita Federal. 
              Os dados incluem informações cadastrais, endereço, atividade principal e situação fiscal, 
              garantindo informações sempre atualizadas e oficiais.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};