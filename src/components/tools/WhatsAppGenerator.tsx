
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Copy, MessageCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const WhatsAppGenerator = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const { toast } = useToast();

  const generateWhatsAppLink = () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Erro",
        description: "Digite um número de telefone",
        variant: "destructive",
      });
      return;
    }

    // Remove caracteres não numéricos
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Constrói a URL do WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}${message ? `?text=${encodedMessage}` : ''}`;
    
    setWhatsappUrl(url);
    
    toast({
      title: "Link gerado!",
      description: "Link do WhatsApp criado com sucesso",
    });
  };

  const copyToClipboard = async () => {
    if (!whatsappUrl) return;
    
    try {
      await navigator.clipboard.writeText(whatsappUrl);
      toast({
        title: "Copiado!",
        description: "Link copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o link",
        variant: "destructive",
      });
    }
  };

  const openWhatsApp = () => {
    if (!whatsappUrl) return;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <MessageCircle className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador Link WhatsApp</h1>
        </div>
        <p className="text-muted-foreground">
          Gere links diretos para WhatsApp com número e mensagem pré-definidos. 
          Ideal para atendimento ao cliente e marketing digital.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Dados do WhatsApp
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="phone">Número do WhatsApp</Label>
              <Input
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="5511999999999 (com código do país)"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Digite o número com código do país (ex: 5511999999999)
              </p>
            </div>

            <div>
              <Label htmlFor="message">Mensagem (opcional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite a mensagem que aparecerá no WhatsApp..."
                className="mt-1 min-h-32"
              />
            </div>

            <Button
              onClick={generateWhatsAppLink}
              disabled={!phoneNumber.trim()}
              className="w-full"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Gerar Link
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Link Gerado
          </h3>
          
          {whatsappUrl ? (
            <div className="space-y-4">
              <div>
                <Label>Link do WhatsApp</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={whatsappUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={openWhatsApp}
                  className="flex-1"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Abrir WhatsApp
                </Button>
              </div>

              <div className="p-4 bg-accent/10 rounded-lg">
                <h4 className="font-medium mb-2">Prévia:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div><strong>Número:</strong> {phoneNumber}</div>
                  {message && <div><strong>Mensagem:</strong> {message}</div>}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Link do WhatsApp aparecerá aqui</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
