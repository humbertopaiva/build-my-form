/* eslint-disable @typescript-eslint/no-unused-vars */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// // src/app/dashboard/forms/new/page.tsx
// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";

// import { StepBuilder } from "@/components/forms/BuilderComponents/StepBuilder";
// import { FormStep } from "@/core/domain/entities/Form";
// import { toast } from "@/hooks/use-toast";

// const formSchema = z.object({
//   name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
//   slug: z
//     .string()
//     .min(3, "Slug deve ter pelo menos 3 caracteres")
//     .regex(
//       /^[a-z0-9-]+$/,
//       "Slug deve conter apenas letras minúsculas, números e hífens"
//     ),
//   submitLabel: z.string().default("Enviar"),
//   endpoint: z.string().url("Endpoint deve ser uma URL válida").optional(),
// });

// export default function NewFormPage() {
//   const router = useRouter();
//   const [steps, setSteps] = useState<FormStep[]>([]);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       submitLabel: "Enviar",
//     },
//   });

//   const handlePreview = () => {
//     // Salvar rascunho no localStorage
//     const formData = {
//       ...form.getValues(),
//       steps,
//     };
//     localStorage.setItem("form_preview", JSON.stringify(formData));
//     window.open("/preview", "_blank");
//   };

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     if (steps.length === 0) {
//       toast({
//         variant: "destructive",
//         title: "Erro",
//         description: "Adicione pelo menos uma etapa ao formulário",
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const response = await fetch("/api/forms", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...data,
//           steps: steps.map((step) => ({
//             ...step,
//             fields: step.fields.map((field) => ({
//               ...field,
//               order: field.order || 0,
//             })),
//           })),
//         }),
//       });

//       if (!response.ok) throw new Error("Erro ao criar formulário");

//       toast({
//         title: "Sucesso!",
//         description: "Formulário criado com sucesso.",
//       });

//       router.push("/dashboard/forms");
//     } catch (error) {
//       toast({
//         variant: "destructive",
//         title: "Erro",
//         description: "Não foi possível criar o formulário. Tente novamente.",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="container mx-auto py-6">
//       <div className="space-y-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold">Novo Formulário</h1>
//             <p className="text-gray-500">
//               Crie um formulário multi-etapas para captura de leads
//             </p>
//           </div>
//           <div className="space-x-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handlePreview}
//               disabled={steps.length === 0}
//             >
//               Visualizar
//             </Button>
//           </div>
//         </div>

//         <div className="grid gap-6">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)}>
//               <div className="grid gap-6 mb-6 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Nome do Formulário</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="slug"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Slug (URL)</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="submitLabel"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Texto do Botão</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="endpoint"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Endpoint (opcional)</FormLabel>
//                       <FormControl>
//                         <Input {...field} />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="border rounded-lg p-6 bg-white">
//                 <StepBuilder steps={steps} onChange={setSteps} />
//               </div>

//               <div className="flex justify-end gap-4 mt-6">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={() => router.push("/dashboard/forms")}
//                 >
//                   Cancelar
//                 </Button>
//                 <Button type="submit" disabled={isSubmitting}>
//                   {isSubmitting ? "Criando..." : "Criar Formulário"}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </div>
//       </div>
//     </div>
//   );
// }

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

import { StepBuilder } from "@/components/forms/BuilderComponents/StepBuilder";
import { FormStep } from "@/core/domain/entities/Form";
import { toast } from "@/hooks/use-toast";
import { FormBuilderProvider } from "@/components/providers/FormBuilderProvider";

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
});

export default function NewFormPage() {
  const router = useRouter();
  const [steps, setSteps] = useState<FormStep[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      submitLabel: "Enviar",
      endpoint: "",
    },
  });

  const handleStepsChange = (newSteps: FormStep[]) => {
    setSteps(newSteps);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (steps.length === 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Adicione pelo menos uma etapa ao formulário",
      });
      return;
    }

    console.log(data);

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          steps: steps.map((step) => ({
            ...step,
            fields: step.fields.map((field) => ({
              ...field,
              order: field.order || 0,
            })),
          })),
        }),
      });

      if (!response.ok) throw new Error("Erro ao criar formulário");

      toast({
        title: "Sucesso!",
        description: "Formulário criado com sucesso.",
      });

      router.push("/dashboard/forms");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o formulário. Tente novamente.",
      });
    } finally {
      setIsSubmitting(false);
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Criando..." : "Criar Formulário"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
