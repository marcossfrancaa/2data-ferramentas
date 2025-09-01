import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Code, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Base64Converter = () => {
  const [textInput, setTextInput] = useState('');
  const [base64Input, setBase64Input] = useState('');
  const [textOutput, setTextOutput] = useState('');
  const [base64Output, setBase64Output] = useState('');
  const { toast } = useToast();

  const encodeToBase64 = () => {
    if (!textInput.trim()) return;
    
    try {
      const encoded = btoa(unescape(encodeURIComponent(textInput)));
      setBase64Output(encoded);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível codificar o texto",
        variant: "destructive",
      });
    }
  };

  const decodeFromBase64 = () => {
    if (!base64Input.trim()) return;
    
    try {
      const decoded = decodeURIComponent(escape(atob(base64Input)));
      setTextOutput(decoded);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Base64 inválido ou não foi possível decodificar",
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
    setBase64Input('');
    setTextOutput('');
    setBase64Output('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Conversor Base64</h1>
        </div>
        <p className="text-muted-foreground">
          Codifica texto para Base64 e decodifica Base64 para texto. 
          Útil para transmissão de dados binários em formatos de texto.
        </p>
      </div>

      <Tabs defaultValue="encode" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="encode" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Codificar
          </TabsTrigger>
          <TabsTrigger value="decode" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
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
                placeholder="Digite o texto que deseja codificar em Base64..."
                className="min-h-64 font-mono text-sm mb-4"
              />

              <div className="flex gap-2">
                <Button
                  onClick={encodeToBase64}
                  disabled={!textInput.trim()}
                  className="bg-gradient-primary hover:opacity-90 transition-fast"
                >
                  <Upload className="w-4 h-4 mr-2" />
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
                  Base64 Codificado
                </h3>
                {base64Output && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(base64Output)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                )}
              </div>
              
              <Textarea
                value={base64Output}
                readOnly
                placeholder="Base64 codificado aparecerá aqui..."
                className="min-h-64 font-mono text-sm bg-muted/30"
              />
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="decode">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6 bg-gradient-card">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Base64 Codificado
              </h3>
              
              <Textarea
                value={base64Input}
                onChange={(e) => setBase64Input(e.target.value)}
                placeholder="Cole o Base64 que deseja decodificar..."
                className="min-h-64 font-mono text-sm mb-4"
              />

              <div className="flex gap-2">
                <Button
                  onClick={decodeFromBase64}
                  disabled={!base64Input.trim()}
                  className="bg-gradient-primary hover:opacity-90 transition-fast"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Decodificar
                </Button>
                <Button
                  onClick={() => setBase64Input('')}
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
          <Code className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre Base64</h4>
            <p className="text-muted-foreground">
              Base64 é um sistema de codificação que converte dados binários em texto ASCII. 
              É amplamente usado para transmitir dados através de protocolos que suportam apenas texto, 
              como email e URLs de dados.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};