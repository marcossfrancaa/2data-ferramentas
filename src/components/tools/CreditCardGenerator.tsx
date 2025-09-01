import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { CreditCard, Copy, RefreshCw, ChevronDown, Download, Table, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FlipCard } from './FlipCard';
import { CreditCardFront } from './CreditCardFront';
import { CreditCardBack } from './CreditCardBack';
import { CopyButton } from './CopyButton';
import { CreditCardValidatorSection } from './CreditCardValidator';
import { CardHolderDetails } from './CardHolderDetails';
import { AddressMode, AddressData, type AddressMode as AddressModeType } from './AddressMode';
import { faker } from '@faker-js/faker/locale/pt_BR';

const bandeiras = [
  { name: 'Visa', prefix: '4', length: 16 },
  { name: 'Mastercard', prefix: '5', length: 16 },
  { name: 'American Express', prefix: '34', length: 15 },
  { name: 'Diners Club', prefix: '30', length: 14 },
];

// Lista de CEPs reais de diferentes regiões do Brasil para buscar dados via ViaCEP
const cepsReaisBrasil = [
  '01310-100', // São Paulo - SP
  '20040-020', // Rio de Janeiro - RJ
  '30112-000', // Belo Horizonte - MG
  '80010-000', // Curitiba - PR
  '90010-270', // Porto Alegre - RS
  '70040-010', // Brasília - DF
  '50030-230', // Recife - PE
  '40070-110', // Salvador - BA
  '60115-221', // Fortaleza - CE
  '69005-040', // Manaus - AM
  '66010-080', // Belém - PA
  '79002-073', // Campo Grande - MS
  '78005-050', // Cuiabá - MT
  '74006-015', // Goiânia - GO
  '49010-190', // Aracaju - SE
  '57020-050', // Maceió - AL
  '58013-390', // João Pessoa - PB
  '59012-300', // Natal - RN
  '64001-020', // Teresina - PI
  '77001-090', // Palmas - TO
  '68900-073', // Macapá - AP
  '69301-110', // Boa Vista - RR
  '72010-900', // Águas Claras - DF
  '88010-400', // Florianópolis - SC
  '29010-120', // Vitória - ES
];

interface CreditCardData {
  numero: string;
  numeroFormatado: string;
  cvv: string;
  dataVencimento: string;
  nomePortador: string;
  bandeira: string;
  dadosAdicionais: AddressData;
}

