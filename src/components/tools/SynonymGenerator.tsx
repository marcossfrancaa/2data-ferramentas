import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Copy } from 'lucide-react';
import { toast } from 'sonner';

export const SynonymGenerator = () => {
  const [inputWord, setInputWord] = useState('');
  const [synonyms, setSynonyms] = useState<string[]>([]);

  // Base de sinônimos em português (exemplo simplificado)
  const synonymDatabase: { [key: string]: string[] } = {
    'bom': ['ótimo', 'excelente', 'perfeito', 'maravilhoso', 'fantástico', 'legal'],
    'ruim': ['péssimo', 'terrível', 'horrível', 'pobre', 'inferior', 'mau'],
    'grande': ['enorme', 'gigante', 'imenso', 'colossal', 'vasto', 'amplo'],
    'pequeno': ['diminuto', 'minúsculo', 'reduzido', 'compacto', 'limitado'],
    'rápido': ['veloz', 'acelerado', 'ligeiro', 'ágil', 'célere'],
    'lento': ['devagar', 'vagaroso', 'pausado', 'demorado', 'tardio'],
    'feliz': ['alegre', 'contente', 'radiante', 'jubiloso', 'eufórico'],
    'triste': ['melancólico', 'deprimido', 'abatido', 'desanimado', 'aflito'],
    'bonito': ['belo', 'lindo', 'formoso', 'atraente', 'encantador'],
    'feio': ['horrendo', 'repugnante', 'desagradável', 'grotesco'],
    'casa': ['residência', 'lar', 'moradia', 'habitação', 'domicílio'],
    'trabalho': ['emprego', 'serviço', 'ocupação', 'função', 'cargo'],
    'dinheiro': ['capital', 'verba', 'recurso', 'moeda', 'grana'],
    'comida': ['alimento', 'refeição', 'mantimento', 'sustento'],
    'água': ['líquido', 'fluido', 'bebida'],
    'amor': ['paixão', 'carinho', 'afeto', 'adoração', 'afeição'],
    'amigo': ['companheiro', 'camarada', 'colega', 'parceiro'],
    'importante': ['relevante', 'fundamental', 'essencial', 'crucial', 'significativo'],
    'fácil': ['simples', 'elementar', 'básico', 'descomplicado'],
    'difícil': ['complexo', 'complicado', 'árduo', 'trabalhoso'],
    'novo': ['recente', 'moderno', 'atual', 'contemporâneo'],
    'velho': ['antigo', 'arcaico', 'ultrapassado', 'obsoleto'],
    'carro': ['automóvel', 'veículo', 'auto'],
    'livro': ['obra', 'publicação', 'volume', 'exemplar'],
    'escola': ['colégio', 'instituição', 'estabelecimento'],
    'cidade': ['município', 'metrópole', 'localidade', 'urbe'],
    'país': ['nação', 'pátria', 'território', 'estado'],
    'mundo': ['planeta', 'terra', 'globo', 'universo'],
    'problema': ['questão', 'dificuldade', 'obstáculo', 'empecilho'],
    'solução': ['resolução', 'resposta', 'saída', 'alternativa'],
    'ideia': ['conceito', 'noção', 'pensamento', 'sugestão'],
    'pessoa': ['indivíduo', 'ser', 'sujeito', 'criatura'],
    'tempo': ['período', 'época', 'momento', 'duração'],
    'lugar': ['local', 'sítio', 'posição', 'ponto'],
    'vida': ['existência', 'vivência', 'experiência'],
    'morte': ['falecimento', 'óbito', 'fim', 'término']
  };

  const generateSynonyms = () => {
    const word = inputWord.trim().toLowerCase();
    
    if (!word) {
      toast.error('Digite uma palavra');
      return;
    }

    const foundSynonyms = synonymDatabase[word];
    
    if (foundSynonyms) {
      setSynonyms(foundSynonyms);
      toast.success(`${foundSynonyms.length} sinônimos encontrados!`);
    } else {
      setSynonyms([]);
      toast.error('Nenhum sinônimo encontrado para esta palavra');
    }
  };

  const copySynonym = (synonym: string) => {
    navigator.clipboard.writeText(synonym);
    toast.success(`"${synonym}" copiado!`);
  };

  const copyAllSynonyms = () => {
    if (synonyms.length === 0) {
      toast.error('Nenhum sinônimo para copiar');
      return;
    }
    
    navigator.clipboard.writeText(synonyms.join(', '));
    toast.success('Todos os sinônimos copiados!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Textos Sinônimos</CardTitle>
          <CardDescription>
            Encontre sinônimos para suas palavras em português
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="input-word">Texto original:</Label>
                <Input
                  id="input-word"
                  placeholder="Digite uma palavra..."
                  value={inputWord}
                  onChange={(e) => setInputWord(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && generateSynonyms()}
                />
              </div>
              <Button onClick={generateSynonyms} className="w-full">
                <ArrowRight className="h-4 w-4 mr-2" />
                Buscar Sinônimos
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Área de produção:</Label>
                <div className="min-h-[200px] p-4 border rounded-lg bg-secondary/20">
                  {synonyms.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {synonyms.map((synonym, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={() => copySynonym(synonym)}
                        >
                          {synonym}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center">
                      Digite uma palavra e clique em "Buscar Sinônimos"
                    </p>
                  )}
                </div>
              </div>
              {synonyms.length > 0 && (
                <Button onClick={copyAllSynonyms} variant="outline" className="w-full">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Todos
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-semibold mb-2">Palavras disponíveis:</h3>
            <div className="flex flex-wrap gap-2 text-sm">
              {Object.keys(synonymDatabase).slice(0, 20).map((word) => (
                <Badge key={word} variant="outline" className="text-xs">
                  {word}
                </Badge>
              ))}
              <Badge variant="outline" className="text-xs">
                ...e mais
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};