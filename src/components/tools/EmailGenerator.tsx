import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Mail, Copy, Download, ChevronDown, ChevronRight, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const dominios = [
  'gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com', 'terra.com.br',
  'uol.com.br', 'bol.com.br', 'ig.com.br', 'globo.com', 'r7.com'
];

const nomes = [
  'ana', 'carlos', 'maria', 'joao', 'paulo', 'lucia', 'pedro', 'julia',
  'marcos', 'fernanda', 'rafael', 'camila', 'daniel', 'bruna', 'lucas',
  'amanda', 'felipe', 'jessica', 'bruno', 'leticia', 'rodrigo', 'mariana',
  'gabriel', 'carolina', 'mateus', 'beatriz', 'gustavo', 'larissa', 'leonardo',
  'patricia', 'ricardo', 'natalia', 'alexandre', 'isabela', 'vinicius', 'roberta'
];

const sobrenomes = [
  'silva', 'santos', 'oliveira', 'souza', 'rodrigues', 'ferreira', 'alves',
  'pereira', 'lima', 'gomes', 'costa', 'ribeiro', 'martins', 'carvalho',
  'almeida', 'lopes', 'soares', 'fernandes', 'vieira', 'barbosa', 'rocha',
  'dias', 'monteiro', 'cardoso', 'reis', 'araujo', 'castro', 'andrade'
];

