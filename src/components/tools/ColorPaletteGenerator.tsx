import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, RefreshCw, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

export const ColorPaletteGenerator = () => {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [paletteType, setPaletteType] = useState('complementary');
  const [palette, setPalette] = useState<string[]>([]);

  const paletteTypes = [
    { value: 'complementary', label: 'Complementar', description: '2 cores opostas' },
    { value: 'analogous', label: 'Análoga', description: '3 cores adjacentes' },
    { value: 'triadic', label: 'Tríade', description: '3 cores equidistantes' },
    { value: 'tetradic', label: 'Tetrádica', description: '4 cores em retângulo' },
    { value: 'monochromatic', label: 'Monocromática', description: 'Variações da mesma cor' },
    { value: 'split-complementary', label: 'Complementar Dividida', description: '3 cores em Y' }
  ];

  const hexToHsl = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const hslToHex = (h: number, s: number, l: number): string => {
    h = h % 360;
    s = Math.max(0, Math.min(100, s));
    l = Math.max(0, Math.min(100, l));
    
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else if (300 <= h && h < 360) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  };

  const generatePalette = () => {
    const [h, s, l] = hexToHsl(baseColor);
    let colors: string[] = [baseColor];

    switch (paletteType) {
      case 'complementary':
        colors.push(hslToHex((h + 180) % 360, s, l));
        break;
      
      case 'analogous':
        colors.push(hslToHex((h + 30) % 360, s, l));
        colors.push(hslToHex((h - 30 + 360) % 360, s, l));
        break;
      
      case 'triadic':
        colors.push(hslToHex((h + 120) % 360, s, l));
        colors.push(hslToHex((h + 240) % 360, s, l));
        break;
      
      case 'tetradic':
        colors.push(hslToHex((h + 90) % 360, s, l));
        colors.push(hslToHex((h + 180) % 360, s, l));
        colors.push(hslToHex((h + 270) % 360, s, l));
        break;
      
      case 'monochromatic':
        colors.push(hslToHex(h, s, Math.max(10, l - 20)));
        colors.push(hslToHex(h, s, Math.max(5, l - 40)));
        colors.push(hslToHex(h, s, Math.min(95, l + 20)));
        colors.push(hslToHex(h, s, Math.min(90, l + 40)));
        break;
      
      case 'split-complementary':
        colors.push(hslToHex((h + 150) % 360, s, l));
        colors.push(hslToHex((h + 210) % 360, s, l));
        break;
    }

    setPalette(colors);
    toast.success('Paleta gerada!');
  };

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Cor ${color} copiada!`);
  };

  const copyAllColors = () => {
    const allColors = palette.join(', ');
    navigator.clipboard.writeText(allColors);
    toast.success('Todas as cores copiadas!');
  };

  const exportPalette = () => {
    const cssVars = palette.map((color, index) => 
      `  --color-${index + 1}: ${color};`
    ).join('\n');
    
    const css = `:root {\n${cssVars}\n}`;
    
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.css';
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Paleta exportada como CSS!');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Gerador de Paleta de Cores
          </CardTitle>
          <CardDescription>
            Gere paletas de cores harmoniosas baseadas em teoria das cores
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="base-color">Cor base:</Label>
                <div className="flex gap-2">
                  <Input
                    id="base-color"
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-16 h-10 p-1 border-2"
                  />
                  <Input
                    type="text"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    placeholder="#3B82F6"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="palette-type">Tipo de paleta:</Label>
                <Select value={paletteType} onValueChange={setPaletteType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {paletteTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={generatePalette} className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Gerar Paleta
              </Button>

              {palette.length > 0 && (
                <div className="space-y-2 pt-4 border-t">
                  <Button variant="outline" onClick={copyAllColors} className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar Todas
                  </Button>
                  <Button variant="outline" onClick={exportPalette} className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSS
                  </Button>
                </div>
              )}
            </div>

            <div className="lg:col-span-2">
              <Label className="text-sm font-medium mb-3 block">Paleta gerada:</Label>
              {palette.length === 0 ? (
                <div className="bg-secondary/50 rounded-lg p-8 text-center">
                  <Palette className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Escolha uma cor base e tipo de paleta, depois clique em "Gerar Paleta"
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {palette.map((color, index) => (
                      <div
                        key={index}
                        className="group cursor-pointer"
                        onClick={() => copyColor(color)}
                      >
                        <div
                          className="w-full h-24 rounded-lg border-2 border-border group-hover:border-primary transition-colors shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <div className="mt-2 text-center">
                          <code className="text-xs font-mono bg-background px-2 py-1 rounded">
                            {color}
                          </code>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-4">
                    <Label className="text-xs font-medium text-muted-foreground">
                      Preview da paleta:
                    </Label>
                    <div className="flex h-16 rounded-lg overflow-hidden mt-2 border">
                      {palette.map((color, index) => (
                        <div
                          key={index}
                          className="flex-1"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};