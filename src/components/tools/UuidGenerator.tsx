import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCw, Key, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const UuidGenerator = () => {
  const [uuids, setUuids] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [version, setVersion] = useState('v4');
  const [uppercase, setUppercase] = useState(false);
  const [removeHyphens, setRemoveHyphens] = useState(false);
  const [customQuantity, setCustomQuantity] = useState(1);
  const { toast } = useToast();

  const generateUuidV4 = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateUuidV1 = (): string => {
    const timestamp = Date.now();
    const clockSeq = Math.floor(Math.random() * 0x4000);
    const node = Array.from({ length: 6 }, () => Math.floor(Math.random() * 256));
    
    // Convert timestamp to UUID v1 format
    const timeLow = (timestamp & 0xffffffff).toString(16).padStart(8, '0');
    const timeMid = ((timestamp >>> 32) & 0xffff).toString(16).padStart(4, '0');
    const timeHigh = (((timestamp >>> 48) & 0x0fff) | 0x1000).toString(16).padStart(4, '0');
    const clockSeqHigh = ((clockSeq >>> 8) | 0x80).toString(16).padStart(2, '0');
    const clockSeqLow = (clockSeq & 0xff).toString(16).padStart(2, '0');
    const nodeStr = node.map(n => n.toString(16).padStart(2, '0')).join('');
    
    return `${timeLow}-${timeMid}-${timeHigh}-${clockSeqHigh}${clockSeqLow}-${nodeStr}`;
  };

  const generateUuid = (): string => {
    let uuid = version === 'v1' ? generateUuidV1() : generateUuidV4();
    
    if (removeHyphens) {
      uuid = uuid.replace(/-/g, '');
    }
    
    if (uppercase) {
      uuid = uuid.toUpperCase();
    }
    
    return uuid;
  };

  const generateMultiple = (count: number) => {
    setIsGenerating(true);
    setTimeout(() => {
      const newUuids = Array.from({ length: count }, () => generateUuid());
      setUuids(newUuids);
      setIsGenerating(false);
    }, 300);
  };

  const generateCustom = () => {
    const count = Math.min(100, Math.max(1, customQuantity));
    generateMultiple(count);
  };

  const copyToClipboard = async (uuid: string) => {
    try {
      await navigator.clipboard.writeText(uuid);
      toast({
        title: "Copiado!",
        description: "UUID copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o UUID",
        variant: "destructive",
      });
    }
  };

  const copyAllToClipboard = async () => {
    if (uuids.length === 0) return;
    
    try {
      await navigator.clipboard.writeText(uuids.join('\n'));
      toast({
        title: "Copiado!",
        description: `${uuids.length} UUIDs copiados para a área de transferência`,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar os UUIDs",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de UUID</h1>
        </div>
        <p className="text-muted-foreground">
          Gera identificadores únicos universais (UUID) para uso em aplicações, 
          bancos de dados e sistemas distribuídos.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card mb-6">
        {/* Configuration Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="version" className="text-sm font-medium text-card-foreground">
              Versão UUID
            </Label>
            <Select value={version} onValueChange={setVersion}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a versão" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v4">v4 (Aleatório)</SelectItem>
                <SelectItem value="v1">v1 (Baseado em Tempo)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium text-card-foreground">
              Opções de Formatação
            </Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={uppercase}
                  onCheckedChange={(checked) => setUppercase(checked === true)}
                />
                <Label htmlFor="uppercase" className="text-sm text-muted-foreground">
                  Letras Maiúsculas
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="removeHyphens"
                  checked={removeHyphens}
                  onCheckedChange={(checked) => setRemoveHyphens(checked === true)}
                />
                <Label htmlFor="removeHyphens" className="text-sm text-muted-foreground">
                  Remover Hifens
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customQuantity" className="text-sm font-medium text-card-foreground">
              Quantidade Personalizada
            </Label>
            <div className="flex gap-2">
              <Input
                id="customQuantity"
                type="number"
                min="1"
                max="100"
                value={customQuantity}
                onChange={(e) => setCustomQuantity(Math.min(100, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-20"
              />
              <Button
                onClick={generateCustom}
                disabled={isGenerating}
                variant="outline"
                size="sm"
              >
                Gerar
              </Button>
            </div>
          </div>
        </div>

        {/* Generation Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button
            onClick={() => generateMultiple(1)}
            disabled={isGenerating}
            className="bg-gradient-primary hover:opacity-90 transition-fast"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Gerar 1 UUID
              </>
            )}
          </Button>

          <Button
            onClick={() => generateMultiple(5)}
            disabled={isGenerating}
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Gerar 5 UUIDs
          </Button>

          <Button
            onClick={() => generateMultiple(10)}
            disabled={isGenerating}
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Gerar 10 UUIDs
          </Button>

          {uuids.length > 0 && (
            <Button
              onClick={copyAllToClipboard}
              variant="secondary"
              className="ml-auto"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copiar Tudo
            </Button>
          )}
        </div>

        {/* Results Section */}
        {uuids.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-card-foreground">
                UUIDs Gerados ({uuids.length})
              </Label>
            </div>
            
            <Textarea
              value={uuids.join('\n')}
              readOnly
              className="font-mono min-h-[200px] text-sm"
              placeholder="UUIDs serão exibidos aqui..."
            />

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {uuids.map((uuid, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={uuid}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(uuid)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      <Card className="p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Key className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre UUIDs</h4>
            <p className="text-muted-foreground">
              UUIDs (Universally Unique Identifiers) são identificadores de 128 bits que garantem 
              unicidade global sem necessidade de coordenação central. A versão v4 usa randomização, 
              enquanto v1 usa timestamp e informações do sistema.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};