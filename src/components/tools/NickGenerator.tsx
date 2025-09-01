import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { UserX, Copy, RefreshCw, ChevronRight, Check, ExternalLink, Settings, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Themed word lists for different styles
const temas = {
  fantasia: {
    adjetivos: ['Sombrio', 'Místico', 'Mágico', 'Lendário', 'Épico', 'Divino', 'Eterno', 'Supremo', 'Noble', 'Radiante'],
    substantivos: ['Dragão', 'Fenix', 'Mago', 'Cavaleiro', 'Lorde', 'Rei', 'Príncipe', 'Guardião', 'Templário', 'Paladino']
  },
  'ficcao-cientifica': {
    adjetivos: ['Cyber', 'Quantum', 'Digital', 'Virtual', 'Plasma', 'Laser', 'Nano', 'Bio', 'Techno', 'Neural'],
    substantivos: ['Android', 'Cyborg', 'Nexus', 'Matrix', 'Vector', 'Protocol', 'System', 'Core', 'Node', 'Grid']
  },
  engracado: {
    adjetivos: ['Doido', 'Maluco', 'Crazy', 'Funny', 'Wild', 'Wacky', 'Silly', 'Goofy', 'Mad', 'Weird'],
    substantivos: ['Panda', 'Potato', 'Banana', 'Cookie', 'Pizza', 'Taco', 'Waffle', 'Pickle', 'Muffin', 'Donut']
  },
  militar: {
    adjetivos: ['Tactical', 'Stealth', 'Alpha', 'Bravo', 'Delta', 'Echo', 'Silent', 'Lethal', 'Elite', 'Spec'],
    substantivos: ['Ghost', 'Viper', 'Hawk', 'Wolf', 'Tiger', 'Falcon', 'Sniper', 'Soldier', 'Marine', 'Ranger']
  },
  aleatorio: {
    adjetivos: ['Sombrio', 'Veloz', 'Forte', 'Brilhante', 'Feroz', 'Mágico', 'Lendário', 'Épico', 'Supremo', 'Divino', 'Místico', 'Selvagem', 'Noble', 'Corajoso', 'Astuto', 'Poderoso', 'Eterno', 'Invisível', 'Flamejante', 'Gelado', 'Trovejante', 'Radiante', 'Sábio', 'Letal', 'Ninja', 'Samurai', 'Guerreiro', 'Mestre', 'Lord', 'King', 'Prince', 'Dark', 'Light'],
    substantivos: ['Lobo', 'Dragão', 'Águia', 'Tigre', 'Leão', 'Falcão', 'Cobra', 'Tubarão', 'Pantera', 'Fenix', 'Gringo', 'Hunter', 'Slayer', 'Warrior', 'Knight', 'Demon', 'Angel', 'Blade', 'Storm', 'Fire', 'Ice', 'Thunder', 'Shadow', 'Light', 'Soul', 'Spirit', 'Death', 'Killer', 'Master', 'Legend', 'Hero', 'Villain', 'Phantom', 'Ghost']
  }
};

const tiposNumeros = {
  ano: () => new Date().getFullYear().toString(),
  sorte: () => ['7', '13', '21', '77', '88', '99', '101', '777', '888', '999'][Math.floor(Math.random() * 10)],
  aleatorio: () => Math.floor(Math.random() * 1000).toString().padStart(3, '0')
};

export const NickGenerator = () => {
  const [metodo, setMetodo] = useState('');
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [nicks, setNicks] = useState<string[]>([]);
  const [copiedNicks, setCopiedNicks] = useState<Set<string>>(new Set());
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  
  // Advanced options
  const [tema, setTema] = useState('aleatorio');
  const [incluirAdjetivo, setIncluirAdjetivo] = useState(true);
  const [incluirSubstantivo, setIncluirSubstantivo] = useState(true);
  const [incluirNumeros, setIncluirNumeros] = useState(false);
  const [tipoNumero, setTipoNumero] = useState('aleatorio');
  const [incluirSeparadores, setIncluirSeparadores] = useState(false);
  const [tipoSeparador, setTipoSeparador] = useState('underscore');
  const [usarLeetSpeak, setUsarLeetSpeak] = useState(false);
  const [usarEstiloXx, setUsarEstiloXx] = useState(false);
  
  const { toast } = useToast();

  const aplicarLeetSpeak = (texto: string): string => {
    if (!usarLeetSpeak) return texto;
    return texto
      .replace(/a/gi, '4')
      .replace(/e/gi, '3')
      .replace(/i/gi, '1')
      .replace(/o/gi, '0')
      .replace(/s/gi, '5')
      .replace(/t/gi, '7');
  };

  const aplicarSeparador = (partes: string[], tipo: string): string => {
    switch (tipo) {
      case 'underscore':
        return partes.join('_');
      case 'hifen':
        return partes.join('-');
      case 'camelcase':
        return partes.map((parte, index) => 
          index === 0 ? parte.toLowerCase() : parte.charAt(0).toUpperCase() + parte.slice(1).toLowerCase()
        ).join('');
      default:
        return partes.join('');
    }
  };

  const generateFromName = (inputName: string, inputSobrenome: string = '') => {
    const nicks = [];
    const nomeBase = inputName.toLowerCase();
    const sobrenomeBase = inputSobrenome.toLowerCase();
    
    // Variações básicas do nome
    nicks.push(inputName);
    if (inputSobrenome) {
      nicks.push(`${inputName}${inputSobrenome}`);
      nicks.push(`${inputName}_${inputSobrenome}`);
      nicks.push(`${inputName}.${inputSobrenome}`);
    }
    
    // Com números
    nicks.push(`${nomeBase}123`);
    nicks.push(`${nomeBase}2024`);
    nicks.push(`${nomeBase}007`);
    
    // Com prefixos e sufixos
    nicks.push(`${nomeBase}_oficial`);
    nicks.push(`${nomeBase}BR`);
    nicks.push(`The${inputName}`);
    
    // Variações criativas
    if (nomeBase.length > 3) {
      nicks.push(nomeBase.slice(0, 3) + Math.floor(Math.random() * 1000));
      nicks.push(nomeBase.slice(0, 4) + '_' + Math.floor(Math.random() * 100));
    }
    
    return nicks.slice(0, 10).map(nick => {
      let processedNick = aplicarLeetSpeak(nick);
      if (usarEstiloXx) {
        processedNick = `xX_${processedNick}_Xx`;
      }
      return processedNick;
    });
  };

  const generateAdvancedNicks = () => {
    const nicks = [];
    const temaData = temas[tema as keyof typeof temas];
    
    for (let i = 0; i < 12; i++) {
      const partes = [];
      
      if (incluirAdjetivo) {
        const adjetivo = temaData.adjetivos[Math.floor(Math.random() * temaData.adjetivos.length)];
        partes.push(adjetivo);
      }
      
      if (incluirSubstantivo) {
        const substantivo = temaData.substantivos[Math.floor(Math.random() * temaData.substantivos.length)];
        partes.push(substantivo);
      }
      
      let nick = incluirSeparadores ? aplicarSeparador(partes, tipoSeparador) : partes.join('');
      
      if (incluirNumeros) {
        const numero = tiposNumeros[tipoNumero as keyof typeof tiposNumeros]();
        nick += numero;
      }
      
      nick = aplicarLeetSpeak(nick);
      
      if (usarEstiloXx) {
        nick = `xX_${nick}_Xx`;
      }
      
      if (nick && !nicks.includes(nick)) {
        nicks.push(nick);
      }
    }
    
    return nicks.slice(0, 10);
  };

  const generateSimpleNicks = () => {
    const nicks = [];
    const temaData = temas.aleatorio;
    
    for (let i = 0; i < 10; i++) {
      const adjetivo = temaData.adjetivos[Math.floor(Math.random() * temaData.adjetivos.length)];
      const substantivo = temaData.substantivos[Math.floor(Math.random() * temaData.substantivos.length)];
      const sufixo = ['2024', '2025', 'X', 'XL', 'Pro', 'Max', '007', '777', 'BR'][Math.floor(Math.random() * 9)];
      
      const tipo = Math.floor(Math.random() * 4);
      
      switch (tipo) {
        case 0:
          nicks.push(`${adjetivo}${substantivo}`);
          break;
        case 1:
          nicks.push(`${adjetivo}_${substantivo}`);
          break;
        case 2:
          nicks.push(`${substantivo}${sufixo}`);
          break;
        case 3:
          nicks.push(`${adjetivo}${substantivo}${Math.floor(Math.random() * 100)}`);
          break;
      }
    }
    
    return nicks;
  };

  const generateNicks = () => {
    // Always clear previous results first
    setNicks([]);
    setCopiedNicks(new Set());
    
    // Small delay to show clearing, then generate fresh nicks
    setTimeout(() => {
      let novosNicks: string[] = [];
      
      if (metodo === 'nome' && nome.trim()) {
        novosNicks = generateFromName(nome.trim(), sobrenome.trim());
      } else if (metodo === 'aleatorio') {
        if (isPersonalizationOpen && (incluirAdjetivo || incluirSubstantivo)) {
          // Advanced generation with current settings
          novosNicks = generateAdvancedNicks();
        } else {
          // Simple generation
          novosNicks = generateSimpleNicks();
        }
      }
      
      // Ensure we always have unique, fresh results
      const uniqueNicks = [...new Set(novosNicks)].slice(0, 12);
      setNicks(uniqueNicks);
    }, 100);
  };

  const clearAll = () => {
    setNicks([]);
    setCopiedNicks(new Set());
    setNome('');
    setSobrenome('');
    setMetodo('');
    
    // Reset advanced options to defaults
    setTema('aleatorio');
    setIncluirAdjetivo(true);
    setIncluirSubstantivo(true);
    setIncluirNumeros(false);
    setTipoNumero('aleatorio');
    setIncluirSeparadores(false);
    setTipoSeparador('underscore');
    setUsarLeetSpeak(false);
    setUsarEstiloXx(false);
    setIsPersonalizationOpen(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNicks(prev => new Set([...prev, text]));
    
    setTimeout(() => {
      setCopiedNicks(prev => {
        const newSet = new Set(prev);
        newSet.delete(text);
        return newSet;
      });
    }, 2000);

    toast({
      title: "Copiado!",
      description: "Nick copiado para a área de transferência",
    });
  };

  const copyAllNicks = () => {
    const allNicks = nicks.join('\n');
    navigator.clipboard.writeText(allNicks);
    toast({
      title: "Copiado!",
      description: "Todos os nicks copiados para a área de transferência",
    });
  };

  const checkAvailability = (nick: string, platform: string) => {
    const urls = {
      twitch: `https://www.twitch.tv/${nick}`,
      twitter: `https://twitter.com/${nick}`,
      instagram: `https://www.instagram.com/${nick}`,
      youtube: `https://www.youtube.com/@${nick}`,
      github: `https://github.com/${nick}`
    };
    
    window.open(urls[platform as keyof typeof urls], '_blank');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      {/* Header with better spacing */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-primary/10">
            <UserX className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Gerador de Nicks
          </h1>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Crie nicknames únicos e personalizados para jogos, redes sociais e fóruns. 
          Use nossa ferramenta simples ou explore as opções avançadas para controle total.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Options Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Configurações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="metodo">Método de Geração:</Label>
                <Select value={metodo} onValueChange={setMetodo}>
                  <SelectTrigger>
                    <SelectValue placeholder="Escolha como gerar os nicks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nome">A partir do seu nome</SelectItem>
                    <SelectItem value="aleatorio">Aleatório</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {metodo === 'nome' && (
                <div className="space-y-4 pt-2">
                  <div>
                    <Label htmlFor="nome">Nome:</Label>
                    <Input
                      id="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Digite seu nome"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sobrenome">Sobrenome (opcional):</Label>
                    <Input
                      id="sobrenome"
                      value={sobrenome}
                      onChange={(e) => setSobrenome(e.target.value)}
                      placeholder="Digite seu sobrenome"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Advanced Personalization */}
          {metodo === 'aleatorio' && (
            <Collapsible 
              open={isPersonalizationOpen} 
              onOpenChange={setIsPersonalizationOpen}
            >
              <Card>
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wand2 className="w-5 h-5" />
                        Personalizar Geração
                      </div>
                      <ChevronRight className={`w-5 h-5 transition-transform ${isPersonalizationOpen ? 'rotate-90' : ''}`} />
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="space-y-6 pt-0">
                    {/* Theme Selection */}
                    <div>
                      <Label>Estilo do Nick:</Label>
                      <Select value={tema} onValueChange={setTema}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fantasia">🧙‍♂️ Fantasia</SelectItem>
                          <SelectItem value="ficcao-cientifica">🚀 Ficção Científica</SelectItem>
                          <SelectItem value="engracado">😄 Engraçado</SelectItem>
                          <SelectItem value="militar">⚔️ Militar</SelectItem>
                          <SelectItem value="aleatorio">🎲 Aleatório</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Nick Formula */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Fórmula do Nick:</Label>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="adjetivo" 
                            checked={incluirAdjetivo}
                            onCheckedChange={(checked) => setIncluirAdjetivo(checked === true)}
                          />
                          <Label htmlFor="adjetivo">Incluir Adjetivo (ex: Sombrio, Veloz)</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="substantivo" 
                            checked={incluirSubstantivo}
                            onCheckedChange={(checked) => setIncluirSubstantivo(checked === true)}
                          />
                          <Label htmlFor="substantivo">Incluir Substantivo (ex: Lobo, Dragão)</Label>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="numeros" 
                              checked={incluirNumeros}
                              onCheckedChange={(checked) => setIncluirNumeros(checked === true)}
                            />
                            <Label htmlFor="numeros">Incluir Números</Label>
                          </div>
                          
                          {incluirNumeros && (
                            <div className="ml-6">
                              <Select value={tipoNumero} onValueChange={setTipoNumero}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ano">Ano Atual</SelectItem>
                                  <SelectItem value="sorte">Números da Sorte</SelectItem>
                                  <SelectItem value="aleatorio">Aleatório</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox 
                              id="separadores" 
                              checked={incluirSeparadores}
                              onCheckedChange={(checked) => setIncluirSeparadores(checked === true)}
                            />
                            <Label htmlFor="separadores">Usar Separadores</Label>
                          </div>
                          
                          {incluirSeparadores && (
                            <div className="ml-6">
                              <Select value={tipoSeparador} onValueChange={setTipoSeparador}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="underscore">Underscore (_)</SelectItem>
                                  <SelectItem value="hifen">Hífen (-)</SelectItem>
                                  <SelectItem value="camelcase">CamelCase</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Style Options */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Opções de Estilo:</Label>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="leet" 
                            checked={usarLeetSpeak}
                            onCheckedChange={(checked) => setUsarLeetSpeak(checked === true)}
                          />
                          <Label htmlFor="leet">Usar Leet Speak (a→4, e→3, i→1)</Label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="xx" 
                            checked={usarEstiloXx}
                            onCheckedChange={(checked) => setUsarEstiloXx(checked === true)}
                          />
                          <Label htmlFor="xx">Estilo xX_Nick_Xx</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          )}

          <Button
            onClick={generateNicks}
            disabled={metodo === 'nome' ? !nome.trim() : !metodo}
            className="w-full h-12 text-base"
            size="lg"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Gerar Nicks
          </Button>
        </div>

        {/* Results Panel */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserX className="w-5 h-5" />
                Nicks Gerados
              </CardTitle>
              {nicks.length > 0 && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyAllNicks}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar Todos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Limpar Tudo
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {nicks.length > 0 ? (
                nicks.map((nick, index) => (
                  <div key={index} className="group p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-card-foreground text-lg">{nick}</span>
                      <div className="flex items-center gap-2">
                        {/* Availability Check Buttons */}
                        <div className="hidden group-hover:flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => checkAvailability(nick, 'twitch')}
                            className="h-8 w-8 p-0"
                            title="Verificar no Twitch"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        {/* Copy Button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(nick)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedNicks.has(nick) ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <div className="p-4 rounded-full bg-muted/30 w-fit mx-auto mb-4">
                    <UserX className="w-12 h-12 opacity-50" />
                  </div>
                  <p className="text-lg">Nicks aparecerão aqui</p>
                  <p className="text-sm mt-2">Configure as opções e clique em "Gerar Nicks"</p>
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
              <UserX className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-semibold text-card-foreground mb-2 text-lg">
                Criador de Identidade Online Completo
              </h4>
              <p className="text-muted-foreground mb-3">
                Nossa ferramenta vai além de simples geradores. Crie nicknames únicos com controle total sobre estilo, 
                formatação e tema. Use a personalização avançada para criar a identidade perfeita para suas plataformas digitais.
              </p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">✨ 5 Temas Diferentes</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">🎯 Leet Speak</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">🔗 Verificação de Disponibilidade</span>
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full">⚡ Geração Inteligente</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};