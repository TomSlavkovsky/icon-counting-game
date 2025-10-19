import { AdditionObject, AdditionTask, ExerciseType, ObjectType } from './types';

const MIN_DISTANCE = 15;

const generatePositions = (count: number): { x: number; y: number }[] => {
  const positions: { x: number; y: number }[] = [];
  const maxAttempts = 100;

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let validPosition = false;
    let x = 0;
    let y = 0;

    while (!validPosition && attempts < maxAttempts) {
      x = 15 + Math.random() * 70;
      y = 15 + Math.random() * 70;

      validPosition = positions.every(pos => {
        const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
        return distance >= MIN_DISTANCE;
      });

      attempts++;
    }

    positions.push({ x, y });
  }

  return positions;
};

export const generateTask = (
  exerciseType: ExerciseType,
  numberOfBoxes: number,
  maxNumber: number,
  objectType: ObjectType,
  allowZero: boolean
): AdditionTask => {
  const boxes: AdditionTask['boxes'] = [];
  
  if (exerciseType === 'sum-by-tallies') {
    // Generate random counts for all boxes ensuring sum doesn't exceed maxNumber
    let targetSum = 0;
    const maxPerBox = Math.floor(maxNumber / numberOfBoxes);
    
    for (let i = 0; i < numberOfBoxes; i++) {
      const shouldBeZero = allowZero && Math.random() < 0.2;
      const remainingSum = maxNumber - targetSum;
      const remainingBoxes = numberOfBoxes - i;
      const maxForThisBox = Math.min(maxPerBox, remainingSum - (remainingBoxes - 1));
      const count = shouldBeZero ? 0 : Math.floor(Math.random() * Math.max(1, maxForThisBox)) + 1;
      targetSum += count;
      
      const positions = generatePositions(count);
      const objects: AdditionObject[] = positions.map((pos, idx) => ({
        id: `box${i}-obj${idx}`,
        type: objectType,
        x: pos.x,
        y: pos.y,
      }));

      boxes.push({ id: i, objects, count });
    }

    return {
      exerciseType,
      boxes,
      targetSum,
      objectType,
      userTallies: 0,
      userAddedObjects: [],
    };
  } else {
    // Find Missing Box: first box has objects, result is predefined
    const firstBoxCount = Math.floor(Math.random() * maxNumber) + 1;
    const targetSum = Math.min(firstBoxCount + Math.floor(Math.random() * (maxNumber - firstBoxCount + 1)), maxNumber);
    
    const firstPositions = generatePositions(firstBoxCount);
    const firstObjects: AdditionObject[] = firstPositions.map((pos, idx) => ({
      id: `box0-obj${idx}`,
      type: objectType,
      x: pos.x,
      y: pos.y,
    }));

    boxes.push({ id: 0, objects: firstObjects, count: firstBoxCount });

    // Create empty boxes for the rest
    for (let i = 1; i < numberOfBoxes; i++) {
      boxes.push({ id: i, objects: [], count: 0 });
    }

    return {
      exerciseType,
      boxes,
      targetSum,
      objectType,
      userTallies: 0,
      userAddedObjects: [],
    };
  }
};

export const checkAnswer = (task: AdditionTask): { correct: boolean; mismatchedBoxIndex?: number } => {
  if (task.exerciseType === 'sum-by-tallies') {
    const sum = task.boxes.reduce((acc, box) => acc + box.count, 0);
    return {
      correct: task.userTallies === sum,
      mismatchedBoxIndex: task.userTallies !== sum ? -1 : undefined, // -1 means result box
    };
  } else {
    const sum = task.boxes.reduce((acc, box) => acc + box.count, 0) + task.userAddedObjects.length;
    const correct = sum === task.targetSum;
    
    if (!correct) {
      // Find which box is wrong (boxes that should have user-added objects)
      for (let i = 1; i < task.boxes.length; i++) {
        return { correct: false, mismatchedBoxIndex: i };
      }
    }
    
    return { correct };
  }
};

export const playSound = (correct: boolean, soundEnabled: boolean) => {
  if (!soundEnabled) return;

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (correct) {
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } else {
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.15);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }
};
