import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calculator, DollarSign, Users, Percent, Receipt } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface TipResult {
  tipAmount: number;
  totalAmount: number;
  tipPerPerson: number;
  totalPerPerson: number;
}

export const TipCalculator = () => {
  const [billAmount, setBillAmount] = useState('');
  const [tipPercent, setTipPercent] = useState(10);
  const [customTip, setCustomTip] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('1');
  const [serviceQuality, setServiceQuality] = useState('');
  const [result, setResult] = useState<TipResult | null>(null);

  const tipPresets = [5, 10, 15, 20, 25];
  
  const servicePresets = [
    { value: '5', label: 'Ruim', emoji: '😞' },
    { value: '10', label: 'Razoável', emoji: '😐' },
    { value: '15', label: 'Bom', emoji: '🙂' },
    { value: '20', label: 'Ótimo', emoji: '😊' },
    { value: '25', label: 'Excelente', emoji: '🤩' }
  ];

  useEffect(() => {
    calculateTip();
  }, [billAmount, tipPercent, numberOfPeople]);

  const calculateTip = () => {
    const bill = parseFloat(billAmount);
    const people = parseInt(numberOfPeople) || 1;

    if (isNaN(bill) || bill <= 0) {
      setResult(null);
      return;
    }

    const tipAmount = bill * (tipPercent / 100);
    const totalAmount = bill + tipAmount;
    const tipPerPerson = tipAmount / people;
    const totalPerPerson = totalAmount / people;

    setResult({
      tipAmount,
      totalAmount,
      tipPerPerson,
      totalPerPerson
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleServiceQualityChange = (value: string) => {
    setServiceQuality(value);
    setTipPercent(parseInt(value));
  };

  const handleCustomTipChange = (value: string) => {
    setCustomTip(value);
    const customValue = parseFloat(value);
    if (!isNaN(customValue) && customValue >= 0) {
      setTipPercent(customValue);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Gorjeta</CardTitle>
          <CardDescription>
            Calcule a gorjeta ideal e divida a conta entre amigos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="billAmount">Valor da Conta (R$)</Label>
                <div className="relative">
                  <Receipt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="billAmount"
                    type="number"
                    step="0.01"
                    placeholder="100.00"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="numberOfPeople">Número de Pessoas</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="numberOfPeople"
                    type="number"
                    min="1"
                    placeholder="1"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label>Qualidade do Serviço</Label>
                <RadioGroup value={serviceQuality} onValueChange={handleServiceQualityChange}>
                  <div className="space-y-2 mt-2">
                    {servicePresets.map((preset) => (
                      <div key={preset.value} className="flex items-center space-x-2">
                        <RadioGroupItem value={preset.value} id={preset.value} />
                        <Label 
                          htmlFor={preset.value} 
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <span>{preset.emoji}</span>
                          <span>{preset.label} ({preset.value}%)</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Porcentagem da Gorjeta: {tipPercent}%</Label>
                <div className="mt-2">
                  <Slider
                    value={[tipPercent]}
                    onValueChange={(value) => {
                      setTipPercent(value[0]);
                      setServiceQuality('');
                    }}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>

              <div>
                <Label>Botões Rápidos</Label>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {tipPresets.map((preset) => (
                    <Button
                      key={preset}
                      variant={tipPercent === preset ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setTipPercent(preset);
                        setServiceQuality('');
                      }}
                    >
                      {preset}%
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="customTip">Gorjeta Personalizada (%)</Label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="customTip"
                    type="number"
                    step="0.1"
                    placeholder="Ex: 12.5"
                    value={customTip}
                    onChange={(e) => handleCustomTipChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {result && (
            <div className="space-y-4 border-t pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Gorjeta</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(result.tipAmount)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Total</p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(result.totalAmount)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Gorjeta p/ Pessoa</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(result.tipPerPerson)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Total p/ Pessoa</p>
                      <p className="text-xl font-bold text-primary">
                        {formatCurrency(result.totalPerPerson)}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-secondary/50 rounded-lg">
                <h3 className="font-semibold mb-3">Resumo da Conta</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Valor Original:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(billAmount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gorjeta ({tipPercent}%):</span>
                    <span className="font-medium text-green-600">+ {formatCurrency(result.tipAmount)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total Final:</span>
                      <span className="text-primary">{formatCurrency(result.totalAmount)}</span>
                    </div>
                  </div>
                  {parseInt(numberOfPeople) > 1 && (
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span>Dividido por {numberOfPeople} pessoas:</span>
                        <span className="font-medium">{formatCurrency(result.totalPerPerson)} cada</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h3 className="font-semibold mb-2">Dicas sobre Gorjetas</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• No Brasil, 10% é o padrão em restaurantes</li>
                  <li>• Em bares e cafés, 10-15% é apropriado</li>
                  <li>• Para delivery, considere R$ 5-10 ou 10%</li>
                  <li>• Em salões e spas, 10-20% é comum</li>
                  <li>• Verifique se a gorjeta já está incluída na conta</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};