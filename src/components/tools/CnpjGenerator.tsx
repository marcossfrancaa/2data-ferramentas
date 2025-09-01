import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CnpjGenerator = () => {
  const [cnpjs, setCnpjs] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [includeFormatting, setIncludeFormatting] = useState(true);
  const [isMatrix, setIsMatrix] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();

  const generateSingleCnpj = (): string => {
    // Generate random 8 digits for the base
    const n = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10));
    
    // Add branch and sequence
    if (isMatrix) {
      n.push(0, 0, 0, 1); // 0001 for matrix
    } else {
      // Generate random branch number from 0002 to 9999
      const branch = Math.floor(Math.random() * 9998) + 2; // 2 to 9999
      const branchStr = branch.toString().padStart(4, '0');
      n.push(
        parseInt(branchStr[0]),
        parseInt(branchStr[1]),
        parseInt(branchStr[2]),
        parseInt(branchStr[3])
      );
    }

    // Calculate first digit
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum1 = n.reduce((acc, digit, idx) => acc + digit * weights1[idx], 0);
    const digit1 = sum1 % 11 < 2 ? 0 : 11 - (sum1 % 11);
    n.push(digit1);

    // Calculate second digit
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum2 = n.reduce((acc, digit, idx) => acc + digit * weights2[idx], 0);
    const digit2 = sum2 % 11 < 2 ? 0 : 11 - (sum2 % 11);
    n.push(digit2);

    const cnpjNumbers = n.join('');
    
    return includeFormatting 
      ? `${n.slice(0, 2).join('')}.${n.slice(2, 5).join('')}.${n.slice(5, 8).join('')}/${n.slice(8, 12).join('')}-${n.slice(12).join('')}`
      : cnpjNumbers;
  };

  const generateCnpjs = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const newCnpjs = Array.from({ length: quantity }, () => generateSingleCnpj());
      setCnpjs(newCnpjs);
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

  const copyAllCnpjs = () => {
    const allCnpjs = cnpjs.join('\n');
    copyToClipboard(allCnpjs, `${cnpjs.length} CNPJs copiados para a área de transferência`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Building className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de CNPJ</h1>
        </div>
        <p className="text-muted-foreground">
          Gera CNPJs válidos para uso em testes e desenvolvimento. Os CNPJs gerados são matematicamente válidos 
          mas não pertencem a empresas reais.
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
              <Label className="text-sm font-medium text-card-foreground">
                Tipo de Empresa
              </Label>
               <div className="flex items-center space-x-2">
                <Checkbox
                  id="matrix"
                  checked={isMatrix}
                  onCheckedChange={(checked) => setIsMatrix(checked === true)}
                />
                <Label htmlFor="matrix" className="text-sm text-muted-foreground">
                  Gerar como Matriz (0001)
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
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateCnpjs}
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
                Gerar {quantity > 1 ? `${quantity} CNPJs` : 'CNPJ'}
              </>
            )}
          </Button>

          {/* Results Section */}
          {cnpjs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-card-foreground">
                  {quantity === 1 ? 'CNPJ Gerado' : `${cnpjs.length} CNPJs Gerados`}
                </Label>
                {quantity > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyAllCnpjs}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Tudo
                  </Button>
                )}
              </div>
              
              {quantity === 1 ? (
                <div className="flex gap-2">
                  <Input
                    value={cnpjs[0] || ''}
                    readOnly
                    placeholder={includeFormatting ? "00.000.000/0001-00" : "00000000000100"}
                    className="font-mono text-lg"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(cnpjs[0], "CNPJ copiado para a área de transferência")}
                    disabled={!cnpjs[0]}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <Textarea
                  value={cnpjs.join('\n')}
                  readOnly
                  className="font-mono min-h-[200px] text-sm"
                  placeholder="CNPJs serão exibidos aqui..."
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
              Os CNPJs são gerados aleatoriamente e são válidos apenas em formato. 
              Use apenas para testes e desenvolvimento. Não use em documentos oficiais.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};