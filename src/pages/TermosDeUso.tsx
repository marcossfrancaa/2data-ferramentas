import { ModernHeader } from '@/components/ModernHeader';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const TermosDeUso = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Termos de Uso - 2Data Brasil</title>
      </Helmet>
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
            Termos de Uso
          </h1>
          <p className="text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <Card className="spacing-lg space-y-6 sm:space-y-8">
          <section>
            <h2 className="title-h3 mb-3 sm:mb-4">1. Aceitação dos Termos</h2>
            <p className="text-responsive-sm text-muted-foreground">
              Ao acessar e usar o 2Data Brasil, você concorda em cumprir e ficar 
              vinculado a estes Termos de Uso. Se você não concordar com qualquer 
              parte destes termos, não deve usar nosso serviço.
            </p>
          </section>

          <section>
            <h2 className="title-h3 mb-3 sm:mb-4">2. Descrição do Serviço</h2>
            <p className="text-responsive-sm text-muted-foreground">
              O 2Data Brasil é uma plataforma gratuita que oferece ferramentas 
              de desenvolvimento web, incluindo geradores, validadores, 
              calculadoras e utilitários diversos para desenvolvedores.
            </p>
          </section>

          <section>
            <h2 className="title-h3 mb-3 sm:mb-4">3. Uso Permitido</h2>
            <div className="text-muted-foreground space-y-2">
              <p>Você pode usar nossas ferramentas para:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Desenvolvimento de projetos pessoais e comerciais</li>
                <li>Aprendizado e educação</li>
                <li>Testes e validações de dados</li>
                <li>Qualquer uso legal e ético</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="title-h3 mb-3 sm:mb-4">4. Uso Proibido</h2>
            <div className="text-muted-foreground space-y-2">
              <p>É proibido usar nossas ferramentas para:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Atividades ilegais ou fraudulentas</li>
                <li>Spam ou atividades de marketing abusivo</li>
                <li>Tentativas de comprometer a segurança da plataforma</li>
                <li>Reprodução não autorizada do conteúdo</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="title-h3 mb-3 sm:mb-4">5. Responsabilidade</h2>
            <p className="text-responsive-sm text-muted-foreground">
              As ferramentas são fornecidas "como estão", sem garantias de qualquer tipo. 
              O usuário é responsável por verificar a precisão dos resultados antes de 
              usá-los em produção. Não nos responsabilizamos por eventuais danos 
              decorrentes do uso das ferramentas.
            </p>
          </section>

          <section>
            <h2 className="title-h3 mb-3 sm:mb-4">6. Privacidade dos Dados</h2>
            <p className="text-responsive-sm text-muted-foreground">
              Não coletamos nem armazenamos dados pessoais inseridos nas ferramentas. 
              Todo processamento é feito localmente no seu navegador. Para mais detalhes, 
              consulte nossa Política de Privacidade.
            </p>
          </section>

          <section>
            <h2 className="title-h3 mb-3 sm:mb-4">7. Modificações</h2>
            <p className="text-responsive-sm text-muted-foreground">
              Reservamos o direito de modificar estes termos a qualquer momento. 
              As mudanças entrarão em vigor imediatamente após a publicação. 
              É responsabilidade do usuário verificar periodicamente os termos atualizados.
            </p>
          </section>

          <section>
            <h2 className="title-h3 mb-3 sm:mb-4">8. Contato</h2>
            <p className="text-responsive-sm text-muted-foreground">
              Se você tiver dúvidas sobre estes Termos de Uso, entre em contato 
              conosco através da página de Contato.
            </p>
          </section>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default TermosDeUso;