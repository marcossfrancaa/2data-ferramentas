import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Type, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const TextCaseConverter = () => {
  const [texto, setTexto] = useState('');
  const [resultado, setResultado] = useState('');
  const { toast } = useToast();

  const converterMaiuscula = () => {
    setResultado(texto.toUpperCase());
  };

  const converterMinuscula = () => {
    setResultado(texto.toLowerCase());
  };

  const alterarCaso = () => {
    const resultado = texto.split('').map(char => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase();
      } else {
        return char.toUpperCase();
      }
    }).join('');
    setResultado(resultado);
  };

  const inverterTexto = () => {
    setResultado(texto.split('').reverse().join(''));
  };

  const primeiraLetraPalavra = () => {
    const palavras = texto.split(' ');
    const resultado = palavras.map(palavra => {
      if (palavra.length > 0) {
        return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
      }
      return palavra;
    });
    setResultado(resultado.join(' '));
  };

  const primeiraPalavraFrase = () => {
    const frases = texto.split('. ');
    const resultado = frases.map(frase => {
      if (frase.length > 0) {
        return frase.charAt(0).toUpperCase() + frase.slice(1).toLowerCase();
      }
      return frase;
    });
    setResultado(resultado.join('. '));
  };

  const selecionarTudo = () => {
    setResultado(texto);
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
          <h1 className="text-3xl font-bold text-card-foreground">Converter Maiúsculas e Minúsculas</h1>
        </div>
        <p className="text-muted-foreground">
          Transformar texto para maiúsculas ou para minúsculas ou para Primeira Maiúscula.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="texto">Digite o texto:</Label>
              <Textarea
                id="texto"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Digite o texto aqui..."
                className="min-h-32"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <Button variant="outline" onClick={converterMaiuscula}>
                MAIÚSCULO
              </Button>
              <Button variant="outline" onClick={converterMinuscula}>
                minúsculo
              </Button>
              <Button variant="outline" onClick={alterarCaso}>
                AlTeRaR CaSo
              </Button>
              <Button variant="outline" onClick={inverterTexto}>
                Inverter Texto
              </Button>
              <Button variant="outline" onClick={primeiraLetraPalavra}>
                Primeira Letra Palavra
              </Button>
              <Button variant="outline" onClick={primeiraPalavraFrase}>
                Primeira palavra frase
              </Button>
              <Button variant="outline" onClick={selecionarTudo}>
                Selecionar Tudo
              </Button>
            </div>
          </div>
        </Card>

        {resultado && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Resultado:</Label>
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