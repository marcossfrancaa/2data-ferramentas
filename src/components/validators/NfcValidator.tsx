import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle, XCircle, Search, Nfc, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const NfcValidator = () => {
  const [nfcType, setNfcType] = useState('');
  const [nfcData, setNfcData] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationDetails, setValidationDetails] = useState<any>(null);
  const { toast } = useToast();

  const nfcTypes = [
    { value: 'credit-card', name: 'Cartão de Crédito NFC' },
    { value: 'debit-card', name: 'Cartão de Débito NFC' },
    { value: 'access-card', name: 'Cartão de Acesso NFC' },
    { value: 'transport-card', name: 'Cartão de Transporte NFC' },
    { value: 'uid', name: 'UID NFC' },
  ];

  const validateNfc = () => {
    if (!nfcType) {
      toast({
        title: "Erro",
        description: "Selecione o tipo de validação NFC",
        variant: "destructive",
      });
      return;
    }

    if (!nfcData.trim()) {
      toast({
        title: "Erro",
        description: "Digite os dados NFC para validação",
        variant: "destructive",
      });
      return;
    }

    let validationResult;
    
    switch (nfcType) {
      case 'credit-card':
      case 'debit-card':
        validationResult = validateCardNfc(nfcData);
        break;
      case 'uid':
        validationResult = validateUidNfc(nfcData);
        break;
      case 'access-card':
        validationResult = validateAccessCard(nfcData);
        break;
      case 'transport-card':
        validationResult = validateTransportCard(nfcData);
        break;
      default:
        validationResult = { valid: false, error: 'Tipo não suportado' };
    }

    setIsValid(validationResult.valid);
    setValidationDetails(validationResult);

    toast({
      title: validationResult.valid ? "NFC Válido!" : "NFC Inválido!",
      description: validationResult.valid ? "Dados NFC válidos" : validationResult.error || "Dados NFC inválidos",
      variant: validationResult.valid ? "default" : "destructive",
    });
  };

  const validateCardNfc = (data: string) => {
    // Remove espaços e converte para maiúsculo
    const cleanData = data.replace(/\s/g, '').toUpperCase();
    
    // Verifica se é hexadecimal
    const hexPattern = /^[0-9A-F]+$/;
    if (!hexPattern.test(cleanData)) {
      return {
        valid: false,
        error: 'Dados devem estar em formato hexadecimal'
      };
    }

    // Verifica comprimento típico para cartões NFC (geralmente 8-16 bytes)
    if (cleanData.length < 16 || cleanData.length > 32) {
      return {
        valid: false,
        error: 'Comprimento inválido para cartão NFC'
      };
    }

    return {
      valid: true,
      type: nfcTypes.find(t => t.value === nfcType)?.name,
      format: 'Hexadecimal',
      length: cleanData.length,
      bytes: cleanData.length / 2,
      formatted: formatHex(cleanData)
    };
  };

  const validateUidNfc = (data: string) => {
    const cleanData = data.replace(/\s/g, '').toUpperCase();
    
    const hexPattern = /^[0-9A-F]+$/;
    if (!hexPattern.test(cleanData)) {
      return {
        valid: false,
        error: 'UID deve estar em formato hexadecimal'
      };
    }

    // UIDs NFC podem ter 4, 7 ou 10 bytes
    const validLengths = [8, 14, 20]; // 4, 7, 10 bytes em hex
    if (!validLengths.includes(cleanData.length)) {
      return {
        valid: false,
        error: 'UID deve ter 4, 7 ou 10 bytes (8, 14 ou 20 caracteres hex)'
      };
    }

    return {
      valid: true,
      type: 'UID NFC',
      format: 'Hexadecimal',
      length: cleanData.length,
      bytes: cleanData.length / 2,
      formatted: formatHex(cleanData)
    };
  };

  const validateAccessCard = (data: string) => {
    const cleanData = data.replace(/\s/g, '').toUpperCase();
    
    // Pode ser hexadecimal ou decimal
    const hexPattern = /^[0-9A-F]+$/;
    const decPattern = /^\d+$/;
    
    if (!hexPattern.test(cleanData) && !decPattern.test(cleanData)) {
      return {
        valid: false,
        error: 'Dados devem ser hexadecimal ou decimal'
      };
    }

    return {
      valid: true,
      type: 'Cartão de Acesso NFC',
      format: hexPattern.test(cleanData) ? 'Hexadecimal' : 'Decimal',
      length: cleanData.length,
      formatted: hexPattern.test(cleanData) ? formatHex(cleanData) : cleanData
    };
  };

  const validateTransportCard = (data: string) => {
    const cleanData = data.replace(/\s/g, '').toUpperCase();
    
    const hexPattern = /^[0-9A-F]+$/;
    if (!hexPattern.test(cleanData)) {
      return {
        valid: false,
        error: 'Dados devem estar em formato hexadecimal'
      };
    }

    return {
      valid: true,
      type: 'Cartão de Transporte NFC',
      format: 'Hexadecimal',
      length: cleanData.length,
      bytes: cleanData.length / 2,
      formatted: formatHex(cleanData)
    };
  };

  const formatHex = (hex: string) => {
    // Formata em grupos de 2 caracteres separados por espaço
    return hex.match(/.{2}/g)?.join(' ') || hex;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Nfc className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Validador NFC</h1>
        </div>
        <p className="text-muted-foreground">
          Valida diferentes tipos de dados NFC incluindo cartões, UIDs e sistemas de acesso.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Validação NFC
          </h3>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="nfcType">Tipo de NFC</Label>
              <Select value={nfcType} onValueChange={setNfcType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo de NFC" />
                </SelectTrigger>
                <SelectContent>
                  {nfcTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nfcData">Dados NFC</Label>
              <Input
                id="nfcData"
                value={nfcData}
                onChange={(e) => setNfcData(e.target.value)}
                placeholder="Digite os dados NFC (hex, decimal ou UID)"
                className="font-mono"
              />
              <p className="text-sm text-muted-foreground mt-1">
                {nfcType === 'uid' && 'Formato: 04A1B2C3 (4 bytes) ou 04A1B2C3D4E5F6 (7 bytes)'}
                {(nfcType === 'credit-card' || nfcType === 'debit-card') && 'Formato hexadecimal dos dados do cartão'}
                {nfcType === 'access-card' && 'Número do cartão (decimal ou hexadecimal)'}
                {nfcType === 'transport-card' && 'Dados hexadecimais do cartão de transporte'}
                {!nfcType && 'Selecione o tipo para ver o formato esperado'}
              </p>
            </div>

            <Button
              onClick={validateNfc}
              disabled={!nfcType || !nfcData.trim()}
              className="w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              Validar NFC
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Resultado da Validação
          </h3>
          
          <div className="space-y-4">
            {isValid !== null ? (
              <>
                <div className={`flex items-center gap-3 p-4 rounded-lg ${
                  isValid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  {isValid ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                  <div>
                    <h4 className={`font-semibold ${
                      isValid ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isValid ? 'NFC Válido' : 'NFC Inválido'}
                    </h4>
                    <p className={`text-sm ${
                      isValid ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {validationDetails?.error || validationDetails?.type}
                    </p>
                  </div>
                </div>

                {validationDetails && !validationDetails.error && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">Formato</Label>
                        <p>{validationDetails.format}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Comprimento</Label>
                        <p>{validationDetails.length} caracteres</p>
                      </div>
                    </div>
                    
                    {validationDetails.bytes && (
                      <div>
                        <Label className="text-muted-foreground">Tamanho</Label>
                        <p>{validationDetails.bytes} bytes</p>
                      </div>
                    )}

                    <div className="p-3 bg-accent/10 rounded-lg">
                      <Label className="text-muted-foreground text-sm">Dados Formatados</Label>
                      <p className="font-mono text-sm mt-1 break-all">{validationDetails.formatted}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Smartphone className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Resultado da validação aparecerá aqui</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Nfc className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Sobre Tecnologia NFC</h4>
            <p className="text-muted-foreground">
              NFC (Near Field Communication) é uma tecnologia de comunicação sem fio de curto alcance. 
              Cada dispositivo NFC possui identificadores únicos (UIDs) e pode armazenar diversos tipos de dados.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};