import { create } from "zustand";

type StatusFilter = "all" | "pending" | "contacted";

type AdminStore = {
  page: number;
  statusFilter: StatusFilter;
  deleteModal: { open: boolean; id: string | null };
  setPage: (page: number) => void;
  setStatusFilter: (filter: StatusFilter) => void;
  openDeleteModal: (id: string) => void;
  closeDeleteModal: () => void;
};

export const useAdminStore = create<AdminStore>((set) => ({
  page: 1,
  statusFilter: "all",
  deleteModal: { open: false, id: null },

  setPage: (page) => set({ page }),
  setStatusFilter: (statusFilter) => set({ statusFilter, page: 1 }),
  openDeleteModal: (id) => set({ deleteModal: { open: true, id } }),
  closeDeleteModal: () => set({ deleteModal: { open: false, id: null } }),
}));
