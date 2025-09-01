import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PisValidator = () => {
  const [pisNumber, setPisNumber] = useState('');
  const [result, setResult] = useState('');
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();

  const validatePIS = () => {
    if (!pisNumber.trim()) {
      setResult('Por favor, digite um PIS/PASEP.');
      setIsValid(false);
      return;
    }

    // Remove espaços e caracteres especiais
    const cleanPis = pisNumber.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cleanPis.length !== 11) {
      setResult(`❌ PIS/PASEP INVÁLIDO

O PIS/PASEP deve ter exatamente 11 dígitos.
Você digitou: ${cleanPis.length} dígitos.

Formato correto: 12345678901`);
      setIsValid(false);
      return;
    }

    // Verifica se não são todos os dígitos iguais
    if (/^(\d)\1{10}$/.test(cleanPis)) {
      setResult(`❌ PIS/PASEP INVÁLIDO

PIS/PASEP com todos os dígitos iguais não é válido.

Exemplo de formato correto: 12345678901`);
      setIsValid(false);
      return;
    }

    // Validação do dígito verificador
    const digits = cleanPis.split('').map(Number);
    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * weights[i];
    }
    
    const remainder = sum % 11;
    const checkDigit = remainder < 2 ? 0 : 11 - remainder;

    if (digits[10] === checkDigit) {
      const formatted = cleanPis.replace(/(\d{3})(\d{5})(\d{2})(\d{1})/, '$1.$2.$3-$4');
      
      setResult(`✅ PIS/PASEP VÁLIDO!

Número do PIS/PASEP: ${formatted}

Este número de PIS/PASEP possui formato válido e dígito verificador correto.

IMPORTANTE: Esta validação verifica apenas a estrutura matemática do número. Para verificação de validade real do documento, consulte a Caixa Econômica Federal ou o sistema oficial da Receita Federal.`);
      setIsValid(true);
    } else {
      setResult(`❌ PIS/PASEP INVÁLIDO

O número informado não possui dígito verificador válido.

Dígito verificador esperado: ${checkDigit}
Dígito verificador informado: ${digits[10]}

Exemplo de PIS/PASEP válido: 123.45678.90-1`);
      setIsValid(false);
    }
  };

  const generateExample = () => {
    // Gera um PIS válido para exemplo
    const basePis = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += basePis[i] * weights[i];
    }
    
    const remainder = sum % 11;
    const checkDigit = remainder < 2 ? 0 : 11 - remainder;
    
    const validPis = [...basePis, checkDigit].join('');
    setPisNumber(validPis);
    setResult('');
    setIsValid(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <CreditCard className="w-6 h-6" />
            Validador Online de PIS/PASEP
          </CardTitle>
          <CardDescription className="text-center">
            Digite um PIS/PASEP depois clique em "Validar PIS" para verificar se ele é válido ou não
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold">Opções:</h3>
            
            <div>
              <Label htmlFor="pis">Digite o PIS/PASEP:</Label>
              <Input
                id="pis"
                placeholder="Digite o PIS/PASEP"
                value={pisNumber}
                onChange={(e) => setPisNumber(e.target.value)}
                className="mt-2"
                maxLength={15}
              />
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={validatePIS}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white px-8 py-2"
              >
                Validar PIS
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
              <strong>IMPORTANTE:</strong> Esta validação verifica apenas a estrutura matemática do número do PIS/PASEP. 
              Para verificação de validade real do documento, consulte a Caixa Econômica Federal ou o sistema oficial da Receita Federal.
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