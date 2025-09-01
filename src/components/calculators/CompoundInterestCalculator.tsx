import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Calculator, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompoundResult {
  finalAmount: number;
  totalInterest: number;
  monthlyBreakdown: Array<{
    month: number;
    principal: number;
    interest: number;
    total: number;
  }>;
}

export const CompoundInterestCalculator = () => {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState('12'); // Mensal por padrão
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [result, setResult] = useState<CompoundResult | null>(null);
  const { toast } = useToast();

  const frequencies = [
    { value: '1', label: 'Anual' },
    { value: '2', label: 'Semestral' },
    { value: '4', label: 'Trimestral' },
    { value: '12', label: 'Mensal' },
    { value: '365', label: 'Diário' }
  ];

  const calculateCompoundInterest = () => {
    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const n = parseFloat(frequency);
    const PMT = parseFloat(monthlyContribution) || 0;

    if (isNaN(P) || isNaN(r) || isNaN(t) || P <= 0 || r < 0 || t <= 0) {
      toast({
        title: "Erro",
        description: "Digite valores válidos para o cálculo",
        variant: "destructive",
      });
      return;
    }

    // Fórmula de juros compostos com aportes mensais
    // A = P(1 + r/n)^(nt) + PMT[((1 + r/n)^(nt) - 1)/(r/n)]
    
    const compoundFactor = Math.pow(1 + r / n, n * t);
    const principalAmount = P * compoundFactor;
    
    let contributionAmount = 0;
    if (PMT > 0) {
      contributionAmount = PMT * ((compoundFactor - 1) / (r / n));
    }
    
    const finalAmount = principalAmount + contributionAmount;
    const totalInterest = finalAmount - P - (PMT * 12 * t);

    // Calcular breakdown mensal
    const monthlyBreakdown = [];
    let currentPrincipal = P;
    let totalContributions = P;
    
    for (let month = 1; month <= t * 12; month++) {
      const monthlyInterestRate = r / 12;
      const interestEarned = currentPrincipal * monthlyInterestRate;
      currentPrincipal += interestEarned + PMT;
      totalContributions += PMT;
      
      if (month % 12 === 0 || month === Math.floor(t * 12)) {
        monthlyBreakdown.push({
          month: month,
          principal: totalContributions,
          interest: currentPrincipal - totalContributions,
          total: currentPrincipal
        });
      }
    }

    setResult({
      finalAmount,
      totalInterest,
      monthlyBreakdown
    });
  };

  const clearData = () => {
    setPrincipal('');
    setRate('');
    setTime('');
    setMonthlyContribution('');
    setResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Calculadora de Juros Compostos</h1>
        </div>
        <p className="text-muted-foreground">
          Calcule o crescimento de seus investimentos com juros compostos e aportes mensais.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Parâmetros do Investimento
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="principal">Capital Inicial (R$)</Label>
              <Input
                id="principal"
                type="number"
                step="0.01"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="10000"
                className="text-lg"
              />
            </div>

            <div>
              <Label htmlFor="rate">Taxa de Juros (% ao ano)</Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="10.5"
                className="text-lg"
              />
            </div>

            <div>
              <Label htmlFor="time">Período (anos)</Label>
              <Input
                id="time"
                type="number"
                step="0.1"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="5"
                className="text-lg"
              />
            </div>

            <div>
              <Label htmlFor="frequency">Capitalização</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="monthlyContribution">Aporte Mensal (R$) - Opcional</Label>
              <Input
                id="monthlyContribution"
                type="number"
                step="0.01"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
                placeholder="500"
                className="text-lg"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={calculateCompoundInterest}
                disabled={!principal || !rate || !time}
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
            Resultado Final
          </h3>
          
          <div className="space-y-4">
            {result ? (
              <div className="space-y-4">
                <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-3xl font-bold text-primary mb-2">
                    R$ {result.finalAmount.toLocaleString('pt-BR', { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Valor Total Final
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-success/10 rounded-lg">
                    <div className="text-xl font-bold text-success">
                      R$ {result.totalInterest.toLocaleString('pt-BR', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Juros Ganhos
                    </div>
                  </div>

                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <div className="text-xl font-bold text-accent">
                      {((result.finalAmount / parseFloat(principal) - 1) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Rendimento Total
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-secondary/20 rounded-lg">
                  <h4 className="font-semibold text-card-foreground mb-2">Resumo:</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capital Inicial:</span>
                      <span>R$ {parseFloat(principal).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    {monthlyContribution && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Aportes Totais:</span>
                        <span>R$ {(parseFloat(monthlyContribution) * 12 * parseFloat(time)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold">
                      <span>Juros Compostos:</span>
                      <span className="text-success">R$ {result.totalInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Preencha os dados para calcular</p>
              </div>
            )}
          </div>
        </Card>

        {result && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Evolução Anual
            </h3>
            
            <div className="space-y-3">
              {result.monthlyBreakdown.map((year, index) => (
                <div key={index} className="p-3 bg-accent/5 rounded-lg">
                  <div className="font-semibold text-card-foreground mb-2">
                    Ano {Math.ceil(year.month / 12)}
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Principal:</span>
                      <span>R$ {year.principal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Juros:</span>
                      <span className="text-success">R$ {year.interest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>Total:</span>
                      <span>R$ {year.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Fórmula dos Juros Compostos</h4>
            <p className="text-muted-foreground">
              A = P(1 + r/n)^(nt) + PMT[((1 + r/n)^(nt) - 1)/(r/n)], onde A é o montante final, 
              P é o capital inicial, r é a taxa, n é a frequência de capitalização, t é o tempo e PMT são os aportes.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};