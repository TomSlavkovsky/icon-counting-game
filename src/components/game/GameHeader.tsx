import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScoreCounter } from './ScoreCounter';
import { SoundToggle } from './SoundToggle';

interface GameHeaderProps {
  score: number;
  muted: boolean;
  onToggleMute: () => void;
  onReset?: () => void;
}

export const GameHeader = ({ score, muted, onToggleMute, onReset }: GameHeaderProps) => {
  return (
    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
      <Link to="/">
        <Button variant="ghost" size="icon" className="h-14 w-14" aria-label="Back to hub">
          <ArrowLeft size={28} />
        </Button>
      </Link>
      
      <div className="flex items-center gap-2">
        <SoundToggle muted={muted} onToggle={onToggleMute} />
        {onReset && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="h-14 w-14 bg-game-yellow hover:bg-game-yellow/90 text-foreground rounded-2xl shadow-playful"
            aria-label="Reset game"
          >
            <RotateCcw size={24} />
          </Button>
        )}
      </div>
    </div>
  );
};
