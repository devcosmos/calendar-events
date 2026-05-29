import { Suspense } from 'react';

import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';

import '@styles/globals.css';

import Metrica from '@core/counter/metrica';
import I18nProvider from '@core/i18n/provider';
import TelegramProvider from '@core/telegram/provider';

import { FRONTEND_URL } from '@utils/api/endpoints';

const rubik = Rubik({ subsets: ['cyrillic'], weight: ['300', '400', '500'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Календарь заплывов',
    default: 'Календарь заплывов – Актуальный календарь соревнований по плаванию',
  },
  description: 'Актуальный календарь заплывов и соревнований по плаванию.',
  metadataBase: new URL(FRONTEND_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={rubik.className}>
        <I18nProvider>
          <TelegramProvider>{children}</TelegramProvider>
        </I18nProvider>
        <Suspense>
          <Metrica />
        </Suspense>
      </body>
    </html>
  );
}
