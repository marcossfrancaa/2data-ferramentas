import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, FileText, Zap, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const JsonGenerator = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [keyValuePairs, setKeyValuePairs] = useState([{ key: '', value: '', type: 'string' }]);
  const [mode, setMode] = useState<'text' | 'form'>('text');
  const { toast } = useToast();

  const convertTextToJson = () => {
    if (!input.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira algum texto para converter",
        variant: "destructive",
      });
      return;
    }

    try {
      // Tenta diferentes formatos de conversão
      let result: any = {};
      
      // Se parece com chave=valor
      if (input.includes('=')) {
        const lines = input.split('\n').filter(line => line.trim());
        lines.forEach(line => {
          const [key, ...valueParts] = line.split('=');
          if (key && valueParts.length > 0) {
            const value = valueParts.join('=').trim();
            const cleanKey = key.trim().replace(/['"]/g, '');
            
            // Tenta detectar o tipo do valor
            if (value === 'true' || value === 'false') {
              result[cleanKey] = value === 'true';
            } else if (!isNaN(Number(value)) && value !== '') {
              result[cleanKey] = Number(value);
            } else {
              result[cleanKey] = value.replace(/['"]/g, '');
            }
          }
        });
      }
      // Se parece com CSV
      else if (input.includes(',') && input.includes('\n')) {
        const lines = input.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().replace(/['"]/g, ''));
        
        if (lines.length > 1) {
          result = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/['"]/g, ''));
            const row: any = {};
            headers.forEach((header, index) => {
              const value = values[index] || '';
              
              // Detecta tipo
              if (value === 'true' || value === 'false') {
                row[header] = value === 'true';
              } else if (!isNaN(Number(value)) && value !== '') {
                row[header] = Number(value);
              } else {
                row[header] = value;
              }
            });
            return row;
          });
        }
      }
      // Se é uma lista simples
      else if (input.includes('\n')) {
        const items = input.split('\n')
          .map(line => line.trim())
          .filter(line => line.length > 0);
        
        result = {
          items: items.map(item => {
            // Detecta tipo
            if (item === 'true' || item === 'false') {
              return item === 'true';
            } else if (!isNaN(Number(item)) && item !== '') {
              return Number(item);
            } else {
              return item;
            }
          })
        };
      }
      // Texto simples
      else {
        result = {
          text: input.trim()
        };
      }

      setOutput(JSON.stringify(result, null, 2));
      
      toast({
        title: "Sucesso",
        description: "Texto convertido para JSON",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível converter o texto",
        variant: "destructive",
      });
    }
  };

  const addKeyValuePair = () => {
    setKeyValuePairs([...keyValuePairs, { key: '', value: '', type: 'string' }]);
  };

  const removeKeyValuePair = (index: number) => {
    setKeyValuePairs(keyValuePairs.filter((_, i) => i !== index));
  };

  const updateKeyValuePair = (index: number, field: string, value: string) => {
    const updated = [...keyValuePairs];
    updated[index] = { ...updated[index], [field]: value };
    setKeyValuePairs(updated);
  };

  const generateFromForm = () => {
    const result: any = {};
    
    keyValuePairs.forEach(pair => {
      if (pair.key.trim()) {
        let convertedValue: any = pair.value;
        
        switch (pair.type) {
          case 'number':
            convertedValue = Number(pair.value) || 0;
            break;
          case 'boolean':
            convertedValue = pair.value.toLowerCase() === 'true';
            break;
          case 'array':
            try {
              convertedValue = pair.value.split(',').map(v => v.trim());
            } catch {
              convertedValue = [pair.value];
            }
            break;
          case 'object':
            try {
              convertedValue = JSON.parse(pair.value);
            } catch {
              convertedValue = pair.value;
            }
            break;
          default:
            convertedValue = pair.value;
        }
        
        result[pair.key.trim()] = convertedValue;
      }
    });

    setOutput(JSON.stringify(result, null, 2));
    
    toast({
      title: "Sucesso",
      description: "JSON gerado a partir do formulário",
    });
  };

  const copyToClipboard = async () => {
    if (!output) return;
    
    try {
      await navigator.clipboard.writeText(output);
      toast({
        title: "Copiado!",
        description: "JSON copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o JSON",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setKeyValuePairs([{ key: '', value: '', type: 'string' }]);
    setOutput('');
  };

  const loadExample = () => {
    if (mode === 'text') {
      setInput(`nome=João Silva
idade=30
email=joao@exemplo.com
ativo=true
cidade=São Paulo`);
    } else {
      setKeyValuePairs([
        { key: 'nome', value: 'João Silva', type: 'string' },
        { key: 'idade', value: '30', type: 'number' },
        { key: 'email', value: 'joao@exemplo.com', type: 'string' },
        { key: 'ativo', value: 'true', type: 'boolean' },
        { key: 'hobbies', value: 'programação, leitura, música', type: 'array' }
      ]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador JSON</h1>
        </div>
        <p className="text-muted-foreground">
          Converta texto simples em JSON estruturado ou crie JSON usando formulário interativo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              Entrada de Dados
            </h3>
            <div className="flex gap-2">
              <Button
                variant={mode === 'text' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('text')}
              >
                Texto
              </Button>
              <Button
                variant={mode === 'form' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('form')}
              >
                Formulário
              </Button>
            </div>
          </div>

          {mode === 'text' ? (
            <div className="space-y-4">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Cole seu texto aqui...&#10;Formatos suportados:&#10;- chave=valor&#10;- CSV&#10;- Lista de itens"
                className="min-h-80 font-mono text-sm"
              />
              
              <div className="flex gap-2">
                <Button onClick={convertTextToJson} className="flex-1">
                  <Zap className="w-4 h-4 mr-2" />
                  Converter para JSON
                </Button>
                <Button variant="outline" onClick={loadExample}>
                  Exemplo
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {keyValuePairs.map((pair, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-4">
                      <Label className="text-xs">Chave</Label>
                      <Input
                        value={pair.key}
                        onChange={(e) => updateKeyValuePair(index, 'key', e.target.value)}
                        placeholder="chave"
                        className="h-8"
                      />
                    </div>
                    <div className="col-span-4">
                      <Label className="text-xs">Valor</Label>
                      <Input
                        value={pair.value}
                        onChange={(e) => updateKeyValuePair(index, 'value', e.target.value)}
                        placeholder="valor"
                        className="h-8"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label className="text-xs">Tipo</Label>
                      <select
                        value={pair.type}
                        onChange={(e) => updateKeyValuePair(index, 'type', e.target.value)}
                        className="w-full h-8 text-xs border border-input rounded px-2 bg-background"
                      >
                        <option value="string">String</option>
                        <option value="number">Number</option>
                        <option value="boolean">Boolean</option>
                        <option value="array">Array</option>
                        <option value="object">Object</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeKeyValuePair(index)}
                        disabled={keyValuePairs.length === 1}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={addKeyValuePair} className="flex-1">
                  + Adicionar Campo
                </Button>
                <Button variant="outline" onClick={loadExample}>
                  Exemplo
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
              
              <Button onClick={generateFromForm} className="w-full">
                <Zap className="w-4 h-4 mr-2" />
                Gerar JSON
              </Button>
            </div>
          )}
        </Card>

        {/* Output */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              JSON Gerado
            </h3>
            {output && (
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
            )}
          </div>
          
          <Textarea
            value={output}
            readOnly
            placeholder="JSON gerado aparecerá aqui..."
            className="min-h-80 font-mono text-sm bg-muted/30"
          />
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Formatos Suportados</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• <strong>Chave=Valor:</strong> nome=João, idade=30</li>
              <li>• <strong>CSV:</strong> nome,idade\nJoão,30\nMaria,25</li>
              <li>• <strong>Lista:</strong> Uma linha por item</li>
              <li>• <strong>Formulário:</strong> Interface visual para criar JSON</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};