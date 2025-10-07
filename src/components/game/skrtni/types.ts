export type SkrtniColor = 'blue' | 'red' | 'yellow' | 'green' | 'purple';
export type ObjectType = 'star' | 'circle' | 'heart' | 'apple' | 'flower' | 'square' | 'triangle';
export type ToolType = 'cross' | 'color';
export type ObjectState = 'untouched' | 'crossed' | 'colored';

export interface SkrtniObject {
  id: string;
  type: ObjectType;
  x: number;
  y: number;
  state: ObjectState;
  color?: SkrtniColor;
}

export interface TallyBox {
  id: number;
  value: number;
  editable: boolean;
}

export interface SkrtniTask {
  objects: SkrtniObject[];
  tallyBoxes: TallyBox[];
  totalObjects: number;
  requiredCrossed: number;
  requiredRemainder: number;
}
