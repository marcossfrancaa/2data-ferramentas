import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Car, AlertCircle, CheckCircle } from 'lucide-react';

export const RenavamValidator = () => {
  const [renavam, setRenavam] = useState('');
  const [result, setResult] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateRenavam = () => {
    if (!renavam.trim()) {
      setResult('Por favor, digite o RENAVAM.');
      setIsValid(false);
      return;
    }

    const cleanRenavam = renavam.replace(/\D/g, '');

    if (cleanRenavam.length !== 11) {
      setResult('RENAVAM deve ter exatamente 11 dígitos.');
      setIsValid(false);
      return;
    }

    // Algoritmo de validação do RENAVAM
    const digits = cleanRenavam.split('').map(Number);
    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * weights[i];
    }
    
    const remainder = sum % 11;
    const calculatedDigit = remainder === 0 || remainder === 1 ? 0 : 11 - remainder;
    
    if (calculatedDigit === digits[10]) {
      setResult(`RENAVAM válido!

RENAVAM: ${cleanRenavam}
Dígito verificador: ${digits[10]}

Este RENAVAM passou na validação do algoritmo oficial.
Para verificação completa da situação do veículo, consulte o DETRAN.`);
      setIsValid(true);
    } else {
      setResult(`RENAVAM inválido!

RENAVAM informado: ${cleanRenavam}
Dígito verificador informado: ${digits[10]}
Dígito verificador correto: ${calculatedDigit}

O RENAVAM não passou na validação do algoritmo oficial.`);
      setIsValid(false);
    }
  };

  const generateRenavam = () => {
    // Gerar 10 primeiros dígitos aleatórios
    const firstTen = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
    
    // Calcular dígito verificador
    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += firstTen[i] * weights[i];
    }
    
    const remainder = sum % 11;
    const digit = remainder === 0 || remainder === 1 ? 0 : 11 - remainder;
    
    const fullRenavam = [...firstTen, digit].join('');
    setRenavam(fullRenavam);
    setResult('');
    setIsValid(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Car className="w-6 h-6" />
            Validador Online de RENAVAM
          </CardTitle>
          <CardDescription className="text-center">
            Validador de RENAVAM, digite o RENAVAM e clique no botão "Validar RENAVAM"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold">Opções:</h3>
            
            <div>
              <Label htmlFor="renavam">Digite o RENAVAM:</Label>
              <Input
                id="renavam"
                placeholder="Ex: 12345678901"
                value={renavam}
                onChange={(e) => setRenavam(e.target.value.replace(/\D/g, '').slice(0, 11))}
                maxLength={11}
                className="mt-1"
              />
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={validateRenavam}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white px-8 py-2"
              >
                Validar RENAVAM
              </Button>
              
              <Button 
                onClick={generateRenavam}
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