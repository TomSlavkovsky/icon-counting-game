import { useState, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { GameLayout } from '@/components/game/GameLayout';
import { SkrtniObject } from '@/components/game/skrtni/SkrtniObject';
import { SkrtniTallyBox } from '@/components/game/skrtni/SkrtniTallyBox';
import { SkrtniTask, SkrtniObject as SkrtniObjectType, ToolType, SkrtniColor } from '@/components/game/skrtni/types';
import { SuccessAnimation } from '@/components/game/SuccessAnimation';
import { generateTask, checkAnswer, playSound } from '@/components/game/skrtni/skrtniUtils';
import { Check, X, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SkrtniGame = () => {
  const { maxNumber, soundEnabled, skrtniBoxCount, skrtniAllowZero, skrtniEnableColoring, teacherMode } = useSettings();
  const [score, setScore] = useState(0);
  const [muted, setMuted] = useState(!soundEnabled);
  const [task, setTask] = useState<SkrtniTask | null>(null);
  const [objects, setObjects] = useState<SkrtniObjectType[]>([]);
  const [lastBoxValue, setLastBoxValue] = useState(0);
  const [activeTool, setActiveTool] = useState<ToolType>('cross');
  const [selectedColor] = useState<SkrtniColor>('blue');
  const [showFeedback, setShowFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [showMismatch, setShowMismatch] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const objectType = 'star';

  const initializeTask = () => {
    const newTask = generateTask(maxNumber, skrtniBoxCount, skrtniAllowZero, objectType);
    setTask(newTask);
    setObjects(newTask.objects);
    setLastBoxValue(0);
    setShowFeedback(null);
    setShowMismatch(false);
  };

  useEffect(() => {
    initializeTask();
  }, []);

  useEffect(() => {
    setMuted(!soundEnabled);
  }, [soundEnabled]);

  const handleObjectClick = (objectId: string) => {
    setShowMismatch(false);
    setShowFeedback(null);

    setObjects((prev) =>
      prev.map((obj) => {
        if (obj.id !== objectId) return obj;

        if (activeTool === 'cross') {
          return {
            ...obj,
            state: obj.state === 'crossed' ? 'untouched' : 'crossed',
            color: undefined,
          };
        } else {
          return {
            ...obj,
            state: obj.state === 'colored' ? 'untouched' : 'colored',
            color: obj.state === 'colored' ? undefined : selectedColor,
          };
        }
      })
    );
  };

  const handleCheck = () => {
    if (!task) return;

    const result = checkAnswer(task, objects, lastBoxValue);

    if (result.correct) {
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
      setShowMismatch(true);
      
      setTimeout(() => {
        setShowFeedback(null);
        setShowMismatch(false);
      }, 1500);
    }
  };

  const handleNext = () => {
    initializeTask();
  };

  const handleReset = () => {
    if (task) {
      setObjects(task.objects.map(obj => ({ ...obj, state: 'untouched' as const, color: undefined })));
      setLastBoxValue(0);
      setShowFeedback(null);
      setShowMismatch(false);
    }
  };

  const handleIncrement = () => {
    setLastBoxValue((prev) => prev + 1);
    setShowMismatch(false);
    setShowFeedback(null);
  };

  const handleDecrement = () => {
    setLastBoxValue((prev) => Math.max(0, prev - 1));
    setShowMismatch(false);
    setShowFeedback(null);
  };

  return (
    <GameLayout
      score={score}
      muted={muted}
      onToggleMute={() => setMuted(!muted)}
      onReset={handleReset}
      onNext={handleNext}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 items-center lg:items-start justify-center">
          <div className="flex flex-col gap-4 flex-shrink-0 w-full lg:w-auto">
            <div className="relative w-full lg:w-[600px] aspect-[4/3] bg-card rounded-3xl border-8 border-primary shadow-[0_0_0_8px_hsl(var(--primary)/0.15)] transition-all duration-300">
              {objects.map((obj) => (
                <SkrtniObject
                  key={obj.id}
                  type={obj.type}
                  state={obj.state}
                  color={obj.color}
                  onClick={() => handleObjectClick(obj.id)}
                  x={obj.x}
                  y={obj.y}
                />
              ))}
            </div>

            <div className="flex gap-4 justify-center items-center">
              <div className="flex gap-2 bg-card p-2 rounded-2xl shadow-soft">
                <Button
                  onClick={() => setActiveTool('cross')}
                  className={`flex items-center justify-center w-16 h-16 rounded-xl ${
                    activeTool === 'cross' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  }`}
                  aria-label="Cross tool"
                >
                  <X size={32} strokeWidth={2.5} />
                </Button>
                <Button
                  onClick={() => setActiveTool('color')}
                  className={`flex items-center justify-center w-16 h-16 rounded-xl ${
                    activeTool === 'color' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                  }`}
                  aria-label="Color tool"
                >
                  <Paintbrush size={32} strokeWidth={2.5} />
                </Button>
              </div>
              
              <Button
                onClick={handleCheck}
                className="flex items-center justify-center w-20 h-20 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-playful"
              >
                <Check size={48} strokeWidth={2.5} />
              </Button>
            </div>
          </div>

          <div className="flex flex-row lg:flex-col gap-3 flex-shrink-0 justify-center flex-wrap lg:flex-nowrap">
            {task?.tallyBoxes.map((box) => (
              <SkrtniTallyBox
                key={box.id}
                value={box.editable ? lastBoxValue : box.value}
                editable={box.editable}
                showMismatch={showMismatch && box.editable}
                onIncrement={box.editable ? handleIncrement : undefined}
                onDecrement={box.editable ? handleDecrement : undefined}
                showDigits={teacherMode}
              />
            ))}
          </div>
        </div>
      </div>

      <SuccessAnimation show={showSuccessAnimation} />
    </GameLayout>
  );
};

export default SkrtniGame;
