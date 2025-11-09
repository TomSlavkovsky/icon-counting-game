import { Star } from 'lucide-react';
import { LEVEL_CONFIGS, loadProgress } from './numbersUtils';

interface LevelSelectorProps {
  onSelectLevel: (levelId: number) => void;
}

export const LevelSelector = ({ onSelectLevel }: LevelSelectorProps) => {
  const progress = loadProgress();

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
        Choose a Level
      </h2>
      <div className="grid grid-cols-5 gap-3 sm:gap-4">
        {LEVEL_CONFIGS.map((config) => {
          const levelProgress = progress[config.id] || { stars: 0, bestScore: 0 };
          const isLocked = config.locked;

          return (
            <button
              key={config.id}
              onClick={() => !isLocked && onSelectLevel(config.id)}
              disabled={isLocked}
              className={`
                aspect-square rounded-xl p-3 flex flex-col items-center justify-between
                transition-all duration-200 shadow-soft
                ${
                  isLocked
                    ? 'bg-muted/50 cursor-not-allowed opacity-50'
                    : 'bg-card hover:bg-card/80 active:scale-95 cursor-pointer hover:shadow-lg'
                }
              `}
            >
              <span className={`text-2xl font-bold ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                {config.id}
              </span>
              <div className="flex gap-0.5">
                {[1, 2, 3].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={`
                      ${star <= levelProgress.stars
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-muted-foreground/30'
                      }
                    `}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
