import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Type, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LineBreakRemover = () => {
  const [texto, setTexto] = useState('');
  const [substituirPor, setSubstituirPor] = useState('nada');
  const [caractereCustom, setCaractereCustom] = useState('');
  const [resultado, setResultado] = useState('');
  const { toast } = useToast();

  const removerQuebra = () => {
    let textoProcessado = texto;
    
    switch (substituirPor) {
      case 'nada':
        textoProcessado = texto.replace(/\n/g, '');
        break;
      case 'br':
        textoProcessado = texto.replace(/\n/g, '<br />');
        break;
      case 'espaco':
        textoProcessado = texto.replace(/\n/g, ' ');
        break;
      case 'por':
        textoProcessado = texto.replace(/\n/g, caractereCustom);
        break;
    }
    
    setResultado(textoProcessado);
  };

  const copiarResultado = () => {
    navigator.clipboard.writeText(resultado);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Type className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Remover ou Trocar Quebra Linha '\n'</h1>
        </div>
        <p className="text-muted-foreground">
          Remover o '\n' ou caracter de newline de um texto.
        </p>
        <p className="text-muted-foreground mt-2">
          Digite o texto, depois clique em "Remover Quebra" e confira o resultado abaixo do botão:
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="texto">Digite o texto:</Label>
              <Textarea
                id="texto"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Digite o texto com quebras de linha aqui..."
                className="min-h-32 bg-accent/10"
              />
            </div>

            <div>
              <Label className="text-base font-medium">Substituir por?</Label>
              <RadioGroup value={substituirPor} onValueChange={setSubstituirPor} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nada" id="nada" />
                  <Label htmlFor="nada">por Nada</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="br" id="br" />
                  <Label htmlFor="br">por &lt;br /&gt;</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="espaco" id="espaco" />
                  <Label htmlFor="espaco">por " " (espaço)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="por" id="por" />
                  <Label htmlFor="por">por</Label>
                </div>
              </RadioGroup>
            </div>

            {substituirPor === 'por' && (
              <div>
                <Label htmlFor="caractere">este caracter:</Label>
                <Input
                  id="caractere"
                  value={caractereCustom}
                  onChange={(e) => setCaractereCustom(e.target.value)}
                  placeholder="Digite o caracter de substituição"
                />
              </div>
            )}

            <Button onClick={removerQuebra} className="w-full">
              Remover Quebra
            </Button>
          </div>
        </Card>

        {resultado && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Texto processado:</Label>
                <Button variant="outline" size="sm" onClick={copiarResultado}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </div>
              <Textarea
                value={resultado}
                readOnly
                className="min-h-32 bg-accent/5"
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};