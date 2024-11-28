/* eslint-disable @typescript-eslint/no-explicit-any */
// core/application/services/DataMappingService.ts
import {
  DataMapping,
  FieldTransformation,
  TransformationType,
} from "@/core/domain/entities/DataMapping";
import { Field } from "@/core/domain/entities/Field";

export class DataMappingService {
  mapWebhookData(
    mapping: DataMapping,
    webhookResponse: Record<string, any>,
    currentStepFields: Field[]
  ): Record<string, any> {
    const mappedData: Record<string, any> = {};

    // Mapeia os campos básicos
    Object.entries(mapping.mapping).forEach(([source, target]) => {
      const value = this.getNestedValue(webhookResponse, source);
      const targetField = currentStepFields.find((f) => f.name === target);

      if (targetField && value !== undefined) {
        mappedData[target] = this.formatValue(value, targetField.type);
      }
    });

    // Aplica transformações se existirem
    if (mapping.transformations?.length) {
      this.applyTransformations(mappedData, mapping.transformations);
    }

    return mappedData;
  }

  private applyTransformations(
    data: Record<string, any>,
    transformations: FieldTransformation[]
  ): void {
    transformations.forEach((transform) => {
      const value = data[transform.field];
      if (value === undefined) return;

      data[transform.field] = this.executeTransformation(
        value,
        transform.type,
        transform.config
      );
    });
  }

  private executeTransformation(
    value: any,
    type: TransformationType,
    config?: Record<string, any>
  ): any {
    switch (type) {
      case "format":
        return this.formatWithConfig(value, config?.format);

      case "calculate":
        return this.calculateWithFormula(value, config?.formula);

      case "concat":
        return this.concatenateValues(value, config?.separator || " ");

      case "split":
        return this.splitValue(value, config?.separator);

      case "custom":
        return this.executeCustomTransform(value, config?.customFn);

      default:
        return value;
    }
  }

  private formatWithConfig(value: any, format?: string): string {
    if (!format) return String(value);

    // Exemplo: data no formato "YYYY-MM-DD"
    if (
      format.includes("YYYY") ||
      format.includes("MM") ||
      format.includes("DD")
    ) {
      const date = new Date(value);
      return format
        .replace("YYYY", date.getFullYear().toString())
        .replace("MM", (date.getMonth() + 1).toString().padStart(2, "0"))
        .replace("DD", date.getDate().toString().padStart(2, "0"));
    }

    // Números com casas decimais específicas
    if (format.includes("#")) {
      const decimals = format.split(".")[1]?.length || 0;
      return Number(value).toFixed(decimals);
    }

    return String(value);
  }

  private calculateWithFormula(value: any, formula?: string): number {
    if (!formula) return Number(value);

    try {
      // Substitui 'x' na fórmula pelo valor atual
      const calculationFn = new Function("x", `return ${formula}`);
      return calculationFn(Number(value));
    } catch (error) {
      console.error("Calculation error:", error);
      return Number(value);
    }
  }

  private concatenateValues(value: any, separator: string): string {
    if (Array.isArray(value)) {
      return value.join(separator);
    }
    return String(value);
  }

  private splitValue(value: string, separator?: string): string[] {
    return String(value)
      .split(separator || ",")
      .map((s) => s.trim());
  }

  private executeCustomTransform(value: any, customFn?: string): any {
    if (!customFn) return value;

    try {
      const transformFn = new Function("value", customFn);
      return transformFn(value);
    } catch (error) {
      console.error("Custom transform error:", error);
      return value;
    }
  }

  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  }

  private formatValue(value: any, fieldType: string): any {
    switch (fieldType) {
      case "number":
        return Number(value);
      case "boolean":
        return Boolean(value);
      case "date":
        return new Date(value).toISOString();
      case "array":
        return Array.isArray(value) ? value : [value];
      default:
        return String(value);
    }
  }
}
