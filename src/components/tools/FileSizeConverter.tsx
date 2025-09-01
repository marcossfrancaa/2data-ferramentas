import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HardDrive, ArrowUpDown, Copy } from 'lucide-react';
import { toast } from 'sonner';

export const FileSizeConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('bytes');
  const [results, setResults] = useState<{[key: string]: string}>({});

  const units = [
    { value: 'bytes', label: 'Bytes (B)', multiplier: 1 },
    { value: 'kilobytes', label: 'Kilobytes (KB)', multiplier: 1024 },
    { value: 'megabytes', label: 'Megabytes (MB)', multiplier: 1024 * 1024 },
    { value: 'gigabytes', label: 'Gigabytes (GB)', multiplier: 1024 * 1024 * 1024 },
    { value: 'terabytes', label: 'Terabytes (TB)', multiplier: 1024 * 1024 * 1024 * 1024 },
    { value: 'petabytes', label: 'Petabytes (PB)', multiplier: 1024 * 1024 * 1024 * 1024 * 1024 }
  ];

  const formatNumber = (num: number): string => {
    if (num === 0) return '0';
    if (num < 1 && num > 0) {
      return num.toExponential(6);
    }
    if (num >= 1000000000000) {
      return num.toExponential(6);
    }
    return num.toLocaleString('pt-BR', { maximumFractionDigits: 10 });
  };

  const convertFileSize = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      toast.error('Digite um valor numérico válido');
      return;
    }

    const selectedUnit = units.find(u => u.value === fromUnit);
    if (!selectedUnit) return;

    // Converter para bytes primeiro
    const valueInBytes = value * selectedUnit.multiplier;

    // Converter para todas as unidades
    const newResults: {[key: string]: string} = {};
    units.forEach(unit => {
      const convertedValue = valueInBytes / unit.multiplier;
      newResults[unit.value] = formatNumber(convertedValue);
    });

    setResults(newResults);
    toast.success('Conversão realizada!');
  };

  const copyResult = (value: string, unit: string) => {
    navigator.clipboard.writeText(value);
    toast.success(`Valor em ${unit} copiado!`);
  };

  const getCommonSizes = () => [
    { name: 'Foto JPEG (Alta qualidade)', size: 5, unit: 'megabytes' },
    { name: 'Música MP3 (4 min)', size: 4, unit: 'megabytes' },
    { name: 'Vídeo HD (1 min)', size: 100, unit: 'megabytes' },
    { name: 'Filme Full HD', size: 4, unit: 'gigabytes' },
    { name: 'Jogo AAA', size: 50, unit: 'gigabytes' },
    { name: 'Sistema Operacional', size: 20, unit: 'gigabytes' }
  ];

  const loadExample = (size: number, unit: string) => {
    setInputValue(size.toString());
    setFromUnit(unit);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Conversor de Tamanho de Arquivo
          </CardTitle>
          <CardDescription>
            Converta entre diferentes unidades de armazenamento de dados (Bytes, KB, MB, GB, TB, PB)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="value">Valor:</Label>
                <Input
                  id="value"
                  type="number"
                  step="any"
                  placeholder="Digite o valor"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="from-unit">Unidade de origem:</Label>
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={convertFileSize} className="w-full">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Converter
              </Button>

              <div className="border-t pt-4">
                <Label className="text-sm font-medium">Exemplos comuns:</Label>
                <div className="mt-2 space-y-2">
                  {getCommonSizes().map((example, index) => (
                    <button
                      key={index}
                      onClick={() => loadExample(example.size, example.unit)}
                      className="w-full text-left p-2 text-xs rounded hover:bg-accent transition-colors"
                    >
                      <div className="font-medium">{example.name}</div>
                      <div className="text-muted-foreground">
                        {example.size} {units.find(u => u.value === example.unit)?.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <Label className="text-sm font-medium mb-3 block">Resultados da conversão:</Label>
              <div className="grid gap-3">
                {units.map((unit) => (
                  <div
                    key={unit.value}
                    className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg border"
                  >
                    <div>
                      <div className="font-medium">{unit.label}</div>
                      <div className="text-xs text-muted-foreground">
                        1 {unit.label} = {unit.multiplier.toLocaleString('pt-BR')} bytes
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="font-mono text-sm bg-background px-2 py-1 rounded">
                        {results[unit.value] || '0'}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyResult(results[unit.value] || '0', unit.label)}
                        disabled={!results[unit.value]}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};