// src/core/application/services/ValidationService.ts
import {
  ValidationRule,
  ValidationResult,
} from "@/core/domain/entities/Validation";

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

    // Validação dos dígitos verificadores
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

  public static validate(
    value: string,
    rules: ValidationRule[]
  ): ValidationResult {
    const errors: string[] = [];

    for (const rule of rules) {
      switch (rule.type) {
        case "required":
          if (!value || !value.trim()) {
            errors.push(rule.message || "Campo obrigatório");
          }
          break;

        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (value && !emailRegex.test(value)) {
            errors.push(rule.message || "Email inválido");
          }
          break;

        case "minLength":
          if (value && value.length < rule.value) {
            errors.push(rule.message || `Mínimo de ${rule.value} caracteres`);
          }
          break;

        case "maxLength":
          if (value && value.length > rule.value) {
            errors.push(rule.message || `Máximo de ${rule.value} caracteres`);
          }
          break;

        case "pattern":
          if (value && !new RegExp(rule.value).test(value)) {
            errors.push(rule.message || "Formato inválido");
          }
          break;

        case "cpf":
          if (value && !this.validateCPF(value)) {
            errors.push(rule.message || "CPF inválido");
          }
          break;

        case "cnpj":
          if (value && !this.validateCNPJ(value)) {
            errors.push(rule.message || "CNPJ inválido");
          }
          break;

        case "phone":
          const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/;
          if (value && !phoneRegex.test(value)) {
            errors.push(rule.message || "Telefone inválido");
          }
          break;

        case "cep":
          const cepRegex = /^\d{5}-\d{3}$/;
          if (value && !cepRegex.test(value)) {
            errors.push(rule.message || "CEP inválido");
          }
          break;

        case "custom":
          try {
            if (rule.value) {
              const customValidation = new Function("value", rule.value);
              const isValid = customValidation(value);
              if (!isValid) {
                errors.push(rule.message || "Validação customizada falhou");
              }
            }
          } catch (error) {
            console.error("Erro na validação customizada:", error);
            errors.push("Erro na validação");
          }
          break;
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
