import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Image, Type, Palette, Square } from 'lucide-react';
import { toast } from 'sonner';

export const FaviconGenerator = () => {
  const [text, setText] = useState('A');
  const [backgroundColor, setBackgroundColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState('48');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [shape, setShape] = useState('square');
  const [size, setSize] = useState('32');

  const fontFamilies = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana',
    'Courier New', 'Trebuchet MS', 'Arial Black', 'Impact', 'Comic Sans MS'
  ];

  const shapes = [
    { value: 'square', label: 'Quadrado' },
    { value: 'rounded', label: 'Cantos Arredondados' },
    { value: 'circle', label: 'Círculo' }
  ];

  const sizes = [
    { value: '16', label: '16x16px' },
    { value: '32', label: '32x32px' },
    { value: '48', label: '48x48px' },
    { value: '64', label: '64x64px' },
    { value: '128', label: '128x128px' },
    { value: '256', label: '256x256px' }
  ];

  const generateFavicon = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const sizeNum = parseInt(size);
    
    if (!ctx) return;
    
    canvas.width = sizeNum;
    canvas.height = sizeNum;

    // Desenhar fundo
    ctx.fillStyle = backgroundColor;
    
    if (shape === 'circle') {
      ctx.beginPath();
      ctx.arc(sizeNum/2, sizeNum/2, sizeNum/2, 0, 2 * Math.PI);
      ctx.fill();
    } else if (shape === 'rounded') {
      const radius = sizeNum * 0.1;
      ctx.beginPath();
      ctx.roundRect(0, 0, sizeNum, sizeNum, radius);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, sizeNum, sizeNum);
    }

    // Desenhar texto
    ctx.fillStyle = textColor;
    ctx.font = `${Math.min(parseInt(fontSize), sizeNum * 0.8)}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText(text.charAt(0).toUpperCase(), sizeNum/2, sizeNum/2);

    return canvas;
  };

  const downloadFavicon = (format: string) => {
    const canvas = generateFavicon();
    if (!canvas) {
      toast.error('Erro ao gerar favicon');
      return;
    }

    const link = document.createElement('a');
    link.download = `favicon-${size}x${size}.${format}`;
    
    if (format === 'ico') {
      // Para ICO, vamos usar PNG como fallback
      link.href = canvas.toDataURL('image/png');
      toast.success('Favicon gerado! (formato PNG - converta para ICO se necessário)');
    } else {
      link.href = canvas.toDataURL(`image/${format}`);
      toast.success(`Favicon ${format.toUpperCase()} baixado!`);
    }
    
    link.click();
  };

  const downloadAllSizes = () => {
    sizes.forEach(({ value }) => {
      setTimeout(() => {
        const originalSize = size;
        // Temporariamente mudar o tamanho
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const sizeNum = parseInt(value);
        
        if (!ctx) return;
        
        canvas.width = sizeNum;
        canvas.height = sizeNum;

        // Desenhar fundo
        ctx.fillStyle = backgroundColor;
        
        if (shape === 'circle') {
          ctx.beginPath();
          ctx.arc(sizeNum/2, sizeNum/2, sizeNum/2, 0, 2 * Math.PI);
          ctx.fill();
        } else if (shape === 'rounded') {
          const radius = sizeNum * 0.1;
          ctx.beginPath();
          ctx.roundRect(0, 0, sizeNum, sizeNum, radius);
          ctx.fill();
        } else {
          ctx.fillRect(0, 0, sizeNum, sizeNum);
        }

        // Desenhar texto
        ctx.fillStyle = textColor;
        ctx.font = `${Math.min(parseInt(fontSize), sizeNum * 0.8)}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        ctx.fillText(text.charAt(0).toUpperCase(), sizeNum/2, sizeNum/2);

        const link = document.createElement('a');
        link.download = `favicon-${value}x${value}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }, parseInt(value) * 100); // Delay progressivo
    });
    
    toast.success('Gerando favicons em todos os tamanhos...');
  };

  const generateHtmlCode = () => {
    return `<!-- Adicione estas linhas no <head> do seu HTML -->
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;
  };

  const PreviewCard = ({ previewSize }: { previewSize: string }) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const sizeNum = parseInt(previewSize);
    
    if (ctx) {
      canvas.width = sizeNum;
      canvas.height = sizeNum;

      ctx.fillStyle = backgroundColor;
      
      if (shape === 'circle') {
        ctx.beginPath();
        ctx.arc(sizeNum/2, sizeNum/2, sizeNum/2, 0, 2 * Math.PI);
        ctx.fill();
      } else if (shape === 'rounded') {
        const radius = sizeNum * 0.1;
        ctx.beginPath();
        ctx.roundRect(0, 0, sizeNum, sizeNum, radius);
        ctx.fill();
      } else {
        ctx.fillRect(0, 0, sizeNum, sizeNum);
      }

      ctx.fillStyle = textColor;
      ctx.font = `${Math.min(parseInt(fontSize), sizeNum * 0.8)}px ${fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      ctx.fillText(text.charAt(0).toUpperCase(), sizeNum/2, sizeNum/2);
    }

    return (
      <div className="flex items-center gap-3 p-3 border rounded-lg">
        <img 
          src={canvas.toDataURL('image/png')} 
          alt={`Favicon ${previewSize}x${previewSize}`}
          className="border"
          style={{ width: `${previewSize}px`, height: `${previewSize}px` }}
        />
        <span className="text-sm">{previewSize}x{previewSize}px</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Gerador de Favicon</CardTitle>
          <CardDescription>
            Crie favicons personalizados para seu site em diferentes tamanhos e formatos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="design" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="download">Download</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="text">Texto/Letra</Label>
                    <Input
                      id="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="A"
                      maxLength={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bg-color">Cor de Fundo</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="w-12 h-10 rounded border"
                        />
                        <Input
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="text-color">Cor do Texto</Label>
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-12 h-10 rounded border"
                        />
                        <Input
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="font-family">Fonte</Label>
                    <Select value={fontFamily} onValueChange={setFontFamily}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontFamilies.map(font => (
                          <SelectItem key={font} value={font}>{font}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="shape">Formato</Label>
                    <Select value={shape} onValueChange={setShape}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {shapes.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="font-size">Tamanho da Fonte</Label>
                    <Input
                      id="font-size"
                      type="number"
                      value={fontSize}
                      onChange={(e) => setFontSize(e.target.value)}
                      min="8"
                      max="200"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="font-semibold mb-4">Preview ao Vivo</h3>
                    <div className="space-y-4">
                      <PreviewCard previewSize="64" />
                      <PreviewCard previewSize="32" />
                      <PreviewCard previewSize="16" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <div className="text-center">
                <h3 className="font-semibold mb-6">Preview em Diferentes Tamanhos</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {sizes.map(({ value, label }) => (
                    <div key={value} className="text-center">
                      <PreviewCard previewSize={value} />
                      <p className="text-xs text-muted-foreground mt-2">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 p-4 bg-secondary/50 rounded-lg">
                <h3 className="font-semibold mb-2">Como usar no seu site</h3>
                <Textarea
                  value={generateHtmlCode()}
                  readOnly
                  className="font-mono text-sm"
                  rows={6}
                />
              </div>
            </TabsContent>

            <TabsContent value="download" className="space-y-6">
              <div className="text-center">
                <h3 className="font-semibold mb-6">Baixar Favicon</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="download-size">Tamanho</Label>
                    <Select value={size} onValueChange={setSize}>
                      <SelectTrigger className="w-48 mx-auto">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sizes.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-center gap-4">
                    <Button onClick={() => downloadFavicon('png')}>
                      <Download className="h-4 w-4 mr-2" />
                      PNG
                    </Button>
                    <Button onClick={() => downloadFavicon('jpeg')} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      JPEG
                    </Button>
                    <Button onClick={() => downloadFavicon('ico')} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      ICO
                    </Button>
                  </div>

                  <div className="pt-4 border-t">
                    <Button onClick={downloadAllSizes} variant="secondary" size="lg">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Todos os Tamanhos
                    </Button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Baixa favicons em todos os tamanhos padrão
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-secondary/50 rounded-lg space-y-2">
                <h3 className="font-semibold">Dicas de Uso</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use letras simples e fortes para melhor legibilidade</li>
                  <li>• Teste em diferentes tamanhos para garantir clareza</li>
                  <li>• ICO é o formato tradicional, mas PNG também funciona</li>
                  <li>• Inclua múltiplos tamanhos para melhor compatibilidade</li>
                  <li>• Mantenha o design simples para funcionar em tamanhos pequenos</li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};