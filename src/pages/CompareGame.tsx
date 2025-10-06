import { useState, useCallback } from 'react';
import { GameTask, ColorChoice } from '@/components/game/types';
import { GameField } from '@/components/game/GameField';
import { ColorSelector } from '@/components/game/ColorSelector';
import { NextTaskButton } from '@/components/game/NextTaskButton';
import { GameHeader } from '@/components/game/GameHeader';
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <GameHeader
          score={score}
          muted={!soundEnabled}
          onToggleMute={() => {}}
          onReset={handleNextTask}
        />

        {/* Color Selector */}
        <div className="flex justify-center mb-8 animate-slide-up">
          <ColorSelector selected={selectedColor} onChange={setSelectedColor} />
        </div>

        {/* Game Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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

        {/* Next Task Button */}
        <div className="flex justify-center">
          <NextTaskButton onClick={handleNextTask} />
        </div>
      </div>
    </div>
  );
};

export default CompareGame;
