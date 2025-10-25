import { useState, useEffect } from 'react';
import { GameHeader } from '@/components/game/GameHeader';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { SuccessAnimation } from '@/components/game/SuccessAnimation';

type Player = 'X' | 'O' | null;
type Board = Player[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6] // diagonals
];

const TicTacToe = () => {
  const { soundEnabled, setSoundEnabled } = useSettings();
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const checkWinner = (currentBoard: Board): Player | 'draw' | null => {
    for (const combo of WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
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
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const testBoard = [...currentBoard];
        testBoard[i] = 'O';
        if (checkWinner(testBoard) === 'O') return i;
      }
    }

    // Block player from winning
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === null) {
        const testBoard = [...currentBoard];
        testBoard[i] = 'X';
        if (checkWinner(testBoard) === 'X') return i;
      }
    }

    // Take center if available
    if (currentBoard[4] === null) return 4;

    // Take a corner
    const corners = [0, 2, 6, 8];
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
        newBoard[move] = 'O';
        setBoard(newBoard);
        
        const gameWinner = checkWinner(newBoard);
        if (gameWinner) {
          setWinner(gameWinner);
          if (gameWinner === 'X') {
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
    newBoard[index] = 'X';
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === 'X') {
        setScore(s => s + 1);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } else {
      setIsPlayerTurn(false);
    }
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setWinner(null);
  };

  const getCellColor = (cell: Player) => {
    if (cell === 'X') return 'text-game-blue';
    if (cell === 'O') return 'text-game-red';
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <GameHeader 
        score={score}
        muted={!soundEnabled}
        onToggleMute={() => setSoundEnabled(!soundEnabled)}
        onReset={handleReset}
      />

      <SuccessAnimation show={showSuccess} showTada={true} />

      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)]">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Piškvorky</h1>
            <p className="text-lg text-muted-foreground">
              {winner === 'X' && 'Vyhráli jste! 🎉'}
              {winner === 'O' && 'Počítač vyhrál! 💻'}
              {winner === 'draw' && 'Remíza! 🤝'}
              {!winner && (isPlayerTurn ? 'Vaše tah (X)' : 'Tah počítače (O)...')}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-card p-6 rounded-3xl shadow-2xl">
            {board.map((cell, index) => (
              <button
                key={index}
                onClick={() => handleCellClick(index)}
                disabled={!isPlayerTurn || !!cell || !!winner}
                className={`
                  w-24 h-24 
                  bg-background 
                  rounded-2xl 
                  flex items-center justify-center
                  text-6xl font-bold
                  transition-all duration-200
                  hover:scale-105 active:scale-95
                  disabled:cursor-not-allowed
                  ${getCellColor(cell)}
                  ${!cell && isPlayerTurn && !winner ? 'hover:bg-accent' : ''}
                `}
                aria-label={`Cell ${index + 1}, ${cell || 'empty'}`}
              >
                {cell}
              </button>
            ))}
          </div>

          {winner && (
            <Button
              onClick={handleReset}
              className="mt-8 h-14 px-8 bg-game-yellow hover:bg-game-yellow/90 text-foreground rounded-2xl shadow-playful text-lg font-semibold"
            >
              Nová hra
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;
