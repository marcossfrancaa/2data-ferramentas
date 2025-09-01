import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { SEOHead } from '@/components/SEOHead';
import { generateStructuredData } from '@/lib/searchConsole';
import { useFavorites } from '@/contexts/FavoritesContext';
import { 
  Code, 
  Hash, 
  Palette, 
  FileText, 
  Key, 
  Calculator, 
  CreditCard, 
  Globe, 
  Wrench, 
  Settings, 
  QrCode, 
  Search, 
  ShieldCheck, 
  Activity, 
  CheckCircle, 
  Target, 
  Sparkles, 
  Star 
} from 'lucide-react';
import { getTotalToolsCount, getCategoryCount } from '@/lib/toolsData';
import { ToolShowcase } from './ToolShowcase';
import { cn } from '@/lib/utils';

const allTools = [
  { id: 'cpf-generator', name: 'Gerador CPF', icon: CreditCard, category: 'GERADORES', description: 'Gera CPFs válidos para testes' },
  { id: 'rg-generator', name: 'Gerador de RG', icon: CreditCard, category: 'GERADORES', description: 'Gera RGs válidos por estado' },
  { id: 'cnpj-generator', name: 'Gerador CNPJ', icon: Globe, category: 'GERADORES', description: 'Gera CNPJs válidos para testes' },
  { id: 'password-generator', name: 'Gerador Senha', icon: Key, category: 'GERADORES', description: 'Senhas seguras personalizadas' },
  { id: 'qr-generator', name: 'Gerador QR Code', icon: QrCode, category: 'GERADORES', description: 'QR Codes personalizados' },
  { id: 'temporary-email', name: 'E-mail Temporário', icon: Globe, category: 'GERADORES', description: 'E-mail descartável com GuerrillaMail' },
  { id: 'hash-generator', name: 'Gerador Hash', icon: Hash, category: 'GERADORES', description: 'Gere hashes MD5, SHA1, SHA256' },
  { id: 'uuid-generator', name: 'Gerador UUID', icon: Code, category: 'GERADORES', description: 'Identificadores únicos universais' },
  { id: 'cpf-validator', name: 'Validador CPF', icon: CreditCard, category: 'VALIDADORES', description: 'Valida CPFs brasileiros' },
  { id: 'cnpj-validator', name: 'Validador CNPJ', icon: Globe, category: 'VALIDADORES', description: 'Valida CNPJs brasileiros' },
  { id: 'credit-card-validator', name: 'Validador Cartão', icon: CreditCard, category: 'VALIDADORES', description: 'Valide números de cartão de crédito' },
  { id: 'json-validator', name: 'Validador JSON', icon: FileText, category: 'VALIDADORES', description: 'Valide e formate código JSON' },
  { id: 'calculator', name: 'Calculadora', icon: Calculator, category: 'CALCULADORAS', description: 'Calculadora científica completa' },
  { id: 'age-calculator', name: 'Calculadora Idade', icon: Calculator, category: 'CALCULADORAS', description: 'Calcule idade exata em anos, meses e dias' },
  { id: 'bmi-calculator', name: 'Calculadora IMC', icon: Calculator, category: 'CALCULADORAS', description: 'Calcule seu Índice de Massa Corporal' },
  { id: 'color-converter', name: 'Conversor Cores', icon: Palette, category: 'CONVERSORES', description: 'Converte HEX, RGB, HSL' },
  { id: 'json-formatter', name: 'Formatador JSON', icon: FileText, category: 'CONVERSORES', description: 'Formata e valida JSON' },
  { id: 'base64-converter', name: 'Base64 Converter', icon: Code, category: 'CONVERSORES', description: 'Codifique e decodifique Base64' },
  { id: 'temperature-converter', name: 'Conversor Temperatura', icon: Calculator, category: 'CONVERSORES', description: 'Converta entre Celsius, Fahrenheit, Kelvin' },
  { id: 'cep-lookup', name: 'Consulta CEP', icon: Search, category: 'CONSULTAS', description: 'Busque endereços por CEP' },
  { id: 'cnpj-lookup', name: 'Consulta CNPJ', icon: Globe, category: 'CONSULTAS', description: 'Dados da Receita Federal' },
  { id: 'ddd-lookup', name: 'Consulta DDD', icon: Search, category: 'CONSULTAS', description: 'Consulte códigos de área' },
  { id: 'fipe-lookup', name: 'Consulta FIPE', icon: Search, category: 'CONSULTAS', description: 'Preços de veículos pela tabela FIPE' },
  { id: 'link-shortener', name: 'Encurtador de Link', icon: Globe, category: 'CONSULTAS', description: 'Encurte URLs longas' }
];

