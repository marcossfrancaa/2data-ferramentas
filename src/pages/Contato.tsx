import { ModernHeader } from '@/components/ModernHeader';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, MessageSquare, Bug, Lightbulb, Github, ExternalLink, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Contato = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Criar mailto com os dados do formulário
    const subject = encodeURIComponent(`[2Data Brasil] ${formData.subject}`);
    const body = encodeURIComponent(
      `Nome: ${formData.name}\nEmail: ${formData.email}\n\nMensagem:\n${formData.message}`
    );
    const mailtoUrl = `mailto:contato@2databrasil.com?subject=${subject}&body=${body}`;
    
    window.open(mailtoUrl, '_blank');
    
    toast({
      title: "Cliente de email aberto",
      description: "Seu cliente de email padrão foi aberto com a mensagem preenchida.",
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <ModernHeader onSearch={() => {}} onToolSelect={() => {}} />
      
      <main className="container-responsive spacing-lg">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Início
          </Button>
        </div>

        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <h1 className="title-h1">
            Entre em Contato
          </h1>
          <p className="text-responsive-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Tem alguma dúvida, sugestão ou encontrou um bug? Adoramos ouvir 
            da nossa comunidade!
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-10 md:mb-12">
          <Card className="spacing-md">
            <Bug className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-destructive mb-3 sm:mb-4" />
            <h3 className="text-responsive-lg font-semibold mb-2">Reportar Bug</h3>
            <p className="text-responsive-xs text-muted-foreground">
              Encontrou algum problema? Nos ajude a melhorar reportando bugs 
              ou comportamentos inesperados.
            </p>
          </Card>

          <Card className="spacing-md">
            <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-warning mb-3 sm:mb-4" />
            <h3 className="text-responsive-lg font-semibold mb-2">Sugerir Ferramenta</h3>
            <p className="text-responsive-xs text-muted-foreground">
              Tem uma ideia para uma nova ferramenta? Compartilhe sua sugestão 
              e ajude a expandir nossa plataforma.
            </p>
          </Card>

          <Card className="spacing-md lg:col-span-3 sm:col-span-2">
            <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary mb-3 sm:mb-4" />
            <h3 className="text-responsive-lg font-semibold mb-2">Feedback Geral</h3>
            <p className="text-responsive-xs text-muted-foreground">
              Sua opinião é importante! Compartilhe feedback sobre a experiência, 
              melhorias ou qualquer comentário.
            </p>
          </Card>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
          <Card className="spacing-lg">
            <div className="flex items-center mb-4 sm:mb-6">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary mr-2 sm:mr-3" />
              <h2 className="title-h3">Envie uma Mensagem</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="seu.email@exemplo.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Resumo do que você gostaria de falar"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Descreva sua mensagem, bug, sugestão ou feedback em detalhes..."
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Enviar Mensagem
              </Button>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="spacing-md">
              <h3 className="title-h4 mb-3 sm:mb-4">Outras Formas de Contato</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary mr-2 sm:mr-3" />
                  <div>
                    <p className="font-medium">Email Direto</p>
                    <a 
                      href="mailto:contato@2databrasil.com" 
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      contato@2databrasil.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <Github className="w-4 h-4 sm:w-5 sm:h-5 text-foreground mr-2 sm:mr-3" />
                  <div>
                    <p className="font-medium">GitHub</p>
                    <a 
                      href="#" 
                      className="text-sm text-muted-foreground hover:text-primary inline-flex items-center"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Contribua no projeto <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="spacing-md">
              <h3 className="title-h4 mb-3 sm:mb-4">Tempo de Resposta</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bugs críticos:</span>
                  <span className="font-medium text-destructive">24h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dúvidas técnicas:</span>
                  <span className="font-medium text-warning">2-3 dias</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sugestões:</span>
                  <span className="font-medium text-primary">1 semana</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Feedback geral:</span>
                  <span className="font-medium text-success">1 semana</span>
                </div>
              </div>
            </Card>

            <Card className="spacing-md">
              <h3 className="title-h4 mb-3 sm:mb-4">Dicas para um Bom Contato</h3>
              <ul className="text-responsive-xs text-muted-foreground space-y-2">
                <li>• Seja específico sobre o problema ou sugestão</li>
                <li>• Para bugs, inclua passos para reproduzir</li>
                <li>• Mencione o navegador e sistema operacional</li>
                <li>• Screenshots podem ajudar muito!</li>
                <li>• Seja respeitoso - somos uma comunidade 😊</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contato;