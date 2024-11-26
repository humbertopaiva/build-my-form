/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/BuilderComponents/FieldProperties.tsx
import { Field } from "@/core/domain/entities/Field";
import {
  Form,
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
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";

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
  const form = useForm({
    defaultValues: field,
  });

  const handleSubmit = (values: any) => {
    onUpdate({ ...field, ...values });
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

      <Form {...form}>
        <form onChange={form.handleSubmit(handleSubmit)} className="space-y-6">
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

          <Accordion type="single" collapsible>
            <AccordionItem value="validation">
              <AccordionTrigger>Validações</AccordionTrigger>
              <AccordionContent>
                {/* Implementar validações específicas por tipo */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
      </Form>
    </div>
  );
}
