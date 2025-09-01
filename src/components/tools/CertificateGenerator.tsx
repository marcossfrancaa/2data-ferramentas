import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const tiposCertidao = [
  { value: 'nascimento', label: 'Certidão de Nascimento' },
  { value: 'casamento', label: 'Certidão de Casamento' },
  { value: 'obito', label: 'Certidão de Óbito' },
];

export const CertificateGenerator = () => {
  const [tipoCertidao, setTipoCertidao] = useState('');
  const [comPontuacao, setComPontuacao] = useState('sim');
  const [numeroCertidao, setNumeroCertidao] = useState('');
  const [cartorio, setCartorio] = useState('');
  const [livro, setLivro] = useState('');
  const [folha, setFolha] = useState('');
  const { toast } = useToast();

  const generateCertificate = () => {
    // Gera número de certidão (32 dígitos)
    const digits = Array.from({ length: 32 }, () => Math.floor(Math.random() * 10));
    
    let numero;
    if (comPontuacao === 'sim') {
      // Formato: XXXXXX XX XX XXXX X XXXXX XXX XXXXXXX XX
      numero = `${digits.slice(0, 6).join('')} ${digits.slice(6, 8).join('')} ${digits.slice(8, 10).join('')} ${digits.slice(10, 14).join('')} ${digits[14]} ${digits.slice(15, 20).join('')} ${digits.slice(20, 23).join('')} ${digits.slice(23, 30).join('')} ${digits.slice(30, 32).join('')}`;
    } else {
      numero = digits.join('');
    }
    
    setNumeroCertidao(numero);
    setCartorio(`${Math.floor(Math.random() * 999) + 1}º Cartório de Registro Civil`);
    setLivro(`${Math.floor(Math.random() * 999) + 1}`);
    setFolha(`${Math.floor(Math.random() * 999) + 1}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Informação copiada para a área de transferência",
    });
  };

  const limparCampos = () => {
    setNumeroCertidao('');
    setCartorio('');
    setLivro('');
    setFolha('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de Certidões</h1>
        </div>
        <p className="text-muted-foreground">
          Gera números de certidões válidos para teste e desenvolvimento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Configurações
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="tipo">Tipo de Certidão</Label>
              <Select value={tipoCertidao} onValueChange={setTipoCertidao}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de certidão" />
                </SelectTrigger>
                <SelectContent>
                  {tiposCertidao.map((tipo) => (
                    <SelectItem key={tipo.value} value={tipo.value}>
                      {tipo.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pontuacao">Com Pontuação</Label>
              <Select value={comPontuacao} onValueChange={setComPontuacao}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sim">Sim</SelectItem>
                  <SelectItem value="nao">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              onClick={generateCertificate}
              disabled={!tipoCertidao}
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Gerar Certidão
            </Button>
            <Button
              variant="outline"
              onClick={limparCampos}
              disabled={!numeroCertidao}
            >
              Limpar
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Certidão Gerada
          </h3>
          
          <div className="space-y-4">
            {tipoCertidao && (
              <div>
                <Label>Tipo</Label>
                <div className="flex gap-2">
                  <Input
                    value={tiposCertidao.find(t => t.value === tipoCertidao)?.label || ''}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(tiposCertidao.find(t => t.value === tipoCertidao)?.label || '')}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            <div>
              <Label>Número da Certidão</Label>
              <div className="flex gap-2">
                <Input
                  value={numeroCertidao}
                  readOnly
                  placeholder="Número será gerado aqui"
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(numeroCertidao)}
                  disabled={!numeroCertidao}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {cartorio && (
              <div>
                <Label>Cartório</Label>
                <div className="flex gap-2">
                  <Input
                    value={cartorio}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(cartorio)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {livro && (
              <div>
                <Label>Livro</Label>
                <div className="flex gap-2">
                  <Input
                    value={livro}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(livro)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {folha && (
              <div>
                <Label>Folha</Label>
                <div className="flex gap-2">
                  <Input
                    value={folha}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(folha)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Aviso Importante</h4>
            <p className="text-muted-foreground">
              Este gerador de certidões é apenas para fins de teste e desenvolvimento. 
              Não use para fraudes ou atividades ilegais.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};