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
    <div className="flex items-center justify-between mb-8">
      <Link to="/">
        <Button variant="ghost" size="icon" className="h-12 w-12" aria-label="Back to hub">
          <ArrowLeft size={24} />
        </Button>
      </Link>
      
      <ScoreCounter score={score} />
      
      <div className="flex items-center gap-2">
        <SoundToggle muted={muted} onToggle={onToggleMute} />
        {onReset && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="h-12 w-12"
            aria-label="Reset game"
          >
            <RotateCcw size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};
