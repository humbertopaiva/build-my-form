/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DataMappingRule {
  source: string;
  target: string;
  transform?: string;
}

export interface DataMappingConfig {
  rules: DataMappingRule[];
  endpoint: string;
  samplePayload?: string;
}

export type DataMappingOperation = {
  field: string;
  operation: "set" | "transform";
  value: any;
};

// Interface para o serviço de mapeamento
export interface IDataMappingService {
  validatePayload(payload: string): boolean;
  extractPaths(payload: any): string[];
  applyMapping(data: any, rules: DataMappingRule[]): DataMappingOperation[];
  executeTransform(value: any, transform: string): any;
}
