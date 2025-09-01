import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Copy } from 'lucide-react';
import { toast } from 'sonner';

export const DuplicateLineRemover = () => {
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');

  const removeDuplicateLines = () => {
    if (!inputText.trim()) {
      toast.error('Digite um texto para remover duplicatas');
      return;
    }
    
    const lines = inputText.split('\n');
    const uniqueLines = [...new Set(lines)];
    const result = uniqueLines.join('\n');
    
    setResultText(result);
    
    const duplicatesRemoved = lines.length - uniqueLines.length;
    toast.success(`${duplicatesRemoved} linha(s) duplicada(s) removida(s)!`);
  };

  const copyResult = () => {
    if (!resultText) {
      toast.error('Nenhum resultado para copiar');
      return;
    }
    
    navigator.clipboard.writeText(resultText);
    toast.success('Resultado copiado!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Remover Linhas Duplicadas</CardTitle>
          <CardDescription>
            Remove linhas duplicadas do seu texto, mantendo apenas uma ocorrência de cada linha
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="input-text">Digite ou cole o texto no campo abaixo:</Label>
                <Textarea
                  id="input-text"
                  placeholder="Cole seu texto aqui..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={10}
                />
              </div>
              <Button onClick={removeDuplicateLines} className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                Remover Duplicatas
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="result">Resultado:</Label>
                <Textarea
                  id="result"
                  value={resultText}
                  readOnly
                  rows={10}
                  className="bg-secondary/50"
                />
              </div>
              <Button onClick={copyResult} variant="outline" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copiar Resultado
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};