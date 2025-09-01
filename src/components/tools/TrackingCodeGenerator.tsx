import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Truck, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export const TrackingCodeGenerator = () => {
  const [carrier, setCarrier] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [trackingCodes, setTrackingCodes] = useState<string[]>([]);

  const carriers = [
    { value: 'correios', label: 'Correios', format: 'XX000000000BR' },
    { value: 'fedex', label: 'FedEx', format: '0000 0000 0000' },
    { value: 'ups', label: 'UPS', format: '1Z000000000000000' },
    { value: 'dhl', label: 'DHL', format: '0000000000' },
    { value: 'tnt', label: 'TNT', format: '000000000' },
    { value: 'jadlog', label: 'Jadlog', format: '00000000000000' },
    { value: 'mercadoenvios', label: 'Mercado Envios', format: 'ME000000000BR' }
  ];

  const generateTrackingCode = (carrierType: string): string => {
    const random = () => Math.floor(Math.random() * 10);
    const randomLetter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));

    switch (carrierType) {
      case 'correios':
        return `${randomLetter()}${randomLetter()}${random()}${random()}${random()}${random()}${random()}${random()}${random()}${random()}${random()}BR`;
      case 'fedex':
        return `${random()}${random()}${random()}${random()} ${random()}${random()}${random()}${random()} ${random()}${random()}${random()}${random()}`;
      case 'ups':
        return `1Z${randomLetter()}${randomLetter()}${randomLetter()}${random()}${random()}${random()}${random()}${random()}${random()}${random()}${random()}${random()}${random()}${random()}${random()}`;
      case 'dhl':
        return Array(10).fill(0).map(() => random()).join('');
      case 'tnt':
        return Array(9).fill(0).map(() => random()).join('');
      case 'jadlog':
        return Array(14).fill(0).map(() => random()).join('');
      case 'mercadoenvios':
        return `ME${Array(9).fill(0).map(() => random()).join('')}BR`;
      default:
        return Array(10).fill(0).map(() => random()).join('');
    }
  };

  const handleGenerate = () => {
    if (!carrier) {
      toast.error('Selecione uma transportadora');
      return;
    }

    const qty = Math.min(Math.max(1, parseInt(quantity) || 1), 50);
    const codes = Array(qty).fill(0).map(() => generateTrackingCode(carrier));
    setTrackingCodes(codes);
    toast.success(`${codes.length} código(s) gerado(s)!`);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Código copiado!');
  };

  const copyAllCodes = () => {
    const allCodes = trackingCodes.join('\n');
    navigator.clipboard.writeText(allCodes);
    toast.success('Todos os códigos copiados!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Gerador de Código de Rastreamento
          </CardTitle>
          <CardDescription>
            Gere códigos de rastreamento fictícios para testes de diferentes transportadoras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="carrier">Transportadora:</Label>
                <Select value={carrier} onValueChange={setCarrier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma transportadora" />
                  </SelectTrigger>
                  <SelectContent>
                    {carriers.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label} ({c.format})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantidade (1-50):</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  max="50"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <Button onClick={handleGenerate} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Gerar Códigos
              </Button>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <Label>Códigos Gerados:</Label>
                {trackingCodes.length > 0 && (
                  <Button variant="outline" size="sm" onClick={copyAllCodes}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Todos
                  </Button>
                )}
              </div>
              
              <div className="bg-secondary/50 rounded-lg p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
                {trackingCodes.length === 0 ? (
                  <p className="text-muted-foreground text-center">
                    Nenhum código gerado ainda. Selecione uma transportadora e clique em "Gerar Códigos".
                  </p>
                ) : (
                  <div className="space-y-2">
                    {trackingCodes.map((code, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-background rounded p-3 border"
                      >
                        <code className="font-mono text-sm">{code}</code>
                        <Button variant="ghost" size="sm" onClick={() => copyCode(code)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};