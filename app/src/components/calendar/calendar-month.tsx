'use client';

import { useTranslations } from 'next-intl';

import { isBefore, isEqual, startOfDay } from 'date-fns';
import { useShallow } from 'zustand/react/shallow';

import CalendarEmptyEvent from '@components/calendar/calendar-empty-event';
import CalendarEventCard from '@components/calendar/calendar-event-card';
import DayHeader from '@components/day-header/day-header';

import { selectEventFilters, useFilterStore } from '@store/filterStore';

import { filterEventsByFilters } from '@utils/eventFilter';
import { CalendarMonth, SwimEvent } from '@utils/types';

interface CalendarMonthViewProps {
  month: CalendarMonth;
}

type DayGroup = {
  date: Date;
  events: SwimEvent[];
};

function groupByDay(events: SwimEvent[]): DayGroup[] {
  const sorted = [...events].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  const groups: DayGroup[] = [];
  for (const event of sorted) {
    const day = startOfDay(new Date(event.start_date));
    const existing = groups.find((g) => isEqual(g.date, day));
    if (existing) {
      existing.events.push(event);
    } else {
      groups.push({ date: day, events: [event] });
    }
  }
  return groups;
}

export default function CalendarMonthView({ month }: CalendarMonthViewProps) {
  const t = useTranslations('calendar');
  const filters = useFilterStore(useShallow(selectEventFilters));

  const filteredEvents = filterEventsByFilters(month.events, filters);

  if (filteredEvents.length === 0) {
    return (
      <div className="py-3">
        <CalendarEmptyEvent title={t('empty-month')} />
      </div>
    );
  }

  const dayGroups = groupByDay(filteredEvents);
  const today = startOfDay(new Date());
  const nearestDayIndex = dayGroups.findIndex((g) => !isBefore(g.date, today));

  return (
    <div className="flex flex-col gap-1.5">
      {dayGroups.map(({ date, events }, dayIdx) => (
        <div key={date.toISOString()}>
          <DayHeader date={date} isNearestDay={dayIdx === nearestDayIndex} currentWeek />
          <div className="flex flex-col gap-1.5">
            {events.map((event, eventIdx) => (
              <CalendarEventCard key={event.id} event={event} ordinal={eventIdx + 1} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
