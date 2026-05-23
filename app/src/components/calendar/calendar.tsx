'use client';

import { useEffect } from 'react';

import CalendarHeader from '@components/calendar/calendar-header';
import CalendarSlider from '@components/calendar/calendar-slider';

import { useSwiperStore } from '@store/swiperStore';

import { CalendarMonth } from '@utils/types';

interface CalendarViewProps {
  months: CalendarMonth[];
  currentMonthIndex: number;
}

export default function CalendarView({ months, currentMonthIndex }: CalendarViewProps) {
  const setCurrMonthIndex = useSwiperStore((s) => s.setCurrMonthIndex);
  const setSelectedMonthIndex = useSwiperStore((s) => s.setSelectedMonthIndex);

  useEffect(() => {
    setCurrMonthIndex(currentMonthIndex);
    setSelectedMonthIndex(currentMonthIndex);
  }, [currentMonthIndex, setCurrMonthIndex, setSelectedMonthIndex]);

  return (
    <>
      <CalendarHeader months={months} />
      <CalendarSlider months={months} currentMonthIndex={currentMonthIndex} />
    </>
  );
}
