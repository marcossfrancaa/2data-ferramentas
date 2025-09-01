import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, Users, MapPin, DollarSign, Languages, Flag, Copy, Calendar, Clock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: {
      [key: string]: {
        official: string;
        common: string;
      };
    };
  };
  capital?: string[];
  population: number;
  area: number;
  region: string;
  subregion: string;
  currencies?: {
    [key: string]: {
      name: string;
      symbol?: string;
    };
  };
  languages?: {
    [key: string]: string;
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  coatOfArms?: {
    png?: string;
    svg?: string;
  };
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  timezones: string[];
  continents: string[];
  cca2: string;
  cca3: string;
  ccn3?: string;
  independent?: boolean;
  status: string;
  borders?: string[];
  landlocked: boolean;
  fifa?: string;
}

export const CountryInfo = () => {
  const [country, setCountry] = useState<Country | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  const searchCountry = async () => {
    if (!searchTerm.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Digite o nome de um país para buscar",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setError('');
    
    // Mapeamento de nomes em português para inglês para melhor precisão
    const countryTranslations: { [key: string]: string } = {
      'estados unidos': 'united states',
      'reino unido': 'united kingdom',
      'alemanha': 'germany',
      'frança': 'france',
      'espanha': 'spain',
      'itália': 'italy',
      'países baixos': 'netherlands',
      'holanda': 'netherlands',
      'suíça': 'switzerland',
      'áustria': 'austria',
      'bélgica': 'belgium',
      'dinamarca': 'denmark',
      'suécia': 'sweden',
      'noruega': 'norway',
      'finlândia': 'finland',
      'polônia': 'poland',
      'república tcheca': 'czech republic',
      'hungria': 'hungary',
      'grécia': 'greece',
      'turquia': 'turkey',
      'rússia': 'russia',
      'china': 'china',
      'japão': 'japan',
      'coreia do sul': 'south korea',
      'coreia do norte': 'north korea',
      'índia': 'india',
      'tailândia': 'thailand',
      'vietnã': 'vietnam',
      'indonésia': 'indonesia',
      'filipinas': 'philippines',
      'malásia': 'malaysia',
      'singapura': 'singapore',
      'austrália': 'australia',
      'nova zelândia': 'new zealand',
      'canadá': 'canada',
      'méxico': 'mexico',
      'argentina': 'argentina',
      'chile': 'chile',
      'colômbia': 'colombia',
      'peru': 'peru',
      'venezuela': 'venezuela',
      'uruguai': 'uruguay',
      'paraguai': 'paraguay',
      'bolívia': 'bolivia',
      'equador': 'ecuador',
      'áfrica do sul': 'south africa',
      'egito': 'egypt',
      'marrocos': 'morocco',
      'nigéria': 'nigeria',
      'quênia': 'kenya',
      'etiópia': 'ethiopia'
    };
    
    try {
      // Usar tradução se disponível, senão usar o termo original
      const searchKey = searchTerm.toLowerCase().trim();
      const translatedTerm = countryTranslations[searchKey] || searchTerm.trim();
      
      let response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(translatedTerm)}?fullText=false`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      // Se não encontrou com a tradução, tenta com o termo original
      if (!response.ok && translatedTerm !== searchTerm.trim()) {
        response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(searchTerm.trim())}?fullText=false`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
      }
      
      if (!response.ok) {
        throw new Error('País não encontrado');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        // Encontrar o país mais relevante baseado no termo de busca
        let selectedCountry = data[0];
        
        // Se há múltiplos resultados, tentar encontrar a melhor correspondência
        if (data.length > 1) {
          const exactMatch = data.find((country: Country) => 
            country.name.common.toLowerCase() === searchTerm.toLowerCase().trim() ||
            country.name.official.toLowerCase() === searchTerm.toLowerCase().trim()
          );
          if (exactMatch) {
            selectedCountry = exactMatch;
          }
        }
        
        setCountry(selectedCountry);
        setError('');
        toast({
          title: "País encontrado!",
          description: `Informações de ${selectedCountry.name.common} carregadas`
        });
      } else {
        throw new Error('Nenhum país encontrado');
      }
    } catch (error) {
      setError('País não encontrado. Tente outro nome ou verifique a grafia.');
      setCountry(null);
      toast({
        title: "País não encontrado",
        description: "Verifique o nome do país e tente novamente",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${type} copiado para a área de transferência`
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('pt-BR').format(num);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchCountry();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Consulta de Dados de Países
            </h1>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Informações detalhadas sobre qualquer país do mundo
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
              Busque dados completos sobre população, capital, moeda, idiomas, bandeira e muito mais. 
              Uma ferramenta completa para pesquisas geográficas e educacionais.
            </p>
          </div>
        </div>

        {/* Buscador */}
        <Card className="border-2 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar País
            </CardTitle>
            <CardDescription>
              Digite o nome do país em português, inglês ou no idioma nativo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Ex: Brasil, Estados Unidos, França..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-lg h-12"
                />
              </div>
              <Button 
                onClick={searchCountry} 
                disabled={loading}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8"
              >
                {loading ? (
                  <>
                    <Search className="h-5 w-5 mr-2 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Buscar
                  </>
                )}
              </Button>
            </div>
            
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-center">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resultados */}
        {country && (
          <div className="space-y-6">
            {/* Header do País */}
            <Card className="bg-gradient-to-r from-accent/10 to-secondary/10 border-accent/30">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-shrink-0">
                    <img 
                      src={country.flags.png} 
                      alt={country.flags.alt || `Bandeira de ${country.name.common}`}
                      className="w-32 h-24 object-cover rounded-lg border-2 border-accent/30 shadow-lg"
                    />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left space-y-3">
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">{country.name.common}</h2>
                      <p className="text-xl text-muted-foreground">{country.name.official}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                      <Badge variant="secondary">{country.region}</Badge>
                      <Badge variant="outline">{country.subregion}</Badge>
                      {country.independent && <Badge className="bg-green-100 text-green-800">Independente</Badge>}
                      {country.landlocked && <Badge variant="destructive">Sem litoral</Badge>}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* População */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5 text-blue-500" />
                    População
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {formatNumber(country.population)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">habitantes</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(country.population.toString(), "População")}
                    className="mt-2 h-8"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </CardContent>
              </Card>

              {/* Capital */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MapPin className="h-5 w-5 text-red-500" />
                    Capital
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {country.capital ? country.capital[0] : 'N/A'}
                  </div>
                  {country.capital && country.capital.length > 1 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      +{country.capital.length - 1} outras
                    </p>
                  )}
                  {country.capital && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(country.capital![0], "Capital")}
                      className="mt-2 h-8"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copiar
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Área */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="h-5 w-5 text-green-500" />
                    Área
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {formatNumber(country.area)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">km²</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(country.area.toString(), "Área")}
                    className="mt-2 h-8"
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Moedas e Idiomas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Moedas */}
              {country.currencies && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      Moedas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(country.currencies).map(([code, currency]) => (
                      <div key={code} className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                        <div>
                          <div className="font-semibold">{currency.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {code} {currency.symbol && `(${currency.symbol})`}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(`${currency.name} (${code})`, "Moeda")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Idiomas */}
              {country.languages && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Languages className="h-5 w-5 text-purple-500" />
                      Idiomas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(country.languages).map(([code, language]) => (
                      <div key={code} className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                        <div>
                          <div className="font-semibold">{language}</div>
                          <div className="text-sm text-muted-foreground">{code.toUpperCase()}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(language, "Idioma")}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Informações Adicionais */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Informações Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Códigos ISO</Label>
                    <div className="mt-1 space-y-1">
                      <div className="text-sm">ISO 2: <code className="bg-accent px-1 rounded">{country.cca2}</code></div>
                      <div className="text-sm">ISO 3: <code className="bg-accent px-1 rounded">{country.cca3}</code></div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Continente</Label>
                    <div className="mt-1">{country.continents.join(', ')}</div>
                  </div>

                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Status</Label>
                    <div className="mt-1">
                      <Badge variant={country.status === 'officially-assigned' ? 'default' : 'secondary'}>
                        {country.status}
                      </Badge>
                    </div>
                  </div>

                  {country.fifa && (
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">Código FIFA</Label>
                      <div className="mt-1">
                        <code className="bg-accent px-2 py-1 rounded">{country.fifa}</code>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground">Fusos Horários</Label>
                    <div className="mt-1 text-sm">{country.timezones.length} fuso(s)</div>
                  </div>

                  {country.borders && (
                    <div>
                      <Label className="text-sm font-semibold text-muted-foreground">Fronteiras</Label>
                      <div className="mt-1 text-sm">{country.borders.length} país(es)</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Links Úteis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Links Úteis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" asChild>
                    <a href={country.maps.googleMaps} target="_blank" rel="noopener noreferrer">
                      <MapPin className="h-4 w-4 mr-2" />
                      Google Maps
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href={country.maps.openStreetMaps} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      OpenStreetMap
                    </a>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => copyToClipboard(country.flags.svg, "URL da bandeira")}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Copiar URL da Bandeira
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};