import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ImageIcon, Download, Copy, RefreshCw, ExternalLink, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageConfig {
  width: number;
  height: number;
  blur: number;
  grayscale: boolean;
  seed: string;
  format: 'jpg' | 'webp';
}

export const LoremPicsumGenerator = () => {
  const [config, setConfig] = useState<ImageConfig>({
    width: 800,
    height: 600,
    blur: 0,
    grayscale: false,
    seed: '',
    format: 'jpg'
  });
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const presetSizes = [
    { name: 'Quadrado', width: 400, height: 400 },
    { name: 'Paisagem', width: 800, height: 600 },
    { name: 'Retrato', width: 600, height: 800 },
    { name: 'Widescreen', width: 1920, height: 1080 },
    { name: 'Banner', width: 1200, height: 300 },
    { name: 'Avatar', width: 200, height: 200 },
    { name: 'Thumbnail', width: 300, height: 200 },
    { name: 'Card', width: 400, height: 250 },
  ];

  const generateImageUrl = (customSeed?: string) => {
    const baseUrl = 'https://picsum.photos';
    let url = `${baseUrl}`;
    
    if (customSeed || config.seed) {
      url += `/seed/${customSeed || config.seed}`;
    }
    
    url += `/${config.width}/${config.height}`;
    
    const params = new URLSearchParams();
    if (config.blur > 0) params.append('blur', config.blur.toString());
    if (config.grayscale) params.append('grayscale', '');
    if (config.format === 'webp') params.append('format', 'webp');
    
    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  };

  const generateImages = () => {
    setIsGenerating(true);
    const newImages: string[] = [];
    
    // Gerar 6 imagens diferentes
    for (let i = 0; i < 6; i++) {
      const seed = config.seed || Math.random().toString(36).substring(7);
      const imageUrl = generateImageUrl(`${seed}-${i}`);
      newImages.push(imageUrl);
    }
    
    setGeneratedImages(newImages);
    setIsGenerating(false);
    
    toast({
      title: "Imagens Geradas!",
      description: `${newImages.length} imagens Lorem Picsum criadas`,
    });
  };

  const downloadImage = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `lorem-picsum-${config.width}x${config.height}-${index + 1}.${config.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Iniciado!",
        description: `Imagem ${index + 1} está sendo baixada`,
      });
    } catch (error) {
      toast({
        title: "Erro no Download",
        description: "Não foi possível baixar a imagem",
        variant: "destructive",
      });
    }
  };

  const copyImageUrl = (imageUrl: string) => {
    navigator.clipboard.writeText(imageUrl);
    toast({
      title: "URL Copiada!",
      description: "Link da imagem copiado para a área de transferência",
    });
  };

  const applyPreset = (preset: typeof presetSizes[0]) => {
    setConfig(prev => ({
      ...prev,
      width: preset.width,
      height: preset.height
    }));
  };

  const generateRandomSeed = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    setConfig(prev => ({ ...prev, seed: randomSeed }));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <ImageIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador Lorem Picsum</h1>
        </div>
        <p className="text-muted-foreground">
          Gera imagens placeholder profissionais usando a API Lorem Picsum para seus projetos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-500" />
            Configurações da Imagem
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">Largura (px)</Label>
                <Input
                  id="width"
                  type="number"
                  min="50"
                  max="5000"
                  value={config.width}
                  onChange={(e) => setConfig(prev => ({ ...prev, width: parseInt(e.target.value) || 800 }))}
                />
              </div>
              <div>
                <Label htmlFor="height">Altura (px)</Label>
                <Input
                  id="height"
                  type="number"
                  min="50"
                  max="5000"
                  value={config.height}
                  onChange={(e) => setConfig(prev => ({ ...prev, height: parseInt(e.target.value) || 600 }))}
                />
              </div>
            </div>

            <div>
              <Label>Tamanhos Pré-definidos</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {presetSizes.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset(preset)}
                    className="text-xs justify-start"
                  >
                    {preset.name} ({preset.width}×{preset.height})
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="seed">Seed (para imagens consistentes)</Label>
              <div className="flex gap-2">
                <Input
                  id="seed"
                  value={config.seed}
                  onChange={(e) => setConfig(prev => ({ ...prev, seed: e.target.value }))}
                  placeholder="Deixe vazio para aleatório"
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={generateRandomSeed}
                  title="Gerar seed aleatório"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="blur">Desfoque (0-10)</Label>
              <Input
                id="blur"
                type="number"
                min="0"
                max="10"
                value={config.blur}
                onChange={(e) => setConfig(prev => ({ ...prev, blur: parseInt(e.target.value) || 0 }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="grayscale">Preto e Branco</Label>
              <Switch
                id="grayscale"
                checked={config.grayscale}
                onCheckedChange={(checked) => setConfig(prev => ({ ...prev, grayscale: checked }))}
              />
            </div>

            <div>
              <Label htmlFor="format">Formato</Label>
              <Select 
                value={config.format} 
                onValueChange={(value: 'jpg' | 'webp') => setConfig(prev => ({ ...prev, format: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpg">JPEG (.jpg)</SelectItem>
                  <SelectItem value="webp">WebP (.webp)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateImages}
            disabled={isGenerating}
            className="w-full mt-6"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
            {isGenerating ? 'Gerando...' : 'Gerar Imagens'}
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Preview da Configuração
          </h3>
          
          <div className="space-y-4">
            <div className="text-center p-4 bg-accent/10 rounded-lg border">
              <div className="text-lg font-semibold mb-2">
                {config.width} × {config.height} pixels
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Formato: {config.format.toUpperCase()}</p>
                {config.blur > 0 && <p>Desfoque: {config.blur}</p>}
                {config.grayscale && <p>Preto e branco: Ativado</p>}
                {config.seed && <p>Seed: {config.seed}</p>}
              </div>
            </div>

            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-2">URL de exemplo:</div>
              <div className="p-3 bg-muted rounded text-xs font-mono break-all">
                {generateImageUrl()}
              </div>
            </div>

            <div className="text-sm space-y-2">
              <h4 className="font-medium">Informações:</h4>
              <ul className="text-muted-foreground space-y-1">
                <li>• Imagens de alta qualidade</li>
                <li>• Carregamento direto via CDN</li>
                <li>• Ideal para mockups e protótipos</li>
                <li>• Totalmente gratuito</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>

      {generatedImages.length > 0 && (
        <Card className="mt-6 p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Imagens Geradas
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedImages.map((imageUrl, index) => (
              <div key={index} className="border rounded-lg overflow-hidden bg-accent/5">
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={imageUrl}
                    alt={`Lorem Picsum ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 space-y-2">
                  <div className="text-sm font-medium">
                    Imagem {index + 1}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyImageUrl(imageUrl)}
                      className="flex-1"
                    >
                      <Copy className="w-3 w-3 mr-1" />
                      URL
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadImage(imageUrl, index)}
                      className="flex-1"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Baixar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(imageUrl, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="mt-6 p-4 bg-green-50 border-green-200">
        <div className="flex items-start gap-3">
          <ImageIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-green-800 mb-2">🖼️ Sobre o Lorem Picsum</h4>
            <div className="text-green-700 space-y-1">
              <p>• <strong>API Gratuita:</strong> Powered by Unsplash com milhares de fotos</p>
              <p>• <strong>CDN Global:</strong> Carregamento rápido em qualquer lugar</p>
              <p>• <strong>Qualidade Profissional:</strong> Fotos de alta resolução</p>
              <p>• <strong>Flexível:</strong> Suporte a diferentes formatos e filtros</p>
              <p>• <strong>Sem Limites:</strong> Use quantas imagens precisar</p>
              <p>• <strong>Consistent Seeds:</strong> Mesma imagem sempre com mesmo seed</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};