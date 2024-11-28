"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
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
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { FieldPalette } from "./FieldPalette";
import { BuilderCanvas } from "./BuilderCanvas";
import { FieldProperties } from "./FieldProperties";
import { Field, FieldType } from "@/core/domain/entities/Field";
import { useFormBuilder } from "@/store/form-builder";
import { getFieldLabel } from "@/lib/utils/field-utils";
import { MultiStepForm } from "../PublicComponents/MultiStepForm";
import { Form } from "@/core/domain/entities/Form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Eye } from "lucide-react";

interface FormBuilderProps {
  formData: Form;
  onChange: (form: Form) => void;
}

export function FormBuilder({ formData, onChange }: FormBuilderProps) {
  const { atoms, actions } = useFormBuilder();
  const activeStep = useAtomValue(atoms.activeStep);
  const selectedField = useAtomValue(atoms.selectedField);
  const selectedFieldId = useAtomValue(atoms.selectedFieldId);
  const isDragging = useAtomValue(atoms.isDragging);
  const [showPreview, setShowPreview] = useState(false);
  const [isPreviewModal, setIsPreviewModal] = useState(false);

  const setSelectedFieldId = useSetAtom(atoms.selectedFieldId);
  const setIsDragging = useSetAtom(atoms.isDragging);
  const addField = useSetAtom(actions.addField);
  const updateField = useSetAtom(actions.updateField);
  const deleteField = useSetAtom(actions.deleteField);
  const reorderFields = useSetAtom(actions.reorderFields);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    })
  );

  const handleFieldSelect = (field: Field | null) => {
    setSelectedFieldId(field?.id || null);
  };

  const handleFieldUpdate = (updatedField: Field) => {
    updateField({ fieldId: updatedField.id, data: updatedField });
  };

  const handleFieldDelete = (fieldId: string) => {
    deleteField(fieldId);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);
    setSelectedFieldId(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setIsDragging(false);
      return;
    }

    if (active.id.toString().startsWith("palette-")) {
      const type = active.id.toString().replace("palette-", "") as FieldType;
      const newField = {
        name: `${type}_${activeStep?.fields.length || 0 + 1}`,
        label: getFieldLabel(type),
        type,
        required: false,
        order: activeStep?.fields.length || 0,
      };
      addField(newField);
    } else if (active.id !== over.id && activeStep) {
      const oldIndex = activeStep.fields.findIndex((f) => f.id === active.id);
      const newIndex = activeStep.fields.findIndex((f) => f.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderFields({ oldIndex, newIndex });
      }
    }

    setIsDragging(false);
  };

  if (!activeStep) return null;

  const previewForm = {
    ...formData,
    steps: [
      {
        ...activeStep,
        fields: activeStep.fields,
      },
    ],
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-full gap-4">
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? "Esconder Preview" : "Mostrar Preview"}
          </Button>
          <Button variant="outline" onClick={() => setIsPreviewModal(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview em Tela Cheia
          </Button>
        </div>

        <div className="flex flex-1 gap-4 min-h-0">
          <div className="w-64 bg-white p-4 rounded-lg shadow overflow-y-auto">
            <FieldPalette />
          </div>

          <div className="flex flex-1 gap-4">
            <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
              <SortableContext
                items={activeStep.fields.map((f) => f.id)}
                strategy={verticalListSortingStrategy}
              >
                <BuilderCanvas
                  fields={activeStep.fields}
                  selectedField={selectedField}
                  onSelect={handleFieldSelect}
                />
              </SortableContext>
            </div>

            {showPreview && (
              <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-medium mb-4">Preview</h3>
                <MultiStepForm form={previewForm} onComplete={() => {}} />
              </div>
            )}
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
        </div>

        <Dialog open={isPreviewModal} onOpenChange={setIsPreviewModal}>
          <DialogContent className="max-w-4xl h-[90vh]">
            <div className="h-full overflow-y-auto p-6">
              <MultiStepForm
                form={previewForm}
                onComplete={() => setIsPreviewModal(false)}
              />
            </div>
          </DialogContent>
        </Dialog>

        <DragOverlay>
          {isDragging && (
            <div className="p-4 bg-white shadow rounded border-2 border-indigo-500 opacity-80">
              {selectedFieldId?.toString().startsWith("palette-")
                ? `Novo Campo: ${getFieldLabel(
                    selectedFieldId
                      .toString()
                      .replace("palette-", "") as FieldType
                  )}`
                : "Mover Campo"}
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
