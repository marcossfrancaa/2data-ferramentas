import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useToast } from '../ui/use-toast';
import { Copy, Scissors } from 'lucide-react';

export const TextCutter = () => {
  const [text, setText] = useState('');
  const [cutLength, setCutLength] = useState('20');
  const [addEllipsis, setAddEllipsis] = useState(false);
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const cutText = () => {
    if (!text.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, digite algum texto para cortar.',
        variant: 'destructive',
      });
      return;
    }

    const length = parseInt(cutLength);
    if (isNaN(length) || length <= 0) {
      toast({
        title: 'Erro',
        description: 'Por favor, digite um número válido de letras.',
        variant: 'destructive',
      });
      return;
    }

    let cutResult = text.substring(0, length);
    
    // Add ellipsis if text was cut and option is selected
    if (addEllipsis && text.length > length) {
      cutResult += '...';
    }

    setResult(cutResult);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: 'Copiado!',
      description: 'Texto cortado copiado para a área de transferência.',
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scissors className="h-5 w-5" />
            Cortar Textos em 'x' Letras
          </CardTitle>
          <p className="text-muted-foreground">
            Cortar Textos em "X" letras. Digite o texto, digite quantas letras, 
            depois clique em "Cortar Texto" e confira o resultado abaixo do botão:
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <Label className="text-base font-medium">Opções:</Label>
            
            <div className="space-y-2">
              <Label htmlFor="text-input">Digite o texto:</Label>
              <Textarea
                id="text-input"
                placeholder="Digite o texto que deseja cortar..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-32 bg-green-50 dark:bg-green-950/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cut-length">Cortar em 'x' letras:</Label>
              <Input
                id="cut-length"
                type="number"
                placeholder="20"
                value={cutLength}
                onChange={(e) => setCutLength(e.target.value)}
                min="1"
                className="w-32"
              />
            </div>

            <div className="space-y-3">
              <Label>Adicionar "..." (reticências)?</Label>
              <RadioGroup 
                value={addEllipsis ? 'yes' : 'no'} 
                onValueChange={(value) => setAddEllipsis(value === 'yes')}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Sim</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">Não</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Button onClick={cutText} className="w-full">
            <Scissors className="h-4 w-4 mr-2" />
            Cortar Texto
          </Button>

          {result && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Texto cortado:</Label>
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
                className="min-h-32"
              />
              <p className="text-sm text-muted-foreground">
                Texto original: {text.length} caracteres | 
                Texto cortado: {result.length} caracteres
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};