interface ModernHomePageProps {
  onToolSelect: (toolId: string) => void;
}

const allCategories = [
  { name: 'GERADORES', icon: Settings, count: getCategoryCount('GERADORES'), color: 'from-blue-500 to-cyan-500' },
  { name: 'VALIDADORES', icon: ShieldCheck, count: getCategoryCount('VALIDADORES'), color: 'from-green-500 to-emerald-500' },
  { name: 'CALCULADORAS', icon: Calculator, count: getCategoryCount('CALCULADORAS'), color: 'from-purple-500 to-pink-500' },
  { name: 'CONVERSORES', icon: Code, count: getCategoryCount('CONVERSORES'), color: 'from-orange-500 to-red-500' },
  { name: 'CONSULTAS', icon: Search, count: getCategoryCount('CONSULTAS'), color: 'from-amber-500 to-orange-500' },
  { name: 'PRODUTIVIDADE', icon: Target, count: getCategoryCount('PRODUTIVIDADE'), color: 'from-teal-500 to-cyan-500' }
];

export const ModernHomePage = ({ onToolSelect }: ModernHomePageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const totalTools = getTotalToolsCount();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  const handleCategoryClick = (categoryName: string) => {
    const categoryElement = document.getElementById(`category-${categoryName}`);
    if (categoryElement) {
      categoryElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const websiteStructuredData = generateStructuredData('website', {
    name: '2Data Brasil',
    description: 'A plataforma mais completa de ferramentas para desenvolvedores e profissionais no Brasil',
    url: 'https://2data.com.br'
  });
  const combinedStructuredData = [websiteStructuredData];

  return (
    <div>
      <SEOHead 
        title="Site On Fire - Ferramentas Online Gratuitas para Desenvolvedores"
        description="Mais de 180 ferramentas online gratuitas para desenvolvedores e profissionais. Geradores, validadores, calculadoras, conversores e muito mais. Sem cadastro, sem limitações."
        keywords="ferramentas online, gerador cpf, validador cnpj, calculadora, conversor, desenvolvedor, gratuito, brasil"
        canonicalUrl="https://2data.com.br"
        structuredData={combinedStructuredData}
      />
      <div className="bg-gradient-hero">
        <div className="container-responsive spacing-lg">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 animate-fade-in-down">
            <div className="flex flex-col sm:flex-row lg:flex-row items-center justify-center gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-50 animate-pulse"></div>
                <div className="relative bg-gradient-primary p-3 lg:p-4 rounded-2xl shadow-glow">
                  <Wrench className="w-8 h-8 lg:w-12 lg:h-12 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black bg-gradient-primary bg-clip-text text-transparent mb-2">
                  2Data Brasil
                </h1>
                <div className="flex flex-wrap items-center gap-2 justify-center">
                  <Badge variant="secondary" className="bg-gradient-secondary text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Versão 2.0
                  </Badge>
                  <Badge variant="outline" className="border-primary/20 text-primary">
                    <Star className="w-3 h-3 mr-1" />
                    Gratuito
                  </Badge>
                </div>
              </div>
            </div>
            
            <p className="text-responsive-lg lg:text-2xl text-muted-foreground mb-4 sm:mb-6 lg:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              A plataforma mais completa de ferramentas para desenvolvedores e profissionais no Brasil
            </p>
            
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 px-4 lg:px-6 py-3 bg-gradient-card rounded-full border border-border/50 shadow-soft">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm lg:text-base">
                <Activity className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>{totalTools} ferramentas ativas</span>
              </div>
              <div className="hidden sm:block w-1 h-6 bg-border"></div>
              <div className="flex items-center gap-2 text-success font-semibold text-sm lg:text-base">
                <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5" />
                <span>100% gratuito</span>
              </div>
            </div>
          </div>

          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 animate-scale-in">
            <h2 className="title-h2 text-center">
              <button 
                onClick={() => handleCategoryClick('GERADORES')}
                className="hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                Explore por Categoria
              </button>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 px-4 sm:px-0">
              {allCategories.map((category, index) => {
                const CategoryIcon = category.icon;
                return (
                  <Card 
                    key={category.name} 
                    className="category-card hover-lift cursor-pointer group bg-gradient-card border-border/50 shadow-soft hover:shadow-glow transition-all duration-300 min-h-[120px] sm:min-h-[140px]" 
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    <div className="text-center h-full flex flex-col justify-center p-4 sm:p-5 md:p-6">
                      <div className={`mx-auto w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${category.color} p-2.5 sm:p-3 mb-3 sm:mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                        <CategoryIcon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                      </div>
                      <h3 className="font-bold text-sm sm:text-base md:text-lg text-card-foreground leading-tight mb-1">{category.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium">{category.count} ferramentas</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <ToolShowcase />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-6 animate-fade-in-up mb-8 sm:mb-10 md:mb-12 lg:mb-16">
            <Card className="p-2 sm:p-3 lg:p-4 text-center bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-all">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-primary mb-1">{totalTools}+</div>
              <p className="text-xs text-muted-foreground">Ferramentas</p>
            </Card>
            <Card className="p-2 sm:p-3 lg:p-4 text-center bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-all">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-success mb-1">100%</div>
              <p className="text-xs text-muted-foreground">Gratuito</p>
            </Card>
            <Card className="p-2 sm:p-3 lg:p-4 text-center bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-all">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-secondary mb-1">24/7</div>
              <p className="text-xs text-muted-foreground">Disponível</p>
            </Card>
            <Card className="p-2 sm:p-3 lg:p-4 text-center bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-all">
              <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-accent mb-1">0</div>
              <p className="text-xs text-muted-foreground">Propagandas</p>
            </Card>
          </div>

          <div className="text-center animate-fade-in-up">
            <Card className="spacing-md lg:spacing-lg bg-gradient-primary text-white border-0 shadow-glow max-w-3xl mx-auto">
              <h2 className="title-h3 text-white mb-3 sm:mb-4">Ferramentas Profissionais</h2>
              <p className="text-white/90 mb-4 sm:mb-6 text-responsive-sm lg:text-base px-4">
                Todas as ferramentas que você precisa em um só lugar. Gratuito, rápido e sem limitações.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 px-4">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium">Sem Cadastro</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm">
                  <Star className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium">Sem Limitações</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-full backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span className="text-sm font-medium">Sempre Atualizado</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="mb-8 sm:mb-10 md:mb-12 mt-12 sm:mt-16 lg:mt-20">
            <h2 className="title-h2 text-center mb-8 sm:mb-10 lg:mb-12">Todas as Ferramentas</h2>
            
            {['GERADORES', 'VALIDADORES', 'CALCULADORAS', 'CONVERSORES', 'CONSULTAS'].map(category => {
              const categoryTools = allTools.filter(tool => tool.category === category);
              if (categoryTools.length === 0) return null;

              return (
                <div key={category} id={`category-${category}`} className="mb-8 sm:mb-10 md:mb-12 scroll-mt-20">
                  <h3 className="title-h3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 px-2 sm:px-0">
                    <span>{category}</span>
                    <span className="text-xs sm:text-sm text-muted-foreground font-normal">({categoryTools.length})</span>
                  </h3>
                  
                  <div className="tools-grid">
                    {categoryTools.map(tool => {
                      const ToolIcon = tool.icon;
                      const isToolFavorite = isFavorite(tool.id);
                      
                      const handleFavoriteClick = (e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        if (isToolFavorite) {
                          removeFavorite(tool.id);
                        } else {
                          addFavorite(tool.id);
                        }
                      };

                      return (
                        <div key={tool.id} className="relative group">
                          <Link to={`/ferramenta/${tool.id}`}>
                            <Card className="spacing-sm hover:shadow-lg hover-lift cursor-pointer bg-gradient-card border-border/50">
                              <div className="flex items-start gap-2 sm:gap-3">
                                <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                  <ToolIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-card-foreground text-sm sm:text-base mb-1 truncate">
                                    {tool.name}
                                  </h4>
                                  <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                                    {tool.description}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          </Link>
                          
                          {/* Botão de favorito */}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleFavoriteClick}
                            className={cn(
                              "absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10",
                              isToolFavorite && "opacity-100"
                            )}
                          >
                            <Star 
                              className={cn(
                                "h-3.5 w-3.5 transition-all duration-200",
                                isToolFavorite 
                                  ? "fill-yellow-500 text-yellow-500" 
                                  : "text-muted-foreground hover:text-yellow-500"
                              )} 
                            />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};