/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/preview/page.tsx
"use client";

import { useEffect, useState } from "react";
import { MultiStepFormRenderer } from "@/components/forms/PublicComponents/MultiStepFormRenderer";

export default function PreviewPage() {
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const savedForm = localStorage.getItem("form_preview");
    if (savedForm) {
      setFormData(JSON.parse(savedForm));
    }
  }, []);

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Nenhum formulário para visualizar</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <MultiStepFormRenderer form={formData} />
    </div>
  );
}
