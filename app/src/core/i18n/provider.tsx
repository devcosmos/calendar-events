import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { TIME_ZONE } from '@core/i18n/config';

export default async function I18nProvider({ children }: React.PropsWithChildren) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} timeZone={TIME_ZONE}>
      {children}
    </NextIntlClientProvider>
  );
}
