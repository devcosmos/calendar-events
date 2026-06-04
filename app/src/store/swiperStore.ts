import { EmblaCarouselType } from 'embla-carousel';
import { create } from 'zustand';

interface CarouselState {
  emblaApi: EmblaCarouselType | null;
  selectedWeekIndex: number | null;
  currWeekIndex: number | null;
  selectedMonthIndex: number | null;
  currMonthIndex: number | null;
}

interface CarouselAction {
  setEmblaApi: (emblaApi: EmblaCarouselType) => void;
  setSelectedWeekIndex: (selectedWeekIndex: number | null) => void;
  setCurrWeekIndex: (currWeekIndex: number | null) => void;
  setSelectedMonthIndex: (index: number | null) => void;
  setCurrMonthIndex: (index: number | null) => void;
}

export const useSwiperStore = create<CarouselState & CarouselAction>((set) => ({
  emblaApi: null,
  setEmblaApi: (emblaApi) => set({ emblaApi }),
  selectedWeekIndex: null,
  setSelectedWeekIndex: (selectedWeekIndex) => set({ selectedWeekIndex }),
  currWeekIndex: null,
  setCurrWeekIndex: (currWeekIndex) => set({ currWeekIndex }),
  selectedMonthIndex: null,
  setSelectedMonthIndex: (selectedMonthIndex) => set({ selectedMonthIndex }),
  currMonthIndex: null,
  setCurrMonthIndex: (currMonthIndex) => set({ currMonthIndex }),
}));
