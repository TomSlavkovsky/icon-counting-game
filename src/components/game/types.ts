export type ObjectType = 'star' | 'circle' | 'heart' | 'apple' | 'flower' | 'square' | 'triangle';
export type ColorChoice = 'blue' | 'red';
export type TaskType = 'more' | 'fewer';

export interface GameObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  colored: boolean;
  color?: ColorChoice;
}

export interface GameField {
  id: 'left' | 'right';
  objects: GameObject[];
  targetBlue: number;
  targetRed: number;
  frameColor: ColorChoice;
}

export interface GameTask {
  type: TaskType;
  leftField: GameField;
  rightField: GameField;
}
