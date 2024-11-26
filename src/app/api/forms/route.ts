import { NextRequest, NextResponse } from "next/server";
import { CreateFormUseCase } from "@/core/domain/usecases/form/CreateFormUseCase";
import { PrismaFormRepository } from "@/core/application/infrastructure/database/repositories/PrismaFormRepository";

export async function POST(request: NextRequest) {
  try {
    const formRepository = new PrismaFormRepository();
    const createForm = new CreateFormUseCase(formRepository);

    const data = await request.json();
    const form = await createForm.execute(data);

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const formRepository = new PrismaFormRepository();
    const forms = await formRepository.findAll();

    return NextResponse.json(forms);
  } catch (error) {
    console.log("Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
