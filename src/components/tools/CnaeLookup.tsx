import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, Search, Copy, RefreshCw, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface CnaeData {
  id: string;
  descricao: string;
  observacoes?: string[];
}

interface CnaeSearchResult {
  id: string;
  descricao: string;
  observacoes?: string[];
}

export const CnaeLookup = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cnaeData, setCnaeData] = useState<CnaeData | null>(null);
  const [searchResults, setSearchResults] = useState<CnaeSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState<'code' | 'activity'>('code');
  const [allCnaes, setAllCnaes] = useState<CnaeSearchResult[]>([]);

  // Carregar todos os CNAEs na inicialização
  useEffect(() => {
    const loadAllCnaes = async () => {
      try {
        const response = await fetch('https://servicodados.ibge.gov.br/api/v2/cnae/classes');
        if (response.ok) {
          const data = await response.json();
          const cnaes = data.map((cnae: any) => ({
            id: cnae.id,
            descricao: cnae.denominacao,
            observacoes: []
          }));
          setAllCnaes(cnaes);
        }
      } catch (error) {
        console.error('Erro ao carregar CNAEs:', error);
      }
    };
    loadAllCnaes();
  }, []);

  const searchByCnaeCode = async (cnaeCode: string) => {
    try {
      const response = await fetch(`https://servicodados.ibge.gov.br/api/v2/cnae/classes/${cnaeCode}`);
      
      if (!response.ok) {
        throw new Error('CNAE não encontrado');
      }

      const data = await response.json();
      
      // Verificar se a resposta é um array vazio
      if (Array.isArray(data) && data.length === 0) {
        throw new Error('CNAE não encontrado');
      }
      
      setCnaeData({
        id: data.id,
        descricao: data.denominacao,
        observacoes: data.observacoes || []
      });
      setSearchResults([]);
      
      toast.success('CNAE encontrado com sucesso!');
    } catch (error: any) {
      toast.error(`Erro ao buscar CNAE: ${error.message}`);
      setCnaeData(null);
    }
  };

  // Busca em tempo real
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      if (!term.trim() || term.length < 2) {
        setSearchResults([]);
        return;
      }

      const filteredResults = allCnaes.filter((cnae) =>
        cnae.descricao.toLowerCase().includes(term.toLowerCase()) ||
        cnae.id.includes(term)
      ).slice(0, 15);

      setSearchResults(filteredResults);
    }, 300),
    [allCnaes]
  );

  // Função debounce
  function debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }

  const searchByActivity = async (activity: string) => {
    if (!activity.trim()) {
      setSearchResults([]);
      return;
    }
    debouncedSearch(activity);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error('Digite um código CNAE ou nome de atividade');
      return;
    }

    setLoading(true);
    try {
      if (searchMode === 'code') {
        // Limpar código CNAE (remover pontos, traços, etc.)
        const cleanCode = searchTerm.replace(/[^\d]/g, '');
        if (cleanCode.length < 4) {
          toast.error('Código CNAE deve ter pelo menos 4 dígitos');
          return;
        }
        await searchByCnaeCode(cleanCode);
      } else {
        await searchByActivity(searchTerm.trim());
      }
    } finally {
      setLoading(false);
    }
  };

  const selectCnaeFromResults = async (cnae: CnaeSearchResult) => {
    setLoading(true);
    try {
      await searchByCnaeCode(cnae.id);
      setSearchTerm(cnae.id);
      setSearchMode('code');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado para a área de transferência`);
  };

  const formatCnaeCode = (code: string) => {
    // Verificar se code existe e é string
    if (!code || typeof code !== 'string') return code || '';
    
    // Formato padrão: XX.XX-X-XX
    if (code.length === 7) {
      return `${code.slice(0, 2)}.${code.slice(2, 4)}-${code.slice(4, 5)}-${code.slice(5, 7)}`;
    }
    return code;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Card>
        <CardHeader>
          <CardTitle>Consulta de Atividades (CNAE)</CardTitle>
          <CardDescription>
            Encontre o código CNAE correto para sua empresa buscando por atividade, ou 
            consulte os detalhes de um código existente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Modo de Busca */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={searchMode === 'code' ? 'default' : 'outline'}
              onClick={() => setSearchMode('code')}
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2" />
              Por Código
            </Button>
            <Button
              variant={searchMode === 'activity' ? 'default' : 'outline'}
              onClick={() => setSearchMode('activity')}
              size="sm"
            >
              <Search className="h-4 w-4 mr-2" />
              Por Atividade
            </Button>
          </div>

          {/* Campo de Busca */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder={
                  searchMode === 'code' 
                    ? "Ex: 0112101, 01121-01, ou apenas 01121" 
                    : "Digite para buscar: restaurante, software, construção..."
                }
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (searchMode === 'activity') {
                    searchByActivity(e.target.value);
                  } else if (searchMode === 'code' && e.target.value.replace(/[^\d]/g, '').length >= 4) {
                    debouncedSearch(e.target.value);
                  }
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            {searchMode === 'code' && (
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="min-w-[120px]"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Consultar
              </Button>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">
                  {searchMode === 'code' ? 'Consultando CNAE...' : 'Buscando atividades...'}
                </p>
              </div>
            </div>
          )}

          {/* Resultados de Busca por Atividade */}
          {searchResults.length > 0 && !loading && (
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Resultados encontrados ({searchResults.length})
              </h3>
              <div className="space-y-3">
                {searchResults.map((result) => (
                  <Card 
                    key={result.id} 
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => selectCnaeFromResults(result)}
                  >
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-3">
                        <Building className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-primary">
                              CNAE: {formatCnaeCode(result.id)}
                            </h4>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  copyToClipboard(result.id, 'Código CNAE');
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {result.descricao}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Detalhes do CNAE */}
          {cnaeData && !loading && (
            <>
              {/* CNAE Principal */}
              <div className="text-center p-6 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
                <Building className="h-12 w-12 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">
                  CNAE: {formatCnaeCode(cnaeData.id)}
                </h2>
                <p className="text-muted-foreground mb-4">
                  Classificação Nacional de Atividades Econômicas
                </p>
                <Button
                  onClick={() => copyToClipboard(cnaeData.id, 'Código CNAE')}
                  variant="outline"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Código
                </Button>
              </div>

              {/* Descrição da Atividade */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Descrição da Atividade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Atividade Econômica</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(cnaeData.descricao, 'Descrição')}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {cnaeData.descricao}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Observações */}
              {cnaeData.observacoes && cnaeData.observacoes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Observações
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {cnaeData.observacoes.map((obs, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium text-sm">
                                {obs.includes('compreende') ? 'Esta subclasse compreende:' : 
                                 obs.includes('NÃO compreende') ? 'Esta subclasse NÃO compreende:' : 
                                 `Observação ${index + 1}`}
                              </h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(obs, 'Observação')}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {obs}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Informações sobre a API */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              📊 Fonte dos Dados
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Os dados são fornecidos pela API oficial do IBGE (Instituto Brasileiro de Geografia e Estatística), 
              garantindo informações oficiais e atualizadas sobre as classificações CNAE.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};