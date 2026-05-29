'use client';

import { useTranslations } from 'next-intl';

import { FilterOptionGroup } from '@components/filter';

import { useFilterStore } from '@store/filterStore';

import { AbroadFilter, ReservoirType } from '@utils/eventFilter';

interface FilterPanelProps {
  companies: string[];
  cities: string[];
  reservoirTypes: { id: ReservoirType; label: string }[];
}

export function FilterPanel({ companies, cities, reservoirTypes }: FilterPanelProps) {
  const t = useTranslations('calendar');

  const selectedCompanies = useFilterStore((s) => s.selectedCompanies);
  const selectedCities = useFilterStore((s) => s.selectedCities);
  const selectedReservoirTypes = useFilterStore((s) => s.selectedReservoirTypes);
  const selectedAbroadFilters = useFilterStore((s) => s.selectedAbroadFilters);
  const toggleCompany = useFilterStore((s) => s.toggleCompany);
  const toggleCity = useFilterStore((s) => s.toggleCity);
  const toggleReservoirType = useFilterStore((s) => s.toggleReservoirType);
  const toggleAbroadFilter = useFilterStore((s) => s.toggleAbroadFilter);

  const companyOptions = companies.map((company) => ({ id: company, label: company }));
  const cityOptions = cities.map((city) => ({ id: city, label: city }));
  const reservoirOptions = reservoirTypes.map(({ id, label }) => ({ id, label }));
  const abroadOptions = [
    { id: AbroadFilter.Russia, label: t('filters.options.country.russia') },
    { id: AbroadFilter.Abroad, label: t('filters.options.country.abroad') },
  ];

  return (
    <div className="flex flex-col gap-3 py-4">
      <FilterOptionGroup
        title={t('filters.groups.waterType')}
        options={reservoirOptions}
        selectedIds={selectedReservoirTypes}
        onToggle={toggleReservoirType}
      />

      <FilterOptionGroup
        title={t('filters.groups.organizer')}
        options={companyOptions}
        selectedIds={selectedCompanies}
        onToggle={toggleCompany}
      />

      <FilterOptionGroup
        title={t('filters.groups.country')}
        options={abroadOptions}
        selectedIds={selectedAbroadFilters}
        onToggle={toggleAbroadFilter}
      />

      <FilterOptionGroup
        title={t('filters.groups.city')}
        options={cityOptions}
        selectedIds={selectedCities}
        onToggle={toggleCity}
        withTopMargin
      />
    </div>
  );
}
