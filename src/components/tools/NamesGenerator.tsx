import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Copy, RefreshCw, Star, StarOff, Trash2, Crown, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Base de dados expandida de nomes por categoria
const nomesData = {
  brasileiros: {
    masculino: [
      'João', 'José', 'Antônio', 'Francisco', 'Carlos', 'Paulo', 'Pedro', 'Lucas', 'Luiz', 'Marcos',
      'Luis', 'Gabriel', 'Rafael', 'Daniel', 'Marcelo', 'Bruno', 'Eduardo', 'Felipe', 'Raimundo', 'Rodrigo',
      'Fernando', 'Gustavo', 'Diego', 'Leonardo', 'André', 'Mateus', 'Ricardo', 'Fábio', 'Alexandre', 'Juliano'
    ],
    feminino: [
      'Maria', 'Ana', 'Francisca', 'Antônia', 'Adriana', 'Juliana', 'Márcia', 'Fernanda', 'Patricia', 'Aline',
      'Sandra', 'Camila', 'Amanda', 'Bruna', 'Jessica', 'Leticia', 'Julia', 'Luciana', 'Vanessa', 'Mariana',
      'Carla', 'Débora', 'Tatiana', 'Renata', 'Sabrina', 'Cristina', 'Michele', 'Simone', 'Priscila', 'Viviane'
    ]
  },
  japoneses: {
    masculino: [
      'Hiroshi', 'Takeshi', 'Kenji', 'Akira', 'Yuki', 'Ryuu', 'Haruto', 'Sota', 'Daiki', 'Kenta',
      'Shota', 'Ren', 'Hayato', 'Riku', 'Kaito', 'Yuuma', 'Yamato', 'Shou', 'Taiga', 'Hinata'
    ],
    feminino: [
      'Yuki', 'Akiko', 'Keiko', 'Naomi', 'Sakura', 'Yui', 'Hana', 'Rin', 'Ai', 'Emi',
      'Mika', 'Rei', 'Saki', 'Nana', 'Yuka', 'Mio', 'Kana', 'Mai', 'Riko', 'Yuna'
    ]
  },
  vikings: {
    masculino: [
      'Ragnar', 'Bjorn', 'Erik', 'Olaf', 'Magnus', 'Leif', 'Gunnar', 'Thorbjorn', 'Asger', 'Halvard',
      'Ivar', 'Knut', 'Ulf', 'Sigurd', 'Harald', 'Torstein', 'Dag', 'Einar', 'Finn', 'Gorm'
    ],
    feminino: [
      'Astrid', 'Ingrid', 'Freydis', 'Solveig', 'Ragnhild', 'Helga', 'Sigrid', 'Thora', 'Gudrun', 'Brynja',
      'Signe', 'Liv', 'Vigdis', 'Ase', 'Gunnhild', 'Hilda', 'Kari', 'Saga', 'Turid', 'Valdis'
    ]
  },
  elfos: {
    masculino: [
      'Legolas', 'Thranduil', 'Elrond', 'Celeborn', 'Glorfindel', 'Lindir', 'Erestor', 'Elladan', 'Elrohir', 'Gil-galad',
      'Aegnor', 'Amrod', 'Angrod', 'Caranthir', 'Celegorm', 'Curufin', 'Elros', 'Fingon', 'Finrod', 'Maedhros'
    ],
    feminino: [
      'Galadriel', 'Arwen', 'Tauriel', 'Elaria', 'Nimrodel', 'Celebrían', 'Idril', 'Lúthien', 'Nerdanel', 'Varda',
      'Aredhel', 'Elenwë', 'Finduilas', 'Indis', 'Melian', 'Morwen', 'Nienor', 'Nimloth', 'Rían', 'Yavanna'
    ]
  },
  anoes: {
    masculino: [
      'Thorin', 'Gimli', 'Balin', 'Dwalin', 'Oin', 'Gloin', 'Fili', 'Kili', 'Bifur', 'Bofur',
      'Bombur', 'Ori', 'Nori', 'Dori', 'Dain', 'Thrain', 'Thror', 'Borin', 'Fundin', 'Groin'
    ],
    feminino: [
      'Dis', 'Daina', 'Nala', 'Vera', 'Mira', 'Tova', 'Hilda', 'Bera', 'Nila', 'Kata',
      'Runa', 'Saga', 'Thera', 'Valdis', 'Willa', 'Yara', 'Zara', 'Alma', 'Bria', 'Cora'
    ]
  },
  orcs: {
    masculino: [
      'Azog', 'Bolg', 'Grishnákh', 'Uglúk', 'Lurtz', 'Gothmog', 'Shagrat', 'Gorbag', 'Snaga', 'Mauhúr',
      'Gashnak', 'Muzgash', 'Orthank', 'Radbug', 'Snark', 'Ufthak', 'Yagul', 'Zagdush', 'Burzum', 'Groshk'
    ],
    feminino: [
      'Grima', 'Sharku', 'Grishna', 'Uruk', 'Moria', 'Gundabad', 'Bagronk', 'Durzol', 'Gorshak', 'Krampus',
      'Narzug', 'Olog', 'Pushkrimp', 'Radbug', 'Sharamph', 'Uglúk', 'Vashak', 'Warg', 'Yazneg', 'Zog'
    ]
  },
  humanos_fantasia: {
    masculino: [
      'Aragorn', 'Boromir', 'Faramir', 'Denethor', 'Théoden', 'Éomer', 'Bard', 'Isildur', 'Elendil', 'Anarion',
      'Aldric', 'Baldwin', 'Cedric', 'Duncan', 'Edmund', 'Gareth', 'Harold', 'Ivan', 'Jasper', 'Kenneth'
    ],
    feminino: [
      'Éowyn', 'Rosie', 'Lobelia', 'Belladonna', 'Primula', 'Mirabella', 'Pearl', 'Pimpernel', 'Poppy', 'Pansy',
      'Adelaide', 'Beatrice', 'Cordelia', 'Delphine', 'Evangeline', 'Felicity', 'Guinevere', 'Helena', 'Isabella', 'Josephine'
    ]
  },
  alienigenas: {
    masculino: [
      'Zyx-9', 'Qorth', 'Vex-Alpha', 'Nyx-7', 'Kor-X', 'Zara-Prime', 'Vos-3', 'Xen-9', 'Flux-7', 'Vor-X',
      'Axel-Z', 'Byte-5', 'Core-X', 'Dex-9', 'Echo-7', 'Flux-3', 'Grid-X', 'Hex-9', 'Ion-7', 'Jinx-X'
    ],
    feminino: [
      'Zyx-Luna', 'Qora', 'Vex-Beta', 'Nyx-Prime', 'Kor-Luna', 'Zara-9', 'Vos-Alpha', 'Xen-Luna', 'Flux-Beta', 'Vor-Prime',
      'Aura-X', 'Byra-9', 'Cora-Prime', 'Dex-Luna', 'Echo-Alpha', 'Flux-Beta', 'Grix-9', 'Hex-Luna', 'Ion-Alpha', 'Jinx-Prime'
    ]
  },
  androides: {
    masculino: [
      'Unit-Alpha', 'Model-X7', 'Droid-Prime', 'Cyber-9', 'Bot-Alpha', 'Mech-X', 'Auto-7', 'Sync-9', 'Data-X', 'Logic-7',
      'Neo-9', 'Proto-X', 'Tech-7', 'Void-9', 'Wire-X', 'Zero-7', 'Apex-9', 'Core-X', 'Drift-7', 'Edge-9'
    ],
    feminino: [
      'Unit-Beta', 'Model-Y7', 'Droid-Luna', 'Cyber-Prime', 'Bot-Beta', 'Mech-Y', 'Auto-Luna', 'Sync-Prime', 'Data-Y', 'Logic-Luna',
      'Neo-Prime', 'Proto-Y', 'Tech-Luna', 'Void-Prime', 'Wire-Y', 'Zero-Luna', 'Apex-Prime', 'Core-Y', 'Drift-Luna', 'Edge-Prime'
    ]
  }
};

