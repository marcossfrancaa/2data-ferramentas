import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Percent, Calculator, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CalculationType = 'percentOf' | 'percentageIncrease' | 'percentageDecrease' | 'whatPercent';

interface CalculationResult {
  type: CalculationType;
  result: number;
  formula: string;
  explanation: string;
}

export const PercentageCalculator = () => {
  const [calculationType, setCalculationType] = useState<CalculationType>('percentOf');
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const { toast } = useToast();

  const calculations = {
    percentOf: {
      title: 'X% de Y é quanto?',
      label1: 'Porcentagem (%)',
      label2: 'Valor',
      placeholder1: '25',
      placeholder2: '200'
    },
    percentageIncrease: {
      title: 'Aumento percentual',
      label1: 'Valor inicial',
      label2: 'Porcentagem de aumento (%)',
      placeholder1: '100',
      placeholder2: '15'
    },
    percentageDecrease: {
      title: 'Desconto percentual',
      label1: 'Valor inicial',
      label2: 'Porcentagem de desconto (%)',
      placeholder1: '100',
      placeholder2: '20'
    },
    whatPercent: {
      title: 'X é quantos % de Y?',
      label1: 'Valor X',
      label2: 'Valor Y (total)',
      placeholder1: '50',
      placeholder2: '200'
    }
  };

  const calculateResult = () => {
    const num1 = parseFloat(value1);
    const num2 = parseFloat(value2);

    if (isNaN(num1) || isNaN(num2)) {
      toast({
        title: "Erro",
        description: "Digite valores numéricos válidos",
        variant: "destructive",
      });
      return;
    }

    let calculationResult: CalculationResult;

    switch (calculationType) {
      case 'percentOf':
        calculationResult = {
          type: calculationType,
          result: (num1 / 100) * num2,
          formula: `${num1}% × ${num2} = ${((num1 / 100) * num2).toFixed(2)}`,
          explanation: `${num1}% de ${num2} é ${((num1 / 100) * num2).toFixed(2)}`
        };
        break;

      case 'percentageIncrease':
        const increased = num1 + (num1 * (num2 / 100));
        calculationResult = {
          type: calculationType,
          result: increased,
          formula: `${num1} + (${num1} × ${num2}%) = ${increased.toFixed(2)}`,
          explanation: `${num1} com aumento de ${num2}% fica ${increased.toFixed(2)}`
        };
        break;

      case 'percentageDecrease':
        const decreased = num1 - (num1 * (num2 / 100));
        calculationResult = {
          type: calculationType,
          result: decreased,
          formula: `${num1} - (${num1} × ${num2}%) = ${decreased.toFixed(2)}`,
          explanation: `${num1} com desconto de ${num2}% fica ${decreased.toFixed(2)}`
        };
        break;

      case 'whatPercent':
        const percentage = (num1 / num2) * 100;
        calculationResult = {
          type: calculationType,
          result: percentage,
          formula: `(${num1} ÷ ${num2}) × 100 = ${percentage.toFixed(2)}%`,
          explanation: `${num1} representa ${percentage.toFixed(2)}% de ${num2}`
        };
        break;

      default:
        return;
    }

    setResult(calculationResult);
  };

  const clearData = () => {
    setValue1('');
    setValue2('');
    setResult(null);
  };

  const currentCalculation = calculations[calculationType];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Percent className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Calculadora de Porcentagem</h1>
        </div>
        <p className="text-muted-foreground">
          Faça diversos tipos de cálculos percentuais com explicações detalhadas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            {currentCalculation.title}
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="calculationType">Tipo de Cálculo</Label>
              <Select value={calculationType} onValueChange={(value: CalculationType) => setCalculationType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentOf">X% de Y é quanto?</SelectItem>
                  <SelectItem value="percentageIncrease">Aumento percentual</SelectItem>
                  <SelectItem value="percentageDecrease">Desconto percentual</SelectItem>
                  <SelectItem value="whatPercent">X é quantos % de Y?</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="value1">{currentCalculation.label1}</Label>
              <Input
                id="value1"
                type="number"
                step="any"
                value={value1}
                onChange={(e) => setValue1(e.target.value)}
                placeholder={currentCalculation.placeholder1}
                className="text-lg"
              />
            </div>

            <div>
              <Label htmlFor="value2">{currentCalculation.label2}</Label>
              <Input
                id="value2"
                type="number"
                step="any"
                value={value2}
                onChange={(e) => setValue2(e.target.value)}
                placeholder={currentCalculation.placeholder2}
                className="text-lg"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={calculateResult}
                disabled={!value1 || !value2}
                className="flex-1"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calcular
              </Button>
              
              <Button
                onClick={clearData}
                variant="outline"
              >
                Limpar
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Resultado
          </h3>
          
          <div className="space-y-4">
            {result ? (
              <div className="space-y-4">
                <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {result.type === 'whatPercent' 
                      ? `${result.result.toFixed(2)}%`
                      : result.result.toLocaleString('pt-BR', { 
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2 
                        })
                    }
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {result.explanation}
                  </div>
                </div>

                <div className="p-4 bg-secondary/20 rounded-lg">
                  <div className="font-semibold text-card-foreground mb-2">
                    Fórmula utilizada:
                  </div>
                  <div className="font-mono text-sm text-muted-foreground">
                    {result.formula}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Percent className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Preencha os valores para calcular</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Tipos de Cálculo</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>X% de Y:</strong> Calcula uma porcentagem de um valor</li>
              <li>• <strong>Aumento:</strong> Adiciona uma porcentagem ao valor original</li>
              <li>• <strong>Desconto:</strong> Subtrai uma porcentagem do valor original</li>
              <li>• <strong>Proporção:</strong> Descobre que porcentagem um valor representa</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};