/* eslint-disable @typescript-eslint/no-explicit-any */
// src/core/infrastructure/database/repositories/PrismaFormRepository.ts
import { PrismaClient } from "@prisma/client";
import { IFormRepository } from "@/core/domain/repositories/IFormRepository";
import { Form } from "@/core/domain/entities/Form";

export class PrismaFormRepository implements IFormRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: string): Promise<Form | null> {
    const form = await this.prisma.form.findUnique({
      where: { id },
      include: { fields: true },
    });

    return form as Form | null;
  }

  async getFormSubmissions(formId: string) {
    return this.prisma.submission.findMany({
      where: { formId },
      include: {
        fields: {
          include: {
            field: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async create(
    form: Omit<Form, "id" | "createdAt" | "updatedAt">
  ): Promise<Form> {
    const createdForm = await this.prisma.form.create({
      data: {
        name: form.name,
        slug: form.slug,
        submitLabel: form.submitLabel,
        endpoint: form.endpoint,
        isActive: true,
        fields: {
          create: form.fields.map((field) => ({
            order: field.order,
            name: field.name,
            label: field.label,
            type: field.type,
            placeholder: field.placeholder,
            required: field.required,
            validation: field.validation as any,
          })),
        },
      },
      include: {
        fields: true,
      },
    });

    return createdForm as Form;
  }

  async findBySlug(slug: string): Promise<Form | null> {
    const form = await this.prisma.form.findUnique({
      where: { slug },
      include: {
        fields: true,
      },
    });

    return form as Form | null;
  }

  async findAll(): Promise<Form[]> {
    const forms = await this.prisma.form.findMany({
      include: {
        fields: true,
      },
    });

    return forms as Form[];
  }

  async update(id: string, form: Partial<Form>): Promise<Form> {
    const updatedForm = await this.prisma.form.update({
      where: { id },
      data: {
        name: form.name,
        slug: form.slug,
        submitLabel: form.submitLabel,
        endpoint: form.endpoint,
        isActive: form.isActive,
      },
      include: {
        fields: true,
      },
    });

    return updatedForm as Form;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.form.delete({
      where: { id },
    });
  }
}
