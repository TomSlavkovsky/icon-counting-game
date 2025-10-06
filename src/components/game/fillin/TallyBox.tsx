import { FillInColor } from './types';
import { Plus, Undo2, X } from 'lucide-react';

interface TallyBoxProps {
  color: FillInColor | 'uncolored';
  currentTally: number;
  prefilled: boolean;
  onAdd: () => void;
  onUndo: () => void;
  onClear: () => void;
  showMismatch?: boolean;
}

const COLOR_MAP = {
  blue: 'bg-game-blue border-game-blue',
  red: 'bg-game-red border-game-red',
  yellow: 'bg-game-yellow border-game-yellow',
  green: 'bg-green-500 border-green-500',
  purple: 'bg-purple-500 border-purple-500',
  uncolored: 'bg-muted border-muted-foreground',
};

const renderTallyMarks = (count: number) => {
  const groups = Math.floor(count / 5);
  const remainder = count % 5;
  const marks: JSX.Element[] = [];

  // Render groups of 5 (crossed)
  for (let i = 0; i < groups; i++) {
    marks.push(
      <div key={`group-${i}`} className="relative inline-block mx-1">
        <span className="text-3xl font-bold">||||</span>
        <span className="absolute top-1/2 left-0 text-3xl font-bold" style={{ transform: 'rotate(-45deg) translateY(-50%)' }}>|</span>
      </div>
    );
  }

  // Render remainder
  if (remainder > 0) {
    marks.push(
      <span key="remainder" className="text-3xl font-bold mx-1">
        {'|'.repeat(remainder)}
      </span>
    );
  }

  return marks.length > 0 ? marks : <span className="text-muted-foreground text-2xl">—</span>;
};

export const TallyBox = ({
  color,
  currentTally,
  prefilled,
  onAdd,
  onUndo,
  onClear,
  showMismatch,
}: TallyBoxProps) => {
  const colorClass = COLOR_MAP[color];
  const borderClass = showMismatch ? 'border-4 border-red-500 animate-wiggle' : 'border-2';

  return (
    <div className={`flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-soft ${borderClass} transition-all`}>
      {/* Color indicator */}
      <div className={`w-12 h-12 rounded-full ${colorClass} border-4`} />
      
      {/* Tally display */}
      <div className="min-h-[60px] flex items-center justify-center px-4 py-2 bg-background rounded-xl min-w-[120px]">
        {renderTallyMarks(currentTally)}
      </div>

      {/* Controls */}
      {!prefilled && (
        <div className="flex gap-2">
          <button
            onClick={onAdd}
            className="p-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-playful transition-all active:scale-95"
            aria-label="Add tally mark"
          >
            <Plus size={24} />
          </button>
          <button
            onClick={onUndo}
            disabled={currentTally === 0}
            className="p-3 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl shadow-playful transition-all active:scale-95 disabled:opacity-50"
            aria-label="Remove tally mark"
          >
            <Undo2 size={24} />
          </button>
          <button
            onClick={onClear}
            disabled={currentTally === 0}
            className="p-3 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-xl shadow-playful transition-all active:scale-95 disabled:opacity-50"
            aria-label="Clear tallies"
          >
            <X size={24} />
          </button>
        </div>
      )}
      
      {prefilled && (
        <div className="text-sm text-muted-foreground">Prefilled</div>
      )}
    </div>
  );
};
