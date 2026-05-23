'use client';

import SearchOption from '@components/search/search-option';

import { SwimEvent } from '@utils/types';

export default function SearchResults({
  isEmptyQuery,
  filteredEntities,
  handleNavigation,
}: React.PropsWithChildren<{
  isEmptyQuery: boolean;
  filteredEntities: SwimEvent[];
  handleNavigation: (href: string) => void;
}>) {
  if (!isEmptyQuery) {
    filteredEntities.sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="relative flex-1">
      <div className="absolute top-0 right-0 bottom-0 left-0">
        <div className="h-full overflow-y-auto overflow-x-hidden scrollbar">
          {filteredEntities.slice(0, 50).map((entity, index) => (
            <SearchOption key={index} isEmptyQuery={isEmptyQuery} entity={entity} handleNavigation={handleNavigation} />
          ))}
        </div>
      </div>
    </div>
  );
}
