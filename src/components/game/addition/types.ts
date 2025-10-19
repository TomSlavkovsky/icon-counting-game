export type ObjectType = 'star' | 'circle' | 'heart' | 'apple' | 'flower' | 'square' | 'triangle';
export type ExerciseType = 'sum-by-tallies' | 'find-missing-box';

export interface AdditionObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
}

export interface AdditionBox {
  id: number;
  objects: AdditionObject[];
  count: number;
}

export interface AdditionTask {
  exerciseType: ExerciseType;
  boxes: AdditionBox[];
  targetSum: number;
  objectType: ObjectType;
  userTallies: number;
  userAddedObjects: AdditionObject[];
}
