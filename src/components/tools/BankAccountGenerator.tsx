import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const bancos = [
  { codigo: '001', nome: 'Banco do Brasil' },
  { codigo: '104', nome: 'Caixa Econômica Federal' },
  { codigo: '237', nome: 'Bradesco' },
  { codigo: '341', nome: 'Itaú' },
  { codigo: '033', nome: 'Santander' },
  { codigo: '745', nome: 'Citibank' },
  { codigo: '399', nome: 'HSBC' },
  { codigo: '422', nome: 'Banco Safra' },
  { codigo: '633', nome: 'Banco Rendimento' },
  { codigo: '260', nome: 'Nu Pagamentos (Nubank)' },
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

const cidades = {
  'SP': ['São Paulo', 'Campinas', 'São Bernardo do Campo', 'Santo André', 'Osasco'],
  'RJ': ['Rio de Janeiro', 'São Gonçalo', 'Duque de Caxias', 'Nova Iguaçu', 'Niterói'],
  'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'],
  'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari', 'Itabuna'],
  'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel'],
  'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria'],
  'default': ['Capital', 'Centro', 'Norte', 'Sul', 'Leste']
};

export const BankAccountGenerator = () => {
  const [bancoSelecionado, setBancoSelecionado] = useState('');
  const [estadoSelecionado, setEstadoSelecionado] = useState('');
  const [agencia, setAgencia] = useState('');
  const [conta, setConta] = useState('');
  const [cidade, setCidade] = useState('');
  const { toast } = useToast();

  const generateAccount = () => {
    // Gera agência (4 dígitos + dígito verificador)
    const agenciaNumero = Math.floor(Math.random() * 9000) + 1000;
    const agenciaDigito = Math.floor(Math.random() * 10);
    const agenciaFormatada = `${agenciaNumero}-${agenciaDigito}`;
    
    // Gera conta (5-8 dígitos + dígito verificador)
    const contaNumero = Math.floor(Math.random() * 90000000) + 10000000;
    const contaDigito = Math.floor(Math.random() * 10);
    const contaFormatada = `${contaNumero.toString().substring(0, 6)}-${contaDigito}`;
    
    // Seleciona cidade baseada no estado
    const cidadesDoEstado = cidades[estadoSelecionado as keyof typeof cidades] || cidades.default;
    const cidadeAleatoria = cidadesDoEstado[Math.floor(Math.random() * cidadesDoEstado.length)];
    
    setAgencia(agenciaFormatada);
    setConta(contaFormatada);
    setCidade(cidadeAleatoria);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Informação copiada para a área de transferência",
    });
  };

  const limparCampos = () => {
    setAgencia('');
    setConta('');
    setCidade('');
  };

  const bancoNome = bancos.find(b => b.codigo === bancoSelecionado)?.nome || '';
  const estadoNome = estados.find(e => e.sigla === estadoSelecionado)?.nome || '';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de Conta Bancária</h1>
        </div>
        <p className="text-muted-foreground">
          Gera dados de conta bancária válidos para teste e desenvolvimento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Configurações
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="banco">Banco</Label>
              <Select value={bancoSelecionado} onValueChange={setBancoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o banco" />
                </SelectTrigger>
                <SelectContent>
                  {bancos.map((banco) => (
                    <SelectItem key={banco.codigo} value={banco.codigo}>
                      {banco.codigo} - {banco.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select value={estadoSelecionado} onValueChange={setEstadoSelecionado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((estado) => (
                    <SelectItem key={estado.sigla} value={estado.sigla}>
                      {estado.nome} ({estado.sigla})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              onClick={generateAccount}
              disabled={!bancoSelecionado || !estadoSelecionado}
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Gerar Conta
            </Button>
            <Button
              variant="outline"
              onClick={limparCampos}
              disabled={!agencia}
            >
              Limpar
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Conta Gerada
          </h3>
          
          <div className="space-y-4">
            {bancoSelecionado && (
              <div>
                <Label>Banco</Label>
                <div className="flex gap-2">
                  <Input
                    value={`${bancoSelecionado} - ${bancoNome}`}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(`${bancoSelecionado} - ${bancoNome}`)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div>
              <Label>Agência</Label>
              <div className="flex gap-2">
                <Input
                  value={agencia}
                  readOnly
                  placeholder="Agência será gerada aqui"
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(agencia)}
                  disabled={!agencia}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Conta Corrente</Label>
              <div className="flex gap-2">
                <Input
                  value={conta}
                  readOnly
                  placeholder="Conta será gerada aqui"
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(conta)}
                  disabled={!conta}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {cidade && (
              <div>
                <Label>Cidade</Label>
                <div className="flex gap-2">
                  <Input
                    value={cidade}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(cidade)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {estadoSelecionado && (
              <div>
                <Label>Estado</Label>
                <div className="flex gap-2">
                  <Input
                    value={estadoNome}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(estadoNome)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Building2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Aviso Importante</h4>
            <p className="text-muted-foreground">
              Este gerador de conta bancária é apenas para fins de teste e desenvolvimento. 
              Não use para fraudes ou atividades ilegais.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};