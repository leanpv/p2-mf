export type ApiError = {
  message: string;
  field?: string;
};

export async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error: ApiError = await res.json().catch(() => ({
      message: "Error inesperado. Intentá de nuevo.",
    }));
    throw error;
  }

  return res.json();
}
