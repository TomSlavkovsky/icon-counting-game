import { useState, useEffect } from 'react';
import { GameHeader } from '@/components/game/GameHeader';
import { SuccessAnimation } from '@/components/game/SuccessAnimation';
import { SudokuBoard } from '@/components/game/sudoku/SudokuBoard';
import { SymbolPalette } from '@/components/game/sudoku/SymbolPalette';
import { SudokuSettings } from '@/components/game/sudoku/SudokuSettings';
import { generatePuzzle } from '@/components/game/sudoku/sudokuGenerator';
import { validateBoard, isComplete, findHint, updateAllPencilMarks } from '@/components/game/sudoku/sudokuSolver';
import { GameState, SudokuSymbol, SudokuBoard as BoardType, HintResult, SymbolMode, Difficulty } from '@/components/game/sudoku/types';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Lightbulb, Eraser, Settings } from 'lucide-react';
import { toast } from 'sonner';

const SudokuGame = () => {
  const { soundEnabled, setSoundEnabled } = useSettings();
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hintCell, setHintCell] = useState<HintResult | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<SudokuSymbol | null>(null);
  
  const [symbolMode, setSymbolMode] = useState<SymbolMode>('shapes');
  const [difficulty, setDifficulty] = useState<Difficulty>('starter');
  const [errorHighlights] = useState(true);
  const [pencilMarksEnabled] = useState(true);
  
  const [gameState, setGameState] = useState<GameState>(() => {
    const board = generatePuzzle(difficulty);
    updateAllPencilMarks(board);
    return {
      board,
      history: [JSON.parse(JSON.stringify(board))],
      historyIndex: 0,
      selectedCell: null,
      isComplete: false,
      errors: new Set(),
    };
  });

  const newGame = () => {
    const board = generatePuzzle(difficulty);
    updateAllPencilMarks(board);
    setGameState({
      board,
      history: [JSON.parse(JSON.stringify(board))],
      historyIndex: 0,
      selectedCell: null,
      isComplete: false,
      errors: new Set(),
    });
    setHintCell(null);
    setShowSuccess(false);
    setSelectedSymbol(null);
  };

  const resetGame = () => {
    setGameState((prev) => {
      const initialBoard = JSON.parse(JSON.stringify(prev.history[0]));
      return {
        ...prev,
        board: initialBoard,
        history: [initialBoard],
        historyIndex: 0,
        selectedCell: null,
        isComplete: false,
        errors: new Set(),
      };
    });
    setHintCell(null);
    setShowSuccess(false);
    setSelectedSymbol(null);
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameState.board.cells[row][col].isGiven) return;
    
    // If we have a selected symbol, try to place it
    if (selectedSymbol !== null) {
      setValue(selectedSymbol, row, col);
      setSelectedSymbol(null);
      return;
    }
    
    // Otherwise, just select the cell
    setGameState((prev) => ({ ...prev, selectedCell: { row, col } }));
    setHintCell(null);
  };

  const handleSymbolSelect = (symbol: SudokuSymbol) => {
    if (gameState.selectedCell) {
      // Cell already selected, place symbol
      const { row, col } = gameState.selectedCell;
      if (!gameState.board.cells[row][col].isGiven) {
        setValue(symbol, row, col);
      }
      setSelectedSymbol(null);
    } else {
      // No cell selected, just select the symbol
      setSelectedSymbol(symbol);
    }
  };

  const setValue = (value: SudokuSymbol, targetRow?: number, targetCol?: number) => {
    const row = targetRow ?? gameState.selectedCell?.row;
    const col = targetCol ?? gameState.selectedCell?.col;
    
    if (row === undefined || col === undefined) return;
    if (gameState.board.cells[row][col].isGiven) return;
    
    const newBoard = JSON.parse(JSON.stringify(gameState.board));
    newBoard.cells[row][col].value = value;
    updateAllPencilMarks(newBoard);
    
    const newHistory = gameState.history.slice(0, gameState.historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newBoard)));
    
    setGameState((prev) => ({
      ...prev,
      board: newBoard,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      errors: errorHighlights ? validateBoard(newBoard) : new Set(),
      selectedCell: null,
    }));
    
    setSelectedSymbol(null);
    
    if (isComplete(newBoard)) {
      setShowSuccess(true);
      setScore((prev) => prev + 1);
      setTimeout(() => {
        newGame();
      }, 600);
    }
  };

  const clearCell = () => {
    if (!gameState.selectedCell) {
      if (window.confirm('Clear the entire board? This will reset to the starting puzzle.')) {
        resetGame();
      }
      return;
    }
    setValue(0);
  };


  const handleHint = () => {
    if (hintCell) {
      setValue(hintCell.value, hintCell.row, hintCell.col);
      setHintCell(null);
      toast.success('Hint applied!');
    } else {
      const hint = findHint(gameState.board, difficulty);
      if (hint) {
        setHintCell(hint);
        setGameState((prev) => ({ ...prev, selectedCell: { row: hint.row, col: hint.col } }));
        toast.info(hint.reason);
      } else {
        toast.error('No hint available');
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center p-4 pb-8">
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <GameHeader
          score={score}
          muted={!soundEnabled}
          onToggleMute={() => setSoundEnabled(!soundEnabled)}
          onReset={resetGame}
        />
        
        <div className="flex items-center gap-2">
          <Button
            onClick={handleHint}
            className="h-14 w-14 bg-game-yellow hover:bg-game-yellow/90 text-foreground rounded-2xl shadow-playful flex items-center justify-center"
            aria-label="Hint"
          >
            <Lightbulb size={28} strokeWidth={2.5} />
          </Button>
          
          <Button
            onClick={clearCell}
            className="h-14 w-14 bg-game-yellow hover:bg-game-yellow/90 text-foreground rounded-2xl shadow-playful flex items-center justify-center"
            aria-label="Clear"
          >
            <Eraser size={28} strokeWidth={2.5} />
          </Button>

          <Button
            onClick={() => setShowSettings(true)}
            className="h-14 w-14 bg-game-yellow hover:bg-game-yellow/90 text-foreground rounded-2xl shadow-playful flex items-center justify-center"
            aria-label="Settings"
          >
            <Settings size={28} strokeWidth={2.5} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6 mt-24 w-full max-w-4xl px-4">
        <SudokuBoard
          board={gameState.board}
          mode={symbolMode}
          selectedCell={gameState.selectedCell}
          errors={gameState.errors}
          showPencilMarks={pencilMarksEnabled}
          onCellClick={handleCellClick}
        />

        <SymbolPalette
          mode={symbolMode}
          board={gameState.board}
          selectedCell={gameState.selectedCell}
          selectedSymbol={selectedSymbol}
          onSelect={handleSymbolSelect}
        />
      </div>

      <SudokuSettings
        open={showSettings}
        onClose={() => setShowSettings(false)}
        symbolMode={symbolMode}
        difficulty={difficulty}
        onSymbolModeChange={(mode) => {
          setSymbolMode(mode);
          localStorage.setItem('sudoku-symbol-mode', mode);
        }}
        onDifficultyChange={(diff) => {
          setDifficulty(diff);
          localStorage.setItem('sudoku-difficulty', diff);
          newGame();
        }}
      />

      <SuccessAnimation show={showSuccess} showTada />
    </div>
  );
};

export default SudokuGame;
