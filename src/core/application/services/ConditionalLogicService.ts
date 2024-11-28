/* eslint-disable @typescript-eslint/no-explicit-any */
// core/application/services/ConditionalLogicService.ts

import { Field, WebhookVariable } from "@/core/domain/entities/Field";

export class ConditionalLogicService {
  async evaluateFieldConditions(
    field: Field,
    variables: Record<string, any>
  ): Promise<boolean> {
    if (!field.webhookConditions?.length) return true;

    return field.webhookConditions.every((condition) => {
      const variableValue = this.getValueByPath(
        variables,
        condition.variablePath
      );

      switch (condition.operator) {
        case "equals":
          return variableValue === condition.value;

        case "notEquals":
          return variableValue !== condition.value;

        case "contains":
          if (Array.isArray(variableValue)) {
            return variableValue.includes(condition.value);
          }
          return String(variableValue).includes(String(condition.value));

        case "greaterThan":
          return Number(variableValue) > Number(condition.value);

        case "lessThan":
          return Number(variableValue) < Number(condition.value);

        case "exists":
          return variableValue != null;

        case "notExists":
          return variableValue == null;

        default:
          return true;
      }
    });
  }

  extractVariables(
    response: Record<string, any>,
    variables: WebhookVariable[]
  ): Record<string, any> {
    const result: Record<string, any> = {};

    variables.forEach((variable) => {
      const value = this.getValueByPath(response, variable.path);
      result[variable.name] = this.convertValue(value, variable.type);
    });

    return result;
  }

  private getValueByPath(obj: any, path: string): any {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  }

  private convertValue(value: any, type: WebhookVariable["type"]): any {
    switch (type) {
      case "number":
        return Number(value);
      case "boolean":
        return Boolean(value);
      case "array":
        return Array.isArray(value) ? value : [value];
      default:
        return String(value);
    }
  }
}
