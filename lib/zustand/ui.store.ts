import { create } from "zustand";

const SLIDE_COUNT = 5;

type UIStore = {
  isContactModalOpen: boolean;
  isGalleryOpen: boolean;
  isLightboxOpen: boolean;
  galleryActiveTab: number;
  currentSlide: number;
  openContactModal: () => void;
  closeContactModal: () => void;
  openGallery: (slideIndex: number) => void;
  closeGallery: () => void;
  setGalleryTab: (index: number) => void;
  setLightbox: (open: boolean) => void;
  setSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  isContactModalOpen: false,
  isGalleryOpen: false,
  isLightboxOpen: false,
  galleryActiveTab: 0,
  currentSlide: 0,

  openContactModal: () => set({ isContactModalOpen: true }),
  closeContactModal: () => set({ isContactModalOpen: false }),
  openGallery: (slideIndex) => set({ isGalleryOpen: true, galleryActiveTab: slideIndex }),
  closeGallery: () => set((state) => ({ isGalleryOpen: false, isLightboxOpen: false, currentSlide: state.galleryActiveTab })),
  setGalleryTab: (index) => set({ galleryActiveTab: index }),
  setLightbox: (open) => set({ isLightboxOpen: open }),

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
