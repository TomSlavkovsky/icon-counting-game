import { SudokuSymbol, SymbolMode, SHAPES, DIGITS } from './types';
import { SudokuBoard as BoardType } from './types';

interface SymbolPaletteProps {
  mode: SymbolMode;
  board: BoardType;
  selectedCell: { row: number; col: number } | null;
  selectedSymbol: SudokuSymbol | null;
  onSelect: (value: SudokuSymbol) => void;
}

const countSymbolOccurrences = (board: BoardType, symbol: SudokuSymbol): number => {
  let count = 0;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (board.cells[r][c].value === symbol) count++;
    }
  }
  return count;
};

export const SymbolPalette = ({ mode, board, selectedCell, selectedSymbol, onSelect }: SymbolPaletteProps) => {
  const symbols = mode === 'shapes' ? SHAPES : DIGITS;
  
  return (
    <div className="flex gap-3 justify-center w-full max-w-md">
      {[1, 2, 3, 4].map((num) => {
        const symbol = num as SudokuSymbol;
        const usedCount = countSymbolOccurrences(board, symbol);
        const isUsedFully = usedCount >= 4;
        const isCandidate = selectedCell 
          ? board.cells[selectedCell.row][selectedCell.col].pencilMarks.has(symbol)
          : true;
        const isDisabled = isUsedFully || (selectedCell && !isCandidate);
        const isSelected = selectedSymbol === symbol;

        return (
          <button
            key={num}
            onClick={() => {
              console.log('Palette button clicked:', { symbol, isDisabled, selectedCell, isCandidate });
              if (!isDisabled) {
                onSelect(symbol);
              }
            }}
            disabled={isDisabled}
            className={`
              flex-1 aspect-square min-h-[60px] relative
              rounded-2xl shadow-soft flex items-center justify-center 
              text-4xl font-bold transition-all
              ${isSelected ? 'bg-game-blue scale-95 ring-4 ring-game-blue/50' : 'bg-game-blue hover:bg-game-blue/80'}
              ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
              text-foreground
            `}
          >
            {symbols[num]}
            {isUsedFully && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-5xl font-bold text-red-500 rotate-45">×</div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};
