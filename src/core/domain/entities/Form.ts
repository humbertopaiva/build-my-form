import { Field } from "./Field";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Form {
  id: string;
  name: string;
  slug: string;
  fields: Field[];
  submitLabel: string;
  endpoint?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// export interface Field {
//   options: any;
//   helpText: any;
//   id: string;
//   formId: string;
//   order: number;
//   name: string;
//   label: string;
//   type: string;
//   placeholder?: string;
//   required: boolean;
//   validation?: any;
// }
