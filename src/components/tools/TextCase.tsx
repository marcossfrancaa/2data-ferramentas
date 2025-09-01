import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Type, FileText, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

export const TextCase = () => {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState<{[key: string]: string}>({});

  const transformations = [
    {
      key: 'uppercase',
      name: 'MAIÚSCULAS',
      description: 'Converte todo o texto para maiúsculas',
      transform: (text: string) => text.toUpperCase()
    },
    {
      key: 'lowercase',
      name: 'minúsculas',
      description: 'Converte todo o texto para minúsculas',
      transform: (text: string) => text.toLowerCase()
    },
    {
      key: 'titlecase',
      name: 'Primeira Letra Maiúscula',
      description: 'Primeira letra de cada palavra em maiúscula',
      transform: (text: string) => text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      )
    },
    {
      key: 'sentencecase',
      name: 'Primeira letra da frase',
      description: 'Apenas a primeira letra de cada frase em maiúscula',
      transform: (text: string) => {
        return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
      }
    },
    {
      key: 'camelcase',
      name: 'camelCase',
      description: 'Primeira palavra minúscula, demais com primeira maiúscula',
      transform: (text: string) => {
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
            return index === 0 ? word.toLowerCase() : word.toUpperCase();
          })
          .replace(/\s+/g, '');
      }
    },
    {
      key: 'pascalcase',
      name: 'PascalCase',
      description: 'Primeira letra de cada palavra maiúscula, sem espaços',
      transform: (text: string) => {
        return text
          .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
          .replace(/\s+/g, '');
      }
    },
    {
      key: 'snakecase',
      name: 'snake_case',
      description: 'Palavras separadas por underscore, tudo minúsculo',
      transform: (text: string) => {
        return text
          .toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^\w_]/g, '');
      }
    },
    {
      key: 'kebabcase',
      name: 'kebab-case',
      description: 'Palavras separadas por hífen, tudo minúsculo',
      transform: (text: string) => {
        return text
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, '');
      }
    },
    {
      key: 'dotcase',
      name: 'dot.case',
      description: 'Palavras separadas por ponto, tudo minúsculo',
      transform: (text: string) => {
        return text
          .toLowerCase()
          .replace(/\s+/g, '.')
          .replace(/[^\w.]/g, '');
      }
    },
    {
      key: 'constantcase',
      name: 'CONSTANT_CASE',
      description: 'Palavras separadas por underscore, tudo maiúsculo',
      transform: (text: string) => {
        return text
          .toUpperCase()
          .replace(/\s+/g, '_')
          .replace(/[^\w_]/g, '');
      }
    },
    {
      key: 'alternating',
      name: 'AlTeRnAtInG cAsE',
      description: 'Alterna entre maiúscula e minúscula a cada letra',
      transform: (text: string) => {
        return text
          .split('')
          .map((char, index) => 
            index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
          )
          .join('');
      }
    },
    {
      key: 'reverse',
      name: 'osrevni',
      description: 'Inverte a ordem dos caracteres',
      transform: (text: string) => text.split('').reverse().join('')
    },
    {
      key: 'removeSpaces',
      name: 'RemoveEspaços',
      description: 'Remove todos os espaços',
      transform: (text: string) => text.replace(/\s+/g, '')
    },
    {
      key: 'removeAccents',
      name: 'Remove Acentos',
      description: 'Remove acentos e caracteres especiais',
      transform: (text: string) => {
        return text
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
      }
    },
    {
      key: 'slugify',
      name: 'url-slug',
      description: 'Converte para formato de URL amigável',
      transform: (text: string) => {
        return text
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }
    }
  ];

  const transformText = () => {
    if (!inputText.trim()) {
      toast.error('Digite um texto para converter');
      return;
    }

    const newResults: {[key: string]: string} = {};
    
    transformations.forEach(({ key, transform }) => {
      try {
        newResults[key] = transform(inputText);
      } catch (error) {
        newResults[key] = 'Erro na conversão';
      }
    });

    setResults(newResults);
  };

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${name} copiado para a área de transferência`);
  };

  const clearAll = () => {
    setInputText('');
    setResults({});
  };

  const getStats = (text: string) => {
    return {
      chars: text.length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      lines: text.split('\n').length
    };
  };

  const stats = getStats(inputText);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Conversor de Texto</CardTitle>
          <CardDescription>
            Converta texto entre diferentes formatos e estilos de capitalização
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Texto Original</label>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs">
                  {stats.chars} caracteres
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {stats.words} palavras
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {stats.lines} linhas
                </Badge>
              </div>
            </div>
            <Textarea
              placeholder="Digite ou cole seu texto aqui..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={6}
              className="resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={transformText} disabled={!inputText.trim()}>
                <Type className="h-4 w-4 mr-2" />
                Converter Texto
              </Button>
              <Button onClick={clearAll} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Limpar
              </Button>
            </div>
          </div>

          {/* Results */}
          {Object.keys(results).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resultados</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {transformations.map(({ key, name, description }) => {
                  const result = results[key];
                  if (!result) return null;

                  return (
                    <Card key={key} className="relative">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-sm">{name}</h4>
                            <p className="text-xs text-muted-foreground">{description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(result, name)}
                            className="h-8 w-8 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="bg-secondary/50 rounded-lg p-3 text-sm font-mono break-all">
                          {result}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {result.length} caracteres
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="mt-6 p-4 bg-secondary/50 rounded-lg space-y-2">
            <h3 className="font-semibold">Exemplos de Uso</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>camelCase:</strong> Ideal para variáveis JavaScript</li>
              <li>• <strong>PascalCase:</strong> Usado para nomes de classes</li>
              <li>• <strong>snake_case:</strong> Comum em Python e bancos de dados</li>
              <li>• <strong>kebab-case:</strong> Perfeito para URLs e CSS</li>
              <li>• <strong>CONSTANT_CASE:</strong> Para constantes em código</li>
              <li>• <strong>Slug:</strong> URLs amigáveis para SEO</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};