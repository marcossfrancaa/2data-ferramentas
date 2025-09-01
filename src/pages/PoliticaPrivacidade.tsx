import { ModernHeader } from '@/components/ModernHeader';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Eye, Lock, Database, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PoliticaPrivacidade = () => {
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
            Política de Privacidade
          </h1>
          <p className="text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 mb-6 sm:mb-8">
          <Card className="spacing-md text-center">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-primary mx-auto mb-3 sm:mb-4" />
            <h3 className="text-responsive-lg font-semibold mb-2">100% Local</h3>
            <p className="text-responsive-sm text-muted-foreground">
              Todos os dados são processados localmente no seu navegador
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <Eye className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sem Rastreamento</h3>
            <p className="text-sm text-muted-foreground">
              Não usamos cookies de rastreamento ou analytics invasivos
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <Lock className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Dados Seguros</h3>
            <p className="text-sm text-muted-foreground">
              Suas informações nunca saem do seu dispositivo
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <Database className="w-12 h-12 text-success mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Zero Armazenamento</h3>
            <p className="text-sm text-muted-foreground">
              Não mantemos bancos de dados com informações pessoais
            </p>
          </Card>
        </div>

        <Card className="p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
            <p className="text-muted-foreground">
              O 2Data Brasil leva sua privacidade muito a sério. Esta política 
              descreve como tratamos suas informações quando você usa nossas ferramentas.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Dados que NÃO Coletamos</h2>
            <div className="text-muted-foreground space-y-2">
              <p>Nós NÃO coletamos:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Dados pessoais inseridos nas ferramentas (CPF, CNPJ, etc.)</li>
                <li>Informações bancárias ou financeiras</li>
                <li>Conteúdo dos textos, códigos ou arquivos processados</li>
                <li>Histórico de uso das ferramentas</li>
                <li>Localização geográfica precisa</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Dados Técnicos Básicos</h2>
            <p className="text-muted-foreground">
              Coletamos apenas dados técnicos básicos e anônimos para manter 
              o funcionamento da plataforma, como estatísticas gerais de acesso 
              e informações sobre erros técnicos, sem vincular a usuários específicos.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Processamento Local</h2>
            <p className="text-muted-foreground">
              Todas as nossas ferramentas funcionam inteiramente no seu navegador. 
              Isso significa que quando você insere dados (como um CPF para validar 
              ou texto para processar), essas informações não são enviadas para 
              nossos servidores - tudo é processado localmente no seu dispositivo.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. APIs Externas</h2>
            <p className="text-muted-foreground">
              Algumas ferramentas (como consulta de CEP) fazem requisições para 
              APIs públicas externas. Nesses casos, os dados são enviados diretamente 
              do seu navegador para o serviço público correspondente, não passando 
              pelos nossos servidores.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Cookies e Armazenamento</h2>
            <p className="text-muted-foreground">
              Utilizamos apenas cookies essenciais para o funcionamento básico 
              da aplicação (como preferência de tema). Não usamos cookies de 
              rastreamento, analytics invasivos ou publicidade.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Seus Direitos</h2>
            <div className="text-muted-foreground space-y-2">
              <p>Como não coletamos dados pessoais, você tem total controle:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Seus dados nunca saem do seu dispositivo</li>
                <li>Você pode limpar o cache do navegador para apagar preferências</li>
                <li>Não há perfis ou contas para serem deletadas</li>
                <li>Use as ferramentas anonimamente quando quiser</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Mudanças nesta Política</h2>
            <p className="text-muted-foreground">
              Se modificarmos esta política, publicaremos a versão atualizada 
              nesta página com a nova data de atualização. Recomendamos verificar 
              periodicamente esta página.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contato</h2>
            <p className="text-muted-foreground">
              Se você tiver dúvidas sobre nossa política de privacidade, 
              entre em contato conosco através da página de Contato.
            </p>
          </section>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PoliticaPrivacidade;