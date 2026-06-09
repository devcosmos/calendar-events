'use client';

import { useEffect } from 'react';

import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

import CalendarMonthView from '@components/calendar/calendar-month';
import CalendarMonthList from '@components/calendar/calendar-month-list';
import CalendarSliderContainer from '@components/calendar/calendar-slider-container';
import { FilterPanel } from '@components/filter';

import { useCalendarStore } from '@store/calendarStore';

import { scrollSlideToSelector } from '@utils/calendarHelper';
import { DataQuerySelector } from '@utils/consts';
import { ReservoirType } from '@utils/eventFilter';
import { CalendarMonth } from '@utils/types';

interface CalendarSliderProps {
  months: CalendarMonth[];
  currentMonthIndex: number;
  targetEventId?: string;
  companies: string[];
  cities: string[];
  reservoirTypes: { id: ReservoirType; label: string }[];
}

export default function CalendarSlider({
  months,
  currentMonthIndex,
  targetEventId,
  companies,
  cities,
  reservoirTypes,
}: CalendarSliderProps) {
  const setEmblaApi = useCalendarStore((s) => s.setEmblaApi);
  const selectedMonthIndex = useCalendarStore((s) => s.selectedMonthIndex);

  const displayIndex = selectedMonthIndex ?? currentMonthIndex;
  const centerSlideIndex = displayIndex > 0 ? 2 : 1;

  const visibleSlides: { month: CalendarMonth; index: number }[] = [];
  if (months.length > 0) {
    if (displayIndex > 0) visibleSlides.push({ month: months[displayIndex - 1], index: displayIndex - 1 });
    visibleSlides.push({ month: months[displayIndex], index: displayIndex });
    if (displayIndex < months.length - 1)
      visibleSlides.push({ month: months[displayIndex + 1], index: displayIndex + 1 });
  }

  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex: centerSlideIndex, loop: false, align: 'center' }, [
    WheelGesturesPlugin(),
  ]);

  // ── 1. Register API in store ───────────────────────────────────────────────
  useEffect(() => {
    if (emblaApi) setEmblaApi(emblaApi);
  }, [emblaApi, setEmblaApi]);

  // ── 2. При смене месяца: reInit подхватывает новые DOM-узлы, затем переход к центру.
  //  Если пользователь на слайде-0 (список месяцев) — анимируем скролл к центру.
  //  Иначе — мгновенный reInit с центральным стартовым индексом.
  useEffect(() => {
    if (!emblaApi) return;

    const isOnListSlide = emblaApi.selectedScrollSnap() === 0;

    if (isOnListSlide) {
      emblaApi.reInit({ startIndex: 0 });
      emblaApi.scrollTo(centerSlideIndex);

      const onSelect = () => {
        if (emblaApi.selectedScrollSnap() !== centerSlideIndex) return;

        emblaApi.off('select', onSelect);
        scrollSlideToSelector(emblaApi.slideNodes()[emblaApi.selectedScrollSnap()], DataQuerySelector.Today);
      };

      emblaApi.on('select', onSelect);
    } else {
      emblaApi.reInit({ startIndex: centerSlideIndex });
      scrollSlideToSelector(emblaApi.slideNodes()[centerSlideIndex], DataQuerySelector.Today, 'smooth');
    }
  }, [displayIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 3. Initial load: scroll to today in the starting slide ────────────────
  useEffect(() => {
    if (!emblaApi) return;

    scrollSlideToSelector(emblaApi.slideNodes()[centerSlideIndex], DataQuerySelector.Today, 'smooth');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi]);

  // ── 4. Scroll month list to current month when user swipes to slide 0 ──────
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      if (emblaApi.selectedScrollSnap() !== 0) return;

      scrollSlideToSelector(emblaApi.slideNodes()[0], DataQuerySelector.CurrentMonthButton);
    };

    emblaApi.on('select', onSelect);
    return () => void emblaApi.off('select', onSelect);
  }, [emblaApi]);

  // ── 5. Deep link: scroll to a specific event card ─────────────────────────
  useEffect(() => {
    if (!emblaApi || !targetEventId) return;

    const centerIdx = emblaApi.slideNodes().findIndex((s) => s.hasAttribute(DataQuerySelector.SelectedMonthSlide));
    if (centerIdx === -1) return;

    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const clearEventIdFromUrl = () => {
      const url = new URL(window.location.href);

      if (!url.searchParams.has('eventId')) return;

      url.searchParams.delete('eventId');
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    };

    const tryScroll = (retries = 8): void => {
      const slid = emblaApi.slideNodes()[centerIdx];
      if (scrollSlideToSelector(slid, DataQuerySelector.SelectedEvent, 'smooth')) {
        clearEventIdFromUrl();

        return;
      }

      if (retries > 0) retryTimer = setTimeout(() => tryScroll(retries - 1), 120);
    };

    if (emblaApi.selectedScrollSnap() === centerIdx) {
      tryScroll();
    } else {
      const onSettle = () => {
        emblaApi.off('settle', onSettle);
        tryScroll();
      };
      emblaApi.on('settle', onSettle);
      emblaApi.scrollTo(centerIdx);

      return () => {
        void emblaApi.off('settle', onSettle);
        if (retryTimer) clearTimeout(retryTimer);
      };
    }

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [targetEventId, emblaApi]);

  return (
    <div ref={emblaRef} className="w-full h-full overflow-hidden">
      <div className="flex h-full">
        {/* Left edge: month list */}
        <CalendarSliderContainer>
          <CalendarMonthList months={months} />
        </CalendarSliderContainer>

        {/* Slides: prev / curr / next */}
        {visibleSlides.map(({ month, index }) => (
          <CalendarSliderContainer
            key={`${month.year}-${month.month}`}
            {...(index === displayIndex && { [DataQuerySelector.SelectedMonthSlide]: '' })}
          >
            <CalendarMonthView
              month={month}
              targetEventId={targetEventId}
              monthIndex={index}
              currentMonthIndex={currentMonthIndex}
            />
          </CalendarSliderContainer>
        ))}

        {/* Right edge: filter panel */}
        <CalendarSliderContainer>
          <FilterPanel companies={companies} cities={cities} reservoirTypes={reservoirTypes} />
        </CalendarSliderContainer>
      </div>
    </div>
  );
}
