import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Code, Lock, Unlock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const HtmlEncoder = () => {
  const [htmlInput, setHtmlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [encodedOutput, setEncodedOutput] = useState('');
  const [decodedOutput, setDecodedOutput] = useState('');
  const { toast } = useToast();

  const htmlEntities: { [key: string]: string } = {
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };

  const reverseHtmlEntities: { [key: string]: string } = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#39;': "'",
  };

  const encodeHtml = () => {
    if (!textInput.trim()) return;
    
    let encoded = textInput;
    for (const [char, entity] of Object.entries(htmlEntities)) {
      encoded = encoded.replace(new RegExp(char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), entity);
    }
    setEncodedOutput(encoded);
  };

  const decodeHtml = () => {
    if (!htmlInput.trim()) return;
    
    let decoded = htmlInput;
    for (const [entity, char] of Object.entries(reverseHtmlEntities)) {
      decoded = decoded.replace(new RegExp(entity, 'g'), char);
    }
    setDecodedOutput(decoded);
  };

  const copyToClipboard = async (text: string) => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Texto copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o texto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">HTML Encoder</h1>
        </div>
        <p className="text-muted-foreground">
          Codifica e decodifica entidades HTML para uso seguro em páginas web.
        </p>
      </div>

      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="encode" className="flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Codificar
          </TabsTrigger>
          <TabsTrigger value="decode" className="flex items-center gap-2">
            <Unlock className="w-4 h-4" />
            Decodificar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="encode">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Texto Original
              </h3>
              
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Digite o texto ou HTML que deseja codificar..."
                className="min-h-64 font-mono text-sm mb-4"
              />

              <div className="flex gap-2">
                <Button
                  onClick={encodeHtml}
                  disabled={!textInput.trim()}
                  className="w-full"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Codificar HTML
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  HTML Codificado
                </h3>
                {encodedOutput && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(encodedOutput)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                )}
              </div>
              
              <Textarea
                value={encodedOutput}
                readOnly
                placeholder="HTML codificado aparecerá aqui..."
                className="min-h-64 font-mono text-sm bg-muted/30"
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="decode">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                HTML Codificado
              </h3>
              
              <Textarea
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder="Cole o HTML codificado que deseja decodificar..."
                className="min-h-64 font-mono text-sm mb-4"
              />

              <div className="flex gap-2">
                <Button
                  onClick={decodeHtml}
                  disabled={!htmlInput.trim()}
                  className="w-full"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Decodificar HTML
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Texto Decodificado
                </h3>
                {decodedOutput && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(decodedOutput)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                )}
              </div>
              
              <Textarea
                value={decodedOutput}
                readOnly
                placeholder="Texto decodificado aparecerá aqui..."
                className="min-h-64 font-mono text-sm bg-muted/30"
              />
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};