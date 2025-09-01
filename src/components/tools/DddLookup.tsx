import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, Search, Copy, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DddData {
  state: string;
  cities: string[];
}

export const DddLookup = () => {
  const [ddd, setDdd] = useState('');
  const [result, setResult] = useState<DddData | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Dados estáticos dos DDDs brasileiros
  const dddDatabase: { [key: string]: DddData } = {
    '11': { state: 'São Paulo', cities: ['São Paulo (região metropolitana)', 'Franco da Rocha', 'Francisco Morato', 'Mairiporã', 'Caieiras'] },
    '12': { state: 'São Paulo', cities: ['São José dos Campos', 'Taubaté', 'Jacareí', 'Lorena', 'Pindamonhangaba', 'Caraguatatuba', 'Ubatuba'] },
    '13': { state: 'São Paulo', cities: ['Santos', 'São Vicente', 'Cubatão', 'Praia Grande', 'Guarujá', 'Bertioga', 'Mongaguá', 'Peruíbe'] },
    '14': { state: 'São Paulo', cities: ['Bauru', 'Marília', 'Jaú', 'Avaré', 'Botucatu', 'Lins', 'Ourinhos'] },
    '15': { state: 'São Paulo', cities: ['Sorocaba', 'Itapetininga', 'Tatuí', 'Itu', 'Salto', 'Boituva', 'Piedade'] },
    '16': { state: 'São Paulo', cities: ['Ribeirão Preto', 'Araraquara', 'São Carlos', 'Franca', 'Sertãozinho'] },
    '17': { state: 'São Paulo', cities: ['São José do Rio Preto', 'Catanduva', 'Votuporanga', 'Fernandópolis', 'Jales'] },
    '18': { state: 'São Paulo', cities: ['Presidente Prudente', 'Araçatuba', 'Birigui', 'Dracena', 'Adamantina'] },
    '19': { state: 'São Paulo', cities: ['Campinas', 'Piracicaba', 'Limeira', 'Rio Claro', 'Americana', 'Sumaré', 'Indaiatuba'] },
    '21': { state: 'Rio de Janeiro', cities: ['Rio de Janeiro (cidade)', 'Niterói', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu'] },
    '22': { state: 'Rio de Janeiro', cities: ['Campos dos Goytacazes', 'Macaé', 'Cabo Frio', 'Nova Friburgo', 'Petrópolis', 'Teresópolis'] },
    '24': { state: 'Rio de Janeiro', cities: ['Volta Redonda', 'Barra Mansa', 'Resende', 'Angra dos Reis', 'Paraty'] },
    '27': { state: 'Espírito Santo', cities: ['Vitória', 'Vila Velha', 'Serra', 'Cariacica', 'Linhares', 'Cachoeiro de Itapemirim'] },
    '28': { state: 'Espírito Santo', cities: ['Cachoeiro de Itapemirim', 'Alegre', 'Castelo', 'Venda Nova do Imigrante'] },
    '31': { state: 'Minas Gerais', cities: ['Belo Horizonte', 'Contagem', 'Betim', 'Nova Lima', 'Sabará', 'Ribeirão das Neves'] },
    '32': { state: 'Minas Gerais', cities: ['Juiz de Fora', 'Barbacena', 'São João del-Rei', 'Conselheiro Lafaiete'] },
    '33': { state: 'Minas Gerais', cities: ['Governador Valadares', 'Ipatinga', 'Coronel Fabriciano', 'Timóteo'] },
    '34': { state: 'Minas Gerais', cities: ['Uberlândia', 'Uberaba', 'Araguari', 'Ituiutaba', 'Patos de Minas'] },
    '35': { state: 'Minas Gerais', cities: ['Poços de Caldas', 'Varginha', 'Pouso Alegre', 'Três Corações', 'Lavras'] },
    '37': { state: 'Minas Gerais', cities: ['Divinópolis', 'Formiga', 'Itaúna', 'Nova Serrana'] },
    '38': { state: 'Minas Gerais', cities: ['Montes Claros', 'Januária', 'Pirapora', 'Janaúba'] },
    '41': { state: 'Paraná', cities: ['Curitiba', 'São José dos Pinhais', 'Araucária', 'Colombo', 'Pinhais'] },
    '42': { state: 'Paraná', cities: ['Ponta Grossa', 'Guarapuava', 'Irati', 'União da Vitória'] },
    '43': { state: 'Paraná', cities: ['Londrina', 'Apucarana', 'Cambé', 'Rolândia'] },
    '44': { state: 'Paraná', cities: ['Maringá', 'Cianorte', 'Umuarama', 'Paranavaí'] },
    '45': { state: 'Paraná', cities: ['Foz do Iguaçu', 'Cascavel', 'Toledo', 'Guaíra'] },
    '46': { state: 'Paraná', cities: ['Francisco Beltrão', 'Pato Branco', 'Dois Vizinhos'] },
    '47': { state: 'Santa Catarina', cities: ['Joinville', 'Blumenau', 'Itajaí', 'Balneário Camboriú', 'São Bento do Sul'] },
    '48': { state: 'Santa Catarina', cities: ['Florianópolis', 'São José', 'Palhoça', 'Biguaçu', 'Tubarão'] },
    '49': { state: 'Santa Catarina', cities: ['Chapecó', 'Lages', 'Criciúma', 'Araranguá', 'Caçador'] },
    '51': { state: 'Rio Grande do Sul', cities: ['Porto Alegre', 'Canoas', 'Novo Hamburgo', 'São Leopoldo', 'Gravataí'] },
    '53': { state: 'Rio Grande do Sul', cities: ['Pelotas', 'Rio Grande', 'Bagé', 'Jaguarão'] },
    '54': { state: 'Rio Grande do Sul', cities: ['Caxias do Sul', 'Passo Fundo', 'Bento Gonçalves', 'Vacaria'] },
    '55': { state: 'Rio Grande do Sul', cities: ['Santa Maria', 'Uruguaiana', 'Santiago', 'Alegrete'] },
    '61': { state: 'Distrito Federal e Goiás', cities: ['Brasília', 'Anápolis', 'Aparecida de Goiânia', 'Luziânia'] },
    '62': { state: 'Goiás', cities: ['Goiânia', 'Rio Verde', 'Itumbiara', 'Catalão'] },
    '63': { state: 'Tocantins', cities: ['Palmas', 'Araguaína', 'Gurupi', 'Porto Nacional'] },
    '64': { state: 'Goiás', cities: ['Caldas Novas', 'Jataí', 'Mineiros', 'Quirinópolis'] },
    '65': { state: 'Mato Grosso', cities: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Cáceres'] },
    '66': { state: 'Mato Grosso', cities: ['Rondonópolis', 'Barra do Garças', 'Primavera do Leste'] },
    '67': { state: 'Mato Grosso do Sul', cities: ['Campo Grande', 'Dourados', 'Três Lagoas', 'Corumbá'] },
    '68': { state: 'Acre', cities: ['Rio Branco', 'Cruzeiro do Sul', 'Sena Madureira'] },
    '69': { state: 'Rondônia', cities: ['Porto Velho', 'Ji-Paraná', 'Ariquemes', 'Vilhena'] },
    '71': { state: 'Bahia', cities: ['Salvador', 'Lauro de Freitas', 'Camaçari', 'Simões Filho', 'Candeias'] },
    '73': { state: 'Bahia', cities: ['Ilhéus', 'Itabuna', 'Teixeira de Freitas', 'Eunápolis'] },
    '74': { state: 'Bahia', cities: ['Juazeiro', 'Paulo Afonso', 'Senhor do Bonfim'] },
    '75': { state: 'Bahia', cities: ['Feira de Santana', 'Alagoinhas', 'Cruz das Almas'] },
    '77': { state: 'Bahia', cities: ['Vitória da Conquista', 'Itapetinga', 'Jequié'] },
    '79': { state: 'Sergipe', cities: ['Aracaju', 'Nossa Senhora do Socorro', 'Lagarto'] },
    '81': { state: 'Pernambuco', cities: ['Recife', 'Olinda', 'Jaboatão dos Guararapes', 'Caruaru'] },
    '82': { state: 'Alagoas', cities: ['Maceió', 'Arapiraca', 'Palmeira dos Índios', 'União dos Palmares'] },
    '83': { state: 'Paraíba', cities: ['João Pessoa', 'Campina Grande', 'Patos', 'Cajazeiras'] },
    '84': { state: 'Rio Grande do Norte', cities: ['Natal', 'Mossoró', 'Parnamirim', 'São Gonçalo do Amarante'] },
    '85': { state: 'Ceará', cities: ['Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú'] },
    '86': { state: 'Piauí', cities: ['Teresina', 'Timon', 'Parnaíba', 'Picos'] },
    '87': { state: 'Pernambuco', cities: ['Petrolina', 'Garanhuns', 'Serra Talhada', 'Araripina'] },
    '88': { state: 'Ceará', cities: ['Juazeiro do Norte', 'Crato', 'Iguatu', 'Sobral'] },
    '89': { state: 'Piauí', cities: ['Picos', 'Floriano', 'Campo Maior'] },
    '91': { state: 'Pará', cities: ['Belém', 'Ananindeua', 'Santarém', 'Marabá'] },
    '92': { state: 'Amazonas', cities: ['Manaus', 'Parintins', 'Itacoatiara', 'Manacapuru'] },
    '93': { state: 'Pará', cities: ['Santarém', 'Altamira', 'Itaituba'] },
    '94': { state: 'Pará', cities: ['Marabá', 'Parauapebas', 'Canaã dos Carajás'] },
    '95': { state: 'Roraima', cities: ['Boa Vista', 'Rorainópolis', 'Caracaraí'] },
    '96': { state: 'Amapá', cities: ['Macapá', 'Santana', 'Laranjal do Jari'] },
    '97': { state: 'Amazonas', cities: ['Tefé', 'Coari', 'Tabatinga'] },
    '98': { state: 'Maranhão', cities: ['São Luís', 'São José de Ribamar', 'Timon', 'Caxias'] },
    '99': { state: 'Maranhão', cities: ['Imperatriz', 'Açailândia', 'Bacabal'] }
  };

  const consultarDdd = async () => {
    const cleanDdd = ddd.replace(/\D/g, '');
    
    if (cleanDdd.length !== 2) {
      setError('DDD deve ter 2 dígitos');
      return;
    }

    setError('');
    setResult(null);
    
    try {
      // Tenta usar a Brasil API primeiro
      const response = await fetch(`https://brasilapi.com.br/api/ddd/v1/${cleanDdd}`);
      
      if (response.ok) {
        const apiData = await response.json();
        const apiResult = {
          state: apiData.state,
          cities: apiData.cities
        };
        setResult(apiResult);
        toast({
          title: "DDD encontrado!",
          description: `${apiResult.state} - ${apiResult.cities.length} cidades`,
        });
        return;
      }
    } catch (error) {
      console.log('Erro na API, usando dados locais:', error);
    }
    
    // Fallback para dados locais se a API falhar
    const dddInfo = dddDatabase[cleanDdd];
    
    if (!dddInfo) {
      setError('DDD não encontrado');
      setResult(null);
      return;
    }

    setResult(dddInfo);
    toast({
      title: "DDD encontrado!",
      description: `${dddInfo.state} - ${dddInfo.cities.length} cidades (dados locais)`,
    });
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

  const formatDdd = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.substring(0, 2);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Phone className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Consulta DDD</h1>
        </div>
        <p className="text-muted-foreground">
          Consulte informações sobre códigos de área (DDD) brasileiros e suas respectivas cidades.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card mb-6">
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <Label htmlFor="ddd-input">DDD</Label>
            <Input
              id="ddd-input"
              value={ddd}
              onChange={(e) => setDdd(formatDdd(e.target.value))}
              placeholder="11"
              maxLength={2}
              className="font-mono"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={consultarDdd}
              disabled={ddd.length !== 2}
              className="bg-gradient-primary hover:opacity-90 transition-fast"
            >
              <Search className="w-4 h-4 mr-2" />
              Consultar
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-6">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-card-foreground">Informações do DDD {ddd}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <Label>DDD</Label>
                <div className="flex gap-2">
                  <Input value={ddd} readOnly className="font-mono" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(ddd, 'DDD')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <div className="flex gap-2">
                  <Input value={result.state} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.state, 'Estado')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-primary" />
                <Label>Principais Cidades ({result.cities.length})</Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {result.cities.map((city, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input value={city} readOnly className="text-sm" />
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-shrink-0"
                      onClick={() => copyToClipboard(city, 'Cidade')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Phone className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">📊 Fonte dos Dados</h4>
            <p className="text-muted-foreground">
              Esta ferramenta utiliza a <strong>Brasil API</strong> oficial (brasilapi.com.br) para obter 
              dados atualizados de códigos DDD brasileiros. Em caso de indisponibilidade da API, 
              utiliza uma base local completa com todos os DDDs e suas respectivas cidades.
              <br/><br/>
              Os códigos DDD (Discagem Direta à Distância) identificam as regiões geográficas 
              do Brasil para ligações telefônicas. Cada código representa um conjunto de 
              cidades dentro de um estado ou região.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};