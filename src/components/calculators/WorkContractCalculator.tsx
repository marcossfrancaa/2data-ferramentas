import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calculator, FileText } from 'lucide-react';

export const WorkContractCalculator = () => {
  const [baseSalary, setBaseSalary] = useState('');
  const [dependents, setDependents] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [terminationReason, setTerminationReason] = useState('');
  const [hasVacationDays, setHasVacationDays] = useState('no');
  const [earlyNotice, setEarlyNotice] = useState('no');
  const [result, setResult] = useState<any>(null);

  const calculateRescission = () => {
    if (!baseSalary || !startDate || !endDate || !terminationReason) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const salary = parseFloat(baseSalary);
    const start = new Date(startDate);
    const end = new Date(endDate);
    const workDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const workMonths = workDays / 30;

    // Cálculos básicos
    const dailySalary = salary / 30;
    const proportionalSalary = (workDays % 30) * dailySalary;
    
    // 13º salário proporcional
    const thirteenthSalary = (workMonths / 12) * salary;
    
    // Férias proporcionais (1/3 a mais)
    const proportionalVacation = (workMonths / 12) * salary;
    const vacationBonus = proportionalVacation / 3;
    
    // FGTS (8% sobre remunerações)
    const fgts = workMonths * salary * 0.08;
    
    // Multa FGTS (40% em caso de demissão sem justa causa)
    const fgtsFine = terminationReason === 'dismissal' ? fgts * 0.4 : 0;
    
    // Aviso prévio
    const priorNoticeValue = earlyNotice === 'yes' ? salary : 0;

    const totalValue = proportionalSalary + thirteenthSalary + proportionalVacation + vacationBonus + fgtsFine + priorNoticeValue;

    setResult({
      workDays,
      workMonths: workMonths.toFixed(1),
      proportionalSalary,
      thirteenthSalary,
      proportionalVacation,
      vacationBonus,
      fgts,
      fgtsFine,
      priorNoticeValue,
      totalValue
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
            <Calculator className="w-6 h-6" />
            Cálculo de rescisão de contrato
          </CardTitle>
          <CardDescription className="text-center">
            Calcule a rescisão de contrato de trabalho de forma simples. Preencha os campos e aperte em Calcular para conhecer o valor detalhado do acerto trabalhista.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold">Dados:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary">1. Salário base</Label>
                <Input
                  id="salary"
                  placeholder="0,00"
                  value={baseSalary}
                  onChange={(e) => setBaseSalary(e.target.value)}
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
                <Label htmlFor="start-date">3. Início do contrato de trabalho</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="end-date">4. Fim do contrato de trabalho</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>5. Motivo da rescisão contratual</Label>
              <Select value={terminationReason} onValueChange={setTerminationReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dismissal">Pedido de demissão</SelectItem>
                  <SelectItem value="termination">Demissão sem justa causa</SelectItem>
                  <SelectItem value="just-cause">Demissão por justa causa</SelectItem>
                  <SelectItem value="agreement">Acordo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>6. Você possui férias vencidas?</Label>
              <RadioGroup value={hasVacationDays} onValueChange={setHasVacationDays}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="vacation-yes" />
                  <Label htmlFor="vacation-yes">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="vacation-no" />
                  <Label htmlFor="vacation-no">Não</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>7. O aviso prévio foi cumprido?</Label>
              <RadioGroup value={earlyNotice} onValueChange={setEarlyNotice}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="notice-yes" />
                  <Label htmlFor="notice-yes">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="notice-no" />
                  <Label htmlFor="notice-no">Não</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={calculateRescission}
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
                  <FileText className="w-5 h-5" />
                  Resultado do Cálculo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p><strong>Período trabalhado:</strong> {result.workDays} dias ({result.workMonths} meses)</p>
                    <p><strong>Salário proporcional:</strong> {formatCurrency(result.proportionalSalary)}</p>
                    <p><strong>13º salário proporcional:</strong> {formatCurrency(result.thirteenthSalary)}</p>
                    <p><strong>Férias proporcionais:</strong> {formatCurrency(result.proportionalVacation)}</p>
                  </div>
                  <div className="space-y-2">
                    <p><strong>1/3 férias:</strong> {formatCurrency(result.vacationBonus)}</p>
                    <p><strong>FGTS depositado:</strong> {formatCurrency(result.fgts)}</p>
                    <p><strong>Multa FGTS (40%):</strong> {formatCurrency(result.fgtsFine)}</p>
                    <p><strong>Aviso prévio:</strong> {formatCurrency(result.priorNoticeValue)}</p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xl font-bold text-primary">
                    <strong>Total a receber:</strong> {formatCurrency(result.totalValue)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Importante:</strong> esta ferramenta serve para dar uma noção do valor de rescisão de contrato mas não deve ser usada em substituição a um profissional habilitado. A me utilização dos dados aqui gerados é de total responsabilidade do usuário.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};