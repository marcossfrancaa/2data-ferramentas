import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Replace, Copy } from 'lucide-react';
import { toast } from 'sonner';

export const FindAndReplace = () => {
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');

  const performFindAndReplace = () => {
    if (!inputText.trim()) {
      toast.error('Digite um texto para processar');
      return;
    }

    if (!findText.trim()) {
      toast.error('Digite o texto que deseja localizar');
      return;
    }

    const result = inputText.split(findText).join(replaceText);
    const occurrences = inputText.split(findText).length - 1;
    
    setResultText(result);
    
    if (occurrences > 0) {
      toast.success(`${occurrences} ocorrência(s) substituída(s)!`);
    } else {
      toast.info('Nenhuma ocorrência encontrada');
    }
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
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Localizar e Substituir</CardTitle>
          <CardDescription>
            Encontre e substitua texto em documentos ou códigos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Campos de busca e substituição */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="find-text">Localizar:</Label>
                <Textarea
                  id="find-text"
                  placeholder="Digite o texto que deseja encontrar..."
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="replace-text">Substituir por:</Label>
                <Textarea
                  id="replace-text"
                  placeholder="Digite o texto de substituição..."
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Área de texto principal */}
            <div>
              <Label htmlFor="input-text">Seu texto:</Label>
              <Textarea
                id="input-text"
                placeholder="Cole ou digite seu texto aqui..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={8}
              />
            </div>

            {/* Botão de ação */}
            <div className="flex justify-center">
              <Button onClick={performFindAndReplace} size="lg">
                <Search className="h-4 w-4 mr-2" />
                Localizar e Substituir
              </Button>
            </div>

            {/* Resultado */}
            {resultText && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="result">Resultado:</Label>
                  <Textarea
                    id="result"
                    value={resultText}
                    readOnly
                    rows={8}
                    className="bg-secondary/50"
                  />
                </div>
                <Button onClick={copyResult} variant="outline" className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Resultado
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};