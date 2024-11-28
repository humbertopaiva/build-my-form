/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// core/application/infrastructure/database/repositories/PrismaFormStepRepository.ts

import { IFormStepRepository } from "../../../../domain/repositories/IFormStepRepository";
import {
  Field,
  WebhookConfig,
  WebhookVariable,
} from "@/core/domain/entities/Field";
import { FormStep } from "@/core/domain/entities/Form";
import { PrismaClient } from "@prisma/client";

export class PrismaFormStepRepository implements IFormStepRepository {
  constructor(private prisma: any) {}

  private adaptField(prismaField: any): Field {
    return {
      id: prismaField.id,
      formId: prismaField.formId,
      name: prismaField.name,
      label: prismaField.label,
      type: prismaField.type,
      placeholder: prismaField.placeholder,
      required: prismaField.required,
      order: prismaField.order,
      options: prismaField.options
        ? JSON.parse(prismaField.options)
        : undefined,
      validation: prismaField.validation
        ? JSON.parse(prismaField.validation)
        : undefined,
      helpText: prismaField.helpText,
      webhookConditions: prismaField.conditions?.map(this.adaptCondition),
    };
  }

  private adaptWebhook(prismaWebhook: any): WebhookConfig | undefined {
    if (!prismaWebhook) return undefined;

    return {
      enabled: prismaWebhook.enabled,
      endpoint: prismaWebhook.endpoint,
      method: prismaWebhook.method,
      headers: prismaWebhook.headers
        ? JSON.parse(prismaWebhook.headers)
        : undefined,
      authType: prismaWebhook.authType || "none",
      authValue: prismaWebhook.authValue,
      variables: prismaWebhook.variables?.map(this.adaptVariable) || [],
      selectedFields: prismaWebhook.selectedFields
        ? JSON.parse(prismaWebhook.selectedFields)
        : [], // Adicionando selectedFields com valor padrão
    };
  }

  private adaptVariable(prismaVariable: any): WebhookVariable {
    return {
      name: prismaVariable.name,
      path: prismaVariable.path,
      type: prismaVariable.type,
    };
  }

  private adaptStep(prismaStep: any): FormStep {
    return {
      id: prismaStep.id,
      formId: prismaStep.formId,
      order: prismaStep.order,
      title: prismaStep.title,
      description: prismaStep.description,
      fields: prismaStep.fields?.map(this.adaptField) || [],
      webhook: this.adaptWebhook(prismaStep.webhook),
      variables: prismaStep.variables?.map(this.adaptVariable) || [],
    };
  }

  private adaptCondition(prismaCondition: any) {
    return {
      variablePath: prismaCondition.variablePath,
      operator: prismaCondition.operator,
      value: prismaCondition.value,
      action: prismaCondition.action,
    };
  }

  async findById(id: string): Promise<FormStep | null> {
    const step = await this.prisma.formStep.findUnique({
      where: { id },
      include: {
        fields: {
          include: {
            conditions: true,
          },
        },
        webhook: true,
        variables: true,
      },
    });

    if (!step) return null;

    return this.adaptStep(step);
  }

  async update(id: string, data: Partial<FormStep>): Promise<FormStep> {
    const { fields, webhook, variables, ...stepData } = data;

    const updated = await this.prisma.formStep.update({
      where: { id },
      data: {
        ...stepData,
        ...(fields && {
          fields: {
            deleteMany: {},
            create: fields.map((field) => ({
              ...field,
              options: field.options ? JSON.stringify(field.options) : null,
              validation: field.validation
                ? JSON.stringify(field.validation)
                : null,
            })),
          },
        }),
        ...(webhook && {
          webhook: {
            upsert: {
              create: {
                ...webhook,
                headers: webhook.headers
                  ? JSON.stringify(webhook.headers)
                  : null,
                selectedFields: webhook.selectedFields
                  ? JSON.stringify(webhook.selectedFields)
                  : "[]",
              },
              update: {
                ...webhook,
                headers: webhook.headers
                  ? JSON.stringify(webhook.headers)
                  : null,
                selectedFields: webhook.selectedFields
                  ? JSON.stringify(webhook.selectedFields)
                  : "[]",
              },
            },
          },
        }),
        ...(variables && {
          variables: {
            deleteMany: {},
            create: variables,
          },
        }),
      },
      include: {
        fields: {
          include: {
            conditions: true,
          },
        },
        webhook: true,
        variables: true,
      },
    });

    return this.adaptStep(updated);
  }

  async create(data: Omit<FormStep, "id">): Promise<FormStep> {
    const { fields, webhook, variables, ...stepData } = data;

    const created = await this.prisma.formStep.create({
      data: {
        ...stepData,
        fields: {
          create: fields?.map((field) => ({
            ...field,
            options: field.options ? JSON.stringify(field.options) : null,
            validation: field.validation
              ? JSON.stringify(field.validation)
              : null,
          })),
        },
        webhook: webhook
          ? {
              create: {
                ...webhook,
                headers: webhook.headers
                  ? JSON.stringify(webhook.headers)
                  : null,
                selectedFields: webhook.selectedFields
                  ? JSON.stringify(webhook.selectedFields)
                  : "[]",
              },
            }
          : undefined,
        variables: {
          create: variables,
        },
      },
      include: {
        fields: {
          include: {
            conditions: true,
          },
        },
        webhook: true,
        variables: true,
      },
    });

    return this.adaptStep(created);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.formStep.delete({
      where: { id },
    });
  }

  async findByFormId(formId: string): Promise<FormStep[]> {
    const steps = await this.prisma.formStep.findMany({
      where: { formId },
      include: {
        fields: {
          include: {
            conditions: true,
          },
        },
        webhook: true,
        variables: true,
      },
      orderBy: {
        order: "asc",
      },
    });

    return steps.map((step: any) => this.adaptStep(step));
  }
}
