/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/forms/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("Dados recebidos na API:", data); // Debug

    const form = await prisma.form.create({
      data: {
        name: data.name,
        slug: data.slug,
        submitLabel: data.submitLabel,
        endpoint: data.endpoint,
        steps: {
          create: data.steps.map((step: any) => ({
            order: step.order,
            title: step.title,
            description: step.description,
            fields: {
              create: step.fields.map((field: any) => ({
                name: field.name,
                label: field.label,
                type: field.type,
                placeholder: field.placeholder,
                required: field.required,
                order: field.order,
                options: field.options,
                validation: field.validation,
                helpText: field.helpText,
              })),
            },
          })),
        },
      },
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error("Erro na API:", error); // Debug
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
