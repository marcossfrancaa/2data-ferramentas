
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, Copy, QrCode, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LinkShortener = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [urlStats, setUrlStats] = useState<{
    clicks: string;
    created: string;
    expires: string;
  } | null>(null);
  const { toast } = useToast();

  const normalizeUrl = (url: string) => {
    // Remove espaços
    url = url.trim();
    
    // Se não tem protocolo, adiciona https://
    if (!url.match(/^https?:\/\//)) {
      // Se tem www, adiciona https://
      if (url.startsWith('www.')) {
        url = 'https://' + url;
      } else {
        // Se é só o domínio, adiciona https://www.
        url = 'https://www.' + url;
      }
    }
    
    return url;
  };

  const isValidUrl = (url: string) => {
    try {
      const normalizedUrl = normalizeUrl(url);
      new URL(normalizedUrl);
      return true;
    } catch {
      return false;
    }
  };

  const shortenUrl = async () => {
    if (!originalUrl.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL para encurtar",
        variant: "destructive",
      });
      return;
    }

    if (!isValidUrl(originalUrl)) {
      toast({
        title: "Erro",
        description: "Por favor, insira uma URL válida",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Normalizar a URL antes de enviar para a API
      const normalizedUrl = normalizeUrl(originalUrl);
      const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(normalizedUrl)}`);
      
      if (!response.ok) {
        throw new Error('Erro na API do TinyURL');
      }
      
      const shortenedUrl = await response.text();
      
      // Verificar se retornou uma URL válida
      if (!shortenedUrl || shortenedUrl.includes('Error') || !shortenedUrl.startsWith('http')) {
        throw new Error('URL inválida retornada pela API');
      }
      
      setShortenedUrl(shortenedUrl.trim());
      setUrlStats({
        clicks: 'N/A',
        created: new Date().toLocaleDateString('pt-BR'),
        expires: 'Permanente'
      });
      
      toast({
        title: "URL encurtada com sucesso!",
        description: "Sua URL está pronta para uso",
      });
    } catch (error) {
      toast({
        title: "Erro ao encurtar URL",
        description: "Não foi possível encurtar a URL. Tente novamente.",
        variant: "destructive",
      });
      console.error('Erro ao encurtar URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copiado!",
        description: "URL copiada para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a URL",
        variant: "destructive",
      });
    }
  };

  const generateQRCode = () => {
    if (!shortenedUrl) return;
    
    // Redirecionar para o gerador de QR Code com a URL encurtada
    toast({
      title: "Redirecionando",
      description: "Abrindo gerador de QR Code com sua URL",
    });
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank');
  };

  const clearAll = () => {
    setOriginalUrl('');
    setShortenedUrl('');
    setUrlStats(null);
  };


  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Link className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Encurtador de URL</h1>
        </div>
        <p className="text-muted-foreground">
          Transforme URLs longas em links curtos usando o TinyURL. Gratuito e sem limitações.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Encurtar URL
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="original-url">URL Original</Label>
              <Input
                id="original-url"
                type="text"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="exemplo.com ou https://exemplo.com"
                className="mt-1"
              />
            </div>


            <div className="flex gap-2">
              <Button 
                onClick={shortenUrl}
                disabled={!originalUrl.trim() || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Encurtando...
                  </>
                ) : (
                  <>
                    <Link className="w-4 h-4 mr-2" />
                    Encurtar URL
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={clearAll}>
                Limpar
              </Button>
            </div>

            {originalUrl && isValidUrl(originalUrl) && (
              <div className="text-xs text-muted-foreground">
                <strong>Preview:</strong> {normalizeUrl(originalUrl).substring(0, 50)}
                {normalizeUrl(originalUrl).length > 50 && '...'}
              </div>
            )}
          </div>
        </Card>

        {/* Result */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            URL Encurtada
          </h3>
          
          {shortenedUrl ? (
            <div className="space-y-4">
              {/* Shortened URL */}
              <div className="bg-muted/20 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">URL Encurtada</Label>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(shortenedUrl)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openUrl(shortenedUrl)}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="font-mono text-lg font-medium text-primary break-all">
                  {shortenedUrl}
                </div>
              </div>

              {/* Stats */}
              {urlStats && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-muted/20 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-primary">{urlStats.clicks}</div>
                    <div className="text-xs text-muted-foreground">Cliques</div>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3 text-center">
                    <div className="text-sm font-medium">{urlStats.created}</div>
                    <div className="text-xs text-muted-foreground">Criado</div>
                  </div>
                  <div className="bg-muted/20 rounded-lg p-3 text-center">
                    <div className="text-sm font-medium">{urlStats.expires}</div>
                    <div className="text-xs text-muted-foreground">Expira</div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div>
                <Button variant="outline" onClick={generateQRCode} className="w-full">
                  <QrCode className="w-4 h-4 mr-2" />
                  Gerar QR Code
                </Button>
              </div>

              {/* Comparison */}
              <div className="bg-accent/5 rounded-lg p-3 border">
                <div className="text-xs text-muted-foreground mb-2">Comparação:</div>
                <div className="space-y-1 text-xs">
                  <div>
                    <span className="text-muted-foreground">Original:</span> {normalizeUrl(originalUrl).length} caracteres
                  </div>
                  <div>
                    <span className="text-muted-foreground">Encurtada:</span> {shortenedUrl.length} caracteres
                  </div>
                  <div className="text-primary font-medium">
                    Economia: {normalizeUrl(originalUrl).length - shortenedUrl.length} caracteres
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-60 bg-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center">
                <Link className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Sua URL encurtada aparecerá aqui
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border">
        <div className="flex items-start gap-3">
          <Link className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Vantagens dos Links Curtos</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>Redes Sociais:</strong> Melhor aparência em posts e bio</li>
              <li>• <strong>Marketing:</strong> Facilita campanhas e rastreamento</li>
              <li>• <strong>Impressão:</strong> URLs curtas em materiais físicos</li>
              <li>• <strong>Gratuito:</strong> Serviço TinyURL sem limitações</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};
