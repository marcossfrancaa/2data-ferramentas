import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Palette, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ColorValues {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
}

export const ColorConverter = () => {
  const [color, setColor] = useState('#3B82F6');
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: '#3B82F6',
    rgb: 'rgb(59, 130, 246)',
    hsl: 'hsl(217, 91%, 60%)',
    hsv: 'hsv(217, 76%, 96%)',
  });
  const { toast } = useToast();

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;

    if (d !== 0) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    };
  };

  const convertColor = (hexColor: string) => {
    const rgb = hexToRgb(hexColor);
    if (!rgb) return;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);

    setColorValues({
      hex: hexColor.toUpperCase(),
      rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    });
  };

  useEffect(() => {
    convertColor(color);
  }, [color]);

  const copyToClipboard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Copiado!",
        description: "Cor copiada para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a cor",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Conversor de Cores</h1>
        </div>
        <p className="text-muted-foreground">
          Converte cores entre diferentes formatos: HEX, RGB, HSL e HSV. 
          Escolha uma cor e veja os valores em todos os formatos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-card">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Seletor de Cor
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Escolha a Cor
              </label>
              <div className="flex gap-3 items-center">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-16 rounded-lg border border-border cursor-pointer"
                />
                <div className="flex-1">
                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#000000"
                    className="font-mono"
                  />
                </div>
              </div>
            </div>

            <div 
              className="w-full h-32 rounded-lg border border-border shadow-medium"
              style={{ backgroundColor: color }}
            />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Formatos de Cor
          </h3>
          
          <div className="space-y-4">
            {[
              { label: 'HEX', value: colorValues.hex },
              { label: 'RGB', value: colorValues.rgb },
              { label: 'HSL', value: colorValues.hsl },
              { label: 'HSV', value: colorValues.hsv },
            ].map((format) => (
              <div key={format.label}>
                <label className="block text-sm font-medium text-card-foreground mb-1">
                  {format.label}
                </label>
                <div className="flex gap-2">
                  <Input
                    value={format.value}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(format.value)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Palette className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Formatos de Cor</h4>
            <ul className="text-muted-foreground space-y-1">
              <li><strong>HEX:</strong> Formato hexadecimal usado em CSS e web design</li>
              <li><strong>RGB:</strong> Red, Green, Blue - sistema de cores aditivas</li>
              <li><strong>HSL:</strong> Hue, Saturation, Lightness - mais intuitivo para designers</li>
              <li><strong>HSV:</strong> Hue, Saturation, Value - usado em softwares de edição</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};