// Sobrenomes e títulos expandidos para múltiplas combinações
const sobrenomesData = {
  brasileiro: [
    'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes',
    'Ribeiro', 'Carvalho', 'Castro', 'Almeida', 'Lopes', 'Soares', 'Vieira', 'Monteiro', 'Mendes', 'Barbosa',
    'Costa', 'Martins', 'Rocha', 'Dias', 'Moreira', 'Machado', 'Ramos', 'Nunes', 'Cardoso', 'Araujo',
    'Azevedo', 'Campos', 'Correia', 'Cunha', 'Freitas', 'Gonçalves', 'Melo', 'Moura', 'Nascimento', 'Pinto'
  ],
  japones: [
    'Tanaka', 'Watanabe', 'Takahashi', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Kato', 'Yoshida', 'Yamada', 'Sasaki',
    'Sato', 'Suzuki', 'Inoue', 'Kimura', 'Hayashi', 'Shimizu', 'Yamazaki', 'Mori', 'Abe', 'Ikeda',
    'Matsumoto', 'Ito', 'Fujiwara', 'Okamoto', 'Goto', 'Hasegawa', 'Murakami', 'Kondo', 'Ishikawa', 'Saito'
  ],
  viking: [
    'Ironside', 'Bloodaxe', 'Stormborn', 'Dragonslayer', 'Shieldbreaker', 'Battlehammer', 'Frostbeard', 'Ravenclaw',
    'Thunderstrike', 'Wolfskin', 'Fireborn', 'Iceheart', 'Stonefist', 'Windwalker', 'Shadowbane', 'Grimjaw',
    'Ironfist', 'Goldbeard', 'Stormcaller', 'Beastslayer', 'Warborn', 'Flameheart', 'Icewalker', 'Thunderborn',
    'Darkbane', 'Lightbringer', 'Swordbreaker', 'Shieldmaster', 'Runekeeper', 'Oathbound', 'Deathbringer', 'Lifeward'
  ],
  fantasia: [
    'Folhadourada', 'Espadaluna', 'Coraçãovalente', 'Ventoforte', 'Martelodouro', 'Arcosilvestre', 'Escudonobre', 'Laminareal',
    'Machadorúnica', 'Cajadosábio', 'Capelúzula', 'Forjaferro', 'Luzverde', 'Tempestade', 'Fúrianegra', 'Cristalsombra',
    'Chamachama', 'Geloneve', 'Trovãoazul', 'Pedraverde', 'Sussurro da Floresta', 'Estrela da Manhã', 'Vento do Norte',
    'Lâmina Élfica', 'Coração de Pedra', 'Fogo Eterno', 'Água Cristalina', 'Terra Antiga', 'Ar Puro', 'Alma Selvagem',
    'Sangue Nobre', 'Espírito Livre', 'Mente Brilhante', 'Força Interior', 'Sabedoria Ancestral', 'Coragem Infinita'
  ],
  scifi: [
    'Alpha-7', 'Beta-Prime', 'Gamma-X', 'Delta-9', 'Omega-Core', 'Sigma-Tech', 'Theta-Net', 'Lambda-Sync',
    'Epsilon-Grid', 'Zeta-Link', 'Proto-Unit', 'Neo-System', 'Cyber-Node', 'Data-Stream', 'Code-Matrix', 'Bit-Forge',
    'Quantum-Link', 'Neural-Net', 'Bio-Core', 'Nano-Tech', 'Holo-Grid', 'Plasma-Cell', 'Photon-Drive', 'Ion-Pulse',
    'Fusion-Core', 'Hyper-Drive', 'Warp-Field', 'Time-Lock', 'Space-Fold', 'Mind-Link', 'Soul-Code', 'Life-Stream'
  ]
};

