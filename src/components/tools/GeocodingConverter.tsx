import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Copy, Navigation } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    road?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export const GeocodingConverter = () => {
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [reverseResult, setReverseResult] = useState<LocationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const geocodeAddress = async () => {
    if (!address.trim()) {
      toast({
        title: "Endereço vazio",
        description: "Digite um endereço para buscar",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5&addressdetails=1`
      );
      const data: LocationResult[] = await response.json();
      
      if (data.length === 0) {
        toast({
          title: "Nenhum resultado",
          description: "Nenhuma localização encontrada para este endereço",
          variant: "destructive"
        });
      } else {
        setResults(data);
        toast({
          title: "Busca realizada",
          description: `${data.length} resultado(s) encontrado(s)`,
        });
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Erro ao buscar a localização. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async () => {
    if (!latitude.trim() || !longitude.trim()) {
      toast({
        title: "Coordenadas incompletas",
        description: "Digite latitude e longitude para buscar o endereço",
        variant: "destructive"
      });
      return;
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      toast({
        title: "Coordenadas inválidas",
        description: "Digite coordenadas válidas (lat: -90 a 90, lon: -180 a 180)",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
      );
      const data: LocationResult = await response.json();
      
      if (data && data.display_name) {
        setReverseResult(data);
        toast({
          title: "Endereço encontrado",
          description: "Geocodificação reversa realizada com sucesso",
        });
      } else {
        toast({
          title: "Nenhum resultado",
          description: "Nenhum endereço encontrado para essas coordenadas",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro na busca",
        description: "Erro ao buscar o endereço. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Localização não suportada",
        description: "Seu navegador não suporta geolocalização",
        variant: "destructive"
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toString());
        setLongitude(position.coords.longitude.toString());
        toast({
          title: "Localização obtida",
          description: "Coordenadas atuais carregadas",
        });
      },
      (error) => {
        toast({
          title: "Erro de localização",
          description: "Não foi possível obter sua localização",
          variant: "destructive"
        });
      }
    );
  };

  const copyCoordinates = (lat: string, lon: string) => {
    navigator.clipboard.writeText(`${lat}, ${lon}`);
    toast({
      title: "Copiado!",
      description: "Coordenadas copiadas para a área de transferência",
    });
  };

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Copiado!",
      description: "Endereço copiado para a área de transferência",
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Geocoding & Geocoding Reverso
        </CardTitle>
        <CardDescription>
          Converta endereços em coordenadas e vice-versa
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Geocoding: Endereço → Coordenadas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Endereço → Coordenadas</h3>
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Digite um endereço (ex: Avenida Paulista, São Paulo)"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && geocodeAddress()}
            />
            <Button onClick={geocodeAddress} disabled={loading}>
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {results.length > 0 && (
            <div className="space-y-2">
              <Label>Resultados encontrados:</Label>
              <div className="grid gap-2 max-h-40 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="p-3 border rounded-lg bg-muted/20 hover:bg-muted/40 cursor-pointer"
                    onClick={() => copyCoordinates(result.lat, result.lon)}
                  >
                    <div className="font-medium text-sm">{result.display_name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Lat: {result.lat}, Lon: {result.lon}
                      <Copy className="inline h-3 w-3 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t pt-8">
          {/* Geocoding Reverso: Coordenadas → Endereço */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Navigation className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Coordenadas → Endereço</h3>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  placeholder="-23.550520"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  type="number"
                  step="any"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  placeholder="-46.633309"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  type="number"
                  step="any"
                />
              </div>
              
              <div className="flex gap-2 items-end">
                <Button onClick={getCurrentLocation} variant="outline" className="flex-1">
                  <Navigation className="h-4 w-4 mr-2" />
                  Minha Localização
                </Button>
                <Button onClick={reverseGeocode} disabled={loading}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {reverseResult && (
              <div className="space-y-2">
                <Label>Endereço encontrado:</Label>
                <div
                  className="p-3 border rounded-lg bg-muted/20 hover:bg-muted/40 cursor-pointer"
                  onClick={() => copyAddress(reverseResult.display_name)}
                >
                  <div className="font-medium text-sm">{reverseResult.display_name}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Clique para copiar
                    <Copy className="inline h-3 w-3 ml-1" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="text-xs text-muted-foreground space-y-2">
          <div className="font-medium">Exemplos de coordenadas:</div>
          <div className="grid gap-1 md:grid-cols-2">
            <div>• São Paulo: -23.550520, -46.633309</div>
            <div>• Rio de Janeiro: -22.906847, -43.172896</div>
            <div>• Brasília: -15.780148, -47.929170</div>
            <div>• Salvador: -12.971599, -38.501400</div>
          </div>
          <div className="mt-2 text-center">
            * Serviço fornecido por OpenStreetMap Nominatim
          </div>
        </div>
      </CardContent>
    </Card>
  );
};