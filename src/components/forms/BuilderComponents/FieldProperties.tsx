// src/components/forms/BuilderComponents/FieldProperties.tsx
"use client";

import { useEffect } from "react";
import {
  AsyncValidation,
  Field,
  FieldCondition,
  FieldConditionalLogic,
  FieldOption,
  ValidationConfig,
  ValidationRule,
} from "@/core/domain/entities/Field";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";

interface FieldPropertiesProps {
  field: Field;
  onUpdate: (field: Field) => void;
  onDelete: (fieldId: string) => void;
}

export function FieldProperties({
  field,
  onUpdate,
  onDelete,
}: FieldPropertiesProps) {
  const form = useForm<Field>({
    defaultValues: field,
  });

  const {
    fields: options,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "options",
  });

  // Use useEffect para observar mudanças nos valores do formulário
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Validar e converter opções
      const validOptions = value.options
        ?.filter((opt): opt is FieldOption => {
          return Boolean(opt?.label && opt?.value);
        })
        .map((opt) => ({
          label: opt.label,
          value: opt.value,
        }));

      // Validar e converter regras de validação
      let validationConfig: ValidationConfig | undefined;
      if (value.validation) {
        const validRules =
          value.validation.rules?.filter((rule): rule is ValidationRule => {
            return Boolean(rule?.type && rule?.message);
          }) || [];

        let asyncValidation: AsyncValidation | undefined;
        if (value.validation.async) {
          const responseMap: { [key: string]: string } = {};
          if (value.validation.async.responseMapping) {
            Object.entries(value.validation.async.responseMapping).forEach(
              ([key, val]) => {
                if (typeof val === "string") {
                  responseMap[key] = val;
                }
              }
            );
          }

          asyncValidation = {
            endpoint: value.validation.async.endpoint || "",
            method: value.validation.async.method || "POST",
            payloadFields:
              value.validation.async.payloadFields?.filter(
                (field): field is string => Boolean(field)
              ) || [],
            responseMapping: responseMap,
          };
        }

        validationConfig = {
          rules: validRules,
          mask: value.validation.mask,
          async: asyncValidation,
        };
      }

      // Validar e converter lógica condicional
      let conditionalLogic: FieldConditionalLogic | undefined;
      if (value.conditionalLogic) {
        const validConditions =
          value.conditionalLogic.conditions?.filter(
            (condition): condition is FieldCondition => {
              return Boolean(
                condition?.field &&
                  condition?.operator &&
                  condition?.value !== undefined
              );
            }
          ) || [];

        if (validConditions.length > 0 && value.conditionalLogic.action) {
          conditionalLogic = {
            conditions: validConditions,
            action: value.conditionalLogic.action,
          };
        }
      }

      // Construir campo atualizado
      const updatedField: Field = {
        id: value.id || field.id,
        formId: value.formId || field.formId,
        name: value.name || field.name,
        label: value.label || field.label,
        type: value.type || field.type,
        placeholder: value.placeholder,
        required: Boolean(value.required),
        order: value.order || field.order,
        helpText: value.helpText,
        options: validOptions,
        validation: validationConfig,
        conditionalLogic,
      };

      onUpdate(updatedField);
    });
    return () => subscription.unsubscribe();
  }, [form.watch, field, onUpdate, form]);

  const addOption = () => {
    append({ label: "", value: "" } as FieldOption);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Propriedades do Campo</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(field.id)}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Campo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Campo Obrigatório</FormLabel>
              </div>
            </FormItem>
          )}
        />

        {/* Opções para campos select, radio e checkbox */}
        {(field.type === "select" ||
          field.type === "radio" ||
          field.type === "checkbox") && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <FormLabel>Opções</FormLabel>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Opção
              </Button>
            </div>

            {options?.map((option, index) => (
              <div key={option.id} className="flex gap-2">
                <FormField
                  control={form.control}
                  name={`options.${index}.label`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Label" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`options.${index}.value`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input {...field} placeholder="Valor" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <Accordion type="single" collapsible>
          <AccordionItem value="validation">
            <AccordionTrigger>Validações</AccordionTrigger>
            <AccordionContent>
              {/* Implementar validações específicas por tipo */}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
