'use client';

import { useEffect, useMemo } from 'react';

import { useTranslations } from 'next-intl';

import CalendarHeader from '@components/calendar/calendar-header';
import CalendarSlider from '@components/calendar/calendar-slider';

import { useCalendarStore } from '@store/calendarStore';

import { ReservoirType, getReservoirType } from '@utils/eventFilter';
import { CalendarMonth } from '@utils/types';

interface CalendarViewProps {
  months: CalendarMonth[];
  currentMonthIndex: number;
  targetMonthIndex?: number;
  targetEventId?: string;
}

export default function CalendarView({
  months,
  currentMonthIndex,
  targetMonthIndex,
  targetEventId,
}: CalendarViewProps) {
  const t = useTranslations('calendar');

  const setCurrMonthIndex = useCalendarStore((s) => s.setCurrMonthIndex);
  const setSelectedMonthIndex = useCalendarStore((s) => s.setSelectedMonthIndex);

  useEffect(() => {
    setCurrMonthIndex(currentMonthIndex);
    setSelectedMonthIndex(targetMonthIndex ?? currentMonthIndex);
  }, [currentMonthIndex, targetMonthIndex, setCurrMonthIndex, setSelectedMonthIndex]);

  const { companies, cities, reservoirTypes } = useMemo(() => {
    const companyCountMap = months
      .flatMap((m) => m.events)
      .reduce<Record<string, number>>((acc, e) => {
        if (e.company) acc[e.company.name] = (acc[e.company.name] ?? 0) + 1;
        return acc;
      }, {});

    const companies = Object.entries(companyCountMap)
      .filter(([, count]) => count >= 10)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru'))
      .map(([company]) => company);

    const cityCountMap = months
      .flatMap((m) => m.events)
      .reduce<Record<string, number>>((acc, e) => {
        const city = e.location.city?.trim();
        if (city) acc[city] = (acc[city] ?? 0) + 1;
        return acc;
      }, {});

    const cities = Object.entries(cityCountMap)
      .filter(([, count]) => count > 3)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru'))
      .map(([city]) => city);

    const reservoirTypes: { id: ReservoirType; label: string }[] = [];
    const reservoirCountMap = months
      .flatMap((m) => m.events)
      .reduce<Record<string, number>>((acc, e) => {
        const type = getReservoirType(e);
        acc[type] = (acc[type] ?? 0) + 1;
        return acc;
      }, {});

    const typeOrder = [ReservoirType.Pool, ReservoirType.OpenWater, ReservoirType.Ice, ReservoirType.Aquathlon];
    for (const type of typeOrder) {
      if (reservoirCountMap[type]) {
        reservoirTypes.push({ id: type, label: t(`filters.options.eventType.${type}`) });
      }
    }

    return { companies, cities, reservoirTypes };
  }, [months, t]);

  return (
    <>
      <CalendarHeader months={months} />
      <CalendarSlider
        months={months}
        currentMonthIndex={currentMonthIndex}
        targetEventId={targetEventId}
        companies={companies}
        cities={cities}
        reservoirTypes={reservoirTypes}
      />
    </>
  );
}
