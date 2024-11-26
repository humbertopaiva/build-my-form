/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/dashboard/SubmissionList.tsx
"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Eye, Trash2 } from "lucide-react";
import { Field } from "@/core/domain/entities/Field";

interface SubmissionListProps {
  submissions: any[];
  fields: Field[];
}

export function SubmissionList({ submissions, fields }: SubmissionListProps) {
  const [localSubmissions, setLocalSubmissions] = useState(submissions);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta submissão?")) return;

    try {
      await fetch(`/api/submissions/${id}`, { method: "DELETE" });
      setLocalSubmissions((subs) => subs.filter((sub) => sub.id !== id));
    } catch (error) {
      console.error("Erro ao excluir submissão:", error);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            {fields.map((field) => (
              <TableHead key={field.id}>{field.label}</TableHead>
            ))}
            <TableHead>IP</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {localSubmissions.map((submission) => (
            <TableRow key={submission.id}>
              <TableCell>
                {new Date(submission.createdAt).toLocaleString()}
              </TableCell>
              {fields.map((field) => (
                <TableCell key={field.id}>
                  {submission.fields[field.name]}
                </TableCell>
              ))}
              <TableCell>{submission.ip}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Visualizar</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(submission.id)}
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

      {/* Modal de Visualização */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h3 className="text-lg font-semibold mb-4">
              Detalhes da Submissão
            </h3>
            <div className="space-y-4">
              {fields.map((field) => (
                <div key={field.id}>
                  <label className="font-medium">{field.label}</label>
                  <p className="mt-1">
                    {selectedSubmission.fields[field.name]}
                  </p>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Enviado em:{" "}
                  {new Date(selectedSubmission.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  IP: {selectedSubmission.ip}
                </p>
                <p className="text-sm text-gray-500">
                  User Agent: {selectedSubmission.userAgent}
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => setSelectedSubmission(null)}
                variant="outline"
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
