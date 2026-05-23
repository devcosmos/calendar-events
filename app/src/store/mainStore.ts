import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { DEFAULT_LOCALE, Locale } from '@core/i18n/config';

import { UserType } from '@utils/consts';

interface State {
  debugMode: boolean;
  userType: UserType;
  locale: Locale;
  hideEmptyDays: boolean;
  hintForSwiping: boolean;
  hasSubmittedPromoGoal: boolean;
}

interface Actions {
  toggleDebugMode: () => void;
  setUserType: (userType: UserType) => void;
  setLocale: (locale: Locale) => void;
  setHideEmptyDays: (show: boolean) => void;
  hideHintForSwiping: () => void;
  setHasSubmittedPromoGoal: () => void;
}

const migrate = (persistedState: unknown): State => {
  const state = persistedState as Partial<State & { lector?: unknown }>;

  return {
    debugMode: false,
    userType: UserType.Undefined,
    locale: state.locale ?? DEFAULT_LOCALE,
    hideEmptyDays: state.hideEmptyDays ?? false,
    hintForSwiping: state.hintForSwiping ?? true,
    hasSubmittedPromoGoal: state.hasSubmittedPromoGoal ?? false,
  };
};

export const useMainStore = create<State & Actions>()(
  persist(
    (set) => ({
      debugMode: false,
      toggleDebugMode: () => set((state) => ({ debugMode: !state.debugMode })),
      userType: UserType.Undefined,
      setUserType: (userType) => set({ userType }),
      locale: DEFAULT_LOCALE,
      setLocale: (locale) => set({ locale }),
      hideEmptyDays: false,
      setHideEmptyDays: (show) => set({ hideEmptyDays: show }),
      hintForSwiping: true,
      hideHintForSwiping: () => set({ hintForSwiping: false }),
      hasSubmittedPromoGoal: false,
      setHasSubmittedPromoGoal: () => set({ hasSubmittedPromoGoal: true }),
    }),
    {
      version: 2,
      name: 'schedule-storage',
      migrate,
    },
  ),
);
