import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calculator, Percent, DollarSign, Copy } from 'lucide-react';
import { toast } from 'sonner';

export const DiscountCalculator = () => {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountPercent, setDiscountPercent] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [finalPrice, setFinalPrice] = useState('');
  const [results, setResults] = useState<{
    originalPrice: number;
    discountPercent: number;
    discountAmount: number;
    finalPrice: number;
    savings: number;
  } | null>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const calculateFromPercent = () => {
    const original = parseFloat(originalPrice);
    const percent = parseFloat(discountPercent);

    if (isNaN(original) || isNaN(percent) || original <= 0 || percent < 0 || percent > 100) {
      toast.error('Digite valores válidos');
      return;
    }

    const discountValue = (original * percent) / 100;
    const final = original - discountValue;

    setResults({
      originalPrice: original,
      discountPercent: percent,
      discountAmount: discountValue,
      finalPrice: final,
      savings: discountValue
    });

    toast.success('Desconto calculado!');
  };

  const calculateFromAmount = () => {
    const original = parseFloat(originalPrice);
    const amount = parseFloat(discountAmount);

    if (isNaN(original) || isNaN(amount) || original <= 0 || amount < 0 || amount > original) {
      toast.error('Digite valores válidos');
      return;
    }

    const percent = (amount / original) * 100;
    const final = original - amount;

    setResults({
      originalPrice: original,
      discountPercent: percent,
      discountAmount: amount,
      finalPrice: final,
      savings: amount
    });

    toast.success('Desconto calculado!');
  };

  const calculateFromFinal = () => {
    const original = parseFloat(originalPrice);
    const final = parseFloat(finalPrice);

    if (isNaN(original) || isNaN(final) || original <= 0 || final < 0 || final > original) {
      toast.error('Digite valores válidos');
      return;
    }

    const amount = original - final;
    const percent = (amount / original) * 100;

    setResults({
      originalPrice: original,
      discountPercent: percent,
      discountAmount: amount,
      finalPrice: final,
      savings: amount
    });

    toast.success('Desconto calculado!');
  };

  const copyResult = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success('Valor copiado!');
  };

  const getCommonDiscounts = () => [
    { percent: 10, label: '10% off' },
    { percent: 15, label: '15% off' },
    { percent: 20, label: '20% off' },
    { percent: 25, label: '25% off' },
    { percent: 30, label: '30% off' },
    { percent: 50, label: '50% off' }
  ];

  const applyQuickDiscount = (percent: number) => {
    if (!originalPrice) {
      toast.error('Digite o preço original primeiro');
      return;
    }
    setDiscountPercent(percent.toString());
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculadora de Desconto
          </CardTitle>
          <CardDescription>
            Calcule descontos, preços finais e economias de forma rápida e precisa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <Label htmlFor="original-price">Preço original (R$):</Label>
                <Input
                  id="original-price"
                  type="number"
                  step="0.01"
                  placeholder="100.00"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                />
              </div>

              <Tabs defaultValue="percent" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="percent">Por %</TabsTrigger>
                  <TabsTrigger value="amount">Por Valor</TabsTrigger>
                  <TabsTrigger value="final">Preço Final</TabsTrigger>
                </TabsList>
                
                <TabsContent value="percent" className="space-y-4">
                  <div>
                    <Label htmlFor="discount-percent">Desconto (%):</Label>
                    <Input
                      id="discount-percent"
                      type="number"
                      step="0.01"
                      max="100"
                      placeholder="20"
                      value={discountPercent}
                      onChange={(e) => setDiscountPercent(e.target.value)}
                    />
                  </div>
                  <Button onClick={calculateFromPercent} className="w-full">
                    <Percent className="h-4 w-4 mr-2" />
                    Calcular por Porcentagem
                  </Button>
                  
                  <div>
                    <Label className="text-sm font-medium">Descontos comuns:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {getCommonDiscounts().map((discount) => (
                        <Badge
                          key={discount.percent}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          onClick={() => applyQuickDiscount(discount.percent)}
                        >
                          {discount.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="amount" className="space-y-4">
                  <div>
                    <Label htmlFor="discount-amount">Valor do desconto (R$):</Label>
                    <Input
                      id="discount-amount"
                      type="number"
                      step="0.01"
                      placeholder="20.00"
                      value={discountAmount}
                      onChange={(e) => setDiscountAmount(e.target.value)}
                    />
                  </div>
                  <Button onClick={calculateFromAmount} className="w-full">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Calcular por Valor
                  </Button>
                </TabsContent>
                
                <TabsContent value="final" className="space-y-4">
                  <div>
                    <Label htmlFor="final-price">Preço final (R$):</Label>
                    <Input
                      id="final-price"
                      type="number"
                      step="0.01"
                      placeholder="80.00"
                      value={finalPrice}
                      onChange={(e) => setFinalPrice(e.target.value)}
                    />
                  </div>
                  <Button onClick={calculateFromFinal} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calcular por Preço Final
                  </Button>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <Label className="text-sm font-medium mb-3 block">Resultados:</Label>
              {!results ? (
                <div className="bg-secondary/50 rounded-lg p-8 text-center">
                  <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Preencha os valores e clique em calcular para ver os resultados
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border">
                      <div>
                        <div className="font-medium text-primary">Preço Original</div>
                        <div className="text-sm text-muted-foreground">Valor antes do desconto</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-lg font-semibold">
                          {formatCurrency(results.originalPrice)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyResult(formatCurrency(results.originalPrice))}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-destructive/10 rounded-lg border">
                      <div>
                        <div className="font-medium text-destructive">Desconto</div>
                        <div className="text-sm text-muted-foreground">
                          {results.discountPercent.toFixed(2)}% de desconto
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-lg font-semibold text-destructive">
                          -{formatCurrency(results.discountAmount)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyResult(formatCurrency(results.discountAmount))}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                      <div>
                        <div className="font-medium text-green-600">Preço Final</div>
                        <div className="text-sm text-muted-foreground">Valor com desconto</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-xl font-bold text-green-600">
                          {formatCurrency(results.finalPrice)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyResult(formatCurrency(results.finalPrice))}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-4 bg-secondary/50 rounded-lg border">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          Você economiza {formatCurrency(results.savings)}!
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Uma economia de {results.discountPercent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};