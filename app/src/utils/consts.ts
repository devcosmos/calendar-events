export const isDev = process.env.NODE_ENV === 'development';

/**
 * Не добавлять роуты, которые могут конфликтовать с бэкенд!
 * Вот список: 'backend/', 'services/', 'api/', 'uploads/'.
 *
 * Это может привести к:
 * - Коллизиям маршрутов (фронтенд и бэкенд будут обрабатывать один и тот же URL)
 * - Проблемам с проксированием запросов (например, если API находится на том же домене)
 * - Неожиданным редиректам или ошибкам при разработке и деплое
 */
export enum AppRoute {
  Home = '/',
  Settings = '/settings/',
  Language = '/settings/language/',
  Favourites = '/favourites/',
  Search = '/search/',
  NotFound = '/not-found/',
}

export const AppRouteTitle: { [key in AppRoute]: string } = {
  [AppRoute.Home]: 'Календарь',
  [AppRoute.Settings]: 'Аккаунт',
  [AppRoute.Language]: 'Выбор языка',
  [AppRoute.Favourites]: 'Закладки',
  [AppRoute.Search]: 'Поиск',
  [AppRoute.NotFound]: 'Страница не найдена',
};

export enum UserType {
  Undefined = 'Undefined',
}

export enum ButtonSize {
  Medium = 'medium',
  Base = 'base',
}

export enum DataQuerySelector {
  CurrentMonthButton = 'data-current-month-button',
  SelectedMonthSlide = 'data-selected-month-slide',
  SelectedEvent = 'data-selected-event',
  Today = 'data-today',
}

export enum TabBarButton {
  Favourites = 'favourites',
  Calendar = 'calendar',
  Account = 'account',
}
