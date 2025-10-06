import { GameTask, GameField, GameObject, ObjectType, ColorChoice, TaskType } from './types';

const OBJECT_TYPES: ObjectType[] = ['star', 'circle', 'heart', 'apple', 'flower', 'square', 'triangle'];

// Generate random positions ensuring no overlaps
const generatePositions = (count: number): Array<{ x: number; y: number }> => {
  const positions: Array<{ x: number; y: number }> = [];
  const minDistance = 18; // Minimum distance between objects in percentage

  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let validPosition = false;
    let x = 0;
    let y = 0;

    while (!validPosition && attempts < 100) {
      // Generate random position with margins
      x = 15 + Math.random() * 70; // 15% to 85%
      y = 15 + Math.random() * 70; // 15% to 85%

      // Check if position is far enough from all existing positions
      validPosition = positions.every((pos) => {
        const distance = Math.sqrt(Math.pow(pos.x - x, 2) + Math.pow(pos.y - y, 2));
        return distance >= minDistance;
      });

      attempts++;
    }

    positions.push({ x, y });
  }

  return positions;
};

// Create a game field with objects
const createGameField = (
  id: 'left' | 'right',
  count: number,
  objectType: ObjectType,
  frameColor: ColorChoice,
  targetBlue: number,
  targetRed: number
): GameField => {
  const positions = generatePositions(count);

  const objects: GameObject[] = positions.map((pos, index) => ({
    id: `${id}-${index}`,
    type: objectType,
    x: pos.x,
    y: pos.y,
    colored: false,
  }));

  return {
    id,
    objects,
    targetBlue,
    targetRed,
    frameColor,
  };
};

// Generate a new random task
export const generateTask = (): GameTask => {
  // Randomly choose task type
  const taskType: TaskType = Math.random() < 0.5 ? 'more' : 'fewer';

  // Generate counts (1-7 objects per field)
  let leftCount: number;
  let rightCount: number;

  if (taskType === 'more') {
    leftCount = 2 + Math.floor(Math.random() * 4); // 2-5
    rightCount = leftCount + 1 + Math.floor(Math.random() * 2); // 1-2 more
  } else {
    rightCount = 2 + Math.floor(Math.random() * 4); // 2-5
    leftCount = rightCount + 1 + Math.floor(Math.random() * 2); // 1-2 more
  }

  // Ensure counts are within bounds
  leftCount = Math.min(leftCount, 7);
  rightCount = Math.min(rightCount, 7);

  // Randomly choose object types (can be same or different)
  const leftObjectType = OBJECT_TYPES[Math.floor(Math.random() * OBJECT_TYPES.length)];
  const rightObjectType = OBJECT_TYPES[Math.floor(Math.random() * OBJECT_TYPES.length)];

  // Generate target counts for each color (randomly split the total count)
  const leftTargetBlue = Math.floor(Math.random() * (leftCount + 1));
  const leftTargetRed = leftCount - leftTargetBlue;

  const rightTargetBlue = Math.floor(Math.random() * (rightCount + 1));
  const rightTargetRed = rightCount - rightTargetBlue;

  // Create fields with frame colors
  const leftField = createGameField('left', leftCount, leftObjectType, 'blue', leftTargetBlue, leftTargetRed);
  const rightField = createGameField('right', rightCount, rightObjectType, 'red', rightTargetBlue, rightTargetRed);

  return {
    type: taskType,
    leftField,
    rightField,
  };
};

// Check if the answer is correct
export const checkAnswer = (task: GameTask, fieldId: 'left' | 'right', answer: 'more' | 'fewer'): boolean => {
  const leftCount = task.leftField.objects.length;
  const rightCount = task.rightField.objects.length;

  const fieldCount = fieldId === 'left' ? leftCount : rightCount;
  const otherCount = fieldId === 'left' ? rightCount : leftCount;

  if (answer === 'more') {
    return fieldCount > otherCount;
  } else {
    return fieldCount < otherCount;
  }
};

// Play sound (placeholder - can be enhanced with actual audio)
export const playSound = (type: 'correct' | 'incorrect', muted: boolean) => {
  if (muted) return;

  // Create simple beep sounds using Web Audio API
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (type === 'correct') {
    oscillator.frequency.value = 800; // Higher pitch for correct
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  } else {
    oscillator.frequency.value = 200; // Lower pitch for incorrect
    oscillator.type = 'sawtooth';
    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
  }

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
};
