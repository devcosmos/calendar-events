import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DEFAULT_LOCALE, Locale } from '@core/i18n/config';

interface State {
  debugMode: boolean;
  locale: Locale;
  hintForSwiping: boolean;
}

interface Actions {
  toggleDebugMode: () => void;
  setLocale: (locale: Locale) => void;
  hideHintForSwiping: () => void;
}

const migrate = (persistedState: unknown): State => {
  const state = persistedState as Partial<State & { lector?: unknown }>;

  return {
    debugMode: false,
    locale: state.locale ?? DEFAULT_LOCALE,
    hintForSwiping: state.hintForSwiping ?? true,
  };
};

export const useMainStore = create<State & Actions>()(
  persist(
    (set) => ({
      debugMode: false,
      toggleDebugMode: () => set((state) => ({ debugMode: !state.debugMode })),
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => set({ locale }),
      hintForSwiping: true,
      hideHintForSwiping: () => set({ hintForSwiping: false }),
    }),
    {
      version: 2,
      name: 'schedule-storage',
      migrate,
    },
  ),
);
