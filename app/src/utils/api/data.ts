import { unstable_cache } from 'next/cache';

import eventsJson from '@public/data/events.json';

import { SwimEvent } from '@utils/types';

/**
 * Выполняет HTTP-запрос к переданному URL и возвращает данные.
 *
 * Функция отправляет GET-запрос по указанному URL, проверяет статус ответа
 * и, если запрос успешен, парсит данные в формате JSON.
 *
 * @param url Строка с URL, по которому выполняется запрос.
 * @returns Объект с загруженными данными, если запрос успешен.
 * @throws null, если HTTP-запрос не удался или сервер вернул статус ошибки.
 */
export async function fetchFromUrl<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Ошибка запроса. Код: ${response.status}, URL: ${url}`);

      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error('Ошибка при загрузке данных с URL:', url, error);

    return null;
  }
}

export const getCachedEvents = unstable_cache(
  async (): Promise<SwimEvent[] | null> => {
    const allEvents = eventsJson as SwimEvent[];
    const yearFormatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Europe/Moscow',
      year: 'numeric',
    });

    const currentYear = Number.parseInt(yearFormatter.format(new Date()), 10);
    const minYear = currentYear - 1;
    const maxYear = currentYear + 1;

    return allEvents
      .filter((event) => {
        const eventYear = Number.parseInt(yearFormatter.format(new Date(event.start_date)), 10);
        return Number.isFinite(eventYear) && eventYear >= minYear && eventYear <= maxYear;
      })
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  },
  ['events'],
  { revalidate: 3_600 * 24 },
);
