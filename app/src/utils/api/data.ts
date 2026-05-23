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
    return eventsJson as SwimEvent[];
  },
  ['events'],
  { revalidate: 3_600 * 24 },
);
