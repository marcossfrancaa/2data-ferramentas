import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const stateRegions = {
  'DF': 1, 'GO': 1, 'MS': 1, 'MT': 1, 'TO': 1, // Região 1
  'AC': 2, 'AM': 2, 'AP': 2, 'PA': 2, 'RO': 2, 'RR': 2, // Região 2
  'CE': 3, 'MA': 3, 'PI': 3, // Região 3
  'AL': 4, 'PB': 4, 'PE': 4, 'RN': 4, // Região 4
  'BA': 5, 'SE': 5, // Região 5
  'MG': 6, // Região 6
  'ES': 7, 'RJ': 7, // Região 7
  'SP': 8, // Região 8
  'PR': 9, 'SC': 9, // Região 9
  'RS': 0 // Região 0
} as const;

const brazilianStates = [
  { code: 'RANDOM', name: 'Aleatório' },
  { code: 'AC', name: 'Acre' },
  { code: 'AL', name: 'Alagoas' },
  { code: 'AP', name: 'Amapá' },
  { code: 'AM', name: 'Amazonas' },
  { code: 'BA', name: 'Bahia' },
  { code: 'CE', name: 'Ceará' },
  { code: 'DF', name: 'Distrito Federal' },
  { code: 'ES', name: 'Espírito Santo' },
  { code: 'GO', name: 'Goiás' },
  { code: 'MA', name: 'Maranhão' },
  { code: 'MT', name: 'Mato Grosso' },
  { code: 'MS', name: 'Mato Grosso do Sul' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'PA', name: 'Pará' },
  { code: 'PB', name: 'Paraíba' },
  { code: 'PR', name: 'Paraná' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'PI', name: 'Piauí' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'RN', name: 'Rio Grande do Norte' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'RO', name: 'Rondônia' },
  { code: 'RR', name: 'Roraima' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'SP', name: 'São Paulo' },
  { code: 'SE', name: 'Sergipe' },
  { code: 'TO', name: 'Tocantins' }
];

export const CpfGenerator = () => {
  const [cpfs, setCpfs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [includeFormatting, setIncludeFormatting] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedState, setSelectedState] = useState('RANDOM');
  const { toast } = useToast();

  const generateSingleCpf = (stateCode?: string): string => {
    // Generate random 8 digits
    const n1 = Math.floor(Math.random() * 10);
    const n2 = Math.floor(Math.random() * 10);
    const n3 = Math.floor(Math.random() * 10);
    const n4 = Math.floor(Math.random() * 10);
    const n5 = Math.floor(Math.random() * 10);
    const n6 = Math.floor(Math.random() * 10);
    const n7 = Math.floor(Math.random() * 10);
    const n8 = Math.floor(Math.random() * 10);

    // Generate 9th digit based on state or random
    let n9: number;
    if (stateCode && stateCode !== 'RANDOM' && stateCode in stateRegions) {
      n9 = stateRegions[stateCode as keyof typeof stateRegions];
    } else {
      n9 = Math.floor(Math.random() * 10);
    }

    // Calculate first digit
    const d1 = ((n1 * 10) + (n2 * 9) + (n3 * 8) + (n4 * 7) + (n5 * 6) + (n6 * 5) + (n7 * 4) + (n8 * 3) + (n9 * 2)) % 11;
    const digit1 = d1 < 2 ? 0 : 11 - d1;

    // Calculate second digit
    const d2 = ((n1 * 11) + (n2 * 10) + (n3 * 9) + (n4 * 8) + (n5 * 7) + (n6 * 6) + (n7 * 5) + (n8 * 4) + (n9 * 3) + (digit1 * 2)) % 11;
    const digit2 = d2 < 2 ? 0 : 11 - d2;

    const cpfNumbers = `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${digit1}${digit2}`;
    
    return includeFormatting 
      ? `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${digit1}${digit2}`
      : cpfNumbers;
  };

  const generateCpfs = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const newCpfs = Array.from({ length: quantity }, () => 
        generateSingleCpf(selectedState)
      );
      setCpfs(newCpfs);
      setIsGenerating(false);
    }, 500);
  };

  const copyToClipboard = async (text: string, description: string) => {
    if (!text) return;
    
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar",
        variant: "destructive",
      });
    }
  };

  const copyAllCpfs = () => {
    const allCpfs = cpfs.join('\n');
    copyToClipboard(allCpfs, `${cpfs.length} CPFs copiados para a área de transferência`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de CPF</h1>
        </div>
        <p className="text-muted-foreground">
          Gera CPFs válidos para uso em testes e desenvolvimento. Os CPFs gerados são matematicamente válidos 
          mas não pertencem a pessoas reais.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card">
        <div className="space-y-6">
          {/* Options Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="formatting" className="text-sm font-medium text-card-foreground">
                Formatação
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="formatting"
                  checked={includeFormatting}
                  onCheckedChange={setIncludeFormatting}
                />
                <Label htmlFor="formatting" className="text-sm text-muted-foreground">
                  Incluir pontuação
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-sm font-medium text-card-foreground">
                Quantidade
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max="50"
                value={quantity}
                onChange={(e) => setQuantity(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium text-card-foreground">
                Estado (UF)
              </Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateCpfs}
            disabled={isGenerating}
            className="w-full bg-gradient-primary hover:opacity-90 transition-fast"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Gerar {quantity > 1 ? `${quantity} CPFs` : 'CPF'}
              </>
            )}
          </Button>

          {/* Results Section */}
          {cpfs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-card-foreground">
                  {quantity === 1 ? 'CPF Gerado' : `${cpfs.length} CPFs Gerados`}
                </Label>
                {quantity > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyAllCpfs}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Tudo
                  </Button>
                )}
              </div>
              
              {quantity === 1 ? (
                <div className="flex gap-2">
                  <Input
                    value={cpfs[0] || ''}
                    readOnly
                    placeholder={includeFormatting ? "000.000.000-00" : "00000000000"}
                    className="font-mono text-lg"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(cpfs[0], "CPF copiado para a área de transferência")}
                    disabled={!cpfs[0]}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Textarea
                  value={cpfs.join('\n')}
                  readOnly
                  className="font-mono min-h-[200px] text-sm"
                  placeholder="CPFs serão exibidos aqui..."
                />
              )}
            </div>
          )}
        </div>
      </Card>

      <Card className="mt-6 p-4 bg-warning/5 border-warning/20">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-warning font-bold text-xs">!</span>
          </div>
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Aviso Importante</h4>
            <p className="text-muted-foreground">
              Os CPFs são gerados aleatoriamente e são válidos apenas em formato. 
              Use apenas para testes e desenvolvimento. Não use em documentos oficiais.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};