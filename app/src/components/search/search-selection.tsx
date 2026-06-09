'use client';

import { useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { Combobox } from '@headlessui/react';

import EmptyState from '@components/empty-state';
import { Ufo } from '@components/icon/bold';
import SearchResults from '@components/search/seacth-results';
import SearchInput from '@components/search/search-input';

import { useFavouritesStore } from '@store/favouritesStore';

import { AppRoute } from '@utils/consts';
import { cn } from '@utils/helper';
import { SwimEvent } from '@utils/types';

export default function SearchSelection({
  educationEntities,
}: React.PropsWithChildren<{
  educationEntities: SwimEvent[];
}>) {
  const t = useTranslations(AppRoute.Search);

  const pathname = usePathname();
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState<string>(''); // Обновляется с задержкой

  const { searchHistory } = useFavouritesStore();

  const isSearchPage = pathname === AppRoute.Search;
  const isEmptyQuery = query === '';

  const filteredEntities = isEmptyQuery
    ? isSearchPage
      ? searchHistory
      : educationEntities
    : educationEntities.filter((entity) => entity.name.toLowerCase().includes(query.toLowerCase()));

  const isShowList = filteredEntities.length !== 0;

  const handleNavigation = (href: string) => {
    setIsLoading(true);

    inputRef.current?.blur();

    setTimeout(() => {
      document.body.scrollIntoView();
      router.push(href);
    }, 600);
  };

  return (
    <Combobox value={query}>
      <div
        className={cn(
          'w-full flex flex-1 flex-col flex-wrap relative overflow-hidden rounded-2xl',
          isLoading &&
            'before:absolute before:z-10 before:opacity-50 before:inset-0 before:bg-tg-secondary-bg-color pointer-events-none',
        )}
      >
        <div
          className={cn(isShowList ? 'border-b border-b-tg-section-separator-color' : 'overflow-hidden rounded-2xl')}
        >
          <SearchInput inputRef={inputRef} query={query} setQuery={setQuery} />
        </div>
        {isShowList || isEmptyQuery ? (
          <SearchResults
            isEmptyQuery={isEmptyQuery}
            filteredEntities={filteredEntities}
            handleNavigation={handleNavigation}
          />
        ) : (
          <EmptyState icon={<Ufo />} title={t('no-results')} />
        )}
      </div>
    </Combobox>
  );
}