export const EmailGenerator = () => {
  const [dominio, setDominio] = useState('');
  const [dominioCustomizado, setDominioCustomizado] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [incluirNumeros, setIncluirNumeros] = useState(true);
  const [incluirPontos, setIncluirPontos] = useState(true);
  const [modoAvancado, setModoAvancado] = useState(false);
  const [quantidadePalavras, setQuantidadePalavras] = useState(1);
  const [palavrasChave, setPalavrasChave] = useState<string[]>(['']);
  const [emails, setEmails] = useState<string[]>([]);
  const { toast } = useToast();

  // Atualiza array de palavras-chave quando quantidade muda
  const handleQuantidadePalavrasChange = (novaQuantidade: number) => {
    setQuantidadePalavras(novaQuantidade);
    const novasPalavras = Array(novaQuantidade).fill('');
    // Preserva palavras existentes se possível
    for (let i = 0; i < Math.min(palavrasChave.length, novaQuantidade); i++) {
      novasPalavras[i] = palavrasChave[i];
    }
    setPalavrasChave(novasPalavras);
  };

  // Atualiza uma palavra-chave específica
  const handlePalavraChaveChange = (index: number, valor: string) => {
    const novasPalavras = [...palavrasChave];
    novasPalavras[index] = valor;
    setPalavrasChave(novasPalavras);
  };

  // Funções auxiliares para geração de dados aleatórios
  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 999) + 1;
  };

  // LÓGICA PRINCIPAL DE GERAÇÃO (NOVA - BASEADA EM PALAVRAS-CHAVE)
  const generateEmails = () => {
    const qtd = parseInt(quantidade) || 1;
    const novosEmails: string[] = [];

    // Verifica se há palavras-chave preenchidas
    const palavrasPreenchidas = palavrasChave.filter(palavra => palavra.trim().length > 0);
    
    // ESTRUTURA IF/ELSE CONDICIONAL EXCLUSIVA
    if (palavrasPreenchidas.length > 0) {
      // ===== MODO 1: GERAÇÃO COM PALAVRAS-CHAVE =====
      // Ignora completamente as configurações básicas de geração aleatória
      for (let i = 1; i <= Math.min(qtd, 100); i++) {
        let emailGerado = '';
        
        // Combinações criativas das palavras-chave
        const combinacoes = [];
        
        if (palavrasPreenchidas.length === 1) {
          const palavra = palavrasPreenchidas[0].toLowerCase();
          combinacoes.push(
            palavra,
            `${palavra}${generateRandomNumber()}`,
            `${palavra}.${generateRandomNumber()}`,
            `${palavra}_${generateRandomNumber()}`
          );
        } else if (palavrasPreenchidas.length >= 2) {
          const palavra1 = palavrasPreenchidas[0].toLowerCase();
          const palavra2 = palavrasPreenchidas[1].toLowerCase();
          combinacoes.push(
            `${palavra1}.${palavra2}`,
            `${palavra2}.${palavra1}`,
            `${palavra1}_${palavra2}`,
            `${palavra2}_${palavra1}`,
            `${palavra1}${palavra2}`,
            `${palavra2}${palavra1}`,
            `${palavra1}${generateRandomNumber()}`,
            `${palavra2}${generateRandomNumber()}`
          );
          
          // Se tiver 3 palavras, adiciona mais combinações
          if (palavrasPreenchidas.length >= 3) {
            const palavra3 = palavrasPreenchidas[2].toLowerCase();
            combinacoes.push(
              `${palavra1}.${palavra3}`,
              `${palavra2}.${palavra3}`,
              `${palavra3}.${palavra1}`,
              `${palavra3}.${palavra2}`,
              `${palavra1}_${palavra3}`,
              `${palavra2}_${palavra3}`,
              `${palavra1}.${palavra2}.${palavra3}`,
              `${palavra1}_${palavra2}_${palavra3}`,
              `${palavra3}${palavra1}`,
              `${palavra3}${palavra2}`,
              `${palavra3}${generateRandomNumber()}`
            );
          }
        }
        
        // Seleciona uma combinação aleatória
        emailGerado = combinacoes[Math.floor(Math.random() * combinacoes.length)];
        
        // Aplica domínio selecionado (mantém a funcionalidade de domínio)
        let dominioSelecionado = '';
        if (dominio === 'custom' && dominioCustomizado.trim()) {
          dominioSelecionado = dominioCustomizado.trim();
        } else if (dominio && dominio !== 'random') {
          dominioSelecionado = dominio;
        } else {
          dominioSelecionado = dominios[Math.floor(Math.random() * dominios.length)];
        }
        
        emailGerado += `@${dominioSelecionado}`;
        novosEmails.push(emailGerado.toLowerCase());
      }
    } else {
      // ===== MODO 2: GERAÇÃO ALEATÓRIA =====
      // Usa as configurações básicas
      for (let i = 1; i <= Math.min(qtd, 100); i++) {
        const nome = nomes[Math.floor(Math.random() * nomes.length)];
        const sobrenome = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
        
        // Diferentes padrões de combinação aleatória
        const padroesCombinacao = [
          `${nome}.${sobrenome}`,
          `${nome}${sobrenome}`,
          `${nome}_${sobrenome}`,
          `${nome.charAt(0)}.${sobrenome}`,
          `${nome}${sobrenome.charAt(0)}`,
          `${sobrenome}.${nome}`,
          nome
        ];
        
        let emailGerado = padroesCombinacao[Math.floor(Math.random() * padroesCombinacao.length)];
        
        // Aplica configurações básicas: Remove pontos se não desejados
        if (!incluirPontos) {
          emailGerado = emailGerado.replace(/\./g, '');
        }
        
        // Aplica configurações básicas: Adiciona números aleatórios
        if (incluirNumeros && Math.random() > 0.4) {
          const numeros = Math.floor(Math.random() * 999) + 1;
          emailGerado += numeros.toString();
        }
        
        // Aplica configurações básicas: Seleciona domínio
        let dominioSelecionado = '';
        if (dominio === 'custom' && dominioCustomizado.trim()) {
          dominioSelecionado = dominioCustomizado.trim();
        } else if (dominio && dominio !== 'random') {
          dominioSelecionado = dominio;
        } else {
          dominioSelecionado = dominios[Math.floor(Math.random() * dominios.length)];
        }
        
        emailGerado += `@${dominioSelecionado}`;
        novosEmails.push(emailGerado.toLowerCase());
      }
    }
    
    setEmails(novosEmails);
  };

  // As configurações básicas agora sempre funcionam
  const isBasicConfigDisabled = false;

  // GERAÇÃO INICIAL: 1 email aleatório ao carregar
  useEffect(() => {
    generateEmails();
  }, []); // Executa apenas uma vez ao montar o componente

  // Geração automática reativa - todas as configurações sempre funcionam
  useEffect(() => {
    if (quantidade && parseInt(quantidade) > 0) {
      generateEmails();
    }
  }, [quantidade, palavrasChave, dominio, dominioCustomizado, incluirNumeros, incluirPontos]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "E-mail copiado para a área de transferência",
    });
  };

  const copyAllEmails = () => {
    const allEmails = emails.join('\n');
    navigator.clipboard.writeText(allEmails);
    toast({
      title: "Copiado!",
      description: "Todos os e-mails copiados para a área de transferência",
    });
  };

  const exportToCSV = () => {
    const csvContent = emails.map(email => `"${email}"`).join('\n');
    const blob = new Blob([`Email\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emails.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    toast({
      title: "Exportado!",
      description: "Arquivo CSV baixado com sucesso",
    });
  };

  const exportToTXT = () => {
    const txtContent = emails.join('\n');
    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emails.txt';
    a.click();
    window.URL.revokeObjectURL(url);
    toast({
      title: "Exportado!",
      description: "Arquivo TXT baixado com sucesso",
    });
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify({ emails }, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emails.json';
    a.click();
    window.URL.revokeObjectURL(url);
    toast({
      title: "Exportado!",
      description: "Arquivo JSON baixado com sucesso",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de E-mail Avançado</h1>
        </div>
        <p className="text-muted-foreground">
          Ferramenta completa para geração de dados de teste com e-mails realistas, padrões personalizados e opções de exportação.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card className={`p-6 ${isBasicConfigDisabled ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-card-foreground">
                Configurações Básicas
              </h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="dominio">Domínio</Label>
                <Select value={dominio} onValueChange={setDominio} disabled={isBasicConfigDisabled}>
                  <SelectTrigger>
                    <SelectValue placeholder="Aleatório" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="random">Aleatório</SelectItem>
                    {dominios.map((dom) => (
                      <SelectItem key={dom} value={dom}>
                        {dom}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Digitar outro...</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dominio === 'custom' && (
                <div>
                  <Label htmlFor="dominioCustomizado">Domínio Personalizado</Label>
                  <Input
                    id="dominioCustomizado"
                    value={dominioCustomizado}
                    onChange={(e) => setDominioCustomizado(e.target.value)}
                    placeholder="exemplo.com"
                    disabled={isBasicConfigDisabled}
                  />
                </div>
              )}

              <div>
                <Label htmlFor="quantidade">Quantidade (máx. 100)</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  max="100"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  placeholder="5"
                />
              </div>

              <div className="space-y-3">
                <Label>Opções de Geração</Label>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="numeros"
                    checked={incluirNumeros}
                    onCheckedChange={(checked) => setIncluirNumeros(checked as boolean)}
                    disabled={isBasicConfigDisabled}
                  />
                  <Label htmlFor="numeros" className="text-sm font-normal">
                    Incluir números aleatórios
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pontos"
                    checked={incluirPontos}
                    onCheckedChange={(checked) => setIncluirPontos(checked as boolean)}
                    disabled={isBasicConfigDisabled}
                  />
                  <Label htmlFor="pontos" className="text-sm font-normal">
                    Incluir pontos nos nomes
                  </Label>
                </div>
              </div>

            </div>
          </Card>

          <Collapsible open={modoAvancado} onOpenChange={setModoAvancado}>
            <Card className="p-6">
              <CollapsibleTrigger className="flex items-center gap-2 w-full text-left">
                {modoAvancado ? 
                  <ChevronDown className="w-4 h-4 text-primary" /> : 
                  <ChevronRight className="w-4 h-4 text-primary" />
                }
                <h3 className="text-lg font-semibold text-card-foreground">Usar Palavras-Chave na Geração</h3>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="quantidadePalavras">Quantidade de palavras-chave</Label>
                    <Select 
                      value={quantidadePalavras.toString()} 
                      onValueChange={(value) => handleQuantidadePalavrasChange(parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 palavra</SelectItem>
                        <SelectItem value="2">2 palavras</SelectItem>
                        <SelectItem value="3">3 palavras</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    {palavrasChave.map((palavra, index) => (
                      <div key={index}>
                        <Label htmlFor={`palavra-${index}`}>Palavra {index + 1}</Label>
                        <Input
                          id={`palavra-${index}`}
                          value={palavra}
                          onChange={(e) => handlePalavraChaveChange(index, e.target.value)}
                          placeholder={`Digite a palavra ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 bg-accent/5 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Os e-mails serão criados combinando as palavras que você fornecer.</strong>
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>• <strong>1 palavra:</strong> marcos → marcos, marcos123, marcos.456</div>
                      <div>• <strong>2 palavras:</strong> marcos, teste → marcos.teste, teste_marcos, marcos789</div>
                      <div>• <strong>3 palavras:</strong> marcos, teste, dev → marcos.dev, teste_marcos_dev</div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              E-mails Gerados ({emails.length})
            </h3>
            {emails.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyAllEmails}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {emails.length > 0 ? (
              emails.map((email, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                  <span className="font-mono text-sm text-card-foreground flex-1 mr-2">{email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(email)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Configure as opções acima</p>
                <p className="text-sm">Os e-mails serão gerados automaticamente</p>
              </div>
            )}
          </div>

          {emails.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <Label className="text-sm font-medium mb-2 block">Exportar Dados</Label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToCSV}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToJSON}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  JSON
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToTXT}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  TXT
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Ferramenta de Desenvolvimento</h4>
            <p className="text-muted-foreground">
              Esta ferramenta gera e-mails fictícios baseados em nomes reais brasileiros e padrões comuns. 
              Ideal para testes, desenvolvimento e população de bancos de dados. 
              A geração é automática e reativa - os e-mails são atualizados conforme você modifica as configurações.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};