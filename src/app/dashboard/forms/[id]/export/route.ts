/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/forms/[id]/export/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const form = await prisma.form.findUnique({
      where: { id: params.id },
      include: {
        fields: true,
        submissions: {
          include: {
            fields: {
              include: {
                field: true,
              },
            },
          },
        },
      },
    });

    if (!form) {
      return NextResponse.json(
        { error: "Formulário não encontrado" },
        { status: 404 }
      );
    }

    // Criar cabeçalho do CSV
    const headers = [
      "Data",
      "IP",
      ...form.fields.map((f: { label: any }) => f.label),
    ];
    const csvRows = [headers.join(",")];

    // Adicionar linhas de dados
    form.submissions.forEach(
      (sub: { fields: any[]; createdAt: string | number | Date; ip: any }) => {
        const fieldValues = form.fields.map((field: { id: any }) => {
          const submissionField = sub.fields.find(
            (f: { fieldId: any }) => f.fieldId === field.id
          );
          return `"${submissionField?.value || ""}"`;
        });

        const row = [
          new Date(sub.createdAt).toLocaleString(),
          sub.ip || "",
          ...fieldValues,
        ];

        csvRows.push(row.join(","));
      }
    );

    // Criar o arquivo CSV
    const csv = csvRows.join("\n");

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="submissoes-${form.slug}.csv"`,
      },
    });
  } catch (error) {
    console.error("Erro ao exportar:", error);
    return NextResponse.json(
      { error: "Erro ao exportar submissões" },
      { status: 500 }
    );
  }
}
