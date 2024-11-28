/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PayloadValidationRule,
  ValidationResponse,
} from "@/core/domain/entities/StepValidationConfig";
import { ValidationRule } from "@/core/domain/entities/Field";

interface RequestData {
  currentStep: Record<string, any>;
  previousData?: Record<string, any>;
  payloadFields?: Record<string, any>;
}

interface FieldValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationService {
  static evaluatePayloadRule(
    rule: PayloadValidationRule,
    payload: Record<string, any>
  ): boolean {
    const value = payload[rule.field];

    switch (rule.operator) {
      case "equals":
        return value === rule.value;

      case "not_equals":
        return value !== rule.value;

      case "contains":
        if (Array.isArray(value)) {
          return value.includes(rule.value);
        }
        return String(value).includes(String(rule.value));

      case "exists":
        return value !== undefined && value !== null;

      case "greater_than":
        return Number(value) > Number(rule.value);

      case "less_than":
        return Number(value) < Number(rule.value);

      default:
        return false;
    }
  }

  static async validateStep(
    endpoint: string,
    method: "GET" | "POST",
    currentData: Record<string, any>,
    previousStepsData: Record<string, any>,
    payloadFields?: string[]
  ): Promise<ValidationResponse> {
    try {
      const requestData: RequestData = {
        currentStep: currentData,
        previousData: previousStepsData,
      };

      if (payloadFields && payloadFields.length > 0) {
        requestData.payloadFields = payloadFields.reduce((acc, field) => {
          if (field in previousStepsData) {
            acc[field] = previousStepsData[field];
          }
          return acc;
        }, {} as Record<string, any>);
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error("Validation request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Validation error:", error);
      throw error;
    }
  }

  static applyValidationRules(
    rules: PayloadValidationRule[],
    payload: Record<string, any>
  ): Record<
    string,
    { visible: boolean; required: boolean; disabled: boolean }
  > {
    const fieldStates: Record<
      string,
      { visible: boolean; required: boolean; disabled: boolean }
    > = {};

    rules.forEach((rule) => {
      const ruleApplies = this.evaluatePayloadRule(rule, payload);

      rule.targetFields.forEach((fieldId: string | number) => {
        if (!fieldStates[fieldId]) {
          fieldStates[fieldId] = {
            visible: true,
            required: false,
            disabled: false,
          };
        }

        if (ruleApplies) {
          switch (rule.action) {
            case "hide":
              fieldStates[fieldId].visible = false;
              break;
            case "show":
              fieldStates[fieldId].visible = true;
              break;
          }
        }
      });
    });

    return fieldStates;
  }

  static validate(
    value: string,
    rules: ValidationRule[]
  ): FieldValidationResult {
    const errors: string[] = [];

    for (const rule of rules) {
      if (!this.validateRule(value, rule)) {
        errors.push(rule.message);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private static validateRule(value: string, rule: ValidationRule): boolean {
    if (!value && rule.type !== "required") return true;

    switch (rule.type) {
      case "required":
        return value.trim().length > 0;

      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

      case "minLength":
        return (
          value.length >= (typeof rule.value === "number" ? rule.value : 0)
        );

      case "maxLength":
        return (
          value.length <=
          (typeof rule.value === "number" ? rule.value : Number.MAX_VALUE)
        );

      case "pattern":
        if (typeof rule.value === "string") {
          return new RegExp(rule.value).test(value);
        }
        return true;

      case "cpf":
        return this.validateCPF(value);

      case "cnpj":
        return this.validateCNPJ(value);

      case "phone":
        return this.validatePhone(value);

      case "cep":
        return this.validateCEP(value);

      case "custom":
        if (typeof rule.value === "function") {
          return rule.value(value);
        }
        return true;

      default:
        return true;
    }
  }

  private static validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]/g, "");

    if (cpf.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }

    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }

    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;

    return true;
  }

  private static validateCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]/g, "");

    if (cnpj.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    let size = cnpj.length - 2;
    let numbers = cnpj.substring(0, size);
    const digits = cnpj.substring(size);
    let sum = 0;
    let pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    size = size + 1;
    numbers = cnpj.substring(0, size);
    sum = 0;
    pos = size - 7;

    for (let i = size; i >= 1; i--) {
      sum += parseInt(numbers.charAt(size - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
  }

  private static validatePhone(phone: string): boolean {
    phone = phone.replace(/[^\d]/g, "");
    return phone.length >= 10 && phone.length <= 11;
  }

  private static validateCEP(cep: string): boolean {
    cep = cep.replace(/[^\d]/g, "");
    return cep.length === 8;
  }
}
