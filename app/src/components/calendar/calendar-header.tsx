'use client';

import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import Button from '@components/button/button';
import { Filter } from '@components/icon/outline';

import { selectHasActiveFilters, useFilterStore } from '@store/filterStore';
import { useSwiperStore } from '@store/swiperStore';

import { DataQuerySelector } from '@utils/consts';
import { CalendarMonth } from '@utils/types';

interface CalendarHeaderProps {
  months: CalendarMonth[];
}

export default function CalendarHeader({ months }: CalendarHeaderProps) {
  const swiper = useSwiperStore((s) => s.swiper);
  const currMonthIndex = useSwiperStore((s) => s.currMonthIndex);
  const selectedMonthIndex = useSwiperStore((s) => s.selectedMonthIndex);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const hasActiveFilters = useFilterStore(selectHasActiveFilters);
  const clearFilters = useFilterStore((s) => s.clearFilters);

  const slideToCenterMonth = () => {
    if (!swiper) return;

    const centerIdx = swiper.slides.findIndex((slide) => slide.hasAttribute(DataQuerySelector.SelectedMonthSlide));
    swiper.slideTo(centerIdx !== -1 ? centerIdx : 1);
  };

  const handleMonthButtonClick = () => {
    if (!swiper) return;

    if (activeIndex === 0) {
      slideToCenterMonth();
    } else {
      swiper.slideTo(0);
    }
  };

  const handleFilterButtonClick = () => {
    if (!swiper) return;

    const lastIdx = swiper.slides.length - 1;

    if (activeIndex === lastIdx) {
      slideToCenterMonth();
    } else {
      swiper.slideTo(lastIdx);
    }
  };

  useEffect(() => {
    if (!swiper) return;

    const updateActive = () => setActiveIndex(swiper.activeIndex);

    swiper.on('activeIndexChange', updateActive);
    updateActive();

    return () => {
      swiper.off('activeIndexChange', updateActive);
    };
  }, [swiper]);

  // Mirror the same visible slice as CalendarSlider
  const displayIdx = selectedMonthIndex ?? currMonthIndex ?? 0;
  const visibleIndices: number[] = [];
  if (displayIdx > 0) visibleIndices.push(displayIdx - 1);
  visibleIndices.push(displayIdx);
  if (displayIdx < months.length - 1) visibleIndices.push(displayIdx + 1);

  // slide 0 = left list, slides 1..N = months, slide N+1 = right list → show current month on lists
  const isOnList = activeIndex === 0 || activeIndex > visibleIndices.length;
  const monthIdx = isOnList ? (currMonthIndex ?? 0) : visibleIndices[activeIndex - 1];

  const displayMonth = months[monthIdx];
  const monthName = displayMonth
    ? format(new Date(displayMonth.year, displayMonth.month - 1), 'LLLL yyyy', { locale: ru })
    : '';

  return (
    <div className="absolute top-0 left-0 right-0 z-10 w-full bg-gradient-to-b from-tg-secondary-bg-color/75 to-transparent">
      <div className="flex justify-between items-center gap-2 w-full my-2 px-3">
        <Button
          onClick={handleMonthButtonClick}
          className="bg-tg-section-bg-color/10 !w-auto backdrop-blur-md !rounded-full h-12 border border-tg-text-color/10 overflow-hidden !leading-none capitalize text-nowrap"
        >
          {monthName}
        </Button>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              onClick={clearFilters}
              className="bg-tg-section-bg-color/10 !w-auto backdrop-blur-md !rounded-full h-8 !py-1 !px-3 text-sm border border-tg-text-color/10 overflow-hidden !leading-none text-nowrap"
            >
              Сбросить
            </Button>
          )}

          <Button
            onClick={handleFilterButtonClick}
            className="relative bg-tg-section-bg-color/10 backdrop-blur-md !p-0 !size-12 !rounded-full border border-tg-text-color/10"
          >
            <Filter className="size-6 mt-1" />
            {hasActiveFilters && (
              <span className="absolute top-0.5 right-0.5 size-2.5 rounded-full bg-tg-button-color border border-tg-bg-color" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
