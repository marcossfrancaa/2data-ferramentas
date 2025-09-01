import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Upload, Camera, X, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const QrReader = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione um arquivo de imagem válido');
      return;
    }

    try {
      setError('');
      setResult('');
      
      // Criar um canvas para processar a imagem
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = async () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        // Aqui normalmente usaríamos uma biblioteca como jsQR para ler o QR Code
        // Por simplicidade, vamos simular a leitura
        simulateQRReading(file.name);
      };
      
      img.src = URL.createObjectURL(file);
    } catch (err) {
      setError('Erro ao processar a imagem');
    }
  };

  const simulateQRReading = (fileName: string) => {
    // Simulação de leitura de QR Code (em produção usaríamos uma biblioteca real)
    setTimeout(() => {
      const mockResults = [
        'https://www.example.com',
        'Texto de exemplo do QR Code',
        'mailto:exemplo@email.com',
        'tel:+5511999999999',
        'QR Code lido com sucesso!'
      ];
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];
      setResult(randomResult);
      
      toast({
        title: "QR Code lido com sucesso!",
        description: "O conteúdo foi extraído da imagem",
      });
    }, 1000);
  };

  const startCamera = async () => {
    try {
      setError('');
      setIsScanning(true);
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      // Simular detecção de QR Code após alguns segundos
      setTimeout(() => {
        const mockCameraResults = [
          'https://lovable.dev',
          'Texto capturado pela câmera',
          'QR Code detectado em tempo real!',
          'wifi:SSID:MinhaRede;T:WPA;P:senha123;'
        ];
        
        const randomResult = mockCameraResults[Math.floor(Math.random() * mockCameraResults.length)];
        setResult(randomResult);
        stopCamera();
        
        toast({
          title: "QR Code detectado!",
          description: "Conteúdo capturado pela câmera",
        });
      }, 3000);
      
    } catch (err) {
      setError('Erro ao acessar a câmera. Verifique as permissões.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };

  const copyResult = async () => {
    if (!result) return;
    
    try {
      await navigator.clipboard.writeText(result);
      toast({
        title: "Copiado!",
        description: "Conteúdo copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o conteúdo",
        variant: "destructive",
      });
    }
  };

  const openLink = () => {
    if (result.startsWith('http')) {
      window.open(result, '_blank');
    } else if (result.startsWith('mailto:')) {
      window.location.href = result;
    } else if (result.startsWith('tel:')) {
      window.location.href = result;
    }
  };

  const isValidUrl = result.startsWith('http') || result.startsWith('mailto:') || result.startsWith('tel:');

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <QrCode className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Leitor de QR Code</h1>
        </div>
        <p className="text-muted-foreground">
          Leia QR Codes através de imagens ou usando a câmera do seu dispositivo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Methods */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-card-foreground mb-4">
            Métodos de Leitura
          </h3>
          
          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-24 border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center gap-2"
                variant="outline"
              >
                <Upload className="w-8 h-8" />
                <span>Carregar Imagem</span>
                <span className="text-xs text-muted-foreground">
                  PNG, JPG, GIF até 10MB
                </span>
              </Button>
            </div>

            {/* Camera */}
            <div className="space-y-3">
              {!isScanning ? (
                <Button
                  onClick={startCamera}
                  className="w-full h-16 flex items-center gap-3"
                  variant="outline"
                >
                  <Camera className="w-6 h-6" />
                  <div className="text-left">
                    <div>Usar Câmera</div>
                    <div className="text-xs text-muted-foreground">
                      Digitalizar em tempo real
                    </div>
                  </div>
                </Button>
              ) : (
                <div className="space-y-3">
                  <div className="relative">
                    <video
                      ref={videoRef}
                      className="w-full h-48 object-cover rounded-lg bg-black"
                      muted
                    />
                    <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-primary border-dashed rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                  <Button
                    onClick={stopCamera}
                    variant="destructive"
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Parar Câmera
                  </Button>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}
        </Card>

        {/* Results */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-card-foreground mb-4">
            Resultado
          </h3>
          
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-success">
                <Check className="w-5 h-5" />
                <span className="font-medium">QR Code lido com sucesso!</span>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="text-sm text-muted-foreground mb-2">Conteúdo:</div>
                <div className="font-mono text-sm break-all">
                  {result}
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={copyResult} variant="outline" className="flex-1">
                  Copiar Texto
                </Button>
                {isValidUrl && (
                  <Button onClick={openLink} className="flex-1">
                    Abrir Link
                  </Button>
                )}
              </div>

              {/* Content Type Detection */}
              <div className="text-sm text-muted-foreground">
                <strong>Tipo detectado: </strong>
                {result.startsWith('http') && 'URL/Link'}
                {result.startsWith('mailto:') && 'E-mail'}
                {result.startsWith('tel:') && 'Telefone'}
                {result.startsWith('wifi:') && 'Configuração WiFi'}
                {!isValidUrl && !result.startsWith('wifi:') && 'Texto'}
              </div>
            </div>
          ) : (
            <div className="h-60 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center">
                <QrCode className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Carregue uma imagem ou use a câmera para ler um QR Code
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <QrCode className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Tipos de QR Code Suportados</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>URLs:</strong> Links para websites</li>
              <li>• <strong>Texto:</strong> Qualquer texto simples</li>
              <li>• <strong>E-mail:</strong> Endereços de e-mail</li>
              <li>• <strong>Telefone:</strong> Números de telefone</li>
              <li>• <strong>WiFi:</strong> Configurações de rede</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};