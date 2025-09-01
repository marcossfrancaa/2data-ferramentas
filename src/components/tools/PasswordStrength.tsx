import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Shield, ShieldAlert, ShieldCheck, ShieldOff, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PasswordAnalysis {
  score: number;
  strength: 'Muito Fraca' | 'Fraca' | 'Média' | 'Forte' | 'Muito Forte';
  feedback: string[];
  positives: string[];
  timeToCrack: string;
}

export const PasswordStrength = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [analysis, setAnalysis] = useState<PasswordAnalysis | null>(null);

  const calculateTimeToCrack = (score: number, length: number): string => {
    if (score < 20) return 'Instantâneo';
    if (score < 40) return 'Alguns segundos';
    if (score < 60) return 'Alguns minutos a horas';
    if (score < 80) return 'Dias a meses';
    if (score < 90) return 'Anos';
    return 'Séculos';
  };

  const analyzePassword = (pwd: string): PasswordAnalysis => {
    let score = 0;
    const feedback: string[] = [];
    const positives: string[] = [];

    // Comprimento
    if (pwd.length >= 8) {
      score += 10;
      if (pwd.length >= 12) {
        score += 10;
        if (pwd.length >= 16) {
          score += 10;
          positives.push('Comprimento excelente (16+ caracteres)');
        } else {
          positives.push('Bom comprimento (12+ caracteres)');
        }
      } else {
        positives.push('Comprimento mínimo aceitável');
      }
    } else {
      feedback.push(`Senha muito curta (${pwd.length} caracteres). Use pelo menos 8 caracteres`);
    }

    // Letras maiúsculas
    if (/[A-Z]/.test(pwd)) {
      score += 10;
      positives.push('Contém letras maiúsculas');
    } else {
      feedback.push('Adicione letras maiúsculas');
    }

    // Letras minúsculas
    if (/[a-z]/.test(pwd)) {
      score += 10;
      positives.push('Contém letras minúsculas');
    } else {
      feedback.push('Adicione letras minúsculas');
    }

    // Números
    if (/[0-9]/.test(pwd)) {
      score += 10;
      positives.push('Contém números');
    } else {
      feedback.push('Adicione números');
    }

    // Caracteres especiais
    if (/[^A-Za-z0-9]/.test(pwd)) {
      score += 15;
      positives.push('Contém caracteres especiais');
    } else {
      feedback.push('Adicione caracteres especiais (!@#$%^&*)');
    }

    // Variedade de caracteres
    const uniqueChars = new Set(pwd.split('')).size;
    if (uniqueChars >= pwd.length * 0.6) {
      score += 10;
      positives.push('Boa variedade de caracteres');
    } else {
      feedback.push('Evite repetir muitos caracteres');
    }

    // Padrões comuns
    const commonPatterns = [
      '123', '321', 'abc', 'cba', 'qwerty', 'asdf', 
      '111', '000', 'aaa', 'senha', 'password', 'admin'
    ];
    const lowerPwd = pwd.toLowerCase();
    const hasCommonPattern = commonPatterns.some(pattern => lowerPwd.includes(pattern));
    
    if (hasCommonPattern) {
      score -= 20;
      feedback.push('Evite sequências ou palavras comuns');
    } else {
      score += 5;
      positives.push('Não contém padrões óbvios');
    }

    // Sequências de teclado
    if (/qwert|asdf|zxcv|qaz|wsx|edc/i.test(pwd)) {
      score -= 10;
      feedback.push('Evite sequências de teclado');
    }

    // Datas comuns
    if (/19[0-9]{2}|20[0-9]{2}/.test(pwd)) {
      score -= 5;
      feedback.push('Evite usar anos ou datas');
    }

    // Espaços ou caracteres unicode
    if (/\s/.test(pwd)) {
      score += 5;
      positives.push('Usa espaços');
    }

    // Limitar score
    score = Math.max(0, Math.min(100, score));

    // Determinar força
    let strength: PasswordAnalysis['strength'];
    if (score < 20) strength = 'Muito Fraca';
    else if (score < 40) strength = 'Fraca';
    else if (score < 60) strength = 'Média';
    else if (score < 80) strength = 'Forte';
    else strength = 'Muito Forte';

    return {
      score,
      strength,
      feedback: feedback.length > 0 ? feedback : ['Senha perfeita!'],
      positives,
      timeToCrack: calculateTimeToCrack(score, pwd.length)
    };
  };

  useEffect(() => {
    if (password) {
      setAnalysis(analyzePassword(password));
    } else {
      setAnalysis(null);
    }
  }, [password]);

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Muito Fraca': return 'text-red-500';
      case 'Fraca': return 'text-orange-500';
      case 'Média': return 'text-yellow-500';
      case 'Forte': return 'text-green-500';
      case 'Muito Forte': return 'text-emerald-500';
      default: return 'text-gray-500';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength) {
      case 'Muito Fraca': return <ShieldOff className="h-5 w-5" />;
      case 'Fraca': return <ShieldAlert className="h-5 w-5" />;
      case 'Média': return <Shield className="h-5 w-5" />;
      case 'Forte': return <ShieldCheck className="h-5 w-5" />;
      case 'Muito Forte': return <ShieldCheck className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getProgressColor = (score: number) => {
    if (score < 20) return 'bg-red-500';
    if (score < 40) return 'bg-orange-500';
    if (score < 60) return 'bg-yellow-500';
    if (score < 80) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Verificador de Força da Senha</CardTitle>
          <CardDescription>
            Analise a segurança da sua senha e receba sugestões de melhoria
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite a senha para analisar..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {analysis && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={getStrengthColor(analysis.strength)}>
                      {getStrengthIcon(analysis.strength)}
                    </span>
                    <span className={`font-semibold ${getStrengthColor(analysis.strength)}`}>
                      {analysis.strength}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Score: {analysis.score}/100
                  </span>
                </div>

                <div className="relative">
                  <Progress value={analysis.score} className="h-3" />
                  <div 
                    className={`absolute top-0 left-0 h-full ${getProgressColor(analysis.score)} rounded-full transition-all`}
                    style={{ width: `${analysis.score}%` }}
                  />
                </div>

                <Alert>
                  <AlertDescription>
                    <strong>Tempo estimado para quebrar:</strong> {analysis.timeToCrack}
                  </AlertDescription>
                </Alert>

                {analysis.positives.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-green-600">Pontos Positivos:</h3>
                    <ul className="space-y-1">
                      {analysis.positives.map((positive, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span className="text-sm">{positive}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {analysis.feedback.length > 0 && analysis.feedback[0] !== 'Senha perfeita!' && (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-orange-600">Sugestões de Melhoria:</h3>
                    <ul className="space-y-1">
                      {analysis.feedback.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-0.5">!</span>
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-secondary/50 rounded-lg space-y-2">
                <h3 className="font-semibold">Dicas para uma senha forte:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use pelo menos 12 caracteres</li>
                  <li>• Combine maiúsculas, minúsculas, números e símbolos</li>
                  <li>• Evite informações pessoais (nomes, datas de nascimento)</li>
                  <li>• Não use sequências óbvias (123456, qwerty)</li>
                  <li>• Considere usar uma frase-senha</li>
                  <li>• Use senhas únicas para cada conta</li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};