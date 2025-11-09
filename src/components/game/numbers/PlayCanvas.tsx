import { useState } from 'react';
import { Exercise, getOperationSymbol } from './numbersUtils';
import { SuccessAnimation } from '../SuccessAnimation';
import { ProgressIndicator } from '../ProgressIndicator';

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
      
      // Play success sound
      if (soundEnabled) {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 523;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.2);
      }

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
      
      // Play error sound
      if (soundEnabled) {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
      }

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
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto px-4 gap-8">
      <SuccessAnimation show={showSuccess} />
      
      {/* Progress Indicator */}
      <div className="w-full flex justify-center">
        <ProgressIndicator current={externalIndex + 1} total={exercises.length} />
      </div>
      
      {/* Equation Box */}
      <div key={currentIndex} className="bg-card rounded-3xl shadow-playful p-8 sm:p-12 w-full">
        <div className="text-center">
          <div className="text-6xl sm:text-8xl font-bold text-foreground flex items-center gap-4 justify-center">
            <span className="animate-in slide-in-from-left duration-500">{currentExercise.operandA}</span>
            <span className="text-primary animate-in fade-in duration-300 delay-200">{getOperationSymbol(currentExercise.operation)}</span>
            <span className="animate-in slide-in-from-right duration-500">{currentExercise.operandB}</span>
            <span className="text-primary animate-in fade-in duration-300 delay-200">=</span>
            <span className="text-muted-foreground animate-in fade-in duration-300 delay-300">?</span>
          </div>
        </div>
      </div>

      {/* Answer options (2×2 grid) */}
      <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto">
        {currentExercise.options.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrectAnswer = option === currentExercise.correctAnswer;
          const showWrong = isWrong && isSelected && !isCorrectAnswer;

          return (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
              className={`
                aspect-square rounded-2xl text-5xl font-bold
                transition-all duration-200 shadow-lg
                ${
                  showWrong
                    ? 'bg-destructive text-destructive-foreground animate-pulse'
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

      {isWrong && (
        <div className="text-xl font-semibold text-destructive animate-in fade-in text-center">
          Wrong answer
        </div>
      )}
    </div>
  );
};
