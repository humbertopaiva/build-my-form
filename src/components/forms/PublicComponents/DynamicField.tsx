/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/PublicComponents/DynamicField.tsx
"use client";

import { useEffect, useState } from "react";
import { ValidationService } from "@/core/application/services/ValidationService";

import { useMask } from "@/hooks/useMask";
import { ConditionalRule, Field } from "@/core/domain/entities/Field";

interface DynamicFieldProps {
  field: Field;
  formValues: Record<string, any>; // Valores de todos os campos do formulário
  onChange?: (value: string, isValid: boolean) => void;
}

export function DynamicField({
  field,
  formValues,
  onChange,
}: DynamicFieldProps) {
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(true);
  const mask = useMask(field.validation?.mask);

  useEffect(() => {
    if (!field.conditional) {
      setIsVisible(true);
      return;
    }

    const shouldBeVisible = evaluateCondition(field.conditional, formValues);
    setIsVisible(shouldBeVisible);

    // Se o campo ficar invisível, limpa seu valor
    if (!shouldBeVisible) {
      setValue("");
      onChange?.("", true);
    }
  }, [field.conditional, formValues, onChange]);

  const evaluateCondition = (
    condition: ConditionalRule,
    values: Record<string, any>
  ): boolean => {
    const targetValue = values[condition.field];

    switch (condition.operator) {
      case "equals":
        return targetValue === condition.value;

      case "notEquals":
        return targetValue !== condition.value;

      case "contains":
        return (
          Array.isArray(targetValue) && targetValue.includes(condition.value)
        );

      case "notContains":
        return (
          Array.isArray(targetValue) && !targetValue.includes(condition.value)
        );

      case "greaterThan":
        return Number(targetValue) > Number(condition.value);

      case "lessThan":
        return Number(targetValue) < Number(condition.value);

      default:
        return true;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const newValue =
      field.validation?.mask && "target" in e
        ? mask(e.target.value)
        : e.target.value;

    setValue(newValue);

    if (field.validation?.rules) {
      const result = ValidationService.validate(
        newValue,
        field.validation.rules
      );
      setErrors(result.errors);
      onChange?.(newValue, result.isValid);
    } else {
      onChange?.(newValue, true);
    }
  };

  if (!isVisible) {
    return null;
  }

  const renderField = () => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            name={field.name}
            id={field.name}
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            className={`
              mt-1 block w-full rounded-md border-gray-300 shadow-sm
              focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
              ${errors.length > 0 ? "border-red-300" : "border-gray-300"}
            `}
            rows={4}
          />
        );

      case "select":
        return (
          <select
            name={field.name}
            id={field.name}
            value={value}
            onChange={handleChange}
            required={field.required}
            className={`
              mt-1 block w-full rounded-md border-gray-300 shadow-sm
              focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
              ${errors.length > 0 ? "border-red-300" : "border-gray-300"}
            `}
          >
            <option value="">{field.placeholder || "Selecione..."}</option>
            {field.options?.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return (
          <input
            type={field.type}
            name={field.name}
            id={field.name}
            value={value}
            onChange={handleChange}
            placeholder={field.placeholder}
            required={field.required}
            className={`
              mt-1 block w-full rounded-md border-gray-300 shadow-sm
              focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
              ${errors.length > 0 ? "border-red-300" : "border-gray-300"}
            `}
          />
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
        {field.required && <span className="text-red-500 ml-1">*</span>}
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
