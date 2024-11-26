// src/app/form/[slug]/page.tsx
import { FormRenderer } from "@/components/forms/PublicComponents/FormRenderer";
import { PrismaFormRepository } from "@/core/application/infrastructure/database/repositories/PrismaFormRepository";
import { notFound } from "next/navigation";

interface PublicFormPageProps {
  params: {
    slug: string;
  };
}

export default async function PublicFormPage({ params }: PublicFormPageProps) {
  const formRepository = new PrismaFormRepository();
  const form = await formRepository.findBySlug(params.slug);

  if (!form || !form.isActive) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <FormRenderer form={form} />
      </div>
    </div>
  );
}
