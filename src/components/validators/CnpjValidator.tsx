import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Building, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CnpjValidator = () => {
  const [cnpj, setCnpj] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationInfo, setValidationInfo] = useState<string>('');
  const { toast } = useToast();

  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const validateCNPJ = (cnpj: string) => {
    const numbers = cnpj.replace(/\D/g, '');
    
    if (numbers.length !== 14) {
      return { valid: false, message: 'CNPJ deve ter 14 dígitos' };
    }

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(numbers)) {
      return { valid: false, message: 'CNPJ inválido - todos os dígitos são iguais' };
    }

    // Calcula primeiro dígito verificador
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(numbers[i]) * weights1[i];
    }
    const firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    // Calcula segundo dígito verificador
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(numbers[i]) * weights2[i];
    }
    const secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    const calculatedCNPJ = numbers.substring(0, 12) + firstDigit + secondDigit;
    
    if (numbers === calculatedCNPJ) {
      return { valid: true, message: 'CNPJ válido' };
    } else {
      return { valid: false, message: 'CNPJ inválido - dígitos verificadores incorretos' };
    }
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCNPJ(value);
    
    if (formatted.length <= 18) { // Máximo com formatação
      setCnpj(formatted);
      
      const numbers = value.replace(/\D/g, '');
      if (numbers.length === 14) {
        const validation = validateCNPJ(numbers);
        setIsValid(validation.valid);
        setValidationInfo(validation.message);
      } else {
        setIsValid(null);
        setValidationInfo('');
      }
    }
  };

  const clearCnpj = () => {
    setCnpj('');
    setIsValid(null);
    setValidationInfo('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Building className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Validador de CNPJ</h1>
        </div>
        <p className="text-muted-foreground">
          Valida se um número de CNPJ é válido através do cálculo dos dígitos verificadores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Digite o CNPJ
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={cnpj}
                onChange={handleCnpjChange}
                placeholder="00.000.000/0000-00"
                className="font-mono text-lg"
                maxLength={18}
              />
            </div>

            <Button
              onClick={clearCnpj}
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
                    {isValid ? 'CNPJ Válido' : 'CNPJ Inválido'}
                  </div>
                  <div className="text-sm opacity-80">
                    {validationInfo}
                  </div>
                </div>
              </div>
            )}

            {!cnpj && (
              <div className="text-center text-muted-foreground py-8">
                <Building className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Digite um CNPJ para validar</p>
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
              A validação de CNPJ usa pesos específicos para calcular os dígitos verificadores. 
              Os dois últimos dígitos são calculados com base nos 12 primeiros.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};