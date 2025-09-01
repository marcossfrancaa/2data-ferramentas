import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const TextReverser = () => {
  const [inputText, setInputText] = useState('');
  const [reversedText, setReversedText] = useState('');
  const { toast } = useToast();

  const reverseText = () => {
    const reversed = inputText.split('').reverse().join('');
    setReversedText(reversed);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência.",
    });
  };

  const reset = () => {
    setInputText('');
    setReversedText('');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Inverter Texto
          </CardTitle>
          <CardDescription>
            Inverter uma palavra, ou uma frase, ou uma string, ou um texto.<br />
            Digite a frase, depois clique no botão "Inverter Texto".
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="input-text" className="text-sm font-medium">
              Digite a frase, depois clique no botão "Inverter Texto":
            </Label>
            
            <div className="relative">
              <Textarea
                id="input-text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Digite o texto que você deseja inverter..."
                className="min-h-32 resize-none bg-green-50 dark:bg-green-900/20"
                rows={6}
              />
            </div>

            <div className="flex justify-center">
              <Button 
                onClick={reverseText}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full"
                disabled={!inputText.trim()}
              >
                Inverter Texto
              </Button>
            </div>
          </div>

          {reversedText && (
            <div className="space-y-4">
              <Label htmlFor="output-text" className="text-sm font-medium">
                Texto Invertido:
              </Label>
              
              <Card className="bg-muted/30">
                <CardContent className="pt-6">
                  <div className="relative">
                    <Textarea
                      id="output-text"
                      value={reversedText}
                      readOnly
                      className="min-h-32 resize-none bg-background"
                      rows={6}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(reversedText)}
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-center gap-3">
                <Button
                  onClick={() => copyToClipboard(reversedText)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copiar Resultado
                </Button>
                
                <Button
                  onClick={reset}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Limpar
                </Button>
              </div>
            </div>
          )}

          {/* Exemplos */}
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Exemplos de Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p><strong>Entrada:</strong> "Olá mundo"</p>
                    <p><strong>Saída:</strong> "odnum álO"</p>
                  </div>
                  <div>
                    <p><strong>Entrada:</strong> "123456"</p>
                    <p><strong>Saída:</strong> "654321"</p>
                  </div>
                  <div>
                    <p><strong>Entrada:</strong> "A grama é amarga"</p>
                    <p><strong>Saída:</strong> "agrama é amarg A"</p>
                  </div>
                  <div>
                    <p><strong>Entrada:</strong> "radar"</p>
                    <p><strong>Saída:</strong> "radar" (palíndromo)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};