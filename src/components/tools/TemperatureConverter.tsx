import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, Thermometer } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const temperatureUnits = [
  { code: 'C', name: 'Celsius', symbol: '°C' },
  { code: 'F', name: 'Fahrenheit', symbol: '°F' },
  { code: 'K', name: 'Kelvin', symbol: 'K' },
  { code: 'R', name: 'Rankine', symbol: '°R' },
  { code: 'Re', name: 'Réaumur', symbol: '°Ré' }
];

export const TemperatureConverter = () => {
  const [temperature, setTemperature] = useState('0');
  const [fromUnit, setFromUnit] = useState('C');
  const [toUnit, setToUnit] = useState('F');
  const [result, setResult] = useState('');

  const convertTemperature = () => {
    const inputTemp = parseFloat(temperature);
    if (isNaN(inputTemp)) {
      toast({
        title: "Temperatura inválida",
        description: "Digite um valor numérico válido",
        variant: "destructive"
      });
      return;
    }

    let celsius = inputTemp;

    // Converter entrada para Celsius
    switch (fromUnit) {
      case 'F':
        celsius = (inputTemp - 32) * 5/9;
        break;
      case 'K':
        celsius = inputTemp - 273.15;
        break;
      case 'R':
        celsius = (inputTemp - 491.67) * 5/9;
        break;
      case 'Re':
        celsius = inputTemp * 5/4;
        break;
    }

    let converted = celsius;

    // Converter de Celsius para unidade de destino
    switch (toUnit) {
      case 'F':
        converted = celsius * 9/5 + 32;
        break;
      case 'K':
        converted = celsius + 273.15;
        break;
      case 'R':
        converted = celsius * 9/5 + 491.67;
        break;
      case 'Re':
        converted = celsius * 4/5;
        break;
    }

    const fromSymbol = temperatureUnits.find(u => u.code === fromUnit)?.symbol || fromUnit;
    const toSymbol = temperatureUnits.find(u => u.code === toUnit)?.symbol || toUnit;
    
    setResult(`${inputTemp}${fromSymbol} = ${converted.toFixed(2)}${toSymbol}`);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setResult('');
  };

  const getTemperatureInfo = (temp: number, unit: string) => {
    let celsius = temp;
    if (unit === 'F') celsius = (temp - 32) * 5/9;
    if (unit === 'K') celsius = temp - 273.15;
    if (unit === 'R') celsius = (temp - 491.67) * 5/9;
    if (unit === 'Re') celsius = temp * 5/4;

    if (celsius <= -273.15) return { color: 'text-blue-600', desc: 'Zero absoluto' };
    if (celsius < -50) return { color: 'text-blue-500', desc: 'Extremamente frio' };
    if (celsius < 0) return { color: 'text-blue-400', desc: 'Congelamento' };
    if (celsius < 10) return { color: 'text-blue-300', desc: 'Muito frio' };
    if (celsius < 20) return { color: 'text-green-400', desc: 'Frio' };
    if (celsius < 25) return { color: 'text-green-500', desc: 'Agradável' };
    if (celsius < 35) return { color: 'text-yellow-500', desc: 'Quente' };
    if (celsius < 45) return { color: 'text-orange-500', desc: 'Muito quente' };
    if (celsius >= 100) return { color: 'text-red-600', desc: 'Fervura da água' };
    return { color: 'text-red-500', desc: 'Extremamente quente' };
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          Conversor de Temperatura
        </CardTitle>
        <CardDescription>
          Converta entre diferentes escalas de temperatura
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperatura</Label>
            <Input
              id="temperature"
              type="number"
              placeholder="Digite a temperatura"
              value={temperature}
              onChange={(e) => setTemperature(e.target.value)}
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="from-unit">De</Label>
            <Select value={fromUnit} onValueChange={setFromUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {temperatureUnits.map((unit) => (
                  <SelectItem key={unit.code} value={unit.code}>
                    {unit.symbol} {unit.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={swapUnits}
            className="rounded-full"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="to-unit">Para</Label>
          <Select value={toUnit} onValueChange={setToUnit}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {temperatureUnits.map((unit) => (
                <SelectItem key={unit.code} value={unit.code}>
                  {unit.symbol} {unit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={convertTemperature} 
          className="w-full"
        >
          Converter
        </Button>

        {result && (
          <div className="p-4 bg-muted/50 rounded-lg border">
            <p className="text-lg font-semibold text-center mb-2">
              {result}
            </p>
            {temperature && (
              <div className="text-center">
                <span className={`text-sm ${getTemperatureInfo(parseFloat(temperature), fromUnit).color}`}>
                  {getTemperatureInfo(parseFloat(temperature), fromUnit).desc}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div>
            <strong>Pontos de referência:</strong>
            <ul className="mt-1 space-y-1">
              <li>Água congela: 0°C / 32°F</li>
              <li>Temperatura ambiente: ~20°C / 68°F</li>
            </ul>
          </div>
          <div>
            <strong></strong>
            <ul className="mt-1 space-y-1">
              <li>Corpo humano: 37°C / 98.6°F</li>
              <li>Água ferve: 100°C / 212°F</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};