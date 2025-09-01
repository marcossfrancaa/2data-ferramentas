import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';
import { Copy, Split } from 'lucide-react';

export const StringSplitter = () => {
  const [text, setText] = useState('');
  const [delimiter, setDelimiter] = useState('');
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const splitString = () => {
    if (!text.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, digite o texto para dividir.',
        variant: 'destructive',
      });
      return;
    }

    if (!delimiter) {
      toast({
        title: 'Erro',
        description: 'Por favor, digite a palavra que será usada para dividir o texto.',
        variant: 'destructive',
      });
      return;
    }

    const parts = text.split(delimiter);
    const formattedResult = parts
      .map((part, index) => `Parte ${index + 1}: ${part.trim()}`)
      .join('\n');

    setResult(formattedResult);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: 'Copiado!',
      description: 'Texto dividido copiado para a área de transferência.',
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Split className="h-5 w-5" />
            Dividir String
          </CardTitle>
          <p className="text-muted-foreground">
            Dividir um texto baseado numa palavra. Digite o texto, digite a palavra procurada, 
            depois clique em "Dividir o Texto" e confira o resultado abaixo do botão:
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <Label className="text-base font-medium">Opções:</Label>
            
            <div className="space-y-2">
              <Label htmlFor="text-input">Digite o texto:</Label>
              <Textarea
                id="text-input"
                placeholder="Digite o texto que deseja dividir..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-32 bg-green-50 dark:bg-green-950/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="delimiter-input">Dividir usando esta palavra:</Label>
              <Input
                id="delimiter-input"
                placeholder="Digite a palavra separadora..."
                value={delimiter}
                onChange={(e) => setDelimiter(e.target.value)}
                className="bg-green-50 dark:bg-green-950/20"
              />
            </div>
          </div>

          <Button onClick={splitString} className="w-full">
            <Split className="h-4 w-4 mr-2" />
            Dividir o Texto
          </Button>

          {result && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Texto dividido:</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </div>
              <Textarea
                value={result}
                readOnly
                className="min-h-40"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};