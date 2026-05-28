'use client';

import { useEffect, useMemo } from 'react';

import CalendarHeader from '@components/calendar/calendar-header';
import CalendarSlider from '@components/calendar/calendar-slider';

import { useSwiperStore } from '@store/swiperStore';

import { RESERVOIR_TYPE_LABELS, ReservoirType, getReservoirType } from '@utils/eventFilter';
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

  const { companies, cities, reservoirTypes } = useMemo(() => {
    const companyCountMap = months
      .flatMap((m) => m.events)
      .reduce<Record<string, number>>((acc, e) => {
        if (e.company) acc[e.company] = (acc[e.company] ?? 0) + 1;
        return acc;
      }, {});

    const companies = Object.entries(companyCountMap)
      .filter(([, count]) => count >= 10)
      .map(([company]) => company)
      .sort();

    const cityCountMap = months
      .flatMap((m) => m.events)
      .reduce<Record<string, number>>((acc, e) => {
        const city = e.location.city?.trim();
        if (city) acc[city] = (acc[city] ?? 0) + 1;
        return acc;
      }, {});

    const cities = Object.entries(cityCountMap)
      .filter(([, count]) => count > 2)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'ru'))
      .map(([city]) => city);

    const reservoirTypes: Array<{ id: ReservoirType; label: string }> = [];
    const reservoirCountMap = months
      .flatMap((m) => m.events)
      .reduce<Record<string, number>>((acc, e) => {
        const type = getReservoirType(e);
        acc[type] = (acc[type] ?? 0) + 1;
        return acc;
      }, {});

    if (reservoirCountMap[ReservoirType.Pool]) {
      reservoirTypes.push({ id: ReservoirType.Pool, label: RESERVOIR_TYPE_LABELS[ReservoirType.Pool] });
    }
    if (reservoirCountMap[ReservoirType.OpenWater]) {
      reservoirTypes.push({
        id: ReservoirType.OpenWater,
        label: RESERVOIR_TYPE_LABELS[ReservoirType.OpenWater],
      });
    }

    return { companies, cities, reservoirTypes };
  }, [months]);

  return (
    <>
      <CalendarHeader months={months} />
      <CalendarSlider
        months={months}
        currentMonthIndex={currentMonthIndex}
        companies={companies}
        cities={cities}
        reservoirTypes={reservoirTypes}
      />
    </>
  );
}
