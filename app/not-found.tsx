import { Metadata } from 'next';
import { useTranslations } from 'next-intl';

import Button from '@components/button/button';
import PageWrapper from '@components/page-wrapper';

import { AppRoute, AppRouteTitle } from '@utils/consts';

export const metadata: Metadata = {
  title: AppRouteTitle[AppRoute.NotFound],
};

export default function NotFound() {
  const t = useTranslations(AppRoute.NotFound);

  return (
    <PageWrapper hideTitle hideTabBar>
      <div className="h-full flex items-center">
        <div className="flex flex-wrap gap-2 text-center">
          <h1 className="text-8xl w-full text-tg-hint-color">404</h1>
          <h2 className="text-2xl w-full">{t('not-found')}</h2>
          <Button href={AppRoute.Home} addIcon className="mt-9">
            {t('go-homepage')}
          </Button>
        </div>
      </div>
    </PageWrapper>
  );
}
