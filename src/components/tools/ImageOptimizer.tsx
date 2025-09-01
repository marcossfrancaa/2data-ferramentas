
import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Image as ImageIcon, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ImageOptimizer = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quality, setQuality] = useState('80');
  const [format, setFormat] = useState('jpeg');
  const [maxWidth, setMaxWidth] = useState('');
  const [maxHeight, setMaxHeight] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [optimizedSize, setOptimizedSize] = useState(0);
  const [optimizedUrl, setOptimizedUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Erro",
          description: "Por favor, selecione apenas arquivos de imagem",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
      setOriginalSize(file.size);
      setOptimizedUrl('');
      setOptimizedSize(0);
    }
  };

  const optimizeImage = () => {
    if (!selectedFile) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      const maxW = maxWidth ? parseInt(maxWidth) : width;
      const maxH = maxHeight ? parseInt(maxHeight) : height;

      if (width > maxW || height > maxH) {
        const ratio = Math.min(maxW / width, maxH / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      
      const qualityValue = parseInt(quality) / 100;
      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      
      canvas.toBlob((blob) => {
        if (blob) {
          setOptimizedSize(blob.size);
          const url = URL.createObjectURL(blob);
          setOptimizedUrl(url);
        }
      }, mimeType, qualityValue);
    };

    img.src = URL.createObjectURL(selectedFile);
  };

  const downloadOptimized = () => {
    if (!optimizedUrl || !selectedFile) return;

    const link = document.createElement('a');
    link.href = optimizedUrl;
    const extension = format === 'png' ? 'png' : 'jpg';
    const baseName = selectedFile.name.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}_optimized.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setOptimizedUrl('');
    setOriginalSize(0);
    setOptimizedSize(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressionRatio = originalSize && optimizedSize 
    ? Math.round((1 - optimizedSize / originalSize) * 100)
    : 0;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <ImageIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Otimizador de Imagens</h1>
        </div>
        <p className="text-muted-foreground">
          Comprime e redimensiona imagens para reduzir o tamanho do arquivo mantendo a qualidade.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Configurações
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label>Selecionar Imagem</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Escolher Arquivo
                </Button>
                {selectedFile && (
                  <Button
                    onClick={clearFile}
                    variant="outline"
                    size="icon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {selectedFile && (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedFile.name} ({formatFileSize(originalSize)})
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Qualidade (%)</Label>
                <Select value={quality} onValueChange={setQuality}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100% (Sem compressão)</SelectItem>
                    <SelectItem value="90">90% (Alta qualidade)</SelectItem>
                    <SelectItem value="80">80% (Boa qualidade)</SelectItem>
                    <SelectItem value="70">70% (Qualidade média)</SelectItem>
                    <SelectItem value="50">50% (Baixa qualidade)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Formato</Label>
                <Select value={format} onValueChange={setFormat}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Largura Máxima (px)</Label>
                <Input
                  type="number"
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(e.target.value)}
                  placeholder="Original"
                />
              </div>

              <div>
                <Label>Altura Máxima (px)</Label>
                <Input
                  type="number"
                  value={maxHeight}
                  onChange={(e) => setMaxHeight(e.target.value)}
                  placeholder="Original"
                />
              </div>
            </div>

            <Button
              onClick={optimizeImage}
              disabled={!selectedFile}
              className="w-full"
            >
              <ImageIcon className="w-4 h-4 mr-2" />
              Otimizar Imagem
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Resultado
          </h3>
          
          {optimizedUrl ? (
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <img 
                  src={optimizedUrl} 
                  alt="Imagem otimizada" 
                  className="max-w-full h-auto mx-auto"
                />
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Tamanho original:</span>
                  <span>{formatFileSize(originalSize)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tamanho otimizado:</span>
                  <span>{formatFileSize(optimizedSize)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Redução:</span>
                  <span className="text-success">{compressionRatio}%</span>
                </div>
              </div>

              <Button
                onClick={downloadOptimized}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Imagem Otimizada
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Selecione uma imagem e clique em "Otimizar" para ver o resultado</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
