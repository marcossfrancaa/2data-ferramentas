import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShowcaseTool } from '@/lib/showcaseToolsData';

interface ToolCardProps {
  tool: ShowcaseTool;
}

const AnimatedDemo = ({ type, isHovered }: { type: string; isHovered: boolean }) => {
  switch (type) {
    case 'cpf':
      return (
        <div className="mt-3 p-2 bg-background/50 rounded text-xs font-mono">
          <span className={`transition-all duration-1000 ${isHovered ? 'opacity-100' : 'opacity-50'}`}>
            {isHovered ? '123.456.789-10' : '***.***.***-**'}
          </span>
        </div>
      );
    
    case 'qrcode':
      return (
        <div className="mt-3 flex justify-center">
          <div className={`w-12 h-12 bg-foreground rounded transition-all duration-500 ${
            isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-50'
          } relative overflow-hidden`}>
            <div className="absolute inset-1 bg-background rounded-sm">
              <div className="grid grid-cols-3 gap-px h-full">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`bg-foreground transition-all duration-300 ${
                      isHovered ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'card':
      return (
        <div className="mt-3 perspective-1000">
          <div className={`w-full h-16 relative transition-transform duration-700 transform-style-preserve-3d ${
            isHovered ? 'rotate-y-180' : ''
          }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg backface-hidden">
              <div className="p-2 text-white text-xs">
                <div>**** **** **** 1234</div>
                <div className="mt-1">12/25</div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg backface-hidden rotate-y-180">
              <div className="p-2 pt-4">
                <div className="w-full h-6 bg-black mb-2"></div>
                <div className="w-12 h-4 bg-white ml-auto mr-2"></div>
              </div>
            </div>
          </div>
        </div>
      );
    
    case 'hash':
      return (
        <div className="mt-3 p-2 bg-background/50 rounded text-xs font-mono overflow-hidden">
          <div className={`transition-all duration-1000 ${isHovered ? 'translate-x-0' : 'translate-x-full'}`}>
            a1b2c3d4e5f6...
          </div>
        </div>
      );
    
    case 'password':
      return (
        <div className="mt-3 p-2 bg-background/50 rounded text-xs font-mono">
          <span className={`transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-30'}`}>
            {isHovered ? 'K9#mP2$vX8!qL' : '•••••••••••••'}
          </span>
        </div>
      );
    
    case 'json':
      return (
        <div className="mt-3 p-2 bg-background/50 rounded text-xs font-mono">
          <div className={`transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-50'}`}>
            {isHovered ? '{\n  "key": "value"\n}' : '{ ... }'}
          </div>
        </div>
      );
    
    case 'color':
      return (
        <div className="mt-3 flex gap-1 justify-center">
          {['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-500'].map((color, i) => (
            <div 
              key={i}
              className={`w-6 h-6 ${color} rounded transition-all duration-300 ${
                isHovered ? 'scale-110 opacity-100' : 'scale-75 opacity-50'
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      );
    
    case 'calculator':
      return (
        <div className="mt-3 p-2 bg-background/50 rounded text-xs text-center">
          <div className={`transition-all duration-500 ${isHovered ? 'opacity-100' : 'opacity-50'}`}>
            {isHovered ? '2 + 2 = 4' : '0'}
          </div>
        </div>
      );
    
    default:
      return null;
  }
};

export const ToolCard = ({ tool }: ToolCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={tool.link} className="block">
      <Card 
        className="spacing-md hover-lift cursor-pointer group bg-gradient-card border-border/50 h-full overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start gap-3 mb-3">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${tool.color} transition-all duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}>
            <tool.icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <Badge variant="outline" className="text-xs mb-2 border-primary/20 text-primary/70">
              {tool.category}
            </Badge>
            <h3 className="font-semibold text-card-foreground text-sm group-hover:text-primary transition-colors">
              {tool.title}
            </h3>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {tool.description}
        </p>
        
        <AnimatedDemo type={tool.animationType} isHovered={isHovered} />
      </Card>
    </Link>
  );
};