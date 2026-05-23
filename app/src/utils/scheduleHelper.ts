import { format, parse } from 'date-fns';
import { enUS, ru } from 'date-fns/locale';

import { Locale } from '@core/i18n/config';

/**
 * Форматирует дату в заданный формат с учётом локали.
 *
 * Функция принимает дату в строковом формате "dd.MM.yyyy" и преобразует её в указанный формат.
 *
 * @param date Дата в формате строки "dd.MM.yyyy".
 * @param formatStr Шаблон форматирования (например, 'd MMM' или 'd MMMM yyyy').
 * @param locale Локаль для форматирования (Locale.Ru или Locale.En).
 * @returns Отформатированная строка даты.
 */
function getFormattedDate(date: string, formatStr: string, locale: Locale): string {
  return format(parse(date, 'dd.MM.yyyy', new Date(), { locale: ru }), formatStr, {
    locale: locale === Locale.Ru ? ru : enUS,
  });
}

/**
 * Форматирует интервал дат в удобочитаемый вид с учётом локали.
 *
 * Функция принимает две даты в формате "dd.MM.yyyy" и возвращает диапазон дат, убирая повторение месяца,
 * если он одинаковый для начальной и конечной даты.
 *
 * @param start Начальная дата в формате "dd.MM.yyyy".
 * @param end Конечная дата в формате "dd.MM.yyyy".
 * @param locale Локаль для форматирования (Locale.Ru или Locale.En).
 * @returns Строка диапазона дат (например, "10–15 февраля" или "March 10–15").
 */
export function getFormattedIntervalDate(start: string, end: string, locale: Locale): string {
  const formattedStart = getFormattedDate(start, 'd MMM', locale);
  const formattedEnd = getFormattedDate(end, 'd MMM', locale);

  // Если конечная дата уже содержит месяц начальной, удаляем его из первой
  return formattedEnd.includes(formattedStart.split(' ')[1])
    ? `${formattedStart.split(' ')[0]}—${getFormattedDate(end, 'd MMMM', locale)}`
    : `${formattedStart} – ${formattedEnd}`;
}
