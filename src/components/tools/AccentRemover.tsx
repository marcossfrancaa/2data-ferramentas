import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Type, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AccentRemover = () => {
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState('');
  const { toast } = useToast();

  const removerAcentos = () => {
    const textoSemAcentos = texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    
    setResultado(textoSemAcentos);
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
          <h1 className="text-3xl font-bold text-card-foreground">Remover Acentos de um Texto</h1>
        </div>
        <p className="text-muted-foreground">
          Remover acentos de um Texto.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="texto">Digite a frase, depois clique em "Remover Acentos" e confira o resultado abaixo do botão:</Label>
              <Textarea
                id="texto"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Digite o texto com acentos aqui..."
                className="min-h-32 bg-accent/10"
              />
            </div>

            <Button onClick={removerAcentos} className="w-full">
              Remover Acentos
            </Button>
          </div>
        </Card>

        {resultado && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Texto sem acentos:</Label>
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