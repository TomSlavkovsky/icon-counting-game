import { SkrtniTask, SkrtniObject, ObjectType } from './types';

const generatePositions = (count: number): { x: number; y: number }[] => {
  const positions: { x: number; y: number }[] = [];
  const minDistance = 15;

  while (positions.length < count) {
    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 80;

    const tooClose = positions.some(
      (pos) => Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2) < minDistance
    );

    if (!tooClose) {
      positions.push({ x, y });
    }
  }

  return positions;
};

const getRandomPartition = (total: number, parts: number, allowZero: boolean): number[] => {
  const partition: number[] = [];
  let remaining = total;

  for (let i = 0; i < parts - 1; i++) {
    const maxValue = remaining - (parts - 1 - i);
    const minValue = allowZero && Math.random() < 0.2 && !partition.includes(0) ? 0 : 1;
    const value = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    partition.push(value);
    remaining -= value;
  }

  partition.push(remaining);

  // Ensure at most one zero
  const zeroCount = partition.filter(v => v === 0).length;
  if (zeroCount > 1) {
    for (let i = 0; i < partition.length - 1; i++) {
      if (partition[i] === 0) {
        partition[i] = 1;
        remaining--;
        break;
      }
    }
    partition[partition.length - 1] = remaining;
  }

  return partition;
};

export const generateTask = (
  maxNumber: number,
  numberOfBoxes: number,
  allowZero: boolean,
  objectType: ObjectType
): SkrtniTask => {
  const totalObjects = Math.floor(Math.random() * (maxNumber - 2)) + 3;
  const positions = generatePositions(totalObjects);

  const prefilledCount = numberOfBoxes - 1;
  
  // Generate sum for prefilled boxes that's at least 1 and at most totalObjects - 1
  // This ensures remainder can be anywhere from 1 to totalObjects - 1
  const minSum = 1;
  const maxSum = totalObjects - 1;
  const prefilledSum = Math.floor(Math.random() * (maxSum - minSum + 1)) + minSum;
  
  const partition = getRandomPartition(prefilledSum, prefilledCount, allowZero);
  
  const requiredCrossed = prefilledSum;
  const requiredRemainder = totalObjects - requiredCrossed;

  const objects: SkrtniObject[] = positions.map((pos, index) => ({
    id: `obj-${index}`,
    type: objectType,
    x: pos.x,
    y: pos.y,
    state: 'untouched' as const,
  }));

  const tallyBoxes = [
    ...partition.map((value, index) => ({
      id: index,
      value,
      editable: false,
    })),
    {
      id: prefilledCount,
      value: 0,
      editable: true,
    },
  ];

  return {
    objects,
    tallyBoxes,
    totalObjects,
    requiredCrossed,
    requiredRemainder,
  };
};

export const checkAnswer = (
  task: SkrtniTask,
  objects: SkrtniObject[],
  lastBoxValue: number
): { correct: boolean; crossedMatch: boolean; remainderMatch: boolean; coloredCount: number } => {
  const crossedCount = objects.filter(obj => obj.state === 'crossed').length;
  const coloredCount = objects.filter(obj => obj.state === 'colored').length;
  
  const crossedMatch = crossedCount === task.requiredCrossed;
  const remainderMatch = lastBoxValue === task.requiredRemainder;
  
  return {
    correct: crossedMatch && remainderMatch,
    crossedMatch,
    remainderMatch,
    coloredCount,
  };
};

export const playSound = (type: 'correct' | 'incorrect', muted: boolean) => {
  if (muted) return;

  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (type === 'correct') {
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } else {
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  }
};
