/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { ValidationService } from "../core/application/services/ValidationService";
import { FormStep } from "../core/domain/entities/Form";

interface UseFormStepsOptions {
  initialStep?: number;
  onStepComplete?: (stepData: Record<string, any>) => void;
  onFormComplete?: (allData: Record<string, any>) => void;
}

export function useFormSteps(
  steps: FormStep[],
  options: UseFormStepsOptions = {}
) {
  const [currentStepIndex, setCurrentStepIndex] = useState(
    options.initialStep || 0
  );
  const [stepsData, setStepsData] = useState<Record<string, any>>({});
  const [fieldStates, setFieldStates] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const validateStep = async (stepData: Record<string, any>) => {
    const currentStep = steps[currentStepIndex];

    if (!currentStep.conditionalLogic?.endpoint) {
      return true;
    }

    setLoading(true);
    setErrors([]);

    try {
      const previousData = Object.entries(stepsData)
        .filter(([key]) => Number(key) < currentStepIndex)
        .reduce((acc, [_, value]) => ({ ...acc, ...value }), {});

      const response = await ValidationService.validateStep(
        currentStep.conditionalLogic.endpoint,
        "POST",
        stepData,
        previousData
      );

      if (response.errors?.length) {
        setErrors(response.errors);
        return false;
      }

      if (currentStep.conditionalLogic.validation && response.payload) {
        const newFieldStates = ValidationService.applyValidationRules(
          currentStep.conditionalLogic.validation.map((rule) => ({
            ...rule,
            targetFields: rule.targetFields || [],
          })),
          response.payload
        );
        setFieldStates(newFieldStates);
      }

      return true;
    } catch (error) {
      setErrors(["Erro ao validar dados"]);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async (stepData: Record<string, any>) => {
    const isValid = await validateStep(stepData);

    if (!isValid) return false;

    setStepsData((prev) => ({
      ...prev,
      [currentStepIndex]: stepData,
    }));

    options.onStepComplete?.(stepData);

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      return true;
    } else {
      const allData = Object.values(stepsData).reduce(
        (acc, stepData) => ({ ...acc, ...stepData }),
        {}
      );
      options.onFormComplete?.(allData);
      return true;
    }
  };

  const previousStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  }, [currentStepIndex]);

  return {
    currentStepIndex,
    stepsData,
    fieldStates,
    loading,
    errors,
    nextStep,
    previousStep,
    validateStep,
  };
}
