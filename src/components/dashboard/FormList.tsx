// src/components/dashboard/FormList.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Eye, Trash2 } from "lucide-react";

interface Form {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: Date;
  submissionCount: number;
  fieldCount: number;
}

interface FormListProps {
  forms: Form[];
}

export function FormList({ forms }: FormListProps) {
  const [localForms, setLocalForms] = useState(forms);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este formulário?")) return;

    try {
      await fetch(`/api/forms/management/${id}`, { method: "DELETE" });
      setLocalForms((forms) => forms.filter((f) => f.id !== id));
    } catch (error) {
      console.error("Erro ao excluir formulário:", error);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>URL</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Campos</TableHead>
          <TableHead>Submissões</TableHead>
          <TableHead>Criado em</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {localForms.map((form) => (
          <TableRow key={form.id}>
            <TableCell className="font-medium">{form.name}</TableCell>
            <TableCell>/{form.slug}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  form.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {form.isActive ? "Ativo" : "Inativo"}
              </span>
            </TableCell>
            <TableCell>{form.fieldCount}</TableCell>
            <TableCell>{form.submissionCount}</TableCell>
            <TableCell>
              {new Date(form.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Abrir menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link
                      href={`/dashboard/forms/${form.id}`}
                      className="flex items-center"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      href={`/form/${form.slug}`}
                      className="flex items-center"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Visualizar</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDelete(form.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Excluir</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
