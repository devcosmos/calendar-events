'use client';

import { useEffect } from 'react';

import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';

import { backButton, settingsButton } from '@tma.js/sdk-react';

import TabBar from '@components/tab-bar/tab-bar';

import { useRapidClick } from '@hooks/useRapidClick';

import { useMainStore } from '@store/mainStore';

import { AppRoute } from '@utils/consts';
import { cn } from '@utils/helper';

export default function PageWrapper({
  children,
  className,
  title,
  hideTitle = false,
  hideTabBar = false,
  back = true,
}: React.PropsWithChildren<{
  className?: string;
  title?: AppRoute;
  hideTitle?: boolean;
  hideTabBar?: boolean;
  back?: boolean;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const t = useTranslations('route-title');

  const { toggleDebugMode } = useMainStore();

  const handleClick = useRapidClick({
    count: 7,
    interval: 2000,
    onSuccess: toggleDebugMode,
  });

  useEffect(() => {
    settingsButton.show();

    return settingsButton.onClick(() => {
      router.push(AppRoute.Settings);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (back && pathname !== AppRoute.Favourites && pathname !== AppRoute.Settings) {
      backButton.show();
    } else {
      backButton.hide();
    }
  }, [back, pathname]);

  useEffect(() => {
    return backButton.onClick(() => {
      router.back();
    });
  }, [router]);

  return (
    <main className="flex flex-col overflow-hidden">
      <div className="relative flex-1">
        <div className="absolute top-0 bottom-0 left-0 right-0 w-full">
          <div className={cn('h-full overflow-auto scrollbar px-3 pb-28', className)}>
            {title && (
              <h1
                onClick={title === AppRoute.Settings ? handleClick : undefined}
                className={hideTitle ? 'sr-only' : 'text-lg mt-6 mb-3'}
              >
                {t(title)}
              </h1>
            )}
            {children}
          </div>
        </div>
      </div>
      {!hideTabBar && <TabBar />}
    </main>
  );
}
