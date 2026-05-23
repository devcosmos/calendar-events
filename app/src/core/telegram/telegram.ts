import {
  backButton,
  init,
  initData,
  miniApp,
  retrieveLaunchParams,
  settingsButton,
  themeParams,
  viewport,
} from '@tma.js/sdk';

import { convertHtmlHexStylesToBodyRgb } from '@core/telegram/telegram-helpers';

import { ENDPOINTS } from '@utils/api/endpoints';

export default function TelegramSDK() {
  try {
    // Инициализируем SDK сразу
    init();

    // Получаем параметры запуска для проверки, запущено ли приложение внутри Telegram Mini App
    const launchParams = retrieveLaunchParams();

    // Если приложение не запущено в Telegram, перенаправляем на TMA ссылку
    if (!launchParams) {
      console.warn('Приложение запущено не в Telegram, перенаправление...');
      window.location.href = ENDPOINTS.TG.TMA_LINK;
      return;
    }

    // console.log('Telegram SDK инициализирован', launchParams);

    // Проверяем и монтируем кнопку "Назад"
    if (backButton.isSupported()) {
      backButton.mount();
      // console.log('Back button смонтирована');
    }

    // Проверяем и монтируем кнопку "Настройки"
    if (settingsButton.isSupported()) {
      settingsButton.mount();
      // console.log('Settings button смонтирована');
    }

    // Монтируем параметры темы и привязываем к CSS переменным
    themeParams.mount();
    themeParams.bindCssVars();
    // console.log('Theme params смонтированы');
    // Конвертирует HEX-цвета у тега `<html>` в формат RGB и записывает в `<body>
    convertHtmlHexStylesToBodyRgb();

    // Монтируем miniApp и настраиваем цвета
    miniApp.mount();
    // console.log('MiniApp смонтирован');

    // Получаем вторичный цвет фона из параметров темы
    const secondaryBgColor = themeParams.secondaryBgColor() || '#efeff3';

    // Устанавливаем цвет заголовка мини-приложения
    if (miniApp.setHeaderColor.isAvailable()) {
      miniApp.setHeaderColor(secondaryBgColor);
    }

    // В новой версии используем setBgColor вместо setBackgroundColor
    if (miniApp.setBgColor && miniApp.setBgColor.isAvailable()) {
      miniApp.setBgColor(secondaryBgColor);
    }

    // Монтируем viewport и привязываем к CSS переменным (синхронно в новой версии)
    // console.log('Начинаем монтировать viewport...');
    viewport.mount();
    viewport.bindCssVars();
    // console.log('Viewport смонтирован');

    // Восстанавливаем данные инициализации
    // console.log('Восстанавливаем initData...');
    initData.restore();
    // console.log('InitData восстановлен');

    // console.log('Telegram SDK успешно инициализирован');
    return true; // Возвращаем успешный результат
  } catch (error) {
    // В случае ошибки выводим в консоль
    console.error('Ошибка инициализации Telegram SDK:', error);
    // Не перенаправляем при ошибке в dev режиме для отладки
    if (process.env.NODE_ENV === 'production') {
      window.location.href = ENDPOINTS.TG.TMA_LINK;
    }
    throw error; // Пробрасываем ошибку для catch в provider
  }
}
