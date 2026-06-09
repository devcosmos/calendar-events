import { usePathname } from 'next/navigation';

import { useCalendarNavigation } from '@hooks/useCalendarNavigation';

import { AppRoute } from '@utils/consts';

export const useTabBarEvents = () => {
  const pathname = usePathname();
  const isOnCalendar = pathname === AppRoute.Home;

  const { goToCurrentMonth } = useCalendarNavigation();

  const handleNavigationButtonClick = (event: React.MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    if (!isOnCalendar) return;

    event.preventDefault();
    event.nativeEvent.stopImmediatePropagation();

    goToCurrentMonth();
  };

  return { pathname, handleNavigationButtonClick };
};
