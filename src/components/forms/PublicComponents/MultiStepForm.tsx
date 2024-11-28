/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFormSteps } from "@/hooks/useFormSteps";
import { DynamicField } from "./DynamicField";
import { Form } from "@/core/domain/entities/Form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

interface MultiStepFormProps {
  form: Form;
  onComplete: (data: Record<string, any>) => void;
}

export function MultiStepForm({ form, onComplete }: MultiStepFormProps) {
  const {
    currentStepIndex,
    stepsData,
    fieldStates,
    loading,
    errors,
    nextStep,
    previousStep,
  } = useFormSteps(form.steps, {
    onFormComplete: onComplete,
  });

  const currentStep = form.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / form.steps.length) * 100;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const formData = new FormData(formElement);
    const stepData = Object.fromEntries(formData);
    await nextStep(stepData);
  };

  const handleFieldChange = (
    fieldName: string,
    value: string,
    isValid: boolean
  ) => {
    // Opcional: Adicionar lógica de validação em tempo real aqui
    console.log(fieldName, value, isValid);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Progress value={progress} />
        <p className="text-sm text-gray-500">
          Etapa {currentStepIndex + 1} de {form.steps.length}
        </p>
      </div>

      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertDescription>
            <ul className="list-disc pl-4">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {currentStep.fields.map((field) => {
            const fieldState = fieldStates[field.id];

            if (fieldState && !fieldState.visible) {
              return null;
            }

            return (
              <DynamicField
                key={field.id}
                field={field}
                disabled={loading || (fieldState?.disabled ?? false)}
                required={fieldState?.required ?? field.required}
                value={stepsData[currentStepIndex]?.[field.name]}
                formValues={stepsData[currentStepIndex] || {}}
                onChange={(value, isValid) =>
                  handleFieldChange(field.name, value, isValid)
                }
              />
            );
          })}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={previousStep}
            disabled={currentStepIndex === 0 || loading}
          >
            Anterior
          </Button>

          <Button type="submit" disabled={loading}>
            {loading
              ? "Carregando..."
              : currentStepIndex === form.steps.length - 1
              ? form.submitLabel || "Concluir"
              : "Próximo"}
          </Button>
        </div>
      </form>
    </div>
  );
}
