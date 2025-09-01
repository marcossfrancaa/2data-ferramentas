
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Mail, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const EmailSeparator = () => {
  const [emailList, setEmailList] = useState('');
  const [separator, setSeparator] = useState(',');
  const [separatedEmails, setSeparatedEmails] = useState<string[]>([]);
  const { toast } = useToast();

  const separateEmails = () => {
    if (!emailList.trim()) {
      toast({
        title: "Erro",
        description: "Digite uma lista de e-mails",
        variant: "destructive",
      });
      return;
    }

    // Extrai e-mails válidos usando regex
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const extractedEmails = emailList.match(emailRegex) || [];
    
    // Remove duplicatas
    const uniqueEmails = [...new Set(extractedEmails)];
    
    setSeparatedEmails(uniqueEmails);
    
    toast({
      title: "E-mails separados!",
      description: `${uniqueEmails.length} e-mails únicos encontrados`,
    });
  };

  const getFormattedOutput = () => {
    return separatedEmails.join(separator + ' ');
  };

  const copyToClipboard = async () => {
    const formatted = getFormattedOutput();
    if (!formatted) return;
    
    try {
      await navigator.clipboard.writeText(formatted);
      toast({
        title: "Copiado!",
        description: "E-mails copiados para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar os e-mails",
        variant: "destructive",
      });
    }
  };

  const downloadAsFile = () => {
    const formatted = getFormattedOutput();
    if (!formatted) return;

    const blob = new Blob([formatted], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'emails-separados.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Separador de E-mail</h1>
        </div>
        <p className="text-muted-foreground">
          Extraia e organize e-mails de textos, removendo duplicatas e formatando com separadores personalizados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Lista de E-mails
          </h3>
          
          <div className="space-y-4">
            <Textarea
              value={emailList}
              onChange={(e) => setEmailList(e.target.value)}
              placeholder="Cole aqui sua lista de e-mails separados por vírgula, espaço, quebra de linha ou qualquer texto..."
              className="min-h-64"
            />

            <div>
              <Label htmlFor="separator">Separador de Saída</Label>
              <Input
                id="separator"
                value={separator}
                onChange={(e) => setSeparator(e.target.value)}
                placeholder=","
                className="mt-1 w-20"
              />
            </div>

            <Button
              onClick={separateEmails}
              disabled={!emailList.trim()}
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Separar E-mails
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              E-mails Separados ({separatedEmails.length})
            </h3>
            {separatedEmails.length > 0 && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                >
                  <Copy className="w-4 h-4 mr-1" />
                  Copiar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadAsFile}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Baixar
                </Button>
              </div>
            )}
          </div>
          
          {separatedEmails.length > 0 ? (
            <div className="space-y-4">
              <Textarea
                value={getFormattedOutput()}
                readOnly
                className="min-h-64 font-mono text-sm bg-muted/30"
              />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <div className="font-medium text-card-foreground">Total</div>
                  <div className="text-lg font-bold text-primary">
                    {separatedEmails.length}
                  </div>
                </div>
                <div className="p-3 bg-accent/10 rounded-lg">
                  <div className="font-medium text-card-foreground">Separador</div>
                  <div className="text-lg font-bold text-primary font-mono">
                    "{separator}"
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <Mail className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>E-mails separados aparecerão aqui</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
