import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Copy, Code, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MetaTagData {
  title: string;
  description: string;
  keywords: string;
  author: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export const MetaTagGenerator = () => {
  const [formData, setFormData] = useState<MetaTagData>({
    title: '',
    description: '',
    keywords: '',
    author: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    ogUrl: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: ''
  });
  
  const [generatedTags, setGeneratedTags] = useState('');
  const { toast } = useToast();

  const handleInputChange = (field: keyof MetaTagData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateMetaTags = () => {
    const tags = [];
    
    // Basic Meta Tags
    if (formData.title) {
      tags.push(`<title>${formData.title}</title>`);
      tags.push(`<meta name="title" content="${formData.title}">`);
    }
    
    if (formData.description) {
      tags.push(`<meta name="description" content="${formData.description}">`);
    }
    
    if (formData.keywords) {
      tags.push(`<meta name="keywords" content="${formData.keywords}">`);
    }
    
    if (formData.author) {
      tags.push(`<meta name="author" content="${formData.author}">`);
    }
    
    // Essential Meta Tags
    tags.push(`<meta charset="UTF-8">`);
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    tags.push(`<meta http-equiv="X-UA-Compatible" content="ie=edge">`);
    
    // Open Graph Tags
    if (formData.ogTitle || formData.title) {
      tags.push(`<meta property="og:title" content="${formData.ogTitle || formData.title}">`);
    }
    
    if (formData.ogDescription || formData.description) {
      tags.push(`<meta property="og:description" content="${formData.ogDescription || formData.description}">`);
    }
    
    if (formData.ogImage) {
      tags.push(`<meta property="og:image" content="${formData.ogImage}">`);
    }
    
    if (formData.ogUrl) {
      tags.push(`<meta property="og:url" content="${formData.ogUrl}">`);
    }
    
    tags.push(`<meta property="og:type" content="website">`);
    
    // Twitter Cards
    tags.push(`<meta name="twitter:card" content="summary_large_image">`);
    
    if (formData.twitterTitle || formData.title) {
      tags.push(`<meta name="twitter:title" content="${formData.twitterTitle || formData.title}">`);
    }
    
    if (formData.twitterDescription || formData.description) {
      tags.push(`<meta name="twitter:description" content="${formData.twitterDescription || formData.description}">`);
    }
    
    if (formData.twitterImage || formData.ogImage) {
      tags.push(`<meta name="twitter:image" content="${formData.twitterImage || formData.ogImage}">`);
    }
    
    const generatedHTML = tags.join('\n');
    setGeneratedTags(generatedHTML);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedTags);
    toast({
      title: "Copiado!",
      description: "Meta tags copiadas para a área de transferência.",
    });
  };

  const fillExample = () => {
    setFormData({
      title: 'Meu Site Incrível - Página Inicial',
      description: 'Descubra o melhor conteúdo sobre tecnologia, design e desenvolvimento web. Aprenda com nossos tutoriais e artigos especializados.',
      keywords: 'tecnologia, web development, design, tutoriais, programação',
      author: 'João Silva',
      ogTitle: 'Meu Site Incrível - A melhor plataforma de aprendizado',
      ogDescription: 'Junte-se a milhares de desenvolvedores que já transformaram suas carreiras conosco.',
      ogImage: 'https://meusite.com/imagem-social.jpg',
      ogUrl: 'https://meusite.com',
      twitterTitle: 'Meu Site Incrível - Transforme sua carreira',
      twitterDescription: 'A plataforma que mais cresce no Brasil para desenvolvedores.',
      twitterImage: 'https://meusite.com/imagem-twitter.jpg'
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Code className="w-6 h-6" />
            Gerador de Meta Tags
          </CardTitle>
          <CardDescription className="text-center">
            Gere meta tags completas para melhorar o SEO e compartilhamento social do seu site
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <Button onClick={fillExample} variant="outline" className="mb-4">
              <Globe className="w-4 h-4 mr-2" />
              Preencher com Exemplo
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Básicas</h3>
              
              <div>
                <Label htmlFor="title">Meta Tag - Title</Label>
                <Input
                  id="title"
                  placeholder="Título da página (recomendado até 60 caracteres)"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Meta Tag - Description</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição da página (recomendado até 160 caracteres)"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="keywords">Meta Tag - Keywords</Label>
                <Input
                  id="keywords"
                  placeholder="palavras-chave, separadas, por vírgula"
                  value={formData.keywords}
                  onChange={(e) => handleInputChange('keywords', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="author">Meta Tag - Author</Label>
                <Input
                  id="author"
                  placeholder="Nome do autor ou empresa"
                  value={formData.author}
                  onChange={(e) => handleInputChange('author', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Open Graph (Facebook)</h3>
              
              <div>
                <Label htmlFor="ogTitle">OG Title</Label>
                <Input
                  id="ogTitle"
                  placeholder="Título para compartilhamento no Facebook"
                  value={formData.ogTitle}
                  onChange={(e) => handleInputChange('ogTitle', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="ogDescription">OG Description</Label>
                <Textarea
                  id="ogDescription"
                  placeholder="Descrição para compartilhamento no Facebook"
                  value={formData.ogDescription}
                  onChange={(e) => handleInputChange('ogDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="ogImage">OG Image</Label>
                <Input
                  id="ogImage"
                  placeholder="URL da imagem para Facebook (1200x630px recomendado)"
                  value={formData.ogImage}
                  onChange={(e) => handleInputChange('ogImage', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="ogUrl">OG URL</Label>
                <Input
                  id="ogUrl"
                  placeholder="URL canônica da página"
                  value={formData.ogUrl}
                  onChange={(e) => handleInputChange('ogUrl', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 lg:col-span-2">
              <h3 className="text-lg font-semibold">Twitter Cards</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="twitterTitle">Twitter Title</Label>
                  <Input
                    id="twitterTitle"
                    placeholder="Título para Twitter"
                    value={formData.twitterTitle}
                    onChange={(e) => handleInputChange('twitterTitle', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="twitterDescription">Twitter Description</Label>
                  <Input
                    id="twitterDescription"
                    placeholder="Descrição para Twitter"
                    value={formData.twitterDescription}
                    onChange={(e) => handleInputChange('twitterDescription', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="twitterImage">Twitter Image</Label>
                  <Input
                    id="twitterImage"
                    placeholder="URL da imagem para Twitter"
                    value={formData.twitterImage}
                    onChange={(e) => handleInputChange('twitterImage', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button 
              onClick={generateMetaTags}
              className="bg-gradient-primary hover:bg-gradient-primary/90 text-white px-8 py-2"
            >
              <Code className="w-4 h-4 mr-2" />
              Gerar Meta Tags
            </Button>
          </div>

          {generatedTags && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-medium">Meta Tags Geradas:</Label>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
              </div>
              <div className="relative">
                <Textarea
                  value={generatedTags}
                  readOnly
                  className="min-h-[300px] bg-green-50 border-green-200 text-green-800 font-mono text-sm"
                />
              </div>
            </div>
          )}

          <Separator />

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Dicas para Meta Tags:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Title: Máximo 60 caracteres para aparecer completo no Google</li>
              <li>Description: Máximo 160 caracteres para melhor visualização</li>
              <li>OG Image: Tamanho recomendado 1200x630px para melhor qualidade</li>
              <li>Keywords: Use palavras-chave relevantes separadas por vírgula</li>
              <li>Teste sempre como ficará o compartilhamento nas redes sociais</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};