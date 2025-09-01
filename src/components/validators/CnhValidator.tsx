import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CnhValidator = () => {
  const [cnhNumber, setCnhNumber] = useState('');
  const [result, setResult] = useState('');
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();

  const validateCNH = () => {
    if (!cnhNumber.trim()) {
      setResult('Por favor, digite um CNH.');
      setIsValid(false);
      return;
    }

    // Remove espaços e caracteres especiais
    const cleanCnh = cnhNumber.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cleanCnh.length !== 11) {
      setResult(`❌ CNH INVÁLIDO

O CNH deve ter exatamente 11 dígitos.
Você digitou: ${cleanCnh.length} dígitos.

Formato correto: 12345678901`);
      setIsValid(false);
      return;
    }

    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cleanCnh)) {
      setResult(`❌ CNH INVÁLIDO

CNH com todos os dígitos iguais não é válido.

Exemplo de formato correto: 12345678901`);
      setIsValid(false);
      return;
    }

    // Validação do dígito verificador
    const digits = cleanCnh.split('').map(Number);
    
    // Primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (9 - i);
    }
    
    let firstDigit = sum % 11;
    if (firstDigit >= 10) firstDigit = 0;
    
    // Segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (1 + (9 - i));
    }
    sum += firstDigit * 2;
    
    let secondDigit = sum % 11;
    if (secondDigit >= 10) secondDigit = 0;

    if (digits[9] === firstDigit && digits[10] === secondDigit) {
      const formatted = cleanCnh.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      
      setResult(`✅ CNH VÁLIDO!

Número da CNH: ${formatted}

Este número de CNH possui formato válido e dígitos verificadores corretos.

IMPORTANTE: Esta validação verifica apenas a estrutura matemática do número. Para verificação de validade real do documento, consulte o DETRAN de seu estado.`);
      setIsValid(true);
    } else {
      setResult(`❌ CNH INVÁLIDO

O número informado não possui dígitos verificadores válidos.

Dígitos verificadores esperados: ${firstDigit}${secondDigit}
Dígitos verificadores informados: ${digits[9]}${digits[10]}

Exemplo de CNH válido: 123.456.789-01`);
      setIsValid(false);
    }
  };

  const generateExample = () => {
    // Gera um CNH válido para exemplo
    const baseCnh = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    
    // Calcula primeiro dígito
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += baseCnh[i] * (9 - i);
    }
    let firstDigit = sum % 11;
    if (firstDigit >= 10) firstDigit = 0;
    
    // Calcula segundo dígito
    sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += baseCnh[i] * (1 + (9 - i));
    }
    sum += firstDigit * 2;
    let secondDigit = sum % 11;
    if (secondDigit >= 10) secondDigit = 0;
    
    const validCnh = [...baseCnh, firstDigit, secondDigit].join('');
    setCnhNumber(validCnh);
    setResult('');
    setIsValid(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <CreditCard className="w-6 h-6" />
            Validador Online de CNH
          </CardTitle>
          <CardDescription className="text-center">
            Digite um CNH depois clique em "Validar CNH" para verificar se ele é válido ou não
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold">Opções:</h3>
            
            <div>
              <Label htmlFor="cnh">Digite a CNH:</Label>
              <Input
                id="cnh"
                placeholder="Digite a CNH"
                value={cnhNumber}
                onChange={(e) => setCnhNumber(e.target.value)}
                className="mt-2"
                maxLength={15}
              />
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={validateCNH}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white px-8 py-2"
              >
                Validar CNH
              </Button>
              
              <Button 
                onClick={generateExample}
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

          <Separator />

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>IMPORTANTE:</strong> Esta validação verifica apenas a estrutura matemática do número da CNH. 
              Para verificação de validade real do documento, consulte o DETRAN de seu estado.
            </p>
            <p>
              Use esta ferramenta apenas para fins de teste e validação de formato.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};