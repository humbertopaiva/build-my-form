// src/store/form-builder.ts
import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { FormStep } from "@/core/domain/entities/Form";
import { Field, WebhookVariable } from "@/core/domain/entities/Field";

// Tipos
interface FormBuilderState {
  steps: FormStep[];
  activeStepId: string | null;
  selectedFieldId: string | null;
  isDragging: boolean;
}

// Estado inicial
const initialState: FormBuilderState = {
  steps: [],
  activeStepId: null,
  selectedFieldId: null,
  isDragging: false,
};

// Atom principal
export const formBuilderAtom = atom<FormBuilderState>(initialState);

// Atoms derivados
export const stepsAtom = focusAtom(formBuilderAtom, (optic) =>
  optic.prop("steps")
);
export const activeStepIdAtom = focusAtom(formBuilderAtom, (optic) =>
  optic.prop("activeStepId")
);
export const selectedFieldIdAtom = focusAtom(formBuilderAtom, (optic) =>
  optic.prop("selectedFieldId")
);
export const isDraggingAtom = focusAtom(formBuilderAtom, (optic) =>
  optic.prop("isDragging")
);

// Atoms computados
export const activeStepAtom = atom((get) => {
  const steps = get(stepsAtom);
  const activeStepId = get(activeStepIdAtom);
  return steps.find((step) => step.id === activeStepId) || null;
});

export const selectedFieldAtom = atom((get) => {
  const activeStep = get(activeStepAtom);
  const selectedFieldId = get(selectedFieldIdAtom);
  return (
    activeStep?.fields.find((field) => field.id === selectedFieldId) || null
  );
});

interface NewStepData {
  title: string;
  description: string;
  order: number;
  fields: Field[];
  variables: WebhookVariable[];
}
// Actions
export const formBuilderActions = {
  addStep: atom(null, (get, set, newStepData: NewStepData) => {
    const uuid = crypto.randomUUID();
    const formState = get(formBuilderAtom);

    set(formBuilderAtom, {
      ...formState,
      steps: [
        ...formState.steps,
        {
          id: uuid,
          formId: "", // será preenchido quando salvar no backend
          ...newStepData,
        },
      ],
    });

    return uuid;
  }),

  updateStep: atom(
    null,
    (get, set, update: { stepId: string; data: Partial<FormStep> }) => {
      const steps = get(stepsAtom);
      const updatedSteps = steps.map((step) =>
        step.id === update.stepId ? { ...step, ...update.data } : step
      );
      set(stepsAtom, updatedSteps);
    }
  ),

  deleteStep: atom(null, (get, set, stepId: string) => {
    const steps = get(stepsAtom);
    const updatedSteps = steps.filter((step) => step.id !== stepId);
    set(stepsAtom, updatedSteps);

    if (get(activeStepIdAtom) === stepId) {
      set(activeStepIdAtom, updatedSteps[0]?.id || null);
    }
  }),

  addField: atom(null, (get, set, field: Omit<Field, "id" | "formId">) => {
    const activeStep = get(activeStepAtom);
    if (!activeStep) return;

    const newField: Field = {
      ...field,
      id: `field-${Date.now()}`,
      formId: activeStep.formId,
      order: activeStep.fields.length,
    };

    const updatedFields = [...activeStep.fields, newField];
    formBuilderActions.updateStep.write(get, set, {
      stepId: activeStep.id,
      data: { fields: updatedFields },
    });
    set(selectedFieldIdAtom, newField.id);
  }),

  updateField: atom(
    null,
    (get, set, update: { fieldId: string; data: Partial<Field> }) => {
      const activeStep = get(activeStepAtom);
      if (!activeStep) return;

      const updatedFields = activeStep.fields.map((field) =>
        field.id === update.fieldId ? { ...field, ...update.data } : field
      );

      formBuilderActions.updateStep.write(get, set, {
        stepId: activeStep.id,
        data: { fields: updatedFields },
      });
    }
  ),

  deleteField: atom(null, (get, set, fieldId: string) => {
    const activeStep = get(activeStepAtom);
    if (!activeStep) return;

    const updatedFields = activeStep.fields
      .filter((field) => field.id !== fieldId)
      .map((field, index) => ({ ...field, order: index }));

    formBuilderActions.updateStep.write(get, set, {
      stepId: activeStep.id,
      data: { fields: updatedFields },
    });

    if (get(selectedFieldIdAtom) === fieldId) {
      set(selectedFieldIdAtom, null);
    }
  }),

  reorderFields: atom(
    null,
    (
      get,
      set,
      { oldIndex, newIndex }: { oldIndex: number; newIndex: number }
    ) => {
      const activeStep = get(activeStepAtom);
      if (!activeStep) return;

      const fields = [...activeStep.fields];
      const [removed] = fields.splice(oldIndex, 1);
      fields.splice(newIndex, 0, removed);

      const updatedFields = fields.map((field, index) => ({
        ...field,
        order: index,
      }));

      formBuilderActions.updateStep.write(get, set, {
        stepId: activeStep.id,
        data: { fields: updatedFields },
      });
    }
  ),
};

// Hook personalizado para acessar o estado e as actions
export function useFormBuilder() {
  return {
    atoms: {
      formBuilder: formBuilderAtom,
      steps: stepsAtom,
      activeStepId: activeStepIdAtom,
      selectedFieldId: selectedFieldIdAtom,
      isDragging: isDraggingAtom,
      activeStep: activeStepAtom,
      selectedField: selectedFieldAtom,
    },
    actions: formBuilderActions,
  };
}
