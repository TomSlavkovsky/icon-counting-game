import { SudokuBoard, SudokuCell, Difficulty, SudokuSymbol, cloneBoard } from './types';
import { hasUniqueSolution, findHint, getCandidates } from './sudokuSolver';

function createEmptyBoard(): SudokuBoard {
  const cells: SudokuCell[][] = [];
  for (let r = 0; r < 4; r++) {
    cells[r] = [];
    for (let c = 0; c < 4; c++) {
      cells[r][c] = {
        value: 0,
        isGiven: false,
        pencilMarks: new Set(),
      };
    }
  }
  return { cells };
}

function fillBoard(board: SudokuBoard): boolean {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board.cells[r][c].value === 0) {
        const candidates = Array.from(getCandidates(board, r, c));
        // Shuffle candidates
        for (let i = candidates.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
        }
        
        for (const val of candidates) {
          board.cells[r][c].value = val;
          if (fillBoard(board)) return true;
          board.cells[r][c].value = 0;
        }
        return false;
      }
    }
  }
  return true;
}

function canSolveWithTechniques(board: SudokuBoard, difficulty: Difficulty): boolean {
  const boardCopy = cloneBoard(board);
  
  let maxIterations = 50;
  while (maxIterations-- > 0) {
    const hint = findHint(boardCopy, difficulty);
    if (!hint) break;
    
    boardCopy.cells[hint.row][hint.col].value = hint.value;
    
    // Check if complete
    let complete = true;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (boardCopy.cells[r][c].value === 0) {
          complete = false;
          break;
        }
      }
      if (!complete) break;
    }
    if (complete) return true;
  }
  
  return false;
}

export function generatePuzzle(difficulty: Difficulty): SudokuBoard {
  let attempts = 0;
  const maxAttempts = 100;
  
  while (attempts++ < maxAttempts) {
    // Create a filled board
    const board = createEmptyBoard();
    fillBoard(board);
    
    // Determine number of clues based on difficulty
    const clueCount = difficulty === 'starter' ? 11 : difficulty === 'explorer' ? 8 : 7;
    const cellsToRemove = 16 - clueCount;
    
    // Create list of all positions
    const positions: Array<{ r: number; c: number }> = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        positions.push({ r, c });
      }
    }
    
    // Shuffle positions
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    
    // Try to remove cells
    let removed = 0;
    for (const pos of positions) {
      if (removed >= cellsToRemove) break;
      
      const originalValue = board.cells[pos.r][pos.c].value;
      board.cells[pos.r][pos.c].value = 0;
      
      // Check if still has unique solution and can be solved with allowed techniques
      if (hasUniqueSolution(board) && canSolveWithTechniques(board, difficulty)) {
        removed++;
      } else {
        // Restore the value
        board.cells[pos.r][pos.c].value = originalValue;
      }
    }
    
    // If we successfully removed enough cells, mark givens and return
    if (removed >= cellsToRemove - 1) {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (board.cells[r][c].value !== 0) {
            board.cells[r][c].isGiven = true;
          }
        }
      }
      return board;
    }
  }
  
  // Fallback: return a simple puzzle if generation fails
  const board = createEmptyBoard();
  const simple = [
    [1, 2, 3, 4],
    [3, 4, 0, 0],
    [0, 0, 4, 3],
    [4, 3, 2, 1]
  ];
  
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      board.cells[r][c].value = simple[r][c] as SudokuSymbol;
      if (simple[r][c] !== 0) {
        board.cells[r][c].isGiven = true;
      }
    }
  }
  
  return board;
}
