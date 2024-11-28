/* eslint-disable @typescript-eslint/no-explicit-any */
// core/application/services/StepWebhookService.ts

import {
  StepWebhook,
  WebhookPayloadMapping,
} from "@/core/domain/entities/StepWebhook";

export interface WebhookResponse {
  data: Record<string, any>;
  meta?: Record<string, any>;
}

export class StepWebhookService {
  async executeWebhook(
    webhook: StepWebhook,
    stepData: Record<string, any>,
    previousStepsData?: Record<string, any>,
    payloadMapping?: WebhookPayloadMapping[]
  ): Promise<WebhookResponse> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...webhook.headers,
    };

    // Adiciona autenticação se configurada
    if (webhook.authType) {
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

    // Prepara o payload com mapeamento
    let payload = {};

    if (webhook.useStepData) {
      if (payloadMapping && payloadMapping.length > 0) {
        payload = this.mapPayload(
          stepData,
          previousStepsData || {},
          payloadMapping
        );
      } else {
        payload = {
          stepData,
          previousSteps: previousStepsData,
        };
      }
    }

    try {
      const response = await fetch(webhook.endpoint, {
        method: webhook.method,
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(
          `Webhook request failed with status ${response.status}`
        );
      }

      const data = await response.json();

      return {
        data,
        meta: {
          statusCode: response.status,
          headers: Object.fromEntries(response.headers.entries()),
        },
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? `Webhook execution failed: ${error.message}`
          : "Webhook execution failed"
      );
    }
  }

  private mapPayload(
    stepData: Record<string, any>,
    previousData: Record<string, any>,
    mapping: WebhookPayloadMapping[]
  ): Record<string, any> {
    const result: Record<string, any> = {};

    for (const map of mapping) {
      let value = this.getValueFromPath(
        { stepData, previousSteps: previousData },
        map.source
      );

      if (map.transform) {
        try {
          const transformFn = new Function("value", map.transform);
          value = transformFn(value);
        } catch (error) {
          console.error("Transform function error:", error);
        }
      }

      if (value !== undefined) {
        this.setValueByPath(result, map.target, value);
      }
    }

    return result;
  }

  private getValueFromPath(obj: Record<string, any>, path: string): any {
    return path.split(".").reduce((acc, part) => acc?.[part], obj);
  }

  private setValueByPath(
    obj: Record<string, any>,
    path: string,
    value: any
  ): void {
    const parts = path.split(".");
    const lastPart = parts.pop()!;
    const target = parts.reduce((acc, part) => {
      if (!(part in acc)) acc[part] = {};
      return acc[part];
    }, obj);
    target[lastPart] = value;
  }
}
