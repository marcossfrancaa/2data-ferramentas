import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IdCard, AlertCircle, CheckCircle } from 'lucide-react';

const estados = [
  { uf: 'SP', nome: 'São Paulo' },
  { uf: 'RJ', nome: 'Rio de Janeiro' },
  { uf: 'MG', nome: 'Minas Gerais' },
  { uf: 'RS', nome: 'Rio Grande do Sul' },
  { uf: 'PR', nome: 'Paraná' },
  { uf: 'SC', nome: 'Santa Catarina' },
  { uf: 'BA', nome: 'Bahia' },
  { uf: 'GO', nome: 'Goiás' },
  { uf: 'ES', nome: 'Espírito Santo' },
  { uf: 'DF', nome: 'Distrito Federal' },
  { uf: 'PE', nome: 'Pernambuco' },
  { uf: 'CE', nome: 'Ceará' },
  { uf: 'PB', nome: 'Paraíba' },
  { uf: 'AL', nome: 'Alagoas' },
  { uf: 'SE', nome: 'Sergipe' },
  { uf: 'RN', nome: 'Rio Grande do Norte' },
  { uf: 'PI', nome: 'Piauí' },
  { uf: 'MA', nome: 'Maranhão' },
  { uf: 'MT', nome: 'Mato Grosso' },
  { uf: 'MS', nome: 'Mato Grosso do Sul' },
  { uf: 'TO', nome: 'Tocantins' },
  { uf: 'PA', nome: 'Pará' },
  { uf: 'AP', nome: 'Amapá' },
  { uf: 'AM', nome: 'Amazonas' },
  { uf: 'RR', nome: 'Roraima' },
  { uf: 'AC', nome: 'Acre' },
  { uf: 'RO', nome: 'Rondônia' }
];

export const RgValidator = () => {
  const [rg, setRg] = useState('');
  const [estado, setEstado] = useState('');
  const [result, setResult] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateRG = () => {
    if (!rg.trim()) {
      setResult('Por favor, digite o RG.');
      setIsValid(false);
      return;
    }

    if (!estado) {
      setResult('Por favor, selecione o estado emissor.');
      setIsValid(false);
      return;
    }

    const cleanRG = rg.replace(/\D/g, '');

    if (cleanRG.length < 7 || cleanRG.length > 9) {
      setResult('RG deve ter entre 7 e 9 dígitos.');
      setIsValid(false);
      return;
    }

    // Validação específica para SP (mais rigorosa)
    if (estado === 'SP' && cleanRG.length === 9) {
      const digits = cleanRG.split('').map(Number);
      const weights = [2, 3, 4, 5, 6, 7, 8, 9];
      
      let sum = 0;
      for (let i = 0; i < 8; i++) {
        sum += digits[i] * weights[i];
      }
      
      const remainder = sum % 11;
      const calculatedDigit = remainder < 2 ? 0 : 11 - remainder;
      
      if (calculatedDigit === digits[8]) {
        setResult(`RG válido para São Paulo!

RG: ${formatRG(cleanRG)}
Estado: ${estado} - ${estados.find(e => e.uf === estado)?.nome}
Dígito verificador: ${digits[8]}

Este RG passou na validação do algoritmo de São Paulo.`);
        setIsValid(true);
      } else {
        setResult(`RG inválido para São Paulo!

RG informado: ${formatRG(cleanRG)}
Dígito verificador informado: ${digits[8]}
Dígito verificador correto: ${calculatedDigit}

O RG não passou na validação do algoritmo de São Paulo.`);
        setIsValid(false);
      }
    } else {
      // Validação básica para outros estados
      setResult(`RG válido para verificação básica!

RG: ${formatRG(cleanRG)}
Estado: ${estado} - ${estados.find(e => e.uf === estado)?.nome}

IMPORTANTE: Este é apenas um validador de formato. 
Para confirmação real, consulte diretamente o órgão emissor do estado.`);
      setIsValid(true);
    }
  };

  const formatRG = (rg: string) => {
    if (rg.length === 9) {
      return `${rg.slice(0, 2)}.${rg.slice(2, 5)}.${rg.slice(5, 8)}-${rg.slice(8)}`;
    } else if (rg.length === 8) {
      return `${rg.slice(0, 2)}.${rg.slice(2, 5)}.${rg.slice(5)}`;
    }
    return rg;
  };

  const generateRG = () => {
    const randomState = estados[Math.floor(Math.random() * estados.length)];
    
    if (randomState.uf === 'SP') {
      // Gerar RG válido para SP
      const firstEight = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10));
      const weights = [2, 3, 4, 5, 6, 7, 8, 9];
      
      let sum = 0;
      for (let i = 0; i < 8; i++) {
        sum += firstEight[i] * weights[i];
      }
      
      const remainder = sum % 11;
      const digit = remainder < 2 ? 0 : 11 - remainder;
      
      const fullRG = [...firstEight, digit].join('');
      setRg(fullRG);
    } else {
      // Gerar RG genérico para outros estados
      const randomRG = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
      setRg(randomRG);
    }
    
    setEstado(randomState.uf);
    setResult('');
    setIsValid(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <IdCard className="w-6 h-6" />
            Validador de RG
          </CardTitle>
          <CardDescription className="text-center">
            Digite um RG depois clique em "Validar RG" para verificar se ele é verdadeiro ou falso de acordo com as regras do órgão SSP-SP
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold">Opções:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estado">Estado:</Label>
                <Select value={estado} onValueChange={setEstado}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.map((est) => (
                      <SelectItem key={est.uf} value={est.uf}>
                        {est.uf} - {est.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rg">Digite o RG:</Label>
                <Input
                  id="rg"
                  placeholder="Ex: 123456789"
                  value={rg}
                  onChange={(e) => setRg(e.target.value.replace(/\D/g, '').slice(0, 9))}
                  maxLength={9}
                />
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={validateRG}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white px-8 py-2"
              >
                Validar RG
              </Button>
              
              <Button 
                onClick={generateRG}
                variant="outline"
                className="px-8 py-2"
              >
                Gerar Exemplo
              </Button>
            </div>
          </div>

          {result && (
            <div>
              <Label className="text-sm font-medium">Resposta:</Label>
              <div className={`p-4 rounded-lg border ${isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-2">
                  {isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <Textarea
                    value={result}
                    readOnly
                    className={`min-h-[120px] border-0 bg-transparent resize-none p-0 ${
                      isValid ? 'text-green-800' : 'text-red-800'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};