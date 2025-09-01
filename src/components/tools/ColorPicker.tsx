import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, Share2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
  name?: string;
}

export const ColorPicker = () => {
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [colorInfo, setColorInfo] = useState<ColorInfo | null>(null);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  // Cores predefinidas (paleta compacta como na imagem)
  const predefinedColors = [
    ['#000000', '#333333', '#666666', '#999999', '#cccccc', '#ffffff'],
    ['#ff0000', '#ff6600', '#ffff00', '#66ff00', '#00ff00', '#00ff66'],
    ['#00ffff', '#0066ff', '#0000ff', '#6600ff', '#ff00ff', '#ff0066'],
    ['#660000', '#663300', '#666600', '#336600', '#006600', '#006633'],
    ['#006666', '#003366', '#000066', '#330066', '#660066', '#660033'],
    ['#990000', '#994c00', '#999900', '#4d9900', '#009900', '#00994d'],
    ['#009999', '#004d99', '#000099', '#4d0099', '#990099', '#99004d']
  ];

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
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
    const diff = max - min;

    let h = 0;
    const s = max === 0 ? 0 : diff / max;
    const v = max;

    if (diff !== 0) {
      switch (max) {
        case r: h = (g - b) / diff + (g < b ? 6 : 0); break;
        case g: h = (b - r) / diff + 2; break;
        case b: h = (r - g) / diff + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100)
    };
  };

  const rgbToCmyk = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const k = 1 - Math.max(r, g, b);
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  const hslToHex = (h: number, s: number, l: number) => {
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

    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  const updateColorInfo = (hex: string) => {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    setColorInfo({
      hex,
      rgb,
      hsl,
      hsv,
      cmyk
    });

    // Adicionar à lista de cores recentes
    setRecentColors(prev => {
      const newColors = [hex, ...prev.filter(c => c !== hex)].slice(0, 10);
      return newColors;
    });
  };

  useEffect(() => {
    // Verificar se há cor na URL
    const urlParams = new URLSearchParams(window.location.search);
    const colorFromUrl = urlParams.get('cor');
    if (colorFromUrl && /^[0-9A-Fa-f]{6}$/.test(colorFromUrl)) {
      const hexColor = '#' + colorFromUrl;
      setSelectedColor(hexColor);
    } else {
      updateColorInfo(selectedColor);
    }
  }, []);

  useEffect(() => {
    const rgb = hexToRgb(selectedColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    setColorInfo({
      hex: selectedColor,
      rgb,
      hsl,
      hsv,
      cmyk
    });

    // Adicionar à lista de cores recentes
    setRecentColors(prev => {
      const newColors = [selectedColor, ...prev.filter(c => c !== selectedColor)].slice(0, 10);
      return newColors;
    });
  }, [selectedColor]);

  const copyToClipboard = (text: string, format: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Cor ${format} copiada para a área de transferência`);
  };

  const shareColor = () => {
    const colorWithoutHash = selectedColor.replace('#', '');
    const url = `${window.location.origin}${window.location.pathname}?cor=${colorWithoutHash}`;
    navigator.clipboard.writeText(url);
    toast.success('Link para compartilhar a cor copiado!');
  };

  const generateRandomColor = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setSelectedColor(randomColor);
  };

  const getContrastColor = (hex: string) => {
    const rgb = hexToRgb(hex);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#ffffff';
  };

  const generateShades = (hex: string) => {
    const rgb = hexToRgb(hex);
    const shades = [];
    
    for (let i = 0; i <= 10; i++) {
      const factor = i / 10;
      const r = Math.round(rgb.r * (1 - factor));
      const g = Math.round(rgb.g * (1 - factor));
      const b = Math.round(rgb.b * (1 - factor));
      
      const shade = '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
      
      shades.push(shade);
    }
    
    return shades;
  };

  const generateTints = (hex: string) => {
    const rgb = hexToRgb(hex);
    const tints = [];
    
    for (let i = 0; i <= 10; i++) {
      const factor = i / 10;
      const r = Math.round(rgb.r + (255 - rgb.r) * factor);
      const g = Math.round(rgb.g + (255 - rgb.g) * factor);
      const b = Math.round(rgb.b + (255 - rgb.b) * factor);
      
      const tint = '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      }).join('');
      
      tints.push(tint);
    }
    
    return tints;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Color Picker
            <Button onClick={shareColor} size="sm" variant="outline" className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border-gradient">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
          </CardTitle>
          <CardDescription>
            Não sabe qual código hexa da cor que você está precisando? Use nosso color picker, similar à ferramenta conta gotas do photoshop, basta clicar na cor desejada que logo ao lado será atualizado o código e outros valores
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-6">
            {/* Seletor principal - área de saturação/brilho */}
            <div className="relative">
              <div 
                className="w-64 h-64 border rounded cursor-crosshair relative"
                style={{
                  background: `linear-gradient(to right, white, hsl(${colorInfo?.hsl.h || 0}, 100%, 50%)), linear-gradient(to top, black, transparent)`
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const newSaturation = Math.round((x / rect.width) * 100);
                  const newLightness = Math.round(100 - (y / rect.height) * 100);
                  const newColor = hslToHex(colorInfo?.hsl.h || 0, newSaturation, newLightness);
                  setSelectedColor(newColor);
                }}
              >
                {/* Indicador de posição */}
                <div 
                  className="absolute w-3 h-3 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{
                    left: `${colorInfo?.hsl.s || 0}%`,
                    top: `${100 - (colorInfo?.hsl.l || 0)}%`,
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.3)'
                  }}
                />
              </div>
            </div>

            {/* Seletor de matiz */}
            <div className="relative">
              <div 
                className="w-8 h-64 border rounded cursor-pointer"
                style={{
                  background: 'linear-gradient(to bottom, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const y = e.clientY - rect.top;
                  const newHue = Math.round((y / rect.height) * 360);
                  const newColor = hslToHex(newHue, colorInfo?.hsl.s || 0, colorInfo?.hsl.l || 0);
                  setSelectedColor(newColor);
                }}
              >
                {/* Indicador de posição */}
                <div 
                  className="absolute w-full h-1 border border-white transform -translate-y-1/2 pointer-events-none"
                  style={{
                    top: `${((colorInfo?.hsl.h || 0) / 360) * 100}%`,
                    boxShadow: '0 0 0 1px rgba(0,0,0,0.3)'
                  }}
                />
              </div>
            </div>

            {/* Paleta de cores predefinidas */}
            <div className="ml-4">
              <div className="grid grid-cols-6 gap-1 mb-4">
                {predefinedColors.map((row, rowIndex) => 
                  row.map((color, colIndex) => (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => setSelectedColor(color)}
                      className="w-6 h-6 border border-gray-300 cursor-pointer hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))
                )}
              </div>
              
              {/* Cor atual */}
              <div 
                className="w-24 h-16 border-2 border-gray-300 mb-2"
                style={{ backgroundColor: selectedColor }}
              />
              
              <Button onClick={generateRandomColor} size="sm" className="w-24">
                <RefreshCw className="h-3 w-3 mr-1" />
                Sortear
              </Button>
            </div>
          </div>

          {/* Campos de entrada para valores */}
          {colorInfo && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* RGB */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">RGB</Label>
                <div className="space-y-1">
                  <div>
                    <Label className="text-xs text-muted-foreground">R</Label>
                    <Input 
                      type="number" 
                      value={colorInfo.rgb.r} 
                      min="0" 
                      max="255"
                      className="h-8 text-sm"
                      onChange={(e) => {
                        const r = parseInt(e.target.value) || 0;
                        const hex = '#' + [r, colorInfo.rgb.g, colorInfo.rgb.b]
                          .map(x => x.toString(16).padStart(2, '0')).join('');
                        setSelectedColor(hex);
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">G</Label>
                    <Input 
                      type="number" 
                      value={colorInfo.rgb.g} 
                      min="0" 
                      max="255"
                      className="h-8 text-sm"
                      onChange={(e) => {
                        const g = parseInt(e.target.value) || 0;
                        const hex = '#' + [colorInfo.rgb.r, g, colorInfo.rgb.b]
                          .map(x => x.toString(16).padStart(2, '0')).join('');
                        setSelectedColor(hex);
                      }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">B</Label>
                    <Input 
                      type="number" 
                      value={colorInfo.rgb.b} 
                      min="0" 
                      max="255"
                      className="h-8 text-sm"
                      onChange={(e) => {
                        const b = parseInt(e.target.value) || 0;
                        const hex = '#' + [colorInfo.rgb.r, colorInfo.rgb.g, b]
                          .map(x => x.toString(16).padStart(2, '0')).join('');
                        setSelectedColor(hex);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* HSL */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">HSL</Label>
                <div className="space-y-1">
                  <div>
                    <Label className="text-xs text-muted-foreground">H</Label>
                    <Input 
                      type="number" 
                      value={colorInfo.hsl.h} 
                      min="0" 
                      max="360"
                      className="h-8 text-sm"
                     onChange={(e) => {
                       const newHue = parseInt(e.target.value) || 0;
                       const newColor = hslToHex(newHue, colorInfo.hsl.s, colorInfo.hsl.l);
                       setSelectedColor(newColor);
                     }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">S</Label>
                    <Input 
                      type="number" 
                      value={colorInfo.hsl.s} 
                      min="0" 
                      max="100"
                      className="h-8 text-sm"
                     onChange={(e) => {
                       const newSaturation = parseInt(e.target.value) || 0;
                       const newColor = hslToHex(colorInfo.hsl.h, newSaturation, colorInfo.hsl.l);
                       setSelectedColor(newColor);
                     }}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">L</Label>
                    <Input 
                      type="number" 
                      value={colorInfo.hsl.l} 
                      min="0" 
                      max="100"
                      className="h-8 text-sm"
                      onChange={(e) => {
                        const newLightness = parseInt(e.target.value) || 0;
                        const newColor = hslToHex(colorInfo.hsl.h, colorInfo.hsl.s, newLightness);
                        setSelectedColor(newColor);
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* HSV */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">HSV</Label>
                <div className="space-y-1">
                  <div>
                    <Label className="text-xs text-muted-foreground">H</Label>
                    <Input 
                      type="number" 
                      value={colorInfo.hsv.h} 
                      min="0" 
                      max="360"
                      className="h-8 text-sm"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">S</Label>
                    <Input 
                      type="number" 
                      value={colorInfo.hsv.s} 
                      min="0" 
                      max="100"
                      className="h-8 text-sm"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">V</Label>
                    <Input 
                      type="number" 
                      value={colorInfo.hsv.v} 
                      min="0" 
                      max="100"
                      className="h-8 text-sm"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* CMYK */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">CMYK</Label>
                <div className="space-y-1">
                  <div>
                    <Label className="text-xs text-muted-foreground">C</Label>
                    <Input 
                      type="number" 
                      value={colorInfo.cmyk.c} 
                      min="0" 
                      max="100"
                      className="h-8 text-sm"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">M</Label>
                    <Input 
                      type="number" 
                      value={colorInfo.cmyk.m} 
                      min="0" 
                      max="100"
                      className="h-8 text-sm"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Y</Label>
                    <Input 
                      type="number" 
                      value={colorInfo.cmyk.y} 
                      min="0" 
                      max="100"
                      className="h-8 text-sm"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">K</Label>
                    <Input 
                      type="number" 
                      value={colorInfo.cmyk.k} 
                      min="0" 
                      max="100"
                      className="h-8 text-sm"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Códigos para copiar */}
          {colorInfo && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Input 
                  value={colorInfo.hex} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(colorInfo.hex, 'HEX')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Input 
                  value={`rgb(${colorInfo.rgb.r}, ${colorInfo.rgb.g}, ${colorInfo.rgb.b})`} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`rgb(${colorInfo.rgb.r}, ${colorInfo.rgb.g}, ${colorInfo.rgb.b})`, 'RGB')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Input 
                  value={`hsl(${colorInfo.hsl.h}, ${colorInfo.hsl.s}%, ${colorInfo.hsl.l}%)`} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`hsl(${colorInfo.hsl.h}, ${colorInfo.hsl.s}%, ${colorInfo.hsl.l}%)`, 'HSL')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Input 
                  value={`${colorInfo.cmyk.c}%, ${colorInfo.cmyk.m}%, ${colorInfo.cmyk.y}%, ${colorInfo.cmyk.k}%`} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(`cmyk(${colorInfo.cmyk.c}%, ${colorInfo.cmyk.m}%, ${colorInfo.cmyk.y}%, ${colorInfo.cmyk.k}%)`, 'CMYK')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Cores recentes */}
          {recentColors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Cores Recentes</h3>
              <div className="flex gap-2 flex-wrap">
                {recentColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className="w-8 h-8 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  );
};
