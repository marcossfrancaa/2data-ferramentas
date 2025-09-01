import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Copy, RefreshCw, Key, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PasswordGenerator = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState(false);
  const [generatorMode, setGeneratorMode] = useState('password'); // 'password' ou 'passphrase'
  const [passphraseWords, setPassphraseWords] = useState([4]);
  const [copyButtonText, setCopyButtonText] = useState('Copiar');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Lista de palavras para passphrase
  const wordList = [
    'casa', 'sol', 'mar', 'lua', 'paz', 'amor', 'vida', 'tempo', 'agua', 'fogo',
    'terra', 'vento', 'flor', 'jardim', 'ponte', 'mundo', 'sonho', 'estrela', 'rio', 'campo',
    'cidade', 'rua', 'porta', 'janela', 'mesa', 'cadeira', 'livro', 'papel', 'caneta', 'tela',
    'musica', 'danca', 'festa', 'jogo', 'bola', 'pipa', 'gato', 'cao', 'ave', 'peixe',
    'arvore', 'folha', 'fruta', 'semente', 'raiz', 'galho', 'sombra', 'luz', 'cor', 'forma'
  ];

  // Função para calcular força da senha
  const calculatePasswordStrength = (pwd: string) => {
    let score = 0;
    let feedback = '';
    
    if (pwd.length >= 8) score += 1;
    if (pwd.length >= 12) score += 1;
    if (pwd.length >= 16) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 2) {
      feedback = 'Fraca';
      return { score: 25, feedback, color: 'bg-red-500' };
    } else if (score <= 4) {
      feedback = 'Média';
      return { score: 50, feedback, color: 'bg-orange-500' };
    } else if (score <= 6) {
      feedback = 'Forte';
      return { score: 75, feedback, color: 'bg-yellow-500' };
    } else {
      feedback = 'Muito Forte';
      return { score: 100, feedback, color: 'bg-green-500' };
    }
  };

  const generatePassphrase = () => {
    const shuffled = [...wordList].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, passphraseWords[0]);
    return selectedWords.join('-');
  };

  const generatePassword = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      if (generatorMode === 'passphrase') {
        const passphrase = generatePassphrase();
        setPassword(passphrase);
      } else {
        let charset = '';
        
        if (includeUppercase) {
          charset += avoidAmbiguous ? 'ABCDEFGHJKMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        if (includeLowercase) {
          charset += avoidAmbiguous ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz';
        }
        if (includeNumbers) {
          charset += avoidAmbiguous ? '23456789' : '0123456789';
        }
        if (includeSymbols) {
          charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        }

        if (!charset) {
          toast({
            title: "Erro",
            description: "Selecione pelo menos um tipo de caractere",
            variant: "destructive",
          });
          setIsGenerating(false);
          return;
        }

        let result = '';
        for (let i = 0; i < length[0]; i++) {
          result += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        setPassword(result);
      }
      setIsGenerating(false);
    }, 300);
  };

  const copyToClipboard = async () => {
    if (!password) return;
    
    try {
      await navigator.clipboard.writeText(password);
      setCopyButtonText('Copiado!');
      setTimeout(() => setCopyButtonText('Copiar'), 2000);
      toast({
        title: "Copiado!",
        description: "Senha copiada para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a senha",
        variant: "destructive",
      });
    }
  };

  const strength = password ? calculatePasswordStrength(password) : { score: 0, feedback: '', color: 'bg-gray-300' };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de Senhas Avançado</h1>
        </div>
        <p className="text-muted-foreground">
          Gera senhas seguras e frases-chave com configurações avançadas de segurança.
        </p>
      </div>

      <Card className="p-6 bg-gradient-card">
        <div className="space-y-6">
          {/* Modo de Geração */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-3">
              Modo de Geração
            </label>
            <RadioGroup value={generatorMode} onValueChange={setGeneratorMode} className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="password" id="password-mode" />
                <Label htmlFor="password-mode">Senha Tradicional</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="passphrase" id="passphrase-mode" />
                <Label htmlFor="passphrase-mode">Frase-chave</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Campo da Senha Gerada */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              {generatorMode === 'passphrase' ? 'Frase-chave Gerada' : 'Senha Gerada'}
            </label>
            <div className="flex gap-2">
              <Input
                value={password}
                readOnly
                placeholder={generatorMode === 'passphrase' ? 'Ex: sol-rio-casa-chave' : 'Clique em gerar para criar uma senha'}
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                onClick={copyToClipboard}
                disabled={!password}
                className="min-w-[80px]"
              >
                <Copy className="w-4 h-4 mr-1" />
                {copyButtonText}
              </Button>
            </div>
          </div>

          {/* Indicador de Força */}
          {password && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-card-foreground">
                  Força da Senha
                </label>
                <span className="text-sm font-medium">{strength.feedback}</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${strength.color}`}
                  style={{ width: `${strength.score}%` }}
                />
              </div>
            </div>
          )}

          {/* Configurações baseadas no modo */}
          {generatorMode === 'passphrase' ? (
            // Configurações de Frase-chave
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-4">
                Número de Palavras: {passphraseWords[0]}
              </label>
              <Slider
                value={passphraseWords}
                onValueChange={setPassphraseWords}
                max={6}
                min={3}
                step={1}
                className="w-full"
              />
            </div>
          ) : (
            // Configurações de Senha Tradicional
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-card-foreground mb-4">
                  Comprimento: {length[0]} caracteres
                </label>
                <Slider
                  value={length}
                  onValueChange={setLength}
                  max={50}
                  min={4}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Opções de Caracteres */}
              <div>
                <h3 className="text-sm font-semibold text-card-foreground mb-6 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Opções de Caracteres
                </h3>
                <div className="grid grid-cols-2 gap-6 p-6 bg-secondary/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="uppercase"
                      checked={includeUppercase}
                      onCheckedChange={(checked) => setIncludeUppercase(checked === true)}
                    />
                    <label htmlFor="uppercase" className="text-sm text-card-foreground font-medium">
                      Maiúsculas (A-Z)
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="lowercase"
                      checked={includeLowercase}
                      onCheckedChange={(checked) => setIncludeLowercase(checked === true)}
                    />
                    <label htmlFor="lowercase" className="text-sm text-card-foreground font-medium">
                      Minúsculas (a-z)
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="numbers"
                      checked={includeNumbers}
                      onCheckedChange={(checked) => setIncludeNumbers(checked === true)}
                    />
                    <label htmlFor="numbers" className="text-sm text-card-foreground font-medium">
                      Números (0-9)
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="symbols"
                      checked={includeSymbols}
                      onCheckedChange={(checked) => setIncludeSymbols(checked === true)}
                    />
                    <label htmlFor="symbols" className="text-sm text-card-foreground font-medium">
                      Símbolos (!@#$...)
                    </label>
                  </div>
                </div>
              </div>

              {/* Opção Anti-Ambiguidade */}
              <div className="flex items-start space-x-4 p-4 bg-accent/10 rounded-lg">
                <Checkbox
                  id="avoid-ambiguous"
                  checked={avoidAmbiguous}
                  onCheckedChange={(checked) => setAvoidAmbiguous(checked === true)}
                  className="mt-1"
                />
                <div>
                  <label htmlFor="avoid-ambiguous" className="text-sm font-medium text-card-foreground">
                    Evitar caracteres ambíguos
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Exclui: I, l, 1, O, 0 (para melhor legibilidade)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botão Gerar */}
          <Button
            onClick={generatePassword}
            disabled={isGenerating}
            className="w-full bg-gradient-primary hover:opacity-90 transition-fast"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                {generatorMode === 'passphrase' ? 'Gerar Frase-chave' : 'Gerar Senha'}
              </>
            )}
          </Button>
        </div>
      </Card>

      {/* Dicas de Segurança */}
      <Card className="mt-6 p-4 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-1">Dicas de Segurança</h4>
            <ul className="text-muted-foreground space-y-1">
              <li>• Use senhas diferentes para cada conta importante</li>
              <li>• Frases-chave são mais fáceis de lembrar e muito seguras</li>
              <li>• Senhas com 12+ caracteres e tipos variados são mais seguras</li>
              <li>• Evite informações pessoais em suas senhas</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};