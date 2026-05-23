'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import Button from '@components/button/button';

import { useSwiperStore } from '@store/swiperStore';

import { plural } from '@utils/calendarHelper';
import { DataQuerySelector } from '@utils/consts';
import { CalendarMonth } from '@utils/types';

interface CalendarMonthListProps {
  months: CalendarMonth[];
}

export default function CalendarMonthList({ months }: CalendarMonthListProps) {
  const setSelectedMonthIndex = useSwiperStore((s) => s.setSelectedMonthIndex);
  const currMonthIndex = useSwiperStore((s) => s.currMonthIndex);
  const selectedMonthIndex = useSwiperStore((s) => s.selectedMonthIndex);

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
    <div className="flex flex-col py-3">
      {byYear.map(({ year, items }) => (
        <div key={year}>
          <h3 className="mb-3 pt-1 mt-2 flex justify-between items-center">
            <span>{year}</span>
            <span className="text-tg-hint-color font-normal">
              {plural(
                items.reduce((sum, { month }) => sum + month.events.length, 0),
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
                <Button
                  key={`${month.year}-${month.month}`}
                  className="!bg-tg-section-bg-color !border-tg-section-bg-color text-tg-text-color !rounded-2xl ps-1 !py-1"
                  addIcon
                  {...(isCurrent && { [DataQuerySelector.CurrentMonthButton]: '' })}
                  onClick={() => setSelectedMonthIndex(idx)}
                >
                  <div className="flex gap-3.5 items-center">
                    <span className="border border-tg-text-color/25 rounded-full size-8 text-sm leading-none pt-[1px] flex justify-center items-center flex-shrink-0">
                      {month.month}
                    </span>
                    <span
                      className={clsx(
                        'capitalize flex items-baseline',
                        isPast && !isSelected && 'opacity-25',
                        isCurrent && '!text-orange !opacity-100',
                        isSelected && !isCurrent && 'text-tg-link-color !opacity-100',
                      )}
                    >
                      {label}
                      <span className="text-base opacity-50">&nbsp;&mdash;&nbsp;{month.events.length}</span>
                    </span>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
