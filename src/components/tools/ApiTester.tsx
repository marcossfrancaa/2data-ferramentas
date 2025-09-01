
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Globe, Send, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ApiTester = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('{\n  "Content-Type": "application/json"\n}');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const testApi = async () => {
    if (!url.trim()) {
      toast({
        title: "Erro",
        description: "URL é obrigatória",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      let parsedHeaders = {};
      if (headers.trim()) {
        parsedHeaders = JSON.parse(headers);
      }

      const config: RequestInit = {
        method,
        headers: parsedHeaders,
      };

      if (method !== 'GET' && body.trim()) {
        config.body = body;
      }

      const res = await fetch(url, config);
      const responseText = await res.text();
      
      let formattedResponse;
      try {
        const jsonResponse = JSON.parse(responseText);
        formattedResponse = JSON.stringify(jsonResponse, null, 2);
      } catch {
        formattedResponse = responseText;
      }

      setResponse(`Status: ${res.status} ${res.statusText}\n\n${formattedResponse}`);
    } catch (error) {
      setResponse(`Erro: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = async () => {
    if (!response) return;
    
    try {
      await navigator.clipboard.writeText(response);
      toast({
        title: "Copiado!",
        description: "Resposta copiada para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a resposta",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">API Tester</h1>
        </div>
        <p className="text-muted-foreground">
          Teste APIs REST diretamente no navegador com diferentes métodos HTTP.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Configuração da Requisição
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2">
              <div>
                <Label>Método</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Label>URL</Label>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.exemplo.com/endpoint"
                />
              </div>
            </div>

            <div>
              <Label>Headers (JSON)</Label>
              <Textarea
                value={headers}
                onChange={(e) => setHeaders(e.target.value)}
                className="min-h-24 font-mono text-sm"
              />
            </div>

            {method !== 'GET' && (
              <div>
                <Label>Body</Label>
                <Textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{"key": "value"}'
                  className="min-h-32 font-mono text-sm"
                />
              </div>
            )}

            <Button
              onClick={testApi}
              disabled={!url.trim() || loading}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {loading ? 'Enviando...' : 'Enviar Requisição'}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              Resposta
            </h3>
            {response && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyResponse}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            )}
          </div>
          
          <Textarea
            value={response}
            readOnly
            placeholder="Resposta da API aparecerá aqui..."
            className="min-h-96 font-mono text-sm bg-muted/30"
          />
        </Card>
      </div>
    </div>
  );
};
