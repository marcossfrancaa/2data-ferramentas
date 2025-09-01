import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CharacterInfo = () => {
  const [character, setCharacter] = useState('');
  const { toast } = useToast();

  const getCharacterInfo = (char: string) => {
    if (!char) return null;
    
    const firstChar = char[0];
    const charCode = firstChar.charCodeAt(0);
    
    return {
      character: firstChar,
      decimal: charCode,
      hexadecimal: charCode.toString(16).toUpperCase(),
      unicode: `U+${charCode.toString(16).toUpperCase().padStart(4, '0')}`,
      binary: charCode.toString(2),
      octal: charCode.toString(8),
      name: getCharacterName(firstChar),
      category: getCharacterCategory(charCode)
    };
  };

  const getCharacterName = (char: string): string => {
    const code = char.charCodeAt(0);
    
    if (code >= 32 && code <= 126) {
      if (code >= 48 && code <= 57) return `DIGIT ${char}`;
      if (code >= 65 && code <= 90) return `LATIN CAPITAL LETTER ${char}`;
      if (code >= 97 && code <= 122) return `LATIN SMALL LETTER ${char.toUpperCase()}`;
      
      const specialChars: { [key: string]: string } = {
        ' ': 'SPACE',
        '!': 'EXCLAMATION MARK',
        '"': 'QUOTATION MARK',
        '#': 'NUMBER SIGN',
        '$': 'DOLLAR SIGN',
        '%': 'PERCENT SIGN',
        '&': 'AMPERSAND',
        "'": 'APOSTROPHE',
        '(': 'LEFT PARENTHESIS',
        ')': 'RIGHT PARENTHESIS',
        '*': 'ASTERISK',
        '+': 'PLUS SIGN',
        ',': 'COMMA',
        '-': 'HYPHEN-MINUS',
        '.': 'FULL STOP',
        '/': 'SOLIDUS',
        ':': 'COLON',
        ';': 'SEMICOLON',
        '<': 'LESS-THAN SIGN',
        '=': 'EQUALS SIGN',
        '>': 'GREATER-THAN SIGN',
        '?': 'QUESTION MARK',
        '@': 'COMMERCIAL AT',
        '[': 'LEFT SQUARE BRACKET',
        '\\': 'REVERSE SOLIDUS',
        ']': 'RIGHT SQUARE BRACKET',
        '^': 'CIRCUMFLEX ACCENT',
        '_': 'LOW LINE',
        '`': 'GRAVE ACCENT',
        '{': 'LEFT CURLY BRACKET',
        '|': 'VERTICAL LINE',
        '}': 'RIGHT CURLY BRACKET',
        '~': 'TILDE'
      };
      
      return specialChars[char] || 'UNKNOWN CHARACTER';
    }
    
    if (code < 32) return 'CONTROL CHARACTER';
    return 'EXTENDED CHARACTER';
  };

  const getCharacterCategory = (code: number): string => {
    if (code >= 0 && code <= 31) return 'Caractere de Controle';
    if (code === 32) return 'Espaço';
    if (code >= 33 && code <= 47) return 'Símbolos';
    if (code >= 48 && code <= 57) return 'Dígitos';
    if (code >= 58 && code <= 64) return 'Símbolos';
    if (code >= 65 && code <= 90) return 'Letras Maiúsculas';
    if (code >= 91 && code <= 96) return 'Símbolos';
    if (code >= 97 && code <= 122) return 'Letras Minúsculas';
    if (code >= 123 && code <= 126) return 'Símbolos';
    if (code === 127) return 'Caractere de Controle (DEL)';
    return 'Caractere Estendido';
  };

  const handleInputChange = (value: string) => {
    setCharacter(value);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${type} copiado para a área de transferência.`,
    });
  };

  const charInfo = getCharacterInfo(character);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Informações de Caracter
          </CardTitle>
          <CardDescription>
            Informações Detalhadas de um Caracter.<br />
            Seu código ASCII em Decimal, Hexadecimal e Unicode.<br />
            Basta digitar o caracter depois clicar em "Informações do Caracter" e conferir o resultado abaixo do botão.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label htmlFor="character" className="text-sm font-medium">
              Digite o caracter:
            </Label>
            <div className="flex flex-col items-center space-y-4">
              <Input
                id="character"
                type="text"
                maxLength={1}
                value={character}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder=""
                className="w-20 h-20 text-4xl text-center font-mono border-2"
              />
              
              <Button 
                onClick={() => {/* Informações já são mostradas automaticamente */}}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-full"
              >
                Informações do Caracter
              </Button>
            </div>
          </div>

          {charInfo && (
            <Card className="bg-muted/30">
              <CardHeader>
                <CardTitle className="text-lg text-center">
                  Informações do Caracter: "{charInfo.character}"
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded border">
                      <span className="font-medium">Caracter:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg">{charInfo.character}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(charInfo.character, 'Caracter')}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background rounded border">
                      <span className="font-medium">ASCII Decimal:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{charInfo.decimal}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(charInfo.decimal.toString(), 'ASCII Decimal')}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background rounded border">
                      <span className="font-medium">Hexadecimal:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">0x{charInfo.hexadecimal}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`0x${charInfo.hexadecimal}`, 'Hexadecimal')}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background rounded border">
                      <span className="font-medium">Unicode:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{charInfo.unicode}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(charInfo.unicode, 'Unicode')}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded border">
                      <span className="font-medium">Binário:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{charInfo.binary}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(charInfo.binary, 'Binário')}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background rounded border">
                      <span className="font-medium">Octal:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{charInfo.octal}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(charInfo.octal, 'Octal')}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background rounded border">
                      <span className="font-medium">Categoria:</span>
                      <span className="text-sm">{charInfo.category}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-background rounded border">
                      <span className="font-medium">Nome:</span>
                      <span className="text-sm font-mono">{charInfo.name}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};