// core/domain/entities/FieldMapping.ts
export interface FieldMapping {
  id: string;
  stepId: string;
  sourceStepId: string;
  sourceFieldId: string;
  targetFieldId: string;
  transform?: string;
}

export interface MappingConfig {
  sourceStep: string;
  mappings: {
    sourceField: string;
    targetField: string;
    transform?: string;
  }[];
}
