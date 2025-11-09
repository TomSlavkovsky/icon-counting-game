import { Tile as TileType } from './types';

interface TileProps {
  tile: TileType;
  onFlip: () => void;
  onDragStart: (e: React.DragEvent) => void;
  draggable: boolean;
  locked?: boolean;
}

export const Tile = ({ tile, onFlip, onDragStart, draggable, locked }: TileProps) => {
  const leftSymbol = tile.flipped ? tile.rightSymbol : tile.leftSymbol;
  const rightSymbol = tile.flipped ? tile.leftSymbol : tile.rightSymbol;

  return (
    <div
      draggable={draggable && !locked}
      onDragStart={onDragStart}
      onClick={locked ? undefined : onFlip}
      className={`
        relative w-32 h-20 bg-card border-4 border-border rounded-xl shadow-playful
        flex items-center justify-between px-4
        ${!locked ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-default'}
        transition-transform duration-200
        ${locked ? 'opacity-75' : ''}
      `}
    >
      <div className="text-4xl select-none">{leftSymbol}</div>
      <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-border" />
      <div className="text-4xl select-none">{rightSymbol}</div>
    </div>
  );
};
