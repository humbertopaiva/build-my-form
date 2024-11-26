/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/dashboard/SubmissionStats.tsx
"use client";

// import { Bar } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SubmissionStatsProps {
  submissions: any[];
}

export function SubmissionStats({ submissions }: SubmissionStatsProps) {
  // Calcular estatísticas
  const totalSubmissions = submissions.length;
  const lastDaySubmissions = submissions.filter(
    (sub) =>
      new Date(sub.createdAt) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;

  // Dados para o gráfico
  const submissionsByDay = submissions.reduce((acc, sub) => {
    const date = new Date(sub.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData: { date: string; submissões: number }[] = Object.entries(
    submissionsByDay
  )
    .slice(-7)
    .map(([date, count]) => ({
      date,
      submissões: count as number,
    }));

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Total de Submissões</CardTitle>
          <CardDescription>Total acumulado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{totalSubmissions}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Últimas 24h</CardTitle>
          <CardDescription>Submissões recentes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">{lastDaySubmissions}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Média por Dia</CardTitle>
          <CardDescription>Últimos 7 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {(
              chartData.reduce((acc, item) => acc + item.submissões, 0) / 7
            ).toFixed(1)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
