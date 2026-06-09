import { CalendarMonth, SwimEvent } from '@utils/types';

/**
 * Вертикально скроллит контейнер слайда к элементу с заданным data-атрибутом,
 * центрируя его в области видимости.
 *
 * Использует `scrollTop` напрямую — в обход `scrollIntoView`, который
 * пробрасывается сквозь `overflow:hidden` вьюпорта Embla и ломает
 * горизонтальное положение карусели.
 *
 * @param slideEl — корневой элемент слайда; прямым потомком должен быть
 *   скроллируемый контейнер (`CalendarSliderContainer`).
 * @param selector — имя data-атрибута без скобок, например `"data-today"`.
 * @param behavior — поведение скролла: `"instant"` (по умолчанию) или `"smooth"`.
 * @returns `true`, если скролл выполнен; `false`, если элемент не найден.
 */
export function scrollSlideToSelector(
  slideEl: Element | undefined | null,
  selector: string,
  behavior: ScrollBehavior = 'instant',
): boolean {
  if (!slideEl) return false;

  const container = slideEl.firstElementChild as HTMLElement | null;
  const target = slideEl.querySelector(`[${selector}]`) as HTMLElement | null;

  if (!container || !target) return false;

  container.scrollTo({
    top: target.offsetTop - container.clientHeight / 2 + target.offsetHeight / 2,
    behavior,
  });

  return true;
}

/**
 * Группирует события по месяцам и заполняет все 12 месяцев для каждого года,
 * в котором есть хотя бы одно событие. Даты интерпретируются по московскому времени.
 *
 * @param events — плоский массив событий `SwimEvent`.
 * @returns отсортированный по возрастанию массив `CalendarMonth`; месяцы без событий
 *   включены с пустым массивом `events`.
 */
export function groupEventsByMonth(events: SwimEvent[]): CalendarMonth[] {
  const monthMap = new Map<string, CalendarMonth>();
  const formatter = new Intl.DateTimeFormat('ru-RU', {
    timeZone: 'Europe/Moscow',
    year: 'numeric',
    month: 'numeric',
  });

  events.forEach((event) => {
    const parts = formatter.formatToParts(new Date(event.start_date));
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
 * Находит индекс текущего месяца в массиве `CalendarMonth`.
 * Если текущий месяц отсутствует, возвращает ближайший будущий;
 * если будущих нет — последний элемент массива.
 *
 * @param months — отсортированный массив месяцев, как правило результат `groupEventsByMonth`.
 * @returns числовой индекс в переданном массиве; `0` для пустого массива.
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
