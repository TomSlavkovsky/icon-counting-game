import { useState, useEffect } from 'react';
import { Eraser, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { generateTask, checkAnswer } from '@/components/game/addition/additionUtils';
import { AdditionTask, AdditionObject } from '@/components/game/addition/types';
import { AdditionTallyBox } from '@/components/game/addition/AdditionTallyBox';
import { AdditionObjectBox } from '@/components/game/addition/AdditionObjectBox';
import { SuccessAnimation } from '@/components/game/SuccessAnimation';
import { GameLayout } from '@/components/game/GameLayout';
import { useGameSuccess } from '@/hooks/useGameSuccess';

const AdditionGame = () => {
  const { maxNumber, soundEnabled, teacherMode, objectSets } = useSettings();
  
  const [additionBoxCount] = useState(2);
  const [additionAllowZero] = useState(false);
  const [exerciseType] = useState<'sum-by-tallies' | 'find-missing-box'>('sum-by-tallies');
  
  const [task, setTask] = useState<AdditionTask | null>(null);
  const [score, setScore] = useState(0);
  const [muted, setMuted] = useState(!soundEnabled);
  const [showMismatch, setShowMismatch] = useState(false);
  const [mismatchedBoxIndex, setMismatchedBoxIndex] = useState<number | undefined>();

  useEffect(() => {
    setMuted(!soundEnabled);
  }, [soundEnabled]);

  const generateNewTask = () => {
    const objectType = objectSets[Math.floor(Math.random() * objectSets.length)];
    const newTask = generateTask(exerciseType, additionBoxCount, maxNumber, objectType, additionAllowZero);
    setTask(newTask);
    setShowMismatch(false);
    setMismatchedBoxIndex(undefined);
  };
  
  const { showSuccess, triggerSuccess, triggerError } = useGameSuccess({
    onSuccess: generateNewTask,
  });

  useEffect(() => {
    generateNewTask();
  }, [maxNumber, additionBoxCount, exerciseType, additionAllowZero, objectSets]);

  const handleTallyTap = () => {
    if (!task) return;
    setTask({ ...task, userTallies: task.userTallies + 1 });
  };

  const handleEraser = () => {
    if (!task) return;
    
    if (task.exerciseType === 'sum-by-tallies') {
      // Remove last tally mark
      setTask({ ...task, userTallies: Math.max(0, task.userTallies - 1) });
    } else {
      // Remove last added object
      if (task.userAddedObjects.length > 0) {
        setTask({
          ...task,
          userAddedObjects: task.userAddedObjects.slice(0, -1),
        });
      }
    }
  };

  const handleEraserLongPress = () => {
    if (!task) return;
    
    if (task.exerciseType === 'sum-by-tallies') {
      setTask({ ...task, userTallies: 0 });
    } else {
      setTask({ ...task, userAddedObjects: [] });
    }
  };

  const handleBoxTap = (boxIndex: number) => {
    if (!task || task.exerciseType !== 'find-missing-box' || boxIndex === 0) return;
    
    // Add a new object to the user's additions
    const newObj: AdditionObject = {
      id: `user-${Date.now()}-${Math.random()}`,
      type: task.objectType,
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 70,
    };
    
    setTask({
      ...task,
      userAddedObjects: [...task.userAddedObjects, newObj],
    });
  };

  const handleCheck = () => {
    if (!task) return;

    const { correct, mismatchedBoxIndex: mismatch } = checkAnswer(task);
    
    if (correct) {
      setScore(score + 1);
      triggerSuccess();
    } else {
      triggerError();
      setShowMismatch(true);
      setMismatchedBoxIndex(mismatch);
      setTimeout(() => {
        setShowMismatch(false);
        setMismatchedBoxIndex(undefined);
      }, 1500);
    }
  };

  if (!task) return null;

  return (
    <GameLayout
      score={score}
      muted={muted}
      onToggleMute={() => setMuted(!muted)}
      onReset={generateNewTask}
      onNext={generateNewTask}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Top Boxes (Addend Boxes) */}
        <div className="flex justify-center gap-4 mb-8">
          {task.boxes.map((box, index) => (
            <div key={box.id} className="flex items-center gap-4">
              {index > 0 && (
                <div className="text-6xl font-bold text-primary">+</div>
              )}
              <div className="w-60">
                <AdditionObjectBox
                  objects={box.objects}
                  objectType={task.objectType}
                  showMismatch={mismatchedBoxIndex === index}
                  onTap={task.exerciseType === 'find-missing-box' && index > 0 ? () => handleBoxTap(index) : undefined}
                  userAddedObjects={task.exerciseType === 'find-missing-box' && index > 0 ? task.userAddedObjects : []}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Equals Sign */}
        <div className="text-6xl font-bold text-primary mb-8">=</div>

        {/* Result Box - Centered */}
        <div className="flex justify-center mb-8">
          <div className="w-60">
            {task.exerciseType === 'sum-by-tallies' ? (
              <AdditionTallyBox
                value={task.userTallies}
                showMismatch={showMismatch && mismatchedBoxIndex === -1}
                showDigits={teacherMode}
                onTap={handleTallyTap}
              />
            ) : (
              <AdditionTallyBox
                value={task.targetSum}
                showDigits={teacherMode}
              />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button
            onClick={handleEraser}
            onMouseDown={(e) => {
              const timer = setTimeout(handleEraserLongPress, 500);
              const cleanup = () => {
                clearTimeout(timer);
                document.removeEventListener('mouseup', cleanup);
              };
              document.addEventListener('mouseup', cleanup);
            }}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-xl w-14 h-14 p-0"
            aria-label="Eraser"
          >
            <Eraser size={28} />
          </Button>
          
          <Button
            onClick={handleCheck}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-12 h-14 text-lg"
            aria-label="Check answer"
          >
            <Check size={28} className="mr-2" />
            Check
          </Button>
        </div>
        </div>
      </div>

      <SuccessAnimation 
        show={showSuccess} 
        result={task.targetSum}
        showTada={true}
      />
    </GameLayout>
  );
};

export default AdditionGame;
