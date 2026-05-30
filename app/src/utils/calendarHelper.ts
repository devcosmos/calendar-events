import { CalendarMonth, SwimEvent } from '@utils/types';

/**
 * Возвращает число с существительным в правильной форме для русского языка.
 * @param n - Число
 * @param one - Форма для 1 (например, «событие»)
 * @param few - Форма для 2–4 (например, «события»)
 * @param many - Форма для 5+ (например, «событий»)
 * @example plural(21, 'яблоко', 'яблока', 'яблок') → "21 яблоко"
 */
export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 14) return `${n} ${many}`;
  if (mod10 === 1) return `${n} ${one}`;
  if (mod10 >= 2 && mod10 <= 4) return `${n} ${few}`;
  return `${n} ${many}`;
}

/**
 * Группирует события по месяцам, формируя полный список из 12 месяцев для каждого года.
 */
export function groupEventsByMonth(events: SwimEvent[]): CalendarMonth[] {
  const monthMap = new Map<string, CalendarMonth>();
  const formatter = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: 'numeric',
  });

  events.forEach((event) => {
    const parts = formatter.formatToParts(new Date(event.start_at));
    const year = parseInt(parts.find((p) => p.type === 'year')!.value);
    const month = parseInt(parts.find((p) => p.type === 'month')!.value);
    const key = `${year}-${String(month).padStart(2, '0')}`;

    if (!monthMap.has(key)) {
      monthMap.set(key, { year, month, events: [] });
    }
    monthMap.get(key)!.events.push(event);
  });

  // Collect all years present in events and fill in all 12 months for each year
  const years = new Set(Array.from(monthMap.values()).map((m) => m.year));
  years.forEach((year) => {
    for (let month = 1; month <= 12; month++) {
      const key = `${year}-${String(month).padStart(2, '0')}`;
      if (!monthMap.has(key)) {
        monthMap.set(key, { year, month, events: [] });
      }
    }
  });

  return Array.from(monthMap.values()).sort((a, b) => (a.year !== b.year ? a.year - b.year : a.month - b.month));
}

/**
 * Возвращает индекс текущего месяца в массиве CalendarMonth.
 * Если текущий месяц не найден — возвращает индекс ближайшего будущего месяца.
 */
export function getCurrentMonthIndex(months: CalendarMonth[]): number {
  if (months.length === 0) return 0;

  const now = new Date();
  const currYear = now.getFullYear();
  const currMonth = now.getMonth() + 1;

  const exact = months.findIndex((m) => m.year === currYear && m.month === currMonth);
  if (exact >= 0) return exact;

  const future = months.findIndex((m) => m.year > currYear || (m.year === currYear && m.month > currMonth));
  return future >= 0 ? future : months.length - 1;
}
