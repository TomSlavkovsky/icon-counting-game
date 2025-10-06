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
  blue: 'bg-game-blue border-game-blue',
  red: 'bg-game-red border-game-red',
  yellow: 'bg-game-yellow border-game-yellow',
  green: 'bg-green-500 border-green-500',
  purple: 'bg-purple-500 border-purple-500',
  uncolored: 'bg-muted border-muted-foreground',
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
      <svg key={`group-${i}`} width="32" height="32" viewBox="0 0 32 32" className="inline-block mx-1">
        <line x1="4" y1="8" x2="4" y2="24" stroke="currentColor" strokeWidth="2" />
        <line x1="9" y1="8" x2="9" y2="24" stroke="currentColor" strokeWidth="2" />
        <line x1="14" y1="8" x2="14" y2="24" stroke="currentColor" strokeWidth="2" />
        <line x1="19" y1="8" x2="19" y2="24" stroke="currentColor" strokeWidth="2" />
        <line x1="2" y1="18" x2="26" y2="10" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }

  // Render remainder - use SVG for consistent spacing
  if (remainder > 0) {
    marks.push(
      <svg key="remainder" width={remainder * 6 + 4} height="32" viewBox={`0 0 ${remainder * 6 + 4} 32`} className="inline-block mx-1">
        {Array.from({ length: remainder }).map((_, i) => (
          <line key={i} x1={4 + i * 6} y1="8" x2={4 + i * 6} y2="24" stroke="currentColor" strokeWidth="2" />
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
  const colorClass = COLOR_MAP[color];
  const borderClass = showMismatch 
    ? 'border-4 border-red-500 animate-wiggle' 
    : isActive 
    ? 'border-4 border-foreground' 
    : 'border-2 border-border';

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 bg-card rounded-2xl shadow-soft ${borderClass} transition-all cursor-pointer hover:scale-105 active:scale-95`}
      aria-label={`Select ${color} color`}
      aria-pressed={isActive}
    >
      {/* Color indicator - smaller */}
      <div className={`w-10 h-10 rounded-full ${colorClass} border-4`} />
      
      {/* Tally display - smaller */}
      <div className="min-h-[48px] flex items-center justify-center px-3 py-1 bg-background rounded-xl min-w-[100px]">
        {renderTallyMarks(currentTally)}
      </div>
    </button>
  );
};
