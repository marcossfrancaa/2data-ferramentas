import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Hash, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NumberToTextConverter = () => {
  const [numero, setNumero] = useState('');
  const [unidade, setUnidade] = useState('reais');
  const [tipoLetra, setTipoLetra] = useState('minusculas');
  const [primeiraLetra, setPrimeiraLetra] = useState('primeira_maiuscula');
  const [resultado, setResultado] = useState('');
  const { toast } = useToast();

  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const especiais = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  const converterNumeroParaTexto = (num: number): string => {
    if (num === 0) return 'zero';
    if (num === 100) return 'cem';
    
    let texto = '';
    
    // Centenas
    if (num >= 100) {
      const c = Math.floor(num / 100);
      texto += centenas[c];
      num %= 100;
      if (num > 0) texto += ' e ';
    }
    
    // Dezenas especiais (10-19)
    if (num >= 10 && num <= 19) {
      texto += especiais[num - 10];
    } else {
      // Dezenas normais
      if (num >= 20) {
        const d = Math.floor(num / 10);
        texto += dezenas[d];
        num %= 10;
        if (num > 0) texto += ' e ';
      }
      
      // Unidades
      if (num > 0 && num < 10) {
        texto += unidades[num];
      }
    }
    
    return texto;
  };

  const escreverPorExtenso = () => {
    const valor = parseFloat(numero);
    
    if (isNaN(valor)) {
      toast({
        title: "Erro",
        description: "Digite um número válido",
        variant: "destructive",
      });
      return;
    }

    const parteInteira = Math.floor(Math.abs(valor));
    const parteDecimal = Math.round((Math.abs(valor) - parteInteira) * 100);
    
    let textoCompleto = '';
    
    if (valor < 0) textoCompleto += 'menos ';
    
    if (parteInteira === 0) {
      textoCompleto += 'zero';
    } else if (parteInteira < 1000) {
      textoCompleto += converterNumeroParaTexto(parteInteira);
    } else {
      // Para números maiores que 1000, implementação simplificada
      textoCompleto += parteInteira.toString();
    }
    
    // Adicionar unidade monetária
    if (unidade === 'reais') {
      if (parteInteira === 1) {
        textoCompleto += ' real';
      } else {
        textoCompleto += ' reais';
      }
      
      if (parteDecimal > 0) {
        textoCompleto += ' e ' + converterNumeroParaTexto(parteDecimal);
        if (parteDecimal === 1) {
          textoCompleto += ' centavo';
        } else {
          textoCompleto += ' centavos';
        }
      }
    } else {
      // Número simples sem unidade monetária
    }
    
    // Aplicar formatação de texto
    if (tipoLetra === 'maiusculas') {
      textoCompleto = textoCompleto.toUpperCase();
    }
    
    if (primeiraLetra === 'primeira_maiuscula') {
      textoCompleto = textoCompleto.charAt(0).toUpperCase() + textoCompleto.slice(1);
    }
    
    setResultado(textoCompleto);
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
          <Hash className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Número por Extenso Online</h1>
        </div>
        <p className="text-muted-foreground">
          Ferramenta para escrever números por extenso. Digite o número ou o valor em reais e convertemos automaticamente para por extenso.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <Label htmlFor="numero">Digite o valor:</Label>
              <Input
                id="numero"
                type="number"
                step="0.01"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="123.45"
              />
            </div>

            <div>
              <Label className="text-base font-medium">1. Qual a unidade?</Label>
              <RadioGroup value={unidade} onValueChange={setUnidade} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reais" id="reais" />
                  <Label htmlFor="reais">Monetária (Reais)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="numerica" id="numerica" />
                  <Label htmlFor="numerica">Numérica (Número Simples)</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base font-medium">2. Tipo de Letra?</Label>
              <RadioGroup value={tipoLetra} onValueChange={setTipoLetra} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="minusculas" id="minusculas" />
                  <Label htmlFor="minusculas">minúsculas</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="maiusculas" id="maiusculas" />
                  <Label htmlFor="maiusculas">MAIÚSCULAS</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="primeira_maiuscula" id="primeira_maiuscula" />
                  <Label htmlFor="primeira_maiuscula">Primeira Maiúscula</Label>
                </div>
              </RadioGroup>
            </div>

            <Button onClick={escreverPorExtenso} className="w-full">
              Escrever por Extenso
            </Button>
          </div>
        </Card>

        {resultado && (
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Resposta por extenso:</Label>
                <Button variant="outline" size="sm" onClick={copiarResultado}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </div>
              <Textarea
                value={resultado}
                readOnly
                className="min-h-24 bg-accent/5"
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};