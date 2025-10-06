import { FillInTask, FillInObject, TallyBox, FillInColor, ObjectType } from './types';

const generatePositions = (count: number): Array<{ x: number; y: number }> => {
  const positions: Array<{ x: number; y: number }> = [];
  const minDistance = 15;

  while (positions.length < count) {
    const x = 15 + Math.random() * 70;
    const y = 15 + Math.random() * 70;

    const isTooClose = positions.some(
      (pos) => Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2) < minDistance
    );

    if (!isTooClose) {
      positions.push({ x, y });
    }
  }

  return positions;
};

const getRandomPartition = (total: number, parts: number): number[] => {
  if (parts === 1) return [total];
  
  let remaining = total;
  
  // Decide if we'll have a zero (5% chance, max one zero)
  const hasZero = Math.random() < 0.05;
  const zeroIndex = hasZero ? Math.floor(Math.random() * parts) : -1;

  const partition = [] as number[];
  
  for (let i = 0; i < parts - 1; i++) {
    if (i === zeroIndex) {
      partition.push(0 as number);
      continue;
    }
    const max = remaining - (parts - i - 1);
    const value = Math.floor(Math.random() * (max + 1));
    partition.push(value as number);
    remaining -= value;
  }
  
  // Last part gets remainder (unless it's the zero)
  if (parts - 1 === zeroIndex) {
    partition.push(0 as number);
  } else {
    partition.push(remaining as number);
  }

  // Ensure at least one non-zero count - rebuild array if all zeros
  if (partition.every(v => v === 0)) {
    return [total, ...Array(parts - 1).fill(0)];
  }

  // Shuffle to make it random
  for (let i = partition.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = partition[i];
    partition[i] = partition[j];
    partition[j] = temp;
  }

  return partition;
};

export const generateTask = (
  maxNumber: number,
  paletteSize: number,
  includeUncolored: boolean,
  objectType: ObjectType
): FillInTask => {
  const totalObjects = Math.max(3, Math.floor(Math.random() * maxNumber) + 1);
  const positions = generatePositions(totalObjects);

  const allColors: FillInColor[] = ['blue', 'red', 'yellow', 'green', 'purple'];
  const colors = allColors.slice(0, paletteSize);
  
  // Determine partition
  const effectiveParts = includeUncolored ? paletteSize + 1 : paletteSize;
  const partition = getRandomPartition(totalObjects, effectiveParts);

  // Create tally boxes
  const tallyBoxes: TallyBox[] = colors.map((color, idx) => ({
    color,
    targetCount: partition[idx],
    currentTally: 0,
    prefilled: false,
  }));

  if (includeUncolored) {
    tallyBoxes.push({
      color: 'uncolored',
      targetCount: partition[paletteSize],
      currentTally: 0,
      prefilled: false,
    });
  }

  // Prefill at least one tally box randomly
  const prefilledIndex = Math.floor(Math.random() * tallyBoxes.length);
  tallyBoxes[prefilledIndex].currentTally = tallyBoxes[prefilledIndex].targetCount;
  tallyBoxes[prefilledIndex].prefilled = true;

  // Create objects (all start uncolored)
  const objects: FillInObject[] = positions.map((pos, idx) => ({
    id: `obj-${idx}`,
    type: objectType,
    x: pos.x,
    y: pos.y,
    color: null,
  }));

  return {
    objects,
    tallyBoxes,
    totalObjects,
  };
};

export const checkAnswer = (task: FillInTask, coloredObjects: FillInObject[]): boolean => {
  // Count actual colored objects
  const colorCounts: Record<string, number> = {
    blue: 0,
    red: 0,
    yellow: 0,
    green: 0,
    purple: 0,
    uncolored: 0,
  };

  coloredObjects.forEach((obj) => {
    const colorKey = obj.color || 'uncolored';
    colorCounts[colorKey]++;
  });

  // Check each tally box
  return task.tallyBoxes.every((box) => {
    return box.currentTally === colorCounts[box.color];
  });
};

export const playSound = (type: 'correct' | 'incorrect', muted: boolean) => {
  if (muted) return;

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (type === 'correct') {
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
  } else {
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }
};
