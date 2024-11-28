/* eslint-disable @typescript-eslint/no-explicit-any */

import { PayloadValidationRule } from "@/core/domain/entities/StepValidationConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface ValidationConfigProps {
  rules: PayloadValidationRule[];
  onChange: (rules: PayloadValidationRule[]) => void;
  availableFields: string[];
}

export function ValidationConfig({
  rules,
  onChange,
  availableFields,
}: ValidationConfigProps) {
  const addRule = () => {
    onChange([
      ...rules,
      {
        field: "",
        operator: "equals",
        value: "",
        targetFields: [],
        action: "show",
      },
    ]);
  };

  const updateRule = (
    index: number,
    updates: Partial<PayloadValidationRule>
  ) => {
    const newRules = rules.map((rule, i) =>
      i === index ? { ...rule, ...updates } : rule
    );
    onChange(newRules);
  };

  const removeRule = (index: number) => {
    onChange(rules.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Regras de Validação</h3>
        <Button onClick={addRule} variant="outline" size="sm">
          Adicionar Regra
        </Button>
      </div>

      {rules.map((rule, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle>Regra {index + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <label>Campo do Payload</label>
                <Input
                  value={rule.field}
                  onChange={(e) => updateRule(index, { field: e.target.value })}
                  placeholder="Nome do campo no payload"
                />
              </div>

              <div>
                <label>Operador</label>
                <Select
                  value={rule.operator}
                  onValueChange={(value) =>
                    updateRule(index, { operator: value as any })
                  }
                >
                  <option value="equals">Igual a</option>
                  <option value="not_equals">Diferente de</option>
                  <option value="contains">Contém</option>
                  <option value="exists">Existe</option>
                  <option value="greater_than">Maior que</option>
                  <option value="less_than">Menor que</option>
                </Select>
              </div>

              <div>
                <label>Valor</label>
                <Input
                  value={rule.value}
                  onChange={(e) => updateRule(index, { value: e.target.value })}
                  placeholder="Valor para comparação"
                />
              </div>

              <div>
                <label>Campos Afetados</label>
                {rule.targetFields.map((targetField, idx) => (
                  <Select
                    key={idx}
                    value={targetField}
                    onValueChange={(value) => {
                      const newTargetFields = [...rule.targetFields];
                      newTargetFields[idx] = value;
                      updateRule(index, { targetFields: newTargetFields });
                    }}
                  >
                    {availableFields.map((field) => (
                      <option key={field} value={field}>
                        {field}
                      </option>
                    ))}
                  </Select>
                ))}
              </div>

              <div>
                <label>Ação</label>
                <Select
                  value={rule.action}
                  onValueChange={(value) =>
                    updateRule(index, { action: value as any })
                  }
                >
                  <option value="show">Mostrar</option>
                  <option value="hide">Esconder</option>
                  <option value="require">Tornar Obrigatório</option>
                  <option value="disable">Desabilitar</option>
                </Select>
              </div>

              <Button
                onClick={() => removeRule(index)}
                variant="destructive"
                size="sm"
              >
                Remover Regra
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
