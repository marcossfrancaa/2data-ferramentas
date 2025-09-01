import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Car, Copy, RefreshCw, ChevronDown, User, Users, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { faker } from '@faker-js/faker';

const categorias = [
  'A', 'B', 'C', 'D', 'E', 'AB', 'AC', 'AD', 'AE'
];

const estados = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
];

interface CNHData {
  numero: string;
  categoria: string;
  dataVencimento: string;
  estado: string;
  nome?: string;
  dataNascimento?: string;
  filiacao?: string;
  rg?: string;
  cpf?: string;
}

export const CnhGenerator = () => {
  const [cnh, setCnh] = useState('');
  const [categoria, setCategoria] = useState('B');
  const [estado, setEstado] = useState('SP');
  const [primeiraHabilitacao, setPrimeiraHabilitacao] = useState(false);
  const [dataVencimento, setDataVencimento] = useState('');
  const [showPortadorData, setShowPortadorData] = useState(false);
  const [portadorData, setPortadorData] = useState<any>(null);
  const [showMultiple, setShowMultiple] = useState(false);
  const [quantidade, setQuantidade] = useState(5);
  const [multipleCnhs, setMultipleCnhs] = useState<CNHData[]>([]);
  const { toast } = useToast();

  const generateCNH = (overrideCategoria?: string, overrideEstado?: string) => {
    // Gera 11 dígitos para CNH
    const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    
    // Calcula os dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (9 - i);
    }
    let firstDigit = sum % 11;
    if (firstDigit >= 10) firstDigit = 0;
    
    sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (1 + i);
    }
    sum += firstDigit * 2;
    let secondDigit = sum % 11;
    if (secondDigit >= 10) secondDigit = 0;
    
    digits.push(firstDigit, secondDigit);
    
    const cnhNumber = digits.join('');
    setCnh(cnhNumber);
    
    // Gera data de vencimento
    const today = new Date();
    let futureDate: Date;
    
    if (primeiraHabilitacao) {
      // PPD: exatamente 1 ano a partir de hoje
      futureDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
    } else {
      // 1-5 anos no futuro
      futureDate = new Date(today.getFullYear() + Math.floor(Math.random() * 5) + 1, 
                           Math.floor(Math.random() * 12), 
                           Math.floor(Math.random() * 28) + 1);
    }
    
    setDataVencimento(futureDate.toLocaleDateString('pt-BR'));
    return cnhNumber;
  };

  const generatePortadorData = () => {
    const data = {
      nome: faker.person.fullName(),
      dataNascimento: faker.date.birthdate({ min: 18, max: 80, mode: 'age' }).toLocaleDateString('pt-BR'),
      filiacao: `${faker.person.fullName()} e ${faker.person.fullName()}`,
      rg: `${faker.number.int({ min: 10000000, max: 99999999 })}-${faker.number.int({ min: 0, max: 9 })}`,
      cpf: generateCPF()
    };
    setPortadorData(data);
  };

  const generateCPF = () => {
    const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    
    // Primeiro dígito verificador
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i);
    }
    let firstDigit = (sum * 10) % 11;
    if (firstDigit === 10) firstDigit = 0;
    
    // Segundo dígito verificador
    sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (11 - i);
    }
    sum += firstDigit * 2;
    let secondDigit = (sum * 10) % 11;
    if (secondDigit === 10) secondDigit = 0;
    
    digits.push(firstDigit, secondDigit);
    return `${digits.slice(0, 3).join('')}.${digits.slice(3, 6).join('')}.${digits.slice(6, 9).join('')}-${digits.slice(9).join('')}`;
  };

  const generateMultipleCNHs = () => {
    const cnhs: CNHData[] = [];
    for (let i = 0; i < quantidade; i++) {
      const randomCategoria = categorias[Math.floor(Math.random() * categorias.length)];
      const randomEstado = estados[Math.floor(Math.random() * estados.length)];
      const cnhNumber = generateSingleCNH(randomCategoria, randomEstado.sigla);
      
      cnhs.push({
        numero: cnhNumber,
        categoria: randomCategoria,
        dataVencimento: generateVencimento(),
        estado: randomEstado.sigla
      });
    }
    setMultipleCnhs(cnhs);
  };

  const generateSingleCNH = (cat: string, est: string) => {
    const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (9 - i);
    }
    let firstDigit = sum % 11;
    if (firstDigit >= 10) firstDigit = 0;
    
    sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (1 + i);
    }
    sum += firstDigit * 2;
    let secondDigit = sum % 11;
    if (secondDigit >= 10) secondDigit = 0;
    
    digits.push(firstDigit, secondDigit);
    return digits.join('');
  };

  const generateVencimento = () => {
    const today = new Date();
    const futureDate = new Date(today.getFullYear() + Math.floor(Math.random() * 5) + 1, 
                               Math.floor(Math.random() * 12), 
                               Math.floor(Math.random() * 28) + 1);
    return futureDate.toLocaleDateString('pt-BR');
  };

  const exportData = (format: 'csv' | 'json' | 'txt') => {
    let content = '';
    let filename = '';
    let mimeType = '';

    if (format === 'csv') {
      content = 'CNH,Categoria,Vencimento,Estado\n' +
        multipleCnhs.map(cnh => `${cnh.numero},${cnh.categoria},${cnh.dataVencimento},${cnh.estado}`).join('\n');
      filename = 'cnhs.csv';
      mimeType = 'text/csv';
    } else if (format === 'json') {
      content = JSON.stringify(multipleCnhs, null, 2);
      filename = 'cnhs.json';
      mimeType = 'application/json';
    } else if (format === 'txt') {
      content = multipleCnhs.map(cnh => 
        `CNH: ${cnh.numero} | Categoria: ${cnh.categoria} | Vencimento: ${cnh.dataVencimento} | Estado: ${cnh.estado}`
      ).join('\n');
      filename = 'cnhs.txt';
      mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Exportado!",
      description: `Arquivo ${filename} baixado com sucesso`,
    });
  };

  // Geração reativa
  useEffect(() => {
    generateCNH();
  }, [categoria, estado, primeiraHabilitacao]);

  // Gerar CNH inicial ao carregar
  useEffect(() => {
    generateCNH();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "CNH copiada para a área de transferência",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Car className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de CNH</h1>
        </div>
        <p className="text-muted-foreground">
          Gera números de CNH válidos para teste e desenvolvimento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Configurações
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      Categoria {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estado">Estado (UF)</Label>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((est) => (
                    <SelectItem key={est.sigla} value={est.sigla}>
                      {est.nome} ({est.sigla})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ppd" 
                checked={primeiraHabilitacao}
                onCheckedChange={(checked) => setPrimeiraHabilitacao(checked === true)}
              />
              <Label 
                htmlFor="ppd" 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Gerar como Primeira Habilitação (PPD)
              </Label>
            </div>
          </div>

          <Button
            onClick={() => generateCNH()}
            className="w-full mt-6"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Gerar Novamente
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            CNH Gerada
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label>Número da CNH</Label>
              <div className="flex gap-2">
                <Input
                  value={cnh}
                  readOnly
                  placeholder="CNH será gerada aqui"
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(cnh)}
                  disabled={!cnh}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {categoria && (
              <div>
                <Label>Categoria</Label>
                <div className="flex gap-2">
                  <Input
                    value={`Categoria ${categoria}`}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(categoria)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {dataVencimento && (
              <div>
                <Label>Data de Vencimento</Label>
                <div className="flex gap-2">
                  <Input
                    value={dataVencimento}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(dataVencimento)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Seção Dados do Portador */}
      <Collapsible open={showPortadorData} onOpenChange={setShowPortadorData} className="mt-6">
        <Card className="p-6">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-card-foreground">
                  Gerar Dados do Portador
                </h3>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showPortadorData ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-4">
            <div className="space-y-4">
              <Button onClick={generatePortadorData} className="w-full">
                <User className="w-4 h-4 mr-2" />
                Gerar Dados do Portador
              </Button>
              
              {portadorData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Nome Completo</Label>
                    <div className="flex gap-2">
                      <Input value={portadorData.nome} readOnly className="font-mono" />
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(portadorData.nome)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Data de Nascimento</Label>
                    <div className="flex gap-2">
                      <Input value={portadorData.dataNascimento} readOnly className="font-mono" />
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(portadorData.dataNascimento)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>CPF</Label>
                    <div className="flex gap-2">
                      <Input value={portadorData.cpf} readOnly className="font-mono" />
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(portadorData.cpf)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <Label>RG</Label>
                    <div className="flex gap-2">
                      <Input value={portadorData.rg} readOnly className="font-mono" />
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(portadorData.rg)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <Label>Filiação</Label>
                    <div className="flex gap-2">
                      <Input value={portadorData.filiacao} readOnly className="font-mono" />
                      <Button variant="outline" size="icon" onClick={() => copyToClipboard(portadorData.filiacao)}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Seção Geração Múltipla */}
      <Collapsible open={showMultiple} onOpenChange={setShowMultiple} className="mt-6">
        <Card className="p-6">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <h3 className="text-lg font-semibold text-card-foreground">
                  Gerar Múltiplas CNHs
                </h3>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${showMultiple ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-4">
            <div className="space-y-4">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    min="1"
                    max="100"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                  />
                </div>
                <Button onClick={generateMultipleCNHs}>
                  <Users className="w-4 h-4 mr-2" />
                  Gerar CNHs
                </Button>
              </div>
              
              {multipleCnhs.length > 0 && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => exportData('csv')}>
                      <Download className="w-4 h-4 mr-2" />
                      Exportar CSV
                    </Button>
                    <Button variant="outline" onClick={() => exportData('json')}>
                      <Download className="w-4 h-4 mr-2" />
                      Exportar JSON
                    </Button>
                    <Button variant="outline" onClick={() => exportData('txt')}>
                      <Download className="w-4 h-4 mr-2" />
                      Exportar TXT
                    </Button>
                  </div>
                  
                  <div className="max-h-96 overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>CNH</TableHead>
                          <TableHead>Categoria</TableHead>
                          <TableHead>Vencimento</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {multipleCnhs.map((cnhData, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-mono">{cnhData.numero}</TableCell>
                            <TableCell>{cnhData.categoria}</TableCell>
                            <TableCell>{cnhData.dataVencimento}</TableCell>
                            <TableCell>{cnhData.estado}</TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(cnhData.numero)}
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Car className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Aviso Importante</h4>
            <p className="text-muted-foreground">
              Este gerador de CNH é apenas para fins de teste e desenvolvimento. 
              Não use para fraudes ou atividades ilegais.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};