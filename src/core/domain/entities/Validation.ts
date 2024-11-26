/* eslint-disable @typescript-eslint/no-explicit-any */
// src/core/domain/entities/Validation.ts
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
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

// src/core/application/services/ValidationService.ts

export class ValidationService {
  private static validateCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]/g, "");

    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;

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
    if (/^(\d)\1+$/.test(cnpj)) return false;

    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    const digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0))) return false;

    length += 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += parseInt(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1))) return false;

    return true;
  }

  private static validatePhone(phone: string): boolean {
    const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
    return phoneRegex.test(phone);
  }

  private static validateCEP(cep: string): boolean {
    const cepRegex = /^\d{5}-\d{3}$/;
    return cepRegex.test(cep);
  }

  private static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  public static validate(
    value: string,
    rules: ValidationRule[]
  ): ValidationResult {
    const errors: string[] = [];

    for (const rule of rules) {
      let isValid = true;

      switch (rule.type) {
        case "required":
          isValid = !!value?.trim();
          break;

        case "email":
          isValid = !value || this.validateEmail(value);
          break;

        case "minLength":
          isValid = !value || value.length >= rule.value;
          break;

        case "maxLength":
          isValid = !value || value.length <= rule.value;
          break;

        case "pattern":
          isValid = !value || new RegExp(rule.value).test(value);
          break;

        case "cpf":
          isValid = !value || this.validateCPF(value);
          break;

        case "cnpj":
          isValid = !value || this.validateCNPJ(value);
          break;

        case "phone":
          isValid = !value || this.validatePhone(value);
          break;

        case "cep":
          isValid = !value || this.validateCEP(value);
          break;

        case "custom":
          try {
            if (rule.value) {
              const customValidation = new Function("value", rule.value);
              isValid = !value || customValidation(value);
            }
          } catch (error) {
            console.error("Erro na validação customizada:", error);
            isValid = false;
          }
          break;
      }

      if (!isValid) {
        errors.push(rule.message || this.getDefaultMessage(rule.type));
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private static getDefaultMessage(type: ValidationRuleType): string {
    const messages: Record<ValidationRuleType, string> = {
      required: "Campo obrigatório",
      email: "Email inválido",
      minLength: "Comprimento mínimo não atingido",
      maxLength: "Comprimento máximo excedido",
      pattern: "Formato inválido",
      cpf: "CPF inválido",
      cnpj: "CNPJ inválido",
      phone: "Telefone inválido",
      cep: "CEP inválido",
      custom: "Validação customizada falhou",
    };

    return messages[type];
  }

  public static async validateAsync(
    value: string,
    rules: ValidationRule[]
  ): Promise<ValidationResult> {
    // Implementação futura para validações assíncronas
    return this.validate(value, rules);
  }
}
