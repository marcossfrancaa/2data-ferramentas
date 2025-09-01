import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FlipCardProps {
  frontCard: React.ReactNode;
  backCard: React.ReactNode;
}

export const FlipCard = ({ frontCard, backCard }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative mb-16">
      <div className={`flip-card ${isFlipped ? 'is-flipped' : ''}`}>
        <div className="flip-card-inner">
          <div className="flip-card-front">
            {frontCard}
          </div>
          <div className="flip-card-back">
            {backCard}
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Virar Cartão
        </Button>
      </div>

      <style>{`
        .flip-card {
          background-color: transparent;
          width: 320px;
          height: 192px;
          perspective: 1000px;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          height: 100%;
          text-align: center;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .flip-card.is-flipped .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};