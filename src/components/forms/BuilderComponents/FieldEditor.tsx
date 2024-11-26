// src/components/forms/BuilderComponents/FieldEditor.tsx
"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ValidationRuleType } from "@/core/domain/entities/Validation";

const validationTypes: { value: ValidationRuleType; label: string }[] = [
  { value: "required", label: "Obrigatório" },
  { value: "email", label: "Email" },
  { value: "minLength", label: "Comprimento Mínimo" },
  { value: "maxLength", label: "Comprimento Máximo" },
  { value: "pattern", label: "Expressão Regular" },
  { value: "cpf", label: "CPF" },
  { value: "cnpj", label: "CNPJ" },
  { value: "phone", label: "Telefone" },
  { value: "cep", label: "CEP" },
  { value: "custom", label: "Validação Customizada" },
];

interface FieldEditorProps {
  index: number;
}

export function FieldEditor({ index }: FieldEditorProps) {
  const { control, watch } = useFormContext();
  const {
    fields: validations,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `fields.${index}.validation.rules`,
  });

  const fieldType = watch(`fields.${index}.type`);

  return (
    <div className="space-y-4 border p-4 rounded-md">
      <FormField
        control={control}
        name={`fields.${index}.type`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tipo do Campo</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="text">Texto</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="tel">Telefone</SelectItem>
                <SelectItem value="number">Número</SelectItem>
                <SelectItem value="textarea">Área de Texto</SelectItem>
                <SelectItem value="select">Seleção</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name={`fields.${index}.label`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Label</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <Accordion type="single" collapsible>
        <AccordionItem value="validations">
          <AccordionTrigger>Validações</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {validations.map((validation, vIndex) => (
                <div key={validation.id} className="flex gap-2 items-start">
                  <FormField
                    control={control}
                    name={`fields.${index}.validation.rules.${vIndex}.type`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Tipo de validação" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {validationTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`fields.${index}.validation.rules.${vIndex}.message`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input {...field} placeholder="Mensagem de erro" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(vIndex)}
                  >
                    Remover
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    type: "required",
                    message: "Campo obrigatório",
                  })
                }
              >
                Adicionar Validação
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {fieldType === "text" && (
          <AccordionItem value="mask">
            <AccordionTrigger>Máscara</AccordionTrigger>
            <AccordionContent>
              <FormField
                control={control}
                name={`fields.${index}.validation.mask`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Ex: (99) 99999-9999" />
                    </FormControl>
                    <p className="text-sm text-gray-500">
                      Use 9 para números e A para letras
                    </p>
                  </FormItem>
                )}
              />
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
