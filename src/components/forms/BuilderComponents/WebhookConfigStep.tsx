// src/components/forms/BuilderComponents/WebhookConfig.tsx

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { Plus, Trash2 } from "lucide-react";

interface SelectedField {
  id: string;
  paramName: string;
  sendType: "body" | "query";
}

interface WebhookConfigProps {
  previousFields: { id: string; label: string }[];
  endpoint: string;
  method: string;
  authType: "none" | "basic" | "bearer" | "custom";
  selectedFields: SelectedField[];
  onEndpointChange: (endpoint: string) => void;
  onMethodChange: (method: string) => void;
  onAuthTypeChange: (type: string) => void;
  onFieldsChange: (fields: SelectedField[]) => void;
}

export function WebhookConfigStep({
  previousFields,
  endpoint,
  method,
  authType,
  selectedFields,
  onEndpointChange,
  onMethodChange,
  onAuthTypeChange,
  onFieldsChange,
}: WebhookConfigProps) {
  const [authValue, setAuthValue] = useState("");

  const addField = () => {
    onFieldsChange([
      ...selectedFields,
      { id: "", paramName: "", sendType: "body" },
    ]);
  };

  const removeField = (index: number) => {
    const newFields = [...selectedFields];
    newFields.splice(index, 1);
    onFieldsChange(newFields);
  };

  const updateField = (index: number, updates: Partial<SelectedField>) => {
    const newFields = selectedFields.map((field, i) =>
      i === index ? { ...field, ...updates } : field
    );
    onFieldsChange(newFields);
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        {/* Configuração Básica do Endpoint */}
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>URL do Webhook</FormLabel>
            <FormControl>
              <Input
                value={endpoint}
                onChange={(e) => onEndpointChange(e.target.value)}
                placeholder="https://api.exemplo.com/webhook"
              />
            </FormControl>
          </FormItem>

          <FormItem>
            <FormLabel>Método</FormLabel>
            <Select value={method} onValueChange={onMethodChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        </div>

        {/* Autenticação */}
        <div className="space-y-4">
          <FormItem>
            <FormLabel>Tipo de Autenticação</FormLabel>
            <Select value={authType} onValueChange={onAuthTypeChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhuma</SelectItem>
                <SelectItem value="basic">Basic Auth</SelectItem>
                <SelectItem value="bearer">Bearer Token</SelectItem>
                <SelectItem value="custom">Custom Header</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>

          {authType !== "none" && (
            <FormItem>
              <FormLabel>
                {authType === "basic"
                  ? "Credenciais (usuário:senha)"
                  : authType === "bearer"
                  ? "Token"
                  : "Header (chave:valor)"}
              </FormLabel>
              <FormControl>
                <Input
                  value={authValue}
                  onChange={(e) => setAuthValue(e.target.value)}
                  placeholder={
                    authType === "basic"
                      ? "usuario:senha"
                      : authType === "bearer"
                      ? "seu-token"
                      : "X-API-Key:seu-valor"
                  }
                />
              </FormControl>
            </FormItem>
          )}
        </div>

        {/* Seleção e Configuração de Campos */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <FormLabel>Campos a serem enviados</FormLabel>
            <Button onClick={addField} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Campo
            </Button>
          </div>

          {selectedFields.map((field, index) => (
            <div
              key={index}
              className="grid grid-cols-4 gap-4 p-4 border rounded-lg"
            >
              <Select
                value={field.id}
                onValueChange={(value) => updateField(index, { id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o campo" />
                </SelectTrigger>
                <SelectContent>
                  {previousFields.map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                value={field.paramName}
                onChange={(e) =>
                  updateField(index, { paramName: e.target.value })
                }
                placeholder="Nome do parâmetro"
              />

              <Select
                value={field.sendType}
                onValueChange={(value: "body" | "query") =>
                  updateField(index, { sendType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de envio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="body">Body</SelectItem>
                  <SelectItem value="query">Query Params</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeField(index)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
