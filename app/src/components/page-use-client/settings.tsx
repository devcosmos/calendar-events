'use client';

import { useTranslations } from 'next-intl';

import { postEvent } from '@tma.js/sdk-react';

import ActionButton from '@components/button/action-button';
import { Eyes, Globe, Headset } from '@components/icon/light';

import { useMainStore } from '@store/mainStore';

import { ENDPOINTS } from '@utils/api/endpoints';
import { AppRoute } from '@utils/consts';

export default function Settings() {
  const t = useTranslations(AppRoute.Settings);

  const { hideEmptyDays, setHideEmptyDays } = useMainStore();

  const handleSupportClick = () => {
    try {
      // Пробуем открыть через внутренний Telegram линк
      postEvent('web_app_open_tg_link', { path_full: ENDPOINTS.TG.SUPPORT });
    } catch {
      // Если не сработало - используем внешнюю ссылку
      postEvent('web_app_open_link', { url: ENDPOINTS.TG.SUPPORT_FULL });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <ActionButton href={AppRoute.Language} title={t('language')} value={t('current-language-value')}>
        <Globe className="size-6 opacity-50" />
      </ActionButton>
      <ActionButton title={t('hide-empty-days')} enabled={hideEmptyDays} setEnabled={setHideEmptyDays}>
        <Eyes className="size-6 opacity-50" />
      </ActionButton>
      <ActionButton onClick={handleSupportClick} title={t('contact-support')}>
        <Headset className="size-6 opacity-50" />
      </ActionButton>
    </div>
  );
}
