import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Calculator, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalMonths: number;
  nextBirthday: {
    days: number;
    date: string;
  };
}

export const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  const { toast } = useToast();

  const calculateAge = () => {
    if (!birthDate) {
      toast({
        title: "Erro",
        description: "Digite uma data de nascimento válida",
        variant: "destructive",
      });
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();

    if (birth > today) {
      toast({
        title: "Erro",
        description: "A data de nascimento não pode ser no futuro",
        variant: "destructive",
      });
      return;
    }

    // Calcula idade exata
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calcula totais
    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;

    // Calcula próximo aniversário
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysToNextBirthday = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setAgeResult({
      years,
      months,
      days,
      totalDays,
      totalMonths,
      nextBirthday: {
        days: daysToNextBirthday,
        date: nextBirthday.toLocaleDateString('pt-BR')
      }
    });
  };

  const clearData = () => {
    setBirthDate('');
    setAgeResult(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Calculadora de Idade</h1>
        </div>
        <p className="text-muted-foreground">
          Calcula sua idade exata em anos, meses e dias, além de mostrar informações detalhadas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Data de Nascimento
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="birthDate">Data de Nascimento</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={calculateAge}
                disabled={!birthDate}
                className="flex-1"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Calcular Idade
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
            {ageResult ? (
              <div className="space-y-6">
                {/* Idade principal */}
                <div className="text-center p-6 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {ageResult.years} anos
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {ageResult.months} meses e {ageResult.days} dias
                  </div>
                </div>

                {/* Detalhes */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <div className="text-2xl font-bold text-accent">
                      {ageResult.totalDays.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total de dias
                    </div>
                  </div>

                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <div className="text-2xl font-bold text-accent">
                      {ageResult.totalMonths}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total de meses
                    </div>
                  </div>
                </div>

                {/* Próximo aniversário */}
                <div className="p-4 bg-secondary/20 rounded-lg">
                  <div className="font-semibold text-card-foreground mb-1">
                    Próximo Aniversário
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Em {ageResult.nextBirthday.days} dias ({ageResult.nextBirthday.date})
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Digite sua data de nascimento para calcular</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Informações do Cálculo</h4>
            <p className="text-muted-foreground">
              A calculadora considera anos bissextos e varia em meses para fornecer 
              a idade mais precisa possível. O próximo aniversário é calculado automaticamente.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};