import { useState, useMemo, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { getTotalToolsCount, toolsByCategory } from '@/lib/toolsData';
import { 
  Code, 
  Hash, 
  Palette, 
  FileText, 
  Key, 
  Calculator,
  CreditCard,
  Globe,
  Home,
  Wrench,
  Car,
  Smartphone,
  User,
  UserX,
  Mail,
  Calendar,
  Binary,
  Ruler,
  MapPin,
  Building2,
  Phone,
  Type,
  LinkIcon,
  MessageCircle,
  Shield,
  Timer,
  Database,
  Settings,
  Clock,
  ImageIcon,
  QrCode,
  Search,
  ShieldCheck,
  Network,
  Monitor,
  Activity,
  Zap,
  Camera,
  CheckCircle,
  Bell,
  Target,
  Trophy,
  DollarSign,
  BarChart3,
  Cloud,
  AlertTriangle,
  XCircle,
  Lock,
  ScanLine,
  Percent,
  TrendingUp,
  House,
  Wifi,
  ChevronRight,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Thermometer,
  Vote,
  Nfc,
  Receipt,
  CheckSquare,
  HardDrive
} from 'lucide-react';

interface ModernSidebarProps {
  selectedTool: string;
  onToolSelect: (tool: string) => void;
  searchQuery: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  showBetaBanner?: boolean;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const categoryIcons = {
  'GERADORES': Settings,
  'VALIDADORES': ShieldCheck,
  'CALCULADORAS': Calculator,
  'CONVERSORES': Code,
  'CONSULTAS': Search,
  'PRODUTIVIDADE': Target,
  'FERRAMENTAS WEB': Globe
};

// Ícones para ferramentas individuais
const toolIcons: { [key: string]: any } = {
  'password-generator': Key,
  'qr-generator': QrCode,
  'hash-generator': Hash,
  'cpf-generator': CreditCard,
  'cnpj-generator': Building2,
  'uuid-generator': Key,
  'pix-generator': Smartphone,
  'wifi-qr-generator': Wifi,
  'names-generator': User,
  'nick-generator': UserX,
  'random-number-generator': Hash,
  'pis-generator': CreditCard,
  'vehicle-generator': Car,
  'license-plate-generator': Car,
  'email-generator': Mail,
  'temporary-email': Mail,
  'phone-generator': Phone,
  'credit-card-generator': CreditCard,
  'whatsapp-generator': MessageCircle,
  'lorem-generator': FileText,
  'cron-generator': Clock,
  'cnh-generator': CreditCard,
  'rg-generator': CreditCard,
  'certificate-generator': FileText,
  'bank-account-generator': Building2,
  'custom-card-generator': CreditCard,
  'favicon-generator': ImageIcon,
  'barcode-generator': BarChart3,
  'color-picker': Palette,
  'state-registration-generator': Building2,
  'voter-title-generator': CreditCard,
  'renavam-generator': Car,
  'security-key-generator': Shield,
  'person-generator': User,
  'company-generator': Building2,
  'meta-tag-generator': Code,
  'lottery-generator': Trophy,
  'tracking-code-generator': Car,
  'color-palette-generator': Palette,
  'email-signature-generator': Mail,
  'cpf-validator': CreditCard,
  'cnpj-validator': Building2,
  'credit-card-validator': CreditCard,
  'json-validator': CheckCircle,
  'cnh-validator': CreditCard,
  'pis-validator': CreditCard,
  'rg-validator': CreditCard,
  'voter-title-validator': Vote,
  'nfc-validator': Nfc,
  'boleto-validator': Receipt,
  'password-strength': Shield,
  'bank-account-validator': Building2,
  'renavam-validator': Car,
  'certificate-validator': FileText,
  'calculator': Calculator,
  'age-calculator': Calendar,
  'percentage-calculator': Percent,
  'compound-interest-calculator': TrendingUp,
  'simple-interest-calculator': BarChart3,
  'mortgage-calculator': House,
  'bmi-calculator': Activity,
  'tip-calculator': DollarSign,
  'date-calculator': Calendar,
  'work-contract-calculator': FileText,
  'vacation-calculator': Calendar,
  'discount-calculator': Percent,
  'color-converter': Palette,
  'currency-converter': DollarSign,
  'temperature-converter': Thermometer,
  'base64-converter': Code,
  'url-encoder': Globe,
  'html-encoder': Code,
  'number-base-converter': Binary,
  'unit-converter': Ruler,
  'timestamp-converter': Clock,
  'text-case': Type,
  'text-to-html-converter': Code,
  'number-to-text-converter': Hash,
  'csv-to-json-converter': FileText,
  'geocoding-converter': MapPin,
  'json-formatter': Database,
  'file-size-converter': HardDrive,
  'image-converter': ImageIcon,
  'cep-lookup': MapPin,
  'cnpj-lookup': Building2,
  'ddd-lookup': Phone,
  'fipe-lookup': Car,
  'bank-lookup': CreditCard,
  'cpf-origin-lookup': MapPin,
  'bin-lookup': CreditCard,
  'holiday-lookup': Calendar,
  'cnae-lookup': Building2,
  'todo-list': CheckSquare,
  'project-time-calculator': Calculator,
  'quick-notes': FileText,
  'markdown-editor': FileText,
  'pomodoro-timer': Timer,
  'stopwatch': Clock,
  'world-clock': Globe,
  'word-counter': Type,
  'text-diff': FileText,
  'alphabetical-sorter': Type,
  'word-occurrence-counter': Hash,
  'text-cutter': Type,
  'string-splitter': Type,
  'text-reverser': Type,
  'accent-remover': Type,
  'line-break-remover': Type,
  'duplicate-line-remover': Type,
  'find-and-replace': Type,
  'text-case-converter': Type,
  'upside-down-text': Type,
  'email-separator': Mail,
  'synonym-generator': Target,
  'country-info': Globe,
  'link-shortener': LinkIcon,
  'metadata-remover': Shield,
  'web-playground': Monitor,
  'regex-tester': Code,
  'jwt-decoder': Key,
  'api-tester': Settings,
  'image-optimizer': ImageIcon,
  'ip-info': Globe,
  'ip-lookup': Network,
  'dns-lookup': Network,
  'dns-propagation-checker': Globe,
  'qr-reader': QrCode,
  'password-hasher': Hash,
  'hash-checker': ShieldCheck,
  'ssl-checker': ShieldCheck,
  'speed-test': Wifi,
  'sql-formatter': Database,
  'character-info': Code,
  'browser-info': Globe,
  'system-info': Monitor,
  'ping-latency-test': Globe,
  'domain-lookup': Globe,
  'gradient-generator': Palette,
  'css-generator': Palette,
  'lorem-picsum-generator': ImageIcon,
  'ssh-key-generator': Shield
};

// Converter dados do toolsByCategory para o formato esperado
const toolCategories = Object.entries(toolsByCategory).map(([categoryName, tools]) => ({
  name: categoryName,
  icon: categoryIcons[categoryName as keyof typeof categoryIcons] || Wrench,
  tools: tools.map(tool => ({
    id: tool.id,
    name: tool.name,
    icon: toolIcons[tool.id] || Code
  }))
}));

export const ModernSidebar = ({ 
  selectedTool, 
  onToolSelect, 
  searchQuery, 
  isCollapsed, 
  onToggleCollapse, 
  showBetaBanner = false,
  isMobileOpen = false,
  onMobileClose 
}: ModernSidebarProps) => {
  const [expandedCategory, setExpandedCategory] = useState<string>('PÁGINA INICIAL');
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Determinar a ferramenta ativa baseada na URL
  const activeTool = useMemo(() => {
    if (location.pathname === '/') return 'home';
    const match = location.pathname.match(/^\/ferramenta\/(.+)$/);
    return match ? match[1] : selectedTool;
  }, [location.pathname, selectedTool]);

  // Calcular total de ferramentas automaticamente
  const totalTools = getTotalToolsCount();

  // Filtrar categorias baseado na busca inteligente
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return toolCategories;
    }

    const query = searchQuery.toLowerCase();
    
    return toolCategories.map(category => ({
      ...category,
      tools: category.tools.filter(tool => {
        const toolName = tool.name.toLowerCase();
        // Busca inteligente: verifica se todas as letras da query existem na ferramenta na ordem correta
        let queryIndex = 0;
        for (let i = 0; i < toolName.length && queryIndex < query.length; i++) {
          if (toolName[i] === query[queryIndex]) {
            queryIndex++;
          }
        }
        // Se conseguiu encontrar todas as letras da query, retorna true
        return queryIndex === query.length;
      })
    })).filter(category => category.tools.length > 0);
  }, [searchQuery]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? '' : categoryName);
  };

  // Auto-expandir categorias quando há busca ativa
  const shouldExpandCategory = (categoryName: string) => {
    if (searchQuery.trim()) {
      return true; // Expandir todas as categorias durante a busca
    }
    return expandedCategory === categoryName;
  };

  // Fechar sidebar mobile ao clicar em uma ferramenta
  const handleToolClick = () => {
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  // Overlay para mobile
  const renderMobileOverlay = () => {
    if (!isMobile || !isMobileOpen) return null;
    
    return (
      <div 
        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        onClick={onMobileClose}
      />
    );
  };

  return (
    <>
      {renderMobileOverlay()}
      
      <div className={cn(
        "bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col z-40",
        // Desktop behavior
        "hidden lg:flex lg:fixed lg:left-0",
        isCollapsed ? "lg:w-16" : "lg:w-80",
        showBetaBanner ? "lg:top-12 lg:h-[calc(100vh-3rem)]" : "lg:top-0 lg:h-screen",
        // Mobile behavior - sliding drawer
        isMobile && isMobileOpen && "flex fixed left-0 top-0 h-screen w-80 shadow-2xl",
        isMobile && !isMobileOpen && "hidden"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-xl blur-sm opacity-50"></div>
              <div className="relative bg-gradient-primary p-2 rounded-xl">
                <Menu className="w-5 h-5 text-white" />
              </div>
            </div>
            {(!isCollapsed || isMobile) && (
              <>
                <div className="flex-1">
                  <h2 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                    2Data Brasil
                  </h2>
                </div>
                <Badge variant="secondary" className="bg-gradient-secondary text-white border-0 text-xs">
                  v2.0
                </Badge>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={isMobile ? onMobileClose : onToggleCollapse}
              className="p-1 h-auto hover:bg-sidebar-accent"
            >
              {isMobile ? (
                <X className="w-4 h-4" />
              ) : isCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Página Inicial Fixa */}
        <div className="p-2 border-b border-sidebar-border">
          <div className="relative group">
            <Link to="/" className="block w-full" onClick={handleToolClick}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start h-10 px-3 hover:bg-sidebar-accent",
                  activeTool === 'home' && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                  isCollapsed && !isMobile && "justify-center px-0"
                )}
              >
                <Home className={cn("w-4 h-4 flex-shrink-0", (!isCollapsed || isMobile) && "mr-3")} />
                {(!isCollapsed || isMobile) && (
                  <span className="text-sm truncate">Página Inicial</span>
                )}
              </Button>
            </Link>
            {isCollapsed && !isMobile && (
              <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-popover border border-border rounded-md px-3 py-2 text-sm text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-md">
                Página Inicial
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1">
          <nav className="p-2">
            {filteredCategories.map((category) => (
              <div key={category.name} className="mb-2">
                <div className="relative group">
                  <Button
                    variant="ghost"
                    onClick={() => toggleCategory(category.name)}
                    className={cn(
                      "w-full justify-between h-10 px-3 hover:bg-sidebar-accent",
                      isCollapsed && !isMobile && "justify-center px-0"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <category.icon className="w-4 h-4 text-sidebar-foreground" />
                      {(!isCollapsed || isMobile) && (
                        <>
                          <span className="font-medium text-sidebar-foreground text-sm">
                            {category.name}
                          </span>
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {category.tools.length}
                          </Badge>
                        </>
                      )}
                    </div>
                    {(!isCollapsed || isMobile) && (
                      <ChevronRight
                        className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform",
                          expandedCategory === category.name && "rotate-90"
                        )}
                      />
                    )}
                  </Button>
                  {isCollapsed && !isMobile && (
                    <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-popover border border-border rounded-md px-3 py-2 text-sm text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-md">
                      {category.name} ({category.tools.length})
                    </div>
                  )}
                </div>

                {/* Tools */}
                {(shouldExpandCategory(category.name) || (isCollapsed && !isMobile)) && (
                  <div className={cn(
                    "mt-1", 
                    isCollapsed && !isMobile && "absolute left-16 top-0 bg-sidebar border border-sidebar-border rounded-lg shadow-lg p-2 z-50"
                  )}>
                    {category.tools.map((tool) => (
                      <div key={tool.id} className="relative group">
                        <Link to={`/ferramenta/${tool.id}`} className="block w-full" onClick={handleToolClick}>
                          <Button
                            variant="ghost"
                            className={cn(
                              "w-full justify-start h-9 px-3 mb-1 hover:bg-sidebar-accent",
                              activeTool === tool.id && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90",
                              isCollapsed && !isMobile && "justify-center px-0 mb-0"
                            )}
                          >
                            <tool.icon className={cn("w-4 h-4 flex-shrink-0", (!isCollapsed || isMobile) && "mr-3")} />
                            {(!isCollapsed || isMobile) && (
                              <span className="text-sm truncate">{tool.name}</span>
                            )}
                          </Button>
                        </Link>
                        {isCollapsed && !isMobile && (
                          <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 bg-popover border border-border rounded-md px-3 py-2 text-sm text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-md">
                            {tool.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        {(!isCollapsed || isMobile) && (
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>2Data Brasil v2.0</span>
              <Badge variant="outline" className="text-xs">
                {totalTools} ferramentas
              </Badge>
            </div>
          </div>
        )}
      </div>
    </>
  );
};