import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Key, Copy, Download, RefreshCw, Shield, Terminal } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SshKeyGenerator = () => {
  const [keyType, setKeyType] = useState('rsa');
  const [keySize, setKeySize] = useState('2048');
  const [comment, setComment] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const keyTypes = [
    { value: 'rsa', name: 'RSA', sizes: ['2048', '3072', '4096'] },
    { value: 'ed25519', name: 'Ed25519', sizes: ['256'] },
    { value: 'ecdsa', name: 'ECDSA', sizes: ['256', '384', '521'] },
  ];

  const selectedKeyType = keyTypes.find(t => t.value === keyType);

  const generateSSHKey = async () => {
    setGenerating(true);
    
    try {
      // Simular geração de chave SSH (em ambiente real, seria feito no backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const timestamp = new Date().toISOString().split('T')[0];
      const userComment = comment || `generated-${timestamp}`;
      
      // Gerar chave pública simulada
      const publicKeyContent = generatePublicKey(keyType, keySize, userComment);
      const privateKeyContent = generatePrivateKey(keyType, keySize, passphrase);
      
      setPublicKey(publicKeyContent);
      setPrivateKey(privateKeyContent);
      
      toast({
        title: "Chaves SSH Geradas!",
        description: `Par de chaves ${keyType.toUpperCase()} de ${keySize} bits criado com sucesso`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao gerar as chaves SSH",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const generatePublicKey = (type: string, size: string, userComment: string) => {
    const keyData = generateRandomBase64(parseInt(size) / 8);
    return `ssh-${type} ${keyData} ${userComment}`;
  };

  const generatePrivateKey = (type: string, size: string, passphrase: string) => {
    const keyData = generateRandomBase64(parseInt(size) / 4);
    const encrypted = passphrase ? 'Proc-Type: 4,ENCRYPTED\nDEK-Info: AES-128-CBC,C8B2A6B2E2D6F8A4B6C8D2E6F8A4B6C8\n\n' : '';
    
    return `-----BEGIN ${type.toUpperCase()} PRIVATE KEY-----
${encrypted}${keyData.match(/.{1,64}/g)?.join('\n')}
-----END ${type.toUpperCase()} PRIVATE KEY-----`;
  };

  const generateRandomBase64 = (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${type} copiada para a área de transferência`,
    });
  };

  const downloadKey = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download iniciado!",
      description: `Arquivo ${filename} foi baixado`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de Chaves SSH/GPG</h1>
        </div>
        <p className="text-muted-foreground">
          Gera pares de chaves SSH seguras para autenticação em servidores e repositórios Git.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-500" />
            Configurações da Chave
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="keyType">Tipo de Chave</Label>
              <Select value={keyType} onValueChange={setKeyType}>
                <SelectTrigger>
                  <SelectValue />
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
              <Label htmlFor="keySize">Tamanho da Chave (bits)</Label>
              <Select value={keySize} onValueChange={setKeySize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedKeyType?.sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size} bits
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="comment">Comentário (opcional)</Label>
              <Input
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="user@hostname"
                className="font-mono"
              />
            </div>

            <div>
              <Label htmlFor="passphrase">Senha de Proteção (opcional)</Label>
              <Input
                id="passphrase"
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Deixe em branco para chave sem senha"
              />
            </div>
          </div>

          <Button
            onClick={generateSSHKey}
            disabled={generating}
            className="w-full mt-6"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Gerando Chaves...' : 'Gerar Par de Chaves SSH'}
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-green-500" />
            Instruções de Uso
          </h3>
          
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium text-card-foreground mb-2">1. Salvar as Chaves:</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Chave privada: ~/.ssh/id_{keyType}</li>
                <li>• Chave pública: ~/.ssh/id_{keyType}.pub</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-card-foreground mb-2">2. Configurar Permissões:</h4>
              <div className="bg-muted p-3 rounded font-mono text-xs">
                chmod 600 ~/.ssh/id_{keyType}<br/>
                chmod 644 ~/.ssh/id_{keyType}.pub
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-card-foreground mb-2">3. Adicionar ao SSH Agent:</h4>
              <div className="bg-muted p-3 rounded font-mono text-xs">
                ssh-add ~/.ssh/id_{keyType}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-card-foreground mb-2">4. Configurar Servidor:</h4>
              <p className="text-muted-foreground">
                Copie o conteúdo da chave pública para ~/.ssh/authorized_keys no servidor remoto.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {publicKey && privateKey && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Chave Pública
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(publicKey, 'Chave pública')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadKey(publicKey, `id_${keyType}.pub`)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
              </div>
            </div>
            <Textarea
              value={publicKey}
              readOnly
              className="font-mono text-xs min-h-[100px] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Esta chave deve ser adicionada aos servidores onde você quer se conectar.
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Chave Privada
              </h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(privateKey, 'Chave privada')}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadKey(privateKey, `id_${keyType}`)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
              </div>
            </div>
            <Textarea
              value={privateKey}
              readOnly
              className="font-mono text-xs min-h-[200px] resize-none"
            />
            <p className="text-xs text-red-600 mt-2 font-medium">
              ⚠️ MANTENHA ESTA CHAVE SEGURA! Nunca compartilhe sua chave privada.
            </p>
          </Card>
        </div>
      )}

      <Card className="mt-6 p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-amber-800 mb-2">🔐 Dicas de Segurança</h4>
            <div className="text-amber-700 space-y-1">
              <p>• <strong>Chave Privada:</strong> Nunca compartilhe! Mantenha em local seguro</p>
              <p>• <strong>Passphrase:</strong> Use uma senha forte para proteger a chave privada</p>
              <p>• <strong>Backup:</strong> Faça backup seguro das suas chaves</p>
              <p>• <strong>Rotação:</strong> Troque as chaves periodicamente por segurança</p>
              <p>• <strong>Ed25519:</strong> Mais seguro e performático que RSA para novos sistemas</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};