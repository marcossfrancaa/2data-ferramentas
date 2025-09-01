
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Type, Clock } from 'lucide-react';

export const WordCounter = () => {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    lines: 0,
    paragraphs: 0,
    readingTime: 0
  });

  useEffect(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).length : 0;
    const readingTime = Math.ceil(words / 200); // 200 palavras por minuto

    setStats({
      characters,
      charactersNoSpaces,
      words,
      lines,
      paragraphs,
      readingTime
    });
  }, [text]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Type className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Contador de Caracteres e Palavras</h1>
        </div>
        <p className="text-muted-foreground">
          Conte caracteres, palavras, linhas e parágrafos em tempo real. Inclui estimativa de tempo de leitura.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Digite ou Cole o Texto
          </h3>
          
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite ou cole seu texto aqui..."
            className="min-h-80 font-mono text-sm"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Estatísticas do Texto
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-accent/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Caracteres</span>
                </div>
                <div className="text-2xl font-bold text-card-foreground">
                  {stats.characters.toLocaleString()}
                </div>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Sem espaços</span>
                </div>
                <div className="text-2xl font-bold text-card-foreground">
                  {stats.charactersNoSpaces.toLocaleString()}
                </div>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Type className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Palavras</span>
                </div>
                <div className="text-2xl font-bold text-card-foreground">
                  {stats.words.toLocaleString()}
                </div>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Linhas</span>
                </div>
                <div className="text-2xl font-bold text-card-foreground">
                  {stats.lines.toLocaleString()}
                </div>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Parágrafos</span>
                </div>
                <div className="text-2xl font-bold text-card-foreground">
                  {stats.paragraphs.toLocaleString()}
                </div>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">Tempo leitura</span>
                </div>
                <div className="text-2xl font-bold text-card-foreground">
                  {stats.readingTime} min
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
