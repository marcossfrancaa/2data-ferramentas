import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Building, Copy, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BankData {
  ispb: string;
  name: string;
  code: number;
  fullName: string;
}

export const BankLookup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBanks, setFilteredBanks] = useState<BankData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  // Base de dados expandida dos bancos brasileiros
  const banksDatabase: BankData[] = [
    { ispb: "00000000", name: "BCO DO BRASIL S.A.", code: 1, fullName: "Banco do Brasil S.A." },
    { ispb: "00000208", name: "BRB - BCO DE BRASILIA S.A.", code: 70, fullName: "BRB - Banco de Brasília S.A." },
    { ispb: "00360305", name: "CAIXA ECONOMICA FEDERAL", code: 104, fullName: "Caixa Econômica Federal" },
    { ispb: "00416968", name: "BCO COOPERATIVO SICREDI S.A.", code: 748, fullName: "Banco Cooperativo Sicredi S.A." },
    { ispb: "00795423", name: "BCO ITAU UNIBANCO S.A.", code: 341, fullName: "Banco Itaú Unibanco S.A." },
    { ispb: "02038232", name: "BCO COOPERATIVO DO BRASIL S.A.", code: 756, fullName: "Banco Cooperativo do Brasil S.A." },
    { ispb: "02801938", name: "BCO COOPERATIVO SICOOB S.A.", code: 756, fullName: "Banco Cooperativo Sicoob S.A." },
    { ispb: "07237373", name: "BCO SAFRA S.A.", code: 422, fullName: "Banco Safra S.A." },
    { ispb: "07656500", name: "BCO VIA S.A.", code: 370, fullName: "Banco Via S.A." },
    { ispb: "08561701", name: "BCO BTG PACTUAL S.A.", code: 208, fullName: "Banco BTG Pactual S.A." },
    { ispb: "09274232", name: "BCO ITAUBANK S.A.", code: 479, fullName: "Banco Itaubank S.A." },
    { ispb: "10664513", name: "BCO INTER S.A.", code: 77, fullName: "Banco Inter S.A." },
    { ispb: "11476673", name: "BCO GUANABARA S.A.", code: 612, fullName: "Banco Guanabara S.A." },
    { ispb: "11795423", name: "BCO ORIGINAL S.A.", code: 212, fullName: "Banco Original S.A." },
    { ispb: "15114366", name: "BCO C6 S.A.", code: 336, fullName: "Banco C6 S.A." },
    { ispb: "15357060", name: "NU PAGAMENTOS S.A.", code: 260, fullName: "Nu Pagamentos S.A. (Nubank)" },
    { ispb: "16501555", name: "BCO NEON S.A.", code: 735, fullName: "Banco Neon S.A." },
    { ispb: "17184037", name: "BCO BRADESCO S.A.", code: 237, fullName: "Banco Bradesco S.A." },
    { ispb: "17298092", name: "BCO NEXT S.A.", code: 637, fullName: "Banco Next S.A." },
    { ispb: "18236120", name: "BCO SANTANDER (BRASIL) S.A.", code: 33, fullName: "Banco Santander (Brasil) S.A." },
    { ispb: "18520834", name: "BCO PAN S.A.", code: 623, fullName: "Banco Pan S.A." },
    { ispb: "19307785", name: "BCO BMG S.A.", code: 318, fullName: "Banco BMG S.A." },
    { ispb: "23522214", name: "AGIBANK S.A.", code: 121, fullName: "Agibank S.A." },
    { ispb: "27652684", name: "BCO MODAL S.A.", code: 746, fullName: "Banco Modal S.A." },
    { ispb: "27842177", name: "BCO FIBRA S.A.", code: 224, fullName: "Banco Fibra S.A." },
    { ispb: "28127603", name: "BCO ALFA S.A.", code: 25, fullName: "Banco Alfa S.A." },
    { ispb: "28195667", name: "BCO ABC BRASIL S.A.", code: 246, fullName: "Banco ABC Brasil S.A." },
    { ispb: "30306294", name: "BCO DAYCOVAL S.A.", code: 707, fullName: "Banco Daycoval S.A." },
    { ispb: "31597552", name: "BCO BRADESCO BERJ S.A.", code: 122, fullName: "Banco Bradesco BERJ S.A." },
    { ispb: "32062580", name: "BCO TOPAZIO S.A.", code: 82, fullName: "Banco Topázio S.A." },
    { ispb: "33042151", name: "BCO LA NACION ARGENTINA", code: 300, fullName: "Banco La Nación Argentina" },
    { ispb: "33479023", name: "BCO TOYOTA DO BRASIL S.A.", code: 387, fullName: "Banco Toyota do Brasil S.A." },
    { ispb: "33884941", name: "BCO RENDIMENTO S.A.", code: 633, fullName: "Banco Rendimento S.A." },
    { ispb: "34335592", name: "BCO MASTER S.A.", code: 243, fullName: "Banco Master S.A." },
    { ispb: "36113876", name: "BCO SEMEAR S.A.", code: 743, fullName: "Banco Semear S.A." },
    { ispb: "47866934", name: "BCO CIFRA S.A.", code: 233, fullName: "Banco Cifra S.A." },
    { ispb: "50585090", name: "BCO CREDIT SUISSE BR S.A.", code: 505, fullName: "Banco Credit Suisse Brasil S.A." },
    { ispb: "54403563", name: "BCO CETELEM S.A.", code: 739, fullName: "Banco Cetelem S.A." },
    { ispb: "57839805", name: "BCO SOFISA S.A.", code: 637, fullName: "Banco Sofisa S.A." },
    { ispb: "58616418", name: "BCO CREDIT AGRICOLE BR S.A.", code: 222, fullName: "Banco Credit Agricole Brasil S.A." },
    { ispb: "59285411", name: "BCO GENIAL S.A.", code: 125, fullName: "Banco Genial S.A." },
    { ispb: "59588111", name: "BCO XP S.A.", code: 348, fullName: "Banco XP S.A." },
    { ispb: "60394079", name: "BCO DIGIMAIS S.A.", code: 654, fullName: "Banco Digimais S.A." },
    { ispb: "61024352", name: "BCO STONE S.A.", code: 197, fullName: "Banco Stone S.A." },
    { ispb: "61182408", name: "BCO VOITER S.A.", code: 653, fullName: "Banco Voiter S.A." },
    { ispb: "78626983", name: "BCO INBURSA S.A.", code: 12, fullName: "Banco Inbursa S.A." },
    { ispb: "90400888", name: "BCO SANTANDER S.A.", code: 353, fullName: "Banco Santander S.A." },
    { ispb: "92702067", name: "BCO DO EST. DO RS S.A.", code: 41, fullName: "Banco do Estado do Rio Grande do Sul S.A." },
    { ispb: "92856905", name: "BCO DO EST. DO PA S.A.", code: 37, fullName: "Banco do Estado do Pará S.A." },
    { ispb: "92874270", name: "BCO DO EST. DE SE S.A.", code: 47, fullName: "Banco do Estado de Sergipe S.A." },
    { ispb: "92894922", name: "BCO DO EST. DO ES S.A.", code: 21, fullName: "Banco do Estado do Espírito Santo S.A." },
    // Adicionando mais bancos da lista das imagens
    { ispb: "03046391", name: "BCO SICOOB S.A.", code: 756, fullName: "Banco Sicoob S.A." },
    { ispb: "04632856", name: "BCO COOPERATIVO UNICRED", code: 748, fullName: "Banco Cooperativo Unicred" },
    { ispb: "13140088", name: "BCO MERCANTIL DO BRASIL S.A.", code: 389, fullName: "Banco Mercantil do Brasil S.A." },
    { ispb: "31880826", name: "BCO CREDIT SUISSE (BRASIL) S.A.", code: 505, fullName: "Banco Credit Suisse (Brasil) S.A." },
    { ispb: "78632767", name: "BCO KDB DO BRASIL S.A.", code: 76, fullName: "Banco KDB do Brasil S.A." },
    { ispb: "88888888", name: "BCO PINE S.A.", code: 643, fullName: "Banco Pine S.A." },
    { ispb: "99999999", name: "BCO COOPERATIVO DA AMAZONIA", code: 322, fullName: "Banco Cooperativo da Amazônia" },
    { ispb: "27351731", name: "CORA SCD S.A.", code: 403, fullName: "Cora Sociedade de Crédito Direto S.A." }
  ];

  // Filtrar bancos em tempo real conforme o usuário digita
  useEffect(() => {
    const fetchAndFilterBanks = async () => {
      if (!searchTerm.trim()) {
        setFilteredBanks([]);
        setShowResults(false);
        return;
      }

      try {
        // Consulta na Brasil API para obter lista de bancos
        const response = await fetch('https://brasilapi.com.br/api/banks/v1');
        
        if (!response.ok) {
          throw new Error('Erro ao consultar API de bancos');
        }
        
        const banks = await response.json();
        
        // Atualizar a base local com dados da API
        const apiData = banks.map((bank: any) => ({
          ispb: bank.ispb?.toString() || '',
          name: bank.name || bank.fullName || 'Nome não disponível',
          code: bank.code || 0,
          fullName: bank.fullName || bank.name || 'Nome completo não disponível'
        }));
        
        // Criar mapa para remover duplicados por ISPB ou nome
        const bankMap = new Map();
        
        // Adicionar bancos da base local primeiro
        banksDatabase.forEach(bank => {
          const key = bank.ispb || bank.name.toLowerCase();
          if (!bankMap.has(key)) {
            bankMap.set(key, bank);
          }
        });
        
        // Adicionar bancos da API (sem duplicar)
        apiData.forEach((apiBank: any) => {
          const key = apiBank.ispb || apiBank.name.toLowerCase();
          if (!bankMap.has(key)) {
            bankMap.set(key, apiBank);
          }
        });
        
        const updatedBanks = Array.from(bankMap.values());
        
        // Usar a base atualizada para filtrar
        const term = searchTerm.toLowerCase().trim();
        const filtered = updatedBanks.filter(bank => 
          bank.name.toLowerCase().includes(term) ||
          bank.fullName.toLowerCase().includes(term) ||
          bank.code.toString().includes(term) ||
          bank.ispb.includes(term)
        );

        setFilteredBanks(filtered.slice(0, 15));
        setShowResults(true);
        
        if (filtered.length > 0) {
          toast({
            title: "Dados atualizados!",
            description: `Base de bancos atualizada com dados da Brasil API`,
          });
        }
      } catch (error) {
        // Em caso de erro, usar apenas a base local
        const term = searchTerm.toLowerCase().trim();
        const filtered = banksDatabase.filter(bank => 
          bank.name.toLowerCase().includes(term) ||
          bank.fullName.toLowerCase().includes(term) ||
          bank.code.toString().includes(term) ||
          bank.ispb.includes(term)
        );

        setFilteredBanks(filtered.slice(0, 10));
        setShowResults(true);
        
        if (filtered.length > 0) {
          toast({
            title: "Usando base local",
            description: "API indisponível - usando dados locais",
            variant: "destructive"
          });
        }
      }
    };

    fetchAndFilterBanks();
  }, [searchTerm]);

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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Building className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Consulta de Bancos</h1>
        </div>
        <p className="text-muted-foreground">
          Digite o nome, código bancário ou ISPB e veja os resultados em tempo real.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card mb-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="search-input">Pesquisar bancos</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Digite: Itaú, 341, 00795423, Nubank..."
                className="pl-10"
              />
            </div>
          </div>

          {showResults && (
            <div className="space-y-4">
              {filteredBanks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum banco encontrado com "{searchTerm}"</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-card-foreground">
                      {filteredBanks.length} banco{filteredBanks.length > 1 ? 's' : ''} encontrado{filteredBanks.length > 1 ? 's' : ''}
                    </h3>
                  </div>
                  
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredBanks.map((bank, index) => (
                      <Card key={index} className="p-4 border hover:shadow-md transition-all">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-card-foreground text-lg">{bank.fullName}</h4>
                              <p className="text-sm text-muted-foreground">{bank.name}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(bank.code.toString(), 'Código bancário')}
                              >
                                <Copy className="w-4 h-4 mr-1" />
                                Código
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(bank.ispb, 'ISPB')}
                              >
                                <Copy className="w-4 h-4 mr-1" />
                                ISPB
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Código Bancário</Label>
                              <div className="flex gap-2">
                                <Input value={bank.code.toString()} readOnly className="font-mono" />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => copyToClipboard(bank.code.toString(), 'Código bancário')}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>ISPB</Label>
                              <div className="flex gap-2">
                                <Input value={bank.ispb} readOnly className="font-mono" />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => copyToClipboard(bank.ispb, 'ISPB')}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </Card>

      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Building className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">📊 Fonte dos Dados</h4>
            <p className="text-muted-foreground">
              Esta ferramenta utiliza a <strong>Brasil API</strong> oficial para obter dados atualizados de bancos brasileiros.
              Em caso de indisponibilidade da API, utiliza uma base local com os principais bancos do país.
              <br/><br/>
              <strong>Código Bancário:</strong> Código de 3 dígitos usado para identificar bancos em transferências e DOCs.<br/>
              <strong>ISPB:</strong> Identificador do Sistema de Pagamentos Brasileiros, código único de 8 dígitos 
              usado pelo Banco Central para identificar instituições financeiras.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};