import { ModernHeader } from '@/components/ModernHeader';
import { Footer } from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cookie, Settings, Shield, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const PoliticaCookies = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <ModernHeader onSearch={() => {}} onToolSelect={() => {}} />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
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

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Política de Cookies
          </h1>
          <p className="text-muted-foreground">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="p-6 text-center">
            <Cookie className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Apenas Essenciais</h3>
            <p className="text-sm text-muted-foreground">
              Usamos apenas cookies necessários para o funcionamento
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <Settings className="w-12 h-12 text-secondary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Suas Preferências</h3>
            <p className="text-sm text-muted-foreground">
              Salvamos apenas configurações como tema (claro/escuro)
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <Shield className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Sem Rastreamento</h3>
            <p className="text-sm text-muted-foreground">
              Não usamos cookies de publicidade ou analytics
            </p>
          </Card>
          
          <Card className="p-6 text-center">
            <Trash2 className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Fácil Remoção</h3>
            <p className="text-sm text-muted-foreground">
              Você pode limpar os cookies pelo navegador a qualquer momento
            </p>
          </Card>
        </div>

        <Card className="p-8 space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. O que são Cookies?</h2>
            <p className="text-muted-foreground">
              Cookies são pequenos arquivos de texto armazenados no seu navegador 
              quando você visita um site. Eles ajudam o site a "lembrar" de suas 
              preferências e melhorar sua experiência.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Cookies que Utilizamos</h2>
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-semibold text-primary mb-2">Cookies Essenciais (Obrigatórios)</h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Nome:</strong> 2data-theme</p>
                  <p><strong>Propósito:</strong> Salvar sua preferência de tema (claro/escuro)</p>
                  <p><strong>Duração:</strong> Permanente (até você limpar o navegador)</p>
                  <p><strong>Dados:</strong> Apenas "light", "dark" ou "system"</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Cookies que NÃO Utilizamos</h2>
            <div className="text-muted-foreground space-y-2">
              <p>Nós NÃO usamos cookies para:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Rastreamento de comportamento ou navegação</li>
                <li>Publicidade direcionada</li>
                <li>Analytics detalhados ou profiling</li>
                <li>Compartilhamento de dados com terceiros</li>
                <li>Coleta de informações pessoais</li>
                <li>Monetização ou venda de dados</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Local Storage</h2>
            <p className="text-muted-foreground">
              Além dos cookies, também usamos o Local Storage do navegador para 
              salvar algumas preferências de interface. Essas informações ficam 
              apenas no seu dispositivo e não são enviadas para nossos servidores.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Como Gerenciar Cookies</h2>
            <div className="text-muted-foreground space-y-4">
              <h3 className="font-semibold">Pelo Navegador:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Chrome:</strong> Configurações → Privacidade e segurança → Cookies</li>
                <li><strong>Firefox:</strong> Configurações → Privacidade e segurança → Cookies</li>
                <li><strong>Safari:</strong> Preferências → Privacidade → Cookies</li>
                <li><strong>Edge:</strong> Configurações → Cookies e permissões de site</li>
              </ul>
              
              <h3 className="font-semibold mt-4">Atalhos Rápidos:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Ctrl+Shift+Delete</strong> (Windows) ou <strong>Cmd+Shift+Delete</strong> (Mac)</li>
                <li>Modo incógnito/privado impede armazenamento de cookies</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Impacto de Desabilitar Cookies</h2>
            <p className="text-muted-foreground">
              Se você desabilitar os cookies essenciais, algumas funcionalidades 
              podem ser afetadas:
            </p>
            <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-1">
              <li>Sua preferência de tema será resetada a cada visita</li>
              <li>Configurações de interface não serão salvas</li>
              <li>A experiência pode ficar menos personalizada</li>
            </ul>
            <p className="text-muted-foreground mt-4">
              <strong>Importante:</strong> Todas as ferramentas continuarão funcionando 
              normalmente, pois elas não dependem de cookies para processar dados.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Atualizações desta Política</h2>
            <p className="text-muted-foreground">
              Se adicionarmos novos tipos de cookies, atualizaremos esta política 
              e informaremos sobre as mudanças. A data da última atualização 
              sempre estará visível no topo da página.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Contato</h2>
            <p className="text-muted-foreground">
              Dúvidas sobre nossa política de cookies? Entre em contato 
              conosco através da página de Contato.
            </p>
          </section>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default PoliticaCookies;