/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormStep, StepValidation } from "@/core/domain/entities/Form";
import { DataMappingConfigComponent } from "./DataMappingConfig";
import { useForm } from "react-hook-form";
import { Plus, Trash2, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { DataMappingConfig } from "@/core/domain/entities/DataMapping";

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
  const [validations, setValidations] = useState<StepValidation[]>(
    step.conditionalLogic?.validation || []
  );

  const form = useForm({
    defaultValues: {
      title: step.title,
      description: step.description || "",
      endpoint: step.conditionalLogic?.endpoint || "",
    },
  });

  const handleDataMappingUpdate = (config: DataMappingConfig) => {
    onUpdate({
      ...step,
      dataMapping: config,
    });
  };

  const addValidation = () => {
    setValidations([
      ...validations,
      {
        field: "",
        operator: "equals",
        value: "",
        action: "show",
        targetFields: [],
      },
    ]);
  };

  const updateValidation = (
    index: number,
    field: keyof StepValidation,
    value: string | string[] | undefined
  ) => {
    const updatedValidations = validations.map((validation, i) =>
      i === index ? { ...validation, [field]: value } : validation
    );
    setValidations(updatedValidations);
  };

  const removeValidation = (index: number) => {
    setValidations(validations.filter((_, i) => i !== index));
  };

  const onSubmit = (data: any) => {
    const updates: Partial<FormStep> = {
      ...data,
      conditionalLogic:
        validations.length > 0
          ? {
              endpoint: data.endpoint,
              validation: validations,
            }
          : undefined,
    };

    if (step.dataMapping) {
      updates.dataMapping = step.dataMapping;
    }

    onUpdate(updates);
  };

  const ValidationsList = () => (
    <>
      {validations.map((validation, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg bg-card">
          <div className="grid grid-cols-2 gap-4">
            <Select
              value={validation.field}
              onValueChange={(value) => updateValidation(index, "field", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Campo" />
              </SelectTrigger>
              <SelectContent>
                {step.fields.map((field) => (
                  <SelectItem key={field.id} value={field.id}>
                    {field.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={validation.operator}
              onValueChange={(value) =>
                updateValidation(index, "operator", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Operador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">Igual a</SelectItem>
                <SelectItem value="contains">Contém</SelectItem>
                <SelectItem value="greater">Maior que</SelectItem>
                <SelectItem value="less">Menor que</SelectItem>
                <SelectItem value="between">Entre</SelectItem>
                <SelectItem value="exists">Existe</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            value={validation.value}
            onChange={(e) => updateValidation(index, "value", e.target.value)}
            placeholder="Valor para comparação"
          />

          <Select
            value={validation.action}
            onValueChange={(value) => updateValidation(index, "action", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Ação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="show">Mostrar</SelectItem>
              <SelectItem value="hide">Esconder</SelectItem>
              <SelectItem value="require">Tornar Obrigatório</SelectItem>
              <SelectItem value="skip">Pular Etapa</SelectItem>
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={() => removeValidation(index)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remover Regra
          </Button>
        </div>
      ))}

      {validations.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma regra de validação configurada
        </div>
      )}
    </>
  );

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="fixed inset-0 p-4 md:p-6 overflow-y-auto">
        <div className="min-h-full flex items-center justify-center">
          <div className="relative w-full max-w-[900px] rounded-lg shadow-lg border bg-background mx-auto animate-in zoom-in-90 duration-100">
            {/* Header */}
            <div className="flex flex-col gap-1.5 p-6 border-b">
              <h2 className="text-lg font-semibold leading-none tracking-tight">
                Configurações da Etapa
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure o comportamento desta etapa do formulário
              </p>
            </div>

            {/* Close button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-full opacity-70 ring-offset-background transition-opacity hover:opacity-100"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Fechar</span>
            </Button>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col"
              >
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <div className="px-6 pt-4">
                    <TabsList className="grid w-full grid-cols-3 gap-4">
                      <TabsTrigger value="basic" className="w-full">
                        Básico
                      </TabsTrigger>
                      <TabsTrigger value="validation" className="w-full">
                        Validações
                      </TabsTrigger>
                      <TabsTrigger value="mapping" className="w-full">
                        Mapeamento
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-6 space-y-6 min-h-[400px] max-h-[600px] overflow-y-auto">
                    <TabsContent value="basic">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título da Etapa</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="endpoint"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Endpoint</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="https://api.example.com/validate"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="validation">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <h4 className="text-sm font-medium">
                                Regras de Validação
                              </h4>
                              <Button
                                type="button"
                                onClick={addValidation}
                                variant="outline"
                                size="sm"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Adicionar Regra
                              </Button>
                            </div>
                            <ValidationsList />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="mapping">
                      <DataMappingConfigComponent
                        fields={step.fields}
                        config={step.dataMapping}
                        onUpdate={handleDataMappingUpdate}
                      />
                    </TabsContent>
                  </div>
                </Tabs>

                <div className="flex items-center justify-between p-6 border-t bg-muted/50">
                  {step.order > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onDelete}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir Etapa
                    </Button>
                  )}
                  <div className="space-x-2 ml-auto">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancelar
                    </Button>
                    <Button type="submit">Salvar</Button>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
