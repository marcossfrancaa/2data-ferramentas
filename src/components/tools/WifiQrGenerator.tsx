import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Wifi, Copy, QrCode } from 'lucide-react';
import { toast } from 'sonner';

export const WifiQrGenerator = () => {
  const [networkName, setNetworkName] = useState('');
  const [password, setPassword] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const generateWifiQR = () => {
    if (!networkName.trim()) {
      toast.error('Digite o nome da rede Wi-Fi');
      return;
    }

    // Formato WiFi QR: WIFI:T:WPA;S:NetworkName;P:Password;H:false;;
    const wifiString = `WIFI:T:WPA;S:${networkName};P:${password};H:false;;`;
    const encodedWifi = encodeURIComponent(wifiString);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodedWifi}`;
    
    setQrCodeUrl(qrUrl);
    toast.success('QR Code Wi-Fi gerado com sucesso!');
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `wifi-qr-${networkName}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('QR Code baixado!');
  };

  const copyWifiString = () => {
    const wifiString = `WIFI:T:WPA;S:${networkName};P:${password};H:false;;`;
    navigator.clipboard.writeText(wifiString);
    toast.success('String Wi-Fi copiada!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-6 w-6" />
            Gerador de QR Code Wi-Fi
          </CardTitle>
          <CardDescription>
            Crie QR Codes para conexão automática à rede Wi-Fi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="network">
                  <Wifi className="h-4 w-4 inline mr-2" />
                  Rede Wi-Fi
                </Label>
                <Input
                  id="network"
                  value={networkName}
                  onChange={(e) => setNetworkName(e.target.value)}
                  placeholder="Nome da rede (SSID)"
                />
              </div>

              <div>
                <Label htmlFor="password">
                  🔒 Senha Wi-Fi
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha da rede (opcional)"
                />
              </div>

              <Button onClick={generateWifiQR} className="w-full">
                <QrCode className="h-4 w-4 mr-2" />
                Gerar QR Code do Wi-Fi
              </Button>

              {qrCodeUrl && (
                <div className="space-y-2">
                  <Button onClick={copyWifiString} variant="outline" className="w-full">
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar String Wi-Fi
                  </Button>
                  <Button onClick={downloadQRCode} variant="secondary" className="w-full">
                    Baixar QR Code
                  </Button>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center justify-center">
              {qrCodeUrl ? (
                <div className="text-center space-y-4">
                  <img 
                    src={qrCodeUrl} 
                    alt="QR Code Wi-Fi" 
                    className="max-w-full h-auto border border-border rounded-lg shadow-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Escaneie para conectar à rede "{networkName}"
                  </p>
                </div>
              ) : (
                <div className="text-center text-muted-foreground space-y-4">
                  <div className="w-64 h-64 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                    <div>
                      <QrCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>QR Code aparecerá aqui</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-secondary/50 rounded-lg">
            <h3 className="font-semibold mb-2">Como usar:</h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Digite o nome da sua rede Wi-Fi (SSID)</li>
              <li>Digite a senha da rede (opcional para redes abertas)</li>
              <li>Clique em "Gerar QR Code do Wi-Fi"</li>
              <li>Compartilhe o QR Code ou baixe a imagem</li>
              <li>Outros dispositivos podem escanear para conectar automaticamente</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};