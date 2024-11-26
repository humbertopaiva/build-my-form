import { Form } from "../entities/Form";

export interface IFormRepository {
  create(form: Omit<Form, "id" | "createdAt" | "updatedAt">): Promise<Form>;
  findBySlug(slug: string): Promise<Form | null>;
  findAll(): Promise<Form[]>;
  update(id: string, form: Partial<Form>): Promise<Form>;
  delete(id: string): Promise<void>;
}
