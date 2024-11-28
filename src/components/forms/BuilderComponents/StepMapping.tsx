/* eslint-disable @typescript-eslint/no-explicit-any */
// components/forms/BuilderComponents/StepMapping.tsx

import { Card, CardContent } from "@/components/ui/card";
import { FormLabel } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface StepMappingProps {
  availableFields: { id: string; label: string }[];
  previousFields: { id: string; label: string }[];
  mappings: any[];
  onUpdateMappings: (mappings: any[]) => void;
}

export function StepMapping({
  availableFields,
  previousFields,
  mappings,
  onUpdateMappings,
}: StepMappingProps) {
  const addMapping = () => {
    onUpdateMappings([
      ...mappings,
      {
        sourceField: "",
        targetField: "",
        transform: "",
      },
    ]);
  };

  const updateMapping = (index: number, updates: any) => {
    const newMappings = mappings.map((mapping, i) =>
      i === index ? { ...mapping, ...updates } : mapping
    );
    onUpdateMappings(newMappings);
  };

  const removeMapping = (index: number) => {
    onUpdateMappings(mappings.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Mapeamento de Campos</h4>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addMapping}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Mapeamento
            </Button>
          </div>

          {mappings.map((mapping, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormLabel>Campo de Origem (Step Anterior)</FormLabel>
                  <Select
                    value={mapping.sourceField}
                    onValueChange={(value) =>
                      updateMapping(index, { sourceField: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o campo" />
                    </SelectTrigger>
                    <SelectContent>
                      {previousFields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <FormLabel>Campo de Destino</FormLabel>
                  <Select
                    value={mapping.targetField}
                    onValueChange={(value) =>
                      updateMapping(index, { targetField: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o campo" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <FormLabel>Transformação (opcional)</FormLabel>
                <Input
                  value={mapping.transform}
                  onChange={(e) =>
                    updateMapping(index, { transform: e.target.value })
                  }
                  placeholder="Ex: value => value.toUpperCase()"
                />
              </div>

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => removeMapping(index)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remover Mapeamento
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
