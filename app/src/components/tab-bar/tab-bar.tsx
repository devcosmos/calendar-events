'use client';

import { useTranslations } from 'next-intl';

import { Star, User } from '@components/icon/light';
import TapBarButton from '@components/tab-bar/tap-bar-button';

import { useTabBarEvents } from '@hooks/tab-bar/useTabBarEvents';

import { AppRoute, DataQuerySelector, TabBarButton } from '@utils/consts';

export default function TabBar() {
  const t = useTranslations('tab-bar');

  const { pathname, handleNavigationButtonClick } = useTabBarEvents();

  return (
    <div className="flex justify-center p-2 gap-2">
      <TapBarButton
        href={AppRoute.Favourites}
        isActive={pathname === AppRoute.Favourites}
        title={t(TabBarButton.Favourites)}
      >
        <Star className="size-6 mt-0.5" />
      </TapBarButton>
      <TapBarButton
        href={AppRoute.Home}
        title={t(TabBarButton.Today)}
        onClick={(event) => handleNavigationButtonClick(event, DataQuerySelector.Today)}
        isActive={pathname === AppRoute.Home}
      >
        <span className="flex items-center justify-center size-9 bg-tg-link-color text-white p-0 rounded-full leading-none text-lg">
          {new Date().getDate()}
        </span>
      </TapBarButton>

      <TapBarButton href={AppRoute.Settings} title={t(TabBarButton.Account)} isActive={pathname === AppRoute.Settings}>
        <User className="size-6 mt-0.5" />
      </TapBarButton>
    </div>
  );
}
