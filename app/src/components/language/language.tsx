import { getLocale } from '@core/i18n/locale';

import LanguageSelect from '@components/language/language-select';

export default async function Language() {
  const locale = await getLocale();

  return <LanguageSelect locale={locale} />;
}
