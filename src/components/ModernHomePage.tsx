import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Code, Hash, Palette, FileText, Key, Calculator, CreditCard, Globe, Wrench, Car, Smartphone, User, Mail, Calendar, Binary, Ruler, MapPin, Building2, Phone, Type, LinkIcon, MessageCircle, Shield, Timer, Database, Settings, Clock, ImageIcon, QrCode, Search, ShieldCheck, Network, Monitor, Activity, Zap, Camera, CheckCircle, Bell, Target, Trophy, DollarSign, BarChart3, Cloud, AlertTriangle, XCircle, Lock, ScanLine, Percent, TrendingUp, House, Wifi, Sparkles, ArrowRight, Star } from 'lucide-react';
import { getTotalToolsCount, getCategoryCount } from '@/lib/toolsData';
import { ToolShowcase } from './ToolShowcase';

const allTools = [
  // GERADORES
  { id: 'cpf-generator', name: 'Gerador CPF', icon: CreditCard, category: 'GERADORES', description: 'Gera CPFs válidos para testes' },
  { id: 'rg-generator', name: 'Gerador de RG', icon: CreditCard, category: 'GERADORES', description: 'Gera RGs válidos por estado' },
  { id: 'cnpj-generator', name: 'Gerador CNPJ', icon: Building2, category: 'GERADORES', description: 'Gera CNPJs válidos para testes' },
  { id: 'cnh-generator', name: 'Gerador de CNH', icon: Car, category: 'GERADORES', description: 'Gera CNH com categoria' },
  { id: 'uuid-generator', name: 'Gerador UUID', icon: Key, category: 'GERADORES', description: 'Gera identificadores únicos' },
  { id: 'hash-generator', name: 'Gerador Hash', icon: Hash, category: 'GERADORES', description: 'Gera hashes MD5, SHA256' },
  { id: 'password-generator', name: 'Gerador Senha', icon: Key, category: 'GERADORES', description: 'Senhas seguras personalizadas' },
  { id: 'qr-generator', name: 'Gerador QR Code', icon: QrCode, category: 'GERADORES', description: 'QR Codes personalizados' },
  
  // VALIDADORES
  { id: 'cpf-validator', name: 'Validador CPF', icon: CreditCard, category: 'VALIDADORES', description: 'Valida CPFs brasileiros' },
  { id: 'cnpj-validator', name: 'Validador CNPJ', icon: Building2, category: 'VALIDADORES', description: 'Valida CNPJs brasileiros' },
  { id: 'credit-card-validator', name: 'Validador Cartão', icon: CreditCard, category: 'VALIDADORES', description: 'Valida cartões de crédito' },
  
  // CALCULADORAS
  { id: 'age-calculator', name: 'Calculadora Idade', icon: Calculator, category: 'CALCULADORAS', description: 'Calcula idade precisa' },
  { id: 'percentage-calculator', name: 'Calculadora %', icon: Percent, category: 'CALCULADORAS', description: 'Cálculos de porcentagem' },
  { id: 'compound-interest-calculator', name: 'Juros Compostos', icon: TrendingUp, category: 'CALCULADORAS', description: 'Simula investimentos' },
  
  // CONVERSORES
  { id: 'color-converter', name: 'Conversor Cores', icon: Palette, category: 'CONVERSORES', description: 'Converte HEX, RGB, HSL' },
  { id: 'json-formatter', name: 'Formatador JSON', icon: FileText, category: 'CONVERSORES', description: 'Formata e valida JSON' },
  { id: 'base64-converter', name: 'Base64 Converter', icon: Code, category: 'CONVERSORES', description: 'Codifica/decodifica Base64' },
  
  // CONSULTAS
  { id: 'cep-lookup', name: 'Consulta CEP', icon: MapPin, category: 'CONSULTAS', description: 'Busca endereços por CEP' },
  { id: 'cnpj-lookup', name: 'Consulta CNPJ', icon: Building2, category: 'CONSULTAS', description: 'Dados da Receita Federal' },
  
  // PRODUTIVIDADE
  { id: 'pomodoro-timer', name: 'Timer Pomodoro', icon: Timer, category: 'PRODUTIVIDADE', description: 'Técnica de produtividade' },
  { id: 'todo-list', name: 'Lista Tarefas', icon: CheckCircle, category: 'PRODUTIVIDADE', description: 'Organiza suas tarefas' },
  
  // SEGURANÇA
  { id: 'password-strength', name: 'Força Senha', icon: Shield, category: 'SEGURANÇA', description: 'Avalia segurança senhas' },
  { id: 'hash-checker', name: 'Verificador Hash', icon: Hash, category: 'SEGURANÇA', description: 'Verifica integridade' }
];
interface ModernHomePageProps {
  onToolSelect: (toolId: string) => void;
}
const featuredTools = [{
  id: 'password-generator',
  name: 'Gerador de Senhas',
  icon: Key,
  description: 'Senhas seguras personalizadas',
  category: 'GERADORES',
  popular: true
}, {
  id: 'qr-generator',
  name: 'Gerador QR Code',
  icon: QrCode,
  description: 'QR Codes personalizados',
  category: 'GERADORES',
  popular: true
}, {
  id: 'hash-generator',
  name: 'Gerador Hash',
  icon: Hash,
  description: 'Gera hashes MD5, SHA256',
  category: 'GERADORES',
  popular: true
}, {
  id: 'cpf-generator',
  name: 'Gerador CPF',
  icon: CreditCard,
  description: 'Gera CPFs válidos para testes',
  category: 'GERADORES',
  popular: true
}, {
  id: 'json-formatter',
  name: 'Formatador JSON',
  icon: FileText,
  description: 'Formata e valida JSON',
  category: 'CONVERSORES',
  popular: true
}, {
  id: 'base64-converter',
  name: 'Base64 Converter',
  icon: Code,
  description: 'Codifica/decodifica Base64',
  category: 'CONVERSORES',
  popular: true
}, {
  id: 'color-converter',
  name: 'Conversor Cores',
  icon: Palette,
  description: 'Converte HEX, RGB, HSL',
  category: 'CONVERSORES',
  popular: true
}, {
  id: 'word-counter',
  name: 'Contador Palavras',
  icon: Type,
  description: 'Conta caracteres e palavras',
  category: 'UTILITÁRIOS',
  popular: true
}];
const allCategories = [{
  name: 'GERADORES',
  icon: Settings,
  count: getCategoryCount('GERADORES'),
  color: 'from-blue-500 to-cyan-500'
}, {
  name: 'VALIDADORES',
  icon: ShieldCheck,
  count: getCategoryCount('VALIDADORES'),
  color: 'from-green-500 to-emerald-500'
}, {
  name: 'CALCULADORAS',
  icon: Calculator,
  count: getCategoryCount('CALCULADORAS'),
  color: 'from-purple-500 to-pink-500'
}, {
  name: 'CONVERSORES',
  icon: Code,
  count: getCategoryCount('CONVERSORES'),
  color: 'from-orange-500 to-red-500'
}, {
  name: 'CONSULTAS',
  icon: Search,
  count: getCategoryCount('CONSULTAS'),
  color: 'from-amber-500 to-orange-500'
}, {
  name: 'PRODUTIVIDADE',
  icon: Target,
  count: getCategoryCount('PRODUTIVIDADE'),
  color: 'from-teal-500 to-cyan-500'
}, {
  name: 'FERRAMENTAS WEB',
  icon: Globe,
  count: getCategoryCount('FERRAMENTAS WEB'),
  color: 'from-indigo-500 to-purple-500'
}];

