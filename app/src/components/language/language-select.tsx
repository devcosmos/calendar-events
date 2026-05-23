'use client';

import { useState } from 'react';

import { postEvent } from '@tma.js/sdk-react';

import Alert from '@components/alert/alert';
import Select from '@components/select/select';

import { DEFAULT_LOCALE, Locale } from '@core/i18n/config';
import { setLocale } from '@core/i18n/locale';

import { AppRoute } from '@utils/consts';

export default function LanguageSelect({
  locale,
}: React.PropsWithChildren<{
  locale: Locale;
}>) {
  const [language, setLanguage] = useState<Locale>(locale || DEFAULT_LOCALE);

  return (
    <>
      <Select
        onChange={(event) => {
          postEvent('web_app_trigger_haptic_feedback', { type: 'selection_change' });
          setLanguage(event.target.value as Locale);
          setLocale(event.target.value as Locale);
        }}
        value={language}
      >
        <option value={Locale.Ru}>Русский</option>
        <option value={Locale.En}>English</option>
      </Select>
      <Alert route={AppRoute.Language} title={'notice'} />
    </>
  );
}
