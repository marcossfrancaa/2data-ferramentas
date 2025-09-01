import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Building2, AlertCircle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const banks = [
  { code: '001', name: 'Banco do Brasil' },
  { code: '033', name: 'Santander' },
  { code: '104', name: 'Caixa Econômica Federal' },
  { code: '237', name: 'Bradesco' },
  { code: '341', name: 'Itaú' },
  { code: '422', name: 'Safra' },
  { code: '389', name: 'Mercantil do Brasil' },
  { code: '077', name: 'Banco Inter' }
];

export const BankAccountValidator = () => {
  const [selectedBank, setSelectedBank] = useState('');
  const [agency, setAgency] = useState('');
  const [account, setAccount] = useState('');
  const [result, setResult] = useState('');
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();

  const validateBankAccount = () => {
    if (!selectedBank || !agency || !account) {
      setResult('Por favor, preencha todos os campos.');
      setIsValid(false);
      return;
    }

    // Validação básica de formato
    const agencyPattern = /^\d{4}$/;
    const accountPattern = /^\d{5,}(-\d)?$/;

    if (!agencyPattern.test(agency)) {
      setResult('Formato de agência inválido. Use 4 dígitos (ex: 1234).');
      setIsValid(false);
      return;
    }

    if (!accountPattern.test(account)) {
      setResult('Formato de conta inválido. Use pelo menos 5 dígitos, com ou sem dígito verificador (ex: 12345 ou 12345-6).');
      setIsValid(false);
      return;
    }

    const bankName = banks.find(bank => bank.code === selectedBank)?.name;
    
    setResult(`Conta bancária válida!

Banco: ${bankName} (${selectedBank})
Agência: ${agency}
Conta: ${account}

Esta validação verifica apenas o formato dos dados. Para confirmação real da existência da conta, consulte diretamente o banco.`);
    setIsValid(true);
  };

  const generateAccount = () => {
    const randomBank = banks[Math.floor(Math.random() * banks.length)];
    const randomAgency = Math.floor(Math.random() * 9000) + 1000;
    const randomAccount = Math.floor(Math.random() * 90000) + 10000;
    const randomDigit = Math.floor(Math.random() * 10);

    setSelectedBank(randomBank.code);
    setAgency(randomAgency.toString());
    setAccount(`${randomAccount}-${randomDigit}`);
    setResult('');
    setIsValid(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Building2 className="w-6 h-6" />
            Validador Online de Conta Bancária
          </CardTitle>
          <CardDescription className="text-center">
            Validador de contas bancárias, selecione as opções abaixo, digite a conta e agência e clique no botão "Validar Conta"
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-4 rounded-lg space-y-4">
            <h3 className="font-semibold">Opções:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bank">Banco:</Label>
                <Select value={selectedBank} onValueChange={setSelectedBank}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map((bank) => (
                      <SelectItem key={bank.code} value={bank.code}>
                        {bank.code} - {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="agency">Digite a agência:</Label>
                <Input
                  id="agency"
                  placeholder="Ex: 1234"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  maxLength={4}
                />
              </div>

              <div>
                <Label htmlFor="account">Digite a conta (com dígito):</Label>
                <Input
                  id="account"
                  placeholder="Ex: 12345-6"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                onClick={validateBankAccount}
                className="bg-gradient-primary hover:bg-gradient-primary/90 text-white px-8 py-2"
              >
                Gerar Conta
              </Button>
              
              <Button 
                onClick={generateAccount}
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
                    className={`min-h-[120px] border-0 bg-transparent resize-none p-0 ${
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
              <strong>IMPORTANTE:</strong> Este validador verifica apenas o formato dos dados bancários. 
              Para confirmação real da existência da conta, consulte diretamente o banco.
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