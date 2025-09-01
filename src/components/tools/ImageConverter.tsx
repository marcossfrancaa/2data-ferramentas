import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { ImageIcon, Upload, Download, RefreshCw, X, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ConversionTask {
  id: string;
  originalFile: File;
  originalFormat: string;
  targetFormat: string;
  quality: number;
  status: 'pending' | 'converting' | 'completed' | 'error';
  convertedBlob?: Blob;
  originalSize: number;
  convertedSize?: number;
}

export const ImageConverter = () => {
  const [tasks, setTasks] = useState<ConversionTask[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [targetFormat, setTargetFormat] = useState('webp');
  const [quality, setQuality] = useState([85]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const supportedFormats = [
    { value: 'webp', name: 'WebP', description: 'Menor tamanho, boa qualidade' },
    { value: 'jpeg', name: 'JPEG', description: 'Universal, fotos' },
    { value: 'png', name: 'PNG', description: 'Transparência, gráficos' },
    { value: 'avif', name: 'AVIF', description: 'Mais moderno, menor ainda' },
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione apenas arquivos de imagem",
        variant: "destructive",
      });
      return;
    }

    const newTasks: ConversionTask[] = imageFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      originalFile: file,
      originalFormat: file.type.split('/')[1],
      targetFormat,
      quality: quality[0],
      status: 'pending',
      originalSize: file.size,
    }));

    setTasks(prev => [...prev, ...newTasks]);
    
    toast({
      title: "Arquivos Adicionados",
      description: `${imageFiles.length} imagem(ns) pronta(s) para conversão`,
    });
  };

  const convertImage = async (task: ConversionTask): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Falha na conversão'));
              }
            },
            `image/${task.targetFormat}`,
            task.quality / 100
          );
        } else {
          reject(new Error('Contexto do canvas não disponível'));
        }
      };
      
      img.onerror = () => reject(new Error('Falha ao carregar imagem'));
      img.src = URL.createObjectURL(task.originalFile);
    });
  };

  const processTask = async (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: 'converting' } : task
    ));

    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const convertedBlob = await convertImage(task);
      
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { 
              ...t, 
              status: 'completed', 
              convertedBlob,
              convertedSize: convertedBlob.size 
            } 
          : t
      ));

      toast({
        title: "Conversão Concluída!",
        description: `${task.originalFile.name} convertido para ${task.targetFormat.toUpperCase()}`,
      });
    } catch (error) {
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'error' } : t
      ));
      
      toast({
        title: "Erro na Conversão",
        description: "Falha ao converter a imagem",
        variant: "destructive",
      });
    }
  };

  const convertAllTasks = async () => {
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    
    for (const task of pendingTasks) {
      await processTask(task.id);
      // Pequena pausa entre conversões
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  };

  const downloadTask = (task: ConversionTask) => {
    if (!task.convertedBlob) return;

    const url = URL.createObjectURL(task.convertedBlob);
    const a = document.createElement('a');
    a.href = url;
    
    const originalName = task.originalFile.name.split('.').slice(0, -1).join('.');
    a.download = `${originalName}.${task.targetFormat}`;
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Download Iniciado!",
      description: "Imagem convertida está sendo baixada",
    });
  };

  const removeTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCompressionRatio = (task: ConversionTask) => {
    if (!task.convertedSize) return 0;
    return Math.round(((task.originalSize - task.convertedSize) / task.originalSize) * 100);
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <ImageIcon className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Conversor de Imagens</h1>
        </div>
        <p className="text-muted-foreground">
          Converte imagens entre diferentes formatos (PNG, JPG, WebP, AVIF) com controle de qualidade.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-blue-500" />
            Upload e Configurações
          </h3>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-border'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Arraste imagens aqui
            </h3>
            <p className="text-muted-foreground mb-4">
              Ou clique para selecionar arquivos
            </p>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Selecionar Imagens
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="targetFormat">Formato de Destino</Label>
              <Select value={targetFormat} onValueChange={setTargetFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      <div>
                        <div className="font-medium">{format.name}</div>
                        <div className="text-xs text-muted-foreground">{format.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quality">
                Qualidade: {quality[0]}%
              </Label>
              <Slider
                id="quality"
                min={10}
                max={100}
                step={5}
                value={quality}
                onValueChange={setQuality}
                className="mt-2"
              />
              <div className="text-xs text-muted-foreground mt-1">
                Menor qualidade = arquivo menor
              </div>
            </div>
          </div>

          {tasks.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">
                  {tasks.length} arquivo(s) • {completedTasks} convertido(s)
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAllTasks}
                  >
                    Limpar Tudo
                  </Button>
                  <Button
                    onClick={convertAllTasks}
                    disabled={pendingTasks === 0}
                    size="sm"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Converter Todos
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-green-500" />
            Comparação de Formatos
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border">
              <h4 className="font-medium text-green-800 mb-2">WebP</h4>
              <p className="text-sm text-green-700">
                • 25-35% menor que JPEG<br/>
                • Suporte moderno (Chrome, Firefox, Safari)<br/>
                • Ideal para web
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border">
              <h4 className="font-medium text-blue-800 mb-2">AVIF</h4>
              <p className="text-sm text-blue-700">
                • Até 50% menor que JPEG<br/>
                • Qualidade superior<br/>
                • Suporte ainda limitado
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border">
              <h4 className="font-medium text-orange-800 mb-2">JPEG</h4>
              <p className="text-sm text-orange-700">
                • Universalmente suportado<br/>
                • Ideal para fotos<br/>
                • Sem transparência
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border">
              <h4 className="font-medium text-purple-800 mb-2">PNG</h4>
              <p className="text-sm text-purple-700">
                • Suporte à transparência<br/>
                • Qualidade perfeita<br/>
                • Arquivos maiores
              </p>
            </div>
          </div>
        </Card>
      </div>

      {tasks.length > 0 && (
        <Card className="mt-6 p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Fila de Conversão
          </h3>
          
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 bg-accent/5 rounded-lg border"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">
                      {task.originalFile.name}
                    </span>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {task.originalFormat.toUpperCase()} → {task.targetFormat.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      Tamanho: {formatFileSize(task.originalSize)}
                      {task.convertedSize && (
                        <>
                          {' → '}
                          <span className="font-medium text-green-600">
                            {formatFileSize(task.convertedSize)}
                          </span>
                          <span className="text-green-600 ml-1">
                            (-{getCompressionRatio(task)}%)
                          </span>
                        </>
                      )}
                    </div>
                    
                    {task.status === 'converting' && (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        <span>Convertendo...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {task.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => processTask(task.id)}
                    >
                      Converter
                    </Button>
                  )}
                  
                  {task.status === 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadTask(task)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  )}
                  
                  {task.status === 'error' && (
                    <span className="text-red-600 text-sm font-medium">
                      Erro
                    </span>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTask(task.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <ImageIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <h4 className="font-semibold text-blue-800 mb-2">💡 Dicas de Uso</h4>
            <div className="text-blue-700 space-y-1">
              <p>• <strong>WebP:</strong> Melhor para web moderna (menor tamanho)</p>
              <p>• <strong>JPEG:</strong> Universal, ideal para fotos com muitas cores</p>
              <p>• <strong>PNG:</strong> Use quando precisar de transparência</p>
              <p>• <strong>Qualidade 85%:</strong> Ótimo equilíbrio entre tamanho e qualidade</p>
              <p>• <strong>Batch:</strong> Processe várias imagens de uma vez</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};