'use client';

import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import Button from '@components/button/button';
import { MagnifyingGlass } from '@components/icon/regular';

import { useSwiperStore } from '@store/swiperStore';

import { AppRoute } from '@utils/consts';
import { CalendarMonth } from '@utils/types';

interface CalendarHeaderProps {
  months: CalendarMonth[];
}

export default function CalendarHeader({ months }: CalendarHeaderProps) {
  const swiper = useSwiperStore((s) => s.swiper);
  const currMonthIndex = useSwiperStore((s) => s.currMonthIndex);
  const selectedMonthIndex = useSwiperStore((s) => s.selectedMonthIndex);
  const [activeIndex, setActiveIndex] = useState<number>(0);

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
    <div className="absolute top-0 left-0 right-0 bg-tg-secondary-bg-color z-10 w-full">
      <div className="flex justify-between items-center gap-2 w-full my-2 px-3">
        <div className="flex justify-between items-center gap-2 overflow-hidden">
          <Button
            href={AppRoute.Search}
            className="bg-tg-section-bg-color border-tg-section-bg-color text-sm !rounded-2xl !w-auto !p-3.5"
          >
            <MagnifyingGlass className="!fill-tg-link-color" />
          </Button>
        </div>
        <Button
          onClick={() => swiper?.slideTo(0)}
          className="bg-tg-section-bg-color border-tg-section-bg-color capitalize !text-sm text-tg-link-color !py-3.5 !rounded-2xl !w-auto text-nowrap"
        >
          {monthName}
        </Button>
      </div>
    </div>
  );
}
