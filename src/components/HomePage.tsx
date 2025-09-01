
import { Card } from '@/components/ui/card';
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
  Link,
  MessageCircle,
  Shield,
  Timer,
  Settings,
  Database,
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
  StickyNote,
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
  Thermometer
} from 'lucide-react';

interface HomePageProps {
  onToolSelect: (toolId: string) => void;
}

const allTools = [
  // GERADORES
  { id: 'cpf-generator', name: 'Gerador CPF', icon: CreditCard, category: 'GERADORES', description: 'Gera CPFs válidos para testes' },
  { id: 'rg-generator', name: 'Gerador de RG', icon: CreditCard, category: 'GERADORES', description: 'Gera RGs válidos por estado' },
  { id: 'cnpj-generator', name: 'Gerador CNPJ', icon: Building2, category: 'GERADORES', description: 'Gera CNPJs válidos para testes' },
  { id: 'cnh-generator', name: 'Gerador de CNH', icon: Car, category: 'GERADORES', description: 'Gera CNH com categoria' },
  { id: 'uuid-generator', name: 'Gerador UUID', icon: Key, category: 'GERADORES', description: 'Gera identificadores únicos' },
  { id: 'hash-generator', name: 'Gerador Hash', icon: Hash, category: 'GERADORES', description: 'Gera hashes MD5, SHA256' },
  { id: 'password-generator', name: 'Gerador Senha', icon: Key, category: 'GERADORES', description: 'Senhas seguras personalizadas' },
  { id: 'pix-generator', name: 'Gerador PIX', icon: Smartphone, category: 'GERADORES', description: 'Códigos PIX para pagamentos' },
  { id: 'wifi-qr-generator', name: 'QR Code Wi-Fi', icon: Wifi, category: 'GERADORES', description: 'QR Code para conexão Wi-Fi' },
  { id: 'qr-generator', name: 'Gerador QR Code', icon: QrCode, category: 'GERADORES', description: 'QR Codes personalizados' },
  { id: 'names-generator', name: 'Gerador de Nomes', icon: User, category: 'GERADORES', description: 'Nomes brasileiros aleatórios' },
  { id: 'nick-generator', name: 'Gerador de Nicks', icon: UserX, category: 'GERADORES', description: 'Nicknames criativos' },
  { id: 'random-number-generator', name: 'Números Aleatórios', icon: Hash, category: 'GERADORES', description: 'Gera números aleatórios' },
  { id: 'pis-generator', name: 'Gerador PIS/PASEP', icon: CreditCard, category: 'GERADORES', description: 'PIS/PASEP válidos' },
  { id: 'vehicle-generator', name: 'Gerador de Veículos', icon: Car, category: 'GERADORES', description: 'Dados completos de veículos' },
  { id: 'license-plate-generator', name: 'Placas de Veículos', icon: Car, category: 'GERADORES', description: 'Placas Mercosul válidas' },
  { id: 'email-generator', name: 'Gerador de E-mail', icon: Mail, category: 'GERADORES', description: 'E-mails temporários' },
  { id: 'temporary-email', name: 'E-mail Temporário', icon: Mail, category: 'GERADORES', description: 'E-mail descartável com GuerrillaMail' },
  { id: 'credit-card-generator', name: 'Gerador de Cartão', icon: CreditCard, category: 'GERADORES', description: 'Cartões válidos para teste' },
  { id: 'whatsapp-generator', name: 'Link WhatsApp', icon: MessageCircle, category: 'GERADORES', description: 'Links diretos WhatsApp' },
  { id: 'link-shortener', name: 'Encurtador de Link', icon: Link, category: 'GERADORES', description: 'Encurta URLs longas' },
  { id: 'lorem-generator', name: 'Lorem Ipsum', icon: FileText, category: 'GERADORES', description: 'Texto placeholder' },
  { id: 'css-generator', name: 'Gerador CSS', icon: Palette, category: 'GERADORES', description: 'Gera código CSS' },
  { id: 'cron-generator', name: 'Gerador CRON', icon: Clock, category: 'GERADORES', description: 'Expressões CRON para agendamento' },
  { id: 'barcode-generator', name: 'Gerador Código Barras', icon: ScanLine, category: 'GERADORES', description: 'Códigos de barras personalizados' },
  { id: 'gradient-generator', name: 'Gerador Gradiente', icon: Palette, category: 'GERADORES', description: 'Gradientes CSS personalizados' },
  { id: 'favicon-generator', name: 'Gerador Favicon', icon: ImageIcon, category: 'GERADORES', description: 'Favicons para websites' },
  { id: 'mockup-generator', name: 'Gerador Mockup', icon: Monitor, category: 'GERADORES', description: 'Mockups para apresentações' },
  { id: 'certificate-generator', name: 'Gerador Certificado SSL', icon: ShieldCheck, category: 'GERADORES', description: 'Certificados SSL para teste' },
  { id: 'sitemap-generator', name: 'Gerador Sitemap', icon: Network, category: 'GERADORES', description: 'Sitemaps XML automáticos' },
  { id: 'robots-generator', name: 'Gerador robots.txt', icon: Settings, category: 'GERADORES', description: 'Arquivo robots.txt personalizado' },
  { id: 'htaccess-generator', name: 'Gerador .htaccess', icon: FileText, category: 'GERADORES', description: 'Configurações Apache' },

  // VALIDADORES
  { id: 'cpf-validator', name: 'Validador CPF', icon: CreditCard, category: 'VALIDADORES', description: 'Valida CPFs brasileiros' },
  { id: 'cnpj-validator', name: 'Validador CNPJ', icon: Building2, category: 'VALIDADORES', description: 'Valida CNPJs brasileiros' },
  { id: 'credit-card-validator', name: 'Validador Cartão', icon: CreditCard, category: 'VALIDADORES', description: 'Valida cartões de crédito' },
  { id: 'email-validator', name: 'Validador E-mail', icon: Mail, category: 'VALIDADORES', description: 'Valida endereços de e-mail' },
  { id: 'url-validator', name: 'Validador URL', icon: Globe, category: 'VALIDADORES', description: 'Valida URLs e links' },
  { id: 'ip-validator', name: 'Validador IP', icon: Network, category: 'VALIDADORES', description: 'Valida endereços IP' },
  { id: 'phone-validator', name: 'Validador Telefone', icon: Phone, category: 'VALIDADORES', description: 'Valida números telefônicos' },
  { id: 'cep-validator', name: 'Validador CEP', icon: MapPin, category: 'VALIDADORES', description: 'Valida códigos postais' },
  { id: 'domain-validator', name: 'Validador Domínio', icon: Globe, category: 'VALIDADORES', description: 'Valida nomes de domínio' },
  { id: 'ssl-validator', name: 'Validador SSL', icon: ShieldCheck, category: 'VALIDADORES', description: 'Valida certificados SSL' },

  // CALCULADORAS
  { id: 'age-calculator', name: 'Calculadora Idade', icon: Calculator, category: 'CALCULADORAS', description: 'Calcula idade precisa' },
  { id: 'percentage-calculator', name: 'Calculadora %', icon: Percent, category: 'CALCULADORAS', description: 'Cálculos de porcentagem' },
  { id: 'compound-interest-calculator', name: 'Juros Compostos', icon: TrendingUp, category: 'CALCULADORAS', description: 'Simula investimentos' },
  { id: 'date-calculator', name: 'Calculadora Datas', icon: Calendar, category: 'CALCULADORAS', description: 'Opera com datas' },
  { id: 'loan-calculator', name: 'Calculadora Empréstimo', icon: DollarSign, category: 'CALCULADORAS', description: 'Simula empréstimos' },
  { id: 'mortgage-calculator', name: 'Calculadora Financiamento', icon: House, category: 'CALCULADORAS', description: 'Simula financiamentos' },
  { id: 'salary-calculator', name: 'Calculadora Salarial', icon: DollarSign, category: 'CALCULADORAS', description: 'Cálculos trabalhistas' },
  { id: 'tax-calculator', name: 'Calculadora Impostos', icon: Calculator, category: 'CALCULADORAS', description: 'Cálculo de impostos' },
  { id: 'bmi-calculator', name: 'Calculadora IMC', icon: Activity, category: 'CALCULADORAS', description: 'Índice Massa Corporal' },
  { id: 'tip-calculator', name: 'Calculadora Gorjeta', icon: DollarSign, category: 'CALCULADORAS', description: 'Calcula gorjetas' },

  // CONVERSORES
  { id: 'color-converter', name: 'Conversor Cores', icon: Palette, category: 'CONVERSORES', description: 'Converte HEX, RGB, HSL' },
  { id: 'currency-converter', name: 'Conversor Moedas', icon: DollarSign, category: 'CONVERSORES', description: 'Converte entre moedas' },
  { id: 'temperature-converter', name: 'Conversor Temperatura', icon: Thermometer, category: 'CONVERSORES', description: 'Celsius, Fahrenheit, Kelvin' },
  { id: 'json-formatter', name: 'Formatador JSON', icon: FileText, category: 'CONVERSORES', description: 'Formata e valida JSON' },
  { id: 'base64-converter', name: 'Base64 Converter', icon: Code, category: 'CONVERSORES', description: 'Codifica/decodifica Base64' },
  { id: 'url-encoder', name: 'Codificador URL', icon: Globe, category: 'CONVERSORES', description: 'Codifica URLs seguras' },
  { id: 'html-encoder', name: 'HTML Encoder', icon: Code, category: 'CONVERSORES', description: 'Escapa caracteres HTML' },
  { id: 'number-base-converter', name: 'Conversor Bases', icon: Binary, category: 'CONVERSORES', description: 'Bin, Oct, Dec, Hex' },
  { id: 'unit-converter', name: 'Conversor Unidades', icon: Ruler, category: 'CONVERSORES', description: 'Metro, pé, kg, etc' },
  { id: 'sql-formatter', name: 'Formatador SQL', icon: Database, category: 'CONVERSORES', description: 'Formata queries SQL' },
  { id: 'xml-formatter', name: 'Formatador XML', icon: Code, category: 'CONVERSORES', description: 'Formata documentos XML' },
  { id: 'css-formatter', name: 'Formatador CSS', icon: Palette, category: 'CONVERSORES', description: 'Formata folhas de estilo' },
  { id: 'html-formatter', name: 'Formatador HTML', icon: Code, category: 'CONVERSORES', description: 'Formata documentos HTML' },
  { id: 'js-formatter', name: 'Formatador JavaScript', icon: Code, category: 'CONVERSORES', description: 'Formata código JS' },
  { id: 'timestamp-converter', name: 'Conversor Timestamp', icon: Clock, category: 'CONVERSORES', description: 'Unix timestamp para data' },
  { id: 'case-converter', name: 'Conversor Texto', icon: Type, category: 'CONVERSORES', description: 'Maiúsculo, minúsculo, etc' },
  { id: 'csv-to-json-converter', name: 'CSV → JSON', icon: FileText, category: 'CONVERSORES', description: 'Converte CSV para JSON' },
  { id: 'geocoding-converter', name: 'Geocoding Reverso', icon: MapPin, category: 'CONVERSORES', description: 'Endereços ↔ Coordenadas' },

  // UTILITÁRIOS
  { id: 'calculator', name: 'Calculadora', icon: Calculator, category: 'UTILITÁRIOS', description: 'Calculadora científica' },
  { id: 'text-diff', name: 'Comparar Textos', icon: FileText, category: 'UTILITÁRIOS', description: 'Compara diferenças' },
  { id: 'regex-tester', name: 'Testador RegEx', icon: Code, category: 'UTILITÁRIOS', description: 'Testa expressões regulares' },
  { id: 'word-counter', name: 'Contador Palavras', icon: Type, category: 'UTILITÁRIOS', description: 'Conta caracteres e palavras' },
  { id: 'email-separator', name: 'Separador E-mail', icon: Mail, category: 'UTILITÁRIOS', description: 'Organiza listas de email' },
  { id: 'metadata-remover', name: 'Remove Metadados', icon: Shield, category: 'UTILITÁRIOS', description: 'Remove EXIF de imagens' },
  { id: 'jwt-decoder', name: 'JWT Decoder', icon: Key, category: 'UTILITÁRIOS', description: 'Decodifica tokens JWT' },
  { id: 'api-tester', name: 'Testador API', icon: Settings, category: 'UTILITÁRIOS', description: 'Testa endpoints REST' },
  { id: 'image-optimizer', name: 'Otimizador Imagem', icon: ImageIcon, category: 'UTILITÁRIOS', description: 'Comprime e otimiza imagens' },
  { id: 'color-picker', name: 'Seletor Cores', icon: Palette, category: 'UTILITÁRIOS', description: 'Seleciona cores da tela' },
  { id: 'screenshot-tool', name: 'Captura Tela', icon: Camera, category: 'UTILITÁRIOS', description: 'Screenshots de páginas' },
  { id: 'pdf-tools', name: 'Ferramentas PDF', icon: FileText, category: 'UTILITÁRIOS', description: 'Merge, split, compress PDF' },
  { id: 'link-checker', name: 'Verificador Links', icon: Link, category: 'UTILITÁRIOS', description: 'Verifica links quebrados' },
  { id: 'seo-analyzer', name: 'Analisador SEO', icon: Search, category: 'UTILITÁRIOS', description: 'Analisa SEO de páginas' },
  { id: 'website-speed', name: 'Velocidade Site', icon: Zap, category: 'UTILITÁRIOS', description: 'Testa velocidade de sites' },
  { id: 'browser-info', name: 'Info Navegador', icon: Monitor, category: 'UTILITÁRIOS', description: 'Informações do browser' },
  { id: 'device-info', name: 'Info Dispositivo', icon: Smartphone, category: 'UTILITÁRIOS', description: 'Informações do device' },
  { id: 'ip-info', name: 'Informações IP', icon: Network, category: 'UTILITÁRIOS', description: 'Localização e dados IP' },
  { id: 'dns-lookup', name: 'Consulta DNS', icon: Network, category: 'UTILITÁRIOS', description: 'Resolve registros DNS' },
  { id: 'dns-propagation-checker', name: 'Propagação DNS', icon: Globe, category: 'UTILITÁRIOS', description: 'Verifica propagação DNS global' },
  { id: 'whois-lookup', name: 'Consulta WHOIS', icon: Search, category: 'UTILITÁRIOS', description: 'Dados do proprietário' },
  { id: 'port-scanner', name: 'Scanner Portas', icon: Shield, category: 'UTILITÁRIOS', description: 'Escaneia portas abertas' },
  { id: 'ping-latency-test', name: 'Teste Ping/Latência', icon: Wifi, category: 'UTILITÁRIOS', description: 'Mede resposta de servidores' },
  { id: 'ssh-key-generator', name: 'Gerador SSH/GPG', icon: Key, category: 'DESENVOLVIMENTO', description: 'Gera chaves SSH e GPG' },
  { id: 'lorem-picsum-generator', name: 'Lorem Picsum', icon: ImageIcon, category: 'DESIGN', description: 'Imagens placeholder aleatórias' },
  { id: 'image-converter', name: 'Conversor Imagens', icon: ImageIcon, category: 'DESIGN', description: 'Converte PNG ↔ JPG ↔ WebP' },
  { id: 'traceroute-tool', name: 'Traceroute', icon: Network, category: 'UTILITÁRIOS', description: 'Rastreia rota de rede' },
  { id: 'bandwidth-test', name: 'Teste Largura Banda', icon: Activity, category: 'UTILITÁRIOS', description: 'Velocidade da internet' },
  { id: 'text-reverser', name: 'Inverter Texto', icon: Type, category: 'UTILITÁRIOS', description: 'Inverte caracteres do texto' },
  { id: 'duplicate-line-remover', name: 'Remover Linhas Duplicadas', icon: Type, category: 'UTILITÁRIOS', description: 'Remove linhas repetidas' },
  { id: 'upside-down-text', name: 'Texto de Cabeça para Baixo', icon: Type, category: 'UTILITÁRIOS', description: 'Texto invertido especial' },
  { id: 'synonym-generator', name: 'Textos Sinônimos', icon: Type, category: 'UTILITÁRIOS', description: 'Encontra sinônimos' },
  { id: 'find-and-replace', name: 'Localizar e Substituir', icon: Type, category: 'UTILITÁRIOS', description: 'Busca e substitui texto' },

  // PRODUTIVIDADE
  { id: 'pomodoro-timer', name: 'Timer Pomodoro', icon: Timer, category: 'PRODUTIVIDADE', description: 'Técnica de produtividade' },
  { id: 'todo-list', name: 'Lista Tarefas', icon: CheckCircle, category: 'PRODUTIVIDADE', description: 'Organiza suas tarefas' },
  { id: 'note-taking', name: 'Bloco Notas', icon: StickyNote, category: 'PRODUTIVIDADE', description: 'Anotações rápidas' },
  { id: 'stopwatch', name: 'Cronômetro', icon: Clock, category: 'PRODUTIVIDADE', description: 'Cronometra tempo' },
  { id: 'world-clock', name: 'Relógio Mundial', icon: Globe, category: 'PRODUTIVIDADE', description: 'Fusos horários mundiais' },
  { id: 'calendar-tool', name: 'Calendário', icon: Calendar, category: 'PRODUTIVIDADE', description: 'Agenda e eventos' },
  { id: 'reminder-tool', name: 'Lembretes', icon: Bell, category: 'PRODUTIVIDADE', description: 'Lembretes importantes' },
  { id: 'habit-tracker', name: 'Rastreador Hábitos', icon: Target, category: 'PRODUTIVIDADE', description: 'Acompanha hábitos' },
  { id: 'goal-tracker', name: 'Rastreador Metas', icon: Trophy, category: 'PRODUTIVIDADE', description: 'Acompanha objetivos' },
  { id: 'expense-tracker', name: 'Controle Gastos', icon: DollarSign, category: 'PRODUTIVIDADE', description: 'Controla despesas' },

  // CONSULTAS
  { id: 'cep-lookup', name: 'Consulta CEP', icon: MapPin, category: 'CONSULTAS', description: 'Busca endereços por CEP' },
  { id: 'cnpj-lookup', name: 'Consulta CNPJ', icon: Building2, category: 'CONSULTAS', description: 'Dados da Receita Federal' },
  { id: 'ddd-lookup', name: 'Consulta DDD', icon: Phone, category: 'CONSULTAS', description: 'Localiza por código DDD' },
  { id: 'fipe-lookup', name: 'Consulta FIPE', icon: Car, category: 'CONSULTAS', description: 'Preços de veículos' },
  { id: 'bank-lookup', name: 'Consulta Bancos', icon: CreditCard, category: 'CONSULTAS', description: 'Códigos bancários' },
  { id: 'cpf-lookup', name: 'Consulta CPF', icon: User, category: 'CONSULTAS', description: 'Verifica situação CPF' },
  { id: 'cnh-lookup', name: 'Consulta CNH', icon: Car, category: 'CONSULTAS', description: 'Dados da CNH' },
  { id: 'ibge-lookup', name: 'Consulta IBGE', icon: BarChart3, category: 'CONSULTAS', description: 'Dados estatísticos' },
  { id: 'weather-lookup', name: 'Consulta Clima', icon: Cloud, category: 'CONSULTAS', description: 'Previsão do tempo' },
  { id: 'currency-lookup', name: 'Cotação Moedas', icon: DollarSign, category: 'CONSULTAS', description: 'Câmbio atual' },

  // SEGURANÇA
  { id: 'password-strength', name: 'Força Senha', icon: Shield, category: 'SEGURANÇA', description: 'Avalia segurança senhas' },
  { id: 'hash-checker', name: 'Verificador Hash', icon: Hash, category: 'SEGURANÇA', description: 'Verifica integridade' },
  { id: 'ssl-checker', name: 'Verificador SSL', icon: ShieldCheck, category: 'SEGURANÇA', description: 'Status certificados SSL' },
  { id: 'virus-scan', name: 'Scanner Vírus', icon: Shield, category: 'SEGURANÇA', description: 'Escaneia arquivos' },
  { id: 'malware-check', name: 'Verificador Malware', icon: ShieldCheck, category: 'SEGURANÇA', description: 'Detecta malware' },
  { id: 'phishing-check', name: 'Verificador Phishing', icon: AlertTriangle, category: 'SEGURANÇA', description: 'Detecta sites falsos' },
  { id: 'blacklist-check', name: 'Verificador Blacklist', icon: XCircle, category: 'SEGURANÇA', description: 'Verifica listas negras' },
  { id: 'vulnerability-scan', name: 'Scanner Vulnerabilidade', icon: Search, category: 'SEGURANÇA', description: 'Busca vulnerabilidades' },
  { id: 'firewall-test', name: 'Teste Firewall', icon: Shield, category: 'SEGURANÇA', description: 'Testa configurações' },
  { id: 'encryption-tool', name: 'Ferramenta Criptografia', icon: Lock, category: 'SEGURANÇA', description: 'Criptografa dados' },
];

