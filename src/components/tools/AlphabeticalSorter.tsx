import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { useToast } from '../ui/use-toast';
import { Copy, ArrowUpDown } from 'lucide-react';

export const AlphabeticalSorter = () => {
  const [text, setText] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('line');
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [result, setResult] = useState('');
  const { toast } = useToast();

  const handleSort = () => {
    if (!text.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, digite algum texto para ordenar.',
        variant: 'destructive',
      });
      return;
    }

    let items: string[] = [];
    
    // Split based on selected option
    switch (sortBy) {
      case 'line':
        items = text.split('\n').filter(item => item.trim());
        break;
      case 'space':
        items = text.split(' ').filter(item => item.trim());
        break;
      case 'comma':
        items = text.split(',').map(item => item.trim()).filter(item => item);
        break;
      case 'period':
        items = text.split('.').map(item => item.trim()).filter(item => item);
        break;
    }

    // Remove duplicates if requested
    if (removeDuplicates) {
      items = [...new Set(items)];
    }

    // Sort alphabetically
    items.sort((a, b) => {
      const comparison = a.localeCompare(b, 'pt-BR', { 
        sensitivity: 'base',
        numeric: true 
      });
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Join back with appropriate separator
    const separator = sortBy === 'line' ? '\n' : 
                     sortBy === 'space' ? ' ' :
                     sortBy === 'comma' ? ', ' : '. ';
    
    setResult(items.join(separator));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({
      title: 'Copiado!',
      description: 'Texto ordenado copiado para a área de transferência.',
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Colocar em Ordem Alfabética
          </CardTitle>
          <p className="text-muted-foreground">
            Ferramenta online para colocar uma lista em ordem alfabética. 
            Copie e cole a lista com os nomes que quer organizar alfabeticamente 
            e depois clique em "Ordenar".
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="text-input">1. Texto original:</Label>
            <Textarea
              id="text-input"
              placeholder="Digite o texto que deseja ordenar..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-40"
            />
            <p className="text-sm text-muted-foreground">
              {text.length}/10.000 caracteres
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label>2. Tipo de ordenação:</Label>
              <RadioGroup value={sortOrder} onValueChange={setSortOrder}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="asc" id="asc" />
                  <Label htmlFor="asc">Ascendente (A-Z)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="desc" id="desc" />
                  <Label htmlFor="desc">Descendente (Z-A)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <Label>3. Ordenar por:</Label>
              <RadioGroup value={sortBy} onValueChange={setSortBy}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="line" id="line" />
                  <Label htmlFor="line">Quebra de Linha</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="space" id="space" />
                  <Label htmlFor="space">Espaço</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comma" id="comma" />
                  <Label htmlFor="comma">Vírgula ( , )</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="period" id="period" />
                  <Label htmlFor="period">Ponto e Vírgula ( ; )</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remove-duplicates"
              checked={removeDuplicates}
              onCheckedChange={(checked) => setRemoveDuplicates(checked === true)}
            />
            <Label htmlFor="remove-duplicates">4. Remover Duplicados?</Label>
          </div>

          <Button onClick={handleSort} className="w-full">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            Ordenar
          </Button>

          {result && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Texto ordenado:</Label>
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