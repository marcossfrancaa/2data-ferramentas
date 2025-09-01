import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Clock, Plus, X, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TimeZone {
  id: string;
  name: string;
  offset: string;
  time?: string;
}

const predefinedTimeZones: TimeZone[] = [
  { id: 'America/New_York', name: 'Nova York', offset: 'UTC-5' },
  { id: 'America/Los_Angeles', name: 'Los Angeles', offset: 'UTC-8' },
  { id: 'America/Chicago', name: 'Chicago', offset: 'UTC-6' },
  { id: 'America/Toronto', name: 'Toronto', offset: 'UTC-5' },
  { id: 'America/Mexico_City', name: 'Cidade do México', offset: 'UTC-6' },
  { id: 'America/Sao_Paulo', name: 'São Paulo', offset: 'UTC-3' },
  { id: 'America/Buenos_Aires', name: 'Buenos Aires', offset: 'UTC-3' },
  { id: 'America/Lima', name: 'Lima', offset: 'UTC-5' },
  { id: 'Europe/London', name: 'Londres', offset: 'UTC+0' },
  { id: 'Europe/Paris', name: 'Paris', offset: 'UTC+1' },
  { id: 'Europe/Berlin', name: 'Berlim', offset: 'UTC+1' },
  { id: 'Europe/Madrid', name: 'Madrid', offset: 'UTC+1' },
  { id: 'Europe/Rome', name: 'Roma', offset: 'UTC+1' },
  { id: 'Europe/Moscow', name: 'Moscou', offset: 'UTC+3' },
  { id: 'Europe/Istanbul', name: 'Istambul', offset: 'UTC+3' },
  { id: 'Africa/Cairo', name: 'Cairo', offset: 'UTC+2' },
  { id: 'Africa/Lagos', name: 'Lagos', offset: 'UTC+1' },
  { id: 'Africa/Johannesburg', name: 'Joanesburgo', offset: 'UTC+2' },
  { id: 'Asia/Dubai', name: 'Dubai', offset: 'UTC+4' },
  { id: 'Asia/Mumbai', name: 'Mumbai', offset: 'UTC+5:30' },
  { id: 'Asia/Kolkata', name: 'Calcutá', offset: 'UTC+5:30' },
  { id: 'Asia/Bangkok', name: 'Bangkok', offset: 'UTC+7' },
  { id: 'Asia/Singapore', name: 'Singapura', offset: 'UTC+8' },
  { id: 'Asia/Hong_Kong', name: 'Hong Kong', offset: 'UTC+8' },
  { id: 'Asia/Shanghai', name: 'Xangai', offset: 'UTC+8' },
  { id: 'Asia/Tokyo', name: 'Tóquio', offset: 'UTC+9' },
  { id: 'Asia/Seoul', name: 'Seul', offset: 'UTC+9' },
  { id: 'Australia/Sydney', name: 'Sydney', offset: 'UTC+11' },
  { id: 'Australia/Melbourne', name: 'Melbourne', offset: 'UTC+11' },
  { id: 'Pacific/Auckland', name: 'Auckland', offset: 'UTC+13' },
  { id: 'Pacific/Honolulu', name: 'Honolulu', offset: 'UTC-10' },
];

export const WorldClock = () => {
  const [selectedTimeZones, setSelectedTimeZones] = useState<TimeZone[]>([
    { id: 'America/Sao_Paulo', name: 'São Paulo', offset: 'UTC-3' },
    { id: 'America/New_York', name: 'Nova York', offset: 'UTC-5' },
    { id: 'Europe/London', name: 'Londres', offset: 'UTC+0' },
    { id: 'Asia/Tokyo', name: 'Tóquio', offset: 'UTC+9' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeForZone = (zoneId: string) => {
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        timeZone: zoneId,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(currentTime);
    } catch {
      return '--:--:--';
    }
  };

  const getDateForZone = (zoneId: string) => {
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        timeZone: zoneId,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(currentTime);
    } catch {
      return '';
    }
  };

  const addTimeZone = (zone: TimeZone) => {
    if (!selectedTimeZones.find(tz => tz.id === zone.id)) {
      setSelectedTimeZones([...selectedTimeZones, zone]);
    }
  };

  const removeTimeZone = (zoneId: string) => {
    setSelectedTimeZones(selectedTimeZones.filter(tz => tz.id !== zoneId));
  };

  const filteredTimeZones = predefinedTimeZones.filter(
    tz => 
      tz.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedTimeZones.find(selected => selected.id === tz.id)
  );

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Relógio Mundial</CardTitle>
          <CardDescription>
            Veja o horário atual em diferentes fusos horários ao redor do mundo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchTerm && filteredTimeZones.length > 0 && (
              <Select onValueChange={(value) => {
                const zone = predefinedTimeZones.find(tz => tz.id === value);
                if (zone) {
                  addTimeZone(zone);
                  setSearchTerm('');
                }
              }}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Selecione uma cidade" />
                </SelectTrigger>
                <SelectContent>
                  {filteredTimeZones.map(zone => (
                    <SelectItem key={zone.id} value={zone.id}>
                      {zone.name} ({zone.offset})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedTimeZones.map(zone => (
              <Card key={zone.id} className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => removeTimeZone(zone.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{zone.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{zone.offset}</p>
                      <div className="text-3xl font-mono font-bold text-primary">
                        {getTimeForZone(zone.id)}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {getDateForZone(zone.id)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {selectedTimeZones.length < 12 && (
              <Card className="border-dashed">
                <CardContent className="flex items-center justify-center h-full min-h-[180px]">
                  <div className="text-center">
                    <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Busque e adicione uma cidade
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-semibold mb-2">Dica</h3>
            <p className="text-sm text-muted-foreground">
              Digite o nome da cidade na busca e selecione para adicionar ao painel. 
              Você pode adicionar até 12 cidades diferentes para monitorar simultaneamente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};