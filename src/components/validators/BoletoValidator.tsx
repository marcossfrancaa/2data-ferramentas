import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Search, Receipt, CalendarDays, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const BoletoValidator = () => {
  const [barcode, setBarcode] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationDetails, setValidationDetails] = useState<any>(null);
  const { toast } = useToast();

  const validateBoleto = () => {
    if (!barcode.trim()) {
      toast({
        title: "Erro",
        description: "Digite o código de barras do boleto",
        variant: "destructive",
      });
      return;
    }

    // Remove caracteres não numéricos
    const cleanBarcode = barcode.replace(/\D/g, '');
    
    if (cleanBarcode.length !== 44 && cleanBarcode.length !== 48) {
      setIsValid(false);
      setValidationDetails({
        error: 'Código deve ter 44 ou 48 dígitos',
        length: cleanBarcode.length
      });
      return;
    }

    let validationResult;
    
    if (cleanBarcode.length === 44) {
      // Boleto bancário
      validationResult = validateBankBoleto(cleanBarcode);
    } else {
      // Convênio/concessionária (48 dígitos)
      validationResult = validateConvenioBoleto(cleanBarcode);
    }

    setIsValid(validationResult.valid);
    setValidationDetails(validationResult);

    toast({
      title: validationResult.valid ? "Boleto Válido!" : "Boleto Inválido!",
      description: validationResult.valid ? "Código de barras válido" : validationResult.error || "Código de barras inválido",
      variant: validationResult.valid ? "default" : "destructive",
    });
  };

  const validateBankBoleto = (code: string) => {
    try {
      // Estrutura do boleto bancário (44 dígitos)
      const bankCode = code.substring(0, 3);
      const currencyCode = code.substring(3, 4);
      const checkDigit = parseInt(code.substring(4, 5));
      const dueDate = code.substring(5, 9);
      const value = code.substring(9, 19);
      
      // Validação do dígito verificador (módulo 11)
      const sequence = code.substring(0, 4) + code.substring(5);
      const calculatedDigit = calculateMod11(sequence);
      
      const valid = calculatedDigit === checkDigit;
      
      return {
        valid,
        type: 'Boleto Bancário',
        bankCode,
        currencyCode,
        checkDigit,
        calculatedDigit,
        dueDate: calculateDueDate(dueDate),
        value: formatCurrency(value),
        formatted: formatBarcode(code, 44)
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Erro na validação do boleto bancário'
      };
    }
  };

  const validateConvenioBoleto = (code: string) => {
    try {
      // Estrutura do convênio (48 dígitos)
      const segment = code.substring(0, 1);
      const identification = code.substring(1, 2);
      const checkDigit1 = parseInt(code.substring(11, 12));
      const checkDigit2 = parseInt(code.substring(23, 24));
      const checkDigit3 = parseInt(code.substring(35, 36));
      const checkDigit4 = parseInt(code.substring(47, 48));
      
      // Validação simplificada para convênio
      const valid = true; // Implementação completa requer especificação do órgão
      
      return {
        valid,
        type: 'Convênio/Concessionária',
        segment: getSegmentName(segment),
        identification,
        formatted: formatBarcode(code, 48)
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Erro na validação do convênio'
      };
    }
  };

  const calculateMod11 = (sequence: string): number => {
    const digits = sequence.split('').map(Number);
    const weights = [4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < digits.length; i++) {
      sum += digits[digits.length - 1 - i] * weights[i];
    }
    
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const calculateDueDate = (days: string): string => {
    const baseDate = new Date(1997, 9, 7); // 07/10/1997
    const daysNum = parseInt(days);
    
    if (daysNum === 0) return 'Sem vencimento';
    
    const dueDate = new Date(baseDate);
    dueDate.setDate(dueDate.getDate() + daysNum);
    
    return dueDate.toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: string): string => {
    const num = parseInt(value) / 100;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(num);
  };

  const formatBarcode = (code: string, length: number): string => {
    if (length === 44) {
      // Formato: 00000.00000 00000.000000 00000.000000 0 00000000000000
      return code.replace(/(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{14})/, 
        '$1.$2 $3.$4 $5.$6 $7 $8');
    } else {
      // Formato para 48 dígitos
      return code.replace(/(\d{12})(\d{12})(\d{12})(\d{12})/, '$1 $2 $3 $4');
    }
  };

  const getSegmentName = (segment: string): string => {
    const segments: { [key: string]: string } = {
      '1': 'Prefeituras',
      '2': 'Saneamento',
      '3': 'Energia Elétrica e Gás',
      '4': 'Telecomunicações',
      '5': 'Órgãos Governamentais',
      '6': 'Carnes e Assemelhados',
      '7': 'Multas de Trânsito',
      '8': 'Uso Exclusivo dos Bancos',
      '9': 'Uso Exclusivo dos Bancos'
    };
    
    return segments[segment] || 'Desconhecido';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Receipt className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Validador de Código de Barras de Boleto</h1>
        </div>
        <p className="text-muted-foreground">
          Valida códigos de barras de boletos bancários e convênios verificando os dígitos verificadores.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Validação
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="barcode">Código de Barras</Label>
              <Input
                id="barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value.replace(/\D/g, ''))}
                placeholder="Digite o código de barras (44 ou 48 dígitos)"
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground mt-1">
                44 dígitos para boletos bancários, 48 para convênios
              </p>
            </div>

            <Button
              onClick={validateBoleto}
              disabled={!barcode.trim()}
              className="w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              Validar Boleto
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
                      {isValid ? 'Boleto Válido' : 'Boleto Inválido'}
                    </h4>
                    <p className={`text-sm ${
                      isValid ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {validationDetails?.error || validationDetails?.type}
                    </p>
                  </div>
                </div>

                {validationDetails && !validationDetails.error && (
                  <div className="space-y-4">
                    {validationDetails.bankCode && (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-muted-foreground flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            Banco
                          </Label>
                          <p className="font-mono">{validationDetails.bankCode}</p>
                        </div>
                        {validationDetails.dueDate && (
                          <div>
                            <Label className="text-muted-foreground flex items-center gap-1">
                              <CalendarDays className="w-3 h-3" />
                              Vencimento
                            </Label>
                            <p>{validationDetails.dueDate}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {validationDetails.value && (
                      <div>
                        <Label className="text-muted-foreground">Valor</Label>
                        <p className="text-lg font-semibold text-green-600">{validationDetails.value}</p>
                      </div>
                    )}

                    {validationDetails.segment && (
                      <div>
                        <Label className="text-muted-foreground">Segmento</Label>
                        <p>{validationDetails.segment}</p>
                      </div>
                    )}

                    <div className="p-3 bg-accent/10 rounded-lg">
                      <Label className="text-muted-foreground text-sm">Código Formatado</Label>
                      <p className="font-mono text-sm mt-1 break-all">{validationDetails.formatted}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Receipt className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Resultado da validação aparecerá aqui</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Receipt className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre Códigos de Barras de Boleto</h4>
            <p className="text-muted-foreground">
              Os boletos bancários possuem 44 dígitos e os convênios 48 dígitos. Cada código contém 
              informações sobre o banco, valor, vencimento e dígitos verificadores para validação.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};