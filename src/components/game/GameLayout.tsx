import { ReactNode } from 'react';
import { GameHeader } from './GameHeader';
import { ScoreCounter } from './ScoreCounter';

interface GameLayoutProps {
  score: number;
  muted: boolean;
  onToggleMute: () => void;
  onReset?: () => void;
  onNext?: () => void;
  children: ReactNode;
  topRightControls?: ReactNode;
  bottomRightControls?: ReactNode;
  showScore?: boolean;
  transparentBackground?: boolean;
}

export const GameLayout = ({
  score,
  muted,
  onToggleMute,
  onReset,
  onNext,
  children,
  topRightControls,
  bottomRightControls,
  showScore = true,
  transparentBackground = false,
}: GameLayoutProps) => {
  return (
    <div className={`h-screen overflow-hidden flex flex-col items-center p-4 ${transparentBackground ? '' : 'bg-background'}`}>
      {/* Top bar with controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <GameHeader
          score={score}
          muted={muted}
          onToggleMute={onToggleMute}
          onReset={onReset}
          onNext={onNext}
        />
        
        {showScore && (
          <div className="absolute left-1/2 -translate-x-1/2">
            <ScoreCounter score={score} />
          </div>
        )}
        
        {topRightControls && (
          <div className="flex items-center gap-2">
            {topRightControls}
          </div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center w-full mt-20">
        {children}
      </div>

      {/* Bottom right floating controls */}
      {bottomRightControls && (
        <div className="absolute bottom-4 right-4 z-10">
          {bottomRightControls}
        </div>
      )}
    </div>
  );
};
