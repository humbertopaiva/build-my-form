// src/app/test/[slug]/page.tsx
import { PrismaClient } from "@prisma/client";
import { FormRenderer } from "@/components/forms/PublicComponents/FormRenderer";
import { adaptPrismaForm } from "@/lib/adapters/formAdapter";

interface TestPageProps {
  params: {
    slug: string;
  };
}

export default async function TestPage({ params }: TestPageProps) {
  const prisma = new PrismaClient();
  const prismaForm = await prisma.form.findUnique({
    where: { slug: params.slug },
    include: { fields: true },
  });

  if (!prismaForm) {
    return <div>Formulário não encontrado</div>;
  }

  const form = adaptPrismaForm(prismaForm);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <FormRenderer form={form} />
      </div>
    </div>
  );
}
