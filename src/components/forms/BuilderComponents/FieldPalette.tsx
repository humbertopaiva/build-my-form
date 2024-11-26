/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/BuilderComponents/FieldPalette.tsx
"use client";

import { useDraggable } from "@dnd-kit/core";
import {
  TextIcon,
  MailIcon,
  PhoneIcon,
  HashIcon,
  AlignJustifyIcon,
  ListIcon,
  RadioIcon,
  CheckSquareIcon,
  CalendarIcon,
  ClockIcon,
} from "lucide-react";

const fieldTypes = [
  { id: "text", icon: TextIcon, label: "Texto" },
  { id: "email", icon: MailIcon, label: "Email" },
  { id: "tel", icon: PhoneIcon, label: "Telefone" },
  { id: "number", icon: HashIcon, label: "Número" },
  { id: "textarea", icon: AlignJustifyIcon, label: "Área de Texto" },
  { id: "select", icon: ListIcon, label: "Seleção" },
  { id: "radio", icon: RadioIcon, label: "Radio" },
  { id: "checkbox", icon: CheckSquareIcon, label: "Checkbox" },
  { id: "date", icon: CalendarIcon, label: "Data" },
  { id: "time", icon: ClockIcon, label: "Hora" },
];

function DraggableField({ type, icon: Icon, label }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `palette-${type}`,
      data: {
        type,
        isTemplate: true,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 999 : undefined,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-3 p-3 bg-white border rounded-lg cursor-move hover:bg-gray-50 hover:border-indigo-500 transition-colors ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <Icon className="h-5 w-5 text-gray-500" />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export function FieldPalette() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 mb-4">Campos Disponíveis</h3>
      <div className="space-y-2">
        {fieldTypes.map((field) => (
          <DraggableField
            key={field.id}
            type={field.id}
            icon={field.icon}
            label={field.label}
          />
        ))}
      </div>
    </div>
  );
}
