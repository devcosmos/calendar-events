import { create } from 'zustand';

interface FilterState {
  selectedCompanies: string[];
  selectedCities: string[];
  selectedReservoirTypes: string[];
}

interface FilterActions {
  toggleCompany: (company: string) => void;
  toggleCity: (city: string) => void;
  toggleReservoirType: (type: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  selectedCompanies: [],
  selectedCities: [],
  selectedReservoirTypes: [],
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
  toggleReservoirType: (type) =>
    set((state) => ({
      selectedReservoirTypes: state.selectedReservoirTypes.includes(type)
        ? state.selectedReservoirTypes.filter((t) => t !== type)
        : [...state.selectedReservoirTypes, type],
    })),
  clearFilters: () => set({ selectedCompanies: [], selectedCities: [], selectedReservoirTypes: [] }),
}));
