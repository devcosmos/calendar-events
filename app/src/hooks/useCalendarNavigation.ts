import { useCallback } from 'react';

import { useCalendarStore } from '@store/calendarStore';

import { DataQuerySelector } from '@utils/consts';

export const useCalendarNavigation = () => {
  const emblaApi = useCalendarStore((s) => s.emblaApi);
  const currMonthIndex = useCalendarStore((s) => s.currMonthIndex);
  const setSelectedMonthIndex = useCalendarStore((s) => s.setSelectedMonthIndex);
  const setPendingScrollSelector = useCalendarStore((s) => s.setPendingScrollSelector);

  /** Navigate to a specific month by index (triggers re-render in CalendarSlider) */
  const goToMonth = useCallback((index: number) => setSelectedMonthIndex(index), [setSelectedMonthIndex]);

  /**
   * Navigate to today's month and scroll to the today marker after the
   * carousel settles. If the carousel is already on the correct slide,
   * the scroll happens immediately.
   */
  const goToCurrentMonth = useCallback(() => {
    if (currMonthIndex === null) return;
    setSelectedMonthIndex(currMonthIndex);
    setPendingScrollSelector(DataQuerySelector.Today);
    // All navigation is handled by effects in CalendarSlider.
    // Do NOT call emblaApi here — it conflicts with reInit in Effect #2.
  }, [currMonthIndex, setSelectedMonthIndex, setPendingScrollSelector]);

  /** Scroll the carousel to the slide that carries [data-selected-month-slide] */
  const scrollToSelectedMonthSlide = useCallback(() => {
    if (!emblaApi) return;
    const idx = emblaApi.slideNodes().findIndex((s) => s.hasAttribute(DataQuerySelector.SelectedMonthSlide));
    if (idx !== -1) emblaApi.scrollTo(idx);
  }, [emblaApi]);

  /** Open the month list panel (leftmost slide) */
  const openMonthList = useCallback(() => emblaApi?.scrollTo(0), [emblaApi]);

  /** Open the filter panel (rightmost slide) */
  const openFilterPanel = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollTo(emblaApi.slideNodes().length - 1);
  }, [emblaApi]);

  return { goToMonth, goToCurrentMonth, scrollToSelectedMonthSlide, openMonthList, openFilterPanel };
};
