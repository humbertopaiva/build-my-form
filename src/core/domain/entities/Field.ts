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
  webhookConditions?: WebhookFieldCondition[];
}

export interface FieldOption {
  label: string;
  value: string;
}

export interface AsyncValidation {
  endpoint: string;
  method: "GET" | "POST";
  payloadFields: string[];
  responseMapping: Record<string, string>;
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

export interface FieldCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
}

export interface FieldConditionalLogic {
  conditions: FieldCondition[];
  action: FieldAction;
}

export interface WebhookFieldCondition {
  fieldId: string;
  variablePath: string;
  operator: ConditionOperator;
  value: any;
  action: FieldAction;
}

export type ConditionOperator =
  | "equals"
  | "notEquals"
  | "contains"
  | "notContains"
  | "greaterThan"
  | "lessThan"
  | "exists"
  | "notExists";

export type FieldAction =
  | "show"
  | "hide"
  | "require"
  | "optional"
  | "populate"
  | "disable"
  | "enable";

export interface WebhookVariable {
  name: string;
  path: string;
  type: "string" | "number" | "boolean" | "array";
}

export interface WebhookConfig {
  enabled: boolean;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH";
  headers?: Record<string, string>;
  authType: "none" | "basic" | "bearer" | "custom";
  authValue?: string;
  selectedFields: Array<{
    id: string;
    paramName: string;
    sendType: "body" | "query";
  }>;
  variables: WebhookVariable[];
}
