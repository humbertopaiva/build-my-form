/* eslint-disable @typescript-eslint/no-explicit-any */
// core/application/infrastructure/database/repositories/PrismaWebhookRepository.ts

import { IWebhookRepository } from "@/core/domain/repositories/IWebhookRepository";
import { Webhook, WebhookResponse } from "@/core/domain/entities/Webhook";
// import { PrismaClient } from "@prisma/client";

export class PrismaWebhookRepository implements IWebhookRepository {
  constructor(private prisma: any) {}

  async create(webhook: Omit<Webhook, "id">): Promise<Webhook> {
    return this.prisma.webhook.create({
      data: webhook,
    });
  }

  async update(id: string, webhook: Partial<Webhook>): Promise<Webhook> {
    return this.prisma.webhook.update({
      where: { id },
      data: webhook,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.webhook.delete({
      where: { id },
    });
  }

  async execute(webhook: Webhook, payload: any): Promise<WebhookResponse> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...webhook.headers,
    };

    if (webhook.authType && webhook.authType !== "none") {
      switch (webhook.authType) {
        case "basic":
          headers["Authorization"] = `Basic ${webhook.authValue}`;
          break;
        case "bearer":
          headers["Authorization"] = `Bearer ${webhook.authValue}`;
          break;
        case "custom":
          const [key, value] = webhook.authValue?.split(":") || [];
          if (key && value) {
            headers[key] = value;
          }
          break;
      }
    }

    const response = await fetch(webhook.endpoint, {
      method: webhook.method,
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      data,
      meta: {
        statusCode: response.status,
        headers: Object.fromEntries(response.headers),
      },
    };
  }
}
