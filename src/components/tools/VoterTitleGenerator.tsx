import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const brazilianStates = [
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' }
];

export const VoterTitleGenerator = () => {
  const [selectedState, setSelectedState] = useState('SP');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const generateVoterTitle = (): string => {
    // Gerar 8 primeiros dígitos aleatórios
    const firstEight = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
    
    // Os dois últimos dígitos são dígitos verificadores
    const firstDigit = calculateFirstDigit(firstEight);
    const secondDigit = calculateSecondDigit(firstEight + firstDigit);
    
    return firstEight + firstDigit + secondDigit;
  };

  const calculateFirstDigit = (numbers: string): string => {
    const weights = [2, 3, 4, 5, 6, 7, 8, 9];
    let sum = 0;
    
    for (let i = 0; i < 8; i++) {
      sum += parseInt(numbers[i]) * weights[i];
    }
    
    const remainder = sum % 11;
    if (remainder < 2) {
      return '0';
    } else {
      return (11 - remainder).toString();
    }
  };

  const calculateSecondDigit = (numbers: string): string => {
    const weights = [7, 8, 9, 2, 3, 4, 5, 6, 7, 8, 9];
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * weights[i];
    }
    
    const remainder = sum % 11;
    if (remainder < 2) {
      return '0';
    } else {
      return (11 - remainder).toString();
    }
  };

  const formatVoterTitle = (title: string): string => {
    // Formato: XXXX XXXX XXXX
    return title.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
  };

  const handleGenerate = () => {
    const title = generateVoterTitle();
    const formatted = formatVoterTitle(title);
    setResult(formatted);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copiado!",
      description: "Título de eleitor copiado para a área de transferência.",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Gerador de Título de Eleitor
          </CardTitle>
          <CardDescription className="text-center">
            Gerador de Título de Eleitor Válido
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <div>
              <Label htmlFor="state" className="text-sm font-medium">
                Opções:
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Qual estado? (para os documentos estaduais e endereço)
              </p>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-center">
              <Button 
                onClick={handleGenerate}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Gerar Título de Eleitor
              </Button>
            </div>
          </div>

          {result && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Resposta:</Label>
              <div className="relative">
                <Textarea
                  value={result}
                  readOnly
                  className="min-h-[100px] bg-green-50 border-green-200 text-green-800"
                />
                <Button
                  onClick={copyToClipboard}
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                  variant="ghost"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>IMPORTANTE:</strong> Nosso gerador online de Título de Eleitor tem como intenção ajudar estudantes, 
              programadores, analistas e testadores a gerar Título de Eleitor válidos, normalmente necessários para testar 
              seus softwares em desenvolvimento.
            </p>
            <p>
              A má utilização dos dados aqui gerados é de total responsabilidade do usuário.
            </p>
            <p>
              Os números são gerados de forma aleatória, respeitando as regras de criação de cada documento.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};