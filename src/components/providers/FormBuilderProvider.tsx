/* eslint-disable @typescript-eslint/no-explicit-any */
// components/providers/FormBuilderProvider.tsx
import { Provider } from "jotai";
import { useHydrateAtoms } from "jotai/utils";
import { FormStep } from "@/core/domain/entities/Form";
import { formBuilderAtom } from "@/store/form-builder";
import { useState } from "react";

interface FormBuilderProviderProps {
  initialSteps?: FormStep[];
  children: React.ReactNode;
}

function FormBuilderStateHydration({
  initialState,
  children,
}: {
  initialState: any;
  children: React.ReactNode;
}) {
  useHydrateAtoms([[formBuilderAtom, initialState]]);
  return <>{children}</>;
}

export function FormBuilderProvider({
  children,
  initialSteps = [],
}: FormBuilderProviderProps) {
  // Use useState para manter o estado entre renderizações
  const [initialState] = useState(() => ({
    steps: initialSteps,
    activeStepId: initialSteps[0]?.id || null,
    selectedFieldId: null,
    isDragging: false,
  }));

  return (
    <Provider>
      <FormBuilderStateHydration initialState={initialState}>
        {children}
      </FormBuilderStateHydration>
    </Provider>
  );
}
