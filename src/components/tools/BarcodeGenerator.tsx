import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const BarcodeGenerator = () => {
  const [text, setText] = useState('');
  const [format, setFormat] = useState('code128');
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(50);
  const [barcodeUrl, setBarcodeUrl] = useState('');
  const { toast } = useToast();

  const generateBarcode = () => {
    if (!text.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o texto para gerar o código de barras",
        variant: "destructive",
      });
      return;
    }

    // Usando API externa gratuita para gerar códigos de barras
    const apiUrl = `https://barcode.tec-it.com/barcode.ashx?data=${encodeURIComponent(text)}&code=${format}&unit=Fit&dpi=96&imagetype=Gif&rotation=0&color=%23000000&bgcolor=%23ffffff&qunit=Mm&quiet=0&width=${width}&height=${height}`;
    
    setBarcodeUrl(apiUrl);
    
    toast({
      title: "Sucesso",
      description: "Código de barras gerado com sucesso!",
    });
  };

  const copyToClipboard = async () => {
    if (!barcodeUrl) return;
    
    try {
      await navigator.clipboard.writeText(barcodeUrl);
      toast({
        title: "Copiado!",
        description: "URL do código de barras copiada",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a URL",
        variant: "destructive",
      });
    }
  };

  const downloadBarcode = () => {
    if (!barcodeUrl) return;
    
    const link = document.createElement('a');
    link.href = barcodeUrl;
    link.download = `barcode-${text.slice(0, 10)}.gif`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de Código de Barras</h1>
        </div>
        <p className="text-muted-foreground">
          Gere códigos de barras em diferentes formatos para seus produtos ou documentos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-card-foreground mb-4">
            Configurações
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Texto ou Número</Label>
              <Input
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Digite o texto para o código de barras"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="format">Formato</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="code128">Code 128</SelectItem>
                    <SelectItem value="code39">Code 39</SelectItem>
                    <SelectItem value="ean13">EAN-13</SelectItem>
                    <SelectItem value="ean8">EAN-8</SelectItem>
                    <SelectItem value="upca">UPC-A</SelectItem>
                    <SelectItem value="upce">UPC-E</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="width">Largura (px)</Label>
                <Input
                  id="width"
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  min="100"
                  max="500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="height">Altura (px)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                min="30"
                max="200"
              />
            </div>

            <Button 
              onClick={generateBarcode}
              className="w-full bg-gradient-primary hover:opacity-90"
              disabled={!text.trim()}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Gerar Código de Barras
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-card-foreground">
              Resultado
            </h3>
            {barcodeUrl && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar URL
                </Button>
                <Button variant="outline" size="sm" onClick={downloadBarcode}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            )}
          </div>
          
          <div className="min-h-60 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
            {barcodeUrl ? (
              <div className="text-center">
                <img 
                  src={barcodeUrl} 
                  alt="Código de barras gerado"
                  className="mx-auto mb-4 bg-white p-4 rounded"
                />
                <p className="text-sm text-muted-foreground">
                  Código de barras para: {text}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">
                O código de barras aparecerá aqui
              </p>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <BarChart3 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Formatos Suportados</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>Code 128:</strong> Padrão mais comum, suporta letras e números</li>
              <li>• <strong>Code 39:</strong> Formato antigo, apenas maiúsculas e números</li>
              <li>• <strong>EAN-13/8:</strong> Padrão europeu para produtos</li>
              <li>• <strong>UPC-A/E:</strong> Padrão americano para produtos</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};