/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/forms/BuilderComponents/StepBuilder.tsx

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
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
import { Form, FormStep } from "@/core/domain/entities/Form";
import { WebhookConfig, WebhookVariable } from "@/core/domain/entities/Field";
import { useFormBuilder } from "@/store/form-builder";
import { toast } from "@/hooks/use-toast";

// Interface para o StepHeader
interface StepHeaderProps {
  stepId: string;
  title: string;
  index: number;
  onEditClick: () => void;
}

function StepHeader({ stepId, title, index, onEditClick }: StepHeaderProps) {
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
}

interface StepBuilderProps {
  onStepsChange?: (steps: FormStep[]) => void;
}

export function StepBuilder({ onStepsChange }: StepBuilderProps) {
  const { atoms, actions } = useFormBuilder();
  const [activeStepId, setActiveStepId] = useAtom(atoms.activeStepId);
  const steps = useAtomValue(atoms.steps);
  const activeStep = useAtomValue(atoms.activeStep);
  const addStep = useSetAtom(actions.addStep);
  const updateStep = useSetAtom(actions.updateStep);
  const deleteStep = useSetAtom(actions.deleteStep);
  const [isEditingStep, setIsEditingStep] = useState(false);

  useEffect(() => {
    onStepsChange?.(steps);
  }, [steps, onStepsChange]);

  // Função para criar o formData necessário para o FormBuilder
  const formData: Form = {
    id: "temp-form-id",
    name: "Form Builder",
    slug: "form-builder",
    submitLabel: "Next",
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    steps: activeStep ? [activeStep] : [],
  };

  const handleFormChange = (updatedForm: Form) => {
    if (activeStep && updatedForm.steps[0]) {
      updateStep({
        stepId: activeStep.id,
        data: updatedForm.steps[0],
      });
    }
  };

  const handleStepUpdate = (updates: Partial<FormStep>) => {
    if (activeStep) {
      try {
        updateStep({
          stepId: activeStep.id,
          data: { ...activeStep, ...updates },
        });
        setIsEditingStep(false);
        toast({
          title: "Etapa atualizada",
          description: "As alterações foram salvas com sucesso.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar",
          description: "Ocorreu um erro ao salvar as alterações.",
        });
      }
    }
  };

  const handleStepDelete = () => {
    if (activeStep) {
      try {
        deleteStep(activeStep.id);
        setIsEditingStep(false);
        toast({
          title: "Etapa removida",
          description: "A etapa foi removida com sucesso.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro ao remover",
          description: "Ocorreu um erro ao remover a etapa.",
        });
      }
    }
  };

  const handleAddStep = () => {
    const newStepOrder = steps.length;

    addStep({
      title: `Etapa ${newStepOrder + 1}`,
      description: "",
      order: newStepOrder,
      fields: [],
      variables: [],
    });
  };

  useEffect(() => {
    console.log("Current steps:", steps);
  }, [steps]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Etapas do Formulário</h3>
        <Button onClick={handleAddStep}>
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
                <FormBuilder formData={formData} onChange={handleFormChange} />
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
