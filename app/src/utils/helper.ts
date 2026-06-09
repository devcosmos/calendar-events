/**
 * Форматирует число с существительным в правильной форме для русского языка.
 *
 * @param n — исходное число.
 * @param one — форма для 1 (например, «событие»).
 * @param few — форма для 2–4 (например, «события»).
 * @param many — форма для 5+ и исключений 11–14 (например, «событий»).
 * @returns строка вида `"21 яблоко"`.
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
