import { unstable_cache } from 'next/cache';

import { readFileSync } from 'fs';
import { join } from 'path';

import { SwimEvent } from '@utils/types';

/**
 * Загружает JSON-файл из локальной директории.
 *
 * Функция загружает и парсит JSON-файл, расположенный в переданном пути.
 *
 * @param path Путь к JSON-файлу, относительно корневой директории проекта. ('public/data/groups.json')
 * @returns Объект с загруженными данными из JSON-файла.
 * @throws null, если файл не найден или произошла ошибка парсинга.
 */
export async function fetchFromLocal<T>(path: string): Promise<T | null> {
  const filePath = join(process.cwd(), path);

  try {
    const data = JSON.parse(readFileSync(filePath, 'utf8')) as T;

    return data;
  } catch (error) {
    console.error(`Ошибка загрузки локального файла: ${path}`, error);

    return null;
  }
}

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
    return await fetchFromLocal<SwimEvent[]>('public/data/events.json');
  },
  ['events'],
  { revalidate: 3_600 * 24 },
);
