/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field } from "./Field";

export interface Form {
  id: string;
  name: string;
  slug: string;
  submitLabel: string;
  endpoint?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  steps: FormStep[];
}

export interface FormStep {
  id: string;
  formId: string;
  order: number;
  title: string;
  description?: string;
  fields: Field[];
  conditionalLogic?: StepConditionalLogic;
}

export interface StepConditionalLogic {
  endpoint: string; // Endpoint para consulta
  validation: StepValidation[];
}

export interface StepValidation {
  field: string; // Campo para comparar
  operator: "equals" | "contains" | "greater" | "less" | "between" | "exists";
  value: any;
  action: "show" | "hide" | "require" | "skip";
  targetFields?: string[]; // Campos afetados pela validação
}
