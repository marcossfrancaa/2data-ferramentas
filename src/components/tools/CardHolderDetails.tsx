
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, MapPin, Building, Globe } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AddressData } from './AddressMode';

interface CardHolderDetailsProps {
  dadosAdicionais: AddressData;
}

export const CardHolderDetails = ({ dadosAdicionais }: CardHolderDetailsProps) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência`,
    });
  };

  const copyAllDetails = () => {
    const endercoCompleto = `${dadosAdicionais.logradouro}${dadosAdicionais.numero ? `, ${dadosAdicionais.numero}` : ''}`;
    
    const allDetails = `Endereço: ${endercoCompleto}
Bairro: ${dadosAdicionais.bairro}
Cidade: ${dadosAdicionais.localidade}
Estado: ${dadosAdicionais.uf}
CEP: ${dadosAdicionais.cep}`;
    
    copyToClipboard(allDetails, 'Todos os detalhes');
  };

  const endercoCompleto = `${dadosAdicionais.logradouro}${dadosAdicionais.numero ? `, ${dadosAdicionais.numero}` : ''}`;

  return (
    <Card className="p-4 bg-accent/5 border-accent/20">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-card-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4 text-accent" />
          Dados de Cobrança
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={copyAllDetails}
        >
          <Copy className="w-3 h-3 mr-1" />
          Copiar Todos
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div className="flex items-center justify-between p-2 bg-background rounded border">
          <div className="flex items-center gap-2">
            <Building className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Endereço:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-right">{endercoCompleto}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(endercoCompleto, 'Endereço')}
              className="h-6 w-6 p-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-background rounded border">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Bairro:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{dadosAdicionais.bairro}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(dadosAdicionais.bairro, 'Bairro')}
              className="h-6 w-6 p-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-background rounded border">
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Cidade:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{dadosAdicionais.localidade}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(dadosAdicionais.localidade, 'Cidade')}
              className="h-6 w-6 p-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between p-2 bg-background rounded border">
          <div className="flex items-center gap-2">
            <Globe className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">Estado:</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{dadosAdicionais.uf}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(dadosAdicionais.uf, 'Estado')}
              className="h-6 w-6 p-0"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between p-2 bg-background rounded border">
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">CEP:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium font-mono">{dadosAdicionais.cep}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(dadosAdicionais.cep, 'CEP')}
                className="h-6 w-6 p-0"
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-muted-foreground text-center">
        Dados de endereço brasileiros para testes realistas
      </div>
    </Card>
  );
};
