import { FillInColor } from './types';

interface TallyBoxProps {
  color: FillInColor | 'uncolored';
  currentTally: number;
  prefilled: boolean;
  showMismatch?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const COLOR_MAP = {
  blue: { bg: 'bg-game-blue', border: 'border-game-blue', active: 'border-game-blue' },
  red: { bg: 'bg-game-red', border: 'border-game-red', active: 'border-game-red' },
  yellow: { bg: 'bg-game-yellow', border: 'border-game-yellow', active: 'border-game-yellow' },
  green: { bg: 'bg-green-500', border: 'border-green-500', active: 'border-green-500' },
  purple: { bg: 'bg-purple-500', border: 'border-purple-500', active: 'border-purple-500' },
  uncolored: { bg: 'bg-muted', border: 'border-muted-foreground', active: 'border-muted-foreground' },
};

const renderTallyMarks = (count: number) => {
  if (count === 0) {
    return <span className="text-muted-foreground text-2xl">—</span>;
  }

  const groups = Math.floor(count / 5);
  const remainder = count % 5;
  const marks: JSX.Element[] = [];

  // Render groups of 5 (crossed) using SVG for proper rendering
  for (let i = 0; i < groups; i++) {
    marks.push(
      <svg key={`group-${i}`} width="42" height="36" viewBox="0 0 42 36" className="inline-block mx-1">
        <line x1="5" y1="8" x2="5" y2="28" stroke="currentColor" strokeWidth="3" />
        <line x1="12" y1="8" x2="12" y2="28" stroke="currentColor" strokeWidth="3" />
        <line x1="19" y1="8" x2="19" y2="28" stroke="currentColor" strokeWidth="3" />
        <line x1="26" y1="8" x2="26" y2="28" stroke="currentColor" strokeWidth="3" />
        <line x1="33" y1="8" x2="33" y2="28" stroke="currentColor" strokeWidth="3" />
        <line x1="2" y1="20" x2="36" y2="12" stroke="currentColor" strokeWidth="3" />
      </svg>
    );
  }

  // Render remainder - use SVG for consistent spacing (7px between marks)
  if (remainder > 0) {
    marks.push(
      <svg key="remainder" width={remainder * 7 + 6} height="36" viewBox={`0 0 ${remainder * 7 + 6} 36`} className="inline-block mx-1">
        {Array.from({ length: remainder }).map((_, i) => (
          <line key={i} x1={6 + i * 7} y1="8" x2={6 + i * 7} y2="28" stroke="currentColor" strokeWidth="3" />
        ))}
      </svg>
    );
  }

  return marks;
};

export const TallyBox = ({
  color,
  currentTally,
  prefilled,
  showMismatch,
  isActive,
  onClick,
}: TallyBoxProps) => {
  const colorClasses = COLOR_MAP[color];
  const borderClass = showMismatch 
    ? 'border-4 border-red-500 animate-wiggle' 
    : isActive 
    ? `border-4 ${colorClasses.active}` 
    : 'border-2 border-border';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 bg-card rounded-2xl shadow-soft ${borderClass} transition-all cursor-pointer hover:scale-105 active:scale-95`}
      aria-label={`Select ${color} color`}
      aria-pressed={isActive}
    >
      {/* Color indicator - smaller width */}
      <div className={`w-5 h-10 rounded-full ${colorClasses.bg} ${colorClasses.border} border-2`} />
      
      {/* Tally display - restored height */}
      <div className="min-h-[60px] flex items-center justify-center px-3 py-2 bg-background rounded-xl min-w-[100px]">
        {renderTallyMarks(currentTally)}
      </div>
    </button>
  );
};
