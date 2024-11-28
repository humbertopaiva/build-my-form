// core/domain/entities/DataMapping.ts

export interface DataMapping {
  id: string;
  stepId: string;
  sourceStep?: string;
  mapping: FieldMapping;
  transformations?: FieldTransformation[];
}

export interface FieldMapping {
  [key: string]: string; // source -> target
}

export interface FieldTransformation {
  field: string;
  type: TransformationType;
  config?: TransformationConfig;
}

export type TransformationType =
  | "format"
  | "calculate"
  | "concat"
  | "split"
  | "custom";

export interface TransformationConfig {
  format?: string;
  formula?: string;
  separator?: string;
  customFn?: string;
}
