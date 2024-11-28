/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/forms/BuilderComponents/StepRules.tsx

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, WebhookFieldCondition } from "@/core/domain/entities/Field";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";

interface StepRulesProps {
  fields: Field[];
  variables: { name: string; type: string }[];
  conditions: WebhookFieldCondition[];
  onChange: (conditions: WebhookFieldCondition[]) => void;
}

export function StepRules({
  fields,
  variables,
  conditions,
  onChange,
}: StepRulesProps) {
  const addCondition = () => {
    onChange([
      ...conditions,
      {
        fieldId: "", // usando fieldId
        variablePath: "",
        operator: "equals",
        value: "",
        action: "show",
      },
    ]);
  };

  const updateCondition = (
    index: number,
    updates: Partial<WebhookFieldCondition>
  ) => {
    const newConditions = conditions.map((condition, i) =>
      i === index ? { ...condition, ...updates } : condition
    );
    onChange(newConditions);
  };

  const removeCondition = (index: number) => {
    onChange(conditions.filter((_, i) => i !== index));
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <FormLabel>Regras de Visibilidade</FormLabel>
          <Button onClick={addCondition} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Regra
          </Button>
        </div>

        {conditions.map((condition, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {/* Campo alvo */}
              <Select
                value={condition.fieldId}
                onValueChange={(value) =>
                  updateCondition(index, { fieldId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o campo" />
                </SelectTrigger>
                <SelectContent>
                  {fields.map((field) => (
                    <SelectItem key={field.id} value={field.id}>
                      {field.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Variável */}
              <Select
                value={condition.variablePath}
                onValueChange={(value) =>
                  updateCondition(index, { variablePath: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a variável" />
                </SelectTrigger>
                <SelectContent>
                  {variables.map((variable) => (
                    <SelectItem key={variable.name} value={variable.name}>
                      {variable.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Operador */}
              <Select
                value={condition.operator}
                onValueChange={(value: any) =>
                  updateCondition(index, { operator: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Operador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">Igual a</SelectItem>
                  <SelectItem value="notEquals">Diferente de</SelectItem>
                  <SelectItem value="contains">Contém</SelectItem>
                  <SelectItem value="notContains">Não contém</SelectItem>
                  <SelectItem value="greaterThan">Maior que</SelectItem>
                  <SelectItem value="lessThan">Menor que</SelectItem>
                  <SelectItem value="exists">Existe</SelectItem>
                  <SelectItem value="notExists">Não existe</SelectItem>
                </SelectContent>
              </Select>

              {/* Valor */}
              <div className="flex gap-2">
                <Input
                  value={condition.value}
                  onChange={(e) =>
                    updateCondition(index, { value: e.target.value })
                  }
                  placeholder="Valor para comparação"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCondition(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>

            {/* Ação */}
            <div className="mt-2">
              <Select
                value={condition.action}
                onValueChange={(value: any) =>
                  updateCondition(index, { action: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="show">Mostrar campo</SelectItem>
                  <SelectItem value="hide">Ocultar campo</SelectItem>
                  <SelectItem value="enable">Habilitar campo</SelectItem>
                  <SelectItem value="disable">Desabilitar campo</SelectItem>
                  <SelectItem value="require">Tornar obrigatório</SelectItem>
                  <SelectItem value="optional">Tornar opcional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        ))}

        {conditions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma regra configurada
          </div>
        )}
      </CardContent>
    </Card>
  );
}
