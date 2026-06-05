import { useCallback } from 'react';

import { useCalendarStore } from '@store/calendarStore';

import { DataQuerySelector } from '@utils/consts';

/** Scroll the CalendarSliderContainer inside a slide to center a selector match. */
function scrollSlideToSelector(slideEl: Element | undefined | null, selector: string): boolean {
  if (!slideEl) return false;
  const container = slideEl.firstElementChild as HTMLElement | null;
  const target = slideEl.querySelector(`[${selector}]`) as HTMLElement | null;
  if (!container || !target) return false;
  container.scrollTop = target.offsetTop - container.clientHeight / 2 + target.offsetHeight / 2;
  return true;
}

export const useCalendarNavigation = () => {
  const emblaApi = useCalendarStore((s) => s.emblaApi);
  const currMonthIndex = useCalendarStore((s) => s.currMonthIndex);
  const selectedMonthIndex = useCalendarStore((s) => s.selectedMonthIndex);
  const setSelectedMonthIndex = useCalendarStore((s) => s.setSelectedMonthIndex);

  /** Navigate to a specific month by index */
  const goToMonth = useCallback((index: number) => setSelectedMonthIndex(index), [setSelectedMonthIndex]);

  /**
   * Navigate to today's month and scroll the center slide to today.
   *
   * When month changes: setSelectedMonthIndex → CalendarSlider Effect #2 →
   * reInit + scrollSlideToSelector.
   *
   * When already on the same month but on list/filter slide: manually
   * scrollTo(center) and scroll to today after settle.
   *
   * When already on the center slide of the current month: scroll directly.
   */
  const goToCurrentMonth = useCallback(() => {
    if (currMonthIndex === null || !emblaApi) return;

    setSelectedMonthIndex(currMonthIndex);

    const center = currMonthIndex > 0 ? 2 : 1;

    if (emblaApi.selectedScrollSnap() === center) {
      // Already on the correct slide — scroll vertically to today
      scrollSlideToSelector(emblaApi.slideNodes()[center], DataQuerySelector.Today);
      return;
    }

    if (selectedMonthIndex === currMonthIndex) {
      // Same month, different slide — navigate to center then scroll to today
      const onSettle = () => {
        emblaApi.off('settle', onSettle);
        scrollSlideToSelector(emblaApi.slideNodes()[emblaApi.selectedScrollSnap()], DataQuerySelector.Today);
      };
      emblaApi.on('settle', onSettle);
      emblaApi.scrollTo(center);
    }
    // else: month changed → CalendarSlider Effect #2 handles reInit + scroll
  }, [currMonthIndex, emblaApi, selectedMonthIndex, setSelectedMonthIndex]);

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
