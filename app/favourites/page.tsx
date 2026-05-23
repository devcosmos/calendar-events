import { Metadata } from 'next';

import PageWrapper from '@components/page-wrapper';

import Favourites from '@components/page-use-client/favourites';
import { AppRoute, AppRouteTitle } from '@utils/consts';

export const metadata: Metadata = {
  title: AppRouteTitle[AppRoute.Favourites],
};

export default function Page() {
  return (
    <PageWrapper title={AppRoute.Favourites}>
      <Favourites />
    </PageWrapper>
  );
}
