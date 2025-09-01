import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, CreditCard, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CpfValidator = () => {
  const [cpf, setCpf] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationInfo, setValidationInfo] = useState<string>('');
  const { toast } = useToast();

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const validateCPF = (cpf: string) => {
    const numbers = cpf.replace(/\D/g, '');
    
    if (numbers.length !== 11) {
      return { valid: false, message: 'CPF deve ter 11 dígitos' };
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(numbers)) {
      return { valid: false, message: 'CPF inválido - todos os dígitos são iguais' };
    }

    // Calcula primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(numbers[i]) * (10 - i);
    }
    const firstDigit = ((sum * 10) % 11) % 10;

    // Calcula segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(numbers[i]) * (11 - i);
    }
    const secondDigit = ((sum * 10) % 11) % 10;

    const calculatedCPF = numbers.substring(0, 9) + firstDigit + secondDigit;
    
    if (numbers === calculatedCPF) {
      return { valid: true, message: 'CPF válido' };
    } else {
      return { valid: false, message: 'CPF inválido - dígitos verificadores incorretos' };
    }
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCPF(value);
    
    if (formatted.length <= 14) { // Máximo com formatação
      setCpf(formatted);
      
      const numbers = value.replace(/\D/g, '');
      if (numbers.length === 11) {
        const validation = validateCPF(numbers);
        setIsValid(validation.valid);
        setValidationInfo(validation.message);
      } else {
        setIsValid(null);
        setValidationInfo('');
      }
    }
  };

  const clearCpf = () => {
    setCpf('');
    setIsValid(null);
    setValidationInfo('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Validador de CPF</h1>
        </div>
        <p className="text-muted-foreground">
          Valida se um número de CPF é válido através do cálculo dos dígitos verificadores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Digite o CPF
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                className="font-mono text-lg"
                maxLength={14}
              />
            </div>

            <Button
              onClick={clearCpf}
              variant="outline"
              className="w-full"
            >
              Limpar
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Resultado da Validação
          </h3>
          
          <div className="space-y-4">
            {isValid !== null && (
              <div className={`flex items-center gap-3 p-4 rounded-lg ${
                isValid 
                  ? 'bg-success/10 text-success border border-success/20' 
                  : 'bg-destructive/10 text-destructive border border-destructive/20'
              }`}>
                {isValid ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <XCircle className="w-6 h-6" />
                )}
                <div>
                  <div className="font-semibold">
                    {isValid ? 'CPF Válido' : 'CPF Inválido'}
                  </div>
                  <div className="text-sm opacity-80">
                    {validationInfo}
                  </div>
                </div>
              </div>
            )}

            {!cpf && (
              <div className="text-center text-muted-foreground py-8">
                <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Digite um CPF para validar</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Como funciona a validação</h4>
            <p className="text-muted-foreground">
              A validação de CPF usa o algoritmo dos dígitos verificadores. Os dois últimos dígitos 
              são calculados com base nos 9 primeiros, garantindo a autenticidade do número.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};