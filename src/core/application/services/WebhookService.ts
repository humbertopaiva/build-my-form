/* eslint-disable @typescript-eslint/no-explicit-any */
// core/application/services/WebhookService.ts

import { WebhookConfig } from "@/core/domain/entities/Field";

export class WebhookService {
  async execute(
    webhook: WebhookConfig,
    data: Record<string, any>
  ): Promise<Record<string, any>> {
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...webhook.headers,
      };

      // Adicionar autenticação se configurada
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
            if (key && value) headers[key] = value;
            break;
        }
      }

      const response = await fetch(webhook.endpoint, {
        method: webhook.method,
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Webhook execution failed: ${error}`);
    }
  }
}
