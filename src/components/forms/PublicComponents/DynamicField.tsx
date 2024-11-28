/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { ValidationService } from "@/core/application/services/ValidationService";
import { ValidationManager } from "@/core/application/services/ValidationManager";
import { useMask } from "@/hooks/useMask";
import { Field, FieldConditionalLogic } from "@/core/domain/entities/Field";
import { Loader2 } from "lucide-react";

interface DynamicFieldProps {
  field: Field;
  value?: string;
  formValues: Record<string, any>;
  onChange?: (value: string, isValid: boolean) => void;
  disabled?: boolean;
  required?: boolean; // Adicionando a prop required
}

export function DynamicField({
  field,
  value: initialValue = "",
  formValues,
  onChange,
  disabled = false,
  required: propRequired, // Renomeando para evitar conflito com field.required
}: DynamicFieldProps) {
  const [value, setValue] = useState(initialValue);
  const [errors, setErrors] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const mask = useMask(field.validation?.mask);

  // Usar propRequired se fornecido, caso contrário usar field.required
  const isRequired = propRequired ?? field.required;

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    if (!field.conditionalLogic) {
      setIsVisible(true);
      return;
    }

    const shouldBeVisible = evaluateFieldConditions(field.conditionalLogic);
    setIsVisible(shouldBeVisible);

    if (!shouldBeVisible) {
      setValue("");
      onChange?.("", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.conditionalLogic, formValues, onChange]);

  const evaluateFieldConditions = (logic: FieldConditionalLogic): boolean => {
    return logic.conditions.every((condition) => {
      const targetValue = formValues[condition.field];

      switch (condition.operator) {
        case "equals":
          return targetValue === condition.value;
        case "contains":
          return Array.isArray(targetValue)
            ? targetValue.includes(condition.value)
            : String(targetValue).includes(String(condition.value));
        case "greaterThan":
          return Number(targetValue) > Number(condition.value);
        case "lessThan":
          return Number(targetValue) < Number(condition.value);
        default:
          return true;
      }
    });
  };

  const validateField = async (fieldValue: string) => {
    if (field.validation?.rules) {
      const result = ValidationService.validate(
        fieldValue,
        field.validation.rules
      );
      setErrors(result.errors);

      if (!result.isValid) {
        onChange?.(fieldValue, false);
        return;
      }
    }

    if (field.validation?.async) {
      setIsValidating(true);
      try {
        const payloadData = field.validation.async.payloadFields.reduce(
          (acc, fieldName) => ({
            ...acc,
            [fieldName]: formValues[fieldName],
          }),
          {}
        );

        const response = await fetch(field.validation.async.endpoint, {
          method: field.validation.async.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...payloadData,
            [field.name]: fieldValue,
          }),
        });

        if (!response.ok) {
          throw new Error("Validação falhou");
        }

        const data = await response.json();

        Object.entries(field.validation.async.responseMapping).forEach(
          ([responseField, formField]) => {
            const mappedValue = data[responseField];
            if (mappedValue !== undefined) {
              onChange?.(mappedValue, true);
            }
          }
        );

        setErrors([]);
        onChange?.(fieldValue, true);
      } catch (error) {
        console.error("Erro na validação:", error);
        setErrors(["Erro ao validar campo"]);
        onChange?.(fieldValue, false);
      } finally {
        setIsValidating(false);
      }
    } else {
      onChange?.(fieldValue, true);
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const newValue =
      field.validation?.mask && "target" in e
        ? mask(e.target.value)
        : e.target.value;

    setValue(newValue);
    await validateField(newValue);
  };

  if (!isVisible) {
    return null;
  }

  const renderField = () => {
    const commonProps = {
      name: field.name,
      id: field.name,
      value,
      onChange: handleChange,
      disabled: disabled || isValidating,
      placeholder: field.placeholder,
      required: isRequired,
      className: `
        mt-1 block w-full rounded-md border-gray-300 shadow-sm
        focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
        ${errors.length > 0 ? "border-red-300" : "border-gray-300"}
        ${disabled || isValidating ? "bg-gray-100" : ""}
      `,
    };

    switch (field.type) {
      case "textarea":
        return <textarea {...commonProps} rows={4} />;

      case "select":
        return (
          <select {...commonProps}>
            <option value="">{field.placeholder || "Selecione..."}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="space-y-2">
            {field.options?.map((option) => (
              <div key={option.value} className="flex items-center">
                <input
                  type="radio"
                  id={`${field.name}-${option.value}`}
                  name={field.name}
                  value={option.value}
                  checked={value === option.value}
                  onChange={handleChange}
                  disabled={disabled || isValidating}
                  required={isRequired}
                  className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor={`${field.name}-${option.value}`}
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="relative">
            <input {...commonProps} type={field.type} />
            {isValidating && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={field.name}
        className="block text-sm font-medium text-gray-700"
      >
        {field.label}
        {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>

      {renderField()}

      {errors.length > 0 && (
        <div className="mt-1">
          {errors.map((error, index) => (
            <p key={index} className="text-sm text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}

      {field.helpText && (
        <p className="mt-1 text-sm text-gray-500">{field.helpText}</p>
      )}
    </div>
  );
}
