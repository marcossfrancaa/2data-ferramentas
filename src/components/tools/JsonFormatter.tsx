import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, FileText, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const formatJson = () => {
    if (!input.trim()) {
      setOutput('');
      setIsValid(null);
      setError('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setIsValid(true);
      setError('');
    } catch (err) {
      setOutput('');
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  const minifyJson = () => {
    if (!input.trim()) return;

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setIsValid(true);
      setError('');
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  const copyToClipboard = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      toast({
        title: "Copiado!",
        description: "JSON copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o JSON",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setIsValid(null);
    setError('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Formatador JSON</h1>
        </div>
        <p className="text-muted-foreground">
          Valida, formata e minifica JSON. Cole seu JSON e escolha entre formatação 
          legível ou minificação para economia de espaço.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              JSON de Entrada
            </h3>
            <div className="flex items-center gap-2">
              {isValid === true && (
                <div className="flex items-center gap-1 text-success text-sm">
                  <Check className="w-4 h-4" />
                  Válido
                </div>
              )}
              {isValid === false && (
                <div className="flex items-center gap-1 text-destructive text-sm">
                  <X className="w-4 h-4" />
                  Inválido
                </div>
              )}
            </div>
          </div>
          
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              formatJson();
            }}
            placeholder='{"nome": "João", "idade": 30, "cidade": "São Paulo"}'
            className="min-h-80 font-mono text-sm"
          />

          {error && (
            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm font-medium">Erro:</p>
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <Button
              onClick={formatJson}
              disabled={!input.trim()}
            >
              <FileText className="w-4 h-4 mr-2" />
              Formatar
            </Button>
            <Button
              onClick={minifyJson}
              disabled={!input.trim()}
              variant="outline"
            >
              Minificar
            </Button>
            <Button
              onClick={clearAll}
              variant="outline"
            >
              Limpar
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              JSON Formatado
            </h3>
            {output && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            )}
          </div>
          
          <Textarea
            value={output}
            readOnly
            placeholder="JSON formatado aparecerá aqui..."
            className="min-h-80 font-mono text-sm bg-muted/30"
          />
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre JSON</h4>
            <p className="text-muted-foreground">
              JSON (JavaScript Object Notation) é um formato de intercâmbio de dados leve e legível. 
              É amplamente usado em APIs REST, configurações e armazenamento de dados estruturados.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};