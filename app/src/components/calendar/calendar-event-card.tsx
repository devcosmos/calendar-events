'use client';

import { format } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';

import { Locale } from '@core/i18n/config';

import { useMainStore } from '@store/mainStore';

import { SwimEvent } from '@utils/types';

interface CalendarEventCardProps {
  event: SwimEvent;
  ordinal: number;
}

function formatDateRange(start: string, end: string, locale: string): string {
  const s = new Date(start);
  const e = new Date(end);
  const dateFnsLocale = locale === Locale.Ru ? ru : enUS;
  const sameDay = start.slice(0, 10) === end.slice(0, 10);

  if (sameDay) return format(s, 'd MMM', { locale: dateFnsLocale });

  const sameMonth = s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth();
  if (sameMonth) {
    return `${format(s, 'd')}–${format(e, 'd MMM', { locale: dateFnsLocale })}`;
  }
  return `${format(s, 'd MMM', { locale: dateFnsLocale })} – ${format(e, 'd MMM', { locale: dateFnsLocale })}`;
}

export default function CalendarEventCard({ event, ordinal }: CalendarEventCardProps) {
  const { locale } = useMainStore();
  const dateStr = formatDateRange(event.start_date, event.end_date, locale);
  const locationText = [event.location.city, event.location.reservoir].filter(Boolean).join(', ');

  return (
    <div className="flex gap-1 bg-tg-section-bg-color p-1 rounded-2xl">
      <span className="border border-tg-text-color/25 rounded-full size-8 text-sm leading-[0.5] pt-[1px] flex justify-center items-center flex-shrink-0 self-start mt-1">
        {ordinal}
      </span>
      <div className="p-2 pt-1 flex-grow">
        <h3 className="text-lg leading-tight mb-2">{event.name}</h3>
        {event.location.map_url ? (
          <a
            href={event.location.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-tg-link-color text-sm"
          >
            {locationText}
          </a>
        ) : (
          <span className="text-sm text-tg-hint-color">{locationText}</span>
        )}
        <div className="grid grid-cols-2 gap-2 items-end text-sm text-tg-hint-color leading-tight mt-7">
          <span>{dateStr}</span>
          {event.company && <span className="text-end whitespace-break-spaces">{event.company}</span>}
        </div>
      </div>
    </div>
  );
}
