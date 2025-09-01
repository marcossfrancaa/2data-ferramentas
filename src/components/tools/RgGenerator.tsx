import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CreditCard, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const estados = [
  { sigla: 'AC', nome: 'Acre' },
  { sigla: 'AL', nome: 'Alagoas' },
  { sigla: 'AP', nome: 'Amapá' },
  { sigla: 'AM', nome: 'Amazonas' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'CE', nome: 'Ceará' },
  { sigla: 'DF', nome: 'Distrito Federal' },
  { sigla: 'ES', nome: 'Espírito Santo' },
  { sigla: 'GO', nome: 'Goiás' },
  { sigla: 'MA', nome: 'Maranhão' },
  { sigla: 'MT', nome: 'Mato Grosso' },
  { sigla: 'MS', nome: 'Mato Grosso do Sul' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'PA', nome: 'Pará' },
  { sigla: 'PB', nome: 'Paraíba' },
  { sigla: 'PR', nome: 'Paraná' },
  { sigla: 'PE', nome: 'Pernambuco' },
  { sigla: 'PI', nome: 'Piauí' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'RN', nome: 'Rio Grande do Norte' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'RO', nome: 'Rondônia' },
  { sigla: 'RR', nome: 'Roraima' },
  { sigla: 'SC', nome: 'Santa Catarina' },
  { sigla: 'SP', nome: 'São Paulo' },
  { sigla: 'SE', nome: 'Sergipe' },
  { sigla: 'TO', nome: 'Tocantins' },
];

export const RgGenerator = () => {
  const [rg, setRg] = useState('');
  const [orgaoEmissor, setOrgaoEmissor] = useState('');
  const [estado, setEstado] = useState('');
  const { toast } = useToast();

  const generateRG = () => {
    // Gera 8 dígitos aleatórios
    const digits = Array.from({ length: 8 }, () => Math.floor(Math.random() * 10));
    
    // Formata como XX.XXX.XXX-X
    const formattedRG = `${digits.slice(0, 2).join('')}.${digits.slice(2, 5).join('')}.${digits.slice(5, 8).join('')}-${Math.floor(Math.random() * 10)}`;
    
    setRg(formattedRG);
    setOrgaoEmissor('SSP'); // Órgão emissor padrão
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "RG copiado para a área de transferência",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de RG</h1>
        </div>
        <p className="text-muted-foreground">
          Gera números de RG válidos para teste e desenvolvimento.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Configurações
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select value={estado} onValueChange={setEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {estados.map((estado) => (
                    <SelectItem key={estado.sigla} value={estado.sigla}>
                      {estado.nome} ({estado.sigla})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="orgao">Órgão Emissor</Label>
              <Input
                id="orgao"
                value={orgaoEmissor}
                onChange={(e) => setOrgaoEmissor(e.target.value)}
                placeholder="Ex: SSP"
              />
            </div>
          </div>

          <Button
            onClick={generateRG}
            className="w-full mt-6"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Gerar RG
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            RG Gerado
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label>Número do RG</Label>
              <div className="flex gap-2">
                <Input
                  value={rg}
                  readOnly
                  placeholder="RG será gerado aqui"
                  className="font-mono"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(rg)}
                  disabled={!rg}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {orgaoEmissor && (
              <div>
                <Label>Órgão Emissor</Label>
                <div className="flex gap-2">
                  <Input
                    value={orgaoEmissor}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(orgaoEmissor)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {estado && (
              <div>
                <Label>Estado</Label>
                <div className="flex gap-2">
                  <Input
                    value={estados.find(e => e.sigla === estado)?.nome || estado}
                    readOnly
                    className="font-mono"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(estado)}
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
          <CreditCard className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Aviso Importante</h4>
            <p className="text-muted-foreground">
              Este gerador de RG é apenas para fins de teste e desenvolvimento. 
              Não use para fraudes ou atividades ilegais.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};