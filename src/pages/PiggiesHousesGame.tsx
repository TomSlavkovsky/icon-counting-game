import { useState, useEffect } from 'react';
import { GameLayout } from '@/components/game/GameLayout';
import { SuccessAnimation } from '@/components/game/SuccessAnimation';
import { GameBoard } from '@/components/game/piggies/GameBoard';
import { TilesTray } from '@/components/game/piggies/TilesTray';
import { useSettings } from '@/contexts/SettingsContext';
import { playSound } from '@/lib/sounds';
import { LEVELS, canPlaceTile, checkWinCondition, getTileCellPositions } from '@/components/game/piggies/piggiesUtils';
import { PlacedTile, Animal } from '@/components/game/piggies/types';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

export default function PiggiesHousesGame() {
  const { soundEnabled, toggleSound } = useSettings();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedTileId, setSelectedTileId] = useState<string | null>(null);
  const [placedTiles, setPlacedTiles] = useState<PlacedTile[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [draggedTileId, setDraggedTileId] = useState<string | null>(null);

  const level = LEVELS[currentLevel];
  const cellSize = 60;

  useEffect(() => {
    // Initialize tiles
    const initialTiles: PlacedTile[] = level.pieces.tiles.map(tile => ({
      ...tile,
      rotation: 0 as const,
      position: { row: -1, col: -1 }
    }));
    setPlacedTiles(initialTiles);
    setSelectedTileId(null);
  }, [currentLevel]);

  const animals: Animal[] = [
    ...level.pieces.animals.pigs.map(pos => ({ type: 'pig' as const, position: pos })),
    { type: 'wolf' as const, position: level.pieces.animals.wolf }
  ];

  const handleTileRotate = (tileId: string) => {
    setPlacedTiles(prev => prev.map(tile => {
      if (tile.id === tileId) {
        const newRotation = ((tile.rotation + 90) % 360) as 0 | 90 | 180 | 270;
        playSound('pick', !soundEnabled);
        return { ...tile, rotation: newRotation };
      }
      return tile;
    }));
  };

  const handleTileSelect = (tileId: string) => {
    setSelectedTileId(prev => prev === tileId ? null : tileId);
    playSound('pick', !soundEnabled);
  };

  const handleCellClick = (position: { row: number; col: number }) => {
    const tileId = selectedTileId || draggedTileId;
    if (!tileId) return;

    const selectedTile = placedTiles.find(t => t.id === tileId);
    if (!selectedTile) return;

    // Try to place tile at this position
    const newTile: PlacedTile = {
      ...selectedTile,
      position
    };

    const otherTiles = placedTiles.filter(t => t.id !== tileId && t.position.row !== -1);
    const validation = canPlaceTile(
      newTile,
      level.board.mask,
      otherTiles,
      level.pieces.animals.pigs,
      level.pieces.animals.wolf
    );

    if (validation.valid) {
      setPlacedTiles(prev => prev.map(t => t.id === tileId ? newTile : t));
      setSelectedTileId(null);
      setDraggedTileId(null);
      playSound('drop', !soundEnabled);

      // Check win condition
      setTimeout(() => {
        const updatedTiles = placedTiles.map(t => t.id === tileId ? newTile : t);
        if (checkWinCondition(updatedTiles, level.pieces.animals.pigs, level.pieces.animals.wolf)) {
          setShowSuccess(true);
          setScore(prev => prev + 1);
          playSound('ok', !soundEnabled);
          setTimeout(() => setShowSuccess(false), 3000);
        }
      }, 100);
    } else {
      playSound('error', !soundEnabled);
      setDraggedTileId(null);
    }
  };

  const handleDragStart = (tileId: string) => {
    setDraggedTileId(tileId);
    playSound('pick', !soundEnabled);
  };

  const handleDragEnd = () => {
    setDraggedTileId(null);
  };

  const handleReset = () => {
    const initialTiles: PlacedTile[] = level.pieces.tiles.map(tile => ({
      ...tile,
      rotation: 0 as const,
      position: { row: -1, col: -1 }
    }));
    setPlacedTiles(initialTiles);
    setSelectedTileId(null);
    setShowHint(false);
  };

  const handleNext = () => {
    if (currentLevel < LEVELS.length - 1) {
      setCurrentLevel(prev => prev + 1);
    } else {
      setCurrentLevel(0);
    }
    setShowHint(false);
  };

  // Get covered pigs
  const coveredPigs = new Set<string>();
  placedTiles.forEach(tile => {
    if (tile.position.row === -1) return;
    const cells = getTileCellPositions(tile);
    cells.forEach((type, pos) => {
      if (type === 'h') {
        coveredPigs.add(pos);
      }
    });
  });

  const isWon = checkWinCondition(placedTiles, level.pieces.animals.pigs, level.pieces.animals.wolf);

  return (
    <GameLayout
      score={score}
      muted={!soundEnabled}
      onToggleMute={toggleSound}
      onReset={handleReset}
      onNext={isWon ? handleNext : undefined}
      topRightControls={
        <Button
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-2xl"
          onClick={() => setShowHint(!showHint)}
          aria-label="Toggle hint"
        >
          <Lightbulb size={24} className={showHint ? 'fill-yellow-400' : ''} />
        </Button>
      }
    >
      <div className="flex flex-col items-center gap-8 pb-32">
        <div className="flex justify-center items-center">
          <GameBoard
            boardMask={level.board.mask}
            animals={animals}
            placedTiles={placedTiles.filter(t => t.position.row !== -1)}
            cellSize={cellSize}
            onCellClick={handleCellClick}
            showHint={showHint}
            coveredPigs={coveredPigs}
          />
        </div>

        {isWon && (
          <div className="text-4xl font-bold text-success animate-bounce-in">
            Výborně!
          </div>
        )}
      </div>

      {/* Bottom tray */}
      <div className="fixed bottom-4 left-4 right-4 z-20">
        <TilesTray
          availableTiles={level.pieces.tiles}
          placedTiles={placedTiles}
          selectedTileId={selectedTileId}
          onTileSelect={handleTileSelect}
          onTileRotate={handleTileRotate}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          cellSize={cellSize * 0.7}
        />
      </div>

      <SuccessAnimation show={showSuccess} />
    </GameLayout>
  );
}
