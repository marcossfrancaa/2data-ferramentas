import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calculator, DollarSign, Calendar, Percent, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface CalculationResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  amortizationSchedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>;
}

export const MortgageCalculator = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const calculateMortgage = () => {
    const principal = parseFloat(loanAmount) - parseFloat(downPayment || '0');
    const monthlyRate = parseFloat(interestRate) / 100 / 12;
    const numberOfPayments = parseFloat(loanTerm) * 12;

    if (principal <= 0 || monthlyRate < 0 || numberOfPayments <= 0) {
      toast.error('Por favor, insira valores válidos');
      return;
    }

    // Fórmula do pagamento mensal
    const monthlyPayment = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalPayment = monthlyPayment * numberOfPayments;
    const totalInterest = totalPayment - principal;

    // Tabela de amortização
    const amortizationSchedule = [];
    let balance = principal;

    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      amortizationSchedule.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }

    setResult({
      monthlyPayment,
      totalPayment,
      totalInterest,
      amortizationSchedule
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de Financiamento</CardTitle>
          <CardDescription>
            Calcule as parcelas e o custo total do seu financiamento imobiliário
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="loanAmount">Valor do Imóvel (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="350000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="downPayment">Entrada (R$)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="downPayment"
                  type="number"
                  placeholder="70000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="interestRate">Taxa de Juros Anual (%)</Label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  placeholder="9.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="loanTerm">Prazo (anos)</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="loanTerm"
                  type="number"
                  placeholder="30"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Button onClick={calculateMortgage} className="w-full">
            <Calculator className="mr-2 h-4 w-4" />
            Calcular Financiamento
          </Button>

          {result && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(result.monthlyPayment)}
                    </div>
                    <p className="text-sm text-muted-foreground">Parcela Mensal</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold">
                      {formatCurrency(result.totalPayment)}
                    </div>
                    <p className="text-sm text-muted-foreground">Total a Pagar</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(result.totalInterest)}
                    </div>
                    <p className="text-sm text-muted-foreground">Total de Juros</p>
                  </CardContent>
                </Card>
              </div>

              <div className="p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Resumo do Financiamento</h3>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Valor Financiado:</span>
                    <span className="font-medium">
                      {formatCurrency(parseFloat(loanAmount) - parseFloat(downPayment || '0'))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxa Mensal:</span>
                    <span className="font-medium">
                      {(parseFloat(interestRate) / 12).toFixed(3)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Número de Parcelas:</span>
                    <span className="font-medium">{parseFloat(loanTerm) * 12}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Custo Efetivo Total:</span>
                    <span className="font-medium">
                      {((result.totalInterest / (parseFloat(loanAmount) - parseFloat(downPayment || '0'))) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  variant="outline"
                  onClick={() => setShowSchedule(!showSchedule)}
                  className="w-full"
                >
                  {showSchedule ? 'Ocultar' : 'Mostrar'} Tabela de Amortização
                </Button>

                {showSchedule && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Mês</th>
                          <th className="text-right p-2">Parcela</th>
                          <th className="text-right p-2">Amortização</th>
                          <th className="text-right p-2">Juros</th>
                          <th className="text-right p-2">Saldo Devedor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.amortizationSchedule.slice(0, 12).map((row) => (
                          <tr key={row.month} className="border-b">
                            <td className="p-2">{row.month}</td>
                            <td className="text-right p-2">{formatCurrency(row.payment)}</td>
                            <td className="text-right p-2">{formatCurrency(row.principal)}</td>
                            <td className="text-right p-2">{formatCurrency(row.interest)}</td>
                            <td className="text-right p-2">{formatCurrency(row.balance)}</td>
                          </tr>
                        ))}
                        {result.amortizationSchedule.length > 12 && (
                          <tr>
                            <td colSpan={5} className="text-center p-2 text-muted-foreground">
                              ... mais {result.amortizationSchedule.length - 12} meses
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};