import { SudokuSymbol, SymbolMode, SHAPES, DIGITS } from './types';

interface SymbolPaletteProps {
  mode: SymbolMode;
  onSelect: (value: SudokuSymbol) => void;
  onClose: () => void;
}

export const SymbolPalette = ({ mode, onSelect, onClose }: SymbolPaletteProps) => {
  const symbols = mode === 'shapes' ? SHAPES : DIGITS;
  
  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-card rounded-3xl p-6 shadow-playful"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => {
                onSelect(num as SudokuSymbol);
                onClose();
              }}
              className="w-20 h-20 bg-game-blue hover:bg-game-blue/80 text-foreground rounded-2xl shadow-soft flex items-center justify-center text-4xl font-bold transition-all hover:scale-105"
            >
              {symbols[num]}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full py-3 bg-muted hover:bg-muted/80 rounded-xl text-foreground font-semibold"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
