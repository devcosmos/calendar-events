import { Metadata } from 'next';
import { Suspense } from 'react';

import PageWrapper from '@components/page-wrapper';
import Search from '@components/search/search';
import { SearchInputSkeleton } from '@components/skeletons';

import { AppRoute, AppRouteTitle } from '@utils/consts';

export const metadata: Metadata = {
  title: AppRouteTitle[AppRoute.Search],
};

export default function Page() {
  return (
    <PageWrapper
      hideTabBar
      hideTitle
      title={AppRoute.Search}
      className="w-full flex flex-col flex-wrap pt-2 pb-3 px-3"
    >
      <Suspense fallback={<SearchInputSkeleton />}>
        <Search />
      </Suspense>
    </PageWrapper>
  );
}
