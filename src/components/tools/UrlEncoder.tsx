import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Globe, Lock, Unlock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const UrlEncoder = () => {
  const [textInput, setTextInput] = useState('');
  const [encodedInput, setEncodedInput] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [encodedOutput, setEncodedOutput] = useState('');
  const { toast } = useToast();

  const encodeUrl = () => {
    if (!textInput.trim()) return;
    
    try {
      const encoded = encodeURIComponent(textInput);
      setEncodedOutput(encoded);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível codificar a URL",
        variant: "destructive",
      });
    }
  };

  const decodeUrl = () => {
    if (!encodedInput.trim()) return;
    
    try {
      const decoded = decodeURIComponent(encodedInput);
      setTextOutput(decoded);
    } catch (error) {
      toast({
        title: "Erro",
        description: "URL inválida ou não foi possível decodificar",
        variant: "destructive",
      });
    }
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

  const clearAll = () => {
    setTextInput('');
    setEncodedInput('');
    setTextOutput('');
    setEncodedOutput('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Codificador URL</h1>
        </div>
        <p className="text-muted-foreground">
          Codifica e decodifica URLs para uso seguro na web. 
          Converte caracteres especiais em formato compatível com URLs.
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
            <Card className="p-6 bg-gradient-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Texto Original
              </h3>
              
              <Textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Digite a URL ou texto que deseja codificar..."
                className="min-h-64 font-mono text-sm mb-4"
              />

              <div className="flex gap-2">
                <Button
                  onClick={encodeUrl}
                  disabled={!textInput.trim()}
                  className="bg-gradient-primary hover:opacity-90 transition-fast"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Codificar
                </Button>
                <Button
                  onClick={() => setTextInput('')}
                  variant="outline"
                >
                  Limpar
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  URL Codificada
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
                placeholder="URL codificada aparecerá aqui..."
                className="min-h-64 font-mono text-sm bg-muted/30"
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="decode">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                URL Codificada
              </h3>
              
              <Textarea
                value={encodedInput}
                onChange={(e) => setEncodedInput(e.target.value)}
                placeholder="Cole a URL codificada que deseja decodificar..."
                className="min-h-64 font-mono text-sm mb-4"
              />

              <div className="flex gap-2">
                <Button
                  onClick={decodeUrl}
                  disabled={!encodedInput.trim()}
                  className="bg-gradient-primary hover:opacity-90 transition-fast"
                >
                  <Unlock className="w-4 h-4 mr-2" />
                  Decodificar
                </Button>
                <Button
                  onClick={() => setEncodedInput('')}
                  variant="outline"
                >
                  Limpar
                </Button>
              </div>
            </Card>

            <Card className="p-6 bg-gradient-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Texto Decodificado
                </h3>
                {textOutput && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(textOutput)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                )}
              </div>
              
              <Textarea
                value={textOutput}
                readOnly
                placeholder="Texto decodificado aparecerá aqui..."
                className="min-h-64 font-mono text-sm bg-muted/30"
              />
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-6">
        <Button
          onClick={clearAll}
          variant="outline"
        >
          Limpar Tudo
        </Button>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Globe className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre Codificação URL</h4>
            <p className="text-muted-foreground">
              A codificação URL (também conhecida como percent-encoding) converte caracteres especiais 
              em um formato que pode ser transmitido pela internet. Essencial para URLs que contêm 
              espaços, acentos e outros caracteres não-ASCII.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};