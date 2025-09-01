
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Key, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const JwtDecoder = () => {
  const [token, setToken] = useState('');
  const [decodedHeader, setDecodedHeader] = useState('');
  const [decodedPayload, setDecodedPayload] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const decodeJWT = () => {
    if (!token.trim()) {
      setError('Token JWT é obrigatório');
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Token JWT inválido');
      }

      // Decode header
      const headerDecoded = JSON.parse(atob(parts[0]));
      setDecodedHeader(JSON.stringify(headerDecoded, null, 2));

      // Decode payload
      const payloadDecoded = JSON.parse(atob(parts[1]));
      setDecodedPayload(JSON.stringify(payloadDecoded, null, 2));

      setError('');
    } catch (err) {
      setError('Token JWT inválido ou malformado');
      setDecodedHeader('');
      setDecodedPayload('');
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: `${type} copiado para a área de transferência`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">JWT Decoder</h1>
        </div>
        <p className="text-muted-foreground">
          Decodifica tokens JWT e exibe header e payload de forma legível.
        </p>
      </div>

      <Card className="p-6 mb-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Token JWT
        </h3>
        
        <Textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Cole seu token JWT aqui..."
          className="min-h-32 font-mono text-sm mb-4"
        />

        <Button
          onClick={decodeJWT}
          disabled={!token.trim()}
          className="w-full"
        >
          <Key className="w-4 h-4 mr-2" />
          Decodificar JWT
        </Button>

        {error && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-destructive" />
            <p className="text-destructive text-sm">{error}</p>
          </div>
        )}
      </Card>

      {(decodedHeader || decodedPayload) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Header
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(decodedHeader, 'Header')}
                disabled={!decodedHeader}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </div>
            
            <Textarea
              value={decodedHeader}
              readOnly
              className="min-h-48 font-mono text-sm bg-muted/30"
            />
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                Payload
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(decodedPayload, 'Payload')}
                disabled={!decodedPayload}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </div>
            
            <Textarea
              value={decodedPayload}
              readOnly
              className="min-h-48 font-mono text-sm bg-muted/30"
            />
          </Card>
        </div>
      )}
    </div>
  );
};
