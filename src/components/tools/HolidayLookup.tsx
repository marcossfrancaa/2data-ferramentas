import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Search, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Holiday {
  date: string;
  name: string;
  type: 'nacional' | 'estadual';
  state?: string;
  passed: boolean;
}

const estados = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
];

// Feriados nacionais de 2025
const nationalHolidays2025: Omit<Holiday, 'passed'>[] = [
  { date: '2025-01-01', name: 'Confraternização Universal', type: 'nacional' },
  { date: '2025-02-17', name: 'Carnaval', type: 'nacional' },
  { date: '2025-02-18', name: 'Carnaval', type: 'nacional' },
  { date: '2025-04-18', name: 'Sexta-feira Santa', type: 'nacional' },
  { date: '2025-04-21', name: 'Tiradentes', type: 'nacional' },
  { date: '2025-05-01', name: 'Dia do Trabalhador', type: 'nacional' },
  { date: '2025-09-07', name: 'Independência do Brasil', type: 'nacional' },
  { date: '2025-10-12', name: 'Nossa Senhora Aparecida', type: 'nacional' },
  { date: '2025-11-02', name: 'Finados', type: 'nacional' },
  { date: '2025-11-15', name: 'Proclamação da República', type: 'nacional' },
  { date: '2025-12-25', name: 'Natal', type: 'nacional' },
];

// Feriados estaduais e municipais selecionados (incluindo Campo Grande/MS)
const stateHolidays2025: Omit<Holiday, 'passed'>[] = [
  { date: '2025-01-25', name: 'Aniversário de São Paulo', type: 'estadual', state: 'SP' },
  { date: '2025-04-23', name: 'São Jorge', type: 'estadual', state: 'RJ' },
  { date: '2025-06-24', name: 'São João', type: 'estadual', state: 'BA' },
  { date: '2025-07-02', name: 'Independência da Bahia', type: 'estadual', state: 'BA' },
  { date: '2025-08-26', name: 'Aniversário de Campo Grande', type: 'estadual', state: 'MS' },
  { date: '2025-09-20', name: 'Revolução Farroupilha', type: 'estadual', state: 'RS' },
  { date: '2025-10-11', name: 'Dia do Pantanal', type: 'estadual', state: 'MS' },
  { date: '2025-10-17', name: 'Morte de Antônio Conselheiro', type: 'estadual', state: 'BA' },
  { date: '2025-11-20', name: 'Zumbi dos Palmares', type: 'estadual', state: 'AL' },
];

