import { ModernHeader } from '@/components/ModernHeader';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Code, Users, Zap, Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sobre = () => {
  const navigate = useNavigate();

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
            Sobre o 2Data Brasil
          </h1>
          <p className="text-responsive-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Uma plataforma gratuita de ferramentas para desenvolvedores brasileiros, 
            criada com o objetivo de facilitar o desenvolvimento web.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 mb-8 sm:mb-10 md:mb-12">
          <Card className="spacing-md">
            <div className="flex items-center mb-3 sm:mb-4">
              <Code className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary mr-2 sm:mr-3" />
              <h2 className="title-h4">Nossa Missão</h2>
            </div>
            <p className="text-responsive-sm text-muted-foreground">
              Oferecer ferramentas de desenvolvimento gratuitas e de alta qualidade 
              para a comunidade brasileira de desenvolvedores, eliminando barreiras 
              e facilitando o acesso a recursos essenciais.
            </p>
          </Card>

          <Card className="spacing-md">
            <div className="flex items-center mb-3 sm:mb-4">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-secondary mr-2 sm:mr-3" />
              <h2 className="title-h4">Comunidade</h2>
            </div>
            <p className="text-responsive-sm text-muted-foreground">
              Construído pela comunidade, para a comunidade. Todas as nossas 
              ferramentas são open source e desenvolvidas com foco nas necessidades 
              específicas do mercado brasileiro.
            </p>
          </Card>

          <Card className="spacing-md">
            <div className="flex items-center mb-3 sm:mb-4">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-accent mr-2 sm:mr-3" />
              <h2 className="title-h4">Performance</h2>
            </div>
            <p className="text-responsive-sm text-muted-foreground">
              Desenvolvido com as tecnologias mais modernas (React, TypeScript, 
              Tailwind CSS) para garantir uma experiência rápida e responsiva 
              em todos os dispositivos.
            </p>
          </Card>

          <Card className="spacing-md">
            <div className="flex items-center mb-3 sm:mb-4">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-destructive mr-2 sm:mr-3" />
              <h2 className="title-h4">Sempre Gratuito</h2>
            </div>
            <p className="text-responsive-sm text-muted-foreground">
              Nosso compromisso é manter todas as ferramentas completamente 
              gratuitas. Acreditamos que o acesso a boas ferramentas não deve 
              ser um privilégio.
            </p>
          </Card>
        </div>

        <Card className="spacing-lg text-center">
          <h2 className="title-h2">Por que 2Data Brasil?</h2>
          <p className="text-responsive-lg text-muted-foreground mb-4 sm:mb-6 px-4">
            Criamos esta plataforma porque entendemos as necessidades específicas 
            dos desenvolvedores brasileiros. Desde validação de CPF/CNPJ até consulta 
            de CEP, oferecemos ferramentas que realmente fazem sentido no nosso contexto.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">✨ +50 Ferramentas</span>
            <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full">🇧🇷 Foco no Brasil</span>
            <span className="bg-accent/10 text-accent px-3 py-1 rounded-full">🆓 100% Gratuito</span>
            <span className="bg-success/10 text-success px-3 py-1 rounded-full">⚡ Open Source</span>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Sobre;