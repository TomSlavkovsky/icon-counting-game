import { Animal, Position, PlacedTile } from './types';
import { getTileCellPositions } from './piggiesUtils';

interface GameBoardProps {
  boardMask: string[];
  animals: Animal[];
  placedTiles: PlacedTile[];
  cellSize: number;
  onCellClick?: (position: Position) => void;
  showHint?: boolean;
  coveredPigs: Set<string>;
}

export const GameBoard = ({
  boardMask,
  animals,
  placedTiles,
  cellSize,
  onCellClick,
  showHint,
  coveredPigs
}: GameBoardProps) => {
  const rows = boardMask.length;
  const cols = Math.max(...boardMask.map(row => row.length));
  
  // Get all covered cells from placed tiles
  const coveredCells = new Map<string, 'window' | 'roof'>();
  placedTiles.forEach(tile => {
    const cells = getTileCellPositions(tile);
    cells.forEach((type, pos) => {
      coveredCells.set(pos, type === 'h' ? 'window' : 'roof');
    });
  });

  return (
    <div className="relative" style={{ width: cols * cellSize, height: rows * cellSize }}>
      {/* Board cells */}
      {boardMask.map((row, r) =>
        row.split('').map((cell, c) => {
          const key = `${r},${c}`;
          const isCovered = coveredCells.has(key);
          const coverType = coveredCells.get(key);
          
          if (cell !== 'o') return null;
          
          return (
            <div
              key={key}
              className={`absolute border-2 transition-all ${
                isCovered
                  ? coverType === 'window'
                    ? 'bg-yellow-100 border-yellow-400'
                    : 'bg-red-300 border-red-500'
                  : 'bg-green-100 border-green-400 hover:bg-green-200'
              }`}
              style={{
                left: c * cellSize,
                top: r * cellSize,
                width: cellSize,
                height: cellSize
              }}
              onClick={() => onCellClick?.({ row: r, col: c })}
            />
          );
        })
      )}
      
      {/* Animals */}
      {animals.map((animal, idx) => {
        const key = `${animal.position.row},${animal.position.col}`;
        const isInWindow = coveredPigs.has(key);
        const showPigHint = showHint && animal.type === 'pig' && !isInWindow;
        
        return (
          <div
            key={idx}
            className={`absolute flex items-center justify-center pointer-events-none transition-all ${
              showPigHint ? 'animate-bounce' : ''
            }`}
            style={{
              left: animal.position.col * cellSize,
              top: animal.position.row * cellSize,
              width: cellSize,
              height: cellSize,
              zIndex: 10
            }}
          >
            {animal.type === 'pig' ? (
              <svg viewBox="0 0 64 64" className={`w-3/4 h-3/4 ${showPigHint ? 'drop-shadow-lg' : ''}`}>
                <circle cx="32" cy="32" r="24" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2"/>
                <circle cx="24" cy="28" r="3" fill="#000"/>
                <circle cx="40" cy="28" r="3" fill="#000"/>
                <ellipse cx="32" cy="36" rx="8" ry="6" fill="#FF69B4"/>
                <circle cx="28" cy="36" r="2" fill="#000"/>
                <circle cx="36" cy="36" r="2" fill="#000"/>
                <ellipse cx="18" cy="20" rx="6" ry="8" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2"/>
                <ellipse cx="46" cy="20" rx="6" ry="8" fill="#FFB6C1" stroke="#FF69B4" strokeWidth="2"/>
              </svg>
            ) : (
              <svg viewBox="0 0 64 64" className="w-3/4 h-3/4">
                <ellipse cx="32" cy="36" rx="20" ry="16" fill="#8B4513"/>
                <circle cx="32" cy="28" r="16" fill="#696969" stroke="#000" strokeWidth="2"/>
                <circle cx="26" cy="26" r="3" fill="#fff"/>
                <circle cx="38" cy="26" r="3" fill="#fff"/>
                <circle cx="26" cy="26" r="2" fill="#000"/>
                <circle cx="38" cy="26" r="2" fill="#000"/>
                <path d="M 26 34 Q 32 38 38 34" stroke="#000" strokeWidth="2" fill="none"/>
                <polygon points="32,16 28,8 36,8" fill="#696969" stroke="#000" strokeWidth="1"/>
                <polygon points="32,16 26,10 30,6" fill="#696969" stroke="#000" strokeWidth="1"/>
                <polygon points="32,16 38,10 34,6" fill="#696969" stroke="#000" strokeWidth="1"/>
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
};