export const HolidayLookup = () => {
  const [selectedYear, setSelectedYear] = useState('2025');
  const [selectedState, setSelectedState] = useState('BR');
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear + i);

  const searchHolidays = async () => {
    setIsLoading(true);
    
    try {
      // Consulta na Nager.Date API para feriados brasileiros
      const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${selectedYear}/BR`);
      
      if (!response.ok) {
        throw new Error('Erro ao consultar feriados');
      }
      
      const data = await response.json();
      
      const today = new Date();
      
      // Mapeia os dados da API para o formato esperado
      let apiHolidays = data.map((holiday: any) => ({
        date: holiday.date,
        name: holiday.localName || holiday.name,
        type: 'nacional' as const,
        passed: new Date(holiday.date) < today
      }));
      
      // Se um estado específico foi selecionado, adicionar feriados estaduais
      if (selectedState !== 'BR') {
        const stateSpecific = stateHolidays2025
          .filter(holiday => holiday.state === selectedState)
          .map(holiday => ({
            ...holiday,
            passed: new Date(holiday.date) < today
          }));
        
        apiHolidays = [...apiHolidays, ...stateSpecific];
      }
      
      // Ordenar por data
      apiHolidays.sort((a: Holiday, b: Holiday) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      setHolidays(apiHolidays);
      
      toast({
        title: "Consulta concluída!",
        description: `Encontrados ${apiHolidays.length} feriados para ${selectedYear} (dados oficiais)`,
      });
      
    } catch (error) {
      // Fallback para dados estáticos se a API falhar
      const today = new Date();
      
      let fallbackHolidays: Holiday[] = nationalHolidays2025.map(holiday => ({
        ...holiday,
        passed: new Date(holiday.date) < today
      }));
      
      // Se um estado específico foi selecionado, adicionar feriados estaduais
      if (selectedState !== 'BR') {
        const stateSpecific = stateHolidays2025
          .filter(holiday => holiday.state === selectedState)
          .map(holiday => ({
            ...holiday,
            passed: new Date(holiday.date) < today
          }));
        
        fallbackHolidays = [...fallbackHolidays, ...stateSpecific];
      }
      
      fallbackHolidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      setHolidays(fallbackHolidays);
      
      toast({
        title: "Usando dados locais",
        description: `API indisponível - ${fallbackHolidays.length} feriados encontrados`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const upcomingHolidays = useMemo(() => {
    return holidays.filter(holiday => !holiday.passed);
  }, [holidays]);

  const passedHolidays = useMemo(() => {
    return holidays.filter(holiday => holiday.passed);
  }, [holidays]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Consulta de Feriados (Nacionais e Estaduais)</h1>
        </div>
        <p className="text-muted-foreground">
          Selecione o ano e o estado para ver a lista completa de feriados públicos.
        </p>
      </div>

      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Filtros
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="year">Ano</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="state">Estado</Label>
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BR">Brasil (Todos os Nacionais)</SelectItem>
                {estados.map((estado) => (
                  <SelectItem key={estado.sigla} value={estado.sigla}>
                    {estado.nome} ({estado.sigla})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={searchHolidays}
              className="w-full"
              disabled={isLoading}
            >
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? 'Consultando...' : 'Consultar Feriados'}
            </Button>
          </div>
        </div>
      </Card>

      {holidays.length > 0 && (
        <div className="space-y-6">
          {upcomingHolidays.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Próximos Feriados ({upcomingHolidays.length})
              </h3>
              
              <div className="space-y-3">
                {upcomingHolidays.map((holiday, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div>
                      <h4 className="font-semibold text-card-foreground">{holiday.name}</h4>
                      <p className="text-sm text-muted-foreground">{formatDate(holiday.date)}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        holiday.type === 'nacional' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                      }`}>
                        {holiday.type === 'nacional' ? 'Nacional' : `Estadual - ${holiday.state}`}
                      </span>
                    </div>
                    <Clock className="w-5 h-5 text-blue-500" />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {passedHolidays.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Feriados Passados ({passedHolidays.length})
              </h3>
              
              <div className="space-y-3">
                {passedHolidays.map((holiday, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg border border-gray-200 dark:border-gray-800 opacity-75">
                    <div>
                      <h4 className="font-semibold text-card-foreground">{holiday.name}</h4>
                      <p className="text-sm text-muted-foreground">{formatDate(holiday.date)}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        holiday.type === 'nacional' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                      }`}>
                        {holiday.type === 'nacional' ? 'Nacional' : `Estadual - ${holiday.state}`}
                      </span>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {holidays.length === 0 && !isLoading && (
        <Card className="p-8 text-center">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-card-foreground mb-2">
            Nenhum feriado encontrado
          </h3>
          <p className="text-muted-foreground">
            Selecione o ano e estado para consultar os feriados.
          </p>
        </Card>
      )}

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">📊 Fonte dos Dados</h4>
            <p className="text-muted-foreground">
              Esta consulta utiliza a <strong>Nager.Date API</strong> oficial para obter feriados nacionais brasileiros 
              atualizados. Para feriados estaduais, utiliza uma base local com os principais feriados de cada estado.
              Os feriados municipais não são incluídos - verifique sempre a legislação local para 
              feriados municipais específicos da sua cidade.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};