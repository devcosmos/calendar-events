'use client';

import { FilterOptionGroup } from '@components/filter';

import { useFilterStore } from '@store/filterStore';

import { ReservoirType } from '@utils/eventFilter';

interface FilterPanelProps {
  companies: string[];
  cities: string[];
  reservoirTypes: { id: ReservoirType; label: string }[];
}

export function FilterPanel({ companies, cities, reservoirTypes }: FilterPanelProps) {
  const selectedCompanies = useFilterStore((s) => s.selectedCompanies);
  const selectedCities = useFilterStore((s) => s.selectedCities);
  const selectedReservoirTypes = useFilterStore((s) => s.selectedReservoirTypes);
  const toggleCompany = useFilterStore((s) => s.toggleCompany);
  const toggleCity = useFilterStore((s) => s.toggleCity);
  const toggleReservoirType = useFilterStore((s) => s.toggleReservoirType);

  const companyOptions = companies.map((company) => ({ id: company, label: company }));
  const cityOptions = cities.map((city) => ({ id: city, label: city }));
  const reservoirOptions = reservoirTypes.map(({ id, label }) => ({ id, label }));

  return (
    <div className="flex flex-col gap-3 py-4">
      <FilterOptionGroup
        title="Место проведения"
        options={reservoirOptions}
        selectedIds={selectedReservoirTypes}
        onToggle={toggleReservoirType}
      />

      <FilterOptionGroup
        title="Организатор"
        options={companyOptions}
        selectedIds={selectedCompanies}
        onToggle={toggleCompany}
      />

      <FilterOptionGroup
        title="Города"
        options={cityOptions}
        selectedIds={selectedCities}
        onToggle={toggleCity}
        withTopMargin
      />
    </div>
  );
}
