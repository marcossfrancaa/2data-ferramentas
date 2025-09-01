import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X, Copy, Hash } from 'lucide-react';
import { toast } from 'sonner';

export const HashChecker = () => {
  const [text, setText] = useState('');
  const [hash, setHash] = useState('');
  const [hashType, setHashType] = useState('SHA-256');
  const [generatedHash, setGeneratedHash] = useState('');
  const [isMatch, setIsMatch] = useState<boolean | null>(null);

  const hashTypes = [
    'SHA-1',
    'SHA-256',
    'SHA-384',
    'SHA-512'
  ];

  const generateHash = async () => {
    if (!text) {
      toast.error('Digite o texto para gerar o hash');
      return;
    }

    try {
      let hashValue = '';
      const encoder = new TextEncoder();
      const data = encoder.encode(text);

      switch (hashType) {
        case 'SHA-1':
          hashValue = await crypto.subtle.digest('SHA-1', data).then(buf => 
            Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
          );
          break;
        case 'SHA-256':
          hashValue = await crypto.subtle.digest('SHA-256', data).then(buf => 
            Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
          );
          break;
        case 'SHA-384':
          hashValue = await crypto.subtle.digest('SHA-384', data).then(buf => 
            Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
          );
          break;
        case 'SHA-512':
          hashValue = await crypto.subtle.digest('SHA-512', data).then(buf => 
            Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
          );
          break;
      }

      setGeneratedHash(hashValue);
      
      if (hash) {
        setIsMatch(hashValue.toLowerCase() === hash.toLowerCase());
      }
    } catch (error) {
      toast.error('Erro ao gerar hash');
      console.error(error);
    }
  };

  const verifyHash = () => {
    if (!generatedHash || !hash) {
      toast.error('Gere um hash primeiro e forneça o hash para comparar');
      return;
    }
    
    const match = generatedHash.toLowerCase() === hash.toLowerCase();
    setIsMatch(match);
    
    if (match) {
      toast.success('Os hashes correspondem!');
    } else {
      toast.error('Os hashes não correspondem');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência');
  };

  const detectHashType = (hashString: string) => {
    const length = hashString.trim().length;
    
    if (length === 40) return 'Possivelmente SHA-1';
    if (length === 64) return 'Possivelmente SHA-256';
    if (length === 96) return 'Possivelmente SHA-384';
    if (length === 128) return 'Possivelmente SHA-512';
    
    return 'Tipo desconhecido';
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Verificador de Hash</CardTitle>
          <CardDescription>
            Gere e verifique hashes para validar integridade de dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Tipo de Hash
              </label>
              <Select value={hashType} onValueChange={setHashType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {hashTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Texto Original
              </label>
              <Textarea
                placeholder="Digite o texto para gerar o hash..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={4}
              />
            </div>

            <Button onClick={generateHash} className="w-full">
              <Hash className="mr-2 h-4 w-4" />
              Gerar Hash
            </Button>

            {generatedHash && (
              <div className="p-4 bg-secondary/50 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Hash Gerado ({hashType}):</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(generatedHash)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-mono text-xs break-all">{generatedHash}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Verificar Hash</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Hash para Comparar
                  </label>
                  <Input
                    placeholder="Cole o hash para verificar..."
                    value={hash}
                    onChange={(e) => {
                      setHash(e.target.value);
                      setIsMatch(null);
                    }}
                  />
                  {hash && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {detectHashType(hash)}
                    </p>
                  )}
                </div>

                <Button 
                  onClick={verifyHash} 
                  variant="outline" 
                  className="w-full"
                  disabled={!generatedHash || !hash}
                >
                  Verificar Correspondência
                </Button>

                {isMatch !== null && (
                  <div className={`p-3 rounded-lg flex items-center gap-2 ${
                    isMatch ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'
                  }`}>
                    {isMatch ? (
                      <>
                        <Check className="h-5 w-5" />
                        <span>Os hashes correspondem - Integridade verificada!</span>
                      </>
                    ) : (
                      <>
                        <X className="h-5 w-5" />
                        <span>Os hashes não correspondem - Integridade comprometida!</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 p-4 bg-secondary/50 rounded-lg space-y-2">
              <h3 className="font-semibold">Sobre Verificação de Hash</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Hashes são usados para verificar a integridade de dados</li>
                <li>• Mesmo uma pequena mudança no texto altera completamente o hash</li>
                <li>• SHA-256 é o padrão mais comum e seguro atualmente</li>
                <li>• MD5 e SHA-1 são considerados obsoletos para segurança</li>
                <li>• Use para verificar downloads, senhas armazenadas e integridade de arquivos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};