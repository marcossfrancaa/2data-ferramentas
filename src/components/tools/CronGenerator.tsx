
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Copy, Clock, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CronGenerator = () => {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [day, setDay] = useState('*');
  const [month, setMonth] = useState('*');
  const [weekday, setWeekday] = useState('*');
  const [cronExpression, setCronExpression] = useState('* * * * *');
  const [description, setDescription] = useState('');
  const { toast } = useToast();

  const generateCron = () => {
    const cron = `${minute} ${hour} ${day} ${month} ${weekday}`;
    setCronExpression(cron);
    generateDescription(cron);
  };

  const generateDescription = (cron: string) => {
    const parts = cron.split(' ');
    let desc = 'Executa ';

    // Minute
    if (parts[0] === '*') desc += 'a cada minuto';
    else if (parts[0].includes('/')) desc += `a cada ${parts[0].split('/')[1]} minuto(s)`;
    else desc += `no minuto ${parts[0]}`;

    // Hour  
    if (parts[1] !== '*') {
      if (parts[1].includes('/')) desc += ` a cada ${parts[1].split('/')[1]} hora(s)`;
      else desc += ` às ${parts[1]}:00`;
    }

    // Day
    if (parts[2] !== '*') {
      if (parts[2].includes('/')) desc += ` a cada ${parts[2].split('/')[1]} dia(s)`;
      else desc += ` no dia ${parts[2]} do mês`;
    }

    // Month
    if (parts[3] !== '*') {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      if (parts[3].includes('/')) desc += ` a cada ${parts[3].split('/')[1]} mês(es)`;
      else desc += ` em ${months[parseInt(parts[3]) - 1]}`;
    }

    // Weekday
    if (parts[4] !== '*') {
      const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      desc += ` nas ${weekdays[parseInt(parts[4])]}s`;
    }

    setDescription(desc);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cronExpression);
      toast({
        title: "Copiado!",
        description: "Expressão CRON copiada para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a expressão",
        variant: "destructive",
      });
    }
  };

  const presets = [
    { name: 'A cada minuto', cron: '* * * * *' },
    { name: 'A cada hora', cron: '0 * * * *' },
    { name: 'Diariamente à meia-noite', cron: '0 0 * * *' },
    { name: 'Semanalmente (Domingo)', cron: '0 0 * * 0' },
    { name: 'Mensalmente (1º dia)', cron: '0 0 1 * *' },
    { name: 'A cada 15 minutos', cron: '*/15 * * * *' },
    { name: 'Dias úteis às 9h', cron: '0 9 * * 1-5' },
  ];

  const loadPreset = (cron: string) => {
    const parts = cron.split(' ');
    setMinute(parts[0]);
    setHour(parts[1]);
    setDay(parts[2]);
    setMonth(parts[3]);
    setWeekday(parts[4]);
    setCronExpression(cron);
    generateDescription(cron);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador CRON</h1>
        </div>
        <p className="text-muted-foreground">
          Gera expressões CRON para agendamento de tarefas com interface visual.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Configurar Agendamento
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              <div>
                <Label>Minuto</Label>
                <Input
                  value={minute}
                  onChange={(e) => setMinute(e.target.value)}
                  placeholder="*"
                />
                <span className="text-xs text-muted-foreground">0-59</span>
              </div>
              <div>
                <Label>Hora</Label>
                <Input
                  value={hour}
                  onChange={(e) => setHour(e.target.value)}
                  placeholder="*"
                />
                <span className="text-xs text-muted-foreground">0-23</span>
              </div>
              <div>
                <Label>Dia</Label>
                <Input
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  placeholder="*"
                />
                <span className="text-xs text-muted-foreground">1-31</span>
              </div>
              <div>
                <Label>Mês</Label>
                <Input
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  placeholder="*"
                />
                <span className="text-xs text-muted-foreground">1-12</span>
              </div>
              <div>
                <Label>Dia Semana</Label>
                <Input
                  value={weekday}
                  onChange={(e) => setWeekday(e.target.value)}
                  placeholder="*"
                />
                <span className="text-xs text-muted-foreground">0-7</span>
              </div>
            </div>

            <Button
              onClick={generateCron}
              className="w-full"
            >
              <Play className="w-4 h-4 mr-2" />
              Gerar Expressão CRON
            </Button>

            <div>
              <Label>Presets Comuns</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {presets.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => loadPreset(preset.cron)}
                    className="justify-start text-left h-auto py-2"
                  >
                    <div>
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-muted-foreground font-mono">{preset.cron}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Resultado
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label>Expressão CRON</Label>
              <div className="flex gap-2">
                <Input
                  value={cronExpression}
                  readOnly
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {description && (
              <div>
                <Label>Descrição</Label>
                <div className="p-3 bg-muted/30 rounded-lg">
                  <p className="text-sm">{description}</p>
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Formato:</strong> minuto hora dia mês dia-da-semana</p>
              <p><strong>*</strong> = qualquer valor</p>
              <p><strong>,</strong> = lista de valores (1,3,5)</p>
              <p><strong>-</strong> = intervalo (1-5)</p>
              <p><strong>/</strong> = incremento (*/15)</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
