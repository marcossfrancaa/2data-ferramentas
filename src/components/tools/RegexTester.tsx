import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Code, Search } from 'lucide-react';

export const RegexTester = () => {
  const [pattern, setPattern] = useState('');
  const [testText, setTestText] = useState('');
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
  });

  const getMatches = () => {
    if (!pattern || !testText) return { matches: [], isValid: true, error: '' };

    try {
      let flagString = '';
      if (flags.global) flagString += 'g';
      if (flags.ignoreCase) flagString += 'i';
      if (flags.multiline) flagString += 'm';

      const regex = new RegExp(pattern, flagString);
      const matches = Array.from(testText.matchAll(regex));
      
      return {
        matches: matches.map(match => ({
          text: match[0],
          index: match.index || 0,
          groups: match.slice(1),
        })),
        isValid: true,
        error: '',
      };
    } catch (error) {
      return {
        matches: [],
        isValid: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  };

  const result = getMatches();

  const highlightMatches = (text: string) => {
    if (!pattern || !result.isValid || result.matches.length === 0) {
      return text;
    }

    let highlightedText = text;
    let offset = 0;

    result.matches.forEach((match) => {
      const startIndex = match.index + offset;
      const endIndex = startIndex + match.text.length;
      
      const before = highlightedText.substring(0, startIndex);
      const matchText = highlightedText.substring(startIndex, endIndex);
      const after = highlightedText.substring(endIndex);
      
      highlightedText = before + `<mark class="bg-accent/30 text-accent-foreground">${matchText}</mark>` + after;
      offset += 53; // Length of the mark tags
    });

    return highlightedText;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Code className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Testador RegEx</h1>
        </div>
        <p className="text-muted-foreground">
          Teste expressões regulares em tempo real e veja os resultados destacados no texto.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Configuração RegEx
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Padrão (Regex)
              </label>
              <Input
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                placeholder="Digite sua expressão regular..."
                className={`font-mono ${!result.isValid ? 'border-destructive' : ''}`}
              />
              {!result.isValid && (
                <p className="text-destructive text-sm mt-1">{result.error}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Flags
              </label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="global"
                    checked={flags.global}
                    onCheckedChange={(checked) => 
                      setFlags(prev => ({ ...prev, global: checked as boolean }))
                    }
                  />
                  <label htmlFor="global" className="text-sm text-card-foreground">
                    Global (g) - Encontrar todas as ocorrências
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="ignoreCase"
                    checked={flags.ignoreCase}
                    onCheckedChange={(checked) => 
                      setFlags(prev => ({ ...prev, ignoreCase: checked as boolean }))
                    }
                  />
                  <label htmlFor="ignoreCase" className="text-sm text-card-foreground">
                    Ignore Case (i) - Ignorar maiúsculas/minúsculas
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="multiline"
                    checked={flags.multiline}
                    onCheckedChange={(checked) => 
                      setFlags(prev => ({ ...prev, multiline: checked as boolean }))
                    }
                  />
                  <label htmlFor="multiline" className="text-sm text-card-foreground">
                    Multiline (m) - Modo multilinha
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-card-foreground mb-2 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Resultados ({result.matches.length} {result.matches.length === 1 ? 'match' : 'matches'})
              </h4>
              <div className="bg-muted/30 p-3 rounded-lg max-h-40 overflow-y-auto">
                {result.matches.length > 0 ? (
                  <div className="space-y-2">
                    {result.matches.map((match, index) => (
                      <div key={index} className="text-sm font-mono">
                        <span className="text-accent font-semibold">Match {index + 1}:</span> "{match.text}" 
                        <span className="text-muted-foreground"> (posição {match.index})</span>
                        {match.groups.length > 0 && (
                          <div className="ml-4 text-muted-foreground">
                            Grupos: [{match.groups.join(', ')}]
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">Nenhum match encontrado</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Texto de Teste
          </h3>
          
          <Textarea
            value={testText}
            onChange={(e) => setTestText(e.target.value)}
            placeholder="Cole aqui o texto onde deseja testar a regex..."
            className="min-h-64 font-mono text-sm mb-4"
          />

          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-2">
              Texto com Matches Destacados
            </h4>
            <div 
              className="bg-muted/30 p-3 rounded-lg min-h-32 max-h-64 overflow-y-auto font-mono text-sm whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ 
                __html: testText ? highlightMatches(testText) : 'Texto com matches aparecerá aqui...' 
              }}
            />
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Code className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Exemplos de RegEx</h4>
            <div className="text-muted-foreground space-y-1">
              <p><strong>Email:</strong> [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{'{2,}'}</p>
              <p><strong>CPF:</strong> \d{'{3}'}\.?\d{'{3}'}\.?\d{'{3}'}-?\d{'{2}'}</p>
              <p><strong>Telefone:</strong> \(\d{'{2}'}\)\s?\d{'{4,5}'}-?\d{'{4}'}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};