// src/components/forms/BuilderComponents/StepBuilder.tsx
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { Plus, Settings2 } from "lucide-react";
import { FormStep } from "@/core/domain/entities/Form";
import { FormBuilder } from "./FormBuilder";
import { StepSettings } from "./StepSettings";

interface StepBuilderProps {
  steps: FormStep[];
  onChange: (steps: FormStep[]) => void;
}

export function StepBuilder({ steps, onChange }: StepBuilderProps) {
  const [activeStep, setActiveStep] = useState<string>(steps[0]?.id || "");
  const [isEditingStep, setIsEditingStep] = useState(false);

  const addStep = () => {
    const newStep: FormStep = {
      id: `step-${Date.now()}`,
      formId: "",
      order: steps.length,
      title: `Etapa ${steps.length + 1}`,
      fields: [],
    };

    const updatedSteps = [...steps, newStep];
    onChange(updatedSteps);
    setActiveStep(newStep.id);
  };

  const updateStep = (stepId: string, updates: Partial<FormStep>) => {
    const updatedSteps = steps.map((step) =>
      step.id === stepId ? { ...step, ...updates } : step
    );
    onChange(updatedSteps);
  };

  const deleteStep = (stepId: string) => {
    const updatedSteps = steps.filter((step) => step.id !== stepId);
    onChange(updatedSteps);
    setActiveStep(updatedSteps[0]?.id || "");
  };

  const currentStep = steps.find((step) => step.id === activeStep);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Etapas do Formulário</h3>
        <Button onClick={addStep}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Etapa
        </Button>
      </div>

      <Tabs value={activeStep} onValueChange={setActiveStep}>
        <TabsList className="w-full justify-start">
          {steps.map((step, index) => (
            <TabsTrigger key={step.id} value={step.id} className="relative">
              {step.title}
              {index > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                  onClick={() => setIsEditingStep(true)}
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {currentStep && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{currentStep.title}</CardTitle>
                {currentStep.description && (
                  <CardDescription>{currentStep.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <FormBuilder
                  initialFields={currentStep.fields}
                  onFieldsChange={(fields) =>
                    updateStep(currentStep.id, { fields })
                  }
                />
              </CardContent>
            </Card>

            {isEditingStep && (
              <StepSettings
                step={currentStep}
                onClose={() => setIsEditingStep(false)}
                onUpdate={(updates) => {
                  updateStep(currentStep.id, updates);
                  setIsEditingStep(false);
                }}
                onDelete={() => {
                  deleteStep(currentStep.id);
                  setIsEditingStep(false);
                }}
              />
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
