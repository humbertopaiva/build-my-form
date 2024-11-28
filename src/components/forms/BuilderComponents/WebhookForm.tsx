/* eslint-disable @typescript-eslint/no-explicit-any */
// components/forms/BuilderComponents/WebhookForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { WebhookConfig } from "@/core/domain/entities/Field";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface WebhookFormProps {
  webhook: WebhookConfig;
  onChange: (webhook: WebhookConfig) => void;
}

const webhookSchema = z.object({
  enabled: z.boolean(),
  endpoint: z.string().url("URL inválida").optional(),
  method: z.enum(["GET", "POST", "PUT", "PATCH"]),
  headers: z.record(z.string()).optional(),
  authType: z.enum(["none", "basic", "bearer", "custom"]),
  authValue: z.string().optional(),
  variables: z.array(
    z.object({
      name: z.string(),
      path: z.string(),
      type: z.enum(["string", "number", "boolean", "array"]),
    })
  ),
});

export function WebhookForm({ webhook, onChange }: WebhookFormProps) {
  const form = useForm<z.infer<typeof webhookSchema>>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      enabled: webhook.enabled,
      endpoint: webhook.endpoint,
      method: webhook.method,
      headers: webhook.headers,
      authType: webhook.authType || "none",
      authValue: webhook.authValue,
      variables: webhook.variables || [],
    },
  });

  const handleFieldChange = (field: keyof WebhookConfig, value: any) => {
    const updatedWebhook = {
      ...webhook,
      [field]: value,
    };
    onChange(updatedWebhook);
  };

  const addVariable = () => {
    const currentVariables = form.getValues("variables") || [];
    form.setValue("variables", [
      ...currentVariables,
      { name: "", path: "", type: "string" },
    ]);
    handleFieldChange("variables", form.getValues("variables"));
  };

  const removeVariable = (index: number) => {
    const currentVariables = form.getValues("variables") || [];
    form.setValue(
      "variables",
      currentVariables.filter((_, i) => i !== index)
    );
    handleFieldChange("variables", form.getValues("variables"));
  };

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="enabled"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={(checked: any) => {
                    field.onChange(checked);
                    handleFieldChange("enabled", checked);
                  }}
                />
              </FormControl>
              <FormLabel>Habilitar Webhook</FormLabel>
            </FormItem>
          )}
        />

        {form.watch("enabled") && (
          <>
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Webhook</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="https://api.example.com/webhook"
                      onChange={(e) => {
                        field.onChange(e);
                        handleFieldChange("endpoint", e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleFieldChange("method", value);
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autenticação</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleFieldChange("authType", value);
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de autenticação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Nenhuma</SelectItem>
                      <SelectItem value="basic">Basic Auth</SelectItem>
                      <SelectItem value="bearer">Bearer Token</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("authType") !== "none" && (
              <FormField
                control={form.control}
                name="authValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("authType") === "basic"
                        ? "Credenciais (user:pass)"
                        : form.watch("authType") === "bearer"
                        ? "Token"
                        : "Valor (key:value)"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleFieldChange("authValue", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <FormLabel>Variáveis</FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addVariable}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Variável
                </Button>
              </div>

              {form.watch("variables")?.map((_, index) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name={`variables.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Nome da variável"
                            onChange={(e) => {
                              field.onChange(e);
                              handleFieldChange(
                                "variables",
                                form.getValues("variables")
                              );
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`variables.${index}.path`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Caminho (ex: data.field)"
                            onChange={(e) => {
                              field.onChange(e);
                              handleFieldChange(
                                "variables",
                                form.getValues("variables")
                              );
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`variables.${index}.type`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              handleFieldChange(
                                "variables",
                                form.getValues("variables")
                              );
                            }}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="string">String</SelectItem>
                              <SelectItem value="number">Number</SelectItem>
                              <SelectItem value="boolean">Boolean</SelectItem>
                              <SelectItem value="array">Array</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariable(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
