'use client';

import { useTranslations } from 'next-intl';

import CalendarEventCard from '@components/calendar/calendar-event-card';
import EmptyState from '@components/empty-state';
import { BookmarkFolder } from '@components/icon/bold';

import { useFavouritesStore } from '@store/favouritesStore';

import { AppRoute } from '@utils/consts';

export default function Favourites() {
  const t = useTranslations(AppRoute.Favourites);

  const { favourites } = useFavouritesStore();
  const sortedFavourites = [...favourites].sort(
    (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime(),
  );

  if (favourites.length === 0) {
    return <EmptyState icon={<BookmarkFolder />} title={`${t('empty-page-title')} ⭐`} />;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {sortedFavourites.map((favourite, favouriteIdx) => (
        <CalendarEventCard key={favourite.id} event={favourite} ordinal={favouriteIdx + 1} />
      ))}
    </div>
  );
}
