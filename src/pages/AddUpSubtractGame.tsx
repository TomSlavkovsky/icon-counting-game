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

const BACKGROUND_IMAGES = ['001', '002', '003', '004'];

const getRandomBackground = (exclude?: string): string => {
  const available = BACKGROUND_IMAGES.filter(img => img !== exclude);
  return available[Math.floor(Math.random() * available.length)];
};

const AddUpSubtractGame = () => {
  const navigate = useNavigate();
  const { soundEnabled, toggleSound } = useSettings();
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevel, setCurrentLevel] = useState<number | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [earnedStars, setEarnedStars] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [backgroundImage, setBackgroundImage] = useState<string>(() => getRandomBackground());

  const handleSelectLevel = (levelId: number) => {
    console.log('numbers_game_started', { levelId });
    setCurrentLevel(levelId);
    setExercises(generateSession(levelId));
    setCurrentExerciseIndex(0);
    setStartTime(Date.now());
    setGameState('playing');
    setBackgroundImage(prev => getRandomBackground(prev));
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
    setBackgroundImage(prev => getRandomBackground(prev));
  };

  const handleReset = () => {
    if (gameState === 'playing') {
      handleBackToMenu();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
        style={{
          backgroundImage: `url(https://images-fo.b-cdn.net/b/${backgroundImage}.png)`,
          zIndex: 0,
        }}
      />
      
      {/* Overlay for better content readability */}
      <div className="absolute inset-0 bg-background/30 backdrop-blur-[2px]" style={{ zIndex: 1 }} />
      
      {/* Content */}
      <div className="relative" style={{ zIndex: 2 }}>
        <GameLayout
          score={0}
          muted={!soundEnabled}
          onToggleMute={toggleSound}
          onReset={handleReset}
          showScore={false}
          transparentBackground={true}
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
              currentIndex={currentExerciseIndex}
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
      </div>
    </div>
  );
};

export default AddUpSubtractGame;
