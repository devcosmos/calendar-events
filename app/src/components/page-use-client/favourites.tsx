'use client';

import { useTranslations } from 'next-intl';

import ActionButton from '@components/button/action-button';
import FavouriteButton from '@components/button/favourite-button';
import { Mark } from '@components/icon/bold';

import { useFavouritesStore } from '@store/favouritesStore';

import { AppRoute, ButtonSize } from '@utils/consts';

export default function Favourites() {
  const t = useTranslations(AppRoute.Favourites);

  const { favourites } = useFavouritesStore();

  if (favourites.length === 0) {
    return (
      <div className="flex flex-wrap justify-center text-center">
        <div className="bg-tg-section-bg-color rounded-full my-14 size-48 flex items-center justify-center">
          <Mark className="!size-24 text-tg-link-color animate-pulse" />
        </div>
        <p className="text-lg whitespace-break-spaces leading-tight mb-7 px-2">{t('empty-page-title')} ⭐</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {favourites
        .sort((a, b) => {
          const isAGroup = /\d/.test(a.name); // Группа содержит цифры
          const isBGroup = /\d/.test(b.name);

          if (isAGroup === isBGroup) {
            return a.name.localeCompare(b.name, 'ru'); // Обычная сортировка, если оба однотипные
          }

          return isAGroup ? 1 : -1; // Сначала идут ФИО, потом группы
        })
        .map((favourite) => (
          <div className="flex flex-nowrap flex-1 gap-2" key={favourite.id}>
            <FavouriteButton size={ButtonSize.Medium} SwimEvent={favourite} />
            <ActionButton className="flex-1 w-auto capitalize" title={favourite.name} href={AppRoute.Home} />
          </div>
        ))}
    </div>
  );
}
