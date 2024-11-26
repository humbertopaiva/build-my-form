// src/app/dashboard/forms/page.tsx
import Link from "next/link";
import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { FormsTable } from "@/components/dashboard/FormsTable";

async function getForms() {
  const prisma = new PrismaClient();
  const forms = await prisma.form.findMany({
    include: {
      _count: {
        select: {
          submissions: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return forms;
}

export default async function FormsPage() {
  const forms = await getForms();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Formulários</h2>
          <p className="text-muted-foreground">
            Gerencie seus formulários de captura de leads
          </p>
        </div>

        <Button asChild>
          <Link href="/dashboard/forms/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Novo Formulário
          </Link>
        </Button>
      </div>

      <FormsTable forms={forms} />
    </div>
  );
}
