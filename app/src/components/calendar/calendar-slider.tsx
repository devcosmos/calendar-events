'use client';

import { useEffect, useRef } from 'react';

import useEmblaCarousel from 'embla-carousel-react';
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures';

import CalendarMonthView from '@components/calendar/calendar-month';
import CalendarMonthList from '@components/calendar/calendar-month-list';
import CalendarSliderContainer from '@components/calendar/calendar-slider-container';
import { FilterPanel } from '@components/filter';

import { useCalendarStore } from '@store/calendarStore';
import { useMainStore } from '@store/mainStore';

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

const HINT_DELAY = 3000;

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
  const pendingScrollSelector = useCalendarStore((s) => s.pendingScrollSelector);
  const setPendingScrollSelector = useCalendarStore((s) => s.setPendingScrollSelector);

  const { hintForSwiping, hideHintForSwiping } = useMainStore();

  const handledTargetEventIdRef = useRef<string | null>(null);
  // Always-fresh ref so stable event handlers can read pendingScrollSelector
  // without needing it in their dependency arrays
  const pendingRef = useRef<string | null>(null);
  pendingRef.current = pendingScrollSelector;

  // Set to true in Effect #2 when reInit fires; reset to false at render top.
  // Effect #2b reads this to know if reInit already positioned the carousel.
  const reinitThisRenderRef = useRef(false);
  reinitThisRenderRef.current = false;

  const displayIndex = selectedMonthIndex ?? currentMonthIndex;
  const centerSlideIndex = displayIndex > 0 ? 2 : 1;

  const visibleSlides: { month: CalendarMonth; index: number }[] = [];
  if (months.length > 0) {
    if (displayIndex > 0) visibleSlides.push({ month: months[displayIndex - 1], index: displayIndex - 1 });
    visibleSlides.push({ month: months[displayIndex], index: displayIndex });
    if (displayIndex < months.length - 1)
      visibleSlides.push({ month: months[displayIndex + 1], index: displayIndex + 1 });
  }

  const prevSlideCountRef = useRef(visibleSlides.length + 2);

  const [emblaRef, emblaApi] = useEmblaCarousel({ startIndex: centerSlideIndex, loop: false, align: 'center' }, [
    WheelGesturesPlugin(),
  ]);

  // ── 1. Register API in store ───────────────────────────────────────────────
  useEffect(() => {
    if (emblaApi) setEmblaApi(emblaApi);
  }, [emblaApi, setEmblaApi]);

  // ── 2. Navigate to center when displayIndex changes ──────────────────────
  //  Always reInit so Embla picks up fresh DOM nodes (keys changed).
  //  startIndex snaps instantly to center — no animation, no settle, no race.
  useEffect(() => {
    if (!emblaApi) return;
    reinitThisRenderRef.current = true;
    const center = displayIndex > 0 ? 2 : 1;
    prevSlideCountRef.current = visibleSlides.length + 2;
    emblaApi.reInit({ startIndex: center });
  }, [displayIndex, emblaApi, visibleSlides.length]);

  // ── 2b. Execute pending scroll selector ───────────────────────────────────
  //  Case A — reInit just ran: carousel is already at center, scroll now.
  //    (reInit doesn't fire 'settle', so we can't rely on effect #3 here.)
  //  Case B — reInit did NOT run (displayIndex unchanged, e.g. user taps
  //    "today" while on list/filter for the same month): animate to center
  //    via scrollTo; effect #3's onSettle will execute via pendingRef.
  useEffect(() => {
    if (!emblaApi || !pendingScrollSelector) return;
    const center = displayIndex > 0 ? 2 : 1;

    const executeScrollNow = () => {
      pendingRef.current = null; // clear immediately so settle doesn't double-fire
      emblaApi
        .slideNodes()
        [center]?.querySelector(`[${pendingScrollSelector}]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setPendingScrollSelector(null);
    };

    if (reinitThisRenderRef.current) {
      // reInit already positioned the carousel at center
      executeScrollNow();
      return;
    }

    const snap = emblaApi.selectedScrollSnap();
    if (snap === center) {
      executeScrollNow();
    } else {
      // Navigate; onSettle (effect #3) will scroll via pendingRef
      emblaApi.scrollTo(center);
    }
  }, [pendingScrollSelector, emblaApi, displayIndex, setPendingScrollSelector]);

  // ── 3. On settle: execute pending scroll or default (current-month button) ─
  useEffect(() => {
    if (!emblaApi) return;
    const onSettle = () => {
      const idx = emblaApi.selectedScrollSnap();
      const slide = emblaApi.slideNodes()[idx];
      const pending = pendingRef.current;

      if (pending) {
        slide?.querySelector(`[${pending}]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setPendingScrollSelector(null);
      } else {
        slide
          ?.querySelector(`[${DataQuerySelector.CurrentMonthButton}]`)
          ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };
    emblaApi.on('settle', onSettle);
    return () => {
      emblaApi.off('settle', onSettle);
    };
  }, [emblaApi, setPendingScrollSelector]);

  // ── 4. Initial load: scroll to today + swipe hint ─────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!emblaApi) return;
      const idx = emblaApi.selectedScrollSnap();
      emblaApi
        .slideNodes()
        [idx]?.querySelector(`[${DataQuerySelector.Today}]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });

      if (!hintForSwiping) return;
      setTimeout(() => {
        const container = emblaApi.containerNode();
        const currentX = new DOMMatrix(window.getComputedStyle(container).transform).m41;
        container.style.transition = 'transform 400ms ease';
        container.style.transform = `translateX(${currentX - 50}px)`;
        setTimeout(() => {
          container.style.transform = `translateX(${currentX}px)`;
          setTimeout(() => {
            container.style.transition = '';
            container.style.transform = '';
            emblaApi.scrollTo(emblaApi.selectedScrollSnap(), true);
          }, 400);
        }, 400);
        emblaApi.on('select', hideHintForSwiping);
      }, HINT_DELAY);
    }, 100);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 5. Deep link: scroll to a specific event card ─────────────────────────
  useEffect(() => {
    if (!emblaApi || !targetEventId || handledTargetEventIdRef.current === targetEventId) return;

    const centerIdx = emblaApi.slideNodes().findIndex((s) => s.hasAttribute(DataQuerySelector.SelectedMonthSlide));
    if (centerIdx === -1) return;

    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const tryScroll = (retries = 8): void => {
      const el = emblaApi.slideNodes()[centerIdx]?.querySelector(`[${DataQuerySelector.SelectedEvent}]`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        clearEventIdFromUrl();
        handledTargetEventIdRef.current = targetEventId;
        return;
      }
      if (retries > 0) retryTimer = setTimeout(() => tryScroll(retries - 1), 120);
    };

    const clearEventIdFromUrl = () => {
      const url = new URL(window.location.href);
      if (!url.searchParams.has('eventId')) return;
      url.searchParams.delete('eventId');
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
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
    }

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [targetEventId, emblaApi]);

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
