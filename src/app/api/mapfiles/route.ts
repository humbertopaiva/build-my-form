import fs from "fs";
import path from "path";
import { NextResponse } from "next/server"; // Usar a API de respostas do Next.js para app directory

type FileStructure = {
  name: string;
  type: "file" | "folder";
  children?: FileStructure[];
};

// Função para mapear arquivos e pastas
const mapDirectories = (directoryPath: string): FileStructure[] => {
  const result: FileStructure[] = [];
  const items = fs.readdirSync(directoryPath);

  for (const item of items) {
    const fullPath = path.join(directoryPath, item);
    const isDirectory = fs.statSync(fullPath).isDirectory();

    if (isDirectory) {
      result.push({
        name: item,
        type: "folder",
        children: mapDirectories(fullPath),
      });
    } else {
      result.push({
        name: item,
        type: "file",
      });
    }
  }

  return result;
};

// Método HTTP GET
export async function GET() {
  try {
    const basePath = path.join(process.cwd(), "src"); // Altere o caminho para o diretório que deseja mapear
    const fileStructure = mapDirectories(basePath);

    return NextResponse.json(fileStructure); // Retorna a estrutura de arquivos em formato JSON
  } catch (error) {
    console.error("Erro ao mapear arquivos:", error);
    return NextResponse.json(
      { error: "Erro ao mapear arquivos" },
      { status: 500 }
    );
  }
}
