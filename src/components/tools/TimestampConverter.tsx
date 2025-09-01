import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const TimestampConverter = () => {
  const [timestamp, setTimestamp] = useState<string>('');
  const [humanDate, setHumanDate] = useState<string>('');
  const [timezone, setTimezone] = useState<string>('America/Sao_Paulo');
  const [format, setFormat] = useState<string>('full');

  const timezones = [
    { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
    { value: 'America/New_York', label: 'Nova York (EST)' },
    { value: 'Europe/London', label: 'Londres (GMT)' },
    { value: 'Asia/Tokyo', label: 'Tóquio (JST)' },
    { value: 'UTC', label: 'UTC' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST)' },
    { value: 'Europe/Paris', label: 'Paris (CET)' },
    { value: 'Asia/Shanghai', label: 'Xangai (CST)' },
  ];

  const formats = [
    { value: 'full', label: 'Completo' },
    { value: 'date', label: 'Apenas Data' },
    { value: 'time', label: 'Apenas Hora' },
    { value: 'iso', label: 'ISO 8601' },
    { value: 'relative', label: 'Relativo' },
  ];

  const getCurrentTimestamp = () => {
    const now = Math.floor(Date.now() / 1000);
    setTimestamp(now.toString());
    convertToHuman(now.toString());
  };

  const convertToHuman = (ts: string) => {
    try {
      const timestampNum = parseInt(ts);
      if (isNaN(timestampNum)) {
        toast.error('Timestamp inválido');
        return;
      }

      // Se o timestamp tem 10 dígitos, é em segundos; se tem 13, é em milissegundos
      const date = new Date(timestampNum < 10000000000 ? timestampNum * 1000 : timestampNum);
      
      if (isNaN(date.getTime())) {
        toast.error('Timestamp inválido');
        return;
      }

      let formatted = '';
      
      switch (format) {
        case 'full':
          formatted = new Intl.DateTimeFormat('pt-BR', {
            timeZone: timezone,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            weekday: 'long'
          }).format(date);
          break;
        case 'date':
          formatted = new Intl.DateTimeFormat('pt-BR', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).format(date);
          break;
        case 'time':
          formatted = new Intl.DateTimeFormat('pt-BR', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }).format(date);
          break;
        case 'iso':
          formatted = date.toISOString();
          break;
        case 'relative':
          const now = new Date();
          const diffMs = now.getTime() - date.getTime();
          const diffSecs = Math.floor(diffMs / 1000);
          const diffMins = Math.floor(diffSecs / 60);
          const diffHours = Math.floor(diffMins / 60);
          const diffDays = Math.floor(diffHours / 24);
          
          if (diffSecs < 60) {
            formatted = diffSecs > 0 ? `${diffSecs} segundos atrás` : `em ${Math.abs(diffSecs)} segundos`;
          } else if (diffMins < 60) {
            formatted = diffMins > 0 ? `${diffMins} minutos atrás` : `em ${Math.abs(diffMins)} minutos`;
          } else if (diffHours < 24) {
            formatted = diffHours > 0 ? `${diffHours} horas atrás` : `em ${Math.abs(diffHours)} horas`;
          } else {
            formatted = diffDays > 0 ? `${diffDays} dias atrás` : `em ${Math.abs(diffDays)} dias`;
          }
          break;
      }

      setHumanDate(formatted);
    } catch (error) {
      toast.error('Erro ao converter timestamp');
    }
  };

  const convertToTimestamp = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        toast.error('Data inválida');
        return;
      }
      
      const ts = Math.floor(date.getTime() / 1000);
      setTimestamp(ts.toString());
    } catch (error) {
      toast.error('Erro ao converter data');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência`);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Conversor de Timestamp</CardTitle>
          <CardDescription>
            Converta timestamps Unix para datas legíveis e vice-versa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Timestamp atual */}
          <div className="text-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
            <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-2">Timestamp atual</p>
            <p className="text-2xl font-mono font-bold mb-3">{Math.floor(Date.now() / 1000)}</p>
            <Button
              onClick={getCurrentTimestamp}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Usar timestamp atual
            </Button>
          </div>

          {/* Configurações */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="timezone">Fuso Horário</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="format">Formato</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {formats.map(fmt => (
                    <SelectItem key={fmt.value} value={fmt.value}>
                      {fmt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conversão de Timestamp para Data */}
          <div className="space-y-3">
            <h3 className="font-semibold">Timestamp → Data</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Digite o timestamp (ex: 1640995200)"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
              />
              <Button onClick={() => convertToHuman(timestamp)}>
                Converter
              </Button>
            </div>
            {humanDate && (
              <div className="p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-mono">{humanDate}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(humanDate, 'Data')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Conversão de Data para Timestamp */}
          <div className="space-y-3">
            <h3 className="font-semibold">Data → Timestamp</h3>
            <div className="flex gap-2">
              <Input
                type="datetime-local"
                onChange={(e) => convertToTimestamp(e.target.value)}
              />
            </div>
            <div className="text-center">
              <span className="text-muted-foreground">ou</span>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Digite uma data (ex: 2024-01-01 12:00:00)"
                onChange={(e) => convertToTimestamp(e.target.value)}
              />
            </div>
          </div>

          {/* Exemplos */}
          <div className="mt-6 p-4 bg-secondary/50 rounded-lg space-y-2">
            <h3 className="font-semibold">Exemplos de uso</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <code>1640995200</code> → 1 de janeiro de 2022 00:00:00</li>
              <li>• <code>1640995200000</code> → Timestamp em milissegundos</li>
              <li>• <code>2024-12-25 15:30:00</code> → Natal de 2024 às 15:30</li>
              <li>• Use timestamps para armazenar datas em bancos de dados</li>
              <li>• Útil para APIs, logs e sistemas distribuídos</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};