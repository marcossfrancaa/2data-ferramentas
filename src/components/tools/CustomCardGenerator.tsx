import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Copy, RefreshCw, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const tiposCartao = [
  { value: 'identidade', label: 'Cartão de Identidade' },
  { value: 'trabalho', label: 'Cartão de Trabalho' },
  { value: 'estudante', label: 'Cartão de Estudante' },
  { value: 'visitante', label: 'Cartão de Visitante' },
  { value: 'personalizado', label: 'Cartão Personalizado' },
];

const estadosCivis = [
  { value: 'solteiro', label: 'Solteiro(a)' },
  { value: 'casado', label: 'Casado(a)' },
  { value: 'divorciado', label: 'Divorciado(a)' },
  { value: 'viuvo', label: 'Viúvo(a)' },
  { value: 'uniao', label: 'União Estável' },
];

const nacionalidades = [
  'Brasileira', 'Americana', 'Argentina', 'Portuguesa', 'Italiana', 
  'Alemã', 'Francesa', 'Espanhola', 'Japonesa', 'Chinesa'
];

export const CustomCardGenerator = () => {
  const [tipoCartao, setTipoCartao] = useState('');
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [nacionalidade, setNacionalidade] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('');
  const [profissao, setProfissao] = useState('');
  const [endereco, setEndereco] = useState('');
  const [telefone, setTelefone] = useState('');
  const [numeroCartao, setNumeroCartao] = useState('');
  const [dataEmissao, setDataEmissao] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const { toast } = useToast();

  const generateCard = () => {
    // Gera número do cartão
    const numero = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10)).join('');
    setNumeroCartao(`${tipoCartao.toUpperCase().substring(0, 3)}-${numero}`);
    
    // Gera data de emissão (data atual)
    const hoje = new Date();
    setDataEmissao(hoje.toLocaleDateString('pt-BR'));
    
    // Gera data de validade (5 anos a partir de hoje)
    const validade = new Date(hoje);
    validade.setFullYear(validade.getFullYear() + 5);
    setDataValidade(validade.toLocaleDateString('pt-BR'));
    
    // Se não tem documento, gera um CPF
    if (!documento) {
      generateCPF();
    }
  };

  const generateCPF = () => {
    const n1 = Math.floor(Math.random() * 10);
    const n2 = Math.floor(Math.random() * 10);
    const n3 = Math.floor(Math.random() * 10);
    const n4 = Math.floor(Math.random() * 10);
    const n5 = Math.floor(Math.random() * 10);
    const n6 = Math.floor(Math.random() * 10);
    const n7 = Math.floor(Math.random() * 10);
    const n8 = Math.floor(Math.random() * 10);
    const n9 = Math.floor(Math.random() * 10);

    const d1 = ((n1 * 10) + (n2 * 9) + (n3 * 8) + (n4 * 7) + (n5 * 6) + (n6 * 5) + (n7 * 4) + (n8 * 3) + (n9 * 2)) % 11;
    const digit1 = d1 < 2 ? 0 : 11 - d1;

    const d2 = ((n1 * 11) + (n2 * 10) + (n3 * 9) + (n4 * 8) + (n5 * 7) + (n6 * 6) + (n7 * 5) + (n8 * 4) + (n9 * 3) + (digit1 * 2)) % 11;
    const digit2 = d2 < 2 ? 0 : 11 - d2;

    const cpf = `${n1}${n2}${n3}.${n4}${n5}${n6}.${n7}${n8}${n9}-${digit1}${digit2}`;
    setDocumento(cpf);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Informação copiada para a área de transferência",
    });
  };

  const limparCampos = () => {
    setNome('');
    setDocumento('');
    setNacionalidade('');
    setEstadoCivil('');
    setProfissao('');
    setEndereco('');
    setTelefone('');
    setNumeroCartao('');
    setDataEmissao('');
    setDataValidade('');
  };

  const copyAllData = () => {
    const allData = `
Tipo: ${tiposCartao.find(t => t.value === tipoCartao)?.label || ''}
Nome: ${nome}
Documento: ${documento}
Nacionalidade: ${nacionalidade}
Estado Civil: ${estadosCivis.find(e => e.value === estadoCivil)?.label || ''}
Profissão: ${profissao}
Endereço: ${endereco}
Telefone: ${telefone}
Número do Cartão: ${numeroCartao}
Data de Emissão: ${dataEmissao}
Data de Validade: ${dataValidade}
    `.trim();
    
    copyToClipboard(allData);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de Cartões Personalizados</h1>
        </div>
        <p className="text-muted-foreground">
          Crie cartões personalizados com dados realistas para teste e desenvolvimento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Tipo de Cartão
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo">Tipo de Cartão</Label>
              <Select value={tipoCartao} onValueChange={setTipoCartao}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposCartao.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generateCard}
              disabled={!tipoCartao}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Gerar Cartão
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Dados Pessoais
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome completo"
              />
            </div>

            <div>
              <Label htmlFor="documento">Documento (CPF/RG)</Label>
              <Input
                id="documento"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>

            <div>
              <Label htmlFor="nacionalidade">Nacionalidade</Label>
              <Select value={nacionalidade} onValueChange={setNacionalidade}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {nacionalidades.map((nac) => (
                    <SelectItem key={nac} value={nac}>
                      {nac}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="estadoCivil">Estado Civil</Label>
              <Select value={estadoCivil} onValueChange={setEstadoCivil}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {estadosCivis.map((estado) => (
                    <SelectItem key={estado.value} value={estado.value}>
                      {estado.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="profissao">Profissão</Label>
              <Input
                id="profissao"
                value={profissao}
                onChange={(e) => setProfissao(e.target.value)}
                placeholder="Profissão"
              />
            </div>

            <div>
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
                placeholder="Endereço completo"
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              Cartão Gerado
            </h3>
            {numeroCartao && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyAllData}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Tudo
              </Button>
            )}
          </div>

          {numeroCartao ? (
            <div className="space-y-4">
              {/* Preview do Cartão */}
              <div className="bg-gradient-primary p-6 rounded-lg text-white min-h-48 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="w-6 h-6" />
                    <span className="text-sm font-medium">
                      {tiposCartao.find(t => t.value === tipoCartao)?.label}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-lg font-bold">{nome || 'NOME COMPLETO'}</div>
                    <div className="text-sm opacity-90">{documento || 'DOCUMENTO'}</div>
                    <div className="text-xs opacity-75">{nacionalidade || 'NACIONALIDADE'}</div>
                    
                    <div className="pt-4 flex justify-between items-end">
                      <div>
                        <div className="text-xs opacity-75">Nº do Cartão</div>
                        <div className="text-sm font-mono">{numeroCartao}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-75">Válido até</div>
                        <div className="text-sm">{dataValidade}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados para copiar */}
              <div className="space-y-3">
                <div className="text-sm">
                  <Label className="text-xs text-muted-foreground">DADOS GERADOS</Label>
                  <div className="mt-2 p-3 bg-accent/10 rounded text-xs font-mono space-y-1">
                    <div><strong>Emissão:</strong> {dataEmissao}</div>
                    <div><strong>Validade:</strong> {dataValidade}</div>
                    <div><strong>Número:</strong> {numeroCartao}</div>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={limparCampos}
                className="w-full"
              >
                Limpar Dados
              </Button>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Selecione um tipo de cartão e clique em "Gerar Cartão"</p>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Aviso Importante</h4>
            <p className="text-muted-foreground">
              Este gerador de cartões é apenas para fins de teste e desenvolvimento. 
              Não use para fraudes ou atividades ilegais.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};