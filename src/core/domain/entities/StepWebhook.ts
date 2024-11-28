// core/domain/entities/StepWebhook.ts

export interface StepWebhook {
  id: string;
  stepId: string;
  endpoint: string;
  method: WebhookMethod;
  headers?: Record<string, string>;
  authType?: WebhookAuthType;
  authValue?: string;
  useStepData: boolean;
}

export type WebhookMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type WebhookAuthType = "basic" | "bearer" | "custom";

export interface WebhookConfig {
  enabled: boolean;
  webhook: Omit<StepWebhook, "id" | "stepId">;
}

export interface WebhookPayloadMapping {
  source: string;
  target: string;
  transform?: string;
}
