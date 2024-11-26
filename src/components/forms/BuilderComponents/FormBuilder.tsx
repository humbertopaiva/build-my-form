// // src/components/forms/BuilderComponents/FormBuilder.tsx
// "use client";

// import { useState } from "react";
// import {
//   DndContext,
//   DragOverlay,
//   useSensor,
//   useSensors,
//   MouseSensor,
//   TouchSensor,
//   DragStartEvent,
//   DragEndEvent,
// } from "@dnd-kit/core";
// import { FieldPalette } from "./FieldPalette";
// import { BuilderCanvas } from "./BuilderCanvas";
// import { FieldProperties } from "./FieldProperties";
// import { Field, FieldType } from "@/core/domain/entities/Field";
// import { arrayMove } from "@dnd-kit/sortable";

// interface FormBuilderProps {
//   onFieldsChange: (fields: Field[]) => void;
//   initialFields?: Field[];
//   // fields: Field[];
// }

// export function FormBuilder({
//   onFieldsChange,
//   initialFields = [],
// }: FormBuilderProps) {
//   const [fields, setFields] = useState<Field[]>(initialFields);
//   const [selectedField, setSelectedField] = useState<Field | null>(null);
//   const [activeId, setActiveId] = useState<string | null>(null);

//   const sensors = useSensors(
//     useSensor(MouseSensor, {
//       activationConstraint: {
//         distance: 10,
//       },
//     }),
//     useSensor(TouchSensor, {
//       activationConstraint: {
//         delay: 250,
//         tolerance: 5,
//       },
//     })
//   );

//   const handleFieldSelect = (field: Field | null) => {
//     setSelectedField(field);
//   };

//   const handleFieldUpdate = (updatedField: Field) => {
//     const updatedFields = fields.map((field) =>
//       field.id === updatedField.id ? updatedField : field
//     );
//     setFields(updatedFields);
//     onFieldsChange(updatedFields);
//     setSelectedField(updatedField); // Mantém o campo selecionado após atualização
//   };

//   const handleFieldDelete = (fieldId: string) => {
//     const updatedFields = fields.filter((field) => field.id !== fieldId);
//     updatedFields.forEach((field, index) => {
//       field.order = index;
//     });
//     setFields(updatedFields);
//     onFieldsChange(updatedFields);
//     setSelectedField(null);
//   };

//   const handleDragStart = (event: DragStartEvent) => {
//     setActiveId(event.active.id as string);
//     // // Não limpar a seleção durante o drag
//     // setSelectedField(null);
//   };

//   const handleDragEnd = (event: DragEndEvent) => {
//     setActiveId(null);

//     const { active, over } = event;

//     if (!over || over.id !== "canvas") return;

//     if (typeof active.id === "string" && active.id.startsWith("palette-")) {
//       // Novo campo sendo adicionado do painel
//       const type = active.id.replace("palette-", "") as FieldType;
//       const newField: Field = {
//         id: `field-${Date.now()}`,
//         formId: "",
//         name: `field_${fields.length + 1}`,
//         label: `Campo ${fields.length + 1}`,
//         type,
//         required: false,
//         order: fields.length,
//       };

//       const updatedFields = [...fields, newField];
//       setFields(updatedFields);
//       onFieldsChange(updatedFields);
//       setSelectedField(newField); // Seleciona o novo campo automaticamente
//     } else {
//       // Reordenação de campos existentes
//       const oldIndex = fields.findIndex((f) => f.id === active.id);
//       const newIndex = fields.findIndex((f) => f.id === over.id);

//       if (oldIndex !== -1 && newIndex !== -1) {
//         const updatedFields = arrayMove(fields, oldIndex, newIndex);
//         updatedFields.forEach((field, index) => {
//           field.order = index;
//         });
//         setFields(updatedFields);
//         onFieldsChange(updatedFields);
//       }
//     }
//   };

//   return (
//     <DndContext
//       sensors={sensors}
//       onDragStart={handleDragStart}
//       onDragEnd={handleDragEnd}
//     >
//       <div className="flex h-[calc(100vh-200px)] gap-4">
//         <div className="w-64 bg-white p-4 rounded-lg shadow overflow-y-auto">
//           <FieldPalette />
//         </div>

