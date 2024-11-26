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
  | "time";

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
  validation?: ValidationConfig;
  helpText?: string;
  conditionalLogic?: FieldConditionalLogic;
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface AsyncValidation {
  endpoint: string;
  method: "GET" | "POST";
  payloadFields: string[]; // Campos a serem enviados na requisição
  responseMapping: {
    [key: string]: string; // Mapeamento de campos da resposta para campos do formulário
  };
}

export interface ValidationConfig {
  rules: ValidationRule[];
  mask?: string;
  async?: AsyncValidation;
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

export interface FieldCondition {
  field: string;
  operator: "equals" | "contains" | "greater" | "less";
  value: any;
}

export interface FieldConditionalLogic {
  conditions: FieldCondition[];
  action: "show" | "hide" | "require" | "populate";
}
