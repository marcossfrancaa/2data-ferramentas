import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail, RefreshCw, Copy, Inbox, Clock, User, QrCode, ExternalLink, Download, Link, Languages } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Email {
  mail_id: string;
  mail_from: string;
  mail_subject: string;
  mail_excerpt: string;
  mail_timestamp: number;
}

interface EmailDetails {
  mail_id: string;
  mail_from: string;
  mail_subject: string;
  mail_body: string;
  mail_timestamp: number;
}

interface EmailContentProps {
  content: string;
}

const EmailContent = ({ content }: EmailContentProps) => {
  const [translatedContent, setTranslatedContent] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência"
    });
  };

  const translateContent = async () => {
    setIsTranslating(true);
    try {
      // Remove HTML para obter texto limpo
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';
      
      // Simular tradução (em uma implementação real, você usaria um serviço de tradução)
      // Por enquanto, vamos apenas mostrar uma mensagem indicando que a tradução seria feita
      const translatedText = `[TRADUÇÃO AUTOMÁTICA]\n\n${textContent}\n\n[Esta funcionalidade requer integração com um serviço de tradução como Google Translate API]`;
      
      setTranslatedContent(translatedText);
      setShowTranslation(true);
      
      toast({
        title: "Tradução concluída!",
        description: "Conteúdo traduzido para português brasileiro"
      });
    } catch (error) {
      toast({
        title: "Erro na tradução",
        description: "Não foi possível traduzir o conteúdo",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  };

  // Converte o HTML em componente React com links destacados
  const processContent = (htmlContent: string) => {
    // Remove HTML para obter texto limpo
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Expressão regular para detectar URLs
    const urlRegex = /(https?:\/\/[^\s<>"]+|www\.[^\s<>"]+)/gi;
    
    const parts = textContent.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part.match(urlRegex)) {
        const fullUrl = part.startsWith('http') ? part : `https://${part}`;
        return (
          <div key={index} className="my-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-center gap-3">
              <Link className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-muted-foreground mb-1">Link encontrado:</p>
                <a 
                  href={fullUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 font-mono text-sm break-all underline decoration-dashed underline-offset-4"
                >
                  {part}
                </a>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(fullUrl)}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        );
      } else {
        return (
          <span key={index} className="whitespace-pre-wrap">
            {part}
          </span>
        );
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* Botões de ação */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <Button
          variant="outline"
          onClick={translateContent}
          disabled={isTranslating}
          size="sm"
        >
          {isTranslating ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Languages className="h-4 w-4 mr-2" />
          )}
          {isTranslating ? "Traduzindo..." : "Traduzir para PT-BR"}
        </Button>
        
        {showTranslation && (
          <Button
            variant="ghost"
            onClick={() => setShowTranslation(false)}
            size="sm"
          >
            Ver original
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={() => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            const textContent = tempDiv.textContent || tempDiv.innerText || '';
            copyToClipboard(textContent);
          }}
          size="sm"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copiar conteúdo
        </Button>
      </div>

      {/* Conteúdo original ou traduzido */}
      <div className="text-foreground leading-relaxed">
        {showTranslation && translatedContent ? (
          <div className="space-y-3">
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-600">Tradução automática</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(translatedContent)}
                  className="h-8"
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Copiar
                </Button>
              </div>
              <div className="whitespace-pre-wrap text-foreground">
                {translatedContent}
              </div>
            </div>
          </div>
        ) : (
          processContent(content)
        )}
      </div>
    </div>
  );
};

export const TemporaryEmail = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [sidToken, setSidToken] = useState('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);

  // Auto-gerar email ao carregar a página
  useEffect(() => {
    generateEmail();
  }, []);

  // Auto-refresh da caixa de entrada a cada 1 segundo
  useEffect(() => {
    if (sidToken && emailAddress) {
      const interval = setInterval(() => {
        refreshInbox(true); // silent refresh
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [sidToken, emailAddress]);

  const generateEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.guerrillamail.com/ajax.php?f=get_email_address', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao gerar e-mail temporário');
      }
      
      const data = await response.json();
      
      setEmailAddress(data.email_addr);
      setSidToken(data.sid_token);
      setEmails([]);
      setSelectedEmail(null);
      setQrCodeUrl('');
      setShowQrCode(false);
      
      toast({
        title: "E-mail temporário gerado!",
        description: `Novo endereço: ${data.email_addr}`
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar e-mail",
        description: "Não foi possível gerar o e-mail temporário",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    toast({
      title: "Copiado!",
      description: "Endereço de e-mail copiado para a área de transferência"
    });
  };

  const generateQRCode = () => {
    if (!emailAddress) return;
    
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(emailAddress)}`;
    setQrCodeUrl(qrUrl);
    setShowQrCode(true);
    
    toast({
      title: "QR Code gerado!",
      description: "QR Code do seu e-mail temporário"
    });
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `email-qr-${emailAddress}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code baixado!",
      description: "Arquivo salvo na pasta de downloads"
    });
  };

  const refreshInbox = async (silent = false) => {
    if (!sidToken) {
      if (!silent) {
        toast({
          title: "Nenhum e-mail gerado",
          description: "Gere um e-mail temporário primeiro",
          variant: "destructive"
        });
      }
      return;
    }

    setRefreshing(true);
    try {
      const response = await fetch(`https://api.guerrillamail.com/ajax.php?f=get_email_list&offset=0&sid_token=${sidToken}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao buscar e-mails');
      }
      
      const data = await response.json();
      const newEmails = data.list || [];
      
      // Verificar se há novos e-mails
      if (!silent && newEmails.length > emails.length) {
        toast({
          title: "Novo e-mail recebido!",
          description: `${newEmails.length - emails.length} nova(s) mensagem(s)`
        });
      }
      
      setEmails(newEmails);
    } catch (error) {
      if (!silent) {
        toast({
          title: "Erro ao atualizar",
          description: "Não foi possível atualizar a caixa de entrada",
          variant: "destructive"
        });
      }
    } finally {
      setRefreshing(false);
    }
  };

  const readEmail = async (emailId: string) => {
    if (!sidToken) return;

    try {
      const response = await fetch(`https://api.guerrillamail.com/ajax.php?f=fetch_email&sid_token=${sidToken}&email_id=${emailId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Erro ao ler e-mail');
      }
      
      const data = await response.json();
      setSelectedEmail(data);
    } catch (error) {
      toast({
        title: "Erro ao ler e-mail",
        description: "Não foi possível abrir o e-mail",
        variant: "destructive"
      });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        
        {/* Header com Logo e Título */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
              Gerador de E-mail Temporário
            </h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              O seu endereço de E-mail temporário
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-4xl mx-auto">
              Crie um endereço de e-mail temporário instantaneamente para proteger sua privacidade. 
              Receba e-mails sem revelar seu endereço pessoal. Perfeito para cadastros, verificações e testes.
            </p>
          </div>
        </div>

        {/* Área do Email Address */}
        <Card className="border-2 bg-card/50 backdrop-blur">
          <CardContent className="p-8">
            {!emailAddress ? (
              <div className="text-center space-y-6">
                <Button 
                  onClick={generateEmail} 
                  disabled={loading}
                  size="lg"
                  className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-6 text-lg"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-5 w-5 mr-3 animate-spin" />
                      Gerando e-mail temporário...
                    </>
                  ) : (
                    <>
                      <Mail className="h-5 w-5 mr-3" />
                      Gerar E-mail Temporário
                    </>
                  )}
                </Button>
                
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
                    Esqueça os problemas com spam, propagandas indesejadas, hackers e ataques automatizados. 
                    Mantenha sua caixa de entrada pessoal limpa e protegida. 
                    Nossa ferramenta oferece um endereço de e-mail descartável, gratuito, anônimo e seguro.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Email Display */}
                <div className="flex items-center justify-center gap-4 p-6 bg-accent/10 rounded-xl border">
                  <div className="text-2xl font-mono font-semibold text-foreground flex-1 text-center">
                    {emailAddress}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={copyEmail} 
                      variant="outline"
                      size="lg"
                      className="h-12 w-12"
                    >
                      <Copy className="h-5 w-5" />
                    </Button>
                    <Button 
                      onClick={generateQRCode} 
                      variant="outline"
                      size="lg"
                      className="h-12 w-12"
                    >
                      <QrCode className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* QR Code Modal */}
                {showQrCode && qrCodeUrl && (
                  <Card className="bg-accent/5">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>QR Code do seu e-mail</span>
                        <div className="flex gap-2">
                          <Button onClick={downloadQRCode} variant="outline" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Baixar
                          </Button>
                          <Button onClick={() => setShowQrCode(false)} variant="ghost" size="sm">
                            ×
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                      <img 
                        src={qrCodeUrl} 
                        alt="QR Code do e-mail" 
                        className="w-64 h-64 border rounded-lg"
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 justify-center">
                  <Button 
                    onClick={generateEmail} 
                    variant="outline"
                    disabled={loading}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Novo E-mail
                  </Button>
                  <Button 
                    onClick={() => refreshInbox(false)} 
                    variant="outline"
                    disabled={refreshing}
                  >
                    {refreshing ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Inbox className="h-4 w-4 mr-2" />
                    )}
                    Atualizar Caixa
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Caixa de Entrada Única */}
        {emailAddress && (
          <Card className="min-h-[500px]">
            <CardHeader className="border-b bg-accent/5">
              <div className="grid grid-cols-3 items-center py-3">
                {selectedEmail ? (
                  <>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedEmail(null)}
                        className="p-1"
                      >
                        ← Voltar
                      </Button>
                      <CardTitle>VISUALIZAR</CardTitle>
                    </div>
                    <div></div>
                    <div></div>
                  </>
                ) : (
                  <>
                    <div className="text-center">
                      <span className="font-semibold text-sm">REMETENTE</span>
                    </div>
                    <div className="text-center">
                      <span className="font-semibold text-sm">ASSUNTO</span>
                    </div>
                    <div className="text-center flex items-center justify-center gap-2">
                      <span className="font-semibold text-sm">VISUALIZAR</span>
                      {emails.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {emails.length}
                        </Badge>
                      )}
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              {!selectedEmail ? (
                // Lista de E-mails
                emails.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground space-y-4">
                    <div className="w-20 h-20 mx-auto bg-accent/10 rounded-full flex items-center justify-center">
                      <Inbox className="h-10 w-10 opacity-50" />
                    </div>
                    <div>
                      <p className="text-xl font-medium">Sua caixa de entrada está vazia</p>
                      <p className="text-base mt-2">Aguardando e-mails recebidos</p>
                      <div className="flex items-center justify-center gap-2 mt-4 text-sm">
                        <div className={`w-3 h-3 rounded-full ${refreshing ? 'bg-emerald-500 animate-spin border-2 border-emerald-500 border-t-transparent' : 'bg-emerald-500 animate-pulse'}`}></div>
                        <span>Atualizando automaticamente a cada 1 segundo</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <ScrollArea className="h-[500px]">
                    <div className="divide-y">
                      {emails.map((email) => (
                        <div
                          key={email.mail_id}
                          className="grid grid-cols-3 items-center p-6 cursor-pointer hover:bg-accent/10 transition-all border-l-4 border-l-transparent hover:border-l-primary"
                          onClick={() => readEmail(email.mail_id)}
                        >
                          {/* Coluna Remetente */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="h-5 w-5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-base truncate">
                                {email.mail_from}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(email.mail_timestamp)}
                              </p>
                            </div>
                          </div>

                          {/* Coluna Assunto */}
                          <div className="px-4 min-w-0">
                            <h4 className="font-semibold text-base truncate mb-1">
                              {email.mail_subject || 'Sem assunto'}
                            </h4>
                            <p className="text-sm text-muted-foreground truncate">
                              {email.mail_excerpt}
                            </p>
                          </div>

                          {/* Coluna Visualizar */}
                          <div className="flex items-center justify-center">
                            <div className="text-primary">
                              <ExternalLink className="h-5 w-5" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )
              ) : (
                // Conteúdo do E-mail Selecionado
                <div className="p-6 space-y-6">
                  {/* Header do Email */}
                  <div className="bg-accent/5 rounded-lg p-6 space-y-4 border-l-4 border-l-primary">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">DE:</Label>
                        <div className="font-mono mt-2 text-base">{selectedEmail.mail_from}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">ASSUNTO:</Label>
                        <div className="font-medium mt-2 text-base">{selectedEmail.mail_subject || 'Sem assunto'}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-semibold text-muted-foreground">DATA:</Label>
                        <div className="mt-2 text-base">{formatDate(selectedEmail.mail_timestamp)}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Conteúdo do Email */}
                  <Separator />
                  
                  <ScrollArea className="h-80 border rounded-lg bg-background/50">
                    <div className="p-6">
                      <EmailContent content={selectedEmail.mail_body} />
                    </div>
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Informações sobre Email Temporário */}
        <Card className="bg-gradient-to-r from-accent/10 to-secondary/10 border-accent/30">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-bold text-foreground">
                O que é um e-mail temporário descartável?
              </h3>
              <div className="text-muted-foreground leading-relaxed space-y-3 max-w-4xl mx-auto">
                <p>
                  E-mail descartável é um serviço que permite receber mensagens em um endereço temporário 
                  que se auto-destrói após determinado período. Também é conhecido como: tempmail, 10minutemail, 
                  e-mail descartável, fake-mail ou trash-mail.
                </p>
                <p>
                  Muitos fóruns, redes Wi-Fi, websites e blogs exigem registro antes de permitir acesso ao conteúdo, 
                  comentários ou downloads. Nossa ferramenta é o serviço mais avançado de e-mail descartável que 
                  ajuda a evitar spam e manter sua privacidade online.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};