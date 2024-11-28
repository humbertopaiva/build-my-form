/* eslint-disable @typescript-eslint/no-explicit-any */
// core/domain/entities/Webhook.ts

import { WebhookVariable } from "./Field";

export interface Webhook {
  id: string;
  stepId: string;
  enabled: boolean;
  endpoint: string;
  method: WebhookMethod;
  headers?: Record<string, string>;
  authType?: WebhookAuthType;
  authValue?: string;
  selectedFields: Array<{
    id: string;
    paramName: string;
    sendType: "body" | "query";
  }>;
  variables: WebhookVariable[];
}

export type WebhookMethod = "GET" | "POST" | "PUT" | "PATCH";
export type WebhookAuthType = "none" | "basic" | "bearer" | "custom";

export interface WebhookResponse {
  data: Record<string, any>;
  meta?: Record<string, any>;
}
