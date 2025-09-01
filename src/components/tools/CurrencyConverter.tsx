import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const currencies = [
  { code: 'USD', name: 'Dólar Americano', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$' },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£' },
  { code: 'JPY', name: 'Iene Japonês', symbol: '¥' },
  { code: 'CAD', name: 'Dólar Canadense', symbol: 'C$' },
  { code: 'AUD', name: 'Dólar Australiano', symbol: 'A$' },
  { code: 'CHF', name: 'Franco Suíço', symbol: 'CHF' },
  { code: 'CNY', name: 'Yuan Chinês', symbol: '¥' },
  { code: 'INR', name: 'Rupia Indiana', symbol: '₹' }
];

export const CurrencyConverter = () => {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('BRL');
  const [result, setResult] = useState('');
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    setLoading(true);
    try {
      // Consulta cotações na AwesomeAPI
      const response = await fetch('https://economia.awesomeapi.com.br/json/all');
      
      if (!response.ok) {
        throw new Error('Erro ao obter cotações');
      }
      
      const data = await response.json();
      
      // Mapeia as cotações da API para o formato esperado
      const rates: { [key: string]: number } = {};
      
      if (data.USD) rates.USD = parseFloat(data.USD.bid);
      if (data.EUR) rates.EUR = parseFloat(data.EUR.bid);
      if (data.GBP) rates.GBP = parseFloat(data.GBP.bid);
      if (data.JPY) rates.JPY = parseFloat(data.JPY.bid);
      if (data.CAD) rates.CAD = parseFloat(data.CAD.bid);
      if (data.AUD) rates.AUD = parseFloat(data.AUD.bid);
      if (data.CHF) rates.CHF = parseFloat(data.CHF.bid);
      if (data.CNY) rates.CNY = parseFloat(data.CNY.bid);
      if (data.INR) rates.INR = parseFloat(data.INR.bid);
      
      // Adicionar BRL como base
      rates.BRL = 1;
      
      setExchangeRates(rates);
      toast({
        title: "Cotações atualizadas",
        description: "Dados obtidos da AwesomeAPI (oficial)"
      });
    } catch (error) {
      toast({
        title: "Erro ao buscar cotações",
        description: "Usando taxas de câmbio aproximadas",
        variant: "destructive"
      });
      // Taxas aproximadas como fallback
      setExchangeRates({
        USD: 5.2,
        EUR: 5.8,
        BRL: 1,
        GBP: 6.5,
        JPY: 0.038,
        CAD: 4.1,
        AUD: 3.6,
        CHF: 5.9,
        CNY: 0.75,
        INR: 0.065
      });
    } finally {
      setLoading(false);
    }
  };

  const convertCurrency = () => {
    const inputAmount = parseFloat(amount);
    if (isNaN(inputAmount) || inputAmount <= 0) {
      toast({
        title: "Valor inválido",
        description: "Digite um valor válido maior que zero",
        variant: "destructive"
      });
      return;
    }

    // Como a AwesomeAPI retorna as cotações em relação ao BRL
    let convertedAmount: number;
    
    if (fromCurrency === 'BRL' && toCurrency !== 'BRL') {
      // De BRL para outra moeda
      const toRate = exchangeRates[toCurrency] || 1;
      convertedAmount = inputAmount / toRate;
    } else if (fromCurrency !== 'BRL' && toCurrency === 'BRL') {
      // De outra moeda para BRL
      const fromRate = exchangeRates[fromCurrency] || 1;
      convertedAmount = inputAmount * fromRate;
    } else if (fromCurrency === 'BRL' && toCurrency === 'BRL') {
      // BRL para BRL
      convertedAmount = inputAmount;
    } else {
      // Entre duas moedas estrangeiras (via BRL)
      const fromRate = exchangeRates[fromCurrency] || 1;
      const toRate = exchangeRates[toCurrency] || 1;
      const brlAmount = inputAmount * fromRate;
      convertedAmount = brlAmount / toRate;
    }
    
    const fromSymbol = currencies.find(c => c.code === fromCurrency)?.symbol || fromCurrency;
    const toSymbol = currencies.find(c => c.code === toCurrency)?.symbol || toCurrency;
    
    setResult(`${fromSymbol} ${inputAmount.toFixed(2)} = ${toSymbol} ${convertedAmount.toFixed(2)}`);
  };

  const swapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setResult('');
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Conversor de Moedas
        </CardTitle>
        <CardDescription>
          Converta entre diferentes moedas com cotações atualizadas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Digite o valor"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="from-currency">De</Label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currencies.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.name}
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
            onClick={swapCurrencies}
            className="rounded-full"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="to-currency">Para</Label>
          <Select value={toCurrency} onValueChange={setToCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={convertCurrency} 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Carregando...' : 'Converter'}
        </Button>

        {result && (
          <div className="p-4 bg-muted/50 rounded-lg border">
            <p className="text-lg font-semibold text-center">
              {result}
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground text-center">
          * Cotações obtidas da <strong>AwesomeAPI</strong> (economia.awesomeapi.com.br) - 
          API oficial brasileira com dados em tempo real
        </div>
      </CardContent>
    </Card>
  );
};