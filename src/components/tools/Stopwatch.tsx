import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RefreshCw, Flag } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

export const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const start = () => {
    if (!isRunning) {
      const currentTime = Date.now();
      startTimeRef.current = currentTime - time;
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        setTime(now - startTimeRef.current);
      }, 10);
      setIsRunning(true);
    }
  };

  const pause = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  };

  const reset = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTime(0);
    setIsRunning(false);
    setLaps([]);
  };

  const addLap = () => {
    if (isRunning) {
      setLaps([...laps, time]);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Cronômetro</CardTitle>
          <CardDescription>
            Cronômetro preciso com função de voltas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="text-6xl font-mono font-bold text-primary mb-8">
              {formatTime(time)}
            </div>
            
            <div className="flex justify-center gap-4 mb-6">
              {!isRunning ? (
                <Button onClick={start} size="lg" className="min-w-[120px]">
                  <Play className="mr-2 h-4 w-4" />
                  Iniciar
                </Button>
              ) : (
                <Button onClick={pause} size="lg" variant="secondary" className="min-w-[120px]">
                  <Pause className="mr-2 h-4 w-4" />
                  Pausar
                </Button>
              )}
              
              <Button onClick={reset} size="lg" variant="outline" className="min-w-[120px]">
                <RefreshCw className="mr-2 h-4 w-4" />
                Zerar
              </Button>
              
              {isRunning && (
                <Button onClick={addLap} size="lg" variant="default" className="min-w-[120px]">
                  <Flag className="mr-2 h-4 w-4" />
                  Volta
                </Button>
              )}
            </div>
          </div>

          {laps.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Voltas</h3>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="space-y-2">
                  {laps.map((lap, index) => {
                    const prevLap = index > 0 ? laps[index - 1] : 0;
                    const lapTime = lap - prevLap;
                    return (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 rounded-lg bg-secondary/50"
                      >
                        <span className="font-medium">Volta {index + 1}</span>
                        <div className="text-right">
                          <div className="font-mono">{formatTime(lap)}</div>
                          <div className="text-sm text-muted-foreground font-mono">
                            +{formatTime(lapTime)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};