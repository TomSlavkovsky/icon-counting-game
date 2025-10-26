import { useState, useCallback } from 'react';
import { GameTask, ColorChoice } from '@/components/game/types';
import { GameField } from '@/components/game/GameField';
import { ColorSelector } from '@/components/game/ColorSelector';
import { GameLayout } from '@/components/game/GameLayout';
import { generateTask, checkAnswer, playSound } from '@/components/game/gameUtils';
import { useSettings } from '@/contexts/SettingsContext';

const CompareGame = () => {
  const { soundEnabled, setSoundEnabled } = useSettings();
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
    <GameLayout
      score={score}
      muted={!soundEnabled}
      onToggleMute={() => setSoundEnabled(!soundEnabled)}
      onReset={handleNextTask}
      bottomRightControls={<ColorSelector selected={selectedColor} onChange={setSelectedColor} />}
    >
      <div className="w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 items-start">
          <GameField
            field={task.leftField}
            onObjectClick={(objectId) => handleObjectClick('left', objectId)}
            onAnswerClick={(answer) => handleAnswerClick('left', answer)}
            selectedColor={selectedColor}
            showFeedback={feedback?.field === 'left' ? feedback.type : undefined}
          />

          <GameField
            field={task.rightField}
            onObjectClick={(objectId) => handleObjectClick('right', objectId)}
            onAnswerClick={(answer) => handleAnswerClick('right', answer)}
            selectedColor={selectedColor}
            showFeedback={feedback?.field === 'right' ? feedback.type : undefined}
          />
        </div>
      </div>
    </GameLayout>
  );
};

export default CompareGame;
