'use client';

import { clsx } from 'clsx';

import { useFilterStore } from '@store/filterStore';

import { ReservoirType } from '@utils/eventFilter';

interface FilterPanelProps {
  companies: string[];
  cities: string[];
  reservoirTypes: Array<{ id: ReservoirType; label: string }>;
}

export default function FilterPanel({ companies, cities, reservoirTypes }: FilterPanelProps) {
  const selectedCompanies = useFilterStore((s) => s.selectedCompanies);
  const selectedCities = useFilterStore((s) => s.selectedCities);
  const selectedReservoirTypes = useFilterStore((s) => s.selectedReservoirTypes);
  const toggleCompany = useFilterStore((s) => s.toggleCompany);
  const toggleCity = useFilterStore((s) => s.toggleCity);
  const toggleReservoirType = useFilterStore((s) => s.toggleReservoirType);

  return (
    <div className="flex flex-col gap-3 py-4">
      <div className="flex items-center justify-between">
        <span className="text-lg mt-1">Место проведения</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {reservoirTypes.map(({ id, label }) => {
          const isSelected = selectedReservoirTypes.includes(id);
          return (
            <button
              key={id}
              onClick={() => toggleReservoirType(id)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-sm border text-nowrap transition-colors',
                isSelected
                  ? 'bg-tg-button-color text-tg-button-text-color border-tg-button-color'
                  : 'bg-tg-section-bg-color text-tg-text-color border-tg-text-color/10',
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg mt-1">Компании</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {companies.map((company) => {
          const isSelected = selectedCompanies.includes(company);
          return (
            <button
              key={company}
              onClick={() => toggleCompany(company)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-sm border text-nowrap transition-colors',
                isSelected
                  ? 'bg-tg-button-color text-tg-button-text-color border-tg-button-color'
                  : 'bg-tg-section-bg-color text-tg-text-color border-tg-text-color/10',
              )}
            >
              {company}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-lg mt-1">Города</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {cities.map((city) => {
          const isSelected = selectedCities.includes(city);
          return (
            <button
              key={city}
              onClick={() => toggleCity(city)}
              className={clsx(
                'px-3 py-1.5 rounded-full text-sm border text-nowrap transition-colors',
                isSelected
                  ? 'bg-tg-button-color text-tg-button-text-color border-tg-button-color'
                  : 'bg-tg-section-bg-color text-tg-text-color border-tg-text-color/10',
              )}
            >
              {city}
            </button>
          );
        })}
      </div>
    </div>
  );
}
