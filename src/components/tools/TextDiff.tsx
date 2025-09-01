import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Eye } from 'lucide-react';

export const TextDiff = () => {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [showDiff, setShowDiff] = useState(false);

  const getDiff = () => {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLines = Math.max(lines1.length, lines2.length);
    
    const diffResult = [];
    
    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      
      if (line1 === line2) {
        diffResult.push({ type: 'equal', content: line1, lineNumber: i + 1 });
      } else {
        if (line1) {
          diffResult.push({ type: 'removed', content: line1, lineNumber: i + 1 });
        }
        if (line2) {
          diffResult.push({ type: 'added', content: line2, lineNumber: i + 1 });
        }
      }
    }
    
    return diffResult;
  };

  const handleCompare = () => {
    setShowDiff(true);
  };

  const diffResult = showDiff ? getDiff() : [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Comparar Textos</h1>
        </div>
        <p className="text-muted-foreground">
          Compare dois textos lado a lado e visualize as diferenças destacadas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Texto Original
          </h3>
          
          <Textarea
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Cole o primeiro texto aqui..."
            className="min-h-64 font-mono text-sm"
          />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Texto para Comparar
          </h3>
          
          <Textarea
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Cole o segundo texto aqui..."
            className="min-h-64 font-mono text-sm"
          />
        </Card>
      </div>

      <div className="flex justify-center mb-6">
        <Button
          onClick={handleCompare}
          disabled={!text1.trim() || !text2.trim()}
          className="px-8"
        >
          <Eye className="w-4 h-4 mr-2" />
          Comparar Textos
        </Button>
      </div>

      {showDiff && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Diferenças Encontradas
          </h3>
          
          <div className="bg-muted/30 p-4 rounded-lg max-h-96 overflow-y-auto">
            <div className="font-mono text-sm space-y-1">
              {diffResult.map((line, index) => (
                <div
                  key={index}
                  className={`p-1 rounded ${
                    line.type === 'added'
                      ? 'bg-success/20 text-success-foreground border-l-4 border-success'
                      : line.type === 'removed'
                      ? 'bg-destructive/20 text-destructive-foreground border-l-4 border-destructive'
                      : 'text-muted-foreground'
                  }`}
                >
                  <span className="inline-block w-8 text-xs opacity-50 mr-2">
                    {line.lineNumber}
                  </span>
                  <span className="inline-block w-4 mr-2">
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                  </span>
                  <span>{line.content || '(linha vazia)'}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-success/20 border-l-4 border-success"></div>
              <span className="text-muted-foreground">Linhas adicionadas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-destructive/20 border-l-4 border-destructive"></div>
              <span className="text-muted-foreground">Linhas removidas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-muted/30"></div>
              <span className="text-muted-foreground">Linhas iguais</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};