/* eslint-disable @typescript-eslint/no-explicit-any */
// core/application/services/MappingService.ts

import { IMappingRepository } from "@/core/domain/repositories/IMappingRepository";

export class MappingService {
  constructor(private mappingRepository: IMappingRepository) {}

  async applyMappings(
    stepId: string,
    sourceData: Record<string, any>
  ): Promise<Record<string, any>> {
    const mappings = await this.mappingRepository.findByStepId(stepId);
    const result: Record<string, any> = {};

    for (const mapping of mappings) {
      const sourceValue = sourceData[mapping.sourceFieldId];

      if (sourceValue !== undefined) {
        let transformedValue = sourceValue;

        if (mapping.transform) {
          try {
            const transformFn = new Function("value", mapping.transform);
            transformedValue = transformFn(sourceValue);
          } catch (error) {
            console.error("Transform error:", error);
          }
        }

        result[mapping.targetFieldId] = transformedValue;
      }
    }

    return result;
  }
}
