/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/forms/BuilderComponents/StepBuilder.tsx
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Settings2 } from "lucide-react";
import { FormBuilder } from "./FormBuilder";
import { StepSettings } from "./StepSettings";
import { useFormBuilder } from "@/store/form-builder";
import { useState } from "react";
import { FormStep } from "@/core/domain/entities/Form";

// Componente separado para o cabeçalho da etapa
const StepHeader = ({
  stepId,
  title,
  index,
  onEditClick,
}: {
  stepId: string;
  title: string;
  index: number;
  onEditClick: () => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <span>{title}</span>
      {index > 0 && (
        <div
          className="ml-2 p-1 hover:bg-gray-100 rounded cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEditClick();
          }}
        >
          <Settings2 className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export function StepBuilder() {
  const { atoms, actions } = useFormBuilder();
  const [activeStepId, setActiveStepId] = useAtom(atoms.activeStepId);
  const steps = useAtomValue(atoms.steps);
  const activeStep = useAtomValue(atoms.activeStep);
  const addStep = useSetAtom(actions.addStep);
  const updateStep = useSetAtom(actions.updateStep);
  const deleteStep = useSetAtom(actions.deleteStep);
  const [isEditingStep, setIsEditingStep] = useState(false);

  const handleStepUpdate = (updates: Partial<FormStep>) => {
    if (activeStep) {
      updateStep({ stepId: activeStep.id, data: updates });
      setIsEditingStep(false);
    }
  };

  const handleStepDelete = () => {
    if (activeStep) {
      deleteStep(activeStep.id);
      setIsEditingStep(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Etapas do Formulário</h3>
        <Button onClick={addStep}>
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Etapa
        </Button>
      </div>

      <Tabs value={activeStepId || undefined} onValueChange={setActiveStepId}>
        <TabsList className="w-full justify-start">
          {steps.map((step, index) => (
            <TabsTrigger key={step.id} value={step.id}>
              <StepHeader
                stepId={step.id}
                title={step.title}
                index={index}
                onEditClick={() => setIsEditingStep(true)}
              />
            </TabsTrigger>
          ))}
        </TabsList>

        {activeStep && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>{activeStep.title}</CardTitle>
                {activeStep.description && (
                  <CardDescription>{activeStep.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <FormBuilder />
              </CardContent>
            </Card>

            {isEditingStep && (
              <StepSettings
                step={activeStep}
                onClose={() => setIsEditingStep(false)}
                onUpdate={handleStepUpdate}
                onDelete={handleStepDelete}
              />
            )}
          </>
        )}
      </Tabs>
    </div>
  );
}
