import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Binary, Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NumberBaseConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromBase, setFromBase] = useState('10');
  const [results, setResults] = useState({
    binary: '',
    octal: '',
    decimal: '',
    hexadecimal: ''
  });
  const { toast } = useToast();

  const bases = [
    { value: '2', label: 'Binário (Base 2)' },
    { value: '8', label: 'Octal (Base 8)' },
    { value: '10', label: 'Decimal (Base 10)' },
    { value: '16', label: 'Hexadecimal (Base 16)' }
  ];

  const convertNumber = () => {
    if (!inputValue.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um número para converter",
        variant: "destructive",
      });
      return;
    }

    try {
      // Convert input to decimal first
      const decimalValue = parseInt(inputValue.replace(/\s/g, ''), parseInt(fromBase));
      
      if (isNaN(decimalValue)) {
        throw new Error('Número inválido');
      }

      setResults({
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        decimal: decimalValue.toString(10),
        hexadecimal: decimalValue.toString(16).toUpperCase()
      });

      toast({
        title: "Conversão realizada",
        description: "Número convertido para todas as bases",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Número inválido para a base selecionada",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (value: string, base: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Copiado!",
        description: `Número em ${base} copiado para a área de transferência`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o número",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setInputValue('');
    setResults({
      binary: '',
      octal: '',
      decimal: '',
      hexadecimal: ''
    });
  };

  const formatBinary = (binary: string) => {
    return binary.replace(/(.{4})/g, '$1 ').trim();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Binary className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Conversor de Bases Numéricas</h1>
        </div>
        <p className="text-muted-foreground">
          Converta números entre diferentes bases: binário, octal, decimal e hexadecimal.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="input-number">Número para Converter</Label>
            <Input
              id="input-number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite o número..."
              className="font-mono"
            />
          </div>

          <div>
            <Label htmlFor="from-base">Base de Origem</Label>
            <Select value={fromBase} onValueChange={setFromBase}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a base" />
              </SelectTrigger>
              <SelectContent>
                {bases.map((base) => (
                  <SelectItem key={base.value} value={base.value}>
                    {base.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 mb-6">
          <Button
            onClick={convertNumber}
            className="bg-gradient-primary hover:opacity-90 transition-fast"
          >
            <Binary className="w-4 h-4 mr-2" />
            Converter
          </Button>

          <Button variant="outline" onClick={clearAll}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        </div>

        {(results.decimal || results.binary || results.octal || results.hexadecimal) && (
          <div className="space-y-4">
            <h3 className="font-medium text-card-foreground">Resultados</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Binário (Base 2)</Label>
                <div className="flex gap-2">
                  <Input
                    value={formatBinary(results.binary)}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(results.binary, 'binário')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Octal (Base 8)</Label>
                <div className="flex gap-2">
                  <Input
                    value={results.octal}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(results.octal, 'octal')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Decimal (Base 10)</Label>
                <div className="flex gap-2">
                  <Input
                    value={results.decimal}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(results.decimal, 'decimal')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Hexadecimal (Base 16)</Label>
                <div className="flex gap-2">
                  <Input
                    value={results.hexadecimal}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(results.hexadecimal, 'hexadecimal')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Binary className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre as Bases Numéricas</h4>
            <p className="text-muted-foreground mb-2">
              <strong>Binário:</strong> Usa apenas 0 e 1 (base 2) - usado em computação.<br/>
              <strong>Octal:</strong> Usa dígitos 0-7 (base 8) - usado em programação.<br/>
              <strong>Decimal:</strong> Usa dígitos 0-9 (base 10) - sistema tradicional.<br/>
              <strong>Hexadecimal:</strong> Usa 0-9 e A-F (base 16) - usado em cores e programação.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};