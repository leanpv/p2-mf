"use client";

import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAdminStore } from "@/lib/zustand/admin.store";
import { submissionsResponseSchema, type Submission } from "./admin.schema";
import { ExportButton } from "./ExportButton";
import { cn } from "@/lib/utils";

const LIMIT = 20;

async function fetchSubmissions(page: number, status: string) {
  const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
  if (status !== "all") params.set("status", status);
  const res = await fetch(`/api/admin/submissions?${params}`);
  if (!res.ok) throw new Error("Error al cargar submissions");
  return submissionsResponseSchema.parse(await res.json());
}

async function updateStatus(id: string, status: "pending" | "contacted") {
  const res = await fetch(`/api/admin/submissions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Error al actualizar");
}

async function deleteSubmission(id: string) {
  const res = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar");
}

export function SubmissionsPanel() {
  const { page, statusFilter, deleteModal, setPage, setStatusFilter, openDeleteModal, closeDeleteModal } =
    useAdminStore();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["submissions", page, statusFilter],
    queryFn: () => fetchSubmissions(page, statusFilter),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "pending" | "contacted" }) =>
      updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["submissions"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSubmission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
      closeDeleteModal();
    },
  });

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 1;

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-serif text-primary" style={{ fontSize: "clamp(1.2rem, 3vw, 1.6rem)" }}>
            Consultas recibidas
          </h2>
          {data && (
            <p className="font-sans text-muted" style={{ fontSize: "0.75rem" }}>
              {data.total} {data.total === 1 ? "consulta" : "consultas"} en total
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <StatusFilter value={statusFilter} onChange={setStatusFilter} />
          <ExportButton />
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-secondary border border-border overflow-hidden">
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <p className="font-sans text-muted" style={{ fontSize: "0.8rem" }}>Cargando…</p>
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-16">
            <p className="font-sans text-red-600" style={{ fontSize: "0.8rem" }}>Error al cargar las consultas.</p>
          </div>
        )}

        {data && data.data.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <p className="font-sans text-muted" style={{ fontSize: "0.8rem" }}>No hay consultas.</p>
          </div>
        )}

        {data && data.data.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted-bg">
                  {["Nombre", "Teléfono", "Mensaje", "Estado", "Fecha", ""].map((col) => (
                    <th
                      key={col}
                      className="text-left px-4 py-3 font-sans font-medium text-muted uppercase"
                      style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.data.map((s) => (
                  <SubmissionRow
                    key={s._id}
                    submission={s}
                    onToggleStatus={() =>
                      statusMutation.mutate({
                        id: s._id,
                        status: s.status === "pending" ? "contacted" : "pending",
                      })
                    }
                    onDelete={() => openDeleteModal(s._id)}
                    isPending={statusMutation.isPending || deleteMutation.isPending}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <PageButton onClick={() => setPage(page - 1)} disabled={page === 1} label="←" />
          <span className="font-sans text-muted px-2" style={{ fontSize: "0.75rem" }}>
            {page} / {totalPages}
          </span>
          <PageButton onClick={() => setPage(page + 1)} disabled={page === totalPages} label="→" />
        </div>
      )}

      {/* Modal de confirmación de borrado */}
      {deleteModal.open && (
        <DeleteModal
          onConfirm={() => deleteModal.id && deleteMutation.mutate(deleteModal.id)}
          onCancel={closeDeleteModal}
          isPending={deleteMutation.isPending}
        />
      )}
    </div>
  );
}

function SubmissionRow({
  submission: s,
  onToggleStatus,
  onDelete,
  isPending,
}: {
  submission: Submission;
  onToggleStatus: () => void;
  onDelete: () => void;
  isPending: boolean;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const hasLongMessage = s.message && s.message.length > 60;

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted-bg/50 transition-colors duration-150">
      <td className="px-4 py-3 font-sans text-primary" style={{ fontSize: "0.8rem" }}>
        {s.name}
      </td>
      <td className="px-4 py-3 font-sans text-primary" style={{ fontSize: "0.8rem" }}>
        {s.phone}
      </td>
      <td
        className="px-4 py-3 font-sans text-muted max-w-[220px]"
        style={{ fontSize: "0.8rem" }}
      >
        {!s.message ? (
          <span className="opacity-40">—</span>
        ) : (
          <div className="flex flex-col gap-1">
            <span className={cn(!expanded && "line-clamp-1")}>{s.message}</span>
            {hasLongMessage && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-left text-muted/60 hover:text-primary transition-colors duration-150 cursor-pointer underline underline-offset-2"
                style={{ fontSize: "0.7rem" }}
              >
                {expanded ? "Ver menos" : "Ver más"}
              </button>
            )}
          </div>
        )}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={onToggleStatus}
          disabled={isPending}
          className={cn(
            "font-sans uppercase px-2 py-1 border transition-colors duration-150 disabled:opacity-50 cursor-pointer",
            s.status === "contacted"
              ? "border-accent text-accent"
              : "border-border text-muted hover:border-primary hover:text-primary"
          )}
          style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}

        >
          {s.status === "contacted" ? "Contactado" : "Pendiente"}
        </button>
      </td>
      <td className="px-4 py-3 font-sans text-muted whitespace-nowrap" style={{ fontSize: "0.75rem" }}>
        {new Date(s.createdAt).toLocaleDateString("es-AR", {
          day: "2-digit", month: "2-digit", year: "2-digit",
        })}
      </td>
      <td className="px-4 py-3">
        <button
          onClick={onDelete}
          disabled={isPending}
          className="font-sans text-muted hover:text-red-600 transition-colors duration-150 disabled:opacity-50 cursor-pointer"
          style={{ fontSize: "0.75rem" }}
          aria-label="Eliminar"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}

function StatusFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: "all" | "pending" | "contacted") => void;
}) {
  return (
    <div className="flex border border-border overflow-hidden">
      {(["all", "pending", "contacted"] as const).map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "font-sans uppercase px-3 py-2 transition-colors duration-200 cursor-pointer",
            value === opt
              ? "bg-primary text-secondary hover:opacity-80"
              : "text-muted bg-secondary hover:bg-border"
          )}
          style={{ fontSize: "0.6rem", letterSpacing: "0.1em" }}
        >
          {opt === "all" ? "Todos" : opt === "pending" ? "Pendiente" : "Contactado"}
        </button>
      ))}
    </div>
  );
}

function PageButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="font-sans text-primary border border-border w-8 h-8 flex items-center justify-center hover:bg-muted-bg transition-colors duration-150 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {label}
    </button>
  );
}

function DeleteModal({
  onConfirm,
  onCancel,
  isPending,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-primary/60 flex items-center justify-center px-4">
      <div className="bg-secondary border border-border p-8 max-w-sm w-full flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="font-serif text-primary" style={{ fontSize: "1.2rem" }}>
            ¿Eliminar consulta?
          </p>
          <p className="font-sans text-muted" style={{ fontSize: "0.8rem" }}>
            Esta acción no se puede deshacer.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 font-sans font-medium text-primary uppercase border border-border py-3 hover:bg-muted-bg transition-colors duration-150 disabled:opacity-50 cursor-pointer"
            style={{ fontSize: "0.65rem", letterSpacing: "0.12em" }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 font-sans font-medium text-secondary uppercase bg-primary py-3 hover:opacity-80 transition-opacity duration-150 disabled:opacity-50 cursor-pointer"
            style={{ fontSize: "0.65rem", letterSpacing: "0.12em" }}
          >
            {isPending ? "Eliminando…" : "Eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
