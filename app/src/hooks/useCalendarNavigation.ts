import { useCallback } from 'react';

import { useCalendarStore } from '@store/calendarStore';

import { scrollSlideToSelector } from '@utils/calendarHelper';
import { DataQuerySelector } from '@utils/consts';

export const useCalendarNavigation = () => {
  const emblaApi = useCalendarStore((s) => s.emblaApi);
  const currMonthIndex = useCalendarStore((s) => s.currMonthIndex);
  const selectedMonthIndex = useCalendarStore((s) => s.selectedMonthIndex);
  const setSelectedMonthIndex = useCalendarStore((s) => s.setSelectedMonthIndex);

  /** Перейти к конкретному месяцу по индексу */
  const goToMonth = useCallback((index: number) => setSelectedMonthIndex(index), [setSelectedMonthIndex]);

  /**
   * Перейти к текущему месяцу и прокрутить центральный слайд к сегодняшнему дню.
   *
   * При смене месяца: setSelectedMonthIndex → CalendarSlider Эффект №2 →
   * reInit + scrollSlideToSelector.
   *
   * Если уже на нужном месяце, но на слайде списка или фильтра: вручную
   * scrollTo(center), затем скролл к сегодня после события select.
   *
   * Если уже на центральном слайде текущего месяца: скроллим напрямую.
   */
  const goToCurrentMonth = useCallback(() => {
    if (currMonthIndex === null || !emblaApi) return;

    setSelectedMonthIndex(currMonthIndex);

    const center = currMonthIndex > 0 ? 2 : 1;

    if (emblaApi.selectedScrollSnap() === center) {
      // Уже на нужном слайде — вертикальный скролл к сегодня
      scrollSlideToSelector(emblaApi.slideNodes()[center], DataQuerySelector.Today, 'smooth');

      return;
    }

    if (selectedMonthIndex === currMonthIndex) {
      // Тот же месяц, другой слайд — переходим к центру, затем скроллим к сегодня
      const onSelect = () => {
        emblaApi.off('select', onSelect);
        scrollSlideToSelector(emblaApi.slideNodes()[emblaApi.selectedScrollSnap()], DataQuerySelector.Today, 'smooth');
      };
      emblaApi.on('select', onSelect);
      emblaApi.scrollTo(center);
    }
    // иначе: месяц сменился → CalendarSlider Эффект №2 сам выполнит reInit + скролл
  }, [currMonthIndex, emblaApi, selectedMonthIndex, setSelectedMonthIndex]);

  /** Прокрутить карусель к слайду с [data-selected-month-slide] */
  const scrollToSelectedMonthSlide = useCallback(() => {
    if (!emblaApi) return;

    const idx = emblaApi.slideNodes().findIndex((s) => s.hasAttribute(DataQuerySelector.SelectedMonthSlide));
    if (idx !== -1) emblaApi.scrollTo(idx);
  }, [emblaApi]);

  /** Открыть панель списка месяцев (крайний левый слайд) */
  const openMonthList = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollTo(0);
  }, [emblaApi]);

  /** Открыть панель фильтров (крайний правый слайд) */
  const openFilterPanel = useCallback(() => {
    if (!emblaApi) return;

    emblaApi.scrollTo(emblaApi.slideNodes().length - 1);
  }, [emblaApi]);

  return { goToMonth, goToCurrentMonth, scrollToSelectedMonthSlide, openMonthList, openFilterPanel };
};
