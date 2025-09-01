import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CreditCard, Copy, RefreshCw, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PisGenerator = () => {
  const [pisGerado, setPisGerado] = useState('');
  const [comPontuacao, setComPontuacao] = useState(true);
  const { toast } = useToast();

  const generatePIS = () => {
    // Gera os primeiros 10 dígitos do PIS
    const digits = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10));
    
    // Calcula o dígito verificador
    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * weights[i];
    }
    
    let remainder = sum % 11;
    let checkDigit = remainder < 2 ? 0 : 11 - remainder;
    
    const fullPIS = [...digits, checkDigit];
    
    let formattedPIS;
    if (comPontuacao) {
      // Formato: XXX.XXXXX.XX-X
      formattedPIS = `${fullPIS.slice(0, 3).join('')}.${fullPIS.slice(3, 8).join('')}.${fullPIS.slice(8, 10).join('')}-${fullPIS[10]}`;
    } else {
      formattedPIS = fullPIS.join('');
    }
    
    setPisGerado(formattedPIS);
  };

  const copyToClipboard = () => {
    if (!pisGerado) return;
    
    navigator.clipboard.writeText(pisGerado);
    toast({
      title: "Copiado!",
      description: "PIS copiado para a área de transferência",
    });
  };

  const validatePIS = (pis: string) => {
    // Remove pontuação
    const numbers = pis.replace(/[^\d]/g, '');
    
    if (numbers.length !== 11) return false;
    
    const digits = numbers.split('').map(Number);
    const weights = [3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * weights[i];
    }
    
    const remainder = sum % 11;
    const expectedCheckDigit = remainder < 2 ? 0 : 11 - remainder;
    
    return digits[10] === expectedCheckDigit;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador Online de PIS/PASEP Válido</h1>
        </div>
        <p className="text-muted-foreground">
          Utilize nosso gerador de PIS/PASEP, basta clicar em "Gerar PIS" e pronto! 
          Um novo número de PIS válido será gerado. Você ainda tem opção de calcular ou não os "pontos" entre os números.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Opções da ferramenta:
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pontuacao" className="font-medium">
                  Gerar com pontuação?
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Inclui pontos e traços na formatação
                </p>
              </div>
              <Switch
                id="pontuacao"
                checked={comPontuacao}
                onCheckedChange={setComPontuacao}
              />
            </div>
          </div>

          <Button
            onClick={generatePIS}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Gerar PIS
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            PIS/PASEP Gerado:
          </h3>
          
          <div className="space-y-4">
            {pisGerado ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xl font-bold text-green-800">
                    {pisGerado}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-12 border-2 border-dashed border-muted rounded-lg">
                <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Clique em "Gerar PIS" para criar um número válido</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-yellow-50 border-yellow-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-yellow-800 mb-1">IMPORTANTE:</h4>
            <p className="text-yellow-700">
              Nosso gerador online de Pis tem como intenção auxiliar estudantes, programadores, analistas e 
              testadores a gerar PIS válidos, porém, fakes e que não correspondem a uma pessoa física real. 
              A má utilização dos dados aqui gerados são de total responsabilidade do usuário.
            </p>
          </div>
        </div>
      </Card>

      <Card className="mt-4 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre o PIS/PASEP</h4>
            <p className="text-muted-foreground">
              O PIS (Programa de Integração Social) e PASEP (Programa de Formação do Patrimônio do Servidor Público) 
              são programas sociais brasileiros. O número tem 11 dígitos e possui um algoritmo de validação específico.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};