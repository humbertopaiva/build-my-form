import { Submission } from "../entities/Submission";

export interface ISubmissionRepository {
  create(submission: Omit<Submission, "id" | "createdAt">): Promise<Submission>;
  findByFormId(formId: string): Promise<Submission[]>;
  findById(id: string): Promise<Submission | null>;
}
