import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search, Copy, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export const CepLookup = () => {
  const [cep, setCep] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CepData | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    }
    return numbers.substring(0, 8).replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const consultarCep = async () => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      setError('CEP deve ter 8 dígitos');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
        return;
      }

      setResult(data);
      toast({
        title: "CEP encontrado!",
        description: `${data.logradouro}, ${data.localidade} - ${data.uf}`,
      });
    } catch (error) {
      setError('Erro ao consultar CEP. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível consultar o CEP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: `${label} copiado para a área de transferência`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar",
        variant: "destructive",
      });
    }
  };

  const copyFullAddress = async () => {
    if (!result) return;
    
    const fullAddress = `${result.logradouro}${result.complemento ? `, ${result.complemento}` : ''}, ${result.bairro}, ${result.localidade} - ${result.uf}, ${result.cep}`;
    await copyToClipboard(fullAddress, 'Endereço completo');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Consulta CEP</h1>
        </div>
        <p className="text-muted-foreground">
          Consulte informações completas de qualquer CEP brasileiro usando a API do ViaCEP.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card mb-6">
        <div className="flex gap-3 mb-6">
          <div className="flex-1">
            <Label htmlFor="cep-input">CEP</Label>
            <Input
              id="cep-input"
              value={cep}
              onChange={(e) => setCep(formatCep(e.target.value))}
              placeholder="00000-000"
              maxLength={9}
              className="font-mono"
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={consultarCep}
              disabled={loading || cep.replace(/\D/g, '').length !== 8}
              className="bg-gradient-primary hover:opacity-90 transition-fast"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Consultando...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Consultar
                </>
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg mb-6">
            <p className="text-destructive font-medium">{error}</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-card-foreground">Informações do CEP</h3>
              <Button variant="outline" onClick={copyFullAddress}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Endereço
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CEP</Label>
                <div className="flex gap-2">
                  <Input value={result.cep} readOnly className="font-mono" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.cep, 'CEP')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>DDD</Label>
                <div className="flex gap-2">
                  <Input value={result.ddd} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.ddd, 'DDD')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Logradouro</Label>
                <div className="flex gap-2">
                  <Input value={result.logradouro} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.logradouro, 'Logradouro')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {result.complemento && (
                <div className="space-y-2">
                  <Label>Complemento</Label>
                  <div className="flex gap-2">
                    <Input value={result.complemento} readOnly />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(result.complemento, 'Complemento')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Bairro</Label>
                <div className="flex gap-2">
                  <Input value={result.bairro} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.bairro, 'Bairro')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cidade</Label>
                <div className="flex gap-2">
                  <Input value={result.localidade} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.localidade, 'Cidade')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <div className="flex gap-2">
                  <Input value={result.uf} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.uf, 'Estado')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Código IBGE</Label>
                <div className="flex gap-2">
                  <Input value={result.ibge} readOnly className="font-mono" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.ibge, 'Código IBGE')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre a Consulta CEP</h4>
            <p className="text-muted-foreground">
              Esta ferramenta utiliza a API gratuita do ViaCEP para buscar informações reais de 
              endereços brasileiros. Os dados incluem logradouro, bairro, cidade, estado, DDD e 
              códigos do IBGE.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};