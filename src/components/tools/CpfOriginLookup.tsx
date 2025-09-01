import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Search, Copy, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OriginResult {
  digit: string;
  state: string;
  region: string;
}

const cpfOriginMap: { [key: string]: { state: string; region: string } } = {
  '0': { state: 'RS', region: 'Rio Grande do Sul' },
  '1': { state: 'DF, GO, MT, TO', region: 'Distrito Federal, Goiás, Mato Grosso, Tocantins' },
  '2': { state: 'AC, AM, AP, PA, RO, RR', region: 'Região Norte' },
  '3': { state: 'CE, MA, PI', region: 'Ceará, Maranhão, Piauí' },
  '4': { state: 'AL, PB, PE, RN', region: 'Alagoas, Paraíba, Pernambuco, Rio Grande do Norte' },
  '5': { state: 'BA, SE', region: 'Bahia, Sergipe' },
  '6': { state: 'MG', region: 'Minas Gerais' },
  '7': { state: 'ES, RJ', region: 'Espírito Santo, Rio de Janeiro' },
  '8': { state: 'SP', region: 'São Paulo' },
  '9': { state: 'PR, SC', region: 'Paraná, Santa Catarina' },
};

export const CpfOriginLookup = () => {
  const [cpf, setCpf] = useState('');
  const [result, setResult] = useState<OriginResult | null>(null);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const formatCpf = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara XXX.XXX.XXX-XX
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    return numbers.slice(0, 11)
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const checkOrigin = () => {
    const cleanCpf = cpf.replace(/\D/g, '');
    
    if (cleanCpf.length !== 11) {
      setError('CPF deve ter 11 dígitos');
      setResult(null);
      return;
    }

    // Validação básica de CPF
    if (cleanCpf === '00000000000' || /^(\d)\1{10}$/.test(cleanCpf)) {
      setError('CPF inválido');
      setResult(null);
      return;
    }

    const ninthDigit = cleanCpf[8];
    const origin = cpfOriginMap[ninthDigit];

    if (origin) {
      setResult({
        digit: ninthDigit,
        state: origin.state,
        region: origin.region
      });
      setError('');
    } else {
      setError('Dígito de origem não encontrado');
      setResult(null);
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
    setCpf('');
    setResult(null);
    setError('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MapPin className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Origem do CPF</h1>
        </div>
        <p className="text-muted-foreground">
          Descubra o estado ou a região onde um CPF foi provavelmente emitido, 
          com base no seu 9º dígito.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Digite o CPF
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(formatCpf(e.target.value))}
                placeholder="000.000.000-00"
                maxLength={14}
                className="font-mono"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={checkOrigin}
                className="flex-1"
                disabled={!cpf}
              >
                <Search className="w-4 h-4 mr-2" />
                Verificar Origem
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
            Resultado da Consulta
          </h3>
          
          {result ? (
            <div className="space-y-4">
              <div>
                <Label>9º Dígito</Label>
                <div className="flex gap-2">
                  <Input
                    value={result.digit}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.digit)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Estado(s)</Label>
                <div className="flex gap-2">
                  <Input
                    value={result.state}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.state)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Região</Label>
                <div className="flex gap-2">
                  <Input
                    value={result.region}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(result.region)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Digite um CPF válido para consultar a origem
            </p>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Como Funciona</h4>
            <p className="text-muted-foreground">
              O CPF (Cadastro de Pessoas Físicas) possui 11 dígitos, onde o 9º dígito indica a região fiscal onde o 
              documento foi emitido. Cada dígito corresponde a uma região específica do Brasil. 
              Esta análise é baseada exclusivamente no 9º dígito que indica a região fiscal de emissão.
            </p>
          </div>
        </div>
      </Card>

      <Card className="mt-4 p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Como Funciona
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-mono">0</span>
              <span className="text-muted-foreground">Rio Grande do Sul</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">1</span>
              <span className="text-muted-foreground">DF, GO, MT, TO</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">2</span>
              <span className="text-muted-foreground">AC, AM, AP, PA, RO, RR</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">3</span>
              <span className="text-muted-foreground">CE, MA, PI</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">4</span>
              <span className="text-muted-foreground">AL, PB, PE, RN</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-mono">5</span>
              <span className="text-muted-foreground">BA, SE</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">6</span>
              <span className="text-muted-foreground">Minas Gerais</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">7</span>
              <span className="text-muted-foreground">ES, RJ</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">8</span>
              <span className="text-muted-foreground">São Paulo</span>
            </div>
            <div className="flex justify-between">
              <span className="font-mono">9</span>
              <span className="text-muted-foreground">PR, SC</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};