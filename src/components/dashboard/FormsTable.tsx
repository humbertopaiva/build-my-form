/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/dashboard/FormsTable.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Eye,
  BarChart,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormsTableProps {
  forms: any[];
}

export function FormsTable({ forms: initialForms }: FormsTableProps) {
  const [forms, setForms] = useState(initialForms);
  const router = useRouter();
  const { toast } = useToast();

  const copyFormUrl = (slug: string) => {
    const url = `${window.location.origin}/form/${slug}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "URL copiada!",
      description:
        "A URL do formulário foi copiada para sua área de transferência.",
    });
  };

  const deleteForm = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este formulário?")) return;

    try {
      const response = await fetch(`/api/forms/management/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Erro ao excluir formulário");

      setForms(forms.filter((form) => form.id !== id));
      toast({
        title: "Formulário excluído",
        description: "O formulário foi excluído com sucesso.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o formulário.",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Nome</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Submissões</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {forms.map((form) => (
            <TableRow key={form.id}>
              <TableCell className="font-medium">{form.name}</TableCell>
              <TableCell>/{form.slug}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    form.isActive
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {form.isActive ? "Ativo" : "Inativo"}
                </span>
              </TableCell>
              <TableCell className="text-center">
                {form._count.submissions}
              </TableCell>
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
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() =>
                        router.push(`/dashboard/forms/${form.id}`)
                      }
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      <span>Editar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => router.push(`/form/${form.slug}`)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Visualizar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => copyFormUrl(form.slug)}>
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Copiar URL</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() =>
                        router.push(`/dashboard/forms/${form.id}/submissions`)
                      }
                    >
                      <BarChart className="mr-2 h-4 w-4" />
                      <span>Submissões</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => deleteForm(form.id)}
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
    </div>
  );
}
