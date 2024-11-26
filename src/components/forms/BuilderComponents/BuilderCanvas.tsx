// src/components/forms/BuilderComponents/BuilderCanvas.tsx
"use client";

import { useDroppable, useDraggable } from "@dnd-kit/core";
import { Field } from "@/core/domain/entities/Field";
import { cn } from "@/lib/utils";

interface BuilderCanvasProps {
  fields: Field[];
  selectedField: Field | null;
  onSelect: (field: Field) => void;
}

function DraggableField({
  field,
  isSelected,
  onSelect,
}: {
  field: Field;
  isSelected: boolean;
  onSelect: (field: Field) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: field.id,
      data: {
        field,
        isTemplate: false,
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
      onClick={() => onSelect(field)}
      className={cn(
        "p-4 bg-white rounded-lg border shadow-sm cursor-move hover:border-indigo-500 transition-colors",
        isSelected && "border-indigo-500 ring-2 ring-indigo-200",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-900">{field.label}</span>
        <span className="text-xs text-gray-500">{field.type}</span>
      </div>
      <div className="mt-1">
        <input
          type={field.type === "textarea" ? "text" : field.type}
          placeholder={field.placeholder}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          disabled
        />
      </div>
    </div>
  );
}

export function BuilderCanvas({
  fields,
  selectedField,
  onSelect,
}: BuilderCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: "canvas",
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "h-full p-8 bg-gray-50 overflow-y-auto transition-colors",
        isOver && "bg-indigo-50"
      )}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {fields.length === 0 ? (
          <div
            className={cn(
              "text-center py-12 bg-white rounded-lg border-2 border-dashed",
              isOver ? "border-indigo-500 bg-indigo-50" : "border-gray-300"
            )}
          >
            <p className="text-gray-500">
              Arraste campos aqui para começar a construir seu formulário
            </p>
          </div>
        ) : (
          fields.map((field) => (
            <DraggableField
              key={field.id}
              field={field}
              isSelected={selectedField?.id === field.id}
              onSelect={onSelect}
            />
          ))
        )}
      </div>
    </div>
  );
}
