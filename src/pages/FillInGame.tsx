import { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { GameHeader } from '@/components/game/GameHeader';
import { ScoreCounter } from '@/components/game/ScoreCounter';
import { ColorPalette } from '@/components/game/fillin/ColorPalette';
import { TallyBox } from '@/components/game/fillin/TallyBox';
import { FillInObject } from '@/components/game/fillin/FillInObject';
import { FillInTask, FillInColor, FillInObject as FillInObjectType } from '@/components/game/fillin/types';
import { generateTask, checkAnswer, playSound } from '@/components/game/fillin/fillInUtils';
import { Check, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FillInGame = () => {
  const { maxNumber, soundEnabled, paletteSize } = useSettings();
  const [score, setScore] = useState(0);
  const [muted, setMuted] = useState(!soundEnabled);
  const [selectedColor, setSelectedColor] = useState<FillInColor>('blue');
  const [task, setTask] = useState<FillInTask | null>(null);
  const [objects, setObjects] = useState<FillInObjectType[]>([]);
  const [tallyBoxes, setTallyBoxes] = useState<typeof task.tallyBoxes>([]);
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [mismatchedColors, setMismatchedColors] = useState<Set<string>>(new Set());
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const includeUncolored = false;
  const objectType = 'star';

  const allColors: FillInColor[] = ['blue', 'red', 'yellow', 'green', 'purple'];
  const colors = allColors.slice(0, paletteSize);

  const initializeTask = () => {
    const newTask = generateTask(maxNumber, paletteSize, includeUncolored, objectType);
    setTask(newTask);
    setObjects(newTask.objects);
    setTallyBoxes(newTask.tallyBoxes);
    setShowFeedback(null);
    setMismatchedColors(new Set());
  };

  useEffect(() => {
    initializeTask();
  }, []);

  useEffect(() => {
    setMuted(!soundEnabled);
  }, [soundEnabled]);

  const handleObjectClick = (objectId: string) => {
    setObjects((prev) => {
      const updatedObjects = prev.map((obj) =>
        obj.id === objectId
          ? { ...obj, color: obj.color === selectedColor ? null : selectedColor }
          : obj
      );
      
      // Auto-update tally count only for NON-prefilled boxes
      updateTalliesFromObjects(updatedObjects);
      
      return updatedObjects;
    });
  };

  const updateTalliesFromObjects = (currentObjects: FillInObjectType[]) => {
    const colorCounts: Record<string, number> = {
      blue: 0,
      red: 0,
      yellow: 0,
      green: 0,
      purple: 0,
      uncolored: 0,
    };

    currentObjects.forEach((obj) => {
      const colorKey = obj.color || 'uncolored';
      colorCounts[colorKey]++;
    });

    setTallyBoxes((prev) =>
      prev.map((box) => {
        // NEVER update prefilled boxes
        if (box.prefilled) return box;
        return { ...box, currentTally: colorCounts[box.color] };
      })
    );
  };

  const handleTallyBoxClick = (color: FillInColor | 'uncolored') => {
    if (color !== 'uncolored') {
      setSelectedColor(color as FillInColor);
    }
  };

  const handleCheck = () => {
    if (!task) return;

    const taskWithCurrentTallies = { ...task, tallyBoxes };
    const isCorrect = checkAnswer(taskWithCurrentTallies, objects);

    if (isCorrect) {
      setShowFeedback('correct');
      playSound('correct', muted);
      setScore((prev) => prev + 1);
      setShowSuccessAnimation(true);
      setTimeout(() => {
        setShowSuccessAnimation(false);
        initializeTask();
      }, 800);
    } else {
      setShowFeedback('incorrect');
      playSound('incorrect', muted);
      
      // Find mismatched colors
      const colorCounts: Record<string, number> = {
        blue: 0,
        red: 0,
        yellow: 0,
        green: 0,
        purple: 0,
        uncolored: 0,
      };

      objects.forEach((obj) => {
        const colorKey = obj.color || 'uncolored';
        colorCounts[colorKey]++;
      });

      const mismatched = new Set<string>();
      tallyBoxes.forEach((box) => {
        if (box.currentTally !== colorCounts[box.color]) {
          mismatched.add(box.color);
        }
      });
      
      setMismatchedColors(mismatched);
      
      setTimeout(() => {
        setShowFeedback(null);
      }, 1000);
    }
  };

  const handleNext = () => {
    initializeTask();
  };

  const handleReset = () => {
    if (task) {
      setObjects(task.objects.map(obj => ({ ...obj, color: null })));
      setTallyBoxes(task.tallyBoxes.map(box => 
        box.prefilled ? box : { ...box, currentTally: 0 }
      ));
      setShowFeedback(null);
      setMismatchedColors(new Set());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5 relative overflow-hidden">
      <GameHeader
        score={score}
        muted={muted}
        onToggleMute={() => setMuted(!muted)}
        onReset={handleReset}
      />

      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <ScoreCounter score={score} />
      </div>

      {/* Next button - top right */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={handleNext}
          className="flex items-center justify-center w-16 h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-playful"
        >
          <SkipForward size={32} strokeWidth={3} />
        </Button>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center lg:items-start justify-center">
          {/* Picture frame */}
          <div className="flex flex-col gap-4 flex-shrink-0 w-full lg:w-auto">
            <div className="relative w-full lg:w-[600px] aspect-[4/3] bg-card rounded-3xl border-8 border-primary shadow-[0_0_0_8px_hsl(var(--primary)/0.15)] transition-all duration-300">
              {objects.map((obj) => (
                <FillInObject
                  key={obj.id}
                  type={obj.type}
                  color={obj.color}
                  onClick={() => handleObjectClick(obj.id)}
                  x={obj.x}
                  y={obj.y}
                />
              ))}
            </div>

            {/* Check button */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleCheck}
                className="flex items-center justify-center w-20 h-20 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-playful"
              >
                <Check size={48} strokeWidth={3} />
              </Button>
            </div>
          </div>

          {/* Tally boxes - responsive: horizontal on mobile, vertical on desktop */}
          <div className="flex flex-row lg:flex-col gap-3 flex-shrink-0 justify-center flex-wrap lg:flex-nowrap">
            {tallyBoxes.map((box) => (
              <TallyBox
                key={box.color}
                color={box.color}
                currentTally={box.currentTally}
                prefilled={box.prefilled}
                showMismatch={mismatchedColors.has(box.color)}
                isActive={box.color === selectedColor}
                onClick={() => handleTallyBoxClick(box.color)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Success animation */}
      {showSuccessAnimation && (
        <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
          <div className="animate-trumpet-fly text-6xl">🎺</div>
        </div>
      )}
    </div>
  );
};

export default FillInGame;
