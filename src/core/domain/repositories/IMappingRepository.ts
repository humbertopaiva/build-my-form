import { FieldMapping } from "../entities/FieldMapping";

export interface IMappingRepository {
  create(mapping: Omit<FieldMapping, "id">): Promise<FieldMapping>;
  createMany(mappings: Omit<FieldMapping, "id">[]): Promise<FieldMapping[]>;
  update(id: string, mapping: Partial<FieldMapping>): Promise<FieldMapping>;
  delete(id: string): Promise<void>;
  deleteMany(ids: string[]): Promise<void>;
  findByStepId(stepId: string): Promise<FieldMapping[]>;
}
