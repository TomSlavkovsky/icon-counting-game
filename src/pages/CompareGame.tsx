import { useState, useCallback } from 'react';
import { GameTask, ColorChoice } from '@/components/game/types';
import { GameField } from '@/components/game/GameField';
import { ColorSelector } from '@/components/game/ColorSelector';
import { GameHeader } from '@/components/game/GameHeader';
import { ScoreCounter } from '@/components/game/ScoreCounter';
import { IconButton } from '@/components/game/IconButton';
import { generateTask, checkAnswer, playSound } from '@/components/game/gameUtils';
import { useSettings } from '@/contexts/SettingsContext';

const CompareGame = () => {
  const { soundEnabled } = useSettings();
  const [task, setTask] = useState<GameTask>(() => generateTask());
  const [selectedColor, setSelectedColor] = useState<ColorChoice>('blue');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ field: 'left' | 'right'; type: 'correct' | 'incorrect' } | null>(null);

  const handleObjectClick = useCallback(
    (fieldId: 'left' | 'right', objectId: string) => {
      setTask((prevTask) => {
        const field = fieldId === 'left' ? prevTask.leftField : prevTask.rightField;
        const updatedObjects = field.objects.map((obj) => {
          if (obj.id === objectId) {
            return {
              ...obj,
              colored: !obj.colored,
              color: obj.colored ? undefined : selectedColor,
            };
          }
          return obj;
        });

        return {
          ...prevTask,
          [fieldId === 'left' ? 'leftField' : 'rightField']: {
            ...field,
            objects: updatedObjects,
          },
        };
      });
    },
    [selectedColor]
  );

  const handleAnswerClick = useCallback(
    (fieldId: 'left' | 'right', answer: 'more' | 'fewer') => {
      const isCorrect = checkAnswer(task, fieldId, answer);

      if (isCorrect) {
        setScore((prev) => prev + 1);
        playSound('correct', !soundEnabled);
        setFeedback({ field: fieldId, type: 'correct' });
        
        // Auto-advance to next task after celebration
        setTimeout(() => {
          setFeedback(null);
          setTask(generateTask());
        }, 1500);
      } else {
        playSound('incorrect', !soundEnabled);
        setFeedback({ field: fieldId, type: 'incorrect' });
        
        // Clear feedback after animation
        setTimeout(() => {
          setFeedback(null);
        }, 1000);
      }
    },
    [task, soundEnabled]
  );

  const handleNextTask = useCallback(() => {
    setTask(generateTask());
    setFeedback(null);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-8 relative">
      {/* Header with back and reset buttons */}
      <GameHeader
        score={score}
        muted={!soundEnabled}
        onToggleMute={() => {}}
        onReset={handleNextTask}
      />

      {/* Score Counter - centered at top */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <ScoreCounter score={score} />
      </div>

      <div className="w-full max-w-7xl">
        {/* Game Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <GameField
            field={task.leftField}
            onObjectClick={(objectId) => handleObjectClick('left', objectId)}
            selectedColor={selectedColor}
            showFeedback={feedback?.field === 'left' ? feedback.type : undefined}
          />
          
          {/* Central Answer Controls */}
          <div className="hidden lg:flex flex-col items-center justify-center gap-6 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
            <IconButton
              type="more"
              onClick={() => handleAnswerClick('left', 'more')}
              aria-label="Left field has more"
            />
            <IconButton
              type="fewer"
              onClick={() => handleAnswerClick('left', 'fewer')}
              aria-label="Left field has fewer"
            />
          </div>

          <GameField
            field={task.rightField}
            onObjectClick={(objectId) => handleObjectClick('right', objectId)}
            selectedColor={selectedColor}
            showFeedback={feedback?.field === 'right' ? feedback.type : undefined}
          />
        </div>

        {/* Mobile Answer Controls */}
        <div className="lg:hidden flex justify-center gap-6 mt-8">
          <IconButton
            type="more"
            onClick={() => handleAnswerClick('left', 'more')}
            aria-label="More"
          />
          <IconButton
            type="fewer"
            onClick={() => handleAnswerClick('left', 'fewer')}
            aria-label="Fewer"
          />
        </div>
      </div>

      {/* Color Selector - bottom right */}
      <div className="fixed bottom-8 right-8 z-10 animate-slide-up">
        <ColorSelector selected={selectedColor} onChange={setSelectedColor} />
      </div>
    </div>
  );
};

export default CompareGame;
