import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { QrCode, Download, Upload, Loader2, Palette, Wifi, User, Link, Heart, Star, Home, Mail, Phone, Camera, Music, Gift, Shield, Zap, Clock, MapPin, Sun, Moon, Cloud, Umbrella, Coffee, Car, Plane, Bike, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'qrcode';

interface ContactData {
  name: string;
  phone: string;
  email: string;
  company: string;
}

interface WiFiData {
  ssid: string;
  password: string;
  security: 'WPA/WPA2' | 'WEP' | 'None';
  hidden: boolean;
}

interface CustomizationData {
  elementType: 'none' | 'icon' | 'text' | 'logo';
  iconName: string;
  iconColor: string;
  text: string;
  textColor: string;
  backgroundShape: 'circle' | 'square' | 'none';
  backgroundColor: string;
}

export const QrGenerator = () => {
  const [dataType, setDataType] = useState<'text' | 'contact' | 'wifi'>('text');
  const [text, setText] = useState('');
  const [contactData, setContactData] = useState<ContactData>({
    name: '',
    phone: '',
    email: '',
    company: ''
  });
  const [wifiData, setWifiData] = useState<WiFiData>({
    ssid: '',
    password: '',
    security: 'WPA/WPA2',
    hidden: false
  });
  
  // New customization states
  const [customization, setCustomization] = useState<CustomizationData>({
    elementType: 'none',
    iconName: 'Heart',
    iconColor: '#ff0000',
    text: '',
    textColor: '#000000',
    backgroundShape: 'circle',
    backgroundColor: '#ffffff'
  });
  
  // QR Code states
  const [foregroundColor, setForegroundColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [realTimeGeneration, setRealTimeGeneration] = useState(true);

  // Logo upload state
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoDataUrl, setLogoDataUrl] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Available icons organized by category
  const iconCategories = {
    'Símbolos': [Heart, Star, Shield, Zap, Gift],
    'Comunicação': [Mail, Phone, Wifi],
    'Lugares': [Home, MapPin, Car, Plane],
    'Tempo': [Clock, Sun, Moon, Cloud, Umbrella],
    'Outros': [Camera, Music, Coffee, Bike]
  };

  const getIconComponent = (iconName: string) => {
    const allIcons = Object.values(iconCategories).flat();
    const iconMap: { [key: string]: any } = {
      Heart, Star, Shield, Zap, Gift, Mail, Phone, Wifi, Home, MapPin, Car, Plane, Clock, Sun, Moon, Cloud, Umbrella, Camera, Music, Coffee, Bike
    };
    return iconMap[iconName] || Heart;
  };

  // Generate data string based on type
  const generateDataString = () => {
    switch (dataType) {
      case 'contact':
        const { name, phone, email, company } = contactData;
        if (!name && !phone && !email) return '';
        
        return `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:${company}
TEL:${phone}
EMAIL:${email}
END:VCARD`;

      case 'wifi':
        const { ssid, password, security, hidden } = wifiData;
        if (!ssid) return '';
        
        const securityType = security === 'None' ? 'nopass' : security.replace('/', '');
        return `WIFI:T:${securityType};S:${ssid};P:${password};H:${hidden ? 'true' : 'false'};;`;

      case 'text':
      default:
        return text;
    }
  };

  // Generate QR Code with new customization logic
  const generateQRCode = async (dataString?: string) => {
    const data = dataString || generateDataString();
    
    if (!data.trim()) {
      setQrCodeDataUrl('');
      return;
    }

    setIsGenerating(true);
    
    try {
      const canvas = canvasRef.current;
      if (!canvas) throw new Error('Canvas não disponível');

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Contexto do canvas não disponível');

      // Step 1: Generate QR code with high error correction
      await QRCode.toCanvas(canvas, data, {
        width: 300,
        margin: 2,
        color: {
          dark: foregroundColor,
          light: backgroundColor
        },
        errorCorrectionLevel: 'H'
      });

      // Step 2: Draw background shape if needed
      if (customization.elementType !== 'none' && customization.backgroundShape !== 'none') {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const size = canvas.width * 0.2; // 20% of canvas size

        ctx.fillStyle = customization.backgroundColor;
        
        if (customization.backgroundShape === 'circle') {
          ctx.beginPath();
          ctx.arc(centerX, centerY, size / 2, 0, 2 * Math.PI);
          ctx.fill();
        } else if (customization.backgroundShape === 'square') {
          const rectSize = size * 0.8;
          ctx.fillRect(centerX - rectSize / 2, centerY - rectSize / 2, rectSize, rectSize);
        }
      }

      // Step 3: Draw central element
      if (customization.elementType !== 'none') {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        if (customization.elementType === 'text' && customization.text.trim()) {
          // Draw text with precise centering
          ctx.font = 'bold 24px Arial';
          ctx.fillStyle = customization.textColor;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(customization.text.substring(0, 4), centerX, centerY);
        } else if (customization.elementType === 'icon') {
          // For icons, we'll draw a simple circle as placeholder
          // In a real implementation, you'd convert the Lucide icon to canvas
          ctx.fillStyle = customization.iconColor;
          ctx.beginPath();
          ctx.arc(centerX, centerY, 12, 0, 2 * Math.PI);
          ctx.fill();
        } else if (customization.elementType === 'logo' && logoDataUrl) {
          // Draw uploaded logo
          const img = new Image();
          img.onload = () => {
            const logoSize = canvas.width * 0.15;
            const x = centerX - logoSize / 2;
            const y = centerY - logoSize / 2;
            ctx.drawImage(img, x, y, logoSize, logoSize);
            setQrCodeDataUrl(canvas.toDataURL());
          };
          img.src = logoDataUrl;
          return; // Exit early to wait for image load
        }
      }

      setQrCodeDataUrl(canvas.toDataURL());
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o QR Code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Real-time generation effect
  useEffect(() => {
    if (realTimeGeneration) {
      const timer = setTimeout(() => {
        generateQRCode();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [text, contactData, wifiData, dataType, foregroundColor, backgroundColor, customization, logoDataUrl, realTimeGeneration]);

  // Handle logo upload
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Erro",
          description: "Arquivo muito grande. Máximo 5MB.",
          variant: "destructive",
        });
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoDataUrl(e.target?.result as string);
        setCustomization(prev => ({ ...prev, elementType: 'logo' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoDataUrl('');
    setCustomization(prev => ({ ...prev, elementType: 'none' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Download functions
  const downloadPNG = () => {
    if (!qrCodeDataUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `qrcode-${dataType}.png`;
    link.click();
  };

  const downloadSVG = async () => {
    const data = generateDataString();
    if (!data.trim()) return;

    try {
      const svgString = await QRCode.toString(data, {
        type: 'svg',
        width: 300,
        margin: 2,
        color: {
          dark: foregroundColor,
          light: backgroundColor
        },
        errorCorrectionLevel: 'H'
      });

      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qrcode-${dataType}.svg`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar o SVG",
        variant: "destructive",
      });
    }
  };

  const hasData = () => {
    switch (dataType) {
      case 'contact':
        return contactData.name || contactData.phone || contactData.email;
      case 'wifi':
        return wifiData.ssid;
      case 'text':
      default:
        return text.trim();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <QrCode className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador QR Code Avançado</h1>
        </div>
        <p className="text-muted-foreground">
          Crie QR codes personalizados com controle granular sobre cada elemento.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="xl:col-span-2 space-y-8">
          {/* Data Type Selection */}
          <Card className="p-8">
            <h3 className="text-lg font-semibold text-card-foreground mb-6 flex items-center gap-2">
              <Link className="w-5 h-5" />
              Tipo de Dados
            </h3>
            
            <Tabs value={dataType} onValueChange={(value: any) => setDataType(value)}>
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="text" className="flex items-center gap-2">
                  <Link className="w-4 h-4" />
                  Texto/URL
                </TabsTrigger>
                <TabsTrigger value="contact" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Contato
                </TabsTrigger>
                <TabsTrigger value="wifi" className="flex items-center gap-2">
                  <Wifi className="w-4 h-4" />
                  Wi-Fi
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="mt-6">
                <Label htmlFor="text-input" className="text-base font-medium">Texto ou URL</Label>
                <Textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Digite o texto, URL ou dados que deseja converter em QR Code..."
                  className="min-h-32 mt-3"
                />
              </TabsContent>

              <TabsContent value="contact" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contact-name" className="text-base font-medium">Nome Completo</Label>
                    <Input
                      id="contact-name"
                      value={contactData.name}
                      onChange={(e) => setContactData({...contactData, name: e.target.value})}
                      placeholder="João da Silva"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-company" className="text-base font-medium">Empresa</Label>
                    <Input
                      id="contact-company"
                      value={contactData.company}
                      onChange={(e) => setContactData({...contactData, company: e.target.value})}
                      placeholder="Empresa Ltda"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-phone" className="text-base font-medium">Telefone</Label>
                    <Input
                      id="contact-phone"
                      value={contactData.phone}
                      onChange={(e) => setContactData({...contactData, phone: e.target.value})}
                      placeholder="+55 11 99999-9999"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contact-email" className="text-base font-medium">E-mail</Label>
                    <Input
                      id="contact-email"
                      type="email"
                      value={contactData.email}
                      onChange={(e) => setContactData({...contactData, email: e.target.value})}
                      placeholder="joao@email.com"
                      className="mt-2"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="wifi" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wifi-ssid">Nome da Rede (SSID)</Label>
                    <Input
                      id="wifi-ssid"
                      value={wifiData.ssid}
                      onChange={(e) => setWifiData({...wifiData, ssid: e.target.value})}
                      placeholder="MinhaRedeWiFi"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wifi-security">Tipo de Segurança</Label>
                    <Select value={wifiData.security} onValueChange={(value: any) => setWifiData({...wifiData, security: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WPA/WPA2">WPA/WPA2</SelectItem>
                        <SelectItem value="WEP">WEP</SelectItem>
                        <SelectItem value="None">Nenhuma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="wifi-password">Senha</Label>
                    <Input
                      id="wifi-password"
                      type="password"
                      value={wifiData.password}
                      onChange={(e) => setWifiData({...wifiData, password: e.target.value})}
                      placeholder="Senha da rede"
                      className="mt-1"
                      disabled={wifiData.security === 'None'}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* New Customization Section */}
          <Card className="p-8">
            <h3 className="text-lg font-semibold text-card-foreground mb-6 flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Personalizar QR Code
            </h3>

            {/* QR Code Colors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <Label htmlFor="foreground-color" className="text-base font-medium">Cor do QR Code</Label>
                <div className="flex items-center gap-3 mt-3">
                  <Input
                    id="foreground-color"
                    type="color"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    className="w-14 h-12 p-1 cursor-pointer"
                  />
                  <Input
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="qr-background-color" className="text-base font-medium">Cor do Fundo</Label>
                <div className="flex items-center gap-3 mt-3">
                  <Input
                    id="qr-background-color"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-14 h-12 p-1 cursor-pointer"
                  />
                  <Input
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    placeholder="#ffffff"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <Separator className="mb-8" />

            {/* Element Type Selection */}
            <div className="space-y-6">
              <div>
                <Label className="text-base font-medium">Tipo de Elemento Central</Label>
                <Select 
                  value={customization.elementType} 
                  onValueChange={(value: any) => setCustomization(prev => ({ ...prev, elementType: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum</SelectItem>
                    <SelectItem value="icon">Ícone</SelectItem>
                    <SelectItem value="text">Texto</SelectItem>
                    <SelectItem value="logo">Logotipo (Upload)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Options */}
              {customization.elementType === 'icon' && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Galeria de Ícones</Label>
                    <div className="mt-4 space-y-4">
                      {Object.entries(iconCategories).map(([category, icons]) => (
                        <div key={category}>
                          <Label className="text-sm font-medium text-muted-foreground">{category}</Label>
                          <div className="grid grid-cols-5 gap-2 mt-2">
                            {icons.map((IconComponent, index) => (
                              <Button
                                key={index}
                                variant={customization.iconName === IconComponent.name ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCustomization(prev => ({ ...prev, iconName: IconComponent.name || `Icon${index}` }))}
                                className="h-12 w-12 p-2"
                              >
                                <IconComponent className="w-6 h-6" />
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-base font-medium">Cor do Ícone</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Input
                        type="color"
                        value={customization.iconColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, iconColor: e.target.value }))}
                        className="w-14 h-12 p-1 cursor-pointer"
                      />
                      <Input
                        value={customization.iconColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, iconColor: e.target.value }))}
                        placeholder="#ff0000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {customization.elementType === 'text' && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Texto (máx. 4 caracteres)</Label>
                    <Input
                      value={customization.text}
                      onChange={(e) => setCustomization(prev => ({ ...prev, text: e.target.value.substring(0, 4) }))}
                      placeholder="ABC"
                      className="mt-2"
                      maxLength={4}
                    />
                  </div>
                  
                  <div>
                    <Label className="text-base font-medium">Cor do Texto</Label>
                    <div className="flex items-center gap-3 mt-2">
                      <Input
                        type="color"
                        value={customization.textColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, textColor: e.target.value }))}
                        className="w-14 h-12 p-1 cursor-pointer"
                      />
                      <Input
                        value={customization.textColor}
                        onChange={(e) => setCustomization(prev => ({ ...prev, textColor: e.target.value }))}
                        placeholder="#000000"
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {customization.elementType === 'logo' && (
                <div>
                  <Label className="text-base font-medium">Upload do Logotipo</Label>
                  <div className="mt-4 space-y-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-12"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Fazer Upload do Logo
                    </Button>
                    
                    {logoDataUrl && (
                      <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                        <div className="flex items-center gap-3">
                          <img src={logoDataUrl} alt="Logo" className="w-8 h-8 object-cover rounded" />
                          <span className="text-sm text-muted-foreground">
                            {logoFile?.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeLogo}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Background Shape Options */}
              {customization.elementType !== 'none' && (
                <div className="space-y-6">
                  <Separator />
                  <div>
                    <Label className="text-base font-medium">Forma do Fundo</Label>
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      {['circle', 'square', 'none'].map((shape) => (
                        <Button
                          key={shape}
                          variant={customization.backgroundShape === shape ? "default" : "outline"}
                          onClick={() => setCustomization(prev => ({ ...prev, backgroundShape: shape as any }))}
                          className="h-16 flex flex-col gap-1"
                        >
                          {shape === 'circle' && <div className="w-6 h-6 bg-current rounded-full opacity-50" />}
                          {shape === 'square' && <div className="w-6 h-6 bg-current opacity-50" />}
                          {shape === 'none' && <div className="text-sm">Transparente</div>}
                          <span className="text-xs capitalize">{shape === 'none' ? 'Nenhum' : shape === 'circle' ? 'Círculo' : 'Quadrado'}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {customization.backgroundShape !== 'none' && (
                    <div>
                      <Label className="text-base font-medium">Cor do Fundo do Elemento</Label>
                      <div className="flex items-center gap-3 mt-2">
                        <Input
                          type="color"
                          value={customization.backgroundColor}
                          onChange={(e) => setCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          className="w-14 h-12 p-1 cursor-pointer"
                        />
                        <Input
                          value={customization.backgroundColor}
                          onChange={(e) => setCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))}
                          placeholder="#ffffff"
                          className="flex-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Separator className="my-8" />

            {/* Generation Mode */}
            <div className="flex items-center justify-between">
              <div>
                <Label>Geração em Tempo Real</Label>
                <p className="text-sm text-muted-foreground">
                  Atualiza automaticamente conforme você digita
                </p>
              </div>
              <Button
                variant={realTimeGeneration ? "default" : "outline"}
                onClick={() => setRealTimeGeneration(!realTimeGeneration)}
              >
                {realTimeGeneration ? 'Ativado' : 'Desativado'}
              </Button>
            </div>

            {!realTimeGeneration && (
              <Button
                onClick={() => generateQRCode()}
                disabled={!hasData() || isGenerating}
                className="w-full mt-4"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4 mr-2" />
                    Gerar QR Code
                  </>
                )}
              </Button>
            )}
          </Card>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-card-foreground">
                QR Code Gerado
              </h3>
            </div>

            <div className="flex items-center justify-center min-h-80 bg-secondary/20 rounded-lg mb-4">
              {isGenerating ? (
                <div className="text-center">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
                  <p className="text-muted-foreground">Gerando QR Code...</p>
                </div>
              ) : qrCodeDataUrl ? (
                <img 
                  src={qrCodeDataUrl} 
                  alt="QR Code gerado" 
                  className="max-w-full h-auto"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>QR Code aparecerá aqui</p>
                </div>
              )}
            </div>

            {/* Download Buttons */}
            {qrCodeDataUrl && !isGenerating && (
              <div className="space-y-2">
                <Button
                  onClick={downloadPNG}
                  className="w-full"
                  variant="default"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PNG
                </Button>
                <Button
                  onClick={downloadSVG}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar SVG
                </Button>
              </div>
            )}

            {/* Hidden canvas for generation */}
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
          </Card>

          {/* Info Card */}
          <Card className="p-4 bg-accent/5 border-accent/20">
            <div className="flex items-start gap-3">
              <QrCode className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-semibold text-card-foreground mb-1">Nova Funcionalidade</h4>
                <ul className="text-muted-foreground space-y-1">
                  <li>• Controle granular sobre elemento central</li>
                  <li>• Galeria de ícones organizada por categoria</li>
                  <li>• Formas de fundo independentes (círculo/quadrado)</li>
                  <li>• Centralização perfeita garantida</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};