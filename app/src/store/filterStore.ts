import { create } from 'zustand';

interface FilterState {
  selectedCompanies: string[];
  selectedCities: string[];
}

interface FilterActions {
  toggleCompany: (company: string) => void;
  toggleCity: (city: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  selectedCompanies: [],
  selectedCities: [],
  toggleCompany: (company) =>
    set((state) => ({
      selectedCompanies: state.selectedCompanies.includes(company)
        ? state.selectedCompanies.filter((c) => c !== company)
        : [...state.selectedCompanies, company],
    })),
  toggleCity: (city) =>
    set((state) => ({
      selectedCities: state.selectedCities.includes(city)
        ? state.selectedCities.filter((c) => c !== city)
        : [...state.selectedCities, city],
    })),
  clearFilters: () => set({ selectedCompanies: [], selectedCities: [] }),
}));
