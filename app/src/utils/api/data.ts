import { unstable_cache } from 'next/cache';

import { dbRowToSwimEvent } from '@lib/mappers/swim-event.mapper';
import { createServerClient } from '@lib/supabase/server';

import { SwimEvent, SwimEventRow } from '@utils/types';

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
    const yearFormatter = new Intl.DateTimeFormat('ru-RU', {
      timeZone: 'Europe/Moscow',
      year: 'numeric',
    });

    const currentYear = Number.parseInt(yearFormatter.format(new Date()), 10);
    const from = `${currentYear - 1}-01-01T00:00:00Z`;
    const to = `${currentYear + 1}-12-31T23:59:59Z`;

    try {
      const supabase = createServerClient();
      const { data, error } = await supabase
        .from('swim_events')
        .select<'*', SwimEventRow>('*')
        .gte('start_date', from)
        .lte('start_date', to)
        .order('start_date', { ascending: true })
        .limit(1000);

      if (error) {
        console.error('[getCachedEvents] Supabase error:', error.message);
        return null;
      }

      return (data ?? []).map(dbRowToSwimEvent);
    } catch (err) {
      console.error('[getCachedEvents] Unexpected error:', err instanceof Error ? err.message : err);
      return null;
    }
  },
  ['events'],
  { revalidate: 3_600 * 24 },
);
