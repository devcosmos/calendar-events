'use client';

import { useTranslations } from 'next-intl';

import { Calendar, CircleUser, Mark } from '@components/icon/bold';
import { Magnifier } from '@components/icon/outline';
import TapBarButton from '@components/tab-bar/tap-bar-button';

import { useTabBarEvents } from '@hooks/tab-bar/useTabBarEvents';

import { AppRoute, DataQuerySelector, TabBarButton } from '@utils/consts';

export default function TabBar() {
  const t = useTranslations('tab-bar');

  const { pathname, handleNavigationButtonClick } = useTabBarEvents();

  return (
    <div className="flex justify-between p-5 pt-0 gap-2.5 fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-tg-secondary-bg-color/75 to-transparent">
      <div className="bg-tg-section-bg-color/10 flex flex-1 p-1 justify-between backdrop-blur-md rounded-full border border-tg-text-color/10 overflow-hidden">
        <TapBarButton
          href={AppRoute.Favourites}
          isActive={pathname === AppRoute.Favourites}
          title={t(TabBarButton.Favourites)}
        >
          <Mark className="size-6" />
        </TapBarButton>
        <TapBarButton
          href={AppRoute.Home}
          title={t(TabBarButton.Calendar)}
          onClick={(event) => handleNavigationButtonClick(event, DataQuerySelector.Today)}
          isActive={pathname === AppRoute.Home}
        >
          <Calendar className="size-6" />
        </TapBarButton>

        <TapBarButton
          href={AppRoute.Settings}
          title={t(TabBarButton.Account)}
          isActive={pathname === AppRoute.Settings}
        >
          <CircleUser className="size-6" />
        </TapBarButton>
      </div>
      <div className="bg-tg-section-bg-color/10 flex gap-1 p-1 items-center justify-between backdrop-blur-md rounded-full border border-tg-text-color/10 overflow-hidden">
        <TapBarButton href={AppRoute.Search} isActive={pathname === AppRoute.Search}>
          <Magnifier className="size-7 text-white" />
        </TapBarButton>
      </div>
    </div>
  );
}
