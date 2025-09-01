import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Search, Copy, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BinResult {
  bin: string;
  bank: string;
  brand: string;
  type: string;
  level: string;
  country: string;
  countryCode: string;
}

// Base de dados simulada de BINs
const binDatabase: { [key: string]: Omit<BinResult, 'bin'> } = {
  '411111': {
    bank: 'Visa',
    brand: 'Visa',
    type: 'Débito',
    level: 'Classic',
    country: 'Estados Unidos',
    countryCode: 'US'
  },
  '542418': {
    bank: 'Banco do Brasil',
    brand: 'Mastercard',
    type: 'Crédito',
    level: 'Gold',
    country: 'Brasil',
    countryCode: 'BR'
  },
  '451416': {
    bank: 'Nubank',
    brand: 'Visa',
    type: 'Crédito',
    level: 'Platinum',
    country: 'Brasil',
    countryCode: 'BR'
  },
  '537020': {
    bank: 'Banco Santander',
    brand: 'Mastercard',
    type: 'Débito',
    level: 'Standard',
    country: 'Brasil',
    countryCode: 'BR'
  },
  '341111': {
    bank: 'American Express',
    brand: 'American Express',
    type: 'Crédito',
    level: 'Platinum',
    country: 'Estados Unidos',
    countryCode: 'US'
  },
  '606282': {
    bank: 'Hipercard',
    brand: 'Hipercard',
    type: 'Crédito',
    level: 'Standard',
    country: 'Brasil',
    countryCode: 'BR'
  },
  '438935': {
    bank: 'Banco Inter',
    brand: 'Visa',
    type: 'Débito',
    level: 'Standard',
    country: 'Brasil',
    countryCode: 'BR'
  },
  '627892': {
    bank: 'Banco C6',
    brand: 'Mastercard',
    type: 'Crédito',
    level: 'Black',
    country: 'Brasil',
    countryCode: 'BR'
  }
};

export const BinLookup = () => {
  const [binInput, setBinInput] = useState('');
  const [result, setResult] = useState<BinResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const formatBin = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Limita a 8 dígitos
    return numbers.slice(0, 8);
  };

  const searchBin = async () => {
    const cleanBin = binInput.replace(/\D/g, '');
    
    if (cleanBin.length < 6) {
      setError('Digite pelo menos os primeiros 6 dígitos do cartão');
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      // Procura na base de dados local primeiro
      const bin6 = cleanBin.slice(0, 6);
      const localResult = binDatabase[bin6];

      if (localResult) {
        setResult({
          bin: bin6,
          ...localResult
        });
        toast({
          title: "BIN encontrado!",
          description: `${localResult.brand} - ${localResult.bank}`,
        });
        return;
      }

      // Se não encontrar localmente, tenta uma API pública
      try {
        const response = await fetch(`https://lookup.binlist.net/${bin6}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          
          const result = {
            bin: bin6,
            bank: data.bank?.name || 'Não identificado',
            brand: data.scheme?.toUpperCase() || 'Não identificado',
            type: data.type === 'debit' ? 'Débito' : data.type === 'credit' ? 'Crédito' : 'Não identificado',
            level: data.brand || 'Standard',
            country: data.country?.name || 'Não identificado',
            countryCode: data.country?.alpha2 || 'XX'
          };
          
          setResult(result);
          toast({
            title: "BIN encontrado!",
            description: `${result.brand} - ${result.bank}`,
          });
        } else {
          throw new Error('BIN não encontrado na API');
        }
      } catch (apiError) {
        // Se a API falhar, tenta uma busca alternativa baseada nos primeiros dígitos
        const firstDigit = cleanBin[0];
        let brand = 'Não identificado';
        let type = 'Não identificado';
        
        // Detecta bandeira pelos primeiros dígitos
        if (firstDigit === '4') {
          brand = 'Visa';
          type = 'Crédito/Débito';
        } else if (firstDigit === '5' || bin6.startsWith('22')) {
          brand = 'Mastercard';
          type = 'Crédito/Débito';
        } else if (bin6.startsWith('34') || bin6.startsWith('37')) {
          brand = 'American Express';
          type = 'Crédito';
        } else if (bin6.startsWith('60')) {
          brand = 'Hipercard';
          type = 'Crédito';
        }
        
        const fallbackResult = {
          bin: bin6,
          bank: 'Banco não identificado',
          brand,
          type,
          level: 'Standard',
          country: 'Brasil',
          countryCode: 'BR'
        };
        
        setResult(fallbackResult);
        toast({
          title: "BIN identificado parcialmente",
          description: `Bandeira detectada: ${brand}`,
        });
      }
    } catch (error) {
      setError('Erro ao consultar BIN. Tente novamente.');
      setResult(null);
      toast({
        title: "Erro",
        description: "Não foi possível consultar o BIN",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Informação copiada para a área de transferência",
    });
  };

  const clearFields = () => {
    setBinInput('');
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Consulta de Cartão (BIN)</h1>
        </div>
        <p className="text-muted-foreground">
          Digite os primeiros 6 a 8 dígitos do cartão para consultar informações como bandeira, 
          tipo, banco emissor e país de origem.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            BIN do Cartão (6-8 dígitos)
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="bin">Número do Cartão</Label>
              <Input
                id="bin"
                value={binInput}
                onChange={(e) => setBinInput(formatBin(e.target.value))}
                placeholder="Ex: 411111"
                maxLength={8}
                className="font-mono"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={searchBin}
                className="flex-1"
                disabled={!binInput || isLoading}
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? 'Consultando...' : 'Consultar BIN'}
              </Button>
              <Button
                variant="outline"
                onClick={clearFields}
              >
                Limpar
              </Button>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Informações do Cartão
          </h3>
          
          {result ? (
            <div className="space-y-4">
              <div>
                <Label>BIN</Label>
                <div className="flex gap-2">
                  <Input
                    value={result.bin}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.bin)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Bandeira</Label>
                <div className="flex gap-2">
                  <Input
                    value={result.brand}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.brand)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Tipo</Label>
                <div className="flex gap-2">
                  <Input
                    value={result.type}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.type)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Banco Emissor</Label>
                <div className="flex gap-2">
                  <Input
                    value={result.bank}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.bank)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>País</Label>
                <div className="flex gap-2">
                  <Input
                    value={`${result.country} (${result.countryCode})`}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(`${result.country} (${result.countryCode})`)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Digite o BIN do cartão para consultar as informações
            </p>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Dicas de Uso
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Digite apenas os primeiros 6 a 8 dígitos do cartão</li>
              <li>• O BIN identifica o banco emissor e características do cartão</li>
              <li>• Use para verificar informações em transações comerciais</li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Útil para validar informações em e-commerce</li>
              <li>• Não digite ou compartilhe o número completo do cartão</li>
              <li>• Use para verificar informações em transações comerciais</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card className="mt-4 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Aviso Importante</h4>
            <p className="text-muted-foreground">
              Esta ferramenta consulta apenas informações públicas do BIN (Bank Identification Number). 
              Nunca insira o número completo do cartão, CVV ou outras informações sensíveis. 
              Use apenas para fins legítimos e autorizados.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};