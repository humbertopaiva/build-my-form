/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/BuilderComponents/FormPreview.tsx
"use client";

import { DynamicField } from "@/components/forms/PublicComponents/DynamicField";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FormPreviewProps {
  formData: any;
  className?: string;
}

export function FormPreview({ formData, className }: FormPreviewProps) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [formValidity, setFormValidity] = useState<Record<string, boolean>>({});

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

  const isFormValid = () => Object.values(formValidity).every((valid) => valid);

  return (
    <div className={cn("bg-white", className)}>
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          {formData.name || "Preview do Formulário"}
        </h3>
        <div className="space-y-6">
          {formData.fields.map((field: any, index: number) => (
            <DynamicField
              key={index}
              field={field}
              formValues={formValues}
              onChange={(value, isValid) =>
                handleFieldChange(field.name, value, isValid)
              }
            />
          ))}
          <div className="flex justify-end">
            <button
              type="button"
              disabled={!isFormValid()}
              className={`
                px-4 py-2 text-sm font-semibold rounded-md text-white
                ${
                  isFormValid()
                    ? "bg-indigo-600 hover:bg-indigo-500"
                    : "bg-gray-400 cursor-not-allowed"
                }
              `}
            >
              {formData.submitLabel || "Enviar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
