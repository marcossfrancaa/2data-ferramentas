
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export type AddressMode = 'random' | 'cep' | 'manual';

export interface AddressData {
  logradouro: string;
  numero: string;
  bairro: string;
  localidade: string;
  uf: string;
  cep: string;
}

interface AddressModeProps {
  mode: AddressMode;
  onModeChange: (mode: AddressMode) => void;
  onAddressChange: (address: AddressData) => void;
  addressData: AddressData;
}

export const AddressMode = ({ mode, onModeChange, onAddressChange, addressData }: AddressModeProps) => {
  const [cepInput, setCepInput] = useState('');
  const [numeroInput, setNumeroInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    }
    return numbers.substring(0, 8).replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  const buscarCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      toast({
        title: "CEP inválido",
        description: "O CEP deve ter 8 dígitos",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        toast({
          title: "CEP não encontrado",
          description: "Verifique se o CEP está correto",
          variant: "destructive",
        });
        return;
      }

      const newAddress: AddressData = {
        logradouro: data.logradouro || '',
        numero: numeroInput || '',
        bairro: data.bairro || '',
        localidade: data.localidade || '',
        uf: data.uf || '',
        cep: data.cep || '',
      };

      onAddressChange(newAddress);
      
      toast({
        title: "CEP encontrado!",
        description: `${data.logradouro}, ${data.localidade} - ${data.uf}`,
      });
    } catch (error) {
      toast({
        title: "Erro ao consultar CEP",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCepInputChange = (value: string) => {
    const formatted = formatCep(value);
    setCepInput(formatted);
    
    // Auto-buscar quando CEP estiver completo
    const cleanCep = value.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      buscarCep(formatted);
    }
  };

  const handleNumeroChange = (value: string) => {
    setNumeroInput(value);
    if (mode === 'cep' && addressData.logradouro) {
      onAddressChange({
        ...addressData,
        numero: value
      });
    }
  };

  const handleManualFieldChange = (field: keyof AddressData, value: string) => {
    onAddressChange({
      ...addressData,
      [field]: value
    });
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h4 className="font-semibold text-card-foreground">Configuração de Endereço</h4>
      </div>

      <RadioGroup value={mode} onValueChange={(value) => onModeChange(value as AddressMode)}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="random" id="random" />
          <Label htmlFor="random">Gerar Endereço Aleatório (BR)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="cep" id="cep" />
          <Label htmlFor="cep">Buscar por CEP</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="manual" id="manual" />
          <Label htmlFor="manual">Digitar Manualmente</Label>
        </div>
      </RadioGroup>

      {mode === 'cep' && (
        <div className="space-y-3">
          <div>
            <Label htmlFor="cep-input">CEP</Label>
            <div className="flex gap-2">
              <Input
                id="cep-input"
                value={cepInput}
                onChange={(e) => handleCepInputChange(e.target.value)}
                placeholder="00000-000"
                maxLength={9}
                className="font-mono"
              />
              <Button
                onClick={() => buscarCep(cepInput)}
                disabled={loading || cepInput.replace(/\D/g, '').length !== 8}
                size="icon"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="numero-input">Número</Label>
            <Input
              id="numero-input"
              value={numeroInput}
              onChange={(e) => handleNumeroChange(e.target.value)}
              placeholder="123"
            />
          </div>

          {addressData.logradouro && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Endereço encontrado:</p>
              <p className="font-medium">
                {addressData.logradouro}
                {addressData.numero && `, ${addressData.numero}`}
              </p>
              <p className="text-sm">
                {addressData.bairro}, {addressData.localidade} - {addressData.uf}
              </p>
            </div>
          )}
        </div>
      )}

      {mode === 'manual' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <Label htmlFor="logradouro">Rua</Label>
            <Input
              id="logradouro"
              value={addressData.logradouro}
              onChange={(e) => handleManualFieldChange('logradouro', e.target.value)}
              placeholder="Rua das Flores"
            />
          </div>

          <div>
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              value={addressData.numero}
              onChange={(e) => handleManualFieldChange('numero', e.target.value)}
              placeholder="123"
            />
          </div>

          <div>
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              value={addressData.bairro}
              onChange={(e) => handleManualFieldChange('bairro', e.target.value)}
              placeholder="Centro"
            />
          </div>

          <div>
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              value={addressData.localidade}
              onChange={(e) => handleManualFieldChange('localidade', e.target.value)}
              placeholder="São Paulo"
            />
          </div>

          <div>
            <Label htmlFor="estado">Estado</Label>
            <Input
              id="estado"
              value={addressData.uf}
              onChange={(e) => handleManualFieldChange('uf', e.target.value)}
              placeholder="SP"
              maxLength={2}
            />
          </div>

          <div>
            <Label htmlFor="cep-manual">CEP</Label>
            <Input
              id="cep-manual"
              value={addressData.cep}
              onChange={(e) => handleManualFieldChange('cep', formatCep(e.target.value))}
              placeholder="00000-000"
              maxLength={9}
              className="font-mono"
            />
          </div>
        </div>
      )}
    </Card>
  );
};
