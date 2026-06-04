'use client';

import { useCallback, useEffect, useRef } from 'react';

import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

import CalendarMonthView from '@components/calendar/calendar-month';
import CalendarMonthList from '@components/calendar/calendar-month-list';
import CalendarSliderContainer from '@components/calendar/calendar-slider-container';
import { FilterPanel } from '@components/filter';

import { useMainStore } from '@store/mainStore';
import { useSwiperStore } from '@store/swiperStore';

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

const HINT_FOR_SWIPING_DELAY = 3000; // ms

export default function CalendarSlider({
  months,
  currentMonthIndex,
  targetEventId,
  companies,
  cities,
  reservoirTypes,
}: CalendarSliderProps) {
  const setEmblaApi = useSwiperStore((s) => s.setEmblaApi);
  const selectedMonthIndex = useSwiperStore((s) => s.selectedMonthIndex);

  const { hintForSwiping, hideHintForSwiping } = useMainStore();

  const handledTargetEventIdRef = useRef<string | null>(null);

  const displayIndex = selectedMonthIndex ?? currentMonthIndex;

  // Only render prev/curr/next months
  const visibleSlides: { month: CalendarMonth; index: number }[] = [];
  if (months.length > 0) {
    if (displayIndex > 0) visibleSlides.push({ month: months[displayIndex - 1], index: displayIndex - 1 });
    visibleSlides.push({ month: months[displayIndex], index: displayIndex });
    if (displayIndex < months.length - 1)
      visibleSlides.push({ month: months[displayIndex + 1], index: displayIndex + 1 });
  }

  // Slide 0 is MonthList, then optionally prev month, then curr month
  const centerSlideIndex = displayIndex > 0 ? 2 : 1;

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { axis: 'x', startIndex: centerSlideIndex, loop: false, align: 'center', dragFree: false },
    [WheelGesturesPlugin()],
  );

  // Share embla API via store
  useEffect(() => {
    if (emblaApi) setEmblaApi(emblaApi);
  }, [emblaApi, setEmblaApi]);

  // When displayIndex changes (month re-render), reinit and re-center
  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit();
    const newCenter = displayIndex > 0 ? 2 : 1;
    setTimeout(() => emblaApi.scrollTo(newCenter, true), 0);
  }, [displayIndex, emblaApi]);

  // On slide settle: scroll the active month's current-week button into view
  useEffect(() => {
    if (!emblaApi) return;
    const onSettle = () => {
      const idx = emblaApi.selectedScrollSnap();
      emblaApi
        .slideNodes()
        [idx]?.querySelector(`[${DataQuerySelector.CurrentMonthButton}]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    emblaApi.on('settle', onSettle);
    return () => {
      emblaApi.off('settle', onSettle);
    };
  }, [emblaApi]);

  // Hint scroll: briefly peek at the next slide then return
  const hintScroll = useCallback(() => {
    if (!emblaApi || !hintForSwiping) return;
    const container = emblaApi.containerNode();
    const style = window.getComputedStyle(container);
    const currentX = new DOMMatrix(style.transform).m41;
    container.style.transition = 'transform 400ms ease';
    container.style.transform = `translateX(${currentX - 50}px)`;
    setTimeout(() => {
      container.style.transform = `translateX(${currentX}px)`;
      setTimeout(() => {
        container.style.transition = '';
        container.style.transform = '';
        // Let embla re-apply its own transform
        emblaApi.scrollTo(emblaApi.selectedScrollSnap(), true);
      }, 400);
    }, 400);
    emblaApi.on('select', hideHintForSwiping);
  }, [emblaApi, hintForSwiping, hideHintForSwiping]);

  // First-load: scroll to today and show swipe hint
  useEffect(() => {
    if (!targetEventId) return;
    if (handledTargetEventIdRef.current === targetEventId) return;

    const centerIdx =
      emblaApi?.slideNodes().findIndex((slide) => slide.hasAttribute(DataQuerySelector.SelectedMonthSlide)) ?? -1;
    if (centerIdx === -1) return;

    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const scrollToTargetEvent = (slideIndex: number): boolean => {
      const slide = emblaApi?.slideNodes()[slideIndex];
      if (!slide) return false;

      const targetElement = slide.querySelector(`[${DataQuerySelector.SelectedEvent}]`);
      if (!targetElement) return false;

      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return true;
    };

    const clearTargetEventFromUrl = () => {
      const url = new URL(window.location.href);
      if (!url.searchParams.has('eventId')) return;

      url.searchParams.delete('eventId');
      const cleanUrl = `${url.pathname}${url.search}${url.hash}`;
      window.history.replaceState(window.history.state, '', cleanUrl);
    };

    const tryScrollWithRetry = (slideIndex: number, retries = 8) => {
      const didScroll = scrollToTargetEvent(slideIndex);
      if (didScroll) {
        clearTargetEventFromUrl();
        handledTargetEventIdRef.current = targetEventId;
        return;
      }

      if (retries <= 0) return;
      retryTimer = setTimeout(() => tryScrollWithRetry(slideIndex, retries - 1), 120);
    };

    if (!emblaApi) return;

    if (emblaApi.selectedScrollSnap() === centerIdx) {
      tryScrollWithRetry(centerIdx);
      return;
    }

    const handleSettle = () => {
      tryScrollWithRetry(centerIdx);
      emblaApi.off('settle', handleSettle);
    };

    emblaApi.on('settle', handleSettle);
    emblaApi.scrollTo(centerIdx);

    return () => {
      emblaApi.off('settle', handleSettle);
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [targetEventId, selectedMonthIndex, emblaApi]);

  useEffect(() => {
    const scrollTimer = setTimeout(() => {
      if (!emblaApi) return;
      const idx = emblaApi.selectedScrollSnap();
      emblaApi
        .slideNodes()
        [idx]?.querySelector(`[${DataQuerySelector.Today}]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => hintScroll(), HINT_FOR_SWIPING_DELAY);
    }, 100);
    return () => clearTimeout(scrollTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={emblaRef} className="w-full h-full overflow-hidden">
      <div className="flex h-full">
        {/* Left edge: month list */}
        <div className="flex-[0_0_100%] h-auto min-w-0">
          <CalendarSliderContainer>
            <CalendarMonthList months={months} />
          </CalendarSliderContainer>
        </div>

        {/* Slides: prev / curr / next */}
        {visibleSlides.map(({ month, index }) => (
          <div
            className="flex-[0_0_100%] h-auto min-w-0"
            key={`${month.year}-${month.month}`}
            {...(index === displayIndex && { [DataQuerySelector.SelectedMonthSlide]: '' })}
          >
            <CalendarSliderContainer>
              <CalendarMonthView
                month={month}
                targetEventId={targetEventId}
                monthIndex={index}
                currentMonthIndex={currentMonthIndex}
              />
            </CalendarSliderContainer>
          </div>
        ))}

        {/* Right edge: filter panel */}
        <div className="flex-[0_0_100%] h-auto min-w-0">
          <CalendarSliderContainer>
            <FilterPanel companies={companies} cities={cities} reservoirTypes={reservoirTypes} />
          </CalendarSliderContainer>
        </div>
      </div>
    </div>
  );
}
