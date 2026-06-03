'use client';

import clsx from 'clsx';
import { format } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';

import FavouriteButton from '@components/button/favourite-button';

import { Locale } from '@core/i18n/config';

import { useMainStore } from '@store/mainStore';

import { nbsp } from '@utils/calendarHelper';
import { DataQuerySelector } from '@utils/consts';
import { SwimEvent } from '@utils/types';

interface CalendarEventCardProps {
  event: SwimEvent;
  ordinal: number;
  isTargetEvent?: boolean;
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

export default function CalendarEventCard({ event, ordinal, isTargetEvent = false }: CalendarEventCardProps) {
  const { locale } = useMainStore();
  const dateStr = formatDateRange(event.start_date, event.end_date, locale);
  const isEventPassed = new Date(event.end_date) < new Date();
  const isEventNow = new Date(event.start_date) <= new Date() && new Date() < new Date(event.end_date);

  return (
    <div
      {...(isTargetEvent && { [DataQuerySelector.SelectedEvent]: '' })}
      className="flex gap-1 bg-tg-section-bg-color p-1 rounded-2xl overflow-hidden"
    >
      <div className="flex flex-col items-center justify-between">
        <span
          className={clsx(
            'border rounded-full size-8 text-sm leading-[0.5] flex justify-center items-center flex-shrink-0 self-start',
            isEventNow || isTargetEvent ? 'border-orange' : 'border-tg-text-color/25',
          )}
        >
          {ordinal}
        </span>
        <FavouriteButton SwimEvent={event} />
      </div>
      <div className="p-2 pt-1 flex-grow">
        <h3 className={clsx('text-lg leading-tight mb-2', isEventPassed && !isTargetEvent && 'text-tg-hint-color')}>
          {event.registration_url ? (
            <a href={event.registration_url} target="_blank" rel="noopener noreferrer">
              {nbsp(event.name)}
            </a>
          ) : (
            nbsp(event.name)
          )}
        </h3>
        {event.location.map_url ? (
          <a
            href={event.location.map_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-tg-link-color text-sm !leading-none"
          >
            {event.location.address}
          </a>
        ) : (
          <span className="text-sm text-tg-hint-color">{event.location.address}</span>
        )}
        <div className="grid grid-cols-2 gap-2 items-end text-sm text-tg-hint-color leading-tight mt-5">
          <span>{dateStr}</span>
          {event.company &&
            (event.company.url ? (
              <a
                href={event.company.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-end whitespace-break-spaces text-tg-link-color"
              >
                {event.company.name}
              </a>
            ) : (
              <span className="text-end whitespace-break-spaces">{event.company.name}</span>
            ))}
        </div>
      </div>
    </div>
  );
}
