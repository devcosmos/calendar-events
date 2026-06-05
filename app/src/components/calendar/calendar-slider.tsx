'use client';

import { useEffect } from 'react';

import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

import CalendarMonthView from '@components/calendar/calendar-month';
import CalendarMonthList from '@components/calendar/calendar-month-list';
import CalendarSliderContainer from '@components/calendar/calendar-slider-container';
import { FilterPanel } from '@components/filter';

import { useCalendarStore } from '@store/calendarStore';

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

/**
 * Scroll the CalendarSliderContainer (the overflow-y-auto div) inside a slide
 * to center the element matching `selector`. Uses scrollTop directly — never
 * calls scrollIntoView, which would bubble up through Embla's overflow:hidden
 * viewport and corrupt horizontal position.
 */
function scrollSlideToSelector(slideEl: Element | undefined | null, selector: string): boolean {
  if (!slideEl) return false;
  // CalendarSliderContainer is the direct child of the slide div
  const container = slideEl.firstElementChild as HTMLElement | null;
  const target = slideEl.querySelector(`[${selector}]`) as HTMLElement | null;
  if (!container || !target) return false;

  const containerHeight = container.clientHeight;
  const targetOffsetTop = target.offsetTop;
  const targetHeight = target.offsetHeight;
  container.scrollTop = targetOffsetTop - containerHeight / 2 + targetHeight / 2;
  return true;
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

  // ── 2. When selected month changes, reInit so Embla picks up new DOM nodes,
  //  then scroll the center slide to today.
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit({ startIndex: centerSlideIndex });
    // After reInit the carousel is at centerSlideIndex. Scroll to today.
    scrollSlideToSelector(emblaApi.slideNodes()[centerSlideIndex], DataQuerySelector.Today);
  }, [displayIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── 3. Initial load: scroll to today in the starting slide ────────────────
  useEffect(() => {
    if (!emblaApi) return;
    scrollSlideToSelector(emblaApi.slideNodes()[centerSlideIndex], DataQuerySelector.Today);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emblaApi]);

  // ── 4. Deep link: scroll to a specific event card ─────────────────────────
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
      const container = slid?.firstElementChild as HTMLElement | null;
      const el = slid?.querySelector(`[${DataQuerySelector.SelectedEvent}]`) as HTMLElement | null;
      if (container && el) {
        container.scrollTop = el.offsetTop - container.clientHeight / 2 + el.offsetHeight / 2;
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
