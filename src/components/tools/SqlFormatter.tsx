
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Database, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SqlFormatter = () => {
  const [sqlInput, setSqlInput] = useState('');
  const [formattedSql, setFormattedSql] = useState('');
  const { toast } = useToast();

  const formatSql = () => {
    if (!sqlInput.trim()) return;

    try {
      // Basic SQL formatting
      let formatted = sqlInput
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/\b(SELECT|FROM|WHERE|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|GROUP BY|ORDER BY|HAVING|UNION|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\b/gi, '\n$1')
        .replace(/,/g, ',\n  ')
        .replace(/\bAND\b/gi, '\n  AND')
        .replace(/\bOR\b/gi, '\n  OR')
        .replace(/\(/g, '(\n  ')
        .replace(/\)/g, '\n)')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');

      setFormattedSql(formatted);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível formatar o SQL",
        variant: "destructive",
      });
    }
  };

  const minifySql = () => {
    if (!sqlInput.trim()) return;

    const minified = sqlInput
      .replace(/\s+/g, ' ')
      .trim();

    setFormattedSql(minified);
  };

  const copyToClipboard = async () => {
    if (!formattedSql) return;
    
    try {
      await navigator.clipboard.writeText(formattedSql);
      toast({
        title: "Copiado!",
        description: "SQL copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o SQL",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Database className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">SQL Formatter</h1>
        </div>
        <p className="text-muted-foreground">
          Formata e organiza código SQL de forma legível ou minifica para economia de espaço.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            SQL de Entrada
          </h3>
          
          <Textarea
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            placeholder="Cole seu código SQL aqui..."
            className="min-h-80 font-mono text-sm mb-4"
          />

          <div className="flex gap-2">
            <Button
              onClick={formatSql}
              disabled={!sqlInput.trim()}
              className="flex-1"
            >
              <Database className="w-4 h-4 mr-2" />
              Formatar
            </Button>
            <Button
              onClick={minifySql}
              disabled={!sqlInput.trim()}
              variant="outline"
              className="flex-1"
            >
              Minificar
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              SQL Formatado
            </h3>
            {formattedSql && (
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
            value={formattedSql}
            readOnly
            placeholder="SQL formatado aparecerá aqui..."
            className="min-h-80 font-mono text-sm bg-muted/30"
          />
        </Card>
      </div>
    </div>
  );
};