//         <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
//           <BuilderCanvas
//             fields={fields}
//             selectedField={selectedField}
//             onSelect={handleFieldSelect}
//           />
//         </div>

//         <div className="w-80 bg-white p-4 rounded-lg shadow overflow-y-auto">
//           {selectedField && (
//             <FieldProperties
//               field={selectedField}
//               onUpdate={handleFieldUpdate}
//               onDelete={handleFieldDelete}
//             />
//           )}
//         </div>

//         <DragOverlay>
//           {activeId && (
//             <div className="p-4 bg-white shadow rounded border-2 border-indigo-500 opacity-80">
//               {activeId.startsWith("palette-") ? "Novo Campo" : "Mover Campo"}
//             </div>
//           )}
//         </DragOverlay>
//       </div>
//     </DndContext>
//   );
// }

"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { FieldPalette } from "./FieldPalette";
import { BuilderCanvas } from "./BuilderCanvas";
import { FieldProperties } from "./FieldProperties";
import { Field, FieldType } from "@/core/domain/entities/Field";
import { arrayMove } from "@dnd-kit/sortable";

interface FormBuilderProps {
  onFieldsChange: (fields: Field[]) => void;
  initialFields?: Field[];
}

export function FormBuilder({
  onFieldsChange,
  initialFields = [],
}: FormBuilderProps) {
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  const handleFieldSelect = (field: Field | null) => {
    setSelectedField(field);
  };

  const handleFieldUpdate = (updatedField: Field) => {
    const updatedFields = fields.map((field) =>
      field.id === updatedField.id ? updatedField : field
    );
    setFields(updatedFields);
    onFieldsChange(updatedFields);

    // Atualiza o estado do campo selecionado
    setSelectedField(updatedField);
  };

  const handleFieldDelete = (fieldId: string) => {
    const updatedFields = fields.filter((field) => field.id !== fieldId);
    updatedFields.forEach((field, index) => {
      field.order = index;
    });
    setFields(updatedFields);
    onFieldsChange(updatedFields);

    // Limpa a seleção se o campo deletado for o selecionado
    if (selectedField?.id === fieldId) {
      setSelectedField(null);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);

    const { active, over } = event;

    if (!over || over.id !== "canvas") return;

    if (typeof active.id === "string" && active.id.startsWith("palette-")) {
      // Adicionar novo campo
      const type = active.id.replace("palette-", "") as FieldType;
      const newField: Field = {
        id: `field-${Date.now()}`,
        formId: "",
        name: `field_${fields.length + 1}`,
        label: `Campo ${fields.length + 1}`,
        type,
        required: false,
        order: fields.length,
      };

      const updatedFields = [...fields, newField];
      setFields(updatedFields);
      onFieldsChange(updatedFields);

      // Seleciona o novo campo automaticamente
      setSelectedField(newField);
    } else {
      // Reordenar campos existentes
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const updatedFields = arrayMove(fields, oldIndex, newIndex);
        updatedFields.forEach((field, index) => {
          field.order = index;
        });
        setFields(updatedFields);
        onFieldsChange(updatedFields);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-[calc(100vh-200px)] gap-4">
        <div className="w-64 bg-white p-4 rounded-lg shadow overflow-y-auto">
          <FieldPalette />
        </div>

        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
          <BuilderCanvas
            fields={fields}
            selectedField={selectedField}
            onSelect={handleFieldSelect}
          />
        </div>

        <div className="w-80 bg-white p-4 rounded-lg shadow overflow-y-auto">
          {selectedField && (
            <FieldProperties
              field={selectedField}
              onUpdate={handleFieldUpdate}
              onDelete={handleFieldDelete}
            />
          )}
        </div>

        <DragOverlay>
          {activeId && (
            <div className="p-4 bg-white shadow rounded border-2 border-indigo-500 opacity-80">
              {activeId.startsWith("palette-") ? "Novo Campo" : "Mover Campo"}
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
