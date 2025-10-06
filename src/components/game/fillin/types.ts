export type FillInColor = 'blue' | 'red' | 'yellow' | 'green' | 'purple';
export type ObjectType = 'star' | 'circle' | 'heart' | 'apple' | 'flower' | 'square' | 'triangle';

export interface FillInObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  color?: FillInColor | null; // null means uncolored
}

export interface TallyBox {
  color: FillInColor | 'uncolored';
  targetCount: number;
  currentTally: number;
  prefilled: boolean;
}

export interface FillInTask {
  objects: FillInObject[];
  tallyBoxes: TallyBox[];
  totalObjects: number;
}
