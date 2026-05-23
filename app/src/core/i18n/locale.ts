'use server';

import { cookies } from 'next/headers';

import { DEFAULT_LOCALE, Locale, LOCALE_COOKIE_NAME } from '@core/i18n/config';

export async function getLocale(): Promise<Locale> {
  return ((await cookies()).get(LOCALE_COOKIE_NAME)?.value as Locale) || DEFAULT_LOCALE;
}

export async function setLocale(locale?: Locale) {
  (await cookies()).set(LOCALE_COOKIE_NAME, locale || DEFAULT_LOCALE);
}
