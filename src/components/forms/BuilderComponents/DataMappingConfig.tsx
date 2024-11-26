/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { Field } from "@/core/domain/entities/Field";
import {
  DataMappingRule,
  DataMappingConfig,
} from "@/core/domain/entities/DataMapping";
import { DataMappingService } from "@/core/application/services/DataMappingService";

interface DataMappingConfigProps {
  fields: Field[];
  config?: DataMappingConfig;
  onUpdate: (config: DataMappingConfig) => void;
}

export function DataMappingConfigComponent({
  fields,
  config,
  onUpdate,
}: DataMappingConfigProps) {
  const [samplePayload, setSamplePayload] = useState<string>(
    config?.samplePayload || ""
  );
  const [payloadPaths, setPayloadPaths] = useState<string[]>([]);
  const [rules, setRules] = useState<DataMappingRule[]>(config?.rules || []);
  const [error, setError] = useState<string>("");

  const mappingService = new DataMappingService();

  const handlePayloadChange = (value: string) => {
    setSamplePayload(value);
    try {
      if (mappingService.validatePayload(value)) {
        const parsed = JSON.parse(value);
        const paths = mappingService.extractPaths(parsed);
        setPayloadPaths(paths);
        setError("");
      }
    } catch (e) {
      setError("JSON inválido");
      setPayloadPaths([]);
    }
  };

  const addRule = () => {
    setRules([...rules, { source: "", target: "" }]);
  };

  const updateRule = (
    index: number,
    field: keyof DataMappingRule,
    value: string
  ) => {
    const updatedRules = rules.map((rule, i) =>
      i === index ? { ...rule, [field]: value } : rule
    );
    setRules(updatedRules);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Remove regras inválidas
    const validRules = rules.filter((rule) => rule.source && rule.target);

    onUpdate({
      rules: validRules,
      endpoint: config?.endpoint || "",
      samplePayload: samplePayload,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modelo de Dados do Endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Exemplo de Payload (JSON)
              </label>
              <textarea
                value={samplePayload}
                onChange={(e) => handlePayloadChange(e.target.value)}
                className="w-full h-32 p-2 border rounded-md font-mono text-sm"
                placeholder='{"email": "exemplo@email.com", "data": {"name": "Nome"}}'
              />
              {error && (
                <p className="text-sm text-destructive mt-1">{error}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Regras de Mapeamento</span>
            <Button onClick={addRule} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Regra
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule, index) => (
              <div
                key={index}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <Select
                    value={rule.source}
                    onValueChange={(value) =>
                      updateRule(index, "source", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Campo no Payload" />
                    </SelectTrigger>
                    <SelectContent>
                      {payloadPaths.map((path) => (
                        <SelectItem key={path} value={path}>
                          {path}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />

                <div className="flex-1">
                  <Select
                    value={rule.target}
                    onValueChange={(value) =>
                      updateRule(index, "target", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Campo do Formulário" />
                    </SelectTrigger>
                    <SelectContent>
                      {fields.map((field) => (
                        <SelectItem key={field.id} value={field.id}>
                          {field.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Input
                    value={rule.transform || ""}
                    onChange={(e) =>
                      updateRule(index, "transform", e.target.value)
                    }
                    placeholder="Transformação (opcional)"
                    className="font-mono text-sm"
                  />
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRule(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}

            {rules.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhuma regra configurada
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Salvar Configuração</Button>
      </div>
    </div>
  );
}
