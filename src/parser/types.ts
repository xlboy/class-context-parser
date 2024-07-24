import { ClassNodeType } from '../constants';

export interface NodeSource {
  pos: { s: number; e: number };
  value: string;
}

export interface ClassNode {
  type: ClassNodeType;
  value: NodeSource[];
}
