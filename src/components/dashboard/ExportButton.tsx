// src/components/dashboard/ExportButton.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  formId: string;
}

export function ExportButton({ formId }: ExportButtonProps) {
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/forms/${formId}/export`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `submissoes-${formId}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao exportar:", error);
    }
  };

  return (
    <Button onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Exportar CSV
    </Button>
  );
}