export const CreditCardGenerator = () => {
  const [bandeira, setBandeira] = useState('');
  const [numeroCartao, setNumeroCartao] = useState('');
  const [cvv, setCvv] = useState('');
  const [dataVencimento, setDataVencimento] = useState('');
  const [nomePortador, setNomePortador] = useState('');
  
  // Configurações avançadas
  const [quantidade, setQuantidade] = useState('1');
  const [nomeCustomizado, setNomeCustomizado] = useState('');
  const [mesCustomizado, setMesCustomizado] = useState('random');
  const [anoCustomizado, setAnoCustomizado] = useState('random');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [cartoes, setCartoes] = useState<CreditCardData[]>([]);
  const [showDetails, setShowDetails] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Configurações de endereço
  const [addressMode, setAddressMode] = useState<AddressModeType>('random');
  const [addressData, setAddressData] = useState<AddressData>({
    logradouro: '',
    numero: '',
    bairro: '',
    localidade: '',
    uf: '',
    cep: '',
  });
  
  const { toast } = useToast();

  const generateRandomAddress = useCallback(async (): Promise<AddressData> => {
    try {
      // Seleciona um CEP aleatório da lista
      const cepAleatorio = cepsReaisBrasil[Math.floor(Math.random() * cepsReaisBrasil.length)];
      const cleanCep = cepAleatorio.replace(/\D/g, '');
      
      // Busca dados reais via ViaCEP
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        return {
          logradouro: data.logradouro || faker.location.street(),
          numero: faker.location.buildingNumber(),
          bairro: data.bairro || faker.location.county(),
          localidade: data.localidade || faker.location.city(),
          uf: data.uf || faker.location.state({ abbreviated: true }),
          cep: data.cep || faker.location.zipCode('#####-###'),
        };
      }
    } catch (error) {
      console.log('Erro ao buscar CEP, usando dados do Faker:', error);
    }
    
    // Fallback para dados do Faker se a API falhar
    return {
      logradouro: faker.location.street(),
      numero: faker.location.buildingNumber(),
      bairro: faker.location.county(),
      localidade: faker.location.city(),
      uf: faker.location.state({ abbreviated: true }),
      cep: faker.location.zipCode('#####-###'),
    };
  }, []);

  const generateSingleCard = useCallback(async (bandeiraInfo: typeof bandeiras[0]): Promise<CreditCardData> => {
    // Gera número do cartão
    let numero = bandeiraInfo.prefix;
    
    // Completa com dígitos aleatórios até o tamanho - 1 (último dígito é verificador)
    while (numero.length < bandeiraInfo.length - 1) {
      numero += Math.floor(Math.random() * 10);
    }
    
    // Calcula dígito verificador usando algoritmo de Luhn
    let sum = 0;
    let alternate = true;
    
    for (let i = numero.length - 1; i >= 0; i--) {
      let digit = parseInt(numero[i]);
      
      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit = (digit % 10) + 1;
        }
      }
      
      sum += digit;
      alternate = !alternate;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    numero += checkDigit;
    
    // Formata número do cartão
    let numeroFormatado = '';
    for (let i = 0; i < numero.length; i += 4) {
      if (i > 0) numeroFormatado += ' ';
      numeroFormatado += numero.substr(i, 4);
    }
    
    // Gera CVV (3 dígitos para o Brasil)
    const cvvGerado = Array.from({ length: 3 }, () => Math.floor(Math.random() * 10)).join('');
    
    // Gera data de vencimento
    let dataVencimento;
    if (mesCustomizado !== 'random' && anoCustomizado !== 'random') {
      dataVencimento = `${mesCustomizado.padStart(2, '0')}/${anoCustomizado.slice(-2)}`;
    } else {
      const hoje = new Date();
      const anoVencimento = hoje.getFullYear() + Math.floor(Math.random() * 5) + 1;
      const mesVencimento = Math.floor(Math.random() * 12) + 1;
      dataVencimento = `${mesVencimento.toString().padStart(2, '0')}/${anoVencimento.toString().substr(2)}`;
    }
    
    // Gera nome do portador usando Faker ou nome customizado
    let nomePortadorFinal;
    if (nomeCustomizado.trim()) {
      nomePortadorFinal = nomeCustomizado.toUpperCase();
    } else {
      nomePortadorFinal = faker.person.fullName().toUpperCase();
    }
    
    // Determina dados de endereço baseado no modo
    let dadosAdicionais: AddressData;
    if (addressMode === 'random') {
      dadosAdicionais = await generateRandomAddress();
    } else if (addressMode === 'cep' && addressData.logradouro) {
      // PRIORIDADE PARA API VIACEP: Se estamos no modo CEP e temos dados válidos da API, usar exclusivamente esses dados
      dadosAdicionais = { ...addressData };
    } else if (addressMode === 'manual') {
      // Modo manual: usar dados digitados pelo usuário
      dadosAdicionais = { ...addressData };
    } else {
      // Fallback para endereço aleatório se não há dados válidos
      dadosAdicionais = await generateRandomAddress();
    }
    
    return {
      numero,
      numeroFormatado,
      cvv: cvvGerado,
      dataVencimento,
      nomePortador: nomePortadorFinal,
      bandeira: bandeiraInfo.name,
      dadosAdicionais
    };
  }, [nomeCustomizado, mesCustomizado, anoCustomizado, addressMode, addressData, generateRandomAddress]);

  const gerarEAtualizarCartao = useCallback(async () => {
    if (!bandeira) return;
    
    setIsGenerating(true);
    
    // Pequeno delay para mostrar o feedback visual
    setTimeout(async () => {
      const bandeiraInfo = bandeiras.find(b => b.name === bandeira);
      if (!bandeiraInfo) return;

      const qtd = parseInt(quantidade) || 1;
      const novosCartoes: CreditCardData[] = [];

      for (let i = 0; i < qtd; i++) {
        const cartao = await generateSingleCard(bandeiraInfo);
        novosCartoes.push(cartao);
      }

      setCartoes(novosCartoes);
      
      // Para compatibilidade, mantém os estados antigos para o primeiro cartão
      if (novosCartoes.length > 0) {
        const primeiro = novosCartoes[0];
        setNumeroCartao(primeiro.numeroFormatado);
        setCvv(primeiro.cvv);
        setDataVencimento(primeiro.dataVencimento);
        setNomePortador(primeiro.nomePortador);
      }
      
      setIsGenerating(false);
    }, 300);
  }, [bandeira, quantidade, generateSingleCard]);

  // Geração automática ao carregar a página
  useEffect(() => {
    if (!bandeira) {
      // Seleciona uma bandeira aleatória na primeira carga
      const bandeiraAleatoria = bandeiras[Math.floor(Math.random() * bandeiras.length)];
      setBandeira(bandeiraAleatoria.name);
    }
  }, []);

  // Reatividade: regenera sempre que as configurações mudam
  useEffect(() => {
    if (bandeira) {
      gerarEAtualizarCartao();
    }
  }, [bandeira, nomeCustomizado, mesCustomizado, anoCustomizado, quantidade, addressMode, addressData, gerarEAtualizarCartao]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Dados copiados para a área de transferência",
    });
  };

  const copyAllCardData = (cartao?: CreditCardData) => {
    const card = cartao || cartoes[0];
    if (!card) return;
    
    const endercoCompleto = `${card.dadosAdicionais.logradouro}${card.dadosAdicionais.numero ? `, ${card.dadosAdicionais.numero}` : ''}`;
    
    const texto = `Número: ${card.numeroFormatado}
CVV: ${card.cvv}
Vencimento: ${card.dataVencimento}
Portador: ${card.nomePortador}
Bandeira: ${card.bandeira}
Endereço: ${endercoCompleto}
Bairro: ${card.dadosAdicionais.bairro}
Cidade: ${card.dadosAdicionais.localidade}
Estado: ${card.dadosAdicionais.uf}
CEP: ${card.dadosAdicionais.cep}`;
    
    copyToClipboard(texto);
  };

  const exportData = (format: 'csv' | 'json' | 'txt') => {
    if (cartoes.length === 0) return;
    
    let content = '';
    let filename = '';
    
    switch (format) {
      case 'csv':
        content = 'Numero,CVV,Vencimento,Portador,Bandeira,Endereco,Bairro,Cidade,Estado,CEP\n' +
          cartoes.map(c => {
            const enderco = `${c.dadosAdicionais.logradouro}${c.dadosAdicionais.numero ? `, ${c.dadosAdicionais.numero}` : ''}`;
            return `${c.numero},${c.cvv},${c.dataVencimento},"${c.nomePortador}",${c.bandeira},"${enderco}","${c.dadosAdicionais.bairro}","${c.dadosAdicionais.localidade}",${c.dadosAdicionais.uf},${c.dadosAdicionais.cep}`;
          }).join('\n');
        filename = 'cartoes.csv';
        break;
        
      case 'json':
        content = JSON.stringify(cartoes, null, 2);
        filename = 'cartoes.json';
        break;
        
      case 'txt':
        content = cartoes.map(c => {
          const enderco = `${c.dadosAdicionais.logradouro}${c.dadosAdicionais.numero ? `, ${c.dadosAdicionais.numero}` : ''}`;
          return `Número: ${c.numeroFormatado}\nCVV: ${c.cvv}\nVencimento: ${c.dataVencimento}\nPortador: ${c.nomePortador}\nBandeira: ${c.bandeira}\nEndereço: ${enderco}\nBairro: ${c.dadosAdicionais.bairro}\nCidade: ${c.dadosAdicionais.localidade}\nEstado: ${c.dadosAdicionais.uf}\nCEP: ${c.dadosAdicionais.cep}\n`;
        }).join('\n---\n\n');
        filename = 'cartoes.txt';
        break;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Exportado!",
      description: `Dados exportados como ${format.toUpperCase()}`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Suíte de Dados de Teste - Cartão de Crédito</h1>
        </div>
        <p className="text-muted-foreground">
          Ferramenta reativa para geração e validação de dados de cartão de crédito com endereços brasileiros realistas via ViaCEP.
        </p>
      </div>

      <Tabs defaultValue="gerador" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gerador">Gerador</TabsTrigger>
          <TabsTrigger value="validador">Validador</TabsTrigger>
        </TabsList>

        <TabsContent value="gerador" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Configurações */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Configurações Reativas
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="bandeira">Bandeira</Label>
                    <Select value={bandeira} onValueChange={setBandeira}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a bandeira" />
                      </SelectTrigger>
                      <SelectContent>
                        {bandeiras.map((band) => (
                          <SelectItem key={band.name} value={band.name}>
                            {band.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={gerarEAtualizarCartao}
                  disabled={!bandeira || isGenerating}
                  className="w-full mt-6"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                  {isGenerating ? 'Gerando...' : 'Gerar Novo Cartão'}
                </Button>

                {/* Configurações Avançadas */}
                <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen} className="mt-6">
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${isAdvancedOpen ? 'rotate-180' : ''}`} />
                      Configurações Avançadas
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="quantidade">Quantidade</Label>
                      <Input
                        id="quantidade"
                        type="number"
                        min="1"
                        max="100"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                        placeholder="1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="nomeCustomizado">Nome do Portador (Opcional)</Label>
                      <Input
                        id="nomeCustomizado"
                        value={nomeCustomizado}
                        onChange={(e) => setNomeCustomizado(e.target.value)}
                        placeholder="Deixe vazio para usar Faker.js"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="mesCustomizado">Mês Vencimento</Label>
                        <Select value={mesCustomizado} onValueChange={setMesCustomizado}>
                          <SelectTrigger>
                            <SelectValue placeholder="Aleatório" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="random">Aleatório</SelectItem>
                            {Array.from({ length: 12 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                {(i + 1).toString().padStart(2, '0')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="anoCustomizado">Ano Vencimento</Label>
                        <Select value={anoCustomizado} onValueChange={setAnoCustomizado}>
                          <SelectTrigger>
                            <SelectValue placeholder="Aleatório" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="random">Aleatório</SelectItem>
                            {Array.from({ length: 10 }, (_, i) => {
                              const ano = new Date().getFullYear() + i;
                              return (
                                <SelectItem key={ano} value={ano.toString()}>
                                  {ano}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Configuração de Endereço */}
              <AddressMode
                mode={addressMode}
                onModeChange={setAddressMode}
                onAddressChange={setAddressData}
                addressData={addressData}
              />
            </div>

            {/* Visualização do Cartão */}
            <div className="xl:col-span-2">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">
                  Cartão Gerado
                </h3>
                
                {numeroCartao ? (
                  <div className="space-y-6">
                    <div className={`flex justify-center transition-all duration-300 ${isGenerating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                      <FlipCard
                        frontCard={
                          <CreditCardFront
                            numeroCartao={numeroCartao}
                            nomePortador={nomePortador}
                            dataVencimento={dataVencimento}
                            bandeira={bandeira}
                          />
                        }
                        backCard={
                          <CreditCardBack cvv={cvv} />
                        }
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => copyAllCardData()}
                          className="flex-1"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copiar Todos os Dados
                        </Button>
                        <Button
                          onClick={() => setShowDetails(!showDetails)}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Detalhes
                        </Button>
                      </div>

                      {showDetails && cartoes[0] && (
                        <div className="animate-fade-in">
                          <CardHolderDetails dadosAdicionais={cartoes[0].dadosAdicionais} />
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-2">
                        <CopyButton
                          value={numeroCartao.replace(/\s/g, '')}
                          label="Número"
                          className="justify-start"
                        />
                        <CopyButton
                          value={cvv}
                          label="CVV"
                          className="justify-start"
                        />
                        <CopyButton
                          value={dataVencimento}
                          label="Vencimento"
                          className="justify-start"
                        />
                        <CopyButton
                          value={nomePortador}
                          label="Nome"
                          className="justify-start"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <CreditCard className="w-20 h-20 mx-auto mb-4 opacity-50 animate-pulse" />
                    <p>Carregando cartão...</p>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Tabela de Múltiplos Cartões */}
          {cartoes.length > 1 && (
            <div className="animate-fade-in">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                    <Table className="w-5 h-5" />
                    Cartões Gerados ({cartoes.length})
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportData('csv')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      CSV
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportData('json')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      JSON
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportData('txt')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      TXT
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Número</th>
                        <th className="text-left p-2">CVV</th>
                        <th className="text-left p-2">Vencimento</th>
                        <th className="text-left p-2">Portador</th>
                        <th className="text-left p-2">Bandeira</th>
                        <th className="text-left p-2">Cidade</th>
                        <th className="text-left p-2">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartoes.map((cartao, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="p-2 font-mono">{cartao.numeroFormatado}</td>
                          <td className="p-2 font-mono">{cartao.cvv}</td>
                          <td className="p-2 font-mono">{cartao.dataVencimento}</td>
                          <td className="p-2">{cartao.nomePortador}</td>
                          <td className="p-2">{cartao.bandeira}</td>
                          <td className="p-2">{cartao.dadosAdicionais.localidade}</td>
                          <td className="p-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyAllCardData(cartao)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="validador">
          <CreditCardValidatorSection />
        </TabsContent>
      </Tabs>

      <Card className="mt-6 p-4 bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-green-800 mb-1">✨ Endereços Brasileiros Reais com ViaCEP</h4>
            <p className="text-green-700">
              Agora com endereços brasileiros 100% reais! A ferramenta usa CEPs reais de diferentes 
              regiões do Brasil e busca os dados via API do ViaCEP para garantir bairros, cidades 
              e estados autênticos. Fallback automático para Faker.js em caso de falha na API.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
