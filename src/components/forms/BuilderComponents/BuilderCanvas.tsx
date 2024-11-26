import { useDroppable } from "@dnd-kit/core";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Field } from "@/core/domain/entities/Field";
import { cn } from "@/lib/utils";

interface BuilderCanvasProps {
  fields: Field[];
  selectedField: Field | null;
  onSelect: (field: Field | null) => void;
}

function SortableField({
  field,
  isSelected,
  onSelect,
}: {
  field: Field;
  isSelected: boolean;
  onSelect: (field: Field | null) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: field.id,
    data: { field },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 999 : undefined,
  };

  const handleClick = (e: React.MouseEvent) => {
    onSelect(null);
    setTimeout(() => {
      e.stopPropagation();
      onSelect(field);
    }, 0);
    e.stopPropagation();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
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
    </div>
  );
}

export function BuilderCanvas({
  fields,
  selectedField,
  onSelect,
}: BuilderCanvasProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "canvas" });

  const handleCanvasClick = () => {
    onSelect(null);
  };

  return (
    <div
      ref={setNodeRef}
      onClick={handleCanvasClick}
      className={cn(
        "h-full p-8 bg-gray-50 overflow-y-auto transition-colors",
        isOver && "bg-indigo-50"
      )}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {fields.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed">
            <p className="text-gray-500">
              Arraste campos aqui para começar a construir seu formulário
            </p>
          </div>
        ) : (
          fields.map((field) => (
            <SortableField
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
