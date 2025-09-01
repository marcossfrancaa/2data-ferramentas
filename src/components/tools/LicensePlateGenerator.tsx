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

export const LicensePlateGenerator = () => {
  const [comPontuacao, setComPontuacao] = useState(true);
  const [estadoOrigem, setEstadoOrigem] = useState('');
  const [placaGerada, setPlacaGerada] = useState('');
  const { toast } = useToast();

  const generatePlate = () => {
    if (!estadoOrigem) {
      toast({
        title: "Erro",
        description: "Selecione o estado de origem da placa",
        variant: "destructive",
      });
      return;
    }

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
      placa = `${placa.slice(0, 3)}-${placa.slice(3)}`;
    }
    
    setPlacaGerada(placa);
  };

  const copyToClipboard = () => {
    if (!placaGerada) return;
    
    navigator.clipboard.writeText(placaGerada);
    toast({
      title: "Copiado!",
      description: "Placa copiada para a área de transferência",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Car className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador Online de Placas de Automóveis</h1>
        </div>
        <p className="text-muted-foreground">
          Utilize nosso gerador de placas de automóveis, basta clicar em "Gerar Placa" e pronto! 
          Uma nova placa de carro válida será gerada. Você ainda tem opção de selecionar o estado 
          e colocar ou não os "pontos" entre os números.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Opções da ferramenta:
          </h3>
          
          <div className="space-y-4">
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

            <div>
              <Label htmlFor="estado">Estado de Origem da Placa:</Label>
              <Select value={estadoOrigem} onValueChange={setEstadoOrigem}>
                <SelectTrigger>
                  <SelectValue placeholder="Indiferente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indiferente">Indiferente</SelectItem>
                  {estadosBrasil.map((estado) => (
                    <SelectItem key={estado.sigla} value={estado.sigla}>
                      {estado.nome} ({estado.sigla})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generatePlate}
            disabled={!estadoOrigem}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Gerar Placa
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Placa de Veículo Gerada:
          </h3>
          
          {placaGerada ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="mb-4">
                <div className="bg-white border-2 border-gray-800 rounded-lg p-4 inline-block font-mono text-2xl font-bold text-gray-800 tracking-widest">
                  {placaGerada}
                </div>
              </div>
              <div className="text-sm text-green-700 mb-4">
                Estado: {estadoOrigem === 'indiferente' ? 'Qualquer Estado' : 
                        estadosBrasil.find(e => e.sigla === estadoOrigem)?.nome || estadoOrigem}
              </div>
              <Button
                onClick={copyToClipboard}
                variant="outline"
                className="text-green-700 border-green-300 hover:bg-green-100"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Placa
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12 border-2 border-dashed border-muted rounded-lg">
              <Car className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Clique em "Gerar Placa" para criar uma placa válida</p>
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
              Nosso gerador online de Placas de Automóveis tem como intenção ajudar estudantes, 
              programadores, analistas e testadores a gerar Placas válidas, normalmente necessárias 
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

      <Card className="mt-4 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Car className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre as Placas Mercosul</h4>
            <p className="text-muted-foreground">
              As placas no padrão Mercosul seguem o formato ABC1D23, onde A, B, C e D são letras 
              e 1, 2, 3 são números. Este padrão foi implementado no Brasil a partir de 2018 
              e permite maior controle e segurança nos documentos veiculares.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};