type ModoGeracao = 'lista' | 'completo';

export const NamesGenerator = () => {
  const [modo, setModo] = useState<ModoGeracao>('lista');
  const [genero, setGenero] = useState('');
  const [quantidade, setQuantidade] = useState('5');
  const [categoria, setCategoria] = useState('brasileiros');
  const [numeroSobrenomes, setNumeroSobrenomes] = useState('1');
  const [nomes, setNomes] = useState<string[]>([]);
  const [nomeCompleto, setNomeCompleto] = useState<{completo: string, partes: string[]} | null>(null);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const { toast } = useToast();

  // Carregar favoritos do localStorage ao inicializar
  useEffect(() => {
    const favoritosSalvos = localStorage.getItem('nomes-favoritos');
    if (favoritosSalvos) {
      setFavoritos(JSON.parse(favoritosSalvos));
    }
  }, []);

  // Salvar favoritos no localStorage
  const salvarFavoritos = (novosFavoritos: string[]) => {
    localStorage.setItem('nomes-favoritos', JSON.stringify(novosFavoritos));
    setFavoritos(novosFavoritos);
  };

  const toggleFavorito = (nome: string) => {
    const novosFavoritos = favoritos.includes(nome)
      ? favoritos.filter(f => f !== nome)
      : [...favoritos, nome];
    
    salvarFavoritos(novosFavoritos);
    
    toast({
      title: favoritos.includes(nome) ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: nome,
    });
  };

  const limparFavoritos = () => {
    salvarFavoritos([]);
    toast({
      title: "Favoritos limpos",
      description: "Todos os favoritos foram removidos",
    });
  };

  const getSobrenomesArray = (cat: string) => {
    if (cat === 'brasileiros') return sobrenomesData.brasileiro;
    if (cat === 'japoneses') return sobrenomesData.japones;
    if (cat === 'vikings') return sobrenomesData.viking;
    if (cat === 'alienigenas' || cat === 'androides') return sobrenomesData.scifi;
    return sobrenomesData.fantasia;
  };

  const generateListaNomes = () => {
    const qtd = parseInt(quantidade) || 1;
    const categoriaKey = categoria as keyof typeof nomesData;
    const nomesArray = genero === 'masculino' ? nomesData[categoriaKey].masculino : 
                      genero === 'feminino' ? nomesData[categoriaKey].feminino :
                      [...nomesData[categoriaKey].masculino, ...nomesData[categoriaKey].feminino];
    
    const novosNomes = [];
    for (let i = 0; i < Math.min(qtd, 50); i++) {
      const nome = nomesArray[Math.floor(Math.random() * nomesArray.length)];
      novosNomes.push(nome);
    }
    
    setNomes(novosNomes);
    setNomeCompleto(null);
  };

  const generateNomeCompleto = () => {
    const categoriaKey = categoria as keyof typeof nomesData;
    const nomesArray = genero === 'masculino' ? nomesData[categoriaKey].masculino : 
                      genero === 'feminino' ? nomesData[categoriaKey].feminino :
                      [...nomesData[categoriaKey].masculino, ...nomesData[categoriaKey].feminino];
    
    const sobrenomesArray = getSobrenomesArray(categoria);
    const numSobrenomes = parseInt(numeroSobrenomes);
    
    const primeiroNome = nomesArray[Math.floor(Math.random() * nomesArray.length)];
    const sobrenomesSelecionados: string[] = [];
    
    // Gerar sobrenomes únicos
    const sobrenomesDisponiveis = [...sobrenomesArray];
    for (let i = 0; i < numSobrenomes && sobrenomesDisponiveis.length > 0; i++) {
      const index = Math.floor(Math.random() * sobrenomesDisponiveis.length);
      sobrenomesSelecionados.push(sobrenomesDisponiveis[index]);
      sobrenomesDisponiveis.splice(index, 1);
    }
    
    const partes = [primeiroNome, ...sobrenomesSelecionados];
    const completo = partes.join(' ');
    
    setNomeCompleto({ completo, partes });
    setNomes([]);
  };

  const executeGerar = () => {
    if (modo === 'lista') {
      generateListaNomes();
    } else {
      generateNomeCompleto();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: "Texto copiado para a área de transferência",
    });
  };

  const copyAllNames = () => {
    const allNames = nomes.join('\n');
    navigator.clipboard.writeText(allNames);
    toast({
      title: "Copiado!",
      description: "Todos os nomes copiados para a área de transferência",
    });
  };

  const copyAllFavoritos = () => {
    const allFavoritos = favoritos.join('\n');
    navigator.clipboard.writeText(allFavoritos);
    toast({
      title: "Copiado!",
      description: "Todos os favoritos copiados para a área de transferência",
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cabeçalho com melhor espaçamento */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Gerador de Nomes Bimodal</h1>
        </div>
        <p className="text-muted-foreground text-lg leading-relaxed">
          Escolha entre gerar uma <strong>lista de nomes</strong> para ter várias opções ou criar um <strong>nome completo</strong> 
          com múltiplos sobrenomes para personagens únicos e detalhados.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card de Configurações */}
        <Card className="p-6 h-fit">
          <h3 className="text-lg font-semibold text-card-foreground mb-6">
            Configurações
          </h3>
          
          {/* Seletor de Modo */}
          <div className="mb-8">
            <Label className="text-sm font-medium mb-4 block">Modo de Geração:</Label>
            <Tabs value={modo} onValueChange={(value) => setModo(value as ModoGeracao)} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="lista" className="flex items-center gap-2">
                  <List className="w-4 h-4" />
                  Lista
                </TabsTrigger>
                <TabsTrigger value="completo" className="flex items-center gap-2">
                  <Crown className="w-4 h-4" />
                  Completo
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            {/* Categoria - sempre visível */}
            <div>
              <Label htmlFor="categoria" className="text-sm font-medium mb-3 block">
                Categoria:
              </Label>
              <Select value={categoria} onValueChange={setCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brasileiros">🇧🇷 Brasileiro</SelectItem>
                  <SelectItem value="japoneses">🇯🇵 Japonês</SelectItem>
                  <SelectItem value="vikings">⚔️ Viking</SelectItem>
                  <SelectItem value="elfos">🧝 Elfo</SelectItem>
                  <SelectItem value="anoes">🪓 Anão</SelectItem>
                  <SelectItem value="orcs">👹 Orc</SelectItem>
                  <SelectItem value="humanos_fantasia">👑 Humano (Fantasia)</SelectItem>
                  <SelectItem value="alienigenas">👽 Alienígena</SelectItem>
                  <SelectItem value="androides">🤖 Androide</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gênero - sempre visível */}
            <div>
              <Label htmlFor="genero" className="text-sm font-medium mb-3 block">
                Gênero:
              </Label>
              <Select value={genero} onValueChange={setGenero}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="ambos">Ambos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campos condicionais baseados no modo */}
            {modo === 'lista' ? (
              <div>
                <Label htmlFor="quantidade" className="text-sm font-medium mb-3 block">
                  Quantidade (máx. 50):
                </Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="1"
                  max="50"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  placeholder="5"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="sobrenomes" className="text-sm font-medium mb-3 block">
                  Número de Sobrenomes:
                </Label>
                <Select value={numeroSobrenomes} onValueChange={setNumeroSobrenomes}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Sobrenome</SelectItem>
                    <SelectItem value="2">2 Sobrenomes</SelectItem>
                    <SelectItem value="3">3 Sobrenomes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button
            onClick={executeGerar}
            disabled={!genero || !categoria}
            className="w-full mt-8 h-12"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {modo === 'lista' ? 'Gerar Lista de Nomes' : 'Gerar Nome Completo'}
          </Button>
        </Card>

        {/* Card de Resultados */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-card-foreground">
              {modo === 'lista' ? 'Lista de Nomes' : 'Nome Completo'}
            </h3>
            {((modo === 'lista' && nomes.length > 0) || (modo === 'completo' && nomeCompleto)) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => modo === 'lista' ? copyAllNames() : copyToClipboard(nomeCompleto!.completo)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar {modo === 'lista' ? 'Todos' : 'Nome'}
              </Button>
            )}
          </div>
          
          {/* Exibição do Modo Lista */}
          {modo === 'lista' && (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {nomes.length > 0 ? (
                nomes.map((nome, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-accent/10 rounded-lg hover-lift">
                    <span className="font-medium text-card-foreground flex-1 mr-3">{nome}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorito(nome)}
                        className="text-warning hover:text-warning-foreground hover:bg-warning/20"
                      >
                        {favoritos.includes(nome) ? <Star className="w-4 h-4 fill-current" /> : <StarOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(nome)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <List className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Nomes aparecerão aqui</p>
                  <p className="text-sm mt-2">Configure as opções e clique em "Gerar Lista"</p>
                </div>
              )}
            </div>
          )}

          {/* Exibição do Modo Completo */}
          {modo === 'completo' && (
            <div className="space-y-6">
              {nomeCompleto ? (
                <div>
                  {/* Nome Completo em Destaque */}
                  <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border-2 border-primary/20 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Crown className="w-6 h-6 text-primary" />
                      <h4 className="text-lg font-semibold text-card-foreground">Nome Gerado</h4>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-primary">{nomeCompleto.completo}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorito(nomeCompleto.completo)}
                        className="text-warning hover:text-warning-foreground hover:bg-warning/20"
                      >
                        {favoritos.includes(nomeCompleto.completo) ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
                      </Button>
                    </div>
                  </div>

                  {/* Partes Individuais */}
                  <div>
                    <h4 className="text-sm font-semibold text-card-foreground mb-3">Partes Individuais:</h4>
                    <div className="space-y-2">
                      {nomeCompleto.partes.map((parte, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                              {index === 0 ? 'Nome' : `${index}º Sobrenome`}
                            </span>
                            <span className="font-medium text-card-foreground">{parte}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(parte)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Crown className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Nome completo aparecerá aqui</p>
                  <p className="text-sm mt-2">Configure as opções e clique em "Gerar Nome Completo"</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Card de Favoritos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-warning" />
              Favoritos ({favoritos.length})
            </h3>
            <div className="flex gap-2">
              {favoritos.length > 0 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyAllFavoritos}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copiar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={limparFavoritos}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {favoritos.length > 0 ? (
              favoritos.map((nome, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-warning/5 border border-warning/20 rounded-lg hover-lift">
                  <span className="font-medium text-card-foreground flex-1 mr-3">{nome}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorito(nome)}
                      className="text-warning hover:text-warning-foreground hover:bg-warning/20"
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(nome)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-12">
                <Star className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nenhum favorito ainda</p>
                <p className="text-sm mt-2">Clique na estrela ao lado dos nomes para salvá-los</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Card de Informações com maior espaçamento */}
      <Card className="mt-12 p-6 bg-accent/5 border-accent/20">
        <div className="flex items-start gap-4">
          <User className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
          <div className="text-sm">
            <h4 className="font-semibold text-card-foreground mb-3 text-base">Sistema Bimodal de Geração</h4>
            <div className="grid md:grid-cols-2 gap-4 text-muted-foreground">
              <div>
                <p className="mb-2">
                  <strong className="text-card-foreground">Modo Lista:</strong> Ideal para quando você precisa de várias opções. 
                  Gera uma lista de primeiros nomes baseados na categoria e gênero escolhidos.
                </p>
              </div>
              <div>
                <p className="mb-2">
                  <strong className="text-card-foreground">Modo Completo:</strong> Perfeito para criar personagens únicos. 
                  Gera um nome completo com múltiplos sobrenomes temáticos, oferecendo cópia individual de cada parte.
                </p>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground">
              <strong className="text-card-foreground">Sistema de Favoritos:</strong> Salve os nomes que mais gostar! 
              Seus favoritos ficam armazenados no navegador e estarão disponíveis sempre que voltar.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};