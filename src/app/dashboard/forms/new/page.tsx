// app/dashboard/forms/new/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { StepBuilder } from "@/components/forms/BuilderComponents/StepBuilder";
import { toast } from "@/hooks/use-toast";
import { FormBuilderProvider } from "@/components/providers/FormBuilderProvider";
import { useAtomValue } from "jotai";
import { formBuilderAtom, persistentStepsAtom } from "@/store/form-builder";

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  slug: z
    .string()
    .min(3, "Slug deve ter pelo menos 3 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug deve conter apenas letras minúsculas, números e hífens"
    ),
  submitLabel: z.string().default("Enviar"),
  endpoint: z.string().url("Endpoint deve ser uma URL válida e é obrigatório"),
});

export default function NewFormPage() {
  const router = useRouter();
  const formBuilderState = useAtomValue(formBuilderAtom);
  const steps = useAtomValue(persistentStepsAtom);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      submitLabel: "Enviar",
      endpoint: "", // Mantenha o valor inicial vazio, mas agora é obrigatório
    },
  });

  // Log de erros do formulário
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.log("Form errors:", form.formState.errors);
    }
  }, [form.formState.errors]);

  useEffect(() => {
    console.log("Steps atualizados:", steps);
  }, [steps]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Formulário submetido!", { data, formBuilderState });

    if (steps.length === 0) {
      // Use steps aqui também
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Adicione pelo menos uma etapa ao formulário",
      });
      return;
    }

    // Verifica se há campos nas etapas
    // const hasFields = formBuilderState.steps.some(
    //   (step) => step.fields.length > 0
    // );
    // if (!hasFields) {
    //   toast({
    //     variant: "destructive",
    //     title: "Erro",
    //     description:
    //       "Adicione pelo menos um campo em alguma etapa do formulário",
    //   });
    //   return;
    // }

    try {
      const formData = {
        ...data,
        steps: steps.map((step) => ({
          order: step.order,
          title: step.title,
          description: step.description || "",
          fields: step.fields.map((field) => ({
            name: field.name,
            label: field.label,
            type: field.type,
            placeholder: field.placeholder || "",
            required: field.required,
            order: field.order,
            options: field.options || [],
            validation: field.validation || null,
            helpText: field.helpText || "",
          })),
          webhook: step.webhook,
          variables: step.variables,
          conditions: step.conditions,
        })),
      };

      const response = await fetch("/api/forms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar formulário");
      }

      const result = await response.json();
      console.log("Resposta da API:", result);

      toast({
        title: "Sucesso!",
        description: "Formulário criado com sucesso.",
      });

      router.push("/dashboard/forms");
    } catch (error) {
      console.error("Erro ao criar formulário:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description:
          error instanceof Error
            ? error.message
            : "Não foi possível criar o formulário. Tente novamente.",
      });
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Novo Formulário</h1>
          <p className="text-gray-500">Configure seu formulário multi-etapas</p>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8"
            noValidate
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Formulário</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (URL)</FormLabel>
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
                    <FormLabel>
                      Webhook Endpoint *
                      <span className="ml-1 text-sm text-muted-foreground">
                        (URL para onde os dados serão enviados)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="url"
                        placeholder="https://seu-endpoint.com/webhook"
                        required // Adiciona o indicador visual de campo obrigatório
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground mt-1">
                      Este é o endpoint que receberá os dados quando o
                      formulário for submetido.
                    </p>
                  </FormItem>
                )}
              />

              {/* E este campo para o submitLabel */}
              <FormField
                control={form.control}
                name="submitLabel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Texto do Botão de Envio</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enviar" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormBuilderProvider>
              <div className="border rounded-lg p-6 bg-white">
                <StepBuilder />
              </div>
            </FormBuilderProvider>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dashboard/forms")}
              >
                Cancelar
              </Button>
              <Button type="submit">Criar Formulário</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
