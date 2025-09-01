
import { Shield, Database, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

export const Footer = () => {
  const legalLinks = [
    { name: 'Sobre', path: '/sobre' },
    { name: 'Termos de Uso', path: '/termos-de-uso' },
    { name: 'Política de Privacidade', path: '/politica-de-privacidade' },
    { name: 'Política de Cookies', path: '/politica-de-cookies' },
    { name: 'Contato', path: '/contato' }
  ];

  return (
    <footer className="bg-gradient-card border-t border-border mt-auto">
      {/* Seção "Por que escolher o 2Data Brasil?" */}
      <div className="container-responsive spacing-lg">
        <div className="text-center mb-6 sm:mb-8">
          <h3 className="title-h3">
            Por que escolher o 2Data Brasil?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="text-center spacing-md bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg border border-border/50">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-500" />
            </div>
            <h4 className="text-responsive-lg font-semibold text-card-foreground mb-2">
              100% Gratuito
            </h4>
            <p className="text-responsive-sm text-muted-foreground">
              Todas as ferramentas sem custo
            </p>
          </div>

          <div className="text-center spacing-md bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-lg border border-border/50">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Database className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-green-500" />
            </div>
            <h4 className="text-responsive-lg font-semibold text-card-foreground mb-2">
              Consultas e Dados
            </h4>
            <p className="text-responsive-sm text-muted-foreground">
              APIs públicas para dados reais
            </p>
          </div>

          <div className="text-center spacing-md bg-gradient-to-br from-yellow-500/10 to-green-500/10 rounded-lg border border-border/50 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Zap className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-yellow-500" />
            </div>
            <h4 className="text-responsive-lg font-semibold text-card-foreground mb-2">
              Rápido e Eficiente
            </h4>
            <p className="text-responsive-sm text-muted-foreground">
              Performance otimizada
            </p>
          </div>
        </div>
      </div>

      {/* Links legais */}
      <div className="border-t border-border bg-muted/20">
        <div className="container-responsive py-2 sm:py-3">
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
            {legalLinks.map((link, index) => (
              <div key={link.path} className="flex items-center gap-1">
                <Link 
                  to={link.path}
                  className="hover:text-primary transition-colors duration-200 px-2 py-1 rounded text-xs sm:text-sm"
                >
                  {link.name}
                </Link>
                {index < legalLinks.length - 1 && (
                  <Separator orientation="vertical" className="h-3 w-px bg-border/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rodapé inferior */}
      <div className="border-t border-border bg-muted/30">
        <div className="container-responsive py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-muted-foreground gap-2">
            <div className="text-center sm:text-left">
              © {new Date().getFullYear()} 2Data Brasil. Todas as ferramentas são gratuitas e open source.
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span>Feito com ❤️ para desenvolvedores</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
