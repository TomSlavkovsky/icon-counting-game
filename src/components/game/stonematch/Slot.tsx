import { Tile as TileType } from './types';
import { Tile } from './Tile';

interface SlotProps {
  slotIndex: number;
  tile: TileType | null;
  onDrop: (e: React.DragEvent) => void;
  onFlip: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  highlight?: 'green' | 'red' | null;
  locked?: boolean;
}

export const Slot = ({ slotIndex, tile, onDrop, onFlip, onDragStart, onTouchStart, highlight, locked }: SlotProps) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="relative">
      <div
        data-slot-index={slotIndex}
        onDrop={onDrop}
        onDragOver={handleDragOver}
        className={`
          w-32 h-20 border-4 border-dashed rounded-xl
          flex items-center justify-center
          transition-all duration-300
          ${!tile ? 'border-muted bg-muted/20' : 'border-transparent'}
          ${highlight === 'green' ? 'bg-success/20 border-success' : ''}
          ${highlight === 'red' ? 'bg-destructive/20 border-destructive animate-pulse' : ''}
        `}
      >
        {tile ? (
          <Tile
            tile={tile}
            onFlip={onFlip}
            onDragStart={onDragStart}
            onTouchStart={onTouchStart}
            draggable={true}
            locked={locked}
          />
        ) : (
          <span className="text-muted-foreground text-sm">Slot {slotIndex + 1}</span>
        )}
      </div>
      {/* Seam indicator on the right (except last slot) */}
      {slotIndex < 2 && (
        <div
          className={`
            absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-1 rounded-full
            transition-all duration-300
            ${highlight === 'green' ? 'bg-success' : ''}
            ${highlight === 'red' ? 'bg-destructive' : 'bg-border'}
          `}
        />
      )}
    </div>
  );
};
