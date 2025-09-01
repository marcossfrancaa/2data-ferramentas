
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Download, Shield, FileImage } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const MetadataRemover = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
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
      setProcessedImageUrl('');
    }
  };

  const processImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    
    try {
      // Simula o processamento de remoção de metadados
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Converte para blob sem metadados
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setProcessedImageUrl(url);
            setIsProcessing(false);
            toast({
              title: "Sucesso!",
              description: "Metadados removidos com sucesso",
            });
          }
        }, selectedFile.type, 0.95);
      };
      
      img.src = URL.createObjectURL(selectedFile);
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Erro",
        description: "Não foi possível processar a imagem",
        variant: "destructive",
      });
    }
  };

  const downloadProcessedImage = () => {
    if (!processedImageUrl || !selectedFile) return;

    const a = document.createElement('a');
    a.href = processedImageUrl;
    a.download = `sem_metadados_${selectedFile.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Removedor de Metadados</h1>
        </div>
        <p className="text-muted-foreground">
          Remove metadados EXIF de imagens para proteger sua privacidade. 
          Os metadados podem conter informações como localização, data e modelo da câmera.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Selecionar Imagem
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="imageFile">Arquivo de Imagem</Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="mt-1"
              />
            </div>

            {selectedFile && (
              <div className="p-4 bg-accent/10 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileImage className="w-8 h-8 text-primary" />
                  <div>
                    <div className="font-medium">{selectedFile.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={processImage}
              disabled={!selectedFile || isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                "Processando..."
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Remover Metadados
                </>
              )}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Imagem Processada
          </h3>
          
          {processedImageUrl ? (
            <div className="space-y-4">
              <div className="border border-border rounded-lg overflow-hidden">
                <img 
                  src={processedImageUrl} 
                  alt="Imagem sem metadados" 
                  className="w-full h-48 object-cover"
                />
              </div>

              <Button
                onClick={downloadProcessedImage}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Baixar Imagem Limpa
              </Button>

              <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2 text-success">
                  <Shield className="w-4 h-4" />
                  <span className="font-medium">Metadados Removidos</span>
                </div>
                <p className="text-sm text-success/80 mt-1">
                  Sua imagem agora está livre de informações pessoais
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <FileImage className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Imagem processada aparecerá aqui</p>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-warning/5 border-warning/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre Metadados</h4>
            <p className="text-muted-foreground">
              Metadados EXIF podem conter informações sensíveis como localização GPS, 
              data/hora da foto, modelo da câmera e configurações. Remover esses dados 
              ajuda a proteger sua privacidade ao compartilhar imagens online.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
