import { create } from "zustand";

const SLIDE_COUNT = 5;

type UIStore = {
  isContactModalOpen: boolean;
  currentSlide: number;
  openContactModal: () => void;
  closeContactModal: () => void;
  setSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  isContactModalOpen: false,
  currentSlide: 0,

  openContactModal: () => set({ isContactModalOpen: true }),
  closeContactModal: () => set({ isContactModalOpen: false }),

  setSlide: (index) =>
    set({ currentSlide: ((index % SLIDE_COUNT) + SLIDE_COUNT) % SLIDE_COUNT }),

  nextSlide: () =>
    set((state) => ({
      currentSlide: (state.currentSlide + 1) % SLIDE_COUNT,
    })),

  prevSlide: () =>
    set((state) => ({
      currentSlide:
        (state.currentSlide - 1 + SLIDE_COUNT) % SLIDE_COUNT,
    })),
}));
