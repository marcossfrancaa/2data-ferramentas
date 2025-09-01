import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const DateCalculator = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [addYears, setAddYears] = useState(0);
  const [addMonths, setAddMonths] = useState(0);
  const [addDays, setAddDays] = useState(0);
  const [baseDate, setBaseDate] = useState('');
  const { toast } = useToast();

  const calculateDifference = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Erro",
        description: "Por favor, preencha ambas as datas",
        variant: "destructive",
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffYears = Math.floor(diffDays / 365);
    const diffMonths = Math.floor((diffDays % 365) / 30);
    const remainingDays = diffDays % 30;

    toast({
      title: "Diferença calculada",
      description: `${diffDays} dias (${diffYears} anos, ${diffMonths} meses, ${remainingDays} dias)`,
    });
  };

  const addToDate = () => {
    if (!baseDate) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma data base",
        variant: "destructive",
      });
      return;
    }

    const date = new Date(baseDate);
    date.setFullYear(date.getFullYear() + addYears);
    date.setMonth(date.getMonth() + addMonths);
    date.setDate(date.getDate() + addDays);

    const result = date.toISOString().split('T')[0];
    setEndDate(result);

    toast({
      title: "Data calculada",
      description: `Nova data: ${date.toLocaleDateString('pt-BR')}`,
    });
  };

  const setToday = (field: 'start' | 'end' | 'base') => {
    const today = new Date().toISOString().split('T')[0];
    if (field === 'start') setStartDate(today);
    else if (field === 'end') setEndDate(today);
    else setBaseDate(today);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Calculadora de Datas</h1>
        </div>
        <p className="text-muted-foreground">
          Calcule diferenças entre datas e adicione/subtraia períodos de tempo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Diferença entre datas */}
        <Card className="p-6 bg-gradient-card">
          <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Diferença entre Datas
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="start-date">Data Inicial</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="start-date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <Button variant="outline" size="sm" onClick={() => setToday('start')}>
                  Hoje
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="end-date">Data Final</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="end-date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <Button variant="outline" size="sm" onClick={() => setToday('end')}>
                  Hoje
                </Button>
              </div>
            </div>

            <Button 
              onClick={calculateDifference}
              className="w-full bg-gradient-primary hover:opacity-90 transition-fast"
            >
              Calcular Diferença
            </Button>
          </div>
        </Card>

        {/* Adicionar/Subtrair tempo */}
        <Card className="p-6 bg-gradient-card">
          <h3 className="text-xl font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Adicionar/Subtrair Tempo
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="base-date">Data Base</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  id="base-date"
                  type="date"
                  value={baseDate}
                  onChange={(e) => setBaseDate(e.target.value)}
                />
                <Button variant="outline" size="sm" onClick={() => setToday('base')}>
                  Hoje
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label htmlFor="years">Anos</Label>
                <Input
                  id="years"
                  type="number"
                  placeholder="0"
                  value={addYears || ''}
                  onChange={(e) => setAddYears(Number(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="months">Meses</Label>
                <Input
                  id="months"
                  type="number"
                  placeholder="0"
                  value={addMonths || ''}
                  onChange={(e) => setAddMonths(Number(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label htmlFor="days">Dias</Label>
                <Input
                  id="days"
                  type="number"
                  placeholder="0"
                  value={addDays || ''}
                  onChange={(e) => setAddDays(Number(e.target.value) || 0)}
                />
              </div>
            </div>

            <Button 
              onClick={addToDate}
              className="w-full bg-gradient-primary hover:opacity-90 transition-fast"
            >
              Calcular Nova Data
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Dicas</h4>
            <p className="text-muted-foreground">
              Use números negativos para subtrair tempo. A calculadora considera anos bissextos 
              e variações nos meses automaticamente.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};