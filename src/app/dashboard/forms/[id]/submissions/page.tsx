/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/forms/[id]/submissions/page.tsx
import { notFound } from "next/navigation";
import { PrismaFormRepository } from "@/core/application/infrastructure/database/repositories/PrismaFormRepository";
import { SubmissionList } from "@/components/dashboard/SubmissionList";
import { ExportButton } from "@/components/dashboard/ExportButton";
import { SubmissionStats } from "@/components/dashboard/SubmissionStats";

interface SubmissionsPageProps {
  params: {
    id: string;
  };
}

async function getFormWithSubmissions(formId: string) {
  const prisma = new PrismaFormRepository();
  const form = await prisma.findById(formId);

  if (!form) {
    return null;
  }

  const submissions = await prisma.getFormSubmissions(formId);

  return {
    form,
    submissions: submissions.map((sub: { fields: any[] }) => ({
      ...sub,
      fields: sub.fields.reduce(
        (acc: any, field: { field: { name: any }; value: any }) => ({
          ...acc,
          [field.field.name]: field.value,
        }),
        {}
      ),
    })),
  };
}

export default async function SubmissionsPage({
  params,
}: SubmissionsPageProps) {
  const data = await getFormWithSubmissions(params.id);

  if (!data) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">{data.form.name}</h1>
          <p className="text-gray-500">Submissões</p>
        </div>
        <ExportButton formId={params.id} />
      </div>

      <SubmissionStats submissions={data.submissions} />

      <div className="mt-8">
        <SubmissionList
          submissions={data.submissions}
          fields={data.form.fields}
        />
      </div>
    </div>
  );
}