const categories = ['GERADORES', 'VALIDADORES', 'CALCULADORAS', 'CONVERSORES', 'UTILITÁRIOS', 'PRODUTIVIDADE', 'CONSULTAS', 'SEGURANÇA'];

export const HomePage = ({ onToolSelect }: HomePageProps) => {
  const totalTools = allTools.length;

  return (
    <div className="container-responsive">
      {/* Header */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <Wrench className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary" />
          <h1 className="title-h1">2Data Brasil</h1>
        </div>
        <p className="text-responsive-lg text-muted-foreground mb-4 sm:mb-6 px-4">
          Ferramentas gratuitas para desenvolvedores e profissionais
        </p>
        <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-primary/10 text-primary rounded-full text-xs sm:text-sm font-medium">
          <span>{totalTools} ferramentas disponíveis</span>
        </div>
      </div>

      {/* Tools Grid */}
      {categories.map(category => {
        const categoryTools = allTools.filter(tool => tool.category === category);
        if (categoryTools.length === 0) return null;

        return (
          <div key={category} id={`category-${category}`} className="mb-8 sm:mb-10 md:mb-12 scroll-mt-20">
            <h2 className="title-h3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 px-2 sm:px-0">
              <span>{category}</span>
              <span className="text-xs sm:text-sm text-muted-foreground font-normal">
                ({categoryTools.length})
              </span>
            </h2>
            
            <div className="tools-grid">
              {categoryTools.map(tool => (
                <Card 
                  key={tool.id} 
                  className="spacing-sm hover:shadow-lg hover-lift cursor-pointer bg-gradient-card border-border/50"
                  onClick={() => onToolSelect(tool.id)}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
                      <tool.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-card-foreground text-sm sm:text-base mb-1 truncate">
                        {tool.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
