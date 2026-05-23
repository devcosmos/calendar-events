import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { SwimEvent } from '@utils/types';

interface State {
  favourites: SwimEvent[];
  searchHistory: SwimEvent[];
}

interface Actions {
  isFavourite: (item: SwimEvent) => boolean;
  addFavourite: (item: SwimEvent) => void;
  removeFavourite: (item: SwimEvent) => void;
  addSearchHistoryItem: (item: SwimEvent) => void;
  removeSearchHistoryItem: (item: SwimEvent) => void;
}

export const useFavouritesStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      favourites: [],
      isFavourite: (item) => get().favourites.some((element) => element.id === item.id),
      addFavourite: (item) => {
        set((state) => ({
          favourites: state.favourites.some((fav) => fav.id === item.id)
            ? state.favourites
            : [item, ...state.favourites],
        }));
      },
      removeFavourite: (item) => {
        set((state) => ({
          favourites: state.favourites.filter((entity) => entity.id !== item.id),
        }));
      },
      searchHistory: [],
      addSearchHistoryItem: (item) => {
        set((state) => {
          const filteredHistory = state.searchHistory.filter((entity) => entity.id !== item.id);
          return { searchHistory: [item, ...filteredHistory].slice(0, 10) };
        });
      },
      removeSearchHistoryItem: (item) => {
        set((state) => ({
          searchHistory: state.searchHistory.filter((entity) => entity.id !== item.id),
        }));
      },
    }),
    {
      version: 1,
      name: 'favourites-storage',
    },
  ),
);
