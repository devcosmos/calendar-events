'use client';

import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import HeaderButton from '@components/button/header-button';
import { Filter } from '@components/icon/outline';

import { useCalendarNavigation } from '@hooks/useCalendarNavigation';

import { useCalendarStore } from '@store/calendarStore';
import { selectHasActiveFilters, useFilterStore } from '@store/filterStore';

import { CalendarMonth } from '@utils/types';

interface CalendarHeaderProps {
  months: CalendarMonth[];
}

export default function CalendarHeader({ months }: CalendarHeaderProps) {
  const emblaApi = useCalendarStore((s) => s.emblaApi);
  const currMonthIndex = useCalendarStore((s) => s.currMonthIndex);
  const selectedMonthIndex = useCalendarStore((s) => s.selectedMonthIndex);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const hasActiveFilters = useFilterStore(selectHasActiveFilters);
  const clearFilters = useFilterStore((s) => s.clearFilters);

  const { scrollToSelectedMonthSlide, openMonthList, openFilterPanel } = useCalendarNavigation();

  const totalSlides = emblaApi?.slideNodes().length ?? 0;
  const isOnList = activeSlideIndex === 0;
  const isOnFilter = totalSlides > 0 && activeSlideIndex === totalSlides - 1;

  const handleMonthButtonClick = () => {
    if (isOnList) {
      scrollToSelectedMonthSlide();
    } else {
      openMonthList();
    }
  };

  const handleFilterButtonClick = () => {
    if (isOnFilter) {
      scrollToSelectedMonthSlide();
    } else {
      openFilterPanel();
    }
  };

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => setActiveSlideIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', update);
    update();

    return () => void emblaApi.off('select', update);
  }, [emblaApi]);

  // Update activeSlideIndex when month selection changes
  useEffect(() => {
    if (!emblaApi || selectedMonthIndex === null) return;

    const displayIdx = selectedMonthIndex;
    const centerSlideIndex = displayIdx > 0 ? 2 : 1;
    setActiveSlideIndex(centerSlideIndex);
  }, [selectedMonthIndex, emblaApi]);

  // Determine which month name to display in the header button
  const displayIdx = selectedMonthIndex ?? currMonthIndex ?? 0;
  const visibleMonthIndices: number[] = [];
  if (displayIdx > 0) visibleMonthIndices.push(displayIdx - 1);
  visibleMonthIndices.push(displayIdx);
  if (displayIdx < months.length - 1) visibleMonthIndices.push(displayIdx + 1);

  const isShowingMonth = !isOnList && !isOnFilter;
  const monthIdx = isShowingMonth ? (visibleMonthIndices[activeSlideIndex - 1] ?? displayIdx) : (currMonthIndex ?? 0);
  const displayMonth = months[monthIdx];
  const monthName = displayMonth
    ? format(new Date(displayMonth.year, displayMonth.month - 1), 'LLLL yyyy', { locale: ru })
    : '';

  return (
    <div className="absolute top-0 left-0 right-0 z-10 w-full bg-linear-to-b from-tg-secondary-bg-color/75 to-transparent">
      <div className="flex justify-between items-center gap-2 w-full my-2 px-3">
        <HeaderButton onClick={handleMonthButtonClick} size="lg">
          {monthName}
        </HeaderButton>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <HeaderButton onClick={clearFilters} size="sm">
              Сбросить
            </HeaderButton>
          )}

          <HeaderButton onClick={handleFilterButtonClick} size="lg" className="p-0! size-12! overflow-visible!">
            <Filter className="size-6 mt-1" />
            {hasActiveFilters && (
              <span className="absolute top-0.5 right-0.5 size-2.5 rounded-full bg-tg-button-color border border-tg-bg-color" />
            )}
          </HeaderButton>
        </div>
      </div>
    </div>
  );
}
