import { Exercise, Operation, LevelConfig } from './types';

export type { Exercise, Operation };

export const LEVEL_CONFIGS: LevelConfig[] = [
  // Level 1: max number 4
  { id: 1, operation: 'addition' as const, maxSum: 4, locked: false },
  // Level 2: max number 6
  { id: 2, operation: 'addition' as const, maxSum: 6, locked: false },
  // Level 3: max number 7
  { id: 3, operation: 'addition' as const, maxSum: 7, locked: false },
  // Levels 4-5: Addition, maxSum 10
  ...Array.from({ length: 2 }, (_, i) => ({
    id: i + 4,
    operation: 'addition' as const,
    maxSum: 10,
    locked: false,
  })),
  // Boxes 6-10: Subtraction only, within 10
  ...Array.from({ length: 5 }, (_, i) => ({
    id: i + 6,
    operation: 'subtraction' as const,
    maxSum: 10,
    locked: false,
  })),
  // Boxes 11-15: Mixed addition and subtraction within 10
  ...Array.from({ length: 5 }, (_, i) => ({
    id: i + 11,
    operation: 'mixed' as const,
    maxSum: 10,
    locked: false,
  })),
  // Boxes 16-40: Locked
  ...Array.from({ length: 25 }, (_, i) => ({
    id: i + 16,
    operation: 'mixed' as const,
    maxSum: 10,
    locked: true,
  })),
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateAdditionExercise = (maxSum: number): Exercise => {
  // Reduce frequency of 0s: 20% chance for 0, 80% for other numbers
  const getWeightedRandom = (max: number) => {
    if (Math.random() < 0.2) return 0; // 20% chance for 0
    return Math.floor(Math.random() * max) + 1; // 80% chance for 1 to max
  };
  
  const operandA = Math.random() < 0.8 ? getWeightedRandom(maxSum) : Math.floor(Math.random() * (maxSum + 1));
  const operandB = Math.random() < 0.8 ? getWeightedRandom(maxSum - operandA) : Math.floor(Math.random() * (maxSum + 1 - operandA));
  const correctAnswer = operandA + operandB;
  
  return {
    operandA,
    operandB,
    operation: 'add',
    correctAnswer,
    options: generateOptions(correctAnswer, 0, maxSum),
  };
};

const generateSubtractionExercise = (maxSum: number): Exercise => {
  // Ensure operandA is at least 1 to avoid 0-0=0
  const operandA = Math.floor(Math.random() * maxSum) + 1;
  
  // Ensure operandB is at least 1 (to avoid x-0=x) and less than operandA (to avoid x-x=0)
  // But still allow a 10% chance for operandB to be 0 or equal to operandA for variety
  let operandB: number;
  if (Math.random() < 0.1 || operandA === 1) {
    // 10% chance: allow any value including 0 and operandA
    operandB = Math.floor(Math.random() * (operandA + 1));
  } else {
    // 90% chance: avoid 0 and operandA
    operandB = Math.floor(Math.random() * (operandA - 1)) + 1;
  }
  
  const correctAnswer = operandA - operandB;
  
  return {
    operandA,
    operandB,
    operation: 'subtract',
    correctAnswer,
    options: generateOptions(correctAnswer, 0, maxSum),
  };
};

const generateOptions = (correct: number, min: number, max: number): number[] => {
  const options = new Set<number>([correct]);
  
  // Add near-miss values (±1, ±2)
  const nearMisses = [correct - 2, correct - 1, correct + 1, correct + 2]
    .filter(n => n >= min && n <= max && n !== correct);
  
  // Add some random values from valid range
  const validRange = Array.from({ length: max - min + 1 }, (_, i) => min + i)
    .filter(n => n !== correct);
  
  // Combine near misses and random values
  const candidates = shuffleArray([...nearMisses, ...validRange]);
  
  // Add distractors until we have 4 options
  for (const candidate of candidates) {
    if (options.size >= 4) break;
    options.add(candidate);
  }
  
  // If we still don't have 4 options, add any valid numbers
  while (options.size < 4) {
    const random = Math.floor(Math.random() * (max - min + 1)) + min;
    options.add(random);
  }
  
  return shuffleArray(Array.from(options));
};

export const generateSession = (levelId: number): Exercise[] => {
  const config = LEVEL_CONFIGS[levelId - 1];
  const exercises: Exercise[] = [];
  const used = new Set<string>();
  
  while (exercises.length < 20) {
    let exercise: Exercise;
    
    if (config.operation === 'addition') {
      exercise = generateAdditionExercise(config.maxSum);
    } else if (config.operation === 'subtraction') {
      exercise = generateSubtractionExercise(config.maxSum);
    } else {
      // Mixed: randomly choose addition or subtraction
      exercise = Math.random() < 0.5
        ? generateAdditionExercise(config.maxSum)
        : generateSubtractionExercise(config.maxSum);
    }
    
    // Create unique key to avoid duplicate exercises
    const key = `${exercise.operandA}${exercise.operation}${exercise.operandB}`;
    if (!used.has(key)) {
      used.add(key);
      exercises.push(exercise);
    }
  }
  
  return exercises;
};

export const calculateStars = (score: number): number => {
  if (score >= 18) return 3;
  if (score >= 14) return 2;
  if (score >= 10) return 1;
  return 0;
};

export const getOperationSymbol = (operation: Operation): string => {
  return operation === 'add' ? '+' : '−';
};

// LocalStorage helpers
const STORAGE_KEY = 'numbers_game_progress';

export const loadProgress = (): Record<number, { stars: number; bestScore: number }> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const saveProgress = (
  levelId: number,
  score: number,
  stars: number
): void => {
  const progress = loadProgress();
  const current = progress[levelId] || { stars: 0, bestScore: 0 };
  
  // Only update if this is a better result
  if (score > current.bestScore) {
    progress[levelId] = { stars, bestScore: score };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }
};
