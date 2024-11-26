/* eslint-disable @typescript-eslint/no-explicit-any */
// src/core/domain/usecases/form/CreateFormUseCase.ts
import { Form } from "../../entities/Form";
import { IFormRepository } from "../../repositories/IFormRepository";

type FieldType = "text" | "number" | "email" | "password"; // Add other field types as needed

interface CreateFormRequest {
  name: string;
  slug: string;
  submitLabel: string;
  endpoint?: string;
  fields: {
    type: FieldType;
    label: string;
    order: number;
    placeholder?: string;
    required: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validation?: any;
    options?: any;
    helpText?: any;
  }[];
}

export class CreateFormUseCase {
  constructor(private formRepository: IFormRepository) {}

  async execute(data: CreateFormRequest): Promise<Form> {
    // Validação básica
    if (!data.name || !data.slug) {
      throw new Error("Name and slug are required");
    }

    // Verificar se o slug já existe
    const existingForm = await this.formRepository.findBySlug(data.slug);
    if (existingForm) {
      throw new Error("Slug already exists");
    }

    // Criar o formulário
    return this.formRepository.create({
      ...data,
      isActive: true,
      fields: data.fields.map((field, index) => ({
        ...field,
        name: field.label.toLowerCase().replace(/\s+/g, "_"), // add name property
        order: field.order || index + 1,
        formId: "", // será preenchido pelo Prisma
        id: "", // será preenchido pelo Prisma
        options: field.options || [], // add default value for options
        helpText: field.helpText || "", // add default value for helpText
      })),
    });
  }
}
