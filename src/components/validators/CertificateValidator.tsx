import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const CertificateValidator = () => {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [result, setResult] = useState('');
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();

  const validateCertificate = () => {
    if (!certificateNumber.trim()) {
      setResult('Por favor, digite um número de CERTIDÃO.');
      setIsValid(false);
      return;
    }

    // Remove espaços e caracteres especiais
    const cleanNumber = certificateNumber.replace(/\D/g, '');

    // Validação básica de formato (32 dígitos para certidões novas)
    if (cleanNumber.length === 32) {
      // Certidão nova (desde 2010)
      const formatted = cleanNumber.replace(/(\d{6})(\d{2})(\d{2})(\d{4})(\d{1})(\d{5})(\d{3})(\d{2})(\d{2})(\d{3})/, 
        '$1 $2 $3 $4 $5 $6 $7 $8 $9 $10');
      
      setResult(`✅ CERTIDÃO VÁLIDA!

Número da Certidão: ${formatted}
Tipo: Certidão Nacional (Novo Formato)

Esta certidão segue o padrão estabelecido pelo CNJ desde 2010.

IMPORTANTE: Esta validação verifica apenas o formato do número. Para verificação de autenticidade, consulte o site do cartório emissor ou use o sistema oficial do CNJ.`);
      setIsValid(true);
    } else if (cleanNumber.length >= 20 && cleanNumber.length <= 30) {
      // Certidão antiga (antes de 2010)
      setResult(`⚠️ FORMATO ANTIGO DETECTADO

Número da Certidão: ${certificateNumber}
Tipo: Certidão Antiga (Formato anterior a 2010)

Esta certidão usa o formato antigo, anterior ao padrão nacional do CNJ.

IMPORTANTE: Para validação completa, consulte diretamente o cartório emissor.`);
      setIsValid(true);
    } else {
      setResult(`❌ FORMATO INVÁLIDO

O número informado não possui o formato válido de uma certidão.

Formatos aceitos:
• Certidão Nova: 32 dígitos (padrão CNJ desde 2010)
• Certidão Antiga: 20 a 30 caracteres (formato anterior a 2010)

Exemplo de certidão nova: 12345678901234567890123456789012`);
      setIsValid(false);
    }
  };

  const generateExample = () => {
    // Gera um exemplo de certidão nova (32 dígitos)
    const example = Array.from({ length: 32 }, () => Math.floor(Math.random() * 10)).join('');
    setCertificateNumber(example);
    setResult('');
    setIsValid(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <FileText className="w-6 h-6" />
            Validador Online de Certidões
          </CardTitle>
          <CardDescription className="text-center">
            Digite um número de CERTIDÃO (pode ser de nascimento, casamento, divórcio ou óbito) depois clique em "Validar Certidão" para verificar se ele é válido ou não, vale lembrar que está verificação só é válida para certidões emitidas de 2010 para cá (novo formato)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold">Opções:</h3>
            
            <div>
              <Label htmlFor="certificate">Digite o número da certidão:</Label>
              <Input
                id="certificate"
                placeholder="Digite o número da certidão"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={validateCertificate}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white px-8 py-2"
              >
                Validar Certidão
              </Button>
              
              <Button 
                onClick={generateExample}
                variant="outline"
                className="px-8 py-2"
              >
                Gerar Exemplo
              </Button>
            </div>
          </div>

          {result && (
            <div>
              <Label className="text-sm font-medium">Resposta:</Label>
              <div className={`p-4 rounded-lg border ${isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-start gap-2">
                  {isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  )}
                  <Textarea
                    value={result}
                    readOnly
                    className={`min-h-[150px] border-0 bg-transparent resize-none p-0 ${
                      isValid ? 'text-green-800' : 'text-red-800'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          <Separator />

          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>IMPORTANTE:</strong> Esta validação verifica apenas o formato do número da certidão. 
              Para verificação de autenticidade, consulte o site do cartório emissor ou use o sistema oficial do CNJ.
            </p>
            <p>
              Certidões emitidas antes de 2010 podem ter formatos diferentes do padrão nacional atual.
            </p>
            <p>
              Use esta ferramenta apenas para fins de teste e validação de formato.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};