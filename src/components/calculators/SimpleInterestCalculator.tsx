import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calculator, DollarSign, Percent, Calendar, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export const SimpleInterestCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [timeUnit, setTimeUnit] = useState('years');
  const [interest, setInterest] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  const calculateInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    let t = parseFloat(time);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) {
      toast.error('Por favor, insira valores válidos');
      return;
    }

    // Converter tempo para anos se necessário
    if (timeUnit === 'months') {
      t = t / 12;
    } else if (timeUnit === 'days') {
      t = t / 365;
    }

    // Fórmula: J = P * i * t
    const simpleInterest = p * (r / 100) * t;
    const totalAmount = p + simpleInterest;

    setInterest(simpleInterest);
    setTotal(totalAmount);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTimeLabel = () => {
    switch (timeUnit) {
      case 'days': return 'dias';
      case 'months': return 'meses';
      default: return 'anos';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Juros Simples</CardTitle>
          <CardDescription>
            Calcule os juros simples sobre um capital inicial
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="principal">Capital Inicial (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="principal"
                  type="number"
                  step="0.01"
                  placeholder="1000.00"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="rate">Taxa de Juros (% ao ano)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="rate"
                  type="number"
                  step="0.01"
                  placeholder="10"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="time">Período</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="time"
                    type="number"
                    step="1"
                    placeholder="2"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  className="px-3 py-2 border rounded-md bg-background"
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value)}
                >
                  <option value="days">Dias</option>
                  <option value="months">Meses</option>
                  <option value="years">Anos</option>
                </select>
              </div>
            </div>
          </div>

          <Button onClick={calculateInterest} className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            Calcular Juros
          </Button>

          {interest !== null && total !== null && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Juros Gerados</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {formatCurrency(interest)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Montante Total</h4>
                        <p className="text-2xl font-bold text-primary">
                          {formatCurrency(total)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-secondary/50 rounded-lg">
                <h3 className="font-semibold mb-2">Detalhamento do Cálculo</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Capital Inicial:</span>
                    <span className="font-medium">{formatCurrency(parseFloat(principal))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa de Juros:</span>
                    <span className="font-medium">{rate}% ao ano</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Período:</span>
                    <span className="font-medium">{time} {getTimeLabel()}</span>
                  </div>
                  <div className="border-t pt-1 mt-1">
                    <div className="flex justify-between">
                      <span>Fórmula:</span>
                      <span className="font-mono text-xs">J = P × i × t</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cálculo:</span>
                      <span className="font-mono text-xs">
                        {principal} × {rate}% × {timeUnit === 'years' ? time : 
                          timeUnit === 'months' ? `${time}/12` : `${time}/365`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h3 className="font-semibold mb-2">Sobre Juros Simples</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Os juros incidem apenas sobre o capital inicial</li>
                  <li>• O valor dos juros é constante em cada período</li>
                  <li>• Não há juros sobre juros (capitalização)</li>
                  <li>• Ideal para empréstimos de curto prazo</li>
                  <li>• Fórmula: Juros = Capital × Taxa × Tempo</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};