import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Copy, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CompanyData {
  nome: string;
  cnpj: string;
  inscricaoEstadual: string;
  cep: string;
  endereco: string;
  numero: number;
  bairro: string;
  cidade: string;
  estado: string;
}

const brazilianStates = [
  { code: 'SP', name: 'São Paulo' },
  { code: 'RJ', name: 'Rio de Janeiro' },
  { code: 'MG', name: 'Minas Gerais' },
  { code: 'RS', name: 'Rio Grande do Sul' },
  { code: 'PR', name: 'Paraná' },
  { code: 'SC', name: 'Santa Catarina' },
  { code: 'BA', name: 'Bahia' },
  { code: 'GO', name: 'Goiás' },
  { code: 'PE', name: 'Pernambuco' },
  { code: 'CE', name: 'Ceará' }
];

const companyTypes = ['Ltda', 'S.A.', 'ME', 'EPP', 'EIRELI'];
const businessAreas = ['Tecnologia', 'Consultoria', 'Comércio', 'Serviços', 'Indústria', 'Construção', 'Alimentação', 'Educação'];

export const CompanyGenerator = () => {
  const [selectedState, setSelectedState] = useState('SP');
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const { toast } = useToast();

  const generateCNPJ = (): string => {
    const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
    
    // Primeiro dígito verificador
    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * weights1[i];
    }
    let firstDigit = 11 - (sum % 11);
    firstDigit = firstDigit >= 10 ? 0 : firstDigit;
    
    // Segundo dígito verificador
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += digits[i] * weights2[i];
    }
    sum += firstDigit * weights2[12];
    let secondDigit = 11 - (sum % 11);
    secondDigit = secondDigit >= 10 ? 0 : secondDigit;
    
    const cnpj = [...digits, firstDigit, secondDigit].join('');
    return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const generateStateRegistration = (state: string): string => {
    const stateFormats: { [key: string]: () => string } = {
      SP: () => {
        const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
        return digits.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '$1.$2.$3.$4');
      },
      RJ: () => {
        const digits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10));
        return digits.join('').replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
      },
      MG: () => {
        const digits = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10));
        return digits.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{4})/, '$1.$2.$3.$4');
      }
    };
    
    return stateFormats[state] ? stateFormats[state]() : stateFormats.SP();
  };

  const generateCompany = (): CompanyData => {
    const businessArea = businessAreas[Math.floor(Math.random() * businessAreas.length)];
    const companyType = companyTypes[Math.floor(Math.random() * companyTypes.length)];
    const companyName = `${businessArea} ${['Alpha', 'Beta', 'Gamma', 'Delta', 'Sigma'][Math.floor(Math.random() * 5)]} ${companyType}`;
    
    const cities = {
      SP: ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto'],
      RJ: ['Rio de Janeiro', 'Niterói', 'Nova Iguaçu', 'Campos'],
      MG: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora']
    };
    
    const selectedStateName = brazilianStates.find(s => s.code === selectedState)?.name || 'São Paulo';
    const cityList = cities[selectedState as keyof typeof cities] || cities.SP;
    const city = cityList[Math.floor(Math.random() * cityList.length)];
    
    return {
      nome: companyName,
      cnpj: generateCNPJ(),
      inscricaoEstadual: generateStateRegistration(selectedState),
      cep: `${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
      endereco: `Rua ${['Comercial', 'Industrial', 'Empresarial'][Math.floor(Math.random() * 3)]} ${Math.floor(Math.random() * 1000) + 1}`,
      numero: Math.floor(Math.random() * 9999) + 1,
      bairro: `Centro ${['Empresarial', 'Comercial', 'Industrial'][Math.floor(Math.random() * 3)]}`,
      cidade: city,
      estado: selectedStateName
    };
  };

  const handleGenerate = () => {
    const company = generateCompany();
    setCompanyData(company);
  };

  const copyToClipboard = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência.`,
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Building2 className="w-6 h-6" />
            Gerador de Documentos de Empresas
          </CardTitle>
          <CardDescription className="text-center">
            Gerador de dados de empresas fictícias com CNPJ, Inscrição Estadual e endereço
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <div>
              <Label htmlFor="state" className="text-sm font-medium">
                Estado:
              </Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {brazilianStates.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-center">
              <Button 
                onClick={handleGenerate}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white px-8 py-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Gerar Empresa
              </Button>
            </div>
          </div>

          {companyData && (
            <div className="space-y-4">
              <Label className="text-sm font-medium">Dados Gerados:</Label>
              
              <div className="grid grid-cols-1 gap-3">
                {[
                  { label: 'Nome da Empresa', value: companyData.nome },
                  { label: 'CNPJ', value: companyData.cnpj },
                  { label: 'Inscrição Estadual', value: companyData.inscricaoEstadual },
                  { label: 'CEP', value: companyData.cep },
                  { label: 'Endereço', value: `${companyData.endereco}, ${companyData.numero}` },
                  { label: 'Bairro', value: companyData.bairro },
                  { label: 'Cidade', value: companyData.cidade },
                  { label: 'Estado', value: companyData.estado },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                    <div>
                      <span className="text-sm text-green-600 font-medium">{item.label}: </span>
                      <span className="font-semibold text-green-800">{item.value}</span>
                    </div>
                    <Button
                      onClick={() => copyToClipboard(item.value, item.label)}
                      variant="outline"
                      size="sm"
                      className="border-green-300 hover:bg-green-100"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>IMPORTANTE:</strong> Nosso gerador de documentos de empresas tem como intenção ajudar estudantes, 
              programadores, analistas e testadores a gerar dados de empresas fictícias para teste de software.
            </p>
            <p>
              A má utilização dos dados aqui gerados é de total responsabilidade do usuário.
            </p>
            <p>
              Os números são gerados de forma aleatória, respeitando as regras de criação de cada documento.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};