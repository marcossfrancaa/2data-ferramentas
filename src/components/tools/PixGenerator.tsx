import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Smartphone, Copy, Download, User, Building2, Mail, Phone, Key, CheckCircle, XCircle, QrCode, Upload, Banknote, ShoppingCart, CreditCard, Gift, Heart, Star, Coffee, Printer, Layout, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import QRCodeLib from 'qrcode';

type PixKeyType = 'cpf' | 'cnpj' | 'email' | 'phone' | 'random' | 'invalid' | null;
type CustomizationType = 'none' | 'logo' | 'text' | 'icon';
type PlateTemplate = 'classic' | 'modern' | 'minimal' | 'commercial';

interface PlateTemplateConfig {
  id: PlateTemplate;
  name: string;
  description: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

const plateTemplates: PlateTemplateConfig[] = [
  {
    id: 'classic',
    name: 'Clássico',
    description: 'Design vertical simples com logo PIX',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    accentColor: '#32BCAD'
  },
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Fundo escuro com elementos gráficos',
    backgroundColor: '#1F2937',
    textColor: '#FFFFFF', 
    accentColor: '#60A5FA'
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Foco apenas no QR Code',
    backgroundColor: '#F9FAFB',
    textColor: '#374151',
    accentColor: '#32BCAD'
  },
  {
    id: 'commercial',
    name: 'Comercial',
    description: 'Para lojas e negócios',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    accentColor: '#DC2626'
  }
];

const predefinedIcons = [
  { id: 'pix', name: 'PIX', icon: Smartphone, color: '#32BCAD' },
  { id: 'real', name: 'Real', icon: Banknote, color: '#10B981' },
  { id: 'cart', name: 'Compras', icon: ShoppingCart, color: '#3B82F6' },
  { id: 'card', name: 'Cartão', icon: CreditCard, color: '#8B5CF6' },
  { id: 'gift', name: 'Presente', icon: Gift, color: '#F59E0B' },
  { id: 'heart', name: 'Coração', icon: Heart, color: '#EF4444' },
  { id: 'star', name: 'Estrela', icon: Star, color: '#FBBF24' },
  { id: 'coffee', name: 'Café', icon: Coffee, color: '#8B4513' },
];

