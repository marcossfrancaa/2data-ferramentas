import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const states = [
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

export const StateRegistrationGenerator = () => {
  const [selectedState, setSelectedState] = useState('SP');
  const [withPunctuation, setWithPunctuation] = useState('sim');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const calculateDigit = (numbers: string, weights: number[]): number => {
    const sum = numbers.split('').reduce((acc, digit, index) => {
      return acc + (parseInt(digit) * weights[index]);
    }, 0);
    
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const generateStateRegistration = (state: string): string => {
    let registration = '';
    
    switch (state) {
      case 'SP':
        // São Paulo - 12 dígitos
        const spBase = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
        const spWeights1 = [1, 3, 4, 5, 6, 7, 8, 10];
        const spDigit1 = calculateDigit(spBase, spWeights1);
        const spWeights2 = [3, 2, 10, 9, 8, 7, 6, 5, 4, 3, 2];
        const spDigit2 = calculateDigit(spBase + spDigit1, spWeights2);
        registration = spBase + spDigit1 + spDigit2 + '146';
        break;
        
      case 'RJ':
        // Rio de Janeiro - 8 dígitos
        const rjBase = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        const rjWeights = [2, 7, 6, 5, 4, 3, 2];
        const rjDigit = calculateDigit(rjBase, rjWeights);
        registration = rjBase + rjDigit;
        break;
        
      case 'MG':
        // Minas Gerais - 13 dígitos
        const mgBase = Math.floor(Math.random() * 100000000000).toString().padStart(11, '0');
        const mgWeights1 = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1];
        let mgSum1 = 0;
        for (let i = 0; i < mgBase.length; i++) {
          let product = parseInt(mgBase[i]) * mgWeights1[i];
          if (product > 9) product = Math.floor(product / 10) + (product % 10);
          mgSum1 += product;
        }
        const mgDigit1 = ((Math.floor(mgSum1 / 10) + 1) * 10 - mgSum1) % 10;
        
        const mgWeights2 = [3, 2, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
        const mgDigit2 = calculateDigit(mgBase + mgDigit1, mgWeights2);
        registration = mgBase + mgDigit1 + mgDigit2;
        break;
        
      case 'RS':
        // Rio Grande do Sul - 10 dígitos
        const rsBase = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
        const rsWeights = [2, 9, 8, 7, 6, 5, 4, 3, 2];
        const rsDigit = calculateDigit(rsBase, rsWeights);
        registration = rsBase + rsDigit;
        break;
        
      case 'PR':
        // Paraná - 10 dígitos
        const prBase = Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
        const prWeights1 = [3, 2, 7, 6, 5, 4, 3, 2];
        const prDigit1 = calculateDigit(prBase, prWeights1);
        const prWeights2 = [4, 3, 2, 7, 6, 5, 4, 3, 2];
        const prDigit2 = calculateDigit(prBase + prDigit1, prWeights2);
        registration = prBase + prDigit1 + prDigit2;
        break;
        
      default:
        // Geração genérica para outros estados
        const genericLength = Math.random() > 0.5 ? 9 : 12;
        registration = Math.floor(Math.random() * Math.pow(10, genericLength)).toString().padStart(genericLength, '0');
        break;
    }
    
    return registration;
  };

  const formatRegistration = (registration: string, state: string): string => {
    if (withPunctuation === 'nao') return registration;
    
    switch (state) {
      case 'SP':
        return registration.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1.$2.$3.$4');
      case 'RJ':
        return registration.replace(/(\d{2})(\d{3})(\d{2})/, '$1.$2-$3');
      case 'MG':
        return registration.replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3/$4');
      case 'RS':
        return registration.replace(/(\d{3})(\d{7})/, '$1/$2');
      case 'PR':
        return registration.replace(/(\d{3})(\d{5})(\d{2})/, '$1.$2-$3');
      default:
        // Formatação genérica
        if (registration.length >= 9) {
          return registration.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
        }
        return registration;
    }
  };

  const handleGenerate = () => {
    const registration = generateStateRegistration(selectedState);
    const formatted = formatRegistration(registration, selectedState);
    setResult(formatted);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: "Copiado!",
      description: "Inscrição estadual copiada para a área de transferência.",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Gerador de Inscrição Estadual
          </CardTitle>
          <CardDescription className="text-center">
            Gerador de Inscrições Estaduais válidas para todos os estados, seguindo a regra de cada estado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <div>
              <Label className="text-base font-medium">Opções:</Label>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-3 block">Gerar com Pontuação?</Label>
              <RadioGroup 
                value={withPunctuation} 
                onValueChange={setWithPunctuation}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="sim" id="sim" />
                  <Label htmlFor="sim">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nao" id="nao" />
                  <Label htmlFor="nao">Não</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label htmlFor="state-select" className="text-sm font-medium mb-3 block">
                Qual estado?
              </Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.code} - {state.name}
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
                Gerar Inscrição Estadual
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
                  className="bg-green-50 border-green-200 text-green-800 font-mono text-lg resize-none"
                  rows={3}
                />
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2"
                  onClick={copyToClipboard}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
            <p className="text-justify">
              <strong>IMPORTANTE:</strong> Nosso gerador online de Inscrições Estaduais tem como intenção ajudar estudantes, 
              programadores, analistas e testadores a gerar Inscrições Estaduais válidas, normalmente necessários para 
              testar seus softwares em desenvolvimento. A má utilização dos dados aqui gerados é de total 
              responsabilidade do usuário. Os números são gerados de forma aleatória, respeitando as regras de criação 
              de cada documento.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};