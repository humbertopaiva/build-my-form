/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/PublicComponents/FormRenderer.tsx
"use client";

import { useRef, useState } from "react";
import { Form } from "@/core/domain/entities/Form";
import { DynamicField } from "./DynamicField";

interface FormRendererProps {
  form: Form;
}

export function FormRenderer({ form }: FormRendererProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [formValidity, setFormValidity] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleFieldChange = (
    fieldName: string,
    value: string,
    isValid: boolean
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    setFormValidity((prev) => ({
      ...prev,
      [fieldName]: isValid,
    }));
  };

  const isFormValid = () => {
    return Object.values(formValidity).every((valid) => valid);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch(
        form.endpoint || `/api/submissions/${form.slug}`,
        {
          method: "POST",
          body: formData,
          headers: {
            "HX-Request": "true",
          },
        }
      );

      if (response.ok) {
        setSubmitStatus("success");
        // Limpar formulário após sucesso
        setFormValues({});
        setFormValidity({});
        formRef.current?.reset();
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
      <div className="px-4 py-6 sm:p-8">
        <h1 className="text-2xl font-semibold mb-6">{form.name}</h1>

        {submitStatus === "success" && (
          <div className="rounded-md bg-green-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Enviado com sucesso!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Obrigado por enviar o formulário.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {submitStatus === "error" && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao enviar formulário
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Por favor, tente novamente mais tarde.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {form.fields
            .sort((a, b) => a.order - b.order)
            .map((field) => (
              <DynamicField
                key={field.id}
                field={field}
                formValues={formValues}
                onChange={(value, isValid) =>
                  handleFieldChange(field.name, value, isValid)
                }
              />
            ))}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className={`
                rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm
                ${
                  isFormValid() && !isSubmitting
                    ? "bg-indigo-600 hover:bg-indigo-500"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              {isSubmitting ? "Enviando..." : form.submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
