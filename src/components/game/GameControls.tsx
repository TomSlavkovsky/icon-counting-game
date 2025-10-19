import { ChevronLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScoreCounter } from '@/components/game/ScoreCounter';
import { useNavigate } from 'react-router-dom';

interface GameControlsProps {
  score: number;
  onRepeat: () => void;
}

export const GameControls = ({ score, onRepeat }: GameControlsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between mb-8">
      <Button
        onClick={() => navigate('/')}
        className="bg-game-yellow hover:bg-game-yellow/90 text-white rounded-2xl px-6 h-12"
        aria-label="Back to menu"
      >
        <ChevronLeft size={24} />
      </Button>
      
      <ScoreCounter score={score} />
      
      <Button
        onClick={onRepeat}
        className="bg-game-yellow hover:bg-game-yellow/90 text-white rounded-full w-12 h-12 p-0"
        aria-label="Repeat task"
      >
        <RotateCcw size={24} />
      </Button>
    </div>
  );
};
