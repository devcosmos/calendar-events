'use client';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useShallow } from 'zustand/react/shallow';

import MonthButton from '@components/button/month-button';

import { useCalendarNavigation } from '@hooks/useCalendarNavigation';

import { useCalendarStore } from '@store/calendarStore';
import { selectEventFilters, useFilterStore } from '@store/filterStore';

import { filterEventsByFilters } from '@utils/eventFilter';
import { plural } from '@utils/helper';
import { CalendarMonth } from '@utils/types';

interface CalendarMonthListProps {
  months: CalendarMonth[];
}

export default function CalendarMonthList({ months }: CalendarMonthListProps) {
  const currMonthIndex = useCalendarStore((s) => s.currMonthIndex);
  const selectedMonthIndex = useCalendarStore((s) => s.selectedMonthIndex);
  const filters = useFilterStore(useShallow(selectEventFilters));

  const { goToMonth, scrollToSelectedMonthSlide } = useCalendarNavigation();

  const handleMonthClick = (idx: number) => {
    if (idx === selectedMonthIndex) {
      scrollToSelectedMonthSlide();
    } else {
      goToMonth(idx);
    }
  };

  const getFilteredEventCount = (events: (typeof months)[0]['events']) => {
    return filterEventsByFilters(events, filters).length;
  };

  // Group months by year
  const byYear = months.reduce<{ year: number; items: { month: CalendarMonth; idx: number }[] }[]>(
    (acc, month, idx) => {
      const group = acc.find((g) => g.year === month.year);
      if (group) {
        group.items.push({ month, idx });
      } else {
        acc.push({ year: month.year, items: [{ month, idx }] });
      }
      return acc;
    },
    [],
  );

  return (
    <div className="flex flex-col">
      {byYear.map(({ year, items }) => (
        <div key={year}>
          <h3 className="mt-4 mb-3 flex justify-between items-center">
            <span>{year}</span>
            <span className="text-tg-hint-color font-normal">
              {plural(
                items.reduce((sum, { month }) => sum + getFilteredEventCount(month.events), 0),
                'событие',
                'события',
                'событий',
              )}
            </span>
          </h3>
          <div className="flex flex-col gap-1.5">
            {items.map(({ month, idx }) => {
              const label = format(new Date(month.year, month.month - 1), 'LLLL', { locale: ru });
              const isCurrent = idx === currMonthIndex;
              const isSelected = idx === selectedMonthIndex;
              const isPast = currMonthIndex !== null && idx < currMonthIndex;

              return (
                <MonthButton
                  key={`${month.year}-${month.month}`}
                  month={month}
                  label={label}
                  isCurrent={isCurrent}
                  isSelected={isSelected}
                  isPast={isPast}
                  filteredCount={getFilteredEventCount(month.events)}
                  onClick={() => handleMonthClick(idx)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
