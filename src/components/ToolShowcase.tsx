import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { ToolCard } from './ToolCard';
import { showcaseTools } from '@/lib/showcaseToolsData';

export const ToolShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const toolsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3
  };

  const [currentToolsPerView, setCurrentToolsPerView] = useState(toolsPerView.desktop);

  useEffect(() => {
    const updateToolsPerView = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setCurrentToolsPerView(toolsPerView.mobile);
      } else if (width < 1024) {
        setCurrentToolsPerView(toolsPerView.tablet);
      } else {
        setCurrentToolsPerView(toolsPerView.desktop);
      }
    };

    updateToolsPerView();
    window.addEventListener('resize', updateToolsPerView);
    return () => window.removeEventListener('resize', updateToolsPerView);
  }, []);

  const maxIndex = Math.max(0, showcaseTools.length - currentToolsPerView);

  useEffect(() => {
    if (isAutoPlaying && !isHovered) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlaying, isHovered, maxIndex]);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <div className="spacing-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="title-h2">Ferramentas em Destaque</h2>
          <p className="text-responsive-sm text-muted-foreground">
            Explore nossas ferramentas mais populares com demonstrações interativas
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleAutoPlay}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToPrevious}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={goToNext}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${currentIndex * (100 / currentToolsPerView)}%)`,
            gap: currentToolsPerView === 1 ? '0' : currentToolsPerView === 2 ? '1rem' : '1.5rem'
          }}
        >
          {showcaseTools.map((tool, index) => (
            <div 
              key={tool.id}
              className="flex-none"
              style={{
                width: currentToolsPerView === 1 
                  ? '100%' 
                  : currentToolsPerView === 2 
                    ? 'calc(50% - 0.5rem)' 
                    : 'calc(33.333% - 1rem)'
              }}
            >
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: maxIndex + 1 }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-primary w-6' 
                : 'bg-border hover:bg-primary/50'
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>

      <div className="text-center mt-6">
        <p className="text-xs sm:text-sm text-muted-foreground">
          {isAutoPlaying ? 'Rotação automática ativa' : 'Rotação automática pausada'} • 
          Passe o mouse sobre os cards para ver as demonstrações
        </p>
      </div>
    </div>
  );
};