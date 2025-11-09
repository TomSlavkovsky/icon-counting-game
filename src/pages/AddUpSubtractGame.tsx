import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { GameLayout } from '@/components/game/GameLayout';
import { LevelSelector } from '@/components/game/numbers/LevelSelector';
import { PlayCanvas } from '@/components/game/numbers/PlayCanvas';
import { ResultsScreen } from '@/components/game/numbers/ResultsScreen';
import { ProgressIndicator } from '@/components/game/ProgressIndicator';
import { useSettings } from '@/contexts/SettingsContext';
import {
  generateSession,
  calculateStars,
  saveProgress,
} from '@/components/game/numbers/numbersUtils';
import type { Exercise } from '@/components/game/numbers/types';

type GameState = 'menu' | 'playing' | 'results';

const AddUpSubtractGame = () => {
  const navigate = useNavigate();
  const { soundEnabled } = useSettings();
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [earnedStars, setEarnedStars] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);

  const handleSelectLevel = (levelId: number) => {
    console.log('numbers_game_started', { levelId });
    setCurrentLevel(levelId);
    setExercises(generateSession(levelId));
    setCurrentExerciseIndex(0);
    setStartTime(Date.now());
    setGameState('playing');
  };

  const handleComplete = (score: number) => {
    const stars = calculateStars(score);
    const duration = Date.now() - startTime;
    
    console.log('numbers_game_completed', {
      levelId: currentLevel,
      score,
      stars,
      duration_ms: duration,
    });

    if (currentLevel) {
      saveProgress(currentLevel, score, stars);
    }

    setFinalScore(score);
    setEarnedStars(stars);
    setGameState('results');
  };

  const handlePlayAgain = () => {
    if (currentLevel) {
      handleSelectLevel(currentLevel);
    }
  };

  const handleBackToMenu = () => {
    setGameState('menu');
    setCurrentLevel(null);
  };

  const handleReset = () => {
    if (gameState === 'playing') {
      handleBackToMenu();
    }
  };

  return (
    <GameLayout
      score={0}
      muted={!soundEnabled}
      onToggleMute={() => {}}
      onReset={handleReset}
      showScore={false}
      topRightControls={
        <>
          {gameState === 'playing' && (
            <ProgressIndicator current={currentExerciseIndex + 1} total={exercises.length} />
          )}
          <button
            onClick={() => navigate('/')}
            className="p-4 bg-card hover:bg-card/80 rounded-full shadow-soft transition-all duration-200 active:scale-95"
            aria-label="Back to hub"
          >
            <ArrowLeft size={24} />
          </button>
        </>
      }
    >
      {gameState === 'menu' && (
        <LevelSelector onSelectLevel={handleSelectLevel} />
      )}
      
      {gameState === 'playing' && exercises.length > 0 && (
        <PlayCanvas
          exercises={exercises}
          onComplete={handleComplete}
          onProgressChange={setCurrentExerciseIndex}
          soundEnabled={soundEnabled}
        />
      )}
      
      {gameState === 'results' && (
        <ResultsScreen
          score={finalScore}
          stars={earnedStars}
          onPlayAgain={handlePlayAgain}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </GameLayout>
  );
};

export default AddUpSubtractGame;
