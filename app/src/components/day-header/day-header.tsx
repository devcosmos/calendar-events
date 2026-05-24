import { useTranslations } from 'next-intl';

import clsx from 'clsx';
import { addDays, format, isAfter, isEqual, startOfDay } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';

import { Locale } from '@core/i18n/config';

import { useMainStore } from '@store/mainStore';

import { DataQuerySelector } from '@utils/consts';

export default function DayHeader({
  date,
  isNearestDay = false,
  currentWeek = false,
  children,
}: React.PropsWithChildren<{
  date: Date;
  isNearestDay?: boolean;
  currentWeek?: boolean;
}>) {
  const t = useTranslations('calendar');

  const { locale } = useMainStore();

  const today = new Date();

  const isToday = isEqual(startOfDay(date), startOfDay(today));
  const isTomorrow = isEqual(startOfDay(date), startOfDay(addDays(today, 1)));
  const isNearest = isNearestDay && currentWeek && isAfter(date, today) && !isToday && !isTomorrow;

  return (
    <>
      <div
        {...((isToday || isNearest || isTomorrow) && {
          [DataQuerySelector.Today]: '',
        })}
        className={clsx('grid mb-3 pt-1 mt-2', isToday || isTomorrow || isNearest ? 'grid-cols-4' : 'grid-cols-2')}
      >
        {children}
        <span>
          {format(date, locale === Locale.Ru ? 'EEEEEE' : 'EEE', {
            locale: locale === Locale.Ru ? ru : enUS,
          }).toUpperCase()}
        </span>
        {(isToday || isTomorrow || isNearest) && (
          <span className="text-orange text-center col-span-2">
            {t(isNearest ? 'nearest-event' : isToday ? 'today' : 'tomorrow')}
          </span>
        )}
        <span className="text-tg-hint-color text-end">
          <span>
            {format(date, 'd MMMM', {
              locale: locale === Locale.Ru ? ru : enUS,
            })}
          </span>
        </span>
      </div>
    </>
  );
}
