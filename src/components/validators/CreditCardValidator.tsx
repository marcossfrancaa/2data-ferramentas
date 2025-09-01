import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, CreditCard, Info } from 'lucide-react';

export const CreditCardValidator = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [cardInfo, setCardInfo] = useState<{brand: string; type: string} | null>(null);

  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const getCardBrand = (number: string) => {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]|^2[2-7]/,
      amex: /^3[47]/,
      diners: /^3[068]|^30[0-5]/,
      discover: /^6(?:011|5)/,
      jcb: /^35/,
    };

    for (const [brand, pattern] of Object.entries(patterns)) {
      if (pattern.test(number)) {
        return brand;
      }
    }
    return 'unknown';
  };

  const validateLuhn = (number: string) => {
    const digits = number.replace(/\D/g, '');
    let sum = 0;
    let alternate = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i]);
      
      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit = (digit % 10) + 1;
        }
      }
      
      sum += digit;
      alternate = !alternate;
    }

    return sum % 10 === 0;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCardNumber(value);
    
    if (formatted.length <= 23) { // Máximo com espaços
      setCardNumber(formatted);
      
      const numbers = value.replace(/\D/g, '');
      
      if (numbers.length >= 1) {
        const brand = getCardBrand(numbers);
        setCardInfo({
          brand: brand.charAt(0).toUpperCase() + brand.slice(1),
          type: brand === 'amex' ? 'American Express' : 
                brand === 'mastercard' ? 'Mastercard' :
                brand === 'visa' ? 'Visa' :
                brand === 'diners' ? 'Diners Club' :
                brand === 'discover' ? 'Discover' :
                brand === 'jcb' ? 'JCB' : 'Desconhecida'
        });
      } else {
        setCardInfo(null);
      }
      
      if (numbers.length >= 13) {
        const valid = validateLuhn(numbers);
        setIsValid(valid);
      } else {
        setIsValid(null);
      }
    }
  };

  const clearCard = () => {
    setCardNumber('');
    setIsValid(null);
    setCardInfo(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Validador de Cartão de Crédito</h1>
        </div>
        <p className="text-muted-foreground">
          Valida números de cartão de crédito usando o algoritmo de Luhn e identifica a bandeira.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Número do Cartão
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardNumber">Número do Cartão</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="0000 0000 0000 0000"
                className="font-mono text-lg"
                maxLength={23}
              />
            </div>

            <Button
              onClick={clearCard}
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
                    {isValid ? 'Cartão Válido' : 'Cartão Inválido'}
                  </div>
                  {cardInfo && (
                    <div className="text-sm opacity-80">
                      Bandeira: {cardInfo.type}
                    </div>
                  )}
                </div>
              </div>
            )}

            {cardInfo && (
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <h4 className="font-semibold text-card-foreground mb-2">
                  Informações do Cartão
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bandeira:</span>
                    <span className="font-medium">{cardInfo.type}</span>
                  </div>
                  {isValid !== null && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Algoritmo:</span>
                      <span className="font-medium">
                        {isValid ? 'Luhn válido' : 'Luhn inválido'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!cardNumber && (
              <div className="text-center text-muted-foreground py-8">
                <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Digite um número de cartão para validar</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Algoritmo de Luhn</h4>
            <p className="text-muted-foreground">
              A validação usa o algoritmo de Luhn para verificar se o número do cartão é 
              matematicamente válido. Também identifica a bandeira baseada nos primeiros dígitos.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};