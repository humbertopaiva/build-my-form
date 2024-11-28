/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/BuilderComponents/StepSettings.tsx

import { useCallback, useState } from "react";

import { FormStep } from "@/core/domain/entities/Form";
import {
  ConditionOperator,
  WebhookConfig,
  WebhookFieldCondition,
  WebhookVariable,
} from "@/core/domain/entities/Field";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAtomValue } from "jotai";
import { useFormBuilder } from "@/store/form-builder";
import { X, Plus, Trash2 } from "lucide-react";
import { WebhookConfigStep } from "./WebhookConfigStep";

interface StepSettingsProps {
  step: FormStep;
  onClose: () => void;
  onUpdate: (updates: Partial<FormStep>) => void;
  onDelete: () => void;
}

export function StepSettings({
  step,
  onClose,
  onUpdate,
  onDelete,
}: StepSettingsProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [webhookEnabled, setWebhookEnabled] = useState(
    step.webhook?.enabled || false
  );
  const [variables, setVariables] = useState<WebhookVariable[]>(
    step.variables || []
  );
  const [fieldConditions, setFieldConditions] = useState<
    Record<string, WebhookFieldCondition[]>
  >(() => {
    // Inicializa as condições dos campos a partir do step
    const conditions: Record<string, WebhookFieldCondition[]> = {};
    step.fields.forEach((field) => {
      if (field.webhookConditions) {
        conditions[field.id] = field.webhookConditions;
      }
    });
    return conditions;
  });

  const { atoms } = useFormBuilder();
  const steps = useAtomValue(atoms.steps);

  // Estados do webhook
  const [endpoint, setEndpoint] = useState(step.webhook?.endpoint || "");
  const [method, setMethod] = useState<"GET" | "POST" | "PUT" | "PATCH">(
    step.webhook?.method || "POST"
  );
  const [authType, setAuthType] = useState<
    "none" | "basic" | "bearer" | "custom"
  >(step.webhook?.authType || "none");
  const [selectedFields, setSelectedFields] = useState<
    Array<{
      id: string;
      paramName: string;
      sendType: "body" | "query";
    }>
  >(step.webhook?.selectedFields || []);
  const [authValue, setAuthValue] = useState(step.webhook?.authValue || "");

  // Obter campos dos steps anteriores
  const getPreviousFields = useCallback(() => {
    const currentStepIndex = steps.findIndex((s) => s.id === step.id);
    if (currentStepIndex <= 0) return [];

    return steps.slice(0, currentStepIndex).flatMap((previousStep) =>
      previousStep.fields.map((field) => ({
        id: field.id,
        label: `${previousStep.title} - ${field.label}`,
        stepId: previousStep.id,
      }))
    );
  }, [steps, step.id]);

  const handleFieldConditionAdd = (fieldId: string) => {
    const currentConditions = fieldConditions[fieldId] || [];
    setFieldConditions({
      ...fieldConditions,
      [fieldId]: [
        ...currentConditions,
        {
          fieldId,
          variablePath: "",
          operator: "equals",
          value: "",
          action: "show",
        },
      ],
    });
  };

  const handleFieldConditionUpdate = (
    fieldId: string,
    index: number,
    updates: Partial<WebhookFieldCondition>
  ) => {
    const currentConditions = [...(fieldConditions[fieldId] || [])];
    currentConditions[index] = {
      ...currentConditions[index],
      ...updates,
    };
    setFieldConditions({
      ...fieldConditions,
      [fieldId]: currentConditions,
    });
  };

  const handleFieldConditionRemove = (fieldId: string, index: number) => {
    const currentConditions = fieldConditions[fieldId] || [];
    setFieldConditions({
      ...fieldConditions,
      [fieldId]: currentConditions.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = () => {
    const webhookConfig: WebhookConfig | undefined = webhookEnabled
      ? {
          enabled: true,
          endpoint,
          method,
          headers: {},
          authType,
          authValue,
          selectedFields,
          variables,
        }
      : undefined;

    const updates: Partial<FormStep> = {
      webhook: webhookConfig,
      variables,
      fields: step.fields.map((field) => ({
        ...field,
        webhookConditions: fieldConditions[field.id] || [],
      })),
    };

    onUpdate(updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed inset-0 p-4 md:p-6 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center">
          <div className="relative w-full max-w-[900px] rounded-lg shadow-lg border bg-background mx-auto">
            <div className="flex flex-col gap-1.5 p-6 border-b">
              <h2 className="text-lg font-semibold">Configurações da Etapa</h2>
              <p className="text-sm text-muted-foreground">
                Configure a integração e comportamento dos campos
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 gap-4 px-6">
                <TabsTrigger value="basic">Básico</TabsTrigger>
                <TabsTrigger value="webhook" disabled={!webhookEnabled}>
                  Webhook
                </TabsTrigger>
                <TabsTrigger value="variables" disabled={!webhookEnabled}>
                  Variáveis
                </TabsTrigger>
                <TabsTrigger value="conditions" disabled={!webhookEnabled}>
                  Condições
                </TabsTrigger>
              </TabsList>

              <div className="p-6 space-y-6">
                <TabsContent value="basic">
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <FormField
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título da Etapa</FormLabel>
                            <FormControl>
                              <Input {...field} defaultValue={step.title} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="webhook-enabled"
                          checked={webhookEnabled}
                          onCheckedChange={(checked) =>
                            setWebhookEnabled(checked as boolean)
                          }
                        />
                        <label
                          htmlFor="webhook-enabled"
                          className="text-sm font-medium"
                        >
                          Habilitar integração com webhook
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="webhook">
                  <WebhookConfigStep
                    previousFields={getPreviousFields()}
                    endpoint={endpoint}
                    method={method}
                    authType={authType}
                    selectedFields={selectedFields}
                    onEndpointChange={setEndpoint}
                    onMethodChange={(value) =>
                      setMethod(value as "GET" | "POST" | "PUT" | "PATCH")
                    }
                    onAuthTypeChange={(value) =>
                      setAuthType(
                        value as "none" | "basic" | "bearer" | "custom"
                      )
                    }
                    onFieldsChange={setSelectedFields}
                  />
                </TabsContent>

                <TabsContent value="variables">
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex justify-between items-center">
                        <FormLabel>Variáveis do Webhook</FormLabel>
                        <Button
                          onClick={() =>
                            setVariables([
                              ...variables,
                              { name: "", path: "", type: "string" },
                            ])
                          }
                          variant="outline"
                          size="sm"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar Variável
                        </Button>
                      </div>

                      {variables.map((variable, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-4 gap-4 p-4 border rounded-lg"
                        >
                          <Input
                            value={variable.name}
                            onChange={(e) => {
                              const newVariables = [...variables];
                              newVariables[index] = {
                                ...variable,
                                name: e.target.value,
                              };
                              setVariables(newVariables);
                            }}
                            placeholder="Nome da variável"
                          />

                          <Input
                            value={variable.path}
                            onChange={(e) => {
                              const newVariables = [...variables];
                              newVariables[index] = {
                                ...variable,
                                path: e.target.value,
                              };
                              setVariables(newVariables);
                            }}
                            placeholder="Caminho no JSON (data.valor)"
                          />

                          <Select
                            value={variable.type}
                            onValueChange={(
                              value: "string" | "number" | "boolean" | "array"
                            ) => {
                              const newVariables = [...variables];
                              newVariables[index] = {
                                ...variable,
                                type: value,
                              };
                              setVariables(newVariables);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">Texto</SelectItem>
                              <SelectItem value="number">Número</SelectItem>
                              <SelectItem value="boolean">Sim/Não</SelectItem>
                              <SelectItem value="array">Lista</SelectItem>
                            </SelectContent>
                          </Select>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setVariables(
                                variables.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}

                      {variables.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          Nenhuma variável configurada
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="conditions">
                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      {step.fields.map((field) => (
                        <div key={field.id} className="space-y-4">
                          <div className="flex justify-between items-center">
                            <FormLabel>{field.label}</FormLabel>
                            <Button
                              onClick={() => handleFieldConditionAdd(field.id)}
                              variant="outline"
                              size="sm"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar Condição
                            </Button>
                          </div>

                          {(fieldConditions[field.id] || []).map(
                            (condition, index) => (
                              <div
                                key={index}
                                className="grid grid-cols-4 gap-4"
                              >
                                <Select
                                  value={condition.variablePath}
                                  onValueChange={(value) => {
                                    handleFieldConditionUpdate(
                                      field.id,
                                      index,
                                      {
                                        variablePath: value,
                                      }
                                    );
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Variável" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {variables.map((v) => (
                                      <SelectItem key={v.name} value={v.name}>
                                        {v.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <Select
                                  value={condition.operator}
                                  onValueChange={(value) => {
                                    handleFieldConditionUpdate(
                                      field.id,
                                      index,
                                      {
                                        operator: value as ConditionOperator,
                                      }
                                    );
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Operador" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="equals">
                                      Igual a
                                    </SelectItem>
                                    <SelectItem value="notEquals">
                                      Diferente de
                                    </SelectItem>
                                    <SelectItem value="contains">
                                      Contém
                                    </SelectItem>
                                    <SelectItem value="notContains">
                                      Não contém
                                    </SelectItem>
                                    <SelectItem value="greaterThan">
                                      Maior que
                                    </SelectItem>
                                    <SelectItem value="lessThan">
                                      Menor que
                                    </SelectItem>
                                    <SelectItem value="exists">
                                      Existe
                                    </SelectItem>
                                    <SelectItem value="notExists">
                                      Não existe
                                    </SelectItem>
                                  </SelectContent>
                                </Select>

                                <Input
                                  value={condition.value}
                                  onChange={(e) => {
                                    handleFieldConditionUpdate(
                                      field.id,
                                      index,
                                      {
                                        value: e.target.value,
                                      }
                                    );
                                  }}
                                  placeholder="Valor"
                                />

                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleFieldConditionRemove(field.id, index)
                                  }
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            )
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>

            <div className="flex items-center justify-between p-6 border-t bg-muted/50">
              {step.order > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onDelete}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Etapa
                </Button>
              )}
              <div className="space-x-2 ml-auto">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button onClick={handleSubmit}>Salvar</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
