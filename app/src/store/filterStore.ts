import { create } from 'zustand';

interface FilterState {
  selectedCompanies: string[];
}

interface FilterActions {
  toggleCompany: (company: string) => void;
  clearFilters: () => void;
}

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  selectedCompanies: [],
  toggleCompany: (company) =>
    set((state) => ({
      selectedCompanies: state.selectedCompanies.includes(company)
        ? state.selectedCompanies.filter((c) => c !== company)
        : [...state.selectedCompanies, company],
    })),
  clearFilters: () => set({ selectedCompanies: [] }),
}));
