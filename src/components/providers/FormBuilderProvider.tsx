// src/components/providers/FormBuilderProvider.tsx
import { Provider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { FormStep } from "@/core/domain/entities/Form";
import { formBuilderAtom } from "@/store/form-builder";

interface FormBuilderProviderProps {
  initialSteps?: FormStep[];
  children: React.ReactNode;
}

function FormBuilderStateHydration({
  initialSteps,
  children,
}: FormBuilderProviderProps) {
  useHydrateAtoms([
    [
      formBuilderAtom,
      {
        steps: initialSteps || [],
        activeStepId: initialSteps?.[0]?.id || null,
        selectedFieldId: null,
        isDragging: false,
      },
    ],
  ]);

  return <>{children}</>;
}

export function FormBuilderProvider({
  initialSteps,
  children,
}: FormBuilderProviderProps) {
  return (
    <Provider>
      <FormBuilderStateHydration initialSteps={initialSteps}>
        {children}
      </FormBuilderStateHydration>
    </Provider>
  );
}
