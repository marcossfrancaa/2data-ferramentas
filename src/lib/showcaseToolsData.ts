import { 
  CreditCard, 
  QrCode, 
  Hash, 
  Key, 
  Calculator, 
  FileText, 
  Code, 
  Palette,
  Mail,
  Building2,
  Car,
  Globe,
  Shield,
  Activity,
  Clock,
  Binary
} from 'lucide-react';

export interface ShowcaseTool {
  id: string;
  title: string;
  description: string;
  icon: any;
  link: string;
  animationType: 'cpf' | 'qrcode' | 'card' | 'hash' | 'password' | 'json' | 'color' | 'calculator';
  category: string;
  color: string;
}

export const showcaseTools: ShowcaseTool[] = [
  {
    id: 'cpf-generator',
    title: 'Gerador de CPF',
    description: 'Crie números de CPF válidos para testes e desenvolvimento',
    icon: CreditCard,
    link: '/ferramenta/cpf-generator',
    animationType: 'cpf',
    category: 'GERADORES',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'qr-generator', 
    title: 'Gerador QR Code',
    description: 'Gere QR Codes para PIX, links, Wi-Fi e muito mais',
    icon: QrCode,
    link: '/ferramenta/qr-generator',
    animationType: 'qrcode',
    category: 'GERADORES',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'credit-card-generator',
    title: 'Gerador de Cartão',
    description: 'Cartões de crédito válidos para testes de interface',
    icon: CreditCard,
    link: '/ferramenta/credit-card-generator',
    animationType: 'card',
    category: 'GERADORES',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'hash-generator',
    title: 'Gerador Hash',
    description: 'Hashes MD5, SHA256, SHA512 para segurança',
    icon: Hash,
    link: '/ferramenta/hash-generator',
    animationType: 'hash',
    category: 'GERADORES',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'password-generator',
    title: 'Gerador de Senhas',
    description: 'Senhas seguras com caracteres personalizáveis',
    icon: Key,
    link: '/ferramenta/password-generator',
    animationType: 'password',
    category: 'GERADORES',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'json-formatter',
    title: 'Formatador JSON',
    description: 'Formate, valide e minifique dados JSON',
    icon: FileText,
    link: '/ferramenta/json-formatter',
    animationType: 'json',
    category: 'CONVERSORES',
    color: 'from-teal-500 to-cyan-500'
  },
  {
    id: 'color-converter',
    title: 'Conversor de Cores',
    description: 'Converta entre HEX, RGB, HSL e mais formatos',
    icon: Palette,
    link: '/ferramenta/color-converter',
    animationType: 'color',
    category: 'CONVERSORES',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    id: 'calculator',
    title: 'Calculadora Científica',
    description: 'Calculadora avançada com funções matemáticas',
    icon: Calculator,
    link: '/ferramenta/calculator',
    animationType: 'calculator',
    category: 'CALCULADORAS',
    color: 'from-slate-500 to-gray-500'
  }
];