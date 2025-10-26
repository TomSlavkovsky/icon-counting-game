import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { SymbolMode, Difficulty } from './types';

interface SudokuSettingsProps {
  open: boolean;
  onClose: () => void;
  symbolMode: SymbolMode;
  difficulty: Difficulty;
  onSymbolModeChange: (mode: SymbolMode) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

export const SudokuSettings = ({
  open,
  onClose,
  symbolMode,
  difficulty,
  onSymbolModeChange,
  onDifficultyChange,
}: SudokuSettingsProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Settings</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Symbol Mode</h3>
            <div className="flex gap-3">
              <Button
                onClick={() => onSymbolModeChange('shapes')}
                className={`flex-1 h-12 rounded-xl ${
                  symbolMode === 'shapes'
                    ? 'bg-game-blue text-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                Shapes
              </Button>
              <Button
                onClick={() => onSymbolModeChange('digits')}
                className={`flex-1 h-12 rounded-xl ${
                  symbolMode === 'digits'
                    ? 'bg-game-blue text-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                Digits
              </Button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Difficulty</h3>
            <div className="flex flex-col gap-2">
              {(['starter', 'explorer', 'challenge'] as const).map((level) => (
                <Button
                  key={level}
                  onClick={() => onDifficultyChange(level)}
                  className={`h-12 rounded-xl capitalize ${
                    difficulty === level
                      ? 'bg-game-purple text-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
