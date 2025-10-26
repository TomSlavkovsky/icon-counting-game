import { useState, useEffect } from 'react';
import { GameHeader } from '@/components/game/GameHeader';
import { SuccessAnimation } from '@/components/game/SuccessAnimation';
import { SudokuBoard } from '@/components/game/sudoku/SudokuBoard';
import { SymbolPalette } from '@/components/game/sudoku/SymbolPalette';
import { generatePuzzle } from '@/components/game/sudoku/sudokuGenerator';
import { validateBoard, isComplete, findHint, updateAllPencilMarks } from '@/components/game/sudoku/sudokuSolver';
import { GameState, SudokuSymbol, SudokuBoard as BoardType, HintResult } from '@/components/game/sudoku/types';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { Lightbulb, Undo2, Redo2, Check, Eraser } from 'lucide-react';
import { toast } from 'sonner';

const SudokuGame = () => {
  const { soundEnabled, setSoundEnabled } = useSettings();
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [hintCell, setHintCell] = useState<HintResult | null>(null);
  
  // Settings from context (we'll add these to SettingsContext)
  const [symbolMode, setSymbolMode] = useState<'shapes' | 'digits'>('shapes');
  const [difficulty, setDifficulty] = useState<'starter' | 'explorer' | 'challenge'>('starter');
  const [errorHighlights, setErrorHighlights] = useState(true);
  const [pencilMarksEnabled, setPencilMarksEnabled] = useState(true);
  
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
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameState.board.cells[row][col].isGiven) return;
    
    if (gameState.selectedCell?.row === row && gameState.selectedCell?.col === col) {
      setGameState((prev) => ({ ...prev, selectedCell: null }));
      setShowPalette(false);
    } else {
      setGameState((prev) => ({ ...prev, selectedCell: { row, col } }));
      setShowPalette(true);
    }
    setHintCell(null);
  };

  const setValue = (value: SudokuSymbol) => {
    if (!gameState.selectedCell) return;
    
    const { row, col } = gameState.selectedCell;
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
    }));
    
    if (isComplete(newBoard)) {
      setShowSuccess(true);
      setScore((prev) => prev + 1);
      setTimeout(() => {
        newGame();
      }, 2000);
    }
  };

  const clearCell = () => {
    if (!gameState.selectedCell) {
      toast.error('Select a cell first');
      return;
    }
    setValue(0);
  };

  const undo = () => {
    if (gameState.historyIndex > 0) {
      const newIndex = gameState.historyIndex - 1;
      const newBoard = JSON.parse(JSON.stringify(gameState.history[newIndex]));
      setGameState((prev) => ({
        ...prev,
        board: newBoard,
        historyIndex: newIndex,
        errors: errorHighlights ? validateBoard(newBoard) : new Set(),
      }));
    }
  };

  const redo = () => {
    if (gameState.historyIndex < gameState.history.length - 1) {
      const newIndex = gameState.historyIndex + 1;
      const newBoard = JSON.parse(JSON.stringify(gameState.history[newIndex]));
      setGameState((prev) => ({
        ...prev,
        board: newBoard,
        historyIndex: newIndex,
        errors: errorHighlights ? validateBoard(newBoard) : new Set(),
      }));
    }
  };

  const handleHint = () => {
    if (hintCell) {
      // Second tap: fill the hint
      setValue(hintCell.value);
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

  const checkBoard = () => {
    const errors = validateBoard(gameState.board);
    if (errors.size === 0) {
      toast.success('No errors found!');
    } else {
      toast.error(`Found ${errors.size} error(s)`);
    }
    if (errorHighlights) {
      setGameState((prev) => ({ ...prev, errors }));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <GameHeader
        score={score}
        muted={!soundEnabled}
        onToggleMute={() => setSoundEnabled(!soundEnabled)}
        onReset={resetGame}
      />

      <div className="flex flex-col items-center gap-6 mt-20">
        <h1 className="text-4xl font-bold text-primary">Mini Sudoku</h1>
        
        <SudokuBoard
          board={gameState.board}
          mode={symbolMode}
          selectedCell={gameState.selectedCell}
          errors={gameState.errors}
          showPencilMarks={pencilMarksEnabled}
          onCellClick={handleCellClick}
        />

        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            onClick={handleHint}
            className="h-14 px-6 bg-game-yellow hover:bg-game-yellow/90 text-foreground rounded-2xl shadow-playful"
          >
            <Lightbulb size={24} />
            Hint
          </Button>
          
          <Button
            onClick={clearCell}
            className="h-14 px-6 bg-game-red hover:bg-game-red/90 text-foreground rounded-2xl shadow-playful"
          >
            <Eraser size={24} />
            Clear
          </Button>

          <Button
            onClick={undo}
            disabled={gameState.historyIndex === 0}
            className="h-14 w-14 bg-card hover:bg-accent rounded-2xl shadow-soft"
          >
            <Undo2 size={24} />
          </Button>

          <Button
            onClick={redo}
            disabled={gameState.historyIndex === gameState.history.length - 1}
            className="h-14 w-14 bg-card hover:bg-accent rounded-2xl shadow-soft"
          >
            <Redo2 size={24} />
          </Button>

          <Button
            onClick={checkBoard}
            className="h-14 px-6 bg-game-blue hover:bg-game-blue/90 text-foreground rounded-2xl shadow-playful"
          >
            <Check size={24} />
            Check
          </Button>

          <Button
            onClick={newGame}
            className="h-14 px-6 bg-game-purple hover:bg-game-purple/90 text-foreground rounded-2xl shadow-playful"
          >
            New Puzzle
          </Button>
        </div>

        <div className="flex gap-3 mt-2">
          <Button
            onClick={() => setSymbolMode(symbolMode === 'shapes' ? 'digits' : 'shapes')}
            variant="outline"
            className="rounded-xl"
          >
            {symbolMode === 'shapes' ? 'Switch to Digits' : 'Switch to Shapes'}
          </Button>
          
          <Button
            onClick={() => {
              const modes: Array<'starter' | 'explorer' | 'challenge'> = ['starter', 'explorer', 'challenge'];
              const idx = modes.indexOf(difficulty);
              const next = modes[(idx + 1) % modes.length];
              setDifficulty(next);
              toast.info(`Difficulty: ${next}`);
            }}
            variant="outline"
            className="rounded-xl"
          >
            Difficulty: {difficulty}
          </Button>
        </div>
      </div>

      {showPalette && (
        <SymbolPalette
          mode={symbolMode}
          onSelect={setValue}
          onClose={() => setShowPalette(false)}
        />
      )}

      <SuccessAnimation show={showSuccess} showTada />
    </div>
  );
};

export default SudokuGame;
