import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Save, Download, Trash2, FileText, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export const QuickNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { toast } = useToast();

  // Carregar notas do localStorage na inicialização
  useEffect(() => {
    const savedNotes = localStorage.getItem('quick-notes');
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt)
        }));
        setNotes(parsedNotes);
      } catch (error) {
        console.error('Erro ao carregar notas:', error);
      }
    }
  }, []);

  // Salvar notas no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('quick-notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    setCurrentNote(null);
    setTitle('');
    setContent('');
  };

  const saveNote = () => {
    if (!content.trim()) {
      toast({
        title: "Erro",
        description: "Digite algum conteúdo para salvar a nota.",
        variant: "destructive",
      });
      return;
    }

    const noteTitle = title.trim() || `Nota ${new Date().toLocaleString()}`;
    
    if (currentNote) {
      // Atualizar nota existente
      const updatedNote = {
        ...currentNote,
        title: noteTitle,
        content: content.trim(),
        updatedAt: new Date()
      };
      setNotes(notes.map(note => note.id === currentNote.id ? updatedNote : note));
      setCurrentNote(updatedNote);
      
      toast({
        title: "Nota atualizada!",
        description: "Suas alterações foram salvas.",
      });
    } else {
      // Criar nova nota
      const newNote: Note = {
        id: Date.now().toString(),
        title: noteTitle,
        content: content.trim(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setNotes([newNote, ...notes]);
      setCurrentNote(newNote);
      
      toast({
        title: "Nota salva!",
        description: "Nova nota foi criada e salva.",
      });
    }
  };

  const loadNote = (note: Note) => {
    setCurrentNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (currentNote?.id === noteId) {
      createNewNote();
    }
    
    toast({
      title: "Nota excluída",
      description: "A nota foi removida permanentemente.",
    });
  };

  const exportAsText = () => {
    if (!content.trim()) {
      toast({
        title: "Erro",
        description: "Não há conteúdo para exportar.",
        variant: "destructive",
      });
      return;
    }

    const noteTitle = title.trim() || 'nota-rapida';
    const filename = `${noteTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Nota exportada!",
      description: "Sua nota foi salva como arquivo TXT.",
    });
  };

  const copyToClipboard = () => {
    if (!content.trim()) return;
    
    navigator.clipboard.writeText(content);
    toast({
      title: "Copiado!",
      description: "Conteúdo da nota copiado para a área de transferência.",
    });
  };

  const clearAll = () => {
    setNotes([]);
    createNewNote();
    localStorage.removeItem('quick-notes');
    
    toast({
      title: "Todas as notas foram apagadas",
      description: "O anotador foi limpo completamente.",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <FileText className="w-6 h-6" />
            Anotador Rápido (Notes Online)
          </CardTitle>
          <CardDescription className="text-center">
            Bloco de notas simples para anotações rápidas com salvamento automático
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Lista de notas */}
            <div className="lg:col-span-1 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  NOTAS SALVAS ({notes.length})
                </h3>
                <Button onClick={createNewNote} size="sm" variant="outline">
                  <FileText className="w-3 h-3 mr-1" />
                  Nova
                </Button>
              </div>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {notes.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Nenhuma nota salva ainda
                  </div>
                ) : (
                  notes.map((note) => (
                    <Card 
                      key={note.id}
                      className={`cursor-pointer hover:bg-accent/50 transition-colors ${
                        currentNote?.id === note.id ? 'bg-accent border-primary' : ''
                      }`}
                      onClick={() => loadNote(note)}
                    >
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-medium text-sm truncate flex-1">{note.title}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNote(note.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                          {note.content.substring(0, 80)}...
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(note.updatedAt)}
                        </p>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
              
              {notes.length > 0 && (
                <Button onClick={clearAll} variant="outline" size="sm" className="w-full text-destructive hover:text-destructive">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Limpar Tudo
                </Button>
              )}
            </div>

            {/* Editor de nota */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {currentNote ? 'Editando' : 'Nova Nota'}
                  </Badge>
                  {currentNote && (
                    <span className="text-xs text-muted-foreground">
                      Criado: {formatDate(currentNote.createdAt)}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} variant="outline" size="sm" disabled={!content.trim()}>
                    <Copy className="w-3 h-3 mr-1" />
                    Copiar
                  </Button>
                  <Button onClick={exportAsText} variant="outline" size="sm" disabled={!content.trim()}>
                    <Download className="w-3 h-3 mr-1" />
                    Exportar
                  </Button>
                  <Button onClick={saveNote} size="sm">
                    <Save className="w-3 h-3 mr-1" />
                    Salvar
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Título da nota (opcional)"
                  className="font-medium"
                />
                
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Digite suas anotações aqui..."
                  className="min-h-[400px] resize-none"
                />
                
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>
                    {content.length} caracteres • {content.split('\n').length} linhas
                  </span>
                  <span>
                    {content.trim() ? 'Auto-salvamento ativo' : 'Digite algo para começar'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground space-y-1 pt-6 border-t">
            <p>💡 <strong>Dicas:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Suas notas são salvas automaticamente no seu navegador</li>
              <li>Use títulos descritivos para encontrar notas facilmente</li>
              <li>Exporte notas importantes como backup em arquivo TXT</li>
              <li>As notas são mantidas apenas neste navegador</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};