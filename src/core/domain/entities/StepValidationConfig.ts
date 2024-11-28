/* eslint-disable @typescript-eslint/no-explicit-any */
// src/core/domain/entities/StepValidationConfig.ts

export type ValidationOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "exists"
  | "greater_than"
  | "less_than"
  | "between";

export type ValidationAction = "show" | "hide" | "skip";

export interface PayloadValidationRule {
  field: string;
  operator: ValidationOperator;
  value?: any;
  targetFields: string[];
  action: ValidationAction;
}

export interface StepConfig {
  endpoint?: string;
  method?: "GET" | "POST";
  includeFields?: {
    fromPayload?: string[]; // Campos do payload a serem incluídos
    fromPreviousSteps?: string[]; // Campos dos steps anteriores
  };
  validation?: PayloadValidationRule[];
  responseMapping?: {
    [key: string]: string; // Mapeamento de campos da resposta
  };
}

export interface ValidationResponse {
  payload?: Record<string, any>;
  fields?: Record<string, any>;
  errors?: string[];
}
