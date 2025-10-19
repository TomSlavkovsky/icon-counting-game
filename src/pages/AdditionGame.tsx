import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RotateCcw, Eraser, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { generateTask, checkAnswer, playSound } from '@/components/game/addition/additionUtils';
import { AdditionTask, AdditionObject } from '@/components/game/addition/types';
import { AdditionTallyBox } from '@/components/game/addition/AdditionTallyBox';
import { AdditionObjectBox } from '@/components/game/addition/AdditionObjectBox';
import { ScoreCounter } from '@/components/game/ScoreCounter';

const AdditionGame = () => {
  const navigate = useNavigate();
  const { maxNumber, soundEnabled, teacherMode, objectSets } = useSettings();
  
  const [additionBoxCount] = useState(2);
  const [additionAllowZero] = useState(false);
  const [exerciseType] = useState<'sum-by-tallies' | 'find-missing-box'>('sum-by-tallies');
  
  const [task, setTask] = useState<AdditionTask | null>(null);
  const [score, setScore] = useState(0);
  const [showMismatch, setShowMismatch] = useState(false);
  const [mismatchedBoxIndex, setMismatchedBoxIndex] = useState<number | undefined>();

  const generateNewTask = () => {
    const objectType = objectSets[Math.floor(Math.random() * objectSets.length)];
    const newTask = generateTask(exerciseType, additionBoxCount, maxNumber, objectType, additionAllowZero);
    setTask(newTask);
    setShowMismatch(false);
    setMismatchedBoxIndex(undefined);
  };

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
      playSound(true, soundEnabled);
      setScore(score + 1);
      setTimeout(() => {
        generateNewTask();
      }, 500);
    } else {
      playSound(false, soundEnabled);
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
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button
          onClick={() => navigate('/')}
          className="bg-game-yellow hover:bg-game-yellow/90 text-white rounded-2xl px-6 h-12"
          aria-label="Back to menu"
        >
          <ChevronLeft size={24} />
        </Button>
        
        <ScoreCounter score={score} />
        
        <Button
          onClick={generateNewTask}
          className="bg-game-yellow hover:bg-game-yellow/90 text-white rounded-full w-12 h-12 p-0"
          aria-label="Repeat task"
        >
          <RotateCcw size={24} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Top Boxes (Addend Boxes) */}
        <div className="flex justify-center gap-4 mb-4">
          {task.boxes.map((box, index) => (
            <div key={box.id} className="flex items-center gap-4">
              {index > 0 && (
                <div className="text-6xl font-bold text-primary">+</div>
              )}
              <div className="w-48">
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

        {/* Connector Lines */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-4">
            {task.boxes.map((_, index) => (
              <div key={`connector-${index}`} className="flex items-center gap-4">
                {index > 0 && <div className="w-12" />}
                <div className="w-48 flex justify-center">
                  <div className="w-0.5 h-12 bg-border" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Equals Sign */}
        <div className="text-6xl font-bold text-primary text-center mb-4">=</div>

        {/* Connector Line to Result */}
        <div className="flex justify-center mb-4">
          <div className="w-0.5 h-12 bg-border" />
        </div>

        {/* Result Box */}
        <div className="flex justify-center mb-8">
          <div className="w-64">
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
  );
};

export default AdditionGame;
