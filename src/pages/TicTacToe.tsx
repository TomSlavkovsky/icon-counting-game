import { useState, useEffect } from 'react';
import { GameLayout } from '@/components/game/GameLayout';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { SuccessAnimation } from '@/components/game/SuccessAnimation';

type Player = 'player' | 'computer' | null;
type Board = Player[];

// Syllables for random selection
const SYLLABLES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'w', 'y', 'z'];

// Generate winning combinations for 5x5 grid (4 in a row)
const generateWinningCombinations = () => {
  const combinations: number[][] = [];
  
  // Rows
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col <= 1; col++) {
      combinations.push([
        row * 5 + col,
        row * 5 + col + 1,
        row * 5 + col + 2,
        row * 5 + col + 3
      ]);
    }
  }
  
  // Columns
  for (let col = 0; col < 5; col++) {
    for (let row = 0; row <= 1; row++) {
      combinations.push([
        row * 5 + col,
        (row + 1) * 5 + col,
        (row + 2) * 5 + col,
        (row + 3) * 5 + col
      ]);
    }
  }
  
  // Diagonals (top-left to bottom-right)
  for (let row = 0; row <= 1; row++) {
    for (let col = 0; col <= 1; col++) {
      combinations.push([
        row * 5 + col,
        (row + 1) * 5 + col + 1,
        (row + 2) * 5 + col + 2,
        (row + 3) * 5 + col + 3
      ]);
    }
  }
  
  // Diagonals (top-right to bottom-left)
  for (let row = 0; row <= 1; row++) {
    for (let col = 3; col < 5; col++) {
      combinations.push([
        row * 5 + col,
        (row + 1) * 5 + col - 1,
        (row + 2) * 5 + col - 2,
        (row + 3) * 5 + col - 3
      ]);
    }
  }
  
  return combinations;
};

const WINNING_COMBINATIONS = generateWinningCombinations();

const TicTacToe = () => {
  const { soundEnabled, setSoundEnabled } = useSettings();
  const [board, setBoard] = useState<Board>(Array(25).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Generate random syllables for each game
  const [playerSymbol, setPlayerSymbol] = useState('');
  const [computerSymbol, setComputerSymbol] = useState('');
  const [useUpperCase, setUseUpperCase] = useState(false);

  const generateSymbols = () => {
    const shuffled = [...SYLLABLES].sort(() => Math.random() - 0.5);
    const upper = Math.random() > 0.5;
    setUseUpperCase(upper);
    setPlayerSymbol(upper ? shuffled[0].toUpperCase() : shuffled[0]);
    setComputerSymbol(upper ? shuffled[1].toUpperCase() : shuffled[1]);
  };

  useEffect(() => {
    generateSymbols();
  }, []);

  const checkWinner = (currentBoard: Board): Player | 'draw' | null => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c, d] = combo;
      if (currentBoard[a] && 
          currentBoard[a] === currentBoard[b] && 
          currentBoard[a] === currentBoard[c] && 
          currentBoard[a] === currentBoard[d]) {
        return currentBoard[a];
      }
    }
    if (currentBoard.every(cell => cell !== null)) {
      return 'draw';
    }
    return null;
  };

  const getComputerMove = (currentBoard: Board): number => {
    // Try to win
    for (let i = 0; i < 25; i++) {
      if (currentBoard[i] === null) {
        const testBoard = [...currentBoard];
        testBoard[i] = 'computer';
        if (checkWinner(testBoard) === 'computer') return i;
      }
    }

    // Block player from winning
    for (let i = 0; i < 25; i++) {
      if (currentBoard[i] === null) {
        const testBoard = [...currentBoard];
        testBoard[i] = 'player';
        if (checkWinner(testBoard) === 'player') return i;
      }
    }

    // Take center if available
    if (currentBoard[12] === null) return 12;

    // Take a corner
    const corners = [0, 4, 20, 24];
    const availableCorners = corners.filter(i => currentBoard[i] === null);
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Take any available space
    const available = currentBoard.map((cell, i) => cell === null ? i : -1).filter(i => i !== -1);
    return available[Math.floor(Math.random() * available.length)];
  };

  useEffect(() => {
    if (!isPlayerTurn && winner === null) {
      const timer = setTimeout(() => {
        const move = getComputerMove(board);
        const newBoard = [...board];
        newBoard[move] = 'computer';
        setBoard(newBoard);
        
        const gameWinner = checkWinner(newBoard);
        if (gameWinner) {
          setWinner(gameWinner);
          if (gameWinner === 'player') {
            setScore(s => s + 1);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
          }
        } else {
          setIsPlayerTurn(true);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isPlayerTurn, winner, board]);

  const handleCellClick = (index: number) => {
    if (board[index] || winner || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'player';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === 'player') {
        setScore(s => s + 1);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } else {
      setIsPlayerTurn(false);
    }
  };

  const handleReset = () => {
    setBoard(Array(25).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
    generateSymbols();
  };

  const getCellColor = (cell: Player) => {
    if (cell === 'player') return 'text-game-blue';
    if (cell === 'computer') return 'text-game-red';
    return '';
  };

  const getCellText = (cell: Player) => {
    if (cell === 'player') return playerSymbol;
    if (cell === 'computer') return computerSymbol;
    return '';
  };

  return (
    <GameLayout
      score={score}
      muted={!soundEnabled}
      onToggleMute={() => setSoundEnabled(!soundEnabled)}
      onReset={handleReset}
    >
      <SuccessAnimation show={showSuccess} showTada={true} />

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-bold mb-2">Piškvorky 5×5</h1>
            <p className="text-lg text-muted-foreground mb-2">
              {winner === 'player' && 'Vyhráli jste! 🎉'}
              {winner === 'computer' && 'Počítač vyhrál! 💻'}
              {winner === 'draw' && 'Remíza! 🤝'}
              {!winner && (isPlayerTurn ? `Vaše tah (${playerSymbol})` : `Tah počítače (${computerSymbol})...`)}
            </p>
            <p className="text-sm text-muted-foreground">
              Cíl: Získejte 4 v řadě
            </p>
          </div>

          <div className="grid grid-cols-5 gap-2 bg-card p-4 rounded-3xl shadow-2xl max-w-xl">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={!isPlayerTurn || !!cell || !!winner}
                className={`
                  w-16 h-16 sm:w-20 sm:h-20
                  bg-background 
                  rounded-xl 
                  flex items-center justify-center
                  text-4xl sm:text-5xl font-abeezee font-bold
                  transition-all duration-200
                  hover:scale-105 active:scale-95
                  disabled:cursor-not-allowed
                  ${getCellColor(cell)}
                  ${!cell && isPlayerTurn && !winner ? 'hover:bg-accent' : ''}
                `}
                aria-label={`Cell ${index + 1}, ${getCellText(cell) || 'empty'}`}
              >
                {getCellText(cell)}
              </button>
            ))}
          </div>

          {winner && (
            <Button
              onClick={handleReset}
              className="mt-6 h-14 px-8 bg-game-yellow hover:bg-game-yellow/90 text-foreground rounded-2xl shadow-playful text-lg font-semibold"
            >
              Nová hra
            </Button>
          )}
        </div>
      </div>
    </GameLayout>
  );
};

export default TicTacToe;
