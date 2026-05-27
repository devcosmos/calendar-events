'use client';

import { useTranslations } from 'next-intl';

import CalendarEventCard from '@components/calendar/calendar-event-card';
import { BookmarkFolder } from '@components/icon/bold';

import { useFavouritesStore } from '@store/favouritesStore';

import { AppRoute } from '@utils/consts';

export default function Favourites() {
  const t = useTranslations(AppRoute.Favourites);

  const { favourites } = useFavouritesStore();
  const sortedFavourites = [...favourites].sort(
    (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime(),
  );

  if (favourites.length === 0) {
    return (
      <div className="flex flex-wrap justify-center text-center">
        <div className="bg-tg-section-bg-color rounded-full my-14 size-48 flex items-center justify-center">
          <BookmarkFolder className="!size-24 text-tg-link-color animate-pulse" />
        </div>
        <p className="text-lg whitespace-break-spaces leading-tight mb-7 px-2">{t('empty-page-title')} ⭐</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {sortedFavourites.map((favourite, favouriteIdx) => (
        <CalendarEventCard key={favourite.id} event={favourite} ordinal={favouriteIdx + 1} />
      ))}
    </div>
  );
}
