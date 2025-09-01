import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { useToast } from '../ui/use-toast';
import { Search, Hash } from 'lucide-react';

export const WordOccurrenceCounter = () => {
  const [text, setText] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const { toast } = useToast();

  const countOccurrences = () => {
    if (!text.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, digite o texto para análise.',
        variant: 'destructive',
      });
      return;
    }

    if (!searchWord.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, digite a palavra que deseja procurar.',
        variant: 'destructive',
      });
      return;
    }

    const textToSearch = caseSensitive ? text : text.toLowerCase();
    const wordToFind = caseSensitive ? searchWord : searchWord.toLowerCase();
    
    // Use regex with word boundaries to match whole words
    const regex = new RegExp(`\\b${wordToFind.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
    const matches = textToSearch.match(regex);
    
    setResult(matches ? matches.length : 0);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Contador de Ocorrência de Palavra
          </CardTitle>
          <p className="text-muted-foreground">
            Contador de ocorrências de palavra em um texto. Digite o texto, 
            depois digite a palavra procurada, depois clique em "Contar Palavras" 
            e confira o resultado abaixo do botão.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
            <Label className="text-base font-medium">Opções:</Label>
            
            <div className="space-y-2">
              <Label htmlFor="text-input">Digite o texto:</Label>
              <Textarea
                id="text-input"
                placeholder="Digite ou cole o texto aqui..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-32 bg-green-50 dark:bg-green-950/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="search-word">Digite a palavra procurada:</Label>
              <Input
                id="search-word"
                placeholder="Palavra a ser procurada..."
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                className="bg-pink-50 dark:bg-pink-950/20"
              />
            </div>

            <div className="space-y-3">
              <Label>Diferenciar letras maiúsculas de minúsculas?</Label>
              <RadioGroup 
                value={caseSensitive ? 'yes' : 'no'} 
                onValueChange={(value) => setCaseSensitive(value === 'yes')}
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

          <Button onClick={countOccurrences} className="w-full">
            <Search className="h-4 w-4 mr-2" />
            Contar Palavras
          </Button>

          {result !== null && (
            <div className="text-center p-4 border rounded-lg bg-primary/5">
              <p className="text-lg">
                A palavra "<span className="font-semibold">{searchWord}</span>" 
                aparece <span className="font-bold text-primary">{result}</span> vez(es) no texto.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};