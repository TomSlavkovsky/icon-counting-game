import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SkrtniTallyBoxProps {
  value: number;
  editable: boolean;
  showMismatch?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
  showDigits?: boolean;
}

const renderTallyMarks = (count: number) => {
  if (count === 0) {
    return <span className="text-muted-foreground text-2xl">—</span>;
  }

  const groups = Math.floor(count / 5);
  const remainder = count % 5;
  const marks: JSX.Element[] = [];

  for (let i = 0; i < groups; i++) {
    marks.push(
      <svg key={`group-${i}`} width="58" height="36" viewBox="0 0 58 36" className="inline-block mx-1">
        <line x1="5" y1="8" x2="5" y2="28" stroke="currentColor" strokeWidth="3" />
        <line x1="15" y1="8" x2="15" y2="28" stroke="currentColor" strokeWidth="3" />
        <line x1="25" y1="8" x2="25" y2="28" stroke="currentColor" strokeWidth="3" />
        <line x1="35" y1="8" x2="35" y2="28" stroke="currentColor" strokeWidth="3" />
        <line x1="45" y1="8" x2="45" y2="28" stroke="currentColor" strokeWidth="3" />
      </svg>
    );
  }

  if (remainder > 0) {
    marks.push(
      <svg key="remainder" width={remainder * 10 + 6} height="36" viewBox={`0 0 ${remainder * 10 + 6} 36`} className="inline-block mx-1">
        {Array.from({ length: remainder }).map((_, i) => (
          <line key={i} x1={6 + i * 10} y1="8" x2={6 + i * 10} y2="28" stroke="currentColor" strokeWidth="3" />
        ))}
      </svg>
    );
  }

  return marks;
};

export const SkrtniTallyBox = ({
  value,
  editable,
  showMismatch,
  onIncrement,
  onDecrement,
  showDigits = false,
}: SkrtniTallyBoxProps) => {
  const borderClass = showMismatch 
    ? 'border-4 border-red-500 animate-shake' 
    : 'border-2 border-border';

  return (
    <div className={`flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-soft ${borderClass} transition-all duration-300`}>
      <div className="min-h-[60px] flex items-center justify-center px-3 py-2 bg-background rounded-xl min-w-[100px]">
        {renderTallyMarks(value)}
      </div>
      
      {showDigits && (
        <div className="text-sm text-muted-foreground font-mono">{value}</div>
      )}
      
      {editable && (
        <div className="flex gap-2 mt-2">
          <Button
            onClick={onDecrement}
            disabled={value === 0}
            className="w-10 h-10 p-0 bg-secondary hover:bg-secondary/90"
            aria-label="Decrease tally"
          >
            <Minus size={20} />
          </Button>
          <Button
            onClick={onIncrement}
            className="w-10 h-10 p-0 bg-primary hover:bg-primary/90"
            aria-label="Increase tally"
          >
            <Plus size={20} />
          </Button>
        </div>
      )}
    </div>
  );
};
