/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/core/application/services/ValidationManager.ts
import {
  StepValidation,
  StepConditionalLogic,
} from "@/core/domain/entities/Form";

export class ValidationManager {
  static async validateStep(
    stepLogic: StepConditionalLogic,
    formData: Record<string, any>
  ): Promise<ValidationResult> {
    try {
      // Fazer a chamada para o endpoint configurado
      const response = await fetch(stepLogic.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Validation failed");
      }

      const validationData = await response.json();

      // Processar cada regra de validação
      const results = stepLogic.validation.map((rule) =>
        this.processValidationRule(rule, validationData)
      );

      return {
        isValid: results.every((r) => r.isValid),
        actions: results.flatMap((r) => r.actions),
        errors: results.flatMap((r) => r.errors),
      };
    } catch (error) {
      console.error("Validation error:", error);
      throw error;
    }
  }

  private static processValidationRule(
    rule: StepValidation,
    data: any
  ): RuleValidationResult {
    const fieldValue = data[rule.field];
    const result: RuleValidationResult = {
      isValid: false,
      actions: [],
      errors: [],
    };

    try {
      result.isValid = this.evaluateCondition(fieldValue, rule);

      if (result.isValid) {
        result.actions.push({
          type: rule.action,
          fields: rule.targetFields || [],
        });
      } else {
        result.errors.push(`Validation failed for field ${rule.field}`);
      }
    } catch (error) {
      result.errors.push(`Error processing rule for field ${rule.field}`);
    }

    return result;
  }

  private static evaluateCondition(value: any, rule: StepValidation): boolean {
    switch (rule.operator) {
      case "equals":
        return value === rule.value;
      case "contains":
        return Array.isArray(value)
          ? value.includes(rule.value)
          : String(value).includes(String(rule.value));
      case "greater":
        return Number(value) > Number(rule.value);
      case "less":
        return Number(value) < Number(rule.value);
      case "between":
        const [min, max] = rule.value;
        return Number(value) >= min && Number(value) <= max;
      case "exists":
        return value != null && value !== "";
      default:
        return false;
    }
  }
}

interface ValidationResult {
  isValid: boolean;
  actions: ValidationAction[];
  errors: string[];
}

interface ValidationAction {
  type: "show" | "hide" | "require" | "skip";
  fields: string[];
}

interface RuleValidationResult {
  isValid: boolean;
  actions: ValidationAction[];
  errors: string[];
}
