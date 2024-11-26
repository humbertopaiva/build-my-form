/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/BuilderComponents/FormEditor.tsx
"use client";

import { useFieldArray, UseFormReturn } from "react-hook-form";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import { FieldType } from "@/core/domain/entities/Field";

const fieldTypes: { value: FieldType; label: string }[] = [
  { value: "text", label: "Texto" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Telefone" },
  { value: "number", label: "Número" },
  { value: "textarea", label: "Área de Texto" },
  { value: "select", label: "Seleção" },
  { value: "radio", label: "Radio" },
  { value: "checkbox", label: "Checkbox" },
  { value: "date", label: "Data" },
  { value: "time", label: "Hora" },
];

interface FormEditorProps {
  form: UseFormReturn<any>;
}

export function FormEditor({ form }: FormEditorProps) {
  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "fields",
  });

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    move(sourceIndex, destinationIndex);
  };

  const addField = () => {
    append({
      name: "",
      label: "",
      type: "text",
      placeholder: "",
      required: false,
      helpText: "",
      validation: {
        rules: [],
      },
      options: [],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Campos do Formulário</h2>
        <Button onClick={addField} type="button">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Campo
        </Button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided) => (
                    <Card
                      className="mb-4"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <CardHeader className="flex flex-row items-center justify-between py-3">
                        <div
                          {...provided.dragHandleProps}
                          className="cursor-grab"
                        >
                          <GripVertical className="h-5 w-5 text-gray-400" />
                        </div>
                        <CardTitle className="text-base">
                          Campo {index + 1}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </CardHeader>
                      <CardContent className="grid gap-4">
                        {/* Tipo do Campo */}
                        <FormField
                          control={form.control}
                          name={`fields.${index}.type`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo do Campo</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {fieldTypes.map((type) => (
                                    <SelectItem
                                      key={type.value}
                                      value={type.value}
                                    >
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Nome do Campo */}
                        <FormField
                          control={form.control}
                          name={`fields.${index}.name`}
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

                        {/* Label */}
                        <FormField
                          control={form.control}
                          name={`fields.${index}.label`}
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

                        {/* Placeholder */}
                        <FormField
                          control={form.control}
                          name={`fields.${index}.placeholder`}
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

                        {/* Campo Obrigatório */}
                        <FormField
                          control={form.control}
                          name={`fields.${index}.required`}
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

                        {/* Texto de Ajuda */}
                        <FormField
                          control={form.control}
                          name={`fields.${index}.helpText`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Texto de Ajuda</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Renderiza campos extras baseado no tipo */}
                        {(form.watch(`fields.${index}.type`) === "select" ||
                          form.watch(`fields.${index}.type`) === "radio") && (
                          <OptionsEditor
                            fieldIndex={index}
                            control={form.control}
                          />
                        )}
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

interface OptionsEditorProps {
  fieldIndex: number;
  control: any;
}

function OptionsEditor({ fieldIndex, control }: OptionsEditorProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `fields.${fieldIndex}.options`,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <FormLabel>Opções</FormLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ label: "", value: "" })}
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Opção
        </Button>
      </div>

      {fields.map((field, optionIndex) => (
        <div key={field.id} className="flex gap-2">
          <FormField
            control={control}
            name={`fields.${fieldIndex}.options.${optionIndex}.label`}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input {...field} placeholder="Label" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`fields.${fieldIndex}.options.${optionIndex}.value`}
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
            onClick={() => remove(optionIndex)}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      ))}
    </div>
  );
}
