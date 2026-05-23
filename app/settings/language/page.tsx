import { Suspense } from 'react';
import { Metadata } from 'next';

import Language from '@components/language/language';
import PageWrapper from '@components/page-wrapper';
import { SelectSkeleton } from '@components/skeletons';

import { AppRoute, AppRouteTitle } from '@utils/consts';

export const metadata: Metadata = {
  title: AppRouteTitle[AppRoute.Language],
};

export default async function Page() {
  return (
    <PageWrapper title={AppRoute.Language} hideTabBar>
      <Suspense fallback={<SelectSkeleton />}>
        <Language />
      </Suspense>
    </PageWrapper>
  );
}
