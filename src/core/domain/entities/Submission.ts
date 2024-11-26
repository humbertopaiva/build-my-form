export interface Submission {
  id: string;
  formId: string;
  fields: SubmissionField[];
  createdAt: Date;
  ip?: string;
  userAgent?: string;
}

export interface SubmissionField {
  fieldId: string;
  value: string;
}
