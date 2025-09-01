import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Ruler, Copy, ArrowUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const UnitConverter = () => {
  const [value, setValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [category, setCategory] = useState('length');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const conversions = {
    length: {
      name: 'Comprimento',
      units: {
        mm: { name: 'Milímetros', factor: 0.001 },
        cm: { name: 'Centímetros', factor: 0.01 },
        m: { name: 'Metros', factor: 1 },
        km: { name: 'Quilômetros', factor: 1000 },
        in: { name: 'Polegadas', factor: 0.0254 },
        ft: { name: 'Pés', factor: 0.3048 },
        yd: { name: 'Jardas', factor: 0.9144 },
        mi: { name: 'Milhas', factor: 1609.344 }
      }
    },
    weight: {
      name: 'Peso',
      units: {
        mg: { name: 'Miligramas', factor: 0.000001 },
        g: { name: 'Gramas', factor: 0.001 },
        kg: { name: 'Quilogramas', factor: 1 },
        oz: { name: 'Onças', factor: 0.0283495 },
        lb: { name: 'Libras', factor: 0.453592 },
        ton: { name: 'Toneladas', factor: 1000 }
      }
    },
    temperature: {
      name: 'Temperatura',
      units: {
        c: { name: 'Celsius', factor: 1 },
        f: { name: 'Fahrenheit', factor: 1 },
        k: { name: 'Kelvin', factor: 1 }
      }
    },
    volume: {
      name: 'Volume',
      units: {
        ml: { name: 'Mililitros', factor: 0.001 },
        l: { name: 'Litros', factor: 1 },
        m3: { name: 'Metros Cúbicos', factor: 1000 },
        cup: { name: 'Xícaras (US)', factor: 0.236588 },
        pt: { name: 'Pints (US)', factor: 0.473176 },
        qt: { name: 'Quartos (US)', factor: 0.946353 },
        gal: { name: 'Galões (US)', factor: 3.78541 }
      }
    },
    area: {
      name: 'Área',
      units: {
        mm2: { name: 'Milímetros²', factor: 0.000001 },
        cm2: { name: 'Centímetros²', factor: 0.0001 },
        m2: { name: 'Metros²', factor: 1 },
        km2: { name: 'Quilômetros²', factor: 1000000 },
        in2: { name: 'Polegadas²', factor: 0.00064516 },
        ft2: { name: 'Pés²', factor: 0.092903 },
        acre: { name: 'Acres', factor: 4046.86 },
        ha: { name: 'Hectares', factor: 10000 }
      }
    }
  };

  const convertTemperature = (value: number, from: string, to: string) => {
    // Convert to Celsius first
    let celsius = value;
    if (from === 'f') celsius = (value - 32) * 5/9;
    if (from === 'k') celsius = value - 273.15;

    // Convert from Celsius to target
    if (to === 'c') return celsius;
    if (to === 'f') return (celsius * 9/5) + 32;
    if (to === 'k') return celsius + 273.15;
    return celsius;
  };

  const convert = () => {
    if (!value || !fromUnit || !toUnit) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const inputValue = parseFloat(value);
    if (isNaN(inputValue)) {
      toast({
        title: "Erro",
        description: "Por favor, insira um valor numérico válido",
        variant: "destructive",
      });
      return;
    }

    let convertedValue: number;

    if (category === 'temperature') {
      convertedValue = convertTemperature(inputValue, fromUnit, toUnit);
    } else {
      const currentCategory = conversions[category as keyof typeof conversions];
      const units = currentCategory.units as Record<string, { name: string; factor: number }>;
      const fromFactor = units[fromUnit].factor;
      const toFactor = units[toUnit].factor;
      
      // Convert to base unit then to target unit
      const baseValue = inputValue * fromFactor;
      convertedValue = baseValue / toFactor;
    }

    setResult(convertedValue.toString());
    
    toast({
      title: "Conversão realizada",
      description: `${value} ${getCurrentUnits()[fromUnit]?.name} = ${convertedValue.toFixed(6)} ${getCurrentUnits()[toUnit]?.name}`,
    });
  };

  const getCurrentUnits = (): Record<string, { name: string; factor: number }> => {
    return conversions[category as keyof typeof conversions].units as Record<string, { name: string; factor: number }>;
  };

  const copyResult = async () => {
    if (!result) return;
    
    try {
      await navigator.clipboard.writeText(result);
      toast({
        title: "Copiado!",
        description: "Resultado copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o resultado",
        variant: "destructive",
      });
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result) {
      setValue(result);
      setResult('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Ruler className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Conversor de Unidades</h1>
        </div>
        <p className="text-muted-foreground">
          Converta entre diferentes unidades de medida: comprimento, peso, temperatura, volume e área.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={(val) => {
              setCategory(val);
              setFromUnit('');
              setToUnit('');
              setResult('');
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(conversions).map(([key, cat]) => (
                  <SelectItem key={key} value={key}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="value">Valor</Label>
            <Input
              id="value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Digite o valor..."
            />
          </div>

          <div>
            <Label htmlFor="result">Resultado</Label>
            <div className="flex gap-2">
              <Input
                id="result"
                value={result}
                readOnly
                placeholder="Resultado aparecerá aqui"
              />
              {result && (
                <Button variant="outline" size="icon" onClick={copyResult}>
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="from-unit">De</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Unidade de origem" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(getCurrentUnits()).map(([key, unit]) => (
                  <SelectItem key={key} value={key}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end justify-center">
            <Button variant="outline" onClick={swapUnits} disabled={!fromUnit || !toUnit}>
              <ArrowUpDown className="w-4 h-4" />
            </Button>
          </div>

          <div>
            <Label htmlFor="to-unit">Para</Label>
            <Select value={toUnit} onValueChange={setToUnit}>
              <SelectTrigger>
                <SelectValue placeholder="Unidade de destino" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(getCurrentUnits()).map(([key, unit]) => (
                  <SelectItem key={key} value={key}>
                    {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={convert}
          className="w-full bg-gradient-primary hover:opacity-90 transition-fast"
        >
          <Ruler className="w-4 h-4 mr-2" />
          Converter
        </Button>
      </Card>

      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Ruler className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Conversões Suportadas</h4>
            <p className="text-muted-foreground">
              <strong>Comprimento:</strong> mm, cm, m, km, polegadas, pés, jardas, milhas<br/>
              <strong>Peso:</strong> mg, g, kg, onças, libras, toneladas<br/>
              <strong>Temperatura:</strong> Celsius, Fahrenheit, Kelvin<br/>
              <strong>Volume:</strong> ml, l, m³, xícaras, pints, quartos, galões<br/>
              <strong>Área:</strong> mm², cm², m², km², polegadas², pés², acres, hectares
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};