// src/app/api/forms/[slug]/submit/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const form = await prisma.form.findUnique({
      where: { slug: params.slug },
      include: { fields: true },
    });

    if (!form) {
      return NextResponse.json(
        { error: "Formulário não encontrado" },
        { status: 404 }
      );
    }

    const data = await request.formData();
    const headersList = headers();

    const submission = await prisma.submission.create({
      data: {
        formId: form.id,
        ip:
          (await headersList).get("x-forwarded-for") ||
          request.headers.get("x-real-ip") ||
          "",
        userAgent: (await headersList).get("user-agent"),
        fields: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          create: form.fields.map((field: { id: any; name: string }) => ({
            fieldId: field.id,
            value: data.get(field.name)?.toString() || "",
          })),
        },
      },
    });

    // Se tiver um endpoint configurado, enviar os dados para lá
    if (form.endpoint) {
      try {
        await fetch(form.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formId: form.id,
            submissionId: submission.id,
            data: Object.fromEntries(data),
          }),
        });
      } catch (error) {
        console.error("Erro ao enviar para endpoint:", error);
      }
    }

    return new Response(
      `
        <div class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">Enviado com sucesso!</h3>
              <div class="mt-2 text-sm text-green-700">
                <p>Obrigado por enviar o formulário.</p>
              </div>
            </div>
          </div>
        </div>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao processar submissão:", error);
    return new Response(
      `
        <div class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Erro ao enviar formulário</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>Por favor, tente novamente mais tarde.</p>
              </div>
            </div>
          </div>
        </div>
      `,
      {
        headers: {
          "Content-Type": "text/html",
        },
      }
    );
  }
}
