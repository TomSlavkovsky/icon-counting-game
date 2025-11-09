export type Operation = 'add' | 'subtract';

export interface Exercise {
  operandA: number;
  operandB: number;
  operation: Operation;
  correctAnswer: number;
  options: number[];
}

export interface LevelConfig {
  id: number;
  operation: 'addition' | 'subtraction' | 'mixed';
  maxSum: number;
  locked: boolean;
}

export interface SessionResult {
  levelId: number;
  score: number;
  stars: number;
  timestamp: number;
}

export interface LevelProgress {
  stars: number;
  bestScore: number;
}
