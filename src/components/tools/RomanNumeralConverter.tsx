import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RomanNumeralConverter = () => {
  const [number, setNumber] = useState('');
  const [roman, setRoman] = useState('');
  const { toast } = useToast();

  const numberToRoman = (num: number): string => {
    if (num <= 0 || num > 3999) return '';
    
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    
    let result = '';
    let remaining = num;
    
    for (let i = 0; i < values.length; i++) {
      while (remaining >= values[i]) {
        result += symbols[i];
        remaining -= values[i];
      }
    }
    
    return result;
  };

  const romanToNumber = (romanStr: string): number => {
    const romanValues: { [key: string]: number } = {
      'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
    };
    
    let result = 0;
    const cleanRoman = romanStr.toUpperCase().replace(/[^IVXLCDM]/g, '');
    
    for (let i = 0; i < cleanRoman.length; i++) {
      const current = romanValues[cleanRoman[i]];
      const next = romanValues[cleanRoman[i + 1]];
      
      if (current < next) {
        result += next - current;
        i++; // Skip next character
      } else {
        result += current;
      }
    }
    
    return result;
  };

  const handleNumberChange = (value: string) => {
    setNumber(value);
    const num = parseInt(value);
    if (!isNaN(num) && num > 0 && num <= 3999) {
      setRoman(numberToRoman(num));
    } else {
      setRoman('');
    }
  };

  const handleRomanChange = (value: string) => {
    setRoman(value);
    if (value.trim()) {
      const num = romanToNumber(value);
      if (num > 0 && num <= 3999) {
        setNumber(num.toString());
      } else {
        setNumber('');
      }
    } else {
      setNumber('');
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${type} copiado para a área de transferência.`,
    });
  };

  const reset = () => {
    setNumber('');
    setRoman('');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Conversor de Números Romanos
          </CardTitle>
          <CardDescription>
            Converta números arábicos (1-3999) para romanos e vice-versa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Número Arábico */}
            <div className="space-y-3">
              <Label htmlFor="number" className="text-sm font-medium">
                Número Arábico (1-3999)
              </Label>
              <div className="relative">
                <Input
                  id="number"
                  type="number"
                  min="1"
                  max="3999"
                  value={number}
                  onChange={(e) => handleNumberChange(e.target.value)}
                  placeholder="Digite um número (ex: 1984)"
                  className="pr-12"
                />
                {number && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(number, 'Número')}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Número Romano */}
            <div className="space-y-3">
              <Label htmlFor="roman" className="text-sm font-medium">
                Número Romano
              </Label>
              <div className="relative">
                <Input
                  id="roman"
                  type="text"
                  value={roman}
                  onChange={(e) => handleRomanChange(e.target.value)}
                  placeholder="Digite números romanos (ex: MCMLXXXIV)"
                  className="pr-12 uppercase"
                />
                {roman && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(roman, 'Número Romano')}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={reset} variant="outline" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Limpar
            </Button>
          </div>

          {/* Tabela de Referência */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Referência Rápida</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="space-y-1">
                  <p><strong>I</strong> = 1</p>
                  <p><strong>V</strong> = 5</p>
                  <p><strong>X</strong> = 10</p>
                  <p><strong>L</strong> = 50</p>
                </div>
                <div className="space-y-1">
                  <p><strong>C</strong> = 100</p>
                  <p><strong>D</strong> = 500</p>
                  <p><strong>M</strong> = 1000</p>
                </div>
                <div className="space-y-1">
                  <p><strong>IV</strong> = 4</p>
                  <p><strong>IX</strong> = 9</p>
                  <p><strong>XL</strong> = 40</p>
                  <p><strong>XC</strong> = 90</p>
                </div>
                <div className="space-y-1">
                  <p><strong>CD</strong> = 400</p>
                  <p><strong>CM</strong> = 900</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};