export const ModernHomePage = ({
  onToolSelect
}: ModernHomePageProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Número total de ferramentas calculado automaticamente
  const totalTools = getTotalToolsCount();
  const filteredTools = featuredTools.filter(tool => tool.name.toLowerCase().includes(searchTerm.toLowerCase()) || tool.description.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCategoryClick = (categoryName: string) => {
    const categoryElement = document.getElementById(`category-${categoryName}`);
    if (categoryElement) {
      categoryElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  return (
    <div className="bg-gradient-hero">
      <div className="container-responsive spacing-lg">
        {/* Hero Section */}
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

        {/* Search Bar - Removida para simplificar */}

        {/* Categories Grid */}
        <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16 animate-scale-in">
          <h2 className="title-h2 text-center">
            Explore por Categoria
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {allCategories.map((category, index) => <Card 
              key={category.name} 
              className={`category-card hover-lift cursor-pointer group bg-gradient-card border-border/50 shadow-soft hover:shadow-glow transition-all duration-300`} 
              style={{
                animationDelay: `${index * 0.1}s`
              }}
              onClick={() => handleCategoryClick(category.name)}
            >
                <div className="text-center h-full flex flex-col justify-center">
                  <div className={`mx-auto w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br ${category.color} p-2 sm:p-3 mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-medium`}>
                    <category.icon className="w-6 h-6 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className="category-title px-1">{category.name}</h3>
                  <p className="category-count">{category.count} ferramentas</p>
                </div>
              </Card>)}
          </div>
        </div>

        {/* Interactive Tool Showcase */}
        <div className="mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <ToolShowcase />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 animate-fade-in-up mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <Card className="spacing-sm lg:spacing-md text-center bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-all">
            <div className="text-2xl lg:text-3xl font-bold text-primary mb-2">{totalTools}+</div>
            <p className="text-xs lg:text-sm text-muted-foreground">Ferramentas</p>
          </Card>
          <Card className="spacing-sm lg:spacing-md text-center bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-all">
            <div className="text-2xl lg:text-3xl font-bold text-success mb-2">100%</div>
            <p className="text-xs lg:text-sm text-muted-foreground">Gratuito</p>
          </Card>
          <Card className="spacing-sm lg:spacing-md text-center bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-all">
            <div className="text-2xl lg:text-3xl font-bold text-secondary mb-2">24/7</div>
            <p className="text-xs lg:text-sm text-muted-foreground">Disponível</p>
          </Card>
          <Card className="spacing-sm lg:spacing-md text-center bg-gradient-card border-border/50 shadow-soft hover:shadow-medium transition-all">
            <div className="text-2xl lg:text-3xl font-bold text-accent mb-2">0</div>
            <p className="text-xs lg:text-sm text-muted-foreground">Propagandas</p>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in-up">
          <Card className="spacing-md lg:spacing-lg bg-gradient-primary text-white border-0 shadow-glow max-w-3xl mx-auto">
            <h2 className="title-h3 text-white mb-3 sm:mb-4">Pronto para começar?</h2>
            <p className="text-white/90 mb-4 sm:mb-6 text-responsive-sm lg:text-base px-4">
              Acesse todas as ferramentas gratuitamente, sem cadastro e sem limitações.
            </p>
            <Link to="/ferramenta/password-generator">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-white/90 shadow-medium">
                <Sparkles className="w-5 h-5 mr-2" />
                Experimentar Agora
              </Button>
            </Link>
          </Card>
        </div>

        {/* All Tools by Category */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="title-h2 text-center mb-6 sm:mb-8">
            Todas as Ferramentas
          </h2>
          
          {['GERADORES', 'VALIDADORES', 'CALCULADORAS', 'CONVERSORES', 'CONSULTAS', 'PRODUTIVIDADE', 'SEGURANÇA'].map(category => {
            const categoryTools = allTools.filter(tool => tool.category === category);
            if (categoryTools.length === 0) return null;

            return (
              <div key={category} id={`category-${category}`} className="mb-8 sm:mb-10 md:mb-12 scroll-mt-20">
                <h3 className="title-h3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 px-2 sm:px-0">
                  <span>{category}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground font-normal">
                    ({categoryTools.length})
                  </span>
                </h3>
                
                <div className="tools-grid">
                  {categoryTools.map(tool => (
                    <Link key={tool.id} to={`/ferramenta/${tool.id}`}>
                      <Card className="spacing-sm hover:shadow-lg hover-lift cursor-pointer bg-gradient-card border-border/50">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                            <tool.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
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
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};