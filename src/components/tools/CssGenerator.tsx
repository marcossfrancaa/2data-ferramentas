import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Palette, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CssGenerator = () => {
  const [shadowX, setShadowX] = useState([0]);
  const [shadowY, setShadowY] = useState([4]);
  const [shadowBlur, setShadowBlur] = useState([8]);
  const [shadowSpread, setShadowSpread] = useState([0]);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [shadowOpacity, setShadowOpacity] = useState([25]);
  
  const [borderRadius, setBorderRadius] = useState([8]);
  const [borderWidth, setBorderWidth] = useState([1]);
  const [borderColor, setBorderColor] = useState('#e5e5e5');
  const [borderStyle, setBorderStyle] = useState('solid');
  
  const [gradientType, setGradientType] = useState('linear');
  const [gradientDirection, setGradientDirection] = useState('45deg');
  const [gradientColor1, setGradientColor1] = useState('#3b82f6');
  const [gradientColor2, setGradientColor2] = useState('#8b5cf6');
  
  const [transformType, setTransformType] = useState('rotate');
  const [transformValue, setTransformValue] = useState([0]);
  
  const { toast } = useToast();

  const generateBoxShadow = () => {
    const alpha = shadowOpacity[0] / 100;
    const color = shadowColor + Math.round(alpha * 255).toString(16).padStart(2, '0');
    return `${shadowX[0]}px ${shadowY[0]}px ${shadowBlur[0]}px ${shadowSpread[0]}px ${color}`;
  };

  const generateBorder = () => {
    return `${borderWidth[0]}px ${borderStyle} ${borderColor}`;
  };

  const generateBorderRadius = () => {
    return `${borderRadius[0]}px`;
  };

  const generateGradient = () => {
    if (gradientType === 'linear') {
      return `linear-gradient(${gradientDirection}, ${gradientColor1}, ${gradientColor2})`;
    } else {
      return `radial-gradient(circle, ${gradientColor1}, ${gradientColor2})`;
    }
  };

  const generateTransform = () => {
    switch (transformType) {
      case 'rotate':
        return `rotate(${transformValue[0]}deg)`;
      case 'scale':
        return `scale(${transformValue[0] / 100})`;
      case 'translateX':
        return `translateX(${transformValue[0]}px)`;
      case 'translateY':
        return `translateY(${transformValue[0]}px)`;
      case 'skewX':
        return `skewX(${transformValue[0]}deg)`;
      case 'skewY':
        return `skewY(${transformValue[0]}deg)`;
      default:
        return 'none';
    }
  };

  const generateCSS = () => {
    return `.element {
  box-shadow: ${generateBoxShadow()};
  border: ${generateBorder()};
  border-radius: ${generateBorderRadius()};
  background: ${generateGradient()};
  transform: ${generateTransform()};
}`;
  };

  const copyCSS = async () => {
    try {
      await navigator.clipboard.writeText(generateCSS());
      toast({
        title: "Copiado!",
        description: "CSS copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o CSS",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de CSS</h1>
        </div>
        <p className="text-muted-foreground">
          Gere código CSS para sombras, bordas, gradientes e transformações com preview em tempo real.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Box Shadow */}
          <Card className="p-6 bg-gradient-card">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Box Shadow</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label>Horizontal (px)</Label>
                <Slider
                  value={shadowX}
                  onValueChange={setShadowX}
                  min={-50}
                  max={50}
                  step={1}
                  className="mt-2"
                />
                <span className="text-sm text-muted-foreground">{shadowX[0]}px</span>
              </div>
              
              <div>
                <Label>Vertical (px)</Label>
                <Slider
                  value={shadowY}
                  onValueChange={setShadowY}
                  min={-50}
                  max={50}
                  step={1}
                  className="mt-2"
                />
                <span className="text-sm text-muted-foreground">{shadowY[0]}px</span>
              </div>
              
              <div>
                <Label>Blur (px)</Label>
                <Slider
                  value={shadowBlur}
                  onValueChange={setShadowBlur}
                  min={0}
                  max={50}
                  step={1}
                  className="mt-2"
                />
                <span className="text-sm text-muted-foreground">{shadowBlur[0]}px</span>
              </div>
              
              <div>
                <Label>Spread (px)</Label>
                <Slider
                  value={shadowSpread}
                  onValueChange={setShadowSpread}
                  min={-20}
                  max={20}
                  step={1}
                  className="mt-2"
                />
                <span className="text-sm text-muted-foreground">{shadowSpread[0]}px</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shadow-color">Cor</Label>
                <Input
                  id="shadow-color"
                  type="color"
                  value={shadowColor}
                  onChange={(e) => setShadowColor(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Opacidade (%)</Label>
                <Slider
                  value={shadowOpacity}
                  onValueChange={setShadowOpacity}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-2"
                />
                <span className="text-sm text-muted-foreground">{shadowOpacity[0]}%</span>
              </div>
            </div>
          </Card>

          {/* Border */}
          <Card className="p-6 bg-gradient-card">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Border</h3>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <Label>Largura (px)</Label>
                <Slider
                  value={borderWidth}
                  onValueChange={setBorderWidth}
                  min={0}
                  max={20}
                  step={1}
                  className="mt-2"
                />
                <span className="text-sm text-muted-foreground">{borderWidth[0]}px</span>
              </div>
              
              <div>
                <Label htmlFor="border-style">Estilo</Label>
                <Select value={borderStyle} onValueChange={setBorderStyle}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="dotted">Dotted</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="border-color">Cor</Label>
                <Input
                  id="border-color"
                  type="color"
                  value={borderColor}
                  onChange={(e) => setBorderColor(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label>Border Radius (px)</Label>
              <Slider
                value={borderRadius}
                onValueChange={setBorderRadius}
                min={0}
                max={50}
                step={1}
                className="mt-2"
              />
              <span className="text-sm text-muted-foreground">{borderRadius[0]}px</span>
            </div>
          </Card>

          {/* Gradient */}
          <Card className="p-6 bg-gradient-card">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Gradient</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="gradient-type">Tipo</Label>
                <Select value={gradientType} onValueChange={setGradientType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="radial">Radial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {gradientType === 'linear' && (
                <div>
                  <Label htmlFor="gradient-direction">Direção</Label>
                  <Select value={gradientDirection} onValueChange={setGradientDirection}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0deg">0° (Para cima)</SelectItem>
                      <SelectItem value="45deg">45° (Diagonal)</SelectItem>
                      <SelectItem value="90deg">90° (Para direita)</SelectItem>
                      <SelectItem value="135deg">135°</SelectItem>
                      <SelectItem value="180deg">180° (Para baixo)</SelectItem>
                      <SelectItem value="225deg">225°</SelectItem>
                      <SelectItem value="270deg">270° (Para esquerda)</SelectItem>
                      <SelectItem value="315deg">315°</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gradient-color1">Cor 1</Label>
                <Input
                  id="gradient-color1"
                  type="color"
                  value={gradientColor1}
                  onChange={(e) => setGradientColor1(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="gradient-color2">Cor 2</Label>
                <Input
                  id="gradient-color2"
                  type="color"
                  value={gradientColor2}
                  onChange={(e) => setGradientColor2(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Transform */}
          <Card className="p-6 bg-gradient-card">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Transform</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="transform-type">Tipo</Label>
                <Select value={transformType} onValueChange={setTransformType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rotate">Rotate</SelectItem>
                    <SelectItem value="scale">Scale</SelectItem>
                    <SelectItem value="translateX">Translate X</SelectItem>
                    <SelectItem value="translateY">Translate Y</SelectItem>
                    <SelectItem value="skewX">Skew X</SelectItem>
                    <SelectItem value="skewY">Skew Y</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Valor</Label>
                <Slider
                  value={transformValue}
                  onValueChange={setTransformValue}
                  min={transformType === 'scale' ? 50 : -180}
                  max={transformType === 'scale' ? 200 : 180}
                  step={1}
                  className="mt-2"
                />
                <span className="text-sm text-muted-foreground">
                  {transformValue[0]}{transformType === 'scale' ? '%' : transformType.includes('translate') ? 'px' : '°'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Preview and Output */}
        <div className="space-y-6">
          {/* Preview */}
          <Card className="p-6 bg-gradient-card">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="w-5 h-5" />
              <h3 className="text-lg font-semibold text-card-foreground">Preview</h3>
            </div>
            
            <div className="flex items-center justify-center h-48 bg-background/50 rounded-lg">
              <div
                className="w-24 h-24 bg-primary"
                style={{
                  boxShadow: generateBoxShadow(),
                  border: generateBorder(),
                  borderRadius: generateBorderRadius(),
                  background: generateGradient(),
                  transform: generateTransform(),
                }}
              />
            </div>
          </Card>

          {/* CSS Output */}
          <Card className="p-6 bg-gradient-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">CSS Gerado</h3>
              <Button variant="outline" size="sm" onClick={copyCSS}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </div>
            
            <Textarea
              value={generateCSS()}
              readOnly
              className="font-mono text-sm h-48 resize-none"
            />
          </Card>
        </div>
      </div>
    </div>
  );
};