'use client';

import { useState } from 'react';

import clsx from 'clsx';

import { Calendar } from '@components/icon/bold';

interface ExportCalendarButtonProps {
  group?: string;
  lectorId?: string;
  weekNumber: number;
  className?: string;
}

/**
 * Компонент кнопки для экспорта расписания в формате ICS (iCalendar).
 * Поддерживает экспорт для групп и преподавателей.
 *
 * @param group - Название группы (для студентов)
 * @param lectorId - ID преподавателя (для преподавателей)
 * @param weekNumber - Номер недели для экспорта
 * @param className - Дополнительные CSS классы
 */
export default function ExportCalendarButton({ group, lectorId, weekNumber, className }: ExportCalendarButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      // Формируем URL для API запроса
      const params = new URLSearchParams();

      if (group) {
        params.append('group', group);
      } else if (lectorId) {
        params.append('lector', lectorId);
      }

      params.append('week', weekNumber.toString());

      // Next.js автоматически добавит basePath
      const url = `/next-api/calendar/export/?${params.toString()}`;

      // Выполняем запрос
      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при экспорте календаря');
      }

      // Получаем ICS файл как blob
      const blob = await response.blob();

      // Извлекаем имя файла из заголовков
      const contentDisposition = response.headers.get('Content-Disposition');
      let fileName = `schedule_week_${weekNumber}.ics`;

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (fileNameMatch) {
          fileName = fileNameMatch[1];
        }
      }

      // Создаем временную ссылку для скачивания
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Освобождаем память
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Ошибка при экспорте календаря:', err);
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setIsExporting(false);
    }
  };

  const buttonClasses = clsx(
    'w-full py-2 px-4 bg-tg-button-color flex items-center justify-center gap-2',
    'text-lg leading-normal text-tg-button-text-color',
    'border rounded-lg border-tg-button-color',
    'transition-opacity',
    isExporting && 'opacity-50 cursor-not-allowed',
    className,
  );

  return (
    <div className="w-full">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={buttonClasses}
        aria-label="Экспорт расписания в календарь"
      >
        <Calendar className="!size-5 !fill-tg-button-text-color" />
        <span>{isExporting ? 'Экспорт...' : 'Экспорт в календарь'}</span>
      </button>

      {error && <p className="mt-2 text-sm text-red-500 text-center">{error}</p>}

      {!error && !isExporting && (
        <p className="mt-2 text-xs text-tg-hint-color text-center">Экспорт расписания {weekNumber}-й недели</p>
      )}
    </div>
  );
}
