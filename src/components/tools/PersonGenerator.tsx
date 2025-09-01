import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, Copy, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersonData {
  nome: string;
  sobrenome: string;
  nomeCompleto: string;
  cpf: string;
  rg: string;
  dataNascimento: string;
  idade: number;
  sexo: string;
  signo: string;
  mae: string;
  pai: string;
  email: string;
  senha: string;
  cep: string;
  endereco: string;
  numero: number;
  bairro: string;
  cidade: string;
  estado: string;
  telefoneFixo: string;
  celular: string;
  altura: string;
  peso: string;
  tipoSanguineo: string;
  corFavorita: string;
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

const firstNames = {
  masculino: ['João', 'José', 'Carlos', 'Pedro', 'Paulo', 'Luiz', 'Fernando', 'Marcos', 'Rafael', 'Bruno'],
  feminino: ['Maria', 'Ana', 'Francisca', 'Antônia', 'Adriana', 'Juliana', 'Márcia', 'Fernanda', 'Patrícia', 'Aline']
};

const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes'];

const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const colors = ['Azul', 'Verde', 'Vermelho', 'Amarelo', 'Roxo', 'Rosa', 'Laranja', 'Preto', 'Branco', 'Cinza'];
const signs = ['Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem', 'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'];

export const PersonGenerator = () => {
  const [selectedState, setSelectedState] = useState('SP');
  const [selectedGender, setSelectedGender] = useState('masculino');
  const [personData, setPersonData] = useState<PersonData | null>(null);
  const { toast } = useToast();

  const generateCPF = (): string => {
    const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    
    // Primeiro dígito
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (10 - i);
    }
    let firstDigit = 11 - (sum % 11);
    firstDigit = firstDigit >= 10 ? 0 : firstDigit;
    
    // Segundo dígito
    sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += digits[i] * (11 - i);
    }
    sum += firstDigit * 2;
    let secondDigit = 11 - (sum % 11);
    secondDigit = secondDigit >= 10 ? 0 : secondDigit;
    
    const cpf = [...digits, firstDigit, secondDigit].join('');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const generateRG = (): string => {
    const digits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
    return digits.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2.$3');
  };

  const generateBirthDate = (): { date: string; age: number } => {
    const minAge = 18;
    const maxAge = 80;
    const age = Math.floor(Math.random() * (maxAge - minAge + 1)) + minAge;
    
    const currentYear = new Date().getFullYear();
    const birthYear = currentYear - age;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    
    const date = `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${birthYear}`;
    
    return { date, age };
  };

  const generatePhysicalData = () => {
    const height = Math.floor(Math.random() * 30) + 160; // 160-190cm
    const weight = Math.floor(Math.random() * 40) + 50; // 50-90kg
    return {
      altura: `${(height / 100).toFixed(2)}m`,
      peso: `${weight}kg`
    };
  };

  const generatePerson = (): PersonData => {
    const firstName = firstNames[selectedGender as keyof typeof firstNames][Math.floor(Math.random() * firstNames[selectedGender as keyof typeof firstNames].length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName}`;
    
    const { date: birthDate, age } = generateBirthDate();
    const { altura, peso } = generatePhysicalData();
    
    const cities = {
      SP: ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto'],
      RJ: ['Rio de Janeiro', 'Niterói', 'Nova Iguaçu', 'Campos'],
      MG: ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora']
    };
    
    const selectedStateName = brazilianStates.find(s => s.code === selectedState)?.name || 'São Paulo';
    const cityList = cities[selectedState as keyof typeof cities] || cities.SP;
    const city = cityList[Math.floor(Math.random() * cityList.length)];
    
    return {
      nome: firstName,
      sobrenome: lastName,
      nomeCompleto: fullName,
      cpf: generateCPF(),
      rg: generateRG(),
      dataNascimento: birthDate,
      idade: age,
      sexo: selectedGender === 'masculino' ? 'Masculino' : 'Feminino',
      signo: signs[Math.floor(Math.random() * signs.length)],
      mae: `${firstNames.feminino[Math.floor(Math.random() * firstNames.feminino.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      pai: `${firstNames.masculino[Math.floor(Math.random() * firstNames.masculino.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@email.com`,
      senha: Math.random().toString(36).slice(-8),
      cep: `${Math.floor(Math.random() * 99999).toString().padStart(5, '0')}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`,
      endereco: `Rua ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      numero: Math.floor(Math.random() * 9999) + 1,
      bairro: `Bairro ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      cidade: city,
      estado: selectedStateName,
      telefoneFixo: `(11) ${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      celular: `(11) 9${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}`,
      altura,
      peso,
      tipoSanguineo: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
      corFavorita: colors[Math.floor(Math.random() * colors.length)]
    };
  };

  const handleGenerate = () => {
    const person = generatePerson();
    setPersonData(person);
  };

  const formatPersonData = (person: PersonData): string => {
    return `DADOS PESSOAIS:
Nome: ${person.nome}
Sobrenome: ${person.sobrenome}
Nome Completo: ${person.nomeCompleto}
CPF: ${person.cpf}
RG: ${person.rg}
Data de Nascimento: ${person.dataNascimento}
Idade: ${person.idade} anos
Sexo: ${person.sexo}
Signo: ${person.signo}
Mãe: ${person.mae}
Pai: ${person.pai}

CONTATO:
E-mail: ${person.email}
Senha: ${person.senha}
Telefone Fixo: ${person.telefoneFixo}
Celular: ${person.celular}

ENDEREÇO:
CEP: ${person.cep}
Endereço: ${person.endereco}, ${person.numero}
Bairro: ${person.bairro}
Cidade: ${person.cidade}
Estado: ${person.estado}

CARACTERÍSTICAS FÍSICAS:
Altura: ${person.altura}
Peso: ${person.peso}
Tipo Sanguíneo: ${person.tipoSanguineo}
Cor Favorita: ${person.corFavorita}`;
  };

  const copyToClipboard = () => {
    if (personData) {
      navigator.clipboard.writeText(formatPersonData(personData));
      toast({
        title: "Copiado!",
        description: "Dados da pessoa copiados para a área de transferência.",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <User className="w-6 h-6" />
            Gerador de Pessoas
          </CardTitle>
          <CardDescription className="text-center">
            Gerador de pessoas fictícias com dados completos para testes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div>
                <Label htmlFor="gender" className="text-sm font-medium">
                  Sexo:
                </Label>
                <Select value={selectedGender} onValueChange={setSelectedGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-center">
              <Button 
                onClick={handleGenerate}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white px-8 py-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Gerar Pessoa
              </Button>
            </div>
          </div>

          {personData && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-sm font-medium">Dados Gerados:</Label>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Tudo
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Dados Pessoais</h3>
                  {[
                    { label: 'Nome', value: personData.nome },
                    { label: 'Sobrenome', value: personData.sobrenome },
                    { label: 'Nome Completo', value: personData.nomeCompleto },
                    { label: 'CPF', value: personData.cpf },
                    { label: 'RG', value: personData.rg },
                    { label: 'Data de Nascimento', value: personData.dataNascimento },
                    { label: 'Idade', value: `${personData.idade} anos` },
                    { label: 'Sexo', value: personData.sexo },
                    { label: 'Signo', value: personData.signo },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                      <div>
                        <span className="text-sm text-green-600 font-medium">{item.label}: </span>
                        <span className="font-semibold text-green-800">{item.value}</span>
                      </div>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(item.value);
                          toast({ title: "Copiado!", description: `${item.label} copiado para a área de transferência.` });
                        }}
                        variant="outline"
                        size="sm"
                        className="border-green-300 hover:bg-green-100"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Contato & Endereço</h3>
                  {[
                    { label: 'E-mail', value: personData.email },
                    { label: 'Senha', value: personData.senha },
                    { label: 'Telefone Fixo', value: personData.telefoneFixo },
                    { label: 'Celular', value: personData.celular },
                    { label: 'CEP', value: personData.cep },
                    { label: 'Endereço', value: `${personData.endereco}, ${personData.numero}` },
                    { label: 'Bairro', value: personData.bairro },
                    { label: 'Cidade', value: personData.cidade },
                    { label: 'Estado', value: personData.estado },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
                      <div>
                        <span className="text-sm text-blue-600 font-medium">{item.label}: </span>
                        <span className="font-semibold text-blue-800">{item.value}</span>
                      </div>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(item.value);
                          toast({ title: "Copiado!", description: `${item.label} copiado para a área de transferência.` });
                        }}
                        variant="outline"
                        size="sm"
                        className="border-blue-300 hover:bg-blue-100"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Família</h3>
                  {[
                    { label: 'Mãe', value: personData.mae },
                    { label: 'Pai', value: personData.pai },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded">
                      <div>
                        <span className="text-sm text-purple-600 font-medium">{item.label}: </span>
                        <span className="font-semibold text-purple-800">{item.value}</span>
                      </div>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(item.value);
                          toast({ title: "Copiado!", description: `${item.label} copiado para a área de transferência.` });
                        }}
                        variant="outline"
                        size="sm"
                        className="border-purple-300 hover:bg-purple-100"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Características Físicas</h3>
                  {[
                    { label: 'Altura', value: personData.altura },
                    { label: 'Peso', value: personData.peso },
                    { label: 'Tipo Sanguíneo', value: personData.tipoSanguineo },
                    { label: 'Cor Favorita', value: personData.corFavorita },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded">
                      <div>
                        <span className="text-sm text-orange-600 font-medium">{item.label}: </span>
                        <span className="font-semibold text-orange-800">{item.value}</span>
                      </div>
                      <Button
                        onClick={() => {
                          navigator.clipboard.writeText(item.value);
                          toast({ title: "Copiado!", description: `${item.label} copiado para a área de transferência.` });
                        }}
                        variant="outline"
                        size="sm"
                        className="border-orange-300 hover:bg-orange-100"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <Separator />

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>IMPORTANTE:</strong> Nosso gerador online de Pessoas tem como intenção ajudar estudantes, 
              programadores, analistas e testadores a gerar dados de pessoas fictícias, normalmente necessários para testar 
              seus softwares em desenvolvimento.
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