'use client';

import { useState } from 'react';

import TelegramSDK from '@core/telegram/telegram';

import { useClientOnce } from '@hooks/useClientOnce';

export default function TelegramProvider({ children }: React.PropsWithChildren) {
  const [isReady, setIsReady] = useState(false);

  useClientOnce(() => {
    try {
      TelegramSDK();
      setIsReady(true);
    } catch (error) {
      console.error('TelegramProvider: ошибка инициализации SDK', error);
    }
  });

  if (!isReady) return; // Пока SDK загружается, ничего не рендерим

  return children;
}
