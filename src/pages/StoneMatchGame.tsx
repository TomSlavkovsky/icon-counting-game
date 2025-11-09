import { useState, useEffect } from 'react';
import { GameLayout } from '@/components/game/GameLayout';
import { Slot } from '@/components/game/stonematch/Slot';
import { Tile } from '@/components/game/stonematch/Tile';
import { Tile as TileType } from '@/components/game/stonematch/types';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';
import { playSound } from '@/lib/sounds';
import {
  createDemoLevel,
  generateRandomLevel,
  checkSolution,
  getAvailableSymbols,
} from '@/components/game/stonematch/stoneMatchUtils';

const StoneMatchGame = () => {
  const { soundEnabled, objectSets } = useSettings();
  const muted = !soundEnabled;

  const [score, setScore] = useState(0);
  const [slots, setSlots] = useState<(TileType | null)[]>([null, null, null]);
  const [availableTiles, setAvailableTiles] = useState<TileType[]>([]);
  const [draggedTile, setDraggedTile] = useState<{ tile: TileType; from: 'slot' | 'available'; index: number } | null>(null);
  const [message, setMessage] = useState('');
  const [locked, setLocked] = useState(false);
  const [seamHighlights, setSeamHighlights] = useState<(null | 'green' | 'red')[]>([null, null]);
  const [attempts, setAttempts] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const initializeLevel = (isDemo: boolean = true) => {
    console.log('stone_match_started', { timestamp: Date.now() });
    
    const level = isDemo ? createDemoLevel() : generateRandomLevel(getAvailableSymbols(objectSets));
    setSlots([null, null, null]);
    setAvailableTiles(level.tiles);
    setMessage('');
    setLocked(false);
    setSeamHighlights([null, null]);
    setAttempts(0);
    setStartTime(Date.now());
  };

  useEffect(() => {
    initializeLevel(true);
  }, []);

  const handleDragStart = (tile: TileType, from: 'slot' | 'available', index: number) => {
    setDraggedTile({ tile, from, index });
    playSound('pick', muted);
  };

  const handleDropOnSlot = (slotIndex: number) => {
    if (!draggedTile || locked) return;

    playSound('drop', muted);

    const newSlots = [...slots];
    const newAvailableTiles = [...availableTiles];

    if (draggedTile.from === 'available') {
      // Move from available to slot
      const existingTile = newSlots[slotIndex];
      newSlots[slotIndex] = draggedTile.tile;
      newAvailableTiles.splice(draggedTile.index, 1);
      
      // If slot was occupied, return tile to available
      if (existingTile) {
        newAvailableTiles.push(existingTile);
      }
    } else if (draggedTile.from === 'slot') {
      // Swap tiles between slots
      const temp = newSlots[slotIndex];
      newSlots[slotIndex] = newSlots[draggedTile.index];
      newSlots[draggedTile.index] = temp;
    }

    setSlots(newSlots);
    setAvailableTiles(newAvailableTiles);
    setDraggedTile(null);
  };

  const handleFlipInSlot = (index: number) => {
    if (locked) return;
    const newSlots = [...slots];
    if (newSlots[index]) {
      newSlots[index] = { ...newSlots[index]!, flipped: !newSlots[index]!.flipped };
      setSlots(newSlots);
      playSound('pick', muted);
    }
  };

  const handleFlipAvailable = (index: number) => {
    if (locked) return;
    const newTiles = [...availableTiles];
    newTiles[index] = { ...newTiles[index], flipped: !newTiles[index].flipped };
    setAvailableTiles(newTiles);
    playSound('pick', muted);
  };

  const handleCheck = () => {
    const result = checkSolution(slots);
    setAttempts((prev) => prev + 1);

    if (!result.complete) {
      setMessage('Doplň všechny kameny.');
      playSound('error', muted);
      console.log('stone_match_checked', { result: 'incomplete', attempts });
      return;
    }

    if (result.valid) {
      // Success!
      setMessage('Výborně! Pokračuj.');
      setLocked(true);
      setSeamHighlights(['green', 'green']);
      playSound('ok', muted);
      setScore((prev) => prev + 1);
      
      const timeToComplete = Date.now() - startTime;
      console.log('stone_match_completed', { attempts: attempts + 1, timeToComplete });
    } else {
      // Mismatch
      setMessage('Zkus jiné pořadí.');
      const highlights: (null | 'red')[] = [null, null];
      result.mismatches.forEach((seam) => {
        highlights[seam] = 'red';
      });
      setSeamHighlights(highlights);
      playSound('error', muted);
      console.log('stone_match_checked', { result: 'fail', attempts: attempts + 1, mismatches: result.mismatches });

      // Clear red highlights after animation
      setTimeout(() => setSeamHighlights([null, null]), 1000);
    }
  };

  const handleNextPuzzle = () => {
    initializeLevel(false);
  };

  const handleReset = () => {
    initializeLevel(true);
    setScore(0);
  };

  return (
    <GameLayout
      score={score}
      muted={muted}
      onToggleMute={() => {}}
      onReset={handleReset}
      showScore={true}
    >
      <div className="flex flex-col items-center gap-8">
        {/* Slots */}
        <div className="flex items-center gap-6">
          {slots.map((tile, index) => (
            <Slot
              key={index}
              slotIndex={index}
              tile={tile}
              onDrop={() => handleDropOnSlot(index)}
              onFlip={() => handleFlipInSlot(index)}
              onDragStart={(e) => tile && handleDragStart(tile, 'slot', index)}
              highlight={seamHighlights[index]}
              locked={locked}
            />
          ))}
        </div>

        {/* Message */}
        {message && (
          <div className="text-xl font-bold text-foreground bg-card px-6 py-3 rounded-2xl shadow-playful">
            {message}
          </div>
        )}

        {/* Check button or Next button */}
        {!locked ? (
          <Button
            onClick={handleCheck}
            className="h-14 px-8 bg-game-yellow hover:bg-game-yellow/90 text-foreground rounded-2xl shadow-playful text-xl font-bold"
          >
            Zkontrolovat
          </Button>
        ) : (
          <Button
            onClick={handleNextPuzzle}
            className="h-14 px-8 bg-success hover:bg-success/90 text-success-foreground rounded-2xl shadow-playful text-xl font-bold"
          >
            Další úkol
          </Button>
        )}

        {/* Available tiles */}
        <div className="flex items-center gap-4 mt-4">
          {availableTiles.map((tile, index) => (
            <Tile
              key={tile.id}
              tile={tile}
              onFlip={() => handleFlipAvailable(index)}
              onDragStart={(e) => handleDragStart(tile, 'available', index)}
              draggable={true}
              locked={locked}
            />
          ))}
        </div>
      </div>
    </GameLayout>
  );
};

export default StoneMatchGame;
