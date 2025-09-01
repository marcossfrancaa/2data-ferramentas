import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Mail, Copy, Eye, Palette, User } from 'lucide-react';
import { toast } from 'sonner';

export const EmailSignatureGenerator = () => {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    company: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    linkedIn: '',
    twitter: '',
    instagram: ''
  });

  const [design, setDesign] = useState({
    template: 'modern',
    primaryColor: '#3B82F6',
    fontSize: 'medium',
    includePhoto: false,
    includeSocial: true,
    includeAddress: false
  });

  const [signature, setSignature] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const templates = [
    { value: 'modern', label: 'Moderno', description: 'Clean e minimalista' },
    { value: 'classic', label: 'Clássico', description: 'Tradicional e formal' },
    { value: 'creative', label: 'Criativo', description: 'Colorido e dinâmico' },
    { value: 'compact', label: 'Compacto', description: 'Conciso e direto' }
  ];

  const fontSizes = [
    { value: 'small', label: 'Pequena', size: '12px' },
    { value: 'medium', label: 'Média', size: '14px' },
    { value: 'large', label: 'Grande', size: '16px' }
  ];

  const generateSignature = () => {
    if (!formData.name || !formData.email) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    let html = '';
    const fontSize = fontSizes.find(f => f.value === design.fontSize)?.size || '14px';

    switch (design.template) {
      case 'modern':
        html = generateModernTemplate();
        break;
      case 'classic':
        html = generateClassicTemplate();
        break;
      case 'creative':
        html = generateCreativeTemplate();
        break;
      case 'compact':
        html = generateCompactTemplate();
        break;
      default:
        html = generateModernTemplate();
    }

    setSignature(html);
    setShowPreview(true);
    toast.success('Assinatura gerada!');
  };

  const generateModernTemplate = () => {
    const fontSize = fontSizes.find(f => f.value === design.fontSize)?.size || '14px';
    
    return `
<table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; font-size: ${fontSize}; line-height: 1.4; color: #333;">
  <tr>
    <td style="padding-right: 20px; vertical-align: top; border-right: 3px solid ${design.primaryColor}; padding-right: 15px;">
      <div style="font-weight: bold; font-size: ${design.fontSize === 'large' ? '18px' : '16px'}; color: ${design.primaryColor};">${formData.name}</div>
      ${formData.title ? `<div style="color: #666; margin-top: 2px;">${formData.title}</div>` : ''}
      ${formData.company ? `<div style="font-weight: 500; margin-top: 5px;">${formData.company}</div>` : ''}
    </td>
    <td style="padding-left: 15px; vertical-align: top;">
      <div>
        ${formData.email ? `<div><a href="mailto:${formData.email}" style="color: ${design.primaryColor}; text-decoration: none;">${formData.email}</a></div>` : ''}
        ${formData.phone ? `<div style="margin-top: 3px;">📞 ${formData.phone}</div>` : ''}
        ${formData.website ? `<div style="margin-top: 3px;"><a href="${formData.website}" style="color: ${design.primaryColor}; text-decoration: none;">🌐 ${formData.website}</a></div>` : ''}
        ${design.includeAddress && formData.address ? `<div style="margin-top: 3px; color: #666;">📍 ${formData.address}</div>` : ''}
      </div>
      ${design.includeSocial ? generateSocialLinks() : ''}
    </td>
  </tr>
</table>`;
  };

  const generateClassicTemplate = () => {
    const fontSize = fontSizes.find(f => f.value === design.fontSize)?.size || '14px';
    
    return `
<div style="font-family: 'Times New Roman', serif; font-size: ${fontSize}; line-height: 1.5; color: #000;">
  <div style="font-weight: bold; font-size: ${design.fontSize === 'large' ? '18px' : '16px'};">${formData.name}</div>
  ${formData.title ? `<div>${formData.title}</div>` : ''}
  ${formData.company ? `<div style="font-weight: bold; margin-top: 5px;">${formData.company}</div>` : ''}
  <div style="margin-top: 10px; border-top: 1px solid #ccc; padding-top: 8px;">
    ${formData.email ? `<div>Email: <a href="mailto:${formData.email}" style="color: #000;">${formData.email}</a></div>` : ''}
    ${formData.phone ? `<div>Tel: ${formData.phone}</div>` : ''}
    ${formData.website ? `<div>Web: <a href="${formData.website}" style="color: #000;">${formData.website}</a></div>` : ''}
    ${design.includeAddress && formData.address ? `<div>Endereço: ${formData.address}</div>` : ''}
  </div>
  ${design.includeSocial ? generateSocialLinks() : ''}
</div>`;
  };

  const generateCreativeTemplate = () => {
    const fontSize = fontSizes.find(f => f.value === design.fontSize)?.size || '14px';
    
    return `
<table cellpadding="0" cellspacing="0" style="font-family: 'Helvetica', sans-serif; font-size: ${fontSize}; background: linear-gradient(135deg, ${design.primaryColor}20 0%, transparent 100%); padding: 15px; border-radius: 8px;">
  <tr>
    <td>
      <div style="font-weight: bold; font-size: ${design.fontSize === 'large' ? '20px' : '18px'}; color: ${design.primaryColor}; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">${formData.name}</div>
      ${formData.title ? `<div style="color: #555; margin-top: 5px; font-style: italic;">${formData.title}</div>` : ''}
      ${formData.company ? `<div style="font-weight: bold; margin-top: 8px; color: #333;">${formData.company}</div>` : ''}
      <div style="margin-top: 12px;">
        ${formData.email ? `<div style="margin-bottom: 5px;">✉️ <a href="mailto:${formData.email}" style="color: ${design.primaryColor}; text-decoration: none; font-weight: 500;">${formData.email}</a></div>` : ''}
        ${formData.phone ? `<div style="margin-bottom: 5px;">📱 <span style="color: #333;">${formData.phone}</span></div>` : ''}
        ${formData.website ? `<div style="margin-bottom: 5px;">🌍 <a href="${formData.website}" style="color: ${design.primaryColor}; text-decoration: none; font-weight: 500;">${formData.website}</a></div>` : ''}
        ${design.includeAddress && formData.address ? `<div style="color: #666;">📍 ${formData.address}</div>` : ''}
      </div>
      ${design.includeSocial ? generateSocialLinks() : ''}
    </td>
  </tr>
</table>`;
  };

  const generateCompactTemplate = () => {
    const fontSize = fontSizes.find(f => f.value === design.fontSize)?.size || '14px';
    
    return `
<div style="font-family: Arial, sans-serif; font-size: ${fontSize}; line-height: 1.3;">
  <strong style="color: ${design.primaryColor};">${formData.name}</strong>${formData.title ? ` | ${formData.title}` : ''}${formData.company ? ` | ${formData.company}` : ''}
  <br>
  ${[
    formData.email ? `<a href="mailto:${formData.email}" style="color: ${design.primaryColor};">${formData.email}</a>` : '',
    formData.phone ? `${formData.phone}` : '',
    formData.website ? `<a href="${formData.website}" style="color: ${design.primaryColor};">${formData.website}</a>` : ''
  ].filter(Boolean).join(' | ')}
  ${design.includeSocial ? `<br>${generateSocialLinks()}` : ''}
</div>`;
  };

  const generateSocialLinks = () => {
    const links = [];
    if (formData.linkedIn) links.push(`<a href="${formData.linkedIn}" style="color: #0077B5; text-decoration: none; margin-right: 10px;">LinkedIn</a>`);
    if (formData.twitter) links.push(`<a href="${formData.twitter}" style="color: #1DA1F2; text-decoration: none; margin-right: 10px;">Twitter</a>`);
    if (formData.instagram) links.push(`<a href="${formData.instagram}" style="color: #E4405F; text-decoration: none; margin-right: 10px;">Instagram</a>`);
    
    return links.length > 0 ? `<div style="margin-top: 10px;">${links.join('')}</div>` : '';
  };

  const copySignature = () => {
    navigator.clipboard.writeText(signature);
    toast.success('Assinatura copiada para área de transferência!');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDesignChange = (field: string, value: any) => {
    setDesign(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Gerador de Assinatura de Email
          </CardTitle>
          <CardDescription>
            Crie assinaturas profissionais e personalizadas para seus emails
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Informações Pessoais
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="João Silva"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Cargo</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Desenvolvedor"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company">Empresa</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    placeholder="Tech Solutions Ltda"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="joao@empresa.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://meusite.com"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="São Paulo, SP, Brasil"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Design e Personalização
                </h3>

                <div>
                  <Label htmlFor="template">Template:</Label>
                  <Select value={design.template} onValueChange={(value) => handleDesignChange('template', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.value} value={template.value}>
                          <div>
                            <div className="font-medium">{template.label}</div>
                            <div className="text-xs text-muted-foreground">{template.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primary-color">Cor primária:</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary-color"
                        type="color"
                        value={design.primaryColor}
                        onChange={(e) => handleDesignChange('primaryColor', e.target.value)}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        type="text"
                        value={design.primaryColor}
                        onChange={(e) => handleDesignChange('primaryColor', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="font-size">Tamanho da fonte:</Label>
                    <Select value={design.fontSize} onValueChange={(value) => handleDesignChange('fontSize', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fontSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label} ({size.size})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-social">Incluir redes sociais</Label>
                    <Switch
                      id="include-social"
                      checked={design.includeSocial}
                      onCheckedChange={(checked) => handleDesignChange('includeSocial', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-address">Incluir endereço</Label>
                    <Switch
                      id="include-address"
                      checked={design.includeAddress}
                      onCheckedChange={(checked) => handleDesignChange('includeAddress', checked)}
                    />
                  </div>
                </div>

                {design.includeSocial && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Redes Sociais (URLs completas):</Label>
                    <Input
                      placeholder="LinkedIn URL"
                      value={formData.linkedIn}
                      onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                    />
                    <Input
                      placeholder="Twitter URL"
                      value={formData.twitter}
                      onChange={(e) => handleInputChange('twitter', e.target.value)}
                    />
                    <Input
                      placeholder="Instagram URL"
                      value={formData.instagram}
                      onChange={(e) => handleInputChange('instagram', e.target.value)}
                    />
                  </div>
                )}
              </div>

              <Button onClick={generateSignature} className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                Gerar Assinatura
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Preview da Assinatura:</Label>
                {signature && (
                  <Button variant="outline" onClick={copySignature}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar HTML
                  </Button>
                )}
              </div>
              
              <div className="border rounded-lg p-4 min-h-[400px] bg-secondary/20">
                {showPreview && signature ? (
                  <div className="space-y-4">
                    <div 
                      className="bg-white p-4 rounded border"
                      dangerouslySetInnerHTML={{ __html: signature }}
                    />
                    <div className="p-4 bg-secondary/50 rounded">
                      <Label className="text-xs font-medium text-muted-foreground">Código HTML:</Label>
                      <pre className="text-xs mt-2 overflow-auto max-h-32 bg-background p-2 rounded">
                        <code>{signature}</code>
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-center">
                    <div>
                      <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Preencha suas informações e clique em "Gerar Assinatura" para ver o preview
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};