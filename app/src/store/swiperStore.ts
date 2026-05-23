import { Swiper } from 'swiper/types';
import { create } from 'zustand';

interface SwiperState {
  swiper: Swiper | null;
  selectedWeekIndex: number | null;
  currWeekIndex: number | null;
  selectedMonthIndex: number | null;
  currMonthIndex: number | null;
}

interface SwiperAction {
  setSwiper: (swiper: Swiper) => void;
  setSelectedWeekIndex: (selectedWeekIndex: number | null) => void;
  setCurrWeekIndex: (currWeekIndex: number | null) => void;
  setSelectedMonthIndex: (index: number | null) => void;
  setCurrMonthIndex: (index: number | null) => void;
}

export const useSwiperStore = create<SwiperState & SwiperAction>((set) => ({
  swiper: null,
  setSwiper: (swiper) => set({ swiper }),
  selectedWeekIndex: null,
  setSelectedWeekIndex: (selectedWeekIndex) => set({ selectedWeekIndex }),
  currWeekIndex: null,
  setCurrWeekIndex: (currWeekIndex) => set({ currWeekIndex }),
  selectedMonthIndex: null,
  setSelectedMonthIndex: (selectedMonthIndex) => set({ selectedMonthIndex }),
  currMonthIndex: null,
  setCurrMonthIndex: (currMonthIndex) => set({ currMonthIndex }),
}));
