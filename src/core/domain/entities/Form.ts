/* eslint-disable @typescript-eslint/no-explicit-any */
import { DataMappingConfig } from "./DataMapping";
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
  dataMapping?: DataMappingConfig; // Adicionado o data mapping
}

export interface StepConditionalLogic {
  endpoint: string;
  validation: StepValidation[];
}

export interface StepValidation {
  field: string;
  operator: "equals" | "contains" | "greater" | "less" | "between" | "exists";
  value: any;
  action: "show" | "hide" | "require" | "skip";
  targetFields?: string[];
}
