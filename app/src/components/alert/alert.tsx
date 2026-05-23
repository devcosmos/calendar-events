import { useTranslations } from 'next-intl';

import { AppRoute } from '@utils/consts';

export default function Alert({
  route,
  title,
}: React.PropsWithChildren<{
  route: AppRoute;
  title: string;
}>) {
  const t = useTranslations(route);

  return <p className="text-tg-hint-color mt-7 mb-2 whitespace-break-spaces leading-tight">{t(title)}</p>;
}
