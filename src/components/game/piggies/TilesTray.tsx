import { TileMask, PlacedTile } from './types';
import { HouseTile } from './HouseTile';

interface TilesTrayProps {
  availableTiles: TileMask[];
  placedTiles: PlacedTile[];
  selectedTileId: string | null;
  onTileSelect: (tileId: string) => void;
  onTileRotate: (tileId: string) => void;
  cellSize: number;
}

export const TilesTray = ({
  availableTiles,
  placedTiles,
  selectedTileId,
  onTileSelect,
  onTileRotate,
  cellSize
}: TilesTrayProps) => {
  return (
    <div className="bg-card border-2 border-border rounded-lg p-4 shadow-lg">
      <div className="flex gap-6 justify-center items-end flex-wrap">
        {availableTiles.map((tileMask) => {
          const placedTile = placedTiles.find(t => t.id === tileMask.id);
          
          // If placed, show it on the board with minimal opacity
          if (placedTile && placedTile.position.row !== -1) {
            return (
              <div key={tileMask.id} className="opacity-30 pointer-events-none">
                <HouseTile
                  tile={{
                    ...tileMask,
                    rotation: placedTile.rotation,
                    position: { row: -1, col: -1 }
                  }}
                  cellSize={cellSize}
                  onRotate={() => {}}
                  onSelect={() => {}}
                  isDraggable={false}
                />
              </div>
            );
          }
          
          // Otherwise show in tray
          const tileState = placedTiles.find(t => t.id === tileMask.id) || {
            ...tileMask,
            rotation: 0 as const,
            position: { row: -1, col: -1 }
          };
          
          return (
            <div key={tileMask.id} className="transition-transform hover:scale-105">
              <HouseTile
                tile={tileState}
                cellSize={cellSize}
                isSelected={selectedTileId === tileMask.id}
                onRotate={() => onTileRotate(tileMask.id)}
                onSelect={() => onTileSelect(tileMask.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
