import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '@utils/types';

interface State {
  user: User | null;
}

interface Actions {
  setUser: (user: User) => void;
}

export const useUserStore = create<State & Actions>()(
  persist(
    (set) => ({
      user: null,
      setUser(user) {
        set({ user });
      },
    }),
    {
      version: 1,
      name: 'schedule-user-storage',
    },
  ),
);
