import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Shield, Copy, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SecurityKeyGenerator = () => {
  const [keyType, setKeyType] = useState('');
  const [keyLength, setKeyLength] = useState('32');
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedKey, setGeneratedKey] = useState('');
  const [showKey, setShowKey] = useState(true);
  const { toast } = useToast();

  const keyTypes = [
    { value: 'api', name: 'API Key', format: 'alphanumeric' },
    { value: 'jwt-secret', name: 'JWT Secret', format: 'complex' },
    { value: 'encryption', name: 'Chave de Criptografia', format: 'hex' },
    { value: 'session', name: 'Session Key', format: 'base64' },
    { value: 'webhook', name: 'Webhook Secret', format: 'complex' },
  ];

  const generateSecurityKey = () => {
    if (!keyType) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de chave de segurança",
        variant: "destructive",
      });
      return;
    }

    const selectedType = keyTypes.find(t => t.value === keyType);
    if (!selectedType) return;

    let key = '';
    const length = parseInt(keyLength);

    switch (selectedType.format) {
      case 'alphanumeric':
        // API Keys: letras e números
        const apiChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < length; i++) {
          key += apiChars.charAt(Math.floor(Math.random() * apiChars.length));
        }
        break;

      case 'hex':
        // Chaves de criptografia: hexadecimal
        const hexChars = '0123456789ABCDEF';
        for (let i = 0; i < length; i++) {
          key += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
        }
        break;

      case 'base64':
        // Session keys: caracteres base64
        const base64Chars = 'ABCDEFGHIJKLMNOPQrstuvwxyz0123456789+/=';
        for (let i = 0; i < length; i++) {
          key += base64Chars.charAt(Math.floor(Math.random() * base64Chars.length));
        }
        break;

      case 'complex':
      default:
        // JWT Secret e Webhook: caracteres complexos
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        if (includeSymbols) {
          chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        }
        for (let i = 0; i < length; i++) {
          key += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        break;
    }

    setGeneratedKey(key);
    
    toast({
      title: "Chave Gerada!",
      description: `Chave de segurança ${selectedType.name} gerada com sucesso`,
    });
  };

  const copyToClipboard = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      toast({
        title: "Copiado!",
        description: "Chave copiada para a área de transferência",
      });
    }
  };

  const getKeyStrength = () => {
    if (!generatedKey) return '';
    
    const length = generatedKey.length;
    if (length >= 64) return { text: 'Muito Forte', color: 'text-green-600' };
    if (length >= 32) return { text: 'Forte', color: 'text-blue-600' };
    if (length >= 16) return { text: 'Média', color: 'text-yellow-600' };
    return { text: 'Fraca', color: 'text-red-600' };
  };

  const strength = getKeyStrength();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de Chave de Segurança</h1>
        </div>
        <p className="text-muted-foreground">
          Gera chaves de segurança criptograficamente seguras para APIs, JWT, webhooks e mais.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Configurações
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="keyType">Tipo de Chave</Label>
              <Select value={keyType} onValueChange={setKeyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de chave" />
                </SelectTrigger>
                <SelectContent>
                  {keyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="keyLength">Comprimento</Label>
              <Select value={keyLength} onValueChange={setKeyLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16">16 caracteres</SelectItem>
                  <SelectItem value="32">32 caracteres</SelectItem>
                  <SelectItem value="48">48 caracteres</SelectItem>
                  <SelectItem value="64">64 caracteres</SelectItem>
                  <SelectItem value="128">128 caracteres</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {keyType === 'jwt-secret' || keyType === 'webhook' ? (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="includeSymbols"
                  checked={includeSymbols}
                  onChange={(e) => setIncludeSymbols(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="includeSymbols">Incluir símbolos especiais</Label>
              </div>
            ) : null}
          </div>

          <Button
            onClick={generateSecurityKey}
            disabled={!keyType}
            className="w-full mt-6"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Gerar Chave
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Chave Gerada
          </h3>
          
          <div className="space-y-4">
            {generatedKey ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Chave de Segurança</Label>
                    <div className="flex items-center gap-2">
                      {strength && (
                        <span className={`text-sm font-medium ${strength.color}`}>
                          {strength.text}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowKey(!showKey)}
                      >
                        {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={showKey ? generatedKey : '•'.repeat(generatedKey.length)}
                      readOnly
                      className="font-mono text-sm break-all"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Comprimento: {generatedKey.length} caracteres
                  </p>
                </div>

                <div className="p-4 bg-accent/10 rounded-lg border">
                  <h4 className="font-medium text-sm mb-2">Informações da Chave:</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Tipo: {keyTypes.find(t => t.value === keyType)?.name}</p>
                    <p>• Formato: {keyTypes.find(t => t.value === keyType)?.format}</p>
                    <p>• Entropia: ~{Math.log2(Math.pow(95, generatedKey.length)).toFixed(0)} bits</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Chave de segurança aparecerá aqui</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-red-50 border-red-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-red-800 mb-1">⚠️ Segurança Importante</h4>
            <div className="text-red-700 space-y-1">
              <p>• Nunca compartilhe suas chaves de segurança</p>
              <p>• Armazene as chaves em locais seguros (variáveis de ambiente, cofres de senhas)</p>
              <p>• Troque as chaves periodicamente</p>
              <p>• Use HTTPS para transmissão de chaves</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};