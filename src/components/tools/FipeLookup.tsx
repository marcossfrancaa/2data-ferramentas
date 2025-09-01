import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Car, Search, Copy, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FipeData {
  Valor: string;
  Marca: string;
  Modelo: string;
  AnoModelo: number;
  Combustivel: string;
  CodigoFipe: string;
  MesReferencia: string;
  Autenticacao: string;
  TipoVeiculo: number;
  SiglaCombustivel: string;
}

interface Brand {
  codigo: string;
  nome: string;
}

interface Model {
  codigo: number;
  nome: string;
}

interface Year {
  codigo: string;
  nome: string;
}

export const FipeLookup = () => {
  const [vehicleType, setVehicleType] = useState('1'); // 1=carro, 2=moto, 3=caminhão
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [years, setYears] = useState<Year[]>([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingYears, setLoadingYears] = useState(false);
  
  const [result, setResult] = useState<FipeData | null>(null);
  const [error, setError] = useState('');
  
  const { toast } = useToast();

  const vehicleTypes = [
    { value: '1', label: 'Carros' },
    { value: '2', label: 'Motos' },
    { value: '3', label: 'Caminhões' }
  ];

  const loadBrands = async (type: string) => {
    setLoadingBrands(true);
    setSelectedBrand('');
    setSelectedModel('');
    setSelectedYear('');
    setModels([]);
    setYears([]);
    setResult(null);
    
    try {
      const response = await fetch(`https://parallelum.com.br/fipe/api/v1/${type === '1' ? 'carros' : type === '2' ? 'motos' : 'caminhoes'}/marcas`);
      const data = await response.json();
      setBrands(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar as marcas",
        variant: "destructive",
      });
    } finally {
      setLoadingBrands(false);
    }
  };

  const loadModels = async (brandCode: string) => {
    setLoadingModels(true);
    setSelectedModel('');
    setSelectedYear('');
    setYears([]);
    setResult(null);
    
    try {
      const vehicleTypeStr = vehicleType === '1' ? 'carros' : vehicleType === '2' ? 'motos' : 'caminhoes';
      const response = await fetch(`https://parallelum.com.br/fipe/api/v1/${vehicleTypeStr}/marcas/${brandCode}/modelos`);
      const data = await response.json();
      setModels(data.modelos);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os modelos",
        variant: "destructive",
      });
    } finally {
      setLoadingModels(false);
    }
  };

  const loadYears = async (modelCode: string) => {
    setLoadingYears(true);
    setSelectedYear('');
    setResult(null);
    
    try {
      const vehicleTypeStr = vehicleType === '1' ? 'carros' : vehicleType === '2' ? 'motos' : 'caminhoes';
      const response = await fetch(`https://parallelum.com.br/fipe/api/v1/${vehicleTypeStr}/marcas/${selectedBrand}/modelos/${modelCode}/anos`);
      const data = await response.json();
      setYears(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os anos",
        variant: "destructive",
      });
    } finally {
      setLoadingYears(false);
    }
  };

  const consultarFipe = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const vehicleTypeStr = vehicleType === '1' ? 'carros' : vehicleType === '2' ? 'motos' : 'caminhoes';
      const response = await fetch(`https://parallelum.com.br/fipe/api/v1/${vehicleTypeStr}/marcas/${selectedBrand}/modelos/${selectedModel}/anos/${selectedYear}`);
      const data = await response.json();

      if (data.erro) {
        setError('Dados não encontrados na tabela FIPE');
        return;
      }

      setResult(data);
      toast({
        title: "Valor FIPE encontrado!",
        description: `${data.Marca} ${data.Modelo} (${data.AnoModelo}) - ${data.Valor}`,
      });
    } catch (error) {
      setError('Erro ao consultar tabela FIPE. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível consultar a tabela FIPE",
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Car className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Consulta Tabela FIPE</h1>
        </div>
        <p className="text-muted-foreground">
          Consulte o valor de mercado de carros, motos e caminhões segundo a tabela FIPE oficial.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card mb-6">
        <div className="space-y-4 mb-6">
          <div>
            <Label>Tipo de Veículo</Label>
            <Select value={vehicleType} onValueChange={(value) => {
              setVehicleType(value);
              loadBrands(value);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de veículo" />
              </SelectTrigger>
              <SelectContent>
                {vehicleTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Marca</Label>
            <Select 
              value={selectedBrand} 
              onValueChange={(value) => {
                setSelectedBrand(value);
                loadModels(value);
              }}
              disabled={loadingBrands || brands.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingBrands ? "Carregando marcas..." : "Selecione a marca"} />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.codigo} value={brand.codigo}>
                    {brand.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Modelo</Label>
            <Select 
              value={selectedModel} 
              onValueChange={(value) => {
                setSelectedModel(value);
                loadYears(value);
              }}
              disabled={loadingModels || models.length === 0 || !selectedBrand}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingModels ? "Carregando modelos..." : "Selecione o modelo"} />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model.codigo} value={model.codigo.toString()}>
                    {model.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Ano</Label>
            <Select 
              value={selectedYear} 
              onValueChange={setSelectedYear}
              disabled={loadingYears || years.length === 0 || !selectedModel}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingYears ? "Carregando anos..." : "Selecione o ano"} />
              </SelectTrigger>
              <SelectContent>
                {years.filter(year => year.codigo !== '3200-0').map((year) => (
                  <SelectItem key={year.codigo} value={year.codigo}>
                    {year.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={consultarFipe}
          disabled={loading || !selectedYear}
          className="w-full bg-gradient-primary hover:opacity-90 transition-fast"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Consultando...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Consultar Valor FIPE
            </>
          )}
        </Button>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mt-6">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-card-foreground">Valor FIPE</h3>
              <div className="text-2xl font-bold text-primary">{result.Valor}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Marca</Label>
                <div className="flex gap-2">
                  <Input value={result.Marca} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.Marca, 'Marca')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Modelo</Label>
                <div className="flex gap-2">
                  <Input value={result.Modelo} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.Modelo, 'Modelo')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ano</Label>
                <div className="flex gap-2">
                  <Input value={result.AnoModelo.toString()} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.AnoModelo.toString(), 'Ano')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Combustível</Label>
                <div className="flex gap-2">
                  <Input value={result.Combustivel} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.Combustivel, 'Combustível')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Código FIPE</Label>
                <div className="flex gap-2">
                  <Input value={result.CodigoFipe} readOnly className="font-mono" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.CodigoFipe, 'Código FIPE')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mês de Referência</Label>
                <Input value={result.MesReferencia} readOnly />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(result.Valor, 'Valor FIPE')}
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Valor
              </Button>
              <Button
                variant="outline"
                onClick={() => copyToClipboard(`${result.Marca} ${result.Modelo} ${result.AnoModelo} ${result.Combustivel} - ${result.Valor} (FIPE ${result.MesReferencia})`, 'Informações completas')}
                className="flex-1"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Tudo
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Car className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre a Tabela FIPE</h4>
            <p className="text-muted-foreground">
              A Tabela FIPE é um referencial de preços médios de veículos no mercado nacional, 
              atualizada mensalmente pela Fundação Instituto de Pesquisas Econômicas (FIPE). 
              É amplamente utilizada por seguradoras, bancos e revendedores.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};