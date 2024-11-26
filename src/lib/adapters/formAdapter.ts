/* eslint-disable @typescript-eslint/no-explicit-any */

import { Field, FieldType } from "@/core/domain/entities/Field";
import { Form } from "@/core/domain/entities/Form";
import { Prisma } from "@prisma/client";

type PrismaForm = Prisma.FormGetPayload<{
  include: {
    fields: true;
  };
}>;

export function adaptPrismaForm(prismaForm: PrismaForm): Form {
  return {
    id: prismaForm.id,
    name: prismaForm.name,
    slug: prismaForm.slug,
    submitLabel: prismaForm.submitLabel,
    endpoint: prismaForm.endpoint ?? undefined,
    isActive: prismaForm.isActive,
    createdAt: prismaForm.createdAt,
    updatedAt: prismaForm.updatedAt,
    fields: prismaForm.fields.map(
      (field): Field => ({
        id: field.id,
        formId: field.formId,
        name: field.name,
        label: field.label,
        type: field.type as FieldType,
        placeholder: field.placeholder || undefined,
        required: field.required,
        order: field.order,
        validation: field.validation as any,
      })
    ),
  };
}
