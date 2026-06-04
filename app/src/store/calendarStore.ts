import { EmblaCarouselType } from 'embla-carousel';
import { create } from 'zustand';

interface CalendarState {
  emblaApi: EmblaCarouselType | null;
  selectedMonthIndex: number | null;
  currMonthIndex: number | null;
  /** Selector to scroll into view after the next carousel settle */
  pendingScrollSelector: string | null;
}

interface CalendarActions {
  setEmblaApi: (api: EmblaCarouselType) => void;
  setSelectedMonthIndex: (index: number | null) => void;
  setCurrMonthIndex: (index: number | null) => void;
  setPendingScrollSelector: (selector: string | null) => void;
}

export const useCalendarStore = create<CalendarState & CalendarActions>((set) => ({
  emblaApi: null,
  setEmblaApi: (emblaApi) => set({ emblaApi }),
  selectedMonthIndex: null,
  setSelectedMonthIndex: (selectedMonthIndex) => set({ selectedMonthIndex }),
  currMonthIndex: null,
  setCurrMonthIndex: (currMonthIndex) => set({ currMonthIndex }),
  pendingScrollSelector: null,
  setPendingScrollSelector: (pendingScrollSelector) => set({ pendingScrollSelector }),
}));
