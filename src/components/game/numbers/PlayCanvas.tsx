import { useState } from 'react';
import { Exercise, getOperationSymbol } from './numbersUtils';
import { SuccessAnimation } from '../SuccessAnimation';
import { ProgressIndicator } from '../ProgressIndicator';
import { playSound } from '@/lib/sounds';

interface PlayCanvasProps {
  exercises: Exercise[];
  onComplete: (score: number) => void;
  onProgressChange: (index: number) => void;
  soundEnabled: boolean;
  currentIndex: number;
}

export const PlayCanvas = ({ exercises, onComplete, onProgressChange, soundEnabled, currentIndex: externalIndex }: PlayCanvasProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);

  const currentExercise = exercises[currentIndex];

  const handleAnswer = (answer: number) => {
    const isCorrect = answer === currentExercise.correctAnswer;
    
    console.log('numbers_game_answer', {
      exerciseIndex: currentIndex,
      correct: isCorrect,
      answer,
      expected: currentExercise.correctAnswer,
    });

    setSelectedAnswer(answer);

    if (isCorrect) {
      setScore(score + 1);
      setShowSuccess(true);
      
      playSound('ok', !soundEnabled);

      setTimeout(() => {
        setShowSuccess(false);
        setSelectedAnswer(null);
        if (currentIndex < exercises.length - 1) {
          const newIndex = currentIndex + 1;
          setCurrentIndex(newIndex);
          onProgressChange(newIndex);
        } else {
          onComplete(score + 1);
        }
      }, 1000);
    } else {
      setIsWrong(true);
      
      playSound('error', !soundEnabled);

      setTimeout(() => {
        setIsWrong(false);
        setSelectedAnswer(null);
        if (currentIndex < exercises.length - 1) {
          const newIndex = currentIndex + 1;
          setCurrentIndex(newIndex);
          onProgressChange(newIndex);
        } else {
          onComplete(score);
        }
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 gap-4 md:gap-6">
      <SuccessAnimation show={showSuccess} />
      
      {/* Progress Indicator - Aligned with other controls */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2">
        <ProgressIndicator current={externalIndex + 1} total={exercises.length} />
      </div>
      
      {/* Equation Box */}
      <div key={currentIndex} className="bg-card rounded-3xl shadow-playful p-6 md:p-8 lg:p-10 w-full max-w-[min(90vw,600px)]">
        <div className="text-center">
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground flex items-center gap-2 sm:gap-3 md:gap-4 justify-center">
            <span className="animate-in slide-in-from-left duration-500">{currentExercise.operandA}</span>
            <span className="text-primary animate-in fade-in duration-300 delay-200">{getOperationSymbol(currentExercise.operation)}</span>
            <span className="animate-in slide-in-from-right duration-500">{currentExercise.operandB}</span>
            <span className="text-primary animate-in fade-in duration-300 delay-200">=</span>
            <span className={`animate-in fade-in duration-300 delay-300 ${showSuccess ? 'text-primary' : 'text-muted-foreground'}`}>
              {showSuccess ? currentExercise.correctAnswer : '?'}
            </span>
          </div>
        </div>
      </div>

      {/* Answer options (2×2 grid) */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 w-full max-w-[min(85vw,400px)] md:max-w-[min(70vw,450px)]">
        {currentExercise.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === currentExercise.correctAnswer;
          const showWrong = isWrong && isSelected && !isCorrectAnswer;
          const showCorrect = isWrong && isCorrectAnswer;

          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`
                aspect-square rounded-2xl text-3xl sm:text-4xl md:text-5xl font-bold
                transition-all duration-200 shadow-lg min-h-[80px] md:min-h-[100px]
                ${
                  showWrong
                    ? 'bg-destructive text-destructive-foreground animate-pulse'
                    : showCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-card text-foreground hover:bg-card/80 active:scale-95'
                }
                disabled:cursor-not-allowed
              `}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Fixed height container to prevent jumping */}
      <div className="h-8 flex items-center justify-center">
        {isWrong && (
          <div className="text-lg md:text-xl font-semibold text-destructive animate-in fade-in text-center">
            Wrong answer
          </div>
        )}
      </div>
    </div>
  );
};
