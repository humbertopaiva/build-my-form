/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/PublicComponents/MultiStepFormRenderer.tsx
"use client";

import { useState } from "react";
import { Form } from "@/core/domain/entities/Form";
import { DynamicField } from "./DynamicField";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

interface MultiStepFormRendererProps {
  form: Form;
}

export function MultiStepFormRenderer({ form }: MultiStepFormRendererProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [validationResults, setValidationResults] = useState<
    Record<string, boolean>
  >({});
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const currentStep = form.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / form.steps.length) * 100;

  const handleFieldChange = (
    fieldName: string,
    value: any,
    isValid: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    setValidationResults((prev) => ({
      ...prev,
      [fieldName]: isValid,
    }));

    setErrors([]);
  };

  const isStepValid = () => {
    const stepFields = currentStep.fields;
    return stepFields.every((field) => {
      if (field.required) {
        const value = formData[field.name];
        const isValid = validationResults[field.name];
        return value && isValid;
      }
      return true;
    });
  };

  const handleNext = async () => {
    if (!isStepValid()) return;

    if (currentStep.conditionalLogic?.endpoint) {
      setIsValidating(true);
      try {
        const response = await fetch(currentStep.conditionalLogic.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Validação falhou");

        const validationData = await response.json();

        // Processar regras de validação
        let shouldContinue = true;
        for (const rule of currentStep.conditionalLogic.validation) {
          const fieldValue = validationData[rule.field];
          let isValid = false;

          switch (rule.operator) {
            case "equals":
              isValid = fieldValue === rule.value;
              break;
            case "contains":
              isValid = fieldValue?.includes(rule.value);
              break;
            case "greater":
              isValid = fieldValue > rule.value;
              break;
            case "less":
              isValid = fieldValue < rule.value;
              break;
          }

          if (rule.action === "skip" && isValid) {
            setCurrentStepIndex((curr) => curr + 2);
            shouldContinue = false;
            break;
          }
        }

        if (shouldContinue) {
          setCurrentStepIndex((curr) => curr + 1);
        }
      } catch (error) {
        console.error("Erro na validação:", error);
        setErrors(["Erro ao validar campos. Por favor, tente novamente."]);
      } finally {
        setIsValidating(false);
      }
    } else {
      if (currentStepIndex < form.steps.length - 1) {
        setCurrentStepIndex((curr) => curr + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((curr) => curr - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        form.endpoint || `/api/submissions/${form.slug}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Erro ao enviar formulário");

      // Limpar formulário após sucesso
      setFormData({});
      setValidationResults({});
      setCurrentStepIndex(0);
    } catch (error) {
      console.error("Erro:", error);
      setErrors(["Erro ao enviar formulário. Por favor, tente novamente."]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-sm rounded-xl">
      <div className="p-6">
        {/* Progresso */}
        <div className="mb-8">
          <Progress value={progress} className="mb-2" />
          <div className="flex justify-between text-sm text-gray-500">
            <span>
              Etapa {currentStepIndex + 1} de {form.steps.length}
            </span>
            <span>{Math.round(progress)}% completo</span>
          </div>
        </div>

        {/* Título da etapa */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">{currentStep.title}</h2>
          {currentStep.description && (
            <p className="mt-1 text-gray-500">{currentStep.description}</p>
          )}
        </div>

        {/* Erros */}
        {errors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Campos do formulário */}
        <div className="space-y-6">
          {currentStep.fields.map((field) => (
            <DynamicField
              key={field.id}
              field={field}
              value={formData[field.name]}
              formValues={formData}
              onChange={(value, isValid) =>
                handleFieldChange(field.name, value, isValid)
              }
              disabled={isValidating || isSubmitting}
            />
          ))}
        </div>

        {/* Botões de navegação */}
        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0 || isValidating || isSubmitting}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <Button
            onClick={handleNext}
            disabled={!isStepValid() || isValidating || isSubmitting}
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validando...
              </>
            ) : isSubmitting ? (
              "Enviando..."
            ) : currentStepIndex === form.steps.length - 1 ? (
              form.submitLabel
            ) : (
              <>
                Próximo
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
