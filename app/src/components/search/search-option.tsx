'use client';

import { usePathname } from 'next/navigation';

import { ComboboxOption } from '@headlessui/react';
import clsx from 'clsx';

import { ChevronRight, ClockRotateLeft, MagnifyingGlass, Xmark } from '@components/icon/regular';

import { useFavouritesStore } from '@store/favouritesStore';

import { AppRoute } from '@utils/consts';
import { SwimEvent } from '@utils/types';

export default function SearchOption({
  isEmptyQuery,
  entity,
  handleNavigation,
}: React.PropsWithChildren<{
  isEmptyQuery: boolean;
  entity: SwimEvent;
  handleNavigation: (href: string) => void;
}>) {
  const pathname = usePathname();

  const { addSearchHistoryItem, removeSearchHistoryItem } = useFavouritesStore();

  const isSearchPage = pathname === AppRoute.Search;

  const handleClick = () => {
    setTimeout(() => {
      addSearchHistoryItem(entity);
    }, 1000);
    handleNavigation(AppRoute.Home);
  };

  return (
    <div className="flex flex-1 items-center flex-wrap bg-tg-section-bg-color last:rounded-b-2xl group">
      <ComboboxOption
        value={entity.id}
        onClick={handleClick}
        className="flex flex-1 items-center cursor-pointer text-lg py-2.5 px-3 select-none capitalize overflow-hidden"
      >
        {isSearchPage && (
          <div className="w-7 flex-shrink-0">
            {isEmptyQuery ? (
              <ClockRotateLeft className="!size-4 opacity-50" />
            ) : (
              <MagnifyingGlass className="!size-4 opacity-50" />
            )}
          </div>
        )}
        <span className="flex-1 whitespace-nowrap overflow-hidden text-ellipsis">{entity.name}</span>
        {!isEmptyQuery && <ChevronRight className="!size-4" />}
      </ComboboxOption>
      {isEmptyQuery && isSearchPage && (
        <button className="bg-transparent border-0 p-3 flex-shrink-0" onClick={() => removeSearchHistoryItem(entity)}>
          <Xmark className="!size-4" />
        </button>
      )}
      <div
        className={clsx('group-last:hidden w-full h-px bg-tg-section-separator-color', isSearchPage ? 'ms-10' : 'ms-3')}
      />
    </div>
  );
}
