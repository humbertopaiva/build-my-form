// components/forms/BuilderComponents/VariablesForm.tsx
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { WebhookVariable } from "@/core/domain/entities/Field";
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

interface VariablesFormProps {
  variables: WebhookVariable[];
  onChange: (variables: WebhookVariable[]) => void;
}

const variableSchema = z.object({
  variables: z.array(
    z.object({
      name: z.string().min(1, "Nome é obrigatório"),
      path: z.string().min(1, "Caminho é obrigatório"),
      type: z.enum(["string", "number", "boolean", "array"]),
    })
  ),
});

export function VariablesForm({ variables, onChange }: VariablesFormProps) {
  const form = useForm<z.infer<typeof variableSchema>>({
    resolver: zodResolver(variableSchema),
    defaultValues: {
      variables,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variables",
  });

  const handleVariableChange = () => {
    const updatedVariables = form.getValues("variables");
    onChange(updatedVariables);
  };

  const addVariable = () => {
    append({
      name: "",
      path: "",
      type: "string",
    });
    handleVariableChange();
  };

  const removeVariable = (index: number) => {
    remove(index);
    handleVariableChange();
  };

  return (
    <Form {...form}>
      <form className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-3 gap-4 p-4 border rounded-lg"
          >
            <FormField
              control={form.control}
              name={`variables.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Variável</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="carrosComprados"
                      onChange={(e) => {
                        field.onChange(e);
                        handleVariableChange();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`variables.${index}.path`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caminho no JSON</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="data.carrosComprados"
                      onChange={(e) => {
                        field.onChange(e);
                        handleVariableChange();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <FormField
                control={form.control}
                name={`variables.${index}.type`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(value);
                        handleVariableChange();
                      }}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Escolha o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Número</SelectItem>
                        <SelectItem value="boolean">Booleano</SelectItem>
                        <SelectItem value="array">Lista</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="self-end"
                onClick={() => removeVariable(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={addVariable}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Variável
        </Button>
      </form>
    </Form>
  );
}
