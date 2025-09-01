import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Clock, Calculator, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  name: string;
  hours: number;
  description?: string;
}

export const ProjectTimeCalculator = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState('');
  const [taskHours, setTaskHours] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const { toast } = useToast();

  const addTask = () => {
    if (!taskName.trim() || !taskHours.trim()) {
      toast({
        title: "Erro",
        description: "Preencha o nome da tarefa e as horas estimadas.",
        variant: "destructive",
      });
      return;
    }

    const hours = parseFloat(taskHours);
    if (isNaN(hours) || hours <= 0) {
      toast({
        title: "Erro",
        description: "Digite um número válido de horas.",
        variant: "destructive",
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      name: taskName.trim(),
      hours: hours,
      description: taskDescription.trim() || undefined
    };

    setTasks([...tasks, task]);
    setTaskName('');
    setTaskHours('');
    setTaskDescription('');

    toast({
      title: "Tarefa adicionada!",
      description: `"${task.name}" foi adicionada ao projeto.`,
    });
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Tarefa removida",
      description: "A tarefa foi removida do projeto.",
    });
  };

  const totalHours = tasks.reduce((sum, task) => sum + task.hours, 0);
  const totalDays = totalHours / 8; // 8 horas por dia
  const totalWeeks = totalDays / 5; // 5 dias por semana
  const totalCost = hourlyRate ? totalHours * parseFloat(hourlyRate) : 0;

  const formatTime = (hours: number) => {
    const days = Math.floor(hours / 8);
    const remainingHours = hours % 8;
    
    if (days === 0) {
      return `${hours}h`;
    } else if (remainingHours === 0) {
      return `${days}d`;
    } else {
      return `${days}d ${remainingHours}h`;
    }
  };

  const exportEstimate = () => {
    const content = [
      '=== ESTIMATIVA DE PROJETO ===',
      `Data: ${new Date().toLocaleDateString()}`,
      '',
      '--- TAREFAS ---',
      ...tasks.map(task => 
        `• ${task.name}: ${task.hours}h${task.description ? ` (${task.description})` : ''}`
      ),
      '',
      '--- RESUMO ---',
      `Total de horas: ${totalHours}h`,
      `Tempo estimado: ${formatTime(totalHours)}`,
      `Dias úteis (8h/dia): ${totalDays.toFixed(1)} dias`,
      `Semanas úteis (5d/semana): ${totalWeeks.toFixed(1)} semanas`,
      hourlyRate ? `Custo estimado: R$ ${totalCost.toFixed(2)}` : '',
      '',
      '--- OBSERVAÇÕES ---',
      '• Esta é uma estimativa baseada nas tarefas listadas',
      '• Considere adicionar uma margem de segurança de 20-30%',
      '• Revise periodicamente conforme o projeto avança'
    ].filter(Boolean).join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estimativa-projeto-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Estimativa exportada!",
      description: "Sua estimativa foi salva como arquivo TXT.",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Calculator className="w-6 h-6" />
            Calculadora de Tempo de Projeto
          </CardTitle>
          <CardDescription className="text-center">
            Estime o tempo total do seu projeto a partir de tarefas individuais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulário para adicionar tarefa */}
          <Card className="bg-muted/30">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="taskName">Nome da Tarefa *</Label>
                  <Input
                    id="taskName"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="Ex: Criar API de usuários"
                  />
                </div>
                <div>
                  <Label htmlFor="taskHours">Horas Estimadas *</Label>
                  <Input
                    id="taskHours"
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={taskHours}
                    onChange={(e) => setTaskHours(e.target.value)}
                    placeholder="Ex: 8"
                  />
                </div>
                <div>
                  <Label htmlFor="hourlyRate">Valor/Hora (opcional)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    step="0.01"
                    min="0"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    placeholder="Ex: 150.00"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="taskDescription">Descrição (opcional)</Label>
                <Input
                  id="taskDescription"
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Detalhes adicionais sobre a tarefa..."
                />
              </div>
              <Button onClick={addTask} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Tarefa
              </Button>
            </CardContent>
          </Card>

          {/* Resumo do projeto */}
          {tasks.length > 0 && (
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Resumo do Projeto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{totalHours}h</div>
                    <div className="text-sm text-muted-foreground">Total de Horas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{totalDays.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Dias (8h/dia)</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{totalWeeks.toFixed(1)}</div>
                    <div className="text-sm text-muted-foreground">Semanas (5d/sem)</div>
                  </div>
                  {hourlyRate && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">R$ {totalCost.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">Custo Estimado</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de tarefas */}
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nenhuma tarefa adicionada ainda.</p>
                <p className="text-sm">Adicione tarefas acima para calcular o tempo total do projeto.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Tarefas do Projeto ({tasks.length})</h3>
                  <Button onClick={exportEstimate} variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Exportar Estimativa
                  </Button>
                </div>
                {tasks.map((task, index) => (
                  <Card key={task.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                            <h4 className="font-semibold">{task.name}</h4>
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                          )}
                          <div className="flex items-center gap-4 text-sm">
                            <Badge variant="secondary">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatTime(task.hours)}
                            </Badge>
                            {hourlyRate && (
                              <span className="text-muted-foreground">
                                R$ {(task.hours * parseFloat(hourlyRate)).toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteTask(task.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>

          <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
            <p>💡 <strong>Dicas para estimativas precisas:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Quebre tarefas grandes em subtarefas menores</li>
              <li>Adicione 20-30% de margem de segurança ao total</li>
              <li>Considere tempo para testes, revisões e correções</li>
              <li>Baseie-se em experiências anteriores similares</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};