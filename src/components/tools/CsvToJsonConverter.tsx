import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, FileText, Copy, Download, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const CsvToJsonConverter = () => {
  const [conversionMode, setConversionMode] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json');
  const [inputData, setInputData] = useState('');
  const [outputData, setOutputData] = useState('');
  const [hasHeaders, setHasHeaders] = useState(true);
  const [csvSeparator, setCsvSeparator] = useState(',');

  const convertData = () => {
    if (conversionMode === 'csv-to-json') {
      convertCsvToJson();
    } else {
      convertJsonToCsv();
    }
  };

  const convertCsvToJson = () => {
    if (!inputData.trim()) {
      toast({
        title: "CSV vazio",
        description: "Digite ou cole o conteúdo CSV para converter",
        variant: "destructive"
      });
      return;
    }

    try {
      const lines = inputData.trim().split('\n');
      if (lines.length === 0) return;

      let headers: string[] = [];
      let dataRows: string[][] = [];

      if (hasHeaders && lines.length > 1) {
        headers = parseCsvRow(lines[0]);
        dataRows = lines.slice(1).map(line => parseCsvRow(line));
      } else {
        // Se não tem headers, criar headers genéricos
        const firstRow = parseCsvRow(lines[0]);
        headers = firstRow.map((_, index) => `column_${index + 1}`);
        dataRows = lines.map(line => parseCsvRow(line));
      }

      const jsonArray = dataRows.map(row => {
        const obj: { [key: string]: string } = {};
        headers.forEach((header, index) => {
          obj[header] = row[index] || '';
        });
        return obj;
      });

      const jsonString = JSON.stringify(jsonArray, null, 2);
      setOutputData(jsonString);
      
      toast({
        title: "Conversão realizada",
        description: `${jsonArray.length} linha(s) convertida(s) para JSON`,
      });
    } catch (error) {
      toast({
        title: "Erro na conversão",
        description: "Verifique se o formato CSV está correto",
        variant: "destructive"
      });
    }
  };

  const convertJsonToCsv = () => {
    if (!inputData.trim()) {
      toast({
        title: "JSON vazio",
        description: "Digite ou cole o conteúdo JSON para converter",
        variant: "destructive"
      });
      return;
    }

    try {
      const jsonData = JSON.parse(inputData);
      
      if (!Array.isArray(jsonData)) {
        toast({
          title: "Formato inválido",
          description: "O JSON deve ser um array de objetos",
          variant: "destructive"
        });
        return;
      }

      if (jsonData.length === 0) {
        setOutputData('');
        toast({
          title: "Array vazio",
          description: "O array JSON está vazio",
          variant: "destructive"
        });
        return;
      }

      // Obter todas as chaves únicas de todos os objetos
      const allKeys = new Set<string>();
      jsonData.forEach(obj => {
        if (typeof obj === 'object' && obj !== null) {
          Object.keys(obj).forEach(key => allKeys.add(key));
        }
      });

      const headers = Array.from(allKeys);
      let csvContent = '';

      // Adicionar cabeçalhos se necessário
      if (hasHeaders) {
        csvContent = headers.map(header => formatCsvField(header)).join(csvSeparator) + '\n';
      }

      // Adicionar dados
      jsonData.forEach(obj => {
        const row = headers.map(header => {
          const value = obj && typeof obj === 'object' ? obj[header] : '';
          return formatCsvField(String(value || ''));
        });
        csvContent += row.join(csvSeparator) + '\n';
      });

      setOutputData(csvContent.trim());
      
      toast({
        title: "Conversão realizada",
        description: `${jsonData.length} objeto(s) convertido(s) para CSV`,
      });
    } catch (error) {
      toast({
        title: "Erro na conversão",
        description: "Verifique se o formato JSON está correto",
        variant: "destructive"
      });
    }
  };

  const formatCsvField = (field: string): string => {
    // Se o campo contém vírgula, aspas ou quebra de linha, deve ser quoted
    if (field.includes(csvSeparator) || field.includes('"') || field.includes('\n')) {
      // Escapar aspas duplicando elas
      const escaped = field.replace(/"/g, '""');
      return `"${escaped}"`;
    }
    return field;
  };

  const parseCsvRow = (row: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < row.length; i++) {
      const char = row[i];
      const nextChar = row[i + 1];
      
      if (char === '"' && inQuotes && nextChar === '"') {
        current += '"';
        i++; // Pula a próxima aspas
      } else if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === csvSeparator && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputData);
    const format = conversionMode === 'csv-to-json' ? 'JSON' : 'CSV';
    toast({
      title: "Copiado!",
      description: `${format} copiado para a área de transferência`,
    });
  };

  const downloadFile = () => {
    const isJson = conversionMode === 'csv-to-json';
    const mimeType = isJson ? 'application/json' : 'text/csv';
    const extension = isJson ? 'json' : 'csv';
    const fileName = `converted.${extension}`;
    
    const blob = new Blob([outputData], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download iniciado",
      description: `Arquivo ${extension.toUpperCase()} baixado com sucesso`,
    });
  };

  const loadSampleData = () => {
    if (conversionMode === 'csv-to-json') {
      const sample = `nome,email,idade,cidade
João Silva,joao@email.com,30,São Paulo
Maria Santos,maria@email.com,25,Rio de Janeiro
Pedro Oliveira,pedro@email.com,35,Belo Horizonte`;
      setInputData(sample);
    } else {
      const sample = `[
  {
    "nome": "João Silva",
    "email": "joao@email.com",
    "idade": 30,
    "cidade": "São Paulo"
  },
  {
    "nome": "Maria Santos",
    "email": "maria@email.com",
    "idade": 25,
    "cidade": "Rio de Janeiro"
  }
]`;
      setInputData(sample);
    }
  };

  const swapConversionMode = () => {
    const newMode = conversionMode === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json';
    setConversionMode(newMode);
    // Trocar input e output
    const tempData = inputData;
    setInputData(outputData);
    setOutputData(tempData);
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {conversionMode === 'csv-to-json' ? 'CSV → JSON' : 'JSON → CSV'} Converter
        </CardTitle>
        <CardDescription>
          {conversionMode === 'csv-to-json' 
            ? 'Converta dados CSV para formato JSON de forma simples e rápida'
            : 'Converta dados JSON para formato CSV de forma simples e rápida'
          }
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seletor de modo e opções */}
        <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted/20 rounded-lg">
          <div className="flex-1 space-y-2">
            <Label htmlFor="conversion-mode">Direção da Conversão</Label>
            <Select value={conversionMode} onValueChange={(value: 'csv-to-json' | 'json-to-csv') => setConversionMode(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv-to-json">CSV → JSON</SelectItem>
                <SelectItem value="json-to-csv">JSON → CSV</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-2 items-end">
            <Button
              variant="outline"
              onClick={swapConversionMode}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Trocar Direção
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="input-data">
                Entrada {conversionMode === 'csv-to-json' ? 'CSV' : 'JSON'}
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={loadSampleData}
              >
                Carregar Exemplo
              </Button>
            </div>
            <Textarea
              id="input-data"
              placeholder={
                conversionMode === 'csv-to-json' 
                  ? "Cole seu CSV aqui...\n\nExemplo:\nnome,email,idade\nJoão,joao@email.com,30\nMaria,maria@email.com,25"
                  : "Cole seu JSON aqui...\n\nExemplo:\n[\n  {\"nome\": \"João\", \"idade\": 30},\n  {\"nome\": \"Maria\", \"idade\": 25}\n]"
              }
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              className="min-h-[300px] font-mono text-sm"
            />
            
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={hasHeaders}
                  onChange={(e) => setHasHeaders(e.target.checked)}
                  className="rounded border-gray-300"
                />
                {conversionMode === 'csv-to-json' 
                  ? 'Primeira linha contém cabeçalhos'
                  : 'Incluir cabeçalhos no CSV'
                }
              </label>
              
              {conversionMode === 'json-to-csv' && (
                <div className="flex items-center gap-2">
                  <Label htmlFor="csv-separator" className="text-sm">Separador CSV:</Label>
                  <Select value={csvSeparator} onValueChange={setCsvSeparator}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=",">Vírgula (,)</SelectItem>
                      <SelectItem value=";">Ponto-vírgula (;)</SelectItem>
                      <SelectItem value="\t">Tab (\t)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Output */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="output-data">
                Saída {conversionMode === 'csv-to-json' ? 'JSON' : 'CSV'}
              </Label>
              {outputData && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadFile}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Baixar
                  </Button>
                </div>
              )}
            </div>
            <Textarea
              id="output-data"
              placeholder={`O ${conversionMode === 'csv-to-json' ? 'JSON' : 'CSV'} convertido aparecerá aqui...`}
              value={outputData}
              readOnly
              className="min-h-[300px] font-mono text-sm bg-muted/50"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button onClick={convertData} className="w-full md:w-auto">
            <ArrowRight className="h-4 w-4 mr-2" />
            Converter {conversionMode === 'csv-to-json' ? 'CSV para JSON' : 'JSON para CSV'}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 text-sm text-muted-foreground">
          {conversionMode === 'csv-to-json' ? (
            <>
              <div>
                <strong className="text-foreground">Formato CSV suportado:</strong>
                <ul className="mt-2 space-y-1">
                  <li>• Valores separados por vírgula</li>
                  <li>• Campos com aspas duplas (opcional)</li>
                  <li>• Quebras de linha para separar registros</li>
                  <li>• Cabeçalhos opcionais na primeira linha</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Características:</strong>
                <ul className="mt-2 space-y-1">
                  <li>• Preserva tipos de dados como string</li>
                  <li>• Suporta campos vazios</li>
                  <li>• Gera JSON formatado e indentado</li>
                  <li>• Validação automática do resultado</li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <div>
                <strong className="text-foreground">Formato JSON suportado:</strong>
                <ul className="mt-2 space-y-1">
                  <li>• Array de objetos JSON válidos</li>
                  <li>• Propriedades com valores string/number</li>
                  <li>• Estrutura consistente recomendada</li>
                  <li>• Objetos aninhados são convertidos para string</li>
                </ul>
              </div>
              <div>
                <strong className="text-foreground">Características:</strong>
                <ul className="mt-2 space-y-1">
                  <li>• Detecta automaticamente todas as colunas</li>
                  <li>• Escapa caracteres especiais no CSV</li>
                  <li>• Suporta diferentes separadores</li>
                  <li>• Gera CSV compatível com Excel</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};