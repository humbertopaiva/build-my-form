// src/app/dashboard/forms/new/page.tsx
"use client";

import { useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FormPreview } from "@/components/forms/BuilderComponents/FormPreview";
import { FormEditor } from "@/components/forms/BuilderComponents/FormEditor";

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
  endpoint: z.string().url("Endpoint deve ser uma URL válida").optional(),
  fields: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1, "Nome é obrigatório"),
      label: z.string().min(1, "Label é obrigatório"),
      type: z.string().min(1, "Tipo é obrigatório"),
      placeholder: z.string().optional(),
      required: z.boolean().default(false),
      helpText: z.string().optional(),
      validation: z
        .object({
          rules: z.array(
            z.object({
              type: z.string(),
              message: z.string(),
              value: z.any().optional(),
            })
          ),
          mask: z.string().optional(),
        })
        .optional(),
      options: z
        .array(
          z.object({
            label: z.string(),
            value: z.string(),
          })
        )
        .optional(),
    })
  ),
});

type FormData = z.infer<typeof formSchema>;

export default function NewFormPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("editor");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      submitLabel: "Enviar",
      fields: [],
    },
  });

  const { control, handleSubmit, watch } = form;

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Erro ao criar formulário");
      router.push("/dashboard");
    } catch (error) {
      console.error("Erro:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Campos básicos do formulário */}
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={control}
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
              control={control}
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
              control={control}
              name="submitLabel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Texto do Botão</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="endpoint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint (opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Tabs para Editor e Preview */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            <TabsContent value="editor">
              <FormEditor form={form} />
            </TabsContent>
            <TabsContent value="preview">
              <FormPreview
                formData={watch()}
                className="border rounded-lg p-4"
              />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Formulário"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
