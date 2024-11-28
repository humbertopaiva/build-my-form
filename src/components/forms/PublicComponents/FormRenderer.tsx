/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useRef, useState } from "react";
import { Form } from "@/core/domain/entities/Form";
import { DynamicField } from "./DynamicField";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FormRendererProps {
  form: Form;
}

export function FormRenderer({ form }: FormRendererProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [formValidity, setFormValidity] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [fieldStates, setFieldStates] = useState<
    Record<string, { visible: boolean; required: boolean; disabled: boolean }>
  >({});

  const currentStep = form.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / form.steps.length) * 100;

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

  const isStepValid = () => {
    const visibleRequiredFields = currentStep.fields.filter((field) => {
      const state = fieldStates[field.id];
      return (!state || state.visible) && (state?.required || field.required);
    });

    return visibleRequiredFields.every(
      (field) => formValues[field.name] && formValidity[field.name]
    );
  };

  const handleNextStep = () => {
    if (isStepValid() && currentStepIndex < form.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isStepValid() || isSubmitting) {
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
        form.endpoint || `/api/forms/${form.slug}/submit`,
        {
          method: "POST",
          body: formData,
          headers: {
            "HX-Request": "true",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Falha ao enviar formulário");
      }

      setSubmitStatus("success");
      setFormValues({});
      setFormValidity({});
      setCurrentStepIndex(0);
      formRef.current?.reset();
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusAlerts = {
    success: (
      <Alert className="mb-6 bg-green-50 text-green-800">
        <CheckCircle2 className="h-5 w-5 text-green-400" />
        <AlertDescription>
          <h3 className="font-medium">Enviado com sucesso!</h3>
          <p className="mt-2 text-sm">Obrigado por enviar o formulário.</p>
        </AlertDescription>
      </Alert>
    ),
    error: (
      <Alert variant="destructive" className="mb-6">
        <XCircle className="h-5 w-5" />
        <AlertDescription>
          <h3 className="font-medium">Erro ao enviar formulário</h3>
          <p className="mt-2 text-sm">Por favor, tente novamente mais tarde.</p>
        </AlertDescription>
      </Alert>
    ),
  };

  return (
    <div className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2">
      <div className="px-4 py-6 sm:p-8">
        <h1 className="text-2xl font-semibold mb-6">{form.name}</h1>

        <div className="mb-8">
          <Progress value={progress} className="mb-2" />
          <p className="text-sm text-gray-500">
            Etapa {currentStepIndex + 1} de {form.steps.length}
          </p>
        </div>

        {currentStep.title && (
          <div className="mb-6">
            <h2 className="text-xl font-medium">{currentStep.title}</h2>
            {currentStep.description && (
              <p className="mt-1 text-gray-500">{currentStep.description}</p>
            )}
          </div>
        )}

        {submitStatus !== "idle" && statusAlerts[submitStatus]}

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          {currentStep.fields
            .sort((a, b) => a.order - b.order)
            .map((field) => {
              const fieldState = fieldStates[field.id];

              if (fieldState?.visible === false) {
                return null;
              }

              return (
                <DynamicField
                  key={field.id}
                  field={field}
                  value={formValues[field.name]}
                  formValues={formValues}
                  onChange={(value, isValid) =>
                    handleFieldChange(field.name, value, isValid)
                  }
                  disabled={isSubmitting || fieldState?.disabled}
                  required={fieldState?.required ?? field.required}
                />
              );
            })}

          <div className="flex justify-between mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStepIndex === 0 || isSubmitting}
            >
              Anterior
            </Button>

            {currentStepIndex === form.steps.length - 1 ? (
              <Button
                type="submit"
                disabled={!isStepValid() || isSubmitting}
                className={!isStepValid() || isSubmitting ? "opacity-50" : ""}
              >
                {isSubmitting ? "Enviando..." : form.submitLabel}
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleNextStep}
                disabled={!isStepValid() || isSubmitting}
              >
                Próximo
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
