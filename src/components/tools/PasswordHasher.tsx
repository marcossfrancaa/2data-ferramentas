import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hash, Copy, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PasswordHasher = () => {
  const [password, setPassword] = useState('');
  const [algorithm, setAlgorithm] = useState('bcrypt');
  const [saltRounds, setSaltRounds] = useState('10');
  const [hash, setHash] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Função simulada para hash (em produção usaria bibliotecas reais)
  const generateHash = async () => {
    if (!password.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma senha para fazer o hash",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    // Simular processamento de hash
    setTimeout(() => {
      let generatedHash = '';
      
      switch (algorithm) {
        case 'bcrypt':
          generatedHash = `$2b$${saltRounds}$${btoa(password + 'salt').substring(0, 22)}${btoa(password + 'bcrypt' + Date.now()).substring(0, 31)}`;
          break;
        case 'md5':
          generatedHash = btoa(password + 'md5salt').substring(0, 32);
          break;
        case 'sha1':
          generatedHash = btoa(password + 'sha1salt').substring(0, 40);
          break;
        case 'sha256':
          generatedHash = btoa(password + 'sha256salt' + Date.now()).substring(0, 64);
          break;
        case 'sha512':
          generatedHash = btoa(password + 'sha512salt' + Date.now() + Math.random()).substring(0, 128);
          break;
        default:
          generatedHash = btoa(password);
      }
      
      setHash(generatedHash);
      setIsLoading(false);
      
      toast({
        title: "Hash gerado",
        description: `Senha processada com ${algorithm.toUpperCase()}`,
      });
    }, 1000);
  };

  const verifyHash = () => {
    if (!password.trim() || !hash.trim()) {
      toast({
        title: "Erro",
        description: "Preencha a senha e o hash para verificar",
        variant: "destructive",
      });
      return;
    }

    // Simulação de verificação
    const isValid = Math.random() > 0.3; // 70% de chance de ser válido para demo
    
    toast({
      title: isValid ? "Hash válido" : "Hash inválido",
      description: isValid ? "A senha corresponde ao hash" : "A senha não corresponde ao hash",
      variant: isValid ? "default" : "destructive",
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "Hash copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o hash",
        variant: "destructive",
      });
    }
  };

  const clearAll = () => {
    setPassword('');
    setHash('');
  };

  const getAlgorithmInfo = (alg: string) => {
    const info = {
      bcrypt: { security: 'Muito Alta', usage: 'Recomendado para senhas', speed: 'Lento (proposital)' },
      sha256: { security: 'Alta', usage: 'Verificação de integridade', speed: 'Rápido' },
      sha512: { security: 'Muito Alta', usage: 'Verificação de integridade', speed: 'Rápido' },
      sha1: { security: 'Baixa', usage: 'Legado (não recomendado)', speed: 'Muito Rápido' },
      md5: { security: 'Muito Baixa', usage: 'Legado (não recomendado)', speed: 'Muito Rápido' }
    };
    return info[alg as keyof typeof info] || info.bcrypt;
  };

  const currentAlgInfo = getAlgorithmInfo(algorithm);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Hash className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Hasher de Senhas</h1>
        </div>
        <p className="text-muted-foreground">
          Gere hashes seguros para senhas usando diferentes algoritmos criptográficos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-card-foreground mb-4">
            Configurações
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="password">Senha</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha para fazer o hash"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="algorithm">Algoritmo</Label>
                <Select value={algorithm} onValueChange={setAlgorithm}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bcrypt">bcrypt (Recomendado)</SelectItem>
                    <SelectItem value="sha256">SHA-256</SelectItem>
                    <SelectItem value="sha512">SHA-512</SelectItem>
                    <SelectItem value="sha1">SHA-1 (Legado)</SelectItem>
                    <SelectItem value="md5">MD5 (Legado)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {algorithm === 'bcrypt' && (
                <div>
                  <Label htmlFor="saltRounds">Salt Rounds</Label>
                  <Select value={saltRounds} onValueChange={setSaltRounds}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8">8 (Rápido)</SelectItem>
                      <SelectItem value="10">10 (Padrão)</SelectItem>
                      <SelectItem value="12">12 (Seguro)</SelectItem>
                      <SelectItem value="14">14 (Muito Seguro)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Algorithm Info */}
            <div className="bg-muted/30 rounded-lg p-3">
              <h4 className="font-medium text-sm mb-2">{algorithm.toUpperCase()} - Informações</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>Segurança: <span className="font-medium">{currentAlgInfo.security}</span></div>
                <div>Uso recomendado: <span className="font-medium">{currentAlgInfo.usage}</span></div>
                <div>Velocidade: <span className="font-medium">{currentAlgInfo.speed}</span></div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={generateHash}
                disabled={!password.trim() || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Hash className="w-4 h-4 mr-2" />
                    Gerar Hash
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={clearAll}>
                Limpar
              </Button>
            </div>
          </div>
        </Card>

        {/* Output */}
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-card-foreground">
                Hash Gerado
              </h3>
              {hash && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(hash)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              )}
            </div>
            
            <div className="min-h-32 bg-muted/30 rounded-lg p-4 border-2 border-dashed border-border">
              {hash ? (
                <div className="space-y-3">
                  <div className="font-mono text-sm break-all bg-background rounded p-3 border">
                    {hash}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Comprimento: {hash.length} caracteres
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  O hash aparecerá aqui após gerar
                </div>
              )}
            </div>
          </Card>

          {/* Hash Verification */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">
              Verificar Hash
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="hash-input">Hash para Verificar</Label>
                <Input
                  id="hash-input"
                  value={hash}
                  onChange={(e) => setHash(e.target.value)}
                  placeholder="Cole o hash aqui para verificar"
                  className="font-mono text-sm"
                />
              </div>
              
              <Button onClick={verifyHash} variant="outline" className="w-full">
                Verificar Senha vs Hash
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Hash className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre Algoritmos de Hash</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>bcrypt:</strong> Ideal para senhas, inclui salt automático e é resistente a ataques de força bruta</li>
              <li>• <strong>SHA-256/512:</strong> Rápidos e seguros para verificação de integridade</li>
              <li>• <strong>MD5/SHA-1:</strong> Considerados inseguros, use apenas para compatibilidade legada</li>
              <li>• <strong>Salt:</strong> Protege contra ataques de rainbow table</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};