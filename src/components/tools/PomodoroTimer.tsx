
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Timer, Coffee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const PomodoroTimer = () => {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(workMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);
  const [cycles, setCycles] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setTimeLeft(isWorkTime ? workMinutes * 60 : breakMinutes * 60);
  }, [workMinutes, breakMinutes, isWorkTime]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            // Timer acabou
            setIsActive(false);
            
            if (isWorkTime) {
              setCycles(c => c + 1);
              toast({
                title: "Tempo de trabalho finalizado!",
                description: "Hora de fazer uma pausa",
              });
            } else {
              toast({
                title: "Pausa finalizada!",
                description: "Hora de voltar ao trabalho",
              });
            }
            
            setIsWorkTime(!isWorkTime);
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isWorkTime, toast]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsWorkTime(true);
    setTimeLeft(workMinutes * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = isWorkTime 
    ? ((workMinutes * 60 - timeLeft) / (workMinutes * 60)) * 100
    : ((breakMinutes * 60 - timeLeft) / (breakMinutes * 60)) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Timer className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-card-foreground">Timer Pomodoro</h1>
        </div>
        <p className="text-muted-foreground">
          Técnica de produtividade com intervalos de trabalho e descanso. 
          Trabalhe focado por 25 minutos, depois descanse por 5 minutos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">
            Configurações
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="workMinutes">Trabalho (min)</Label>
                <Input
                  id="workMinutes"
                  type="number"
                  min="1"
                  max="60"
                  value={workMinutes}
                  onChange={(e) => setWorkMinutes(Number(e.target.value) || 25)}
                  disabled={isActive}
                />
              </div>
              <div>
                <Label htmlFor="breakMinutes">Pausa (min)</Label>
                <Input
                  id="breakMinutes"
                  type="number"
                  min="1"
                  max="30"
                  value={breakMinutes}
                  onChange={(e) => setBreakMinutes(Number(e.target.value) || 5)}
                  disabled={isActive}
                />
              </div>
            </div>

            <div className="p-4 bg-accent/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Ciclos Completados</span>
                <div className="text-2xl font-bold text-primary">{cycles}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-card">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              {isWorkTime ? (
                <>
                  <Timer className="w-6 h-6 text-primary" />
                  <span className="text-lg font-semibold">Tempo de Trabalho</span>
                </>
              ) : (
                <>
                  <Coffee className="w-6 h-6 text-primary" />
                  <span className="text-lg font-semibold">Tempo de Pausa</span>
                </>
              )}
            </div>

            <div className="relative w-48 h-48 mx-auto">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="hsl(var(--primary))"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPercentage / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-4xl font-mono font-bold">
                  {formatTime(timeLeft)}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Button
                onClick={toggleTimer}
                size="lg"
                className="bg-gradient-primary hover:opacity-90 transition-fast"
              >
                {isActive ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Iniciar
                  </>
                )}
              </Button>

              <Button
                onClick={resetTimer}
                variant="outline"
                size="lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reiniciar
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
