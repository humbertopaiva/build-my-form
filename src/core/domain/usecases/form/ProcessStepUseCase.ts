/* eslint-disable @typescript-eslint/no-explicit-any */
// core/domain/usecases/form/ProcessStepUseCase.ts

import { WebhookService } from "@/core/application/services/WebhookService";
import { ConditionalLogicService } from "@/core/application/services/ConditionalLogicService";
import { IFormStepRepository } from "../../repositories/IFormStepRepository";

export class ProcessStepUseCase {
  constructor(
    private formStepRepository: IFormStepRepository,
    private webhookService: WebhookService,
    private conditionalLogicService: ConditionalLogicService
  ) {}

  async execute(stepId: string, formData: Record<string, any>) {
    // 1. Buscar configurações do step
    const step = await this.formStepRepository.findById(stepId);
    if (!step) throw new Error("Step not found");

    // 2. Se houver webhook, fazer a chamada
    let variables = {};
    if (step.webhook?.enabled) {
      const response = await this.webhookService.execute(
        step.webhook,
        formData
      );
      variables = this.conditionalLogicService.extractVariables(
        response,
        step.variables
      );
    }

    // 3. Avaliar campos baseado nas variáveis
    const fieldsVisibility = step.fields.map((field) => ({
      fieldId: field.id,
      visible: this.conditionalLogicService.evaluateFieldConditions(
        field,
        variables
      ),
    }));

    return {
      variables,
      fieldsVisibility,
    };
  }
}
