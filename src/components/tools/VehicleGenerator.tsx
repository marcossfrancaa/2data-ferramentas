import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Car, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const estadosBrasil = [
  { sigla: 'AC', nome: 'Acre' }, { sigla: 'AL', nome: 'Alagoas' }, { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' }, { sigla: 'BA', nome: 'Bahia' }, { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' }, { sigla: 'ES', nome: 'Espírito Santo' }, 
  { sigla: 'GO', nome: 'Goiás' }, { sigla: 'MA', nome: 'Maranhão' }, { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' }, { sigla: 'MG', nome: 'Minas Gerais' }, 
  { sigla: 'PA', nome: 'Pará' }, { sigla: 'PB', nome: 'Paraíba' }, { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' }, { sigla: 'PI', nome: 'Piauí' }, { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' }, { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' }, { sigla: 'RR', nome: 'Roraima' }, { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'SE', nome: 'Sergipe' }, { sigla: 'TO', nome: 'Tocantins' }
];

const marcasVeiculos = [
  'Chevrolet', 'Volkswagen', 'Fiat', 'Ford', 'Toyota', 'Honda', 'Hyundai', 'Nissan', 
  'Renault', 'Peugeot', 'Citroën', 'Mitsubishi', 'Jeep', 'BMW', 'Mercedes-Benz', 'Audi'
];

const modelosPorMarca = {
  'Chevrolet': ['Onix', 'Prisma', 'Cruze', 'Tracker', 'S10', 'Spin', 'Cobalt', 'Agile'],
  'Volkswagen': ['Gol', 'Fox', 'Polo', 'Virtus', 'T-Cross', 'Tiguan', 'Amarok', 'Up'],
  'Fiat': ['Uno', 'Argo', 'Cronos', 'Mobi', 'Toro', 'Strada', 'Pulse', 'Fastback'],
  'Ford': ['Ka', 'Fiesta', 'Focus', 'EcoSport', 'Fusion', 'Ranger', 'Territory', 'Maverick'],
  'Toyota': ['Etios', 'Yaris', 'Corolla', 'RAV4', 'Hilux', 'SW4', 'Prius', 'Camry'],
  'Honda': ['Fit', 'City', 'Civic', 'HR-V', 'CR-V', 'WR-V', 'Accord', 'Ridgeline']
};

const coresVeiculos = [
  'Branco', 'Prata', 'Preto', 'Cinza', 'Vermelho', 'Azul', 'Verde', 'Amarelo', 
  'Marrom', 'Dourado', 'Roxo', 'Laranja', 'Rosa', 'Bege'
];

interface DadosVeiculo {
  marca: string;
  modelo: string;
  ano: string;
  renavam: string;
  placa: string;
  cor: string;
}

export const VehicleGenerator = () => {
  const [estado, setEstado] = useState('');
  const [marcaEscolhida, setMarcaEscolhida] = useState('');
  const [comPontuacao, setComPontuacao] = useState(true);
  const [veiculo, setVeiculo] = useState<DadosVeiculo | null>(null);
  const { toast } = useToast();

  const generateRenavam = () => {
    return Math.floor(Math.random() * 999999999) + 100000000;
  };

  const generatePlaca = (estado: string, comPontuacao: boolean) => {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    
    let placa = '';
    
    // Formato Mercosul (padrão atual)
    // 3 letras + 1 número + 1 letra + 2 números
    for (let i = 0; i < 3; i++) {
      placa += letras[Math.floor(Math.random() * letras.length)];
    }
    
    placa += numeros[Math.floor(Math.random() * 10)];
    placa += letras[Math.floor(Math.random() * letras.length)];
    
    for (let i = 0; i < 2; i++) {
      placa += numeros[Math.floor(Math.random() * 10)];
    }
    
    if (comPontuacao) {
      return `${placa.slice(0, 3)}-${placa.slice(3)}`;
    }
    
    return placa;
  };

  const generateVehicle = () => {
    if (!estado) {
      toast({
        title: "Erro",
        description: "Selecione um estado primeiro",
        variant: "destructive",
      });
      return;
    }

    const marca = marcaEscolhida || marcasVeiculos[Math.floor(Math.random() * marcasVeiculos.length)];
    const modelos = modelosPorMarca[marca as keyof typeof modelosPorMarca] || ['Sedan', 'Hatch', 'SUV'];
    const modelo = modelos[Math.floor(Math.random() * modelos.length)];
    const ano = (2015 + Math.floor(Math.random() * 10)).toString();
    const renavam = generateRenavam().toString();
    const placa = generatePlaca(estado, comPontuacao);
    const cor = coresVeiculos[Math.floor(Math.random() * coresVeiculos.length)];

    setVeiculo({
      marca,
      modelo,
      ano,
      renavam,
      placa,
      cor
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Dados copiados para a área de transferência",
    });
  };

  const copyAllData = () => {
    if (!veiculo) return;
    
    const dados = `Marca: ${veiculo.marca}
Modelo: ${veiculo.modelo}
Ano: ${veiculo.ano}
RENAVAM: ${veiculo.renavam}
Placa: ${veiculo.placa}
Cor: ${veiculo.cor}`;
    
    copyToClipboard(dados);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Car className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador Online de Veículos</h1>
        </div>
        <p className="text-muted-foreground">
          Utilize nosso gerador de VEÍCULOS, basta clicar em "Gerar Veículo" e um novo carro válido será gerado.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Opções da ferramenta:
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="estado">Qual Estado? (obrigatório)</Label>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {estadosBrasil.map((est) => (
                    <SelectItem key={est.sigla} value={est.sigla}>
                      {est.nome} ({est.sigla})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="marca">Marca do Veículo? (opcional)</Label>
              <Select value={marcaEscolhida} onValueChange={setMarcaEscolhida}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {marcasVeiculos.map((marca) => (
                    <SelectItem key={marca} value={marca}>
                      {marca}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pontuacao">Gerar com pontuação?</Label>
                <p className="text-sm text-muted-foreground">Sim</p>
              </div>
              <Switch
                id="pontuacao"
                checked={comPontuacao}
                onCheckedChange={setComPontuacao}
              />
            </div>
          </div>

          <Button
            onClick={generateVehicle}
            disabled={!estado}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Gerar Veículo
          </Button>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              DADOS PESSOAIS:
            </h3>
            {veiculo && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyAllData}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Todos
              </Button>
            )}
          </div>
          
          {veiculo ? (
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="font-semibold">Marca:</Label>
                <div className="col-span-2">
                  <Input value={veiculo.marca} readOnly className="bg-green-50" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(veiculo.marca)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="font-semibold">Modelo:</Label>
                <div className="col-span-2">
                  <Input value={veiculo.modelo} readOnly className="bg-green-50" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(veiculo.modelo)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="font-semibold">Ano:</Label>
                <div className="col-span-2">
                  <Input value={veiculo.ano} readOnly className="bg-green-50" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(veiculo.ano)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="font-semibold">RENAVAM:</Label>
                <div className="col-span-2">
                  <Input value={veiculo.renavam} readOnly className="bg-green-50" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(veiculo.renavam)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="font-semibold">Placa:</Label>
                <div className="col-span-2">
                  <Input value={veiculo.placa} readOnly className="bg-green-50" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(veiculo.placa)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-2 items-center">
                <Label className="font-semibold">Cor:</Label>
                <div className="col-span-2">
                  <Input value={veiculo.cor} readOnly className="bg-green-50" />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(veiculo.cor)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12 border-2 border-dashed border-muted rounded-lg">
              <Car className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Clique em "Gerar Veículo" para criar dados do veículo</p>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <Car className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-yellow-800 mb-1">IMPORTANTE:</h4>
            <p className="text-yellow-700">
              Nosso gerador online de Veículos tem como intenção ajudar estudantes, programadores, 
              analistas e testadores a gerar Veículos com documentos válidos, normalmente necessários 
              para testar seus softwares em desenvolvimento.
            </p>
            <p className="text-yellow-700 mt-2">
              A má utilização dos dados aqui gerados é de total responsabilidade do usuário.
            </p>
            <p className="text-yellow-700 mt-2">
              Os números são gerados de forma aleatória, respeitando as regras de criação de cada documento.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};