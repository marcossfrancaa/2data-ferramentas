import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Palette, Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const GradientGenerator = () => {
  const [color1, setColor1] = useState('#667eea');
  const [color2, setColor2] = useState('#764ba2');
  const [direction, setDirection] = useState('135deg');
  const [gradientType, setGradientType] = useState('linear');
  const [stops, setStops] = useState([0, 100]);
  const { toast } = useToast();

  const generateGradient = () => {
    if (gradientType === 'linear') {
      return `linear-gradient(${direction}, ${color1} ${stops[0]}%, ${color2} ${stops[1]}%)`;
    } else {
      return `radial-gradient(circle, ${color1} ${stops[0]}%, ${color2} ${stops[1]}%)`;
    }
  };

  const generateCSS = () => {
    const gradient = generateGradient();
    return `background: ${gradient};`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
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

  const randomGradient = () => {
    const colors = [
      '#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe',
      '#43e97b', '#38f9d7', '#ffecd2', '#fcb69f', '#a8edea', '#fed6e3',
      '#ff9a9e', '#fecfef', '#ffeaa7', '#fab1a0', '#74b9ff', '#0984e3'
    ];
    
    const randomColor1 = colors[Math.floor(Math.random() * colors.length)];
    const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
    const directions = ['0deg', '45deg', '90deg', '135deg', '180deg', '225deg', '270deg', '315deg'];
    const randomDirection = directions[Math.floor(Math.random() * directions.length)];
    
    setColor1(randomColor1);
    setColor2(randomColor2);
    setDirection(randomDirection);
  };

  const presetGradients = [
    { name: 'Sunset', color1: '#ff9a9e', color2: '#fecfef', direction: '135deg' },
    { name: 'Ocean', color1: '#4facfe', color2: '#00f2fe', direction: '135deg' },
    { name: 'Forest', color1: '#43e97b', color2: '#38f9d7', direction: '135deg' },
    { name: 'Lavender', color1: '#667eea', color2: '#764ba2', direction: '135deg' },
    { name: 'Peach', color1: '#ffeaa7', color2: '#fab1a0', direction: '135deg' },
    { name: 'Sky', color1: '#74b9ff', color2: '#0984e3', direction: '135deg' }
  ];

  const applyPreset = (preset: any) => {
    setColor1(preset.color1);
    setColor2(preset.color2);
    setDirection(preset.direction);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Palette className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de Gradiente</h1>
        </div>
        <p className="text-muted-foreground">
          Crie gradientes CSS personalizados com preview em tempo real e código pronto para usar.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-card-foreground mb-4">
            Configurações
          </h3>
          
          <div className="space-y-6">
            <div>
              <Label>Tipo de Gradiente</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color1">Cor 1</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    className="w-12 h-10 p-1 border-0"
                  />
                  <Input
                    value={color1}
                    onChange={(e) => setColor1(e.target.value)}
                    placeholder="#667eea"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="color2">Cor 2</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    type="color"
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    className="w-12 h-10 p-1 border-0"
                  />
                  <Input
                    value={color2}
                    onChange={(e) => setColor2(e.target.value)}
                    placeholder="#764ba2"
                  />
                </div>
              </div>
            </div>

            {gradientType === 'linear' && (
              <div>
                <Label>Direção</Label>
                <Select value={direction} onValueChange={setDirection}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0deg">↑ Para cima</SelectItem>
                    <SelectItem value="45deg">↗ Diagonal</SelectItem>
                    <SelectItem value="90deg">→ Para direita</SelectItem>
                    <SelectItem value="135deg">↘ Diagonal</SelectItem>
                    <SelectItem value="180deg">↓ Para baixo</SelectItem>
                    <SelectItem value="225deg">↙ Diagonal</SelectItem>
                    <SelectItem value="270deg">← Para esquerda</SelectItem>
                    <SelectItem value="315deg">↖ Diagonal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-3">
              <Label>Posição das Cores (%)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Cor 1: {stops[0]}%</Label>
                  <Slider
                    value={[stops[0]]}
                    onValueChange={(value) => setStops([value[0], stops[1]])}
                    max={100}
                    step={1}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Cor 2: {stops[1]}%</Label>
                  <Slider
                    value={[stops[1]]}
                    onValueChange={(value) => setStops([stops[0], value[0]])}
                    max={100}
                    step={1}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={randomGradient} variant="outline" className="flex-1">
                <RotateCcw className="w-4 h-4 mr-2" />
                Aleatório
              </Button>
            </div>

            {/* Presets */}
            <div>
              <Label className="mb-2 block">Gradientes Predefinidos</Label>
              <div className="grid grid-cols-3 gap-2">
                {presetGradients.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset)}
                    className="h-12 rounded-lg border-2 border-border hover:border-primary transition-colors relative overflow-hidden"
                    style={{
                      background: `linear-gradient(${preset.direction}, ${preset.color1}, ${preset.color2})`
                    }}
                  >
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">{preset.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          {/* Preview */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">
              Preview
            </h3>
            
            <div 
              className="w-full h-60 rounded-lg border-2 border-border"
              style={{ background: generateGradient() }}
            />
          </Card>

          {/* CSS Code */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-card-foreground">
                Código CSS
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(generateCSS())}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            </div>
            
            <div className="bg-muted/30 rounded-lg p-4">
              <code className="text-sm font-mono">
                {generateCSS()}
              </code>
            </div>

            <div className="mt-4">
              <Label className="text-xs text-muted-foreground mb-2 block">
                Valor completo do gradiente:
              </Label>
              <div className="bg-muted/30 rounded-lg p-3">
                <code className="text-xs font-mono break-all">
                  {generateGradient()}
                </code>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Palette className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Dicas de Uso</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Use gradientes lineares para fundos de botões e cabeçalhos</li>
              <li>• Gradientes radiais são ideais para efeitos de spotlight</li>
              <li>• Evite contrastes muito altos entre as cores para melhor legibilidade</li>
              <li>• Teste sempre em diferentes dispositivos e temas</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};