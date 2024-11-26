/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/utils/field-utils.ts
import { FieldType } from "@/core/domain/entities/Field";
import {
  TextIcon,
  MailIcon,
  KeyIcon,
  HashIcon,
  PhoneIcon,
  AlignLeftIcon,
  ListIcon,
  CircleDotIcon,
  CheckSquareIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";

export const getFieldLabel = (type: FieldType): string => {
  const labels: Record<FieldType, string> = {
    text: "Texto",
    email: "Email",
    password: "Senha",
    number: "Número",
    tel: "Telefone",
    textarea: "Área de Texto",
    select: "Seleção",
    radio: "Radio",
    checkbox: "Checkbox",
    date: "Data",
    time: "Hora",
  };
  return labels[type] || type;
};

export const getFieldIcon = (type: FieldType) => {
  const icons: Record<FieldType, any> = {
    text: TextIcon,
    email: MailIcon,
    password: KeyIcon,
    number: HashIcon,
    tel: PhoneIcon,
    textarea: AlignLeftIcon,
    select: ListIcon,
    radio: CircleDotIcon,
    checkbox: CheckSquareIcon,
    date: CalendarIcon,
    time: ClockIcon,
  };
  return icons[type] || TextIcon;
};

export const getFieldValidations = (type: FieldType): ValidationRule[] => {
  const commonValidations: ValidationRule[] = [
    {
      type: "required",
      message: "Este campo é obrigatório",
    },
  ];

  const validationsByType: Record<FieldType, ValidationRule[]> = {
    text: [
      ...commonValidations,
      {
        type: "minLength",
        value: 2,
        message: "Digite pelo menos 2 caracteres",
      },
      {
        type: "maxLength",
        value: 100,
        message: "Máximo de 100 caracteres permitido",
      },
    ],

    email: [
      ...commonValidations,
      {
        type: "email",
        message: "Digite um email válido",
      },
    ],

    password: [
      ...commonValidations,
      {
        type: "minLength",
        value: 8,
        message: "A senha deve ter pelo menos 8 caracteres",
      },
      {
        type: "pattern",
        value: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
        message:
          "A senha deve conter pelo menos uma letra maiúscula, uma minúscula e um número",
      },
    ],

    number: [
      ...commonValidations,
      {
        type: "pattern",
        value: "^-?\\d*\\.?\\d+$",
        message: "Digite um número válido",
      },
    ],

    tel: [
      ...commonValidations,
      {
        type: "phone",
        message: "Digite um telefone válido",
      },
    ],

    textarea: [
      ...commonValidations,
      {
        type: "maxLength",
        value: 1000,
        message: "Máximo de 1000 caracteres permitido",
      },
    ],

    select: commonValidations,
    radio: commonValidations,
    checkbox: commonValidations,

    date: [
      ...commonValidations,
      {
        type: "pattern",
        value: "^\\d{4}-\\d{2}-\\d{2}$",
        message: "Data inválida",
      },
    ],

    time: [
      ...commonValidations,
      {
        type: "pattern",
        value: "^([01]?[0-9]|2[0-3]):[0-5][0-9]$",
        message: "Hora inválida",
      },
    ],
  };

  return validationsByType[type] || commonValidations;
};

export const getFieldMask = (type: FieldType): string | undefined => {
  const masks: Partial<Record<FieldType, string>> = {
    tel: "(99) 99999-9999",
    date: "99/99/9999",
    time: "99:99",
  };
  return masks[type];
};

export const getFieldPlaceholder = (type: FieldType): string => {
  const placeholders: Record<FieldType, string> = {
    text: "Digite aqui",
    email: "exemplo@email.com",
    password: "********",
    number: "0",
    tel: "(99) 99999-9999",
    textarea: "Digite seu texto aqui",
    select: "Selecione uma opção",
    radio: "Selecione uma opção",
    checkbox: "Selecione as opções",
    date: "dd/mm/aaaa",
    time: "hh:mm",
  };
  return placeholders[type] || "";
};

interface ValidationRule {
  type: string;
  message: string;
  value?: string | number;
}

export const getDefaultFieldConfig = (type: FieldType) => {
  return {
    label: getFieldLabel(type),
    placeholder: getFieldPlaceholder(type),
    validation: {
      rules: getFieldValidations(type),
      mask: getFieldMask(type),
    },
    options:
      type === "select" || type === "radio" || type === "checkbox"
        ? [
            { label: "Opção 1", value: "1" },
            { label: "Opção 2", value: "2" },
            { label: "Opção 3", value: "3" },
          ]
        : undefined,
  };
};

// Função auxiliar para gerar um ID único para o campo
export const generateFieldId = (type: FieldType, existingFields: any[]) => {
  const baseId = type.toLowerCase();
  const count = existingFields.filter((f) => f.type === type).length + 1;
  return `${baseId}_${count}`;
};

// Função para validar o valor do campo com base no tipo
export const validateFieldValue = (
  value: any,
  type: FieldType,
  validations: ValidationRule[] = []
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Validações básicas por tipo
  switch (type) {
    case "email":
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        errors.push("Email inválido");
      }
      break;

    case "number":
      if (value && !/^-?\d*\.?\d+$/.test(value)) {
        errors.push("Número inválido");
      }
      break;

    case "tel":
      if (value && !/^\(\d{2}\) \d{5}-\d{4}$/.test(value)) {
        errors.push("Telefone inválido");
      }
      break;

    case "date":
      if (value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        errors.push("Data inválida");
      }
      break;

    case "time":
      if (value && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
        errors.push("Hora inválida");
      }
      break;
  }

  // Validações adicionais configuradas
  validations.forEach((rule) => {
    if (rule.type === "required" && !value) {
      errors.push(rule.message);
    } else if (value) {
      switch (rule.type) {
        case "minLength":
          if (rule.value !== undefined && value.length < rule.value) {
            errors.push(rule.message);
          }
          break;
        case "maxLength":
          if (rule.value !== undefined && value.length > rule.value) {
            errors.push(rule.message);
          }
          break;
        case "pattern":
          if (
            typeof rule.value === "string" &&
            !new RegExp(rule.value).test(value)
          ) {
            errors.push(rule.message);
          }
          break;
      }
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
};
