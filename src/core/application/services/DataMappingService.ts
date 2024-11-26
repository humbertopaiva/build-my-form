/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IDataMappingService,
  DataMappingRule,
  DataMappingOperation,
} from "@/core/domain/entities/DataMapping";

export class DataMappingService implements IDataMappingService {
  validatePayload(payload: string): boolean {
    try {
      JSON.parse(payload);
      return true;
    } catch (e) {
      return false;
    }
  }

  extractPaths(obj: any, prefix = ""): string[] {
    let paths: string[] = [];

    Object.entries(obj || {}).forEach(([key, value]) => {
      const newPath = prefix ? `${prefix}.${key}` : key;

      if (value && typeof value === "object" && !Array.isArray(value)) {
        paths = [...paths, newPath, ...this.extractPaths(value, newPath)];
      } else {
        paths.push(newPath);
      }
    });

    return paths;
  }

  applyMapping(data: any, rules: DataMappingRule[]): DataMappingOperation[] {
    return rules.map((rule) => {
      const value = this.getValueFromPath(data, rule.source);

      if (rule.transform) {
        return {
          field: rule.target,
          operation: "transform",
          value: this.executeTransform(value, rule.transform),
        };
      }

      return {
        field: rule.target,
        operation: "set",
        value,
      };
    });
  }

  executeTransform(value: any, transform: string): any {
    try {
      // Cria uma função segura que só tem acesso ao valor
      const transformFn = new Function("value", `return ${transform}`);
      return transformFn(value);
    } catch (error) {
      console.error("Transform error:", error);
      return value;
    }
  }

  private getValueFromPath(obj: any, path: string): any {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  }
}
