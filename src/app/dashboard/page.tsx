/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/dashboard/page.tsx

import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { FormList } from "@/components/dashboard/FormList";
import Link from "next/link";

async function getFormsWithStats() {
  const prisma = new PrismaClient();
  const forms = await prisma.form.findMany({
    include: {
      fields: true,
      submissions: {
        select: {
          id: true,
        },
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return forms.map(
    (form: { submissions: string | any[]; fields: string | any[] }) => ({
      ...form,
      submissionCount: form.submissions.length,
      fieldCount: form.fields.length,
    })
  );
}

export default async function DashboardPage() {
  const forms = await getFormsWithStats();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Formulários</h1>
        <Link href="/dashboard/forms/new">
          <Button>Criar Novo Formulário</Button>
        </Link>
      </div>
      <FormList forms={forms} />
    </div>
  );
}
