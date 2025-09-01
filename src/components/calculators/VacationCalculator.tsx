import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calculator, Palmtree } from 'lucide-react';

export const VacationCalculator = () => {
  const [grossSalary, setGrossSalary] = useState('');
  const [dependents, setDependents] = useState('');
  const [vacationDays, setVacationDays] = useState('30');
  const [advancePayment, setAdvancePayment] = useState('no');
  const [result, setResult] = useState<any>(null);

  const calculateVacation = () => {
    if (!grossSalary) {
      alert('Por favor, preencha o salário bruto.');
      return;
    }

    const salary = parseFloat(grossSalary);
    const days = parseInt(vacationDays);
    const dependentsCount = parseInt(dependents) || 0;

    // Valor das férias proporcionais
    const vacationValue = (salary / 30) * days;
    
    // 1/3 constitucional das férias
    const constitutionalThird = vacationValue / 3;
    
    // Total bruto das férias
    const totalGross = vacationValue + constitutionalThird;
    
    // Cálculo do INSS (2024)
    let inssDiscount = 0;
    if (salary <= 1412) {
      inssDiscount = salary * 0.075;
    } else if (salary <= 2666.68) {
      inssDiscount = 105.90 + (salary - 1412) * 0.09;
    } else if (salary <= 4000.03) {
      inssDiscount = 225.87 + (salary - 2666.68) * 0.12;
    } else if (salary <= 7786.02) {
      inssDiscount = 385.87 + (salary - 4000.03) * 0.14;
    } else {
      inssDiscount = 908.85;
    }
    
    // Cálculo do IR sobre férias
    const irBase = totalGross - inssDiscount - (dependentsCount * 189.59);
    let irDiscount = 0;
    if (irBase > 2112) {
      if (irBase <= 2826.65) {
        irDiscount = irBase * 0.075 - 158.40;
      } else if (irBase <= 3751.05) {
        irDiscount = irBase * 0.15 - 370.40;
      } else if (irBase <= 4664.68) {
        irDiscount = irBase * 0.225 - 651.73;
      } else {
        irDiscount = irBase * 0.275 - 884.96;
      }
    }
    
    const totalNet = totalGross - inssDiscount - irDiscount;

    setResult({
      days,
      vacationValue,
      constitutionalThird,
      totalGross,
      inssDiscount,
      irDiscount,
      totalNet
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Palmtree className="w-6 h-6" />
            Cálculo de Férias
          </CardTitle>
          <CardDescription className="text-center">
            Preencha com os valores do seu salário bruto, dias de férias e dependentes e calcule o valor que o trabalhador tem a receber nas férias com resultado detalhado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold">Dados:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary">1. Salário bruto</Label>
                <Input
                  id="salary"
                  placeholder="0,00"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(e.target.value)}
                  type="number"
                  step="0.01"
                />
              </div>

              <div>
                <Label htmlFor="dependents">2. Nº de dependentes</Label>
                <Input
                  id="dependents"
                  placeholder="0"
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                  type="number"
                />
              </div>

              <div>
                <Label>3. Dias de férias</Label>
                <Select value={vacationDays} onValueChange={setVacationDays}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 (desejo tirar os 30 dias de férias)</SelectItem>
                    <SelectItem value="25">25 dias</SelectItem>
                    <SelectItem value="20">20 dias</SelectItem>
                    <SelectItem value="15">15 dias</SelectItem>
                    <SelectItem value="10">10 dias</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>4. Adiantar 1ª Parcela do 13º Salário</Label>
                <RadioGroup value={advancePayment} onValueChange={setAdvancePayment}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="advance-yes" />
                    <Label htmlFor="advance-yes">Sim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="advance-no" />
                    <Label htmlFor="advance-no">Não</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={calculateVacation}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white px-8 py-2"
              >
                <Calculator className="w-4 h-4 mr-2" />
                CALCULAR
              </Button>
            </div>
          </div>

          {result && (
            <Card className="bg-gradient-subtle">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palmtree className="w-5 h-5" />
                  Resultado do Cálculo de Férias
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Valores Brutos:</h4>
                    <div className="space-y-2">
                      <p><strong>Dias de férias:</strong> {result.days} dias</p>
                      <p><strong>Valor das férias:</strong> {formatCurrency(result.vacationValue)}</p>
                      <p><strong>1/3 constitucional:</strong> {formatCurrency(result.constitutionalThird)}</p>
                      <p className="text-lg font-semibold text-primary">
                        <strong>Total bruto:</strong> {formatCurrency(result.totalGross)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-lg">Descontos:</h4>
                    <div className="space-y-2">
                      <p><strong>Desconto INSS:</strong> {formatCurrency(result.inssDiscount)}</p>
                      <p><strong>Desconto IR:</strong> {formatCurrency(result.irDiscount)}</p>
                      <p className="text-lg font-semibold text-green-600">
                        <strong>Total líquido:</strong> {formatCurrency(result.totalNet)}
                      </p>
                    </div>
                  </div>
                </div>
                
                {advancePayment === 'yes' && (
                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">Adiantamento 13º Salário:</h4>
                    <p><strong>1ª Parcela 13º:</strong> {formatCurrency(parseFloat(grossSalary) / 2)}</p>
                    <p className="text-xl font-bold text-primary mt-2">
                      <strong>Total com adiantamento:</strong> {formatCurrency(result.totalNet + (parseFloat(grossSalary) / 2))}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};