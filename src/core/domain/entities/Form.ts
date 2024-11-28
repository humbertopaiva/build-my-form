/* eslint-disable @typescript-eslint/no-explicit-any */
// import { DataMappingConfig } from "./DataMapping";
import { Field, WebhookConfig, WebhookVariable } from "./Field";
import { ValidationAction, ValidationOperator } from "./StepValidationConfig";

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
  webhook?: WebhookConfig;
  variables: WebhookVariable[];
  conditions?: StepCondition[];
}

export interface StepConditionalLogic {
  endpoint: string;
  validation: StepValidation[];
  method?: "GET" | "POST";
  includeFields?: {
    fromPayload?: string[];
    fromPreviousSteps?: string[];
  };
}

export interface StepValidation {
  field: string;
  operator: ValidationOperator;
  value: any;
  action: ValidationAction;
  targetFields?: string[];
}

// core/domain/entities/Form.ts
export interface FormWithWebhook extends Form {
  steps: FormStepWithWebhook[];
}

export interface StepCondition {
  id: string;
  stepId: string;
  variableName: string; // Nome da variável do webhook
  operator: ValidationOperator;
  value: any;
  action: "skip" | "show" | "hide"; // Ações específicas para steps
}

export interface FormStepWithWebhook extends FormStep {
  webhook?: WebhookConfig;
  variables: WebhookVariable[];
  conditions?: StepCondition[];
}
