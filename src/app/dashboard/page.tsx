// src/app/dashboard/page.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

async function getStats() {
  const prisma = new PrismaClient();

  const [totalForms, totalSubmissions, recentSubmissions] = await Promise.all([
    prisma.form.count(),
    prisma.submission.count(),
    prisma.submission.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        form: true,
        fields: {
          include: {
            field: true,
          },
        },
      },
    }),
  ]);

  return {
    totalForms,
    totalSubmissions,
    recentSubmissions,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle de formulários
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Formulários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalForms}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Submissões Totais
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Submissões Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                stats.recentSubmissions.filter(
                  (s) =>
                    new Date(s.createdAt).toDateString() ===
                    new Date().toDateString()
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submissões Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{submission.form.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(submission.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button variant="ghost" asChild>
                  <Link
                    href={`/dashboard/forms/${submission.formId}/submissions`}
                  >
                    Ver Detalhes
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
