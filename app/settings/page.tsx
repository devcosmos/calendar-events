import { Metadata } from 'next';

import Settings from '@components/page-use-client/settings';
import PageWrapper from '@components/page-wrapper';

import { AppRoute, AppRouteTitle } from '@utils/consts';

export const metadata: Metadata = {
  title: AppRouteTitle[AppRoute.Settings],
};

export default function Page() {
  return (
    <PageWrapper title={AppRoute.Settings}>
      <Settings />
    </PageWrapper>
  );
}
