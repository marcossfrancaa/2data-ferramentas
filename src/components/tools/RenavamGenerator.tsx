import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RenavamGenerator = () => {
  const [renavam, setRenavam] = useState('');
  const { toast } = useToast();

  const generateRenavam = () => {
    // Gera 10 dígitos aleatórios
    let numero = '';
    for (let i = 0; i < 10; i++) {
      numero += Math.floor(Math.random() * 10);
    }
    
    // Calcula o dígito verificador
    const sequencia = '3298765432';
    let soma = 0;
    
    for (let i = 0; i < 10; i++) {
      soma += parseInt(numero[i]) * parseInt(sequencia[i]);
    }
    
    const resto = soma % 11;
    const digitoVerificador = resto === 0 || resto === 1 ? 0 : 11 - resto;
    
    const renavamCompleto = numero + digitoVerificador;
    setRenavam(renavamCompleto);
    
    toast({
      title: "RENAVAM Gerado!",
      description: "Número RENAVAM válido foi gerado com sucesso",
    });
  };

  const copyToClipboard = () => {
    if (renavam) {
      navigator.clipboard.writeText(renavam);
      toast({
        title: "Copiado!",
        description: "RENAVAM copiado para a área de transferência",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Car className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de RENAVAM</h1>
        </div>
        <p className="text-muted-foreground">
          Gera números RENAVAM válidos para teste e desenvolvimento de sistemas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Gerador
          </h3>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Clique no botão abaixo para gerar um número RENAVAM válido:
            </p>
            
            <Button
              onClick={generateRenavam}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Gerar RENAVAM
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            RENAVAM Gerado
          </h3>
          
          <div className="space-y-4">
            {renavam ? (
              <div>
                <Label>Número RENAVAM</Label>
                <div className="flex gap-2">
                  <Input
                    value={renavam}
                    readOnly
                    className="font-mono text-lg"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Número válido com dígito verificador calculado
                </p>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Car className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>RENAVAM gerado aparecerá aqui</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Car className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre o RENAVAM</h4>
            <p className="text-muted-foreground mb-2">
              O RENAVAM (Registro Nacional de Veículos Automotores) é um número de 11 dígitos 
              que identifica unicamente cada veículo no Brasil.
            </p>
            <p className="text-red-700 font-medium">
              ⚠️ Este gerador é APENAS para fins de teste e desenvolvimento. 
              Não use para atividades ilegais ou fraudulentas.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};