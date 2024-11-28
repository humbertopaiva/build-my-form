// core/domain/repositories/IFormStepRepository.ts

import { FormStep } from "../entities/Form";

export interface IFormStepRepository {
  findById(id: string): Promise<FormStep | null>;
  update(id: string, data: Partial<FormStep>): Promise<FormStep>;
  create(data: Omit<FormStep, "id">): Promise<FormStep>;
  delete(id: string): Promise<void>;
  findByFormId(formId: string): Promise<FormStep[]>;
}
