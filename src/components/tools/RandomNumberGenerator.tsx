import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Hash, Copy, RefreshCw, ChevronRight, Dices, Filter, AlertTriangle, Coins, Trophy, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const RandomNumberGenerator = () => {
  // Estados básicos
  const [tipoSorteio, setTipoSorteio] = useState('personalizado');
  const [quantidade, setQuantidade] = useState('6');
  const [numeroMin, setNumeroMin] = useState('1');
  const [numeroMax, setNumeroMax] = useState('60');
  const [numerosUnicos, setNumerosUnicos] = useState(true);
  const [ordemLista, setOrdemLista] = useState('aleatoria');
  const [ordemNumerica, setOrdemNumerica] = useState('crescente');
  
  // Estados para dados RPG
  const [quantidadeDados, setQuantidadeDados] = useState('1');
  const [tipoDado, setTipoDado] = useState('6');
  const [somaTotal, setSomaTotal] = useState(0);
  
  // Estados para filtros avançados
  const [filtrosOpen, setFiltrosOpen] = useState(false);
  const [numerosExcluir, setNumerosExcluir] = useState('');
  const [filtroParImpar, setFiltroParImpar] = useState('todos');
  
  // Estados de resultado
  const [numeros, setNumeros] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const { toast } = useToast();

  // Validação inteligente
  const validateSettings = () => {
    setValidationError('');
    
    if (tipoSorteio === 'personalizado') {
      const qtd = parseInt(quantidade) || 0;
      const min = parseInt(numeroMin) || 0;
      const max = parseInt(numeroMax) || 0;
      const range = max - min + 1;
      
      if (qtd <= 0) {
        setValidationError('Quantidade deve ser maior que zero');
        return false;
      }
      
      if (min >= max) {
        setValidationError('Número mínimo deve ser menor que o máximo');
        return false;
      }
      
      if (numerosUnicos && qtd > range) {
        setValidationError(`Impossível gerar ${qtd} números únicos no intervalo ${min}-${max} (máximo: ${range})`);
        return false;
      }
    }
    
    if (tipoSorteio === 'dados') {
      const qtdDados = parseInt(quantidadeDados) || 0;
      if (qtdDados <= 0 || qtdDados > 100) {
        setValidationError('Quantidade de dados deve estar entre 1 e 100');
        return false;
      }
    }
    
    return true;
  };

  // Função para aplicar filtros
  const aplicarFiltros = (numerosList: number[]): number[] => {
    let filtered = [...numerosList];
    
    // Filtro de exclusão
    if (numerosExcluir.trim()) {
      const excluidos = numerosExcluir
        .split(',')
        .map(n => parseInt(n.trim()))
        .filter(n => !isNaN(n));
      
      filtered = filtered.filter(num => !excluidos.includes(num));
    }
    
    // Filtro par/ímpar
    if (filtroParImpar === 'par') {
      filtered = filtered.filter(num => num % 2 === 0);
    } else if (filtroParImpar === 'impar') {
      filtered = filtered.filter(num => num % 2 !== 0);
    }
    
    return filtered;
  };

  // Geração por tipo de sorteio
  const generateByType = () => {
    let numerosGerados: number[] = [];
    setSomaTotal(0);
    
    switch (tipoSorteio) {
      case 'personalizado':
        numerosGerados = generateCustomNumbers();
        break;
      case 'megasena':
        numerosGerados = generateMegaSena();
        break;
      case 'dados':
        numerosGerados = generateDiceRoll();
        break;
      case 'moeda':
        numerosGerados = generateCoinFlip();
        break;
    }
    
    return numerosGerados;
  };

  const generateCustomNumbers = (): number[] => {
    const qtd = parseInt(quantidade) || 1;
    const min = parseInt(numeroMin) || 1;
    const max = parseInt(numeroMax) || 100;
    let numerosGerados: number[] = [];

    if (numerosUnicos) {
      const disponveis = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      const filteredDisponveis = aplicarFiltros(disponveis);
      
      for (let i = 0; i < Math.min(qtd, filteredDisponveis.length); i++) {
        const randomIndex = Math.floor(Math.random() * filteredDisponveis.length);
        numerosGerados.push(filteredDisponveis[randomIndex]);
        filteredDisponveis.splice(randomIndex, 1);
      }
    } else {
      const allPossible = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      const filteredPossible = aplicarFiltros(allPossible);
      
      if (filteredPossible.length === 0) return [];
      
      for (let i = 0; i < qtd; i++) {
        const randomIndex = Math.floor(Math.random() * filteredPossible.length);
        numerosGerados.push(filteredPossible[randomIndex]);
      }
    }

    // Aplicar ordenação
    if (ordemLista === 'numerica') {
      numerosGerados.sort((a, b) => ordemNumerica === 'crescente' ? a - b : b - a);
    }

    return numerosGerados;
  };

  const generateMegaSena = (): number[] => {
    const disponveis = Array.from({ length: 60 }, (_, i) => i + 1);
    const numerosGerados: number[] = [];
    
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * disponveis.length);
      numerosGerados.push(disponveis[randomIndex]);
      disponveis.splice(randomIndex, 1);
    }
    
    return numerosGerados.sort((a, b) => a - b);
  };

  const generateDiceRoll = (): number[] => {
    const qtd = parseInt(quantidadeDados) || 1;
    const faces = parseInt(tipoDado) || 6;
    const resultados: number[] = [];
    let soma = 0;
    
    for (let i = 0; i < qtd; i++) {
      const resultado = Math.floor(Math.random() * faces) + 1;
      resultados.push(resultado);
      soma += resultado;
    }
    
    setSomaTotal(soma);
    return resultados;
  };

  const generateCoinFlip = (): number[] => {
    const qtd = parseInt(quantidade) || 1;
    const resultados: number[] = [];
    
    for (let i = 0; i < qtd; i++) {
      resultados.push(Math.random() < 0.5 ? 0 : 1); // 0 = Cara, 1 = Coroa
    }
    
    return resultados;
  };

  // Geração reativa
  useEffect(() => {
    if (validateSettings() && (tipoSorteio !== 'personalizado' || quantidade !== '0')) {
      setIsAnimating(true);
      
      // Pequeno delay para animação
      const timer = setTimeout(() => {
        const novosNumeros = generateByType();
        setNumeros(novosNumeros);
        setIsAnimating(false);
      }, 300);
      
      return () => clearTimeout(timer);
    } else {
      setNumeros([]);
    }
  }, [
    tipoSorteio, quantidade, numeroMin, numeroMax, numerosUnicos, 
    ordemLista, ordemNumerica, quantidadeDados, tipoDado,
    numerosExcluir, filtroParImpar
  ]);

  const copyNumbers = () => {
    if (tipoSorteio === 'moeda') {
      const resultado = numeros.map(n => n === 0 ? 'Cara' : 'Coroa').join(', ');
      navigator.clipboard.writeText(resultado);
    } else {
      navigator.clipboard.writeText(numeros.join(', '));
    }
    
    toast({
      title: "Copiado!",
      description: "Resultado copiado para a área de transferência",
    });
  };

  const renderNumbers = () => {
    if (numeros.length === 0) return null;

    if (tipoSorteio === 'moeda') {
      return (
        <div className="flex flex-wrap gap-3">
          {numeros.map((numero, index) => (
            <div
              key={index}
              className={`px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
                isAnimating ? 'animate-scale-in' : ''
              } ${
                numero === 0 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg'
                  : 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg'
              }`}
            >
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5" />
                {numero === 0 ? 'Cara' : 'Coroa'}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-3">
        {numeros.map((numero, index) => (
          <div
            key={index}
            className={`px-4 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
              isAnimating ? 'animate-scale-in opacity-0' : 'animate-fade-in'
            } ${
              tipoSorteio === 'megasena'
                ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white shadow-lg border-2 border-white/20'
                : tipoSorteio === 'dados'
                ? 'bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg'
                : 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg'
            }`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {numero}
          </div>
        ))}
        
        {tipoSorteio === 'dados' && somaTotal > 0 && (
          <div className="w-full mt-4 p-4 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
            <div className="flex items-center justify-center gap-2 text-lg font-bold">
              <Trophy className="w-6 h-6 text-purple-600" />
              <span>Soma Total: {somaTotal}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-primary/10">
            <Wand2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Suíte de Sorteios Interativa
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Geração reativa e inteligente para todos os tipos de sorteio. 
          Os resultados são atualizados automaticamente conforme você modifica as configurações.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Options Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Dices className="w-5 h-5" />
                Tipo de Sorteio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={tipoSorteio} onValueChange={setTipoSorteio}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personalizado">🎯 Intervalo Personalizado</SelectItem>
                  <SelectItem value="megasena">🍀 Mega-Sena (6 números únicos 1-60)</SelectItem>
                  <SelectItem value="dados">🎲 Lançador de Dados RPG</SelectItem>
                  <SelectItem value="moeda">🪙 Cara ou Coroa</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Dynamic Options based on lottery type */}
          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tipoSorteio === 'personalizado' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quantidade">Quantidade:</Label>
                      <Input
                        id="quantidade"
                        type="number"
                        min="1"
                        max="1000"
                        value={quantidade}
                        onChange={(e) => setQuantidade(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-6">
                      <Checkbox
                        id="unicos"
                        checked={numerosUnicos}
                        onCheckedChange={(checked) => setNumerosUnicos(checked === true)}
                      />
                      <Label htmlFor="unicos" className="text-sm">Únicos</Label>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="min">Mínimo:</Label>
                      <Input
                        id="min"
                        type="number"
                        value={numeroMin}
                        onChange={(e) => setNumeroMin(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="max">Máximo:</Label>
                      <Input
                        id="max"
                        type="number"
                        value={numeroMax}
                        onChange={(e) => setNumeroMax(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ordem">Ordenação:</Label>
                    <Select value={ordemLista} onValueChange={setOrdemLista}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aleatoria">Aleatória</SelectItem>
                        <SelectItem value="numerica">Numérica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {ordemLista === 'numerica' && (
                    <div>
                      <Label htmlFor="ordemNumerica">Ordem:</Label>
                      <Select value={ordemNumerica} onValueChange={setOrdemNumerica}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="crescente">Crescente</SelectItem>
                          <SelectItem value="decrescente">Decrescente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {tipoSorteio === 'dados' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="qtdDados">Quantidade de Dados:</Label>
                      <Input
                        id="qtdDados"
                        type="number"
                        min="1"
                        max="100"
                        value={quantidadeDados}
                        onChange={(e) => setQuantidadeDados(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="tipoDado">Tipo de Dado:</Label>
                      <Select value={tipoDado} onValueChange={setTipoDado}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="4">D4 (1-4)</SelectItem>
                          <SelectItem value="6">D6 (1-6)</SelectItem>
                          <SelectItem value="8">D8 (1-8)</SelectItem>
                          <SelectItem value="10">D10 (1-10)</SelectItem>
                          <SelectItem value="12">D12 (1-12)</SelectItem>
                          <SelectItem value="20">D20 (1-20)</SelectItem>
                          <SelectItem value="100">D100 (1-100)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {tipoSorteio === 'moeda' && (
                <div>
                  <Label htmlFor="qtdMoedas">Quantidade de Moedas:</Label>
                  <Input
                    id="qtdMoedas"
                    type="number"
                    min="1"
                    max="50"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                  />
                </div>
              )}

              {tipoSorteio === 'megasena' && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                    <Trophy className="w-5 h-5" />
                    <span className="font-medium">Configuração da Mega-Sena</span>
                  </div>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Gera automaticamente 6 números únicos de 1 a 60, ordenados crescente.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Advanced Filters */}
          {tipoSorteio === 'personalizado' && (
            <Collapsible open={filtrosOpen} onOpenChange={setFiltrosOpen}>
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filtros Avançados
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform ${filtrosOpen ? 'rotate-90' : ''}`} />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    <div>
                      <Label htmlFor="excluir">Excluir Números (separados por vírgula):</Label>
                      <Input
                        id="excluir"
                        value={numerosExcluir}
                        onChange={(e) => setNumerosExcluir(e.target.value)}
                        placeholder="ex: 13, 7, 25"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="parImpar">Filtrar por:</Label>
                      <Select value={filtroParImpar} onValueChange={setFiltroParImpar}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">Todos os números</SelectItem>
                          <SelectItem value="par">Apenas pares</SelectItem>
                          <SelectItem value="impar">Apenas ímpares</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )}

          {/* Validation Error */}
          {validationError && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Resultados
              </CardTitle>
              {numeros.length > 0 && (
                <Button variant="outline" size="sm" onClick={copyNumbers}>
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="min-h-32">
              {isAnimating ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : numeros.length > 0 ? (
                <div className="space-y-4">
                  {renderNumbers()}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <div className="p-4 rounded-full bg-muted/30 w-fit mx-auto mb-4">
                    <Dices className="w-12 h-12 opacity-50" />
                  </div>
                  <p className="text-lg">Configure as opções</p>
                  <p className="text-sm mt-2">Os resultados aparecerão automaticamente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Wand2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground mb-2 text-lg">
                Suíte Completa de Sorteios
              </h4>
              <p className="text-muted-foreground mb-3">
                Ferramenta reativa e inteligente para todos os tipos de sorteio. Resultados instantâneos, 
                validação automática e filtros avançados para máximo controle.
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">⚡ Geração Reativa</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">🎯 4 Modos de Sorteio</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">🔍 Filtros Avançados</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">✨ Animações</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};