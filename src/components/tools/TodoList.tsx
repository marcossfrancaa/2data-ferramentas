import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Download, Trash2, CheckSquare, Square } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export const TodoList = () => {
  const [tasks, setTasks] = useState<TodoItem[]>([]);
  const [newTask, setNewTask] = useState('');
  const { toast } = useToast();

  const addTask = () => {
    if (!newTask.trim()) return;
    
    const task: TodoItem = {
      id: Date.now().toString(),
      text: newTask.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    setTasks([...tasks, task]);
    setNewTask('');
    
    toast({
      title: "Tarefa adicionada!",
      description: "Nova tarefa foi adicionada à sua lista.",
    });
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast({
      title: "Tarefa removida",
      description: "A tarefa foi removida da sua lista.",
    });
  };

  const clearCompleted = () => {
    const completedCount = tasks.filter(task => task.completed).length;
    setTasks(tasks.filter(task => !task.completed));
    toast({
      title: "Tarefas limpas",
      description: `${completedCount} tarefa(s) concluída(s) foram removidas.`,
    });
  };

  const exportAsTxt = () => {
    const content = tasks.map(task => 
      `${task.completed ? '✓' : '☐'} ${task.text}`
    ).join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-list-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Lista exportada!",
      description: "Sua lista foi salva como arquivo TXT.",
    });
  };

  const exportAsJson = () => {
    const content = JSON.stringify(tasks, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `todo-list-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Lista exportada!",
      description: "Sua lista foi salva como arquivo JSON.",
    });
  };

  const completedCount = tasks.filter(task => task.completed).length;
  const pendingCount = tasks.length - completedCount;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <CheckSquare className="w-6 h-6" />
            To-Do List / Checklist Online
          </CardTitle>
          <CardDescription className="text-center">
            Crie e gerencie suas tarefas diárias com facilidade
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Adicionar nova tarefa */}
          <div className="flex gap-2">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Digite uma nova tarefa..."
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
              className="flex-1"
            />
            <Button onClick={addTask} className="px-6">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>

          {/* Estatísticas */}
          {tasks.length > 0 && (
            <div className="flex gap-4 justify-center">
              <Badge variant="outline" className="px-3 py-1">
                <Square className="w-3 h-3 mr-1" />
                {pendingCount} Pendente{pendingCount !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="secondary" className="px-3 py-1">
                <CheckSquare className="w-3 h-3 mr-1" />
                {completedCount} Concluída{completedCount !== 1 ? 's' : ''}
              </Badge>
              <Badge variant="outline" className="px-3 py-1">
                Total: {tasks.length}
              </Badge>
            </div>
          )}

          {/* Lista de tarefas */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nenhuma tarefa ainda. Adicione uma tarefa acima!</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                  />
                  <span className={`flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Ações */}
          {tasks.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center pt-4 border-t">
              <Button onClick={exportAsTxt} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar TXT
              </Button>
              <Button onClick={exportAsJson} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar JSON
              </Button>
              {completedCount > 0 && (
                <Button onClick={clearCompleted} variant="outline" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Concluídas
                </Button>
              )}
            </div>
          )}

          <div className="text-xs text-muted-foreground space-y-1 pt-4 border-t">
            <p>💡 <strong>Dicas:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Pressione Enter para adicionar rapidamente uma nova tarefa</li>
              <li>Use a exportação TXT para compartilhar listas simples</li>
              <li>Use a exportação JSON para backup completo com dados</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};