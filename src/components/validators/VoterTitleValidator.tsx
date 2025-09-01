import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Search, Vote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const VoterTitleValidator = () => {
  const [titulo, setTitulo] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationDetails, setValidationDetails] = useState<any>(null);
  const { toast } = useToast();

  const validateVoterTitle = () => {
    if (!titulo.trim()) {
      toast({
        title: "Erro",
        description: "Digite um número de título de eleitor",
        variant: "destructive",
      });
      return;
    }

    // Remove caracteres não numéricos
    const cleanTitulo = titulo.replace(/\D/g, '');
    
    if (cleanTitulo.length !== 12) {
      setIsValid(false);
      setValidationDetails({
        error: 'Título deve ter 12 dígitos',
        length: cleanTitulo.length
      });
      return;
    }

    // Validação do título de eleitor
    const digits = cleanTitulo.split('').map(Number);
    
    // Primeiro dígito verificador
    let sum1 = 0;
    for (let i = 0; i < 8; i++) {
      sum1 += digits[i] * (i + 2);
    }
    
    let firstDigit = sum1 % 11;
    if (firstDigit < 2) {
      firstDigit = 0;
    } else {
      firstDigit = 11 - firstDigit;
    }

    // Segundo dígito verificador  
    let sum2 = 0;
    for (let i = 0; i < 9; i++) {
      sum2 += digits[i] * (i + 7);
    }
    
    let secondDigit = sum2 % 11;
    if (secondDigit < 2) {
      secondDigit = 0;
    } else {
      secondDigit = 11 - secondDigit;
    }

    const calculatedDigits = [firstDigit, secondDigit];
    const providedDigits = [digits[8], digits[9]];
    
    const valid = calculatedDigits[0] === providedDigits[0] && 
                  calculatedDigits[1] === providedDigits[1];

    setIsValid(valid);
    setValidationDetails({
      formatted: formatVoterTitle(cleanTitulo),
      zone: cleanTitulo.substring(8, 11),
      section: cleanTitulo.substring(10, 12),
      calculatedDigits,
      providedDigits,
      valid
    });

    toast({
      title: valid ? "Título Válido!" : "Título Inválido!",
      description: valid ? "Número de título válido" : "Número de título inválido",
      variant: valid ? "default" : "destructive",
    });
  };

  const formatVoterTitle = (titulo: string) => {
    // Formato: 0000.0000.0000
    return titulo.replace(/(\d{4})(\d{4})(\d{4})/, '$1.$2.$3');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove não-dígitos
    if (value.length <= 12) {
      // Aplica formatação automática
      value = value.replace(/(\d{4})(\d{4})(\d{4})/, '$1.$2.$3');
      setTitulo(value);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Vote className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Validador de Título de Eleitor</h1>
        </div>
        <p className="text-muted-foreground">
          Valida números de título de eleitor brasileiros verificando os dígitos verificadores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Validação
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="titulo">Número do Título</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={handleInputChange}
                placeholder="0000.0000.0000"
                className="font-mono"
                maxLength={14}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Digite apenas os números do título
              </p>
            </div>

            <Button
              onClick={validateVoterTitle}
              disabled={!titulo.trim()}
              className="w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              Validar Título
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Resultado da Validação
          </h3>
          
          <div className="space-y-4">
            {isValid !== null ? (
              <>
                <div className={`flex items-center gap-3 p-4 rounded-lg ${
                  isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  {isValid ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <h4 className={`font-semibold ${
                      isValid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isValid ? 'Título Válido' : 'Título Inválido'}
                    </h4>
                    <p className={`text-sm ${
                      isValid ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {validationDetails?.error || 'Dígitos verificadores corretos'}
                    </p>
                  </div>
                </div>

                {validationDetails && !validationDetails.error && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Formato</Label>
                        <p className="font-mono">{validationDetails.formatted}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Zona</Label>
                        <p className="font-mono">{validationDetails.zone}</p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <Label className="text-muted-foreground text-sm">Dígitos Verificadores</Label>
                      <div className="flex justify-between text-sm mt-1">
                        <span>Calculado: {validationDetails.calculatedDigits?.join('')}</span>
                        <span>Fornecido: {validationDetails.providedDigits?.join('')}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Vote className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Resultado da validação aparecerá aqui</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Vote className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre o Título de Eleitor</h4>
            <p className="text-muted-foreground">
              O título de eleitor é um documento que comprova que o cidadão está em dia com 
              as obrigações eleitorais. Possui 12 dígitos, sendo os dois últimos dígitos verificadores.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};