export default function PixGenerator() {
  // Basic PIX states
  const [pixKey, setPixKey] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientCity, setRecipientCity] = useState('');
  const [amount, setAmount] = useState('');
  const [displayAmount, setDisplayAmount] = useState('');
  const [description, setDescription] = useState('');
  const [txId, setTxId] = useState('');
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [pixCode, setPixCode] = useState('');
  const [keyType, setKeyType] = useState<PixKeyType>(null);
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);

  // Customization states
  const [showCustomization, setShowCustomization] = useState(false);
  const [customizationType, setCustomizationType] = useState<CustomizationType>('none');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [customText, setCustomText] = useState('');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [selectedIcon, setSelectedIcon] = useState<string>('pix');
  const [backgroundShape, setBackgroundShape] = useState<'circle' | 'square' | 'none'>('circle');
  const [backgroundColor, setBackgroundColor] = useState('#32BCAD');

  // Plate generator states
  const [selectedTemplate, setSelectedTemplate] = useState<PlateTemplate>('classic');
  const [businessName, setBusinessName] = useState('');
  const [platePreviewUrl, setPlatePreviewUrl] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plateCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Utility functions
  const formatarTamanho = (valor: string) => {
    return valor.length.toString().padStart(2, '0');
  };

  const limparTexto = (str: string) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9\s]/g, '')
      .toUpperCase();
  };

  const crc16 = (data: string) => {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc <<= 1;
        }
      }
    }
    return ('0000' + (crc & 0xFFFF).toString(16).toUpperCase()).slice(-4);
  };

  // Currency formatting
  const formatCurrency = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (!numbers) return '';
    const numberValue = parseInt(numbers) / 100;
    return numberValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  };

  const getNumericValue = (formattedValue: string): string => {
    const numbers = formattedValue.replace(/\D/g, '');
    if (!numbers) return '';
    const numberValue = parseInt(numbers) / 100;
    return numberValue.toString();
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatCurrency(inputValue);
    const numeric = getNumericValue(formatted);
    setDisplayAmount(formatted);
    setAmount(numeric);
  };

  // Validation functions
  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11 || /^(\d)\1+$/.test(cleanCPF)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    
    return digit1 === parseInt(cleanCPF.charAt(9)) && digit2 === parseInt(cleanCPF.charAt(10));
  };

  const validateCNPJ = (cnpj: string) => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    if (cleanCNPJ.length !== 14 || /^(\d)\1+$/.test(cleanCNPJ)) return false;
    
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weights1[i];
    }
    let digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weights2[i];
    }
    let digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    return digit1 === parseInt(cleanCNPJ.charAt(12)) && digit2 === parseInt(cleanCNPJ.charAt(13));
  };

  const detectAndValidateKey = (key: string): { type: PixKeyType; valid: boolean } => {
    if (!key.trim()) return { type: null, valid: false };
    
    const cleanKey = key.replace(/\D/g, '');
    
    if (cleanKey.length === 11 && /^\d+$/.test(cleanKey)) {
      return { type: 'cpf', valid: validateCPF(cleanKey) };
    }
    
    if (cleanKey.length === 14 && /^\d+$/.test(cleanKey)) {
      return { type: 'cnpj', valid: validateCNPJ(cleanKey) };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(key)) {
      return { type: 'email', valid: true };
    }
    
    const phoneRegex = /^\+?55\s?\(?[1-9]{2}\)?\s?9?\d{4}-?\d{4}$/;
    if (phoneRegex.test(key.replace(/\s/g, '')) || (cleanKey.length >= 10 && cleanKey.length <= 11)) {
      return { type: 'phone', valid: true };
    }
    
    if (key.length === 32 && /^[a-zA-Z0-9-]+$/.test(key)) {
      return { type: 'random', valid: true };
    }
    
    return { type: 'invalid', valid: false };
  };

  // QR Code customization
  const applyCustomization = useCallback(async (baseQrCodeUrl: string) => {
    if (customizationType === 'none') return baseQrCodeUrl;

    const canvas = canvasRef.current;
    if (!canvas) return baseQrCodeUrl;

    const ctx = canvas.getContext('2d');
    if (!ctx) return baseQrCodeUrl;

    return new Promise<string>((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        ctx.drawImage(img, 0, 0);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(canvas.width, canvas.height) * 0.15;

        const drawBackground = () => {
          if (backgroundShape === 'none') return;
          
          ctx.fillStyle = backgroundColor;
          ctx.beginPath();
          
          if (backgroundShape === 'circle') {
            ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
          } else if (backgroundShape === 'square') {
            const halfSize = radius * 0.9;
            ctx.rect(centerX - halfSize, centerY - halfSize, halfSize * 2, halfSize * 2);
          }
          
          ctx.fill();
        };

        if (customizationType === 'logo' && logoFile) {
          drawBackground();
          const logoImg = document.createElement('img');
          logoImg.onload = () => {
            const logoRadius = radius * 0.8;
            const logoSize = logoRadius * 2;
            
            ctx.drawImage(
              logoImg,
              centerX - logoRadius,
              centerY - logoRadius,
              logoSize,
              logoSize
            );
            resolve(canvas.toDataURL());
          };
          logoImg.src = URL.createObjectURL(logoFile);
        } else if (customizationType === 'text' && customText) {
          drawBackground();
          ctx.fillStyle = textColor;
          ctx.font = `bold ${radius * 0.8}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(customText.substring(0, 4), centerX, centerY);
          resolve(canvas.toDataURL());
        } else if (customizationType === 'icon') {
          const selectedIconData = predefinedIcons.find(icon => icon.id === selectedIcon);
          if (selectedIconData) {
            const iconBackgroundColor = backgroundColor === '#32BCAD' ? selectedIconData.color : backgroundColor;
            
            if (backgroundShape !== 'none') {
              ctx.fillStyle = iconBackgroundColor;
              ctx.beginPath();
              
              if (backgroundShape === 'circle') {
                ctx.arc(centerX, centerY, radius * 0.9, 0, 2 * Math.PI);
              } else if (backgroundShape === 'square') {
                const halfSize = radius * 0.8;
                ctx.rect(centerX - halfSize, centerY - halfSize, halfSize * 2, halfSize * 2);
              }
              
              ctx.fill();
            }
            
            ctx.fillStyle = '#FFFFFF';
            ctx.font = `bold ${radius * 0.7}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const iconSymbol = selectedIconData.id === 'pix' ? 'PIX' :
                              selectedIconData.id === 'real' ? 'R$' :
                              selectedIconData.id === 'cart' ? '🛒' :
                              selectedIconData.id === 'card' ? '💳' :
                              selectedIconData.id === 'gift' ? '🎁' :
                              selectedIconData.id === 'heart' ? '❤️' :
                              selectedIconData.id === 'star' ? '⭐' :
                              selectedIconData.id === 'coffee' ? '☕' : 'PIX';
            
            ctx.fillText(iconSymbol, centerX, centerY);
          }
          resolve(canvas.toDataURL());
        } else {
          resolve(baseQrCodeUrl);
        }
      };
      img.src = baseQrCodeUrl;
    });
  }, [customizationType, logoFile, customText, textColor, selectedIcon, backgroundShape, backgroundColor]);

  // Main QR Code generation
  const atualizarQRCode = useCallback(async () => {
    if (!pixKey.trim() || !recipientName.trim() || !recipientCity.trim() || !isKeyValid) {
      setQrCodeUrl('');
      setPixCode('');
      return;
    }

    try {
      const chavePix = pixKey.trim();
      const nomeLimpo = limparTexto(recipientName).substring(0, 25);
      const cidadeLimpa = limparTexto(recipientCity).substring(0, 15);
      const txidLimpo = limparTexto(txId).replace(/ /g, '').substring(0, 25) || '***';
      
      const payloadFormat = '000201';
      const merchantAccount = '26' + formatarTamanho('0014BR.GOV.BCB.PIX' + '01' + formatarTamanho(chavePix) + chavePix) + '0014BR.GOV.BCB.PIX' + '01' + formatarTamanho(chavePix) + chavePix;
      const merchantCategory = '52040000';
      const transactionCurrency = '5303986';
      
      let transactionAmount = '';
      if (amount && parseFloat(amount) > 0) {
        const valorFormatado = parseFloat(amount).toFixed(2);
        transactionAmount = '54' + formatarTamanho(valorFormatado) + valorFormatado;
      }
      
      const countryCode = '5802BR';
      const merchantName = '59' + formatarTamanho(nomeLimpo) + nomeLimpo;
      const merchantCity = '60' + formatarTamanho(cidadeLimpa) + cidadeLimpa;
      const additionalData = '62' + formatarTamanho('05' + formatarTamanho(txidLimpo) + txidLimpo) + '05' + formatarTamanho(txidLimpo) + txidLimpo;
      
      const payload = payloadFormat + merchantAccount + merchantCategory + transactionCurrency + transactionAmount + countryCode + merchantName + merchantCity + additionalData + '6304';
      
      const checksum = crc16(payload);
      const finalPayload = payload + checksum;
      
      setPixCode(finalPayload);

      const baseQrCodeDataUrl = await QRCodeLib.toDataURL(finalPayload, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'H'
      });

      const finalQrCodeUrl = await applyCustomization(baseQrCodeDataUrl);
      setQrCodeUrl(finalQrCodeUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      setQrCodeUrl('');
      setPixCode('');
    }
  }, [pixKey, recipientName, recipientCity, amount, txId, isKeyValid, applyCustomization, customizationType]);

  // Plate generation functions
  const generatePlate = useCallback(async () => {
    if (!qrCodeUrl || !recipientName || !recipientCity) {
      setPlatePreviewUrl('');
      return;
    }

    const canvas = plateCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 620;
    canvas.height = 880;

    const template = plateTemplates.find(t => t.id === selectedTemplate);
    if (!template) return;

    try {
      const qrImg = document.createElement('img');
      await new Promise((resolve, reject) => {
        qrImg.onload = resolve;
        qrImg.onerror = reject;
        qrImg.src = qrCodeUrl;
      });

      ctx.fillStyle = template.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      switch (selectedTemplate) {
        case 'classic':
          await drawClassicTemplate(ctx, qrImg, template);
          break;
        case 'modern':
          await drawModernTemplate(ctx, qrImg, template);
          break;
        case 'minimal':
          await drawMinimalTemplate(ctx, qrImg, template);
          break;
        case 'commercial':
          await drawCommercialTemplate(ctx, qrImg, template);
          break;
      }

      setPlatePreviewUrl(canvas.toDataURL('image/png', 1.0));
    } catch (error) {
      console.error('Error generating plate:', error);
      toast.error('Erro ao gerar placa');
    }
  }, [qrCodeUrl, recipientName, recipientCity, selectedTemplate, amount, displayAmount, businessName]);

  // Template drawing functions
  const drawClassicTemplate = async (ctx: CanvasRenderingContext2D, qrImg: HTMLImageElement, template: PlateTemplateConfig) => {
    const centerX = ctx.canvas.width / 2;
    
    ctx.fillStyle = template.accentColor;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PIX', centerX, 80);

    ctx.fillStyle = template.textColor;
    ctx.font = '24px Arial';
    ctx.fillText('Pague com Pix', centerX, 120);

    const qrSize = 300;
    ctx.drawImage(qrImg, centerX - qrSize/2, 160, qrSize, qrSize);

    ctx.font = '18px Arial';
    ctx.fillText('Aponte a câmera do seu celular', centerX, 500);
    ctx.fillText('para o código e pague', centerX, 530);

    ctx.font = 'bold 20px Arial';
    ctx.fillText(recipientName, centerX, 580);
    
    ctx.font = '16px Arial';
    ctx.fillStyle = template.textColor + '80';
    ctx.fillText(recipientCity, centerX, 610);

    if (amount && parseFloat(amount) > 0) {
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = '#059669';
      ctx.fillText(displayAmount || `R$ ${parseFloat(amount).toFixed(2).replace('.', ',')}`, centerX, 680);
    }

    ctx.font = '14px Arial';
    ctx.fillStyle = template.textColor + '60';
    ctx.fillText('Pagamento instantâneo • Banco Central do Brasil', centerX, 820);
  };

  const drawModernTemplate = async (ctx: CanvasRenderingContext2D, qrImg: HTMLImageElement, template: PlateTemplateConfig) => {
    const centerX = ctx.canvas.width / 2;

    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, template.backgroundColor);
    gradient.addColorStop(1, '#111827');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = template.accentColor + '20';
    ctx.beginPath();
    ctx.arc(100, 100, 80, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(ctx.canvas.width - 100, ctx.canvas.height - 100, 60, 0, 2 * Math.PI);
    ctx.fill();

    ctx.shadowColor = template.accentColor;
    ctx.shadowBlur = 20;
    ctx.fillStyle = template.accentColor;
    ctx.font = 'bold 52px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('PIX', centerX, 100);
    
    ctx.shadowBlur = 0;

    const qrSize = 280;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(centerX - qrSize/2 - 10, 140, qrSize + 20, qrSize + 20);
    ctx.drawImage(qrImg, centerX - qrSize/2, 150, qrSize, qrSize);

    ctx.fillStyle = template.textColor;
    ctx.font = '20px Arial';
    ctx.fillText('Escaneie para pagar', centerX, 480);

    ctx.font = 'bold 24px Arial';
    ctx.fillText(recipientName, centerX, 540);
    
    ctx.font = '18px Arial';
    ctx.fillStyle = template.textColor + 'CC';
    ctx.fillText(recipientCity, centerX, 570);

    if (amount && parseFloat(amount) > 0) {
      ctx.font = 'bold 36px Arial';
      ctx.fillStyle = template.accentColor;
      ctx.fillText(displayAmount || `R$ ${parseFloat(amount).toFixed(2).replace('.', ',')}`, centerX, 640);
    }
  };

  const drawMinimalTemplate = async (ctx: CanvasRenderingContext2D, qrImg: HTMLImageElement, template: PlateTemplateConfig) => {
    const centerX = ctx.canvas.width / 2;

    const qrSize = 320;
    ctx.drawImage(qrImg, centerX - qrSize/2, 180, qrSize, qrSize);

    ctx.fillStyle = template.textColor;
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Escaneie para pagar', centerX, 540);

    ctx.font = 'bold 16px Arial';
    ctx.fillText(recipientName, centerX, 580);

    if (amount && parseFloat(amount) > 0) {
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = template.accentColor;
      ctx.fillText(displayAmount || `R$ ${parseFloat(amount).toFixed(2).replace('.', ',')}`, centerX, 620);
    }
  };

  const drawCommercialTemplate = async (ctx: CanvasRenderingContext2D, qrImg: HTMLImageElement, template: PlateTemplateConfig) => {
    const centerX = ctx.canvas.width / 2;

    ctx.fillStyle = template.accentColor;
    ctx.fillRect(0, 0, ctx.canvas.width, 120);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(businessName || recipientName, centerX, 50);
    
    ctx.font = '18px Arial';
    ctx.fillText('Pague com PIX', centerX, 85);

    const qrSize = 300;
    ctx.drawImage(qrImg, centerX - qrSize/2, 160, qrSize, qrSize);

    ctx.fillStyle = template.textColor;
    ctx.font = '20px Arial';
    ctx.fillText('Abra o app do seu banco e', centerX, 500);
    ctx.fillText('escaneie o código acima', centerX, 530);

    ctx.font = '16px Arial';
    ctx.fillText(recipientCity, centerX, 580);

    if (amount && parseFloat(amount) > 0) {
      ctx.fillStyle = template.accentColor;
      ctx.font = 'bold 48px Arial';
      ctx.fillText(displayAmount || `R$ ${parseFloat(amount).toFixed(2).replace('.', ',')}`, centerX, 660);
    }

    ctx.fillStyle = template.textColor + '80';
    ctx.font = '14px Arial';
    ctx.fillText('Pagamento via PIX - Instantâneo e seguro', centerX, 800);
  };

  // Helper functions
  const getKeyTypeIcon = () => {
    if (!keyType || keyType === 'invalid') return null;
    
    const iconProps = { className: "h-4 w-4" };
    
    switch (keyType) {
      case 'cpf': return <User {...iconProps} />;
      case 'cnpj': return <Building2 {...iconProps} />;
      case 'email': return <Mail {...iconProps} />;
      case 'phone': return <Phone {...iconProps} />;
      case 'random': return <Key {...iconProps} />;
      default: return null;
    }
  };

  const getKeyTypeText = () => {
    switch (keyType) {
      case 'cpf': return 'CPF';
      case 'cnpj': return 'CNPJ';
      case 'email': return 'E-mail';
      case 'phone': return 'Telefone';
      case 'random': return 'Chave Aleatória';
      case 'invalid': return 'Chave inválida';
      default: return '';
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `pix-qr-${recipientName.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code baixado!');
  };

  const copyPixCode = () => {
    if (!pixCode) return;
    navigator.clipboard.writeText(pixCode);
    toast.success('Código PIX copiado!');
  };

  const downloadPlate = () => {
    if (!platePreviewUrl) return;
    const link = document.createElement('a');
    link.href = platePreviewUrl;
    const template = plateTemplates.find(t => t.id === selectedTemplate);
    link.download = `placa-pix-${template?.name.toLowerCase()}-${recipientName.replace(/\s+/g, '-').toLowerCase()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Placa PIX baixada!');
  };

  // Effects
  useEffect(() => {
    const { type, valid } = detectAndValidateKey(pixKey);
    setKeyType(type);
    setIsKeyValid(valid);
  }, [pixKey]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      atualizarQRCode();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [atualizarQRCode]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generatePlate();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [generatePlate]);

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-6 w-6" />
            Gerador PIX Completo
          </CardTitle>
          <CardDescription>
            Crie QR Codes PIX e placas profissionais para impressão
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="qr-code" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="qr-code" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code PIX
              </TabsTrigger>
              <TabsTrigger value="plates" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Placas PIX
              </TabsTrigger>
            </TabsList>

            <TabsContent value="qr-code" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Section */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pix-key">
                      Chave Pix <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="pix-key"
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        placeholder="CPF, CNPJ, email, telefone ou chave aleatória"
                        className={`pr-20 ${
                          pixKey && isKeyValid === false 
                            ? 'border-red-500 focus:border-red-500' 
                            : pixKey && isKeyValid === true 
                            ? 'border-green-500 focus:border-green-500'
                            : ''
                        }`}
                      />
                      {pixKey && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                          {getKeyTypeIcon()}
                          {isKeyValid === true && <CheckCircle className="h-4 w-4 text-green-500" />}
                          {isKeyValid === false && <XCircle className="h-4 w-4 text-red-500" />}
                        </div>
                      )}
                    </div>
                    {pixKey && (
                      <div className="flex items-center gap-1 mt-1 text-xs">
                        {keyType && keyType !== 'invalid' && (
                          <span className="text-muted-foreground">
                            Detectado: <span className="font-medium">{getKeyTypeText()}</span>
                          </span>
                        )}
                        {isKeyValid === false && (
                          <span className="text-red-500 font-medium">
                            {keyType === 'invalid' ? 'Formato de chave não reconhecido' : 'Chave inválida'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="recipient-name">
                      Nome do beneficiário <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="recipient-name"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="Nome completo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="recipient-city">
                      Cidade do beneficiário <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="recipient-city"
                      value={recipientCity}
                      onChange={(e) => setRecipientCity(e.target.value)}
                      placeholder="Cidade"
                    />
                  </div>

                  <div>
                    <Label htmlFor="amount">
                      Valor <span className="text-sm text-muted-foreground">(opcional)</span>
                    </Label>
                    <Input
                      id="amount"
                      type="text"
                      value={displayAmount}
                      onChange={handleAmountChange}
                      placeholder="R$ 0,00"
                      className="text-right"
                    />
                  </div>

                  <div>
                    <Button 
                      type="button"
                      variant="ghost" 
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                      className="p-0 h-auto text-primary hover:text-primary/80"
                    >
                      {showMoreOptions ? '▼' : '▶'} Mostrar mais configurações
                    </Button>
                  </div>

                  {showMoreOptions && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Descrição do pagamento"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="txid">
                          Identificador da Transação (txid) 
                          <span className="text-sm text-muted-foreground">(opcional)</span>
                        </Label>
                        <Input
                          id="txid"
                          value={txId}
                          onChange={(e) => setTxId(e.target.value)}
                          placeholder="Deixe vazio para usar *** (padrão)"
                          maxLength={25}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Campo usado para identificar a transação. Se vazio, será usado "***"
                        </p>
                      </div>
                    </div>
                  )}

                  <div>
                    <Button 
                      type="button"
                      variant="ghost" 
                      onClick={() => setShowCustomization(!showCustomization)}
                      className="p-0 h-auto text-primary hover:text-primary/80"
                    >
                      {showCustomization ? '▼' : '▶'} Personalizar QR Code
                    </Button>
                  </div>

                  {showCustomization && (
                    <Card className="p-4 border">
                      <div className="space-y-4">
                        <div>
                          <Label>Tipo de Personalização</Label>
                          <Select 
                            value={customizationType} 
                            onValueChange={(value: CustomizationType) => setCustomizationType(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma opção" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Nenhuma</SelectItem>
                              <SelectItem value="logo">Logotipo</SelectItem>
                              <SelectItem value="text">Texto Personalizado</SelectItem>
                              <SelectItem value="icon">Ícone Pré-definido</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {customizationType !== 'none' && (
                          <div className="space-y-3">
                            <div>
                              <Label>Forma do Fundo</Label>
                              <Select 
                                value={backgroundShape} 
                                onValueChange={(value: 'circle' | 'square' | 'none') => setBackgroundShape(value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma forma" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="circle">Círculo</SelectItem>
                                  <SelectItem value="square">Quadrado</SelectItem>
                                  <SelectItem value="none">Nenhum (Sem fundo)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {backgroundShape !== 'none' && (
                              <div>
                                <Label htmlFor="background-color">Cor do Fundo</Label>
                                <div className="flex gap-2 items-center">
                                  <Input
                                    id="background-color"
                                    type="color"
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    className="w-12 h-8 p-1"
                                  />
                                  <Input
                                    value={backgroundColor}
                                    onChange={(e) => setBackgroundColor(e.target.value)}
                                    placeholder="#32BCAD"
                                    className="flex-1"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {customizationType === 'text' && (
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="custom-text">Texto no Centro (máx. 4 caracteres)</Label>
                              <Input
                                id="custom-text"
                                value={customText}
                                onChange={(e) => setCustomText(e.target.value.substring(0, 4))}
                                placeholder="PIX"
                                maxLength={4}
                              />
                            </div>
                            
                            <div>
                              <Label htmlFor="text-color">Cor do Texto</Label>
                              <div className="flex gap-2 items-center">
                                <Input
                                  id="text-color"
                                  type="color"
                                  value={textColor}
                                  onChange={(e) => setTextColor(e.target.value)}
                                  className="w-12 h-8 p-1"
                                />
                                <Input
                                  value={textColor}
                                  onChange={(e) => setTextColor(e.target.value)}
                                  placeholder="#FFFFFF"
                                  className="flex-1"
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {customizationType === 'icon' && (
                          <div>
                            <Label>Ícone Pré-definido</Label>
                            <div className="grid grid-cols-4 gap-2 mt-2">
                              {predefinedIcons.map((iconData) => {
                                const IconComponent = iconData.icon;
                                return (
                                  <Button
                                    key={iconData.id}
                                    variant={selectedIcon === iconData.id ? "default" : "outline"}
                                    onClick={() => setSelectedIcon(iconData.id)}
                                    className="flex flex-col gap-1 h-16 transition-all duration-200 hover:scale-105"
                                  >
                                    <IconComponent 
                                      className="h-5 w-5" 
                                      style={{ color: selectedIcon === iconData.id ? 'white' : iconData.color }}
                                    />
                                    <span className="text-xs">{iconData.name}</span>
                                  </Button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {customizationType === 'logo' && (
                          <div className="space-y-3">
                            <div>
                              <Label>Upload do Logotipo</Label>
                              <p className="text-xs text-muted-foreground mb-2">
                                💡 Envie um logo em formato <strong>PNG com fundo transparente</strong> para um melhor resultado.
                              </p>
                              {logoFile ? (
                                <div className="flex items-center gap-2 p-2 bg-secondary rounded-lg">
                                  <span className="flex-1 text-sm">{logoFile.name}</span>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setLogoFile(null);
                                      if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                      }
                                    }}
                                    className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                  >
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex gap-2">
                                  <Input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) setLogoFile(file);
                                    }}
                                    className="hidden"
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-1"
                                  >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Enviar Logotipo
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  )}

                  {qrCodeUrl && (
                    <div className="space-y-2">
                      <Button onClick={copyPixCode} variant="outline" className="w-full">
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Código PIX
                      </Button>
                      <Button onClick={downloadQRCode} variant="secondary" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar QR Code
                      </Button>
                    </div>
                  )}
                </div>

                {/* QR Code Preview */}
                <div className="flex flex-col items-center justify-center">
                  <canvas ref={canvasRef} className="hidden" />
                  {qrCodeUrl ? (
                    <div className="text-center space-y-4">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code PIX" 
                        className="max-w-full h-auto border border-border rounded-lg shadow-lg"
                      />
                      <div className="space-y-2">
                        <p className="font-semibold">{recipientName}</p>
                        <p className="text-sm text-muted-foreground">{recipientCity}</p>
                        {amount && (
                          <p className="text-lg font-bold text-green-600">
                            {displayAmount || `R$ ${parseFloat(amount).toFixed(2).replace('.', ',')}`}
                          </p>
                        )}
                        {description && (
                          <p className="text-sm text-muted-foreground">{description}</p>
                        )}
                        {customizationType !== 'none' && (
                          <p className="text-xs text-amber-600 font-medium">
                            ✨ QR Code personalizado (nível de correção H)
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground space-y-4">
                      <div className="w-64 h-64 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                        <div>
                          <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">Preencha os dados obrigatórios</p>
                          <p className="text-xs opacity-70">O QR Code será gerado automaticamente</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {pixCode && (
                <div className="mt-6 p-4 bg-muted/50 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Pix Copia e Cola</Label>
                    <Button 
                      onClick={copyPixCode} 
                      variant="outline" 
                      size="sm"
                      className="h-8"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar
                    </Button>
                  </div>
                  <Textarea
                    value={pixCode}
                    readOnly
                    className="font-mono text-xs bg-background"
                    rows={4}
                    onClick={(e) => e.currentTarget.select()}
                  />
                  <p className="text-xs text-muted-foreground">
                    Cole este código em qualquer app que aceite Pix via cópia e cola
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="plates" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Template Selection */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-base font-semibold mb-4 block flex items-center gap-2">
                      <Layout className="h-5 w-5" />
                      Galeria de Templates
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      {plateTemplates.map((template) => (
                        <Button
                          key={template.id}
                          variant={selectedTemplate === template.id ? "default" : "outline"}
                          onClick={() => setSelectedTemplate(template.id)}
                          className="h-auto p-3 flex flex-col items-start gap-2 text-left"
                        >
                          <div 
                            className="w-full h-16 rounded border-2"
                            style={{ 
                              backgroundColor: template.backgroundColor,
                              borderColor: template.accentColor 
                            }}
                          />
                          <div>
                            <div className="font-medium text-sm">{template.name}</div>
                            <div className="text-xs text-muted-foreground">{template.description}</div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {selectedTemplate === 'commercial' && (
                    <div>
                      <Label htmlFor="business-name">Nome do Negócio (opcional)</Label>
                      <Input
                        id="business-name"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Ex: Loja do João, @seunegocio"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Para template comercial. Se vazio, usará o nome do beneficiário.
                      </p>
                    </div>
                  )}

                  {platePreviewUrl && (
                    <div className="space-y-2">
                      <Button 
                        onClick={downloadPlate} 
                        className="w-full"
                        disabled={!platePreviewUrl}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Placa PIX (PNG)
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        <Sparkles className="h-3 w-3 inline mr-1" />
                        Placa em alta resolução para impressão
                      </p>
                    </div>
                  )}
                </div>

                {/* Plate Preview */}
                <div className="flex flex-col items-center justify-center">
                  <canvas ref={plateCanvasRef} className="hidden" />
                  {platePreviewUrl && qrCodeUrl ? (
                    <div className="text-center space-y-4">
                      <div className="border rounded-lg shadow-lg overflow-hidden bg-white max-w-sm">
                        <img 
                          src={platePreviewUrl} 
                          alt="Placa PIX" 
                          className="w-full h-auto"
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Template: {plateTemplates.find(t => t.id === selectedTemplate)?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          620x880px • Ideal para impressão
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground space-y-4">
                      <div className="w-64 h-80 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                        <div>
                          <Printer className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">Gere um QR Code primeiro</p>
                          <p className="text-xs opacity-70">A placa será criada automaticamente</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 p-4 bg-warning/10 border border-warning/20 rounded-lg dark:bg-warning/5 dark:border-warning/30">
            <h3 className="font-semibold mb-2 flex items-center gap-2 text-warning-foreground dark:text-warning">
              <Smartphone className="h-4 w-4" />
              Aviso Importante
            </h3>
            <p className="text-sm text-muted-foreground">
              Este gerador cria QR Codes PIX válidos seguindo as normas do Banco Central. 
              <strong> Sempre teste o QR Code com o aplicativo do seu banco</strong> antes de 
              compartilhar ou imprimir. A responsabilidade pela verificação das informações é do usuário.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}