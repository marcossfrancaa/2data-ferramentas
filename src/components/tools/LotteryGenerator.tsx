import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dices, Copy, RefreshCw, TrendingUp, TrendingDown, BarChart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Jogo {
  nome: string;
  min: number;
  max: number;
  quantidade: number;
  descricao: string;
}

const jogosLoteria: Record<string, Jogo> = {
  megasena: {
    nome: 'Mega-Sena',
    min: 1,
    max: 60,
    quantidade: 6,
    descricao: '6 números de 1 a 60'
  },
  quina: {
    nome: 'Quina',
    min: 1,
    max: 80,
    quantidade: 5,
    descricao: '5 números de 1 a 80'
  },
  lotofacil: {
    nome: 'Lotofácil',
    min: 1,
    max: 25,
    quantidade: 15,
    descricao: '15 números de 1 a 25'
  },
  lotomania: {
    nome: 'Lotomania',
    min: 1,
    max: 100,
    quantidade: 50,
    descricao: '50 números de 1 a 100'
  },
  duplasena: {
    nome: 'Dupla Sena',
    min: 1,
    max: 50,
    quantidade: 6,
    descricao: '6 números de 1 a 50 (2 jogos)'
  },
  federal: {
    nome: 'Federal',
    min: 1,
    max: 100000,
    quantidade: 1,
    descricao: '1 número de 1 a 100.000'
  },
  diadesorte: {
    nome: 'Dia de Sorte',
    min: 1,
    max: 31,
    quantidade: 7,
    descricao: '7 números de 1 a 31'
  },
  timemania: {
    nome: 'Timemania',
    min: 1,
    max: 80,
    quantidade: 10,
    descricao: '10 números de 1 a 80'
  }
};

// Simulação de dados históricos (números mais sorteados)
const numerosFrequentes: Record<string, number[]> = {
  megasena: [5, 4, 37, 10, 34, 58, 23, 24, 33, 41],
  quina: [5, 6, 12, 4, 9, 18, 11, 2, 3, 15],
  lotofacil: [11, 20, 2, 14, 3, 7, 1, 25, 15, 24],
  lotomania: [33, 61, 63, 70, 64, 48, 30, 38, 60, 24],
  duplasena: [6, 32, 35, 42, 20, 33, 17, 49, 37, 41],
  diadesorte: [3, 25, 29, 33, 15, 26, 28, 1, 6, 31],
  timemania: [3, 11, 17, 25, 33, 23, 47, 30, 69, 53]
};

const numerosRaros: Record<string, number[]> = {
  megasena: [7, 48, 26, 31, 55, 9, 39, 46, 52, 1],
  quina: [62, 67, 79, 74, 66, 71, 75, 77, 69, 65],
  lotofacil: [6, 16, 21, 9, 18, 10, 4, 23, 12, 8],
  lotomania: [86, 89, 93, 97, 85, 91, 94, 87, 96, 90],
  duplasena: [2, 8, 14, 26, 39, 44, 47, 1, 13, 22],
  diadesorte: [17, 9, 12, 24, 8, 20, 11, 16, 2, 13],
  timemania: [1, 5, 71, 73, 75, 77, 79, 2, 4, 6]
};

export const LotteryGenerator = () => {
  const [jogoSelecionado, setJogoSelecionado] = useState('megasena');
  const [quantidadeJogos, setQuantidadeJogos] = useState('1');
  const [numerosGerados, setNumerosGerados] = useState<number[][]>([]);
  const [estatisticas, setEstatisticas] = useState<{[key: number]: number}>({});
  const { toast } = useToast();

  const gerarNumeros = (tipoGeracao: 'aleatorio' | 'frequentes' | 'raros' = 'aleatorio') => {
    const jogo = jogosLoteria[jogoSelecionado];
    const qtdJogos = parseInt(quantidadeJogos) || 1;
    const novosJogos: number[][] = [];

    for (let i = 0; i < qtdJogos; i++) {
      let numeros: number[] = [];
      
      if (tipoGeracao === 'frequentes') {
        // Usa 70% de números frequentes + 30% aleatórios
        const freqs = numerosFrequentes[jogoSelecionado] || [];
        const qtdFreq = Math.ceil(jogo.quantidade * 0.7);
        const numerosFreq = freqs.slice(0, qtdFreq);
        numeros = [...numerosFreq];
        
        // Completa com números aleatórios
        while (numeros.length < jogo.quantidade) {
          const num = Math.floor(Math.random() * (jogo.max - jogo.min + 1)) + jogo.min;
          if (!numeros.includes(num)) {
            numeros.push(num);
          }
        }
      } else if (tipoGeracao === 'raros') {
        // Usa 70% de números raros + 30% aleatórios
        const raros = numerosRaros[jogoSelecionado] || [];
        const qtdRaros = Math.ceil(jogo.quantidade * 0.7);
        const numerosRarosSelecionados = raros.slice(0, qtdRaros);
        numeros = [...numerosRarosSelecionados];
        
        // Completa com números aleatórios
        while (numeros.length < jogo.quantidade) {
          const num = Math.floor(Math.random() * (jogo.max - jogo.min + 1)) + jogo.min;
          if (!numeros.includes(num)) {
            numeros.push(num);
          }
        }
      } else {
        // Geração completamente aleatória
        while (numeros.length < jogo.quantidade) {
          const num = Math.floor(Math.random() * (jogo.max - jogo.min + 1)) + jogo.min;
          if (!numeros.includes(num)) {
            numeros.push(num);
          }
        }
      }
      
      numeros.sort((a, b) => a - b);
      novosJogos.push(numeros);
    }

    setNumerosGerados(novosJogos);
    calcularEstatisticas(novosJogos);
  };

  const calcularEstatisticas = (jogos: number[][]) => {
    const stats: {[key: number]: number} = {};
    
    jogos.forEach(jogo => {
      jogo.forEach(numero => {
        stats[numero] = (stats[numero] || 0) + 1;
      });
    });
    
    setEstatisticas(stats);
  };

  const copiarJogos = () => {
    const texto = numerosGerados.map((jogo, index) => {
      if (jogoSelecionado === 'duplasena') {
        const primeiroJogo = jogo.slice(0, 6).join(' - ');
        const segundoJogo = jogo.slice(6, 12).join(' - ');
        return `Jogo ${index + 1}:\n1º Sorteio: ${primeiroJogo}\n2º Sorteio: ${segundoJogo}`;
      }
      return `Jogo ${index + 1}: ${jogo.join(' - ')}`;
    }).join('\n\n');

    navigator.clipboard.writeText(texto);
    toast({
      title: "Copiado!",
      description: "Jogos copiados para a área de transferência",
    });
  };

  const jogo = jogosLoteria[jogoSelecionado];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Dices className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de Números da Loteria</h1>
        </div>
        <p className="text-muted-foreground">
          Gerador completo de números para todos os jogos da loteria brasileira, com estatísticas e análise de frequência.
        </p>
      </div>

      <Tabs defaultValue="gerador" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gerador">Gerador</TabsTrigger>
          <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          <TabsTrigger value="analise">Análise</TabsTrigger>
        </TabsList>

        <TabsContent value="gerador" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Configurações do Jogo
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <Label htmlFor="jogo">Tipo de Jogo:</Label>
                <Select value={jogoSelecionado} onValueChange={setJogoSelecionado}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(jogosLoteria).map(([key, jogo]) => (
                      <SelectItem key={key} value={key}>
                        {jogo.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">{jogo.descricao}</p>
              </div>

              <div>
                <Label htmlFor="quantidade">Quantidade de Jogos:</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  max="20"
                  value={quantidadeJogos}
                  onChange={(e) => setQuantidadeJogos(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Button onClick={() => gerarNumeros('aleatorio')} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Gerar Aleatório
              </Button>
              <Button onClick={() => gerarNumeros('frequentes')} variant="outline" className="w-full">
                <TrendingUp className="w-4 h-4 mr-2" />
                Números Frequentes
              </Button>
              <Button onClick={() => gerarNumeros('raros')} variant="outline" className="w-full">
                <TrendingDown className="w-4 h-4 mr-2" />
                Números Raros
              </Button>
            </div>
          </Card>

          {numerosGerados.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">
                  Jogos Gerados - {jogo.nome}
                </h3>
                <Button variant="outline" size="sm" onClick={copiarJogos}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar Todos
                </Button>
              </div>

              <div className="space-y-4">
                {numerosGerados.map((numeros, index) => (
                  <div key={index} className="p-4 bg-accent/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-card-foreground">Jogo {index + 1}:</span>
                    </div>
                    
                    {jogoSelecionado === 'duplasena' ? (
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm font-medium">1º Sorteio:</span>
                          {numeros.slice(0, 6).map((numero, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-center min-w-[40px] font-bold"
                            >
                              {numero.toString().padStart(2, '0')}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm font-medium">2º Sorteio:</span>
                          {numeros.slice(6, 12).map((numero, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-center min-w-[40px] font-bold"
                            >
                              {numero.toString().padStart(2, '0')}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {numeros.map((numero, idx) => (
                          <span 
                            key={idx}
                            className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-center min-w-[40px] font-bold"
                          >
                            {numero.toString().padStart(2, '0')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="estatisticas" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Números Mais Sorteados - {jogo.nome}
            </h3>
            
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {(numerosFrequentes[jogoSelecionado] || []).slice(0, 20).map((numero) => (
                <div key={numero} className="text-center">
                  <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold mb-1">
                    {numero}
                  </div>
                  <div className="text-xs text-muted-foreground">Freq</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Números Menos Sorteados - {jogo.nome}
            </h3>
            
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
              {(numerosRaros[jogoSelecionado] || []).slice(0, 20).map((numero) => (
                <div key={numero} className="text-center">
                  <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center font-bold mb-1">
                    {numero}
                  </div>
                  <div className="text-xs text-muted-foreground">Raro</div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analise" className="space-y-6">
          {Object.keys(estatisticas).length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                <BarChart className="w-5 h-5 inline mr-2" />
                Análise dos Jogos Gerados
              </h3>
              
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {Object.entries(estatisticas)
                  .sort(([,a], [,b]) => b - a)
                  .map(([numero, freq]) => (
                  <div key={numero} className="text-center">
                    <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center font-bold mb-1">
                      {numero}
                    </div>
                    <div className="text-xs text-muted-foreground">{freq}x</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">
              Dicas Estratégicas
            </h3>
            
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">💡 Números Frequentes</h4>
                <p className="text-blue-800 dark:text-blue-200">
                  Use números que saíram mais vezes nos sorteios históricos. Eles têm maior probabilidade estatística.
                </p>
              </div>
              
              <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-1">🎯 Números Raros</h4>
                <p className="text-orange-800 dark:text-orange-200">
                  Aposte em números que saem pouco. Se saírem, você terá menos concorrentes no prêmio.
                </p>
              </div>
              
              <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <h4 className="font-medium text-green-900 dark:text-green-100 mb-1">🔄 Estratégia Mista</h4>
                <p className="text-green-800 dark:text-green-200">
                  Combine números frequentes com raros para equilibrar as chances de ganhar e o valor do prêmio.
                </p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};