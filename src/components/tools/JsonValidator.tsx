import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Check, X, AlertCircle, Copy, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const JsonValidator = () => {
  const [json, setJson] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  const [parsedData, setParsedData] = useState<any>(null);
  const [jsonInfo, setJsonInfo] = useState<{
    size: number;
    lines: number;
    characters: number;
    properties: number;
  } | null>(null);
  const { toast } = useToast();

  const validateJson = (value: string) => {
    if (!value.trim()) {
      setIsValid(null);
      setError('');
      setParsedData(null);
      setJsonInfo(null);
      return;
    }

    try {
      const parsed = JSON.parse(value);
      setIsValid(true);
      setError('');
      setParsedData(parsed);
      
      // Calcular informações
      const size = new Blob([value]).size;
      const lines = value.split('\n').length;
      const characters = value.length;
      const properties = countProperties(parsed);
      
      setJsonInfo({ size, lines, characters, properties });
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setParsedData(null);
      setJsonInfo(null);
    }
  };

  const countProperties = (obj: any): number => {
    if (typeof obj !== 'object' || obj === null) return 0;
    
    let count = 0;
    
    if (Array.isArray(obj)) {
      obj.forEach(item => {
        count += countProperties(item);
      });
    } else {
      count += Object.keys(obj).length;
      Object.values(obj).forEach(value => {
        count += countProperties(value);
      });
    }
    
    return count;
  };

  const getDataType = (data: any): string => {
    if (data === null) return 'null';
    if (Array.isArray(data)) return 'array';
    return typeof data;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Conteúdo copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o conteúdo",
        variant: "destructive",
      });
    }
  };

  const clearJson = () => {
    setJson('');
    setIsValid(null);
    setError('');
    setParsedData(null);
    setJsonInfo(null);
  };

  const loadExample = () => {
    const exampleJson = `{
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "idade": 30,
    "ativo": true,
    "enderecos": [
      {
        "tipo": "residencial",
        "rua": "Rua das Flores, 123",
        "cidade": "São Paulo",
        "cep": "01234-567"
      },
      {
        "tipo": "comercial",
        "rua": "Av. Paulista, 1000",
        "cidade": "São Paulo",
        "cep": "01310-100"
      }
    ],
    "configuracoes": {
      "tema": "escuro",
      "notificacoes": true,
      "idioma": "pt-BR"
    }
  }
}`;
    setJson(exampleJson);
  };

  useEffect(() => {
    validateJson(json);
  }, [json]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Validador JSON</h1>
        </div>
        <p className="text-muted-foreground">
          Valide a sintaxe do seu JSON e obtenha informações detalhadas sobre a estrutura dos dados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              JSON para Validar
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
            value={json}
            onChange={(e) => setJson(e.target.value)}
            placeholder='{"nome": "João", "idade": 30, "ativo": true}'
            className="min-h-80 font-mono text-sm"
          />

          {error && (
            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-destructive text-sm font-medium">Erro de Sintaxe:</p>
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <Button
              onClick={loadExample}
              variant="outline"
            >
              Carregar Exemplo
            </Button>
            <Button
              onClick={clearJson}
              variant="outline"
              disabled={!json}
            >
              Limpar
            </Button>
            <Button
              onClick={() => copyToClipboard(json)}
              variant="outline"
              disabled={!json}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar
            </Button>
          </div>
        </Card>

        {/* Results */}
        <div className="space-y-4">
          {/* Status */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Status da Validação
            </h3>
            
            <div className="space-y-3">
              {isValid === null && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <AlertCircle className="w-5 h-5" />
                  <span>Aguardando JSON para validar...</span>
                </div>
              )}
              
              {isValid === true && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-success">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">JSON é válido!</span>
                  </div>
                  
                  {jsonInfo && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Tamanho:</span>
                        <p className="font-medium">{jsonInfo.size} bytes</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Linhas:</span>
                        <p className="font-medium">{jsonInfo.lines}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Caracteres:</span>
                        <p className="font-medium">{jsonInfo.characters}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Propriedades:</span>
                        <p className="font-medium">{jsonInfo.properties}</p>
                      </div>
                    </div>
                  )}
                  
                  {parsedData && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Tipo de dados:</span>
                      <p className="font-medium capitalize">{getDataType(parsedData)}</p>
                    </div>
                  )}
                </div>
              )}
              
              {isValid === false && (
                <div className="flex items-center gap-2 text-destructive">
                  <X className="w-5 h-5" />
                  <span className="font-medium">JSON inválido</span>
                </div>
              )}
            </div>
          </Card>

          {/* Formatted JSON Preview */}
          {isValid === true && parsedData && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  JSON Formatado
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(JSON.stringify(parsedData, null, 2))}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </div>
              
              <Textarea
                value={JSON.stringify(parsedData, null, 2)}
                readOnly
                className="min-h-60 font-mono text-sm bg-muted/30"
              />
            </Card>
          )}
        </div>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre Validação JSON</h4>
            <p className="text-muted-foreground">
              Esta ferramenta verifica se seu JSON está sintaticamente correto de acordo com as especificações RFC 7159. 
              Ela também fornece informações úteis sobre a estrutura dos dados, como número de propriedades e tipo de dados.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};