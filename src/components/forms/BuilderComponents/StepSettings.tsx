/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/BuilderComponents/StepSettings.tsx
"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormStep, StepValidation } from "@/core/domain/entities/Form";
import { useForm } from "react-hook-form";

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
    updates: Partial<StepValidation>
  ) => {
    const updatedValidations = validations.map((validation, i) =>
      i === index ? { ...validation, ...updates } : validation
    );
    setValidations(updatedValidations);
  };

  const removeValidation = (index: number) => {
    setValidations(validations.filter((_, i) => i !== index));
  };

  const onSubmit = (data: any) => {
    onUpdate({
      ...data,
      conditionalLogic:
        validations.length > 0
          ? {
              endpoint: data.endpoint,
              validation: validations,
            }
          : undefined,
    });
  };

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Configurações da Etapa</SheetTitle>
          <SheetDescription>
            Configure o comportamento desta etapa do formulário
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mt-6"
          >
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
                  <FormLabel>Endpoint de Validação</FormLabel>
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

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">Regras de Validação</h4>
                <Button type="button" variant="outline" onClick={addValidation}>
                  Adicionar Regra
                </Button>
              </div>

              {validations.map((validation, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <Select
                    value={validation.field}
                    onValueChange={(value) =>
                      updateValidation(index, { field: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o campo" />
                    </SelectTrigger>
                    <SelectContent>
                      {step.fields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      value={validation.operator}
                      onValueChange={(value: any) =>
                        updateValidation(index, { operator: value })
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
                      </SelectContent>
                    </Select>

                    <Input
                      value={validation.value}
                      onChange={(e) =>
                        updateValidation(index, { value: e.target.value })
                      }
                      placeholder="Valor"
                    />
                  </div>

                  <Select
                    value={validation.action}
                    onValueChange={(value: any) =>
                      updateValidation(index, { action: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Ação" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="show">Mostrar</SelectItem>
                      <SelectItem value="hide">Esconder</SelectItem>
                      <SelectItem value="require">
                        Tornar Obrigatório
                      </SelectItem>
                      <SelectItem value="skip">Pular Etapa</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeValidation(index)}
                  >
                    Remover Regra
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex justify-between pt-6">
              <Button type="button" variant="destructive" onClick={onDelete}>
                Excluir Etapa
              </Button>
              <div className="space-x-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
