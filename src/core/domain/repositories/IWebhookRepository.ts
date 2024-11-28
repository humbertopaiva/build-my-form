/* eslint-disable @typescript-eslint/no-explicit-any */
import { Webhook, WebhookResponse } from "../entities/Webhook";

export interface IWebhookRepository {
  create(webhook: Omit<Webhook, "id">): Promise<Webhook>;
  update(id: string, webhook: Partial<Webhook>): Promise<Webhook>;
  delete(id: string): Promise<void>;
  execute(webhook: Webhook, payload: any): Promise<WebhookResponse>;
}
