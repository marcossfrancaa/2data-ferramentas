import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight, Copy } from 'lucide-react';
import { toast } from 'sonner';

export const UpsideDownText = () => {
  const [inputText, setInputText] = useState('');
  const [resultText, setResultText] = useState('');

  // Mapeamento de caracteres para versões de cabeça para baixo
  const upsideDownMap: { [key: string]: string } = {
    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
    'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
    'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
    'y': 'ʎ', 'z': 'z',
    'A': '∀', 'B': 'ᗺ', 'C': 'Ɔ', 'D': 'ᗡ', 'E': 'Ǝ', 'F': 'ᖴ', 'G': 'פ', 'H': 'H',
    'I': 'I', 'J': 'ſ', 'K': 'ʞ', 'L': '˥', 'M': 'W', 'N': 'N', 'O': 'O', 'P': 'Ԁ',
    'Q': 'Q', 'R': 'ᴿ', 'S': 'S', 'T': '┴', 'U': '∩', 'V': 'Λ', 'W': 'M', 'X': 'X',
    'Y': '⅄', 'Z': 'Z',
    '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ',
    '8': '8', '9': '6',
    '?': '¿', '!': '¡', '.': '˙', ',': "'", "'": ',', '"': ',,', '(': ')', ')': '(',
    '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋',
    '_': '‾', '-': '-', '+': '+', '=': '=', '/': '\\', '\\': '/', '|': '|'
  };

  const convertToUpsideDown = () => {
    if (!inputText.trim()) {
      toast.error('Digite um texto para converter');
      return;
    }
    
    const converted = inputText
      .split('')
      .map(char => upsideDownMap[char] || char)
      .reverse()
      .join('');
    
    setResultText(converted);
    toast.success('Texto convertido para cabeça para baixo!');
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
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Texto de Cabeça para Baixo</CardTitle>
          <CardDescription>
            Converte seu texto para uma versão de cabeça para baixo usando caracteres Unicode especiais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="input-text">Digite ou cole o texto no campo abaixo:</Label>
                <Textarea
                  id="input-text"
                  placeholder="Digite seu texto aqui..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={8}
                />
              </div>
              <Button onClick={convertToUpsideDown} className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                Converter
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="result">Resultado:</Label>
                <Textarea
                  id="result"
                  value={resultText}
                  readOnly
                  rows={8}
                  className="bg-secondary/50"
                  style={{ fontSize: '16px', lineHeight: '1.4' }}
                />
              </div>
              <Button onClick={copyResult} variant="outline" className="w-full">
                <Copy className="h-4 w-4 mr-2" />
                Copiar Resultado
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};