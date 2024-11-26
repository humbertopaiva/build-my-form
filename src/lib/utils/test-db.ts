import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testConnection() {
  try {
    const form = await prisma.form.create({
      data: {
        name: "Formulário de Teste",
        slug: "form-teste",
        fields: {
          create: [
            {
              name: "email",
              label: "E-mail",
              type: "email",
              order: 1,
              required: true,
            },
          ],
        },
      },
    });

    console.log("Formulário criado com sucesso:", form);

    const forms = await prisma.form.findMany({
      include: {
        fields: true,
      },
    });

    console.log("Formulários no banco:", forms);
  } catch (error) {
    console.error("Erro:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
