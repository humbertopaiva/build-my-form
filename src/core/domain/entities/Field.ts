/* eslint-disable @typescript-eslint/no-explicit-any */
// src/core/domain/entities/Field.ts
export type FieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "textarea"
  | "select"
  | "radio"
  | "checkbox"
  | "date"
  | "time"
  | "file";

export interface Field {
  id: string;
  formId: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required: boolean;
  order: number;
  options?: FieldOption[];
  helpText?: string;
  validation?: ValidationConfig; // Mudamos para um objeto de configuração
  conditional?: ConditionalRule;
}

export interface ValidationConfig {
  rules: ValidationRule[];
  mask?: string; // Movemos a máscara para dentro da config
}

export interface ValidationRule {
  type: ValidationRuleType;
  value?: any;
  message: string;
}

export type ValidationRuleType =
  | "required"
  | "email"
  | "minLength"
  | "maxLength"
  | "pattern"
  | "cpf"
  | "cnpj"
  | "phone"
  | "cep"
  | "custom";

export interface ConditionalRule {
  field: string;
  operator: ConditionalOperator;
  value: any;
}

export type ConditionalOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "greaterThan"
  | "lessThan";

export interface FieldOption {
  label: string;
  value: